
create type public.app_role as enum ('requester','donor','provider','volunteer','ngo','reviewer','admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('reviewer','admin'))
$$;

create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff(auth.uid()));
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "admin manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.claim_role(_role public.app_role)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if _role in ('reviewer','admin') then raise exception 'This role can only be assigned by an administrator'; end if;
  insert into public.user_roles(user_id, role) values (auth.uid(), _role) on conflict do nothing;
end $$;
revoke execute on function public.claim_role(public.app_role) from anon;
grant execute on function public.claim_role(public.app_role) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.notifications(user_id, created_at desc);
grant select, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "own notifications read" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "own notifications update" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own notifications delete" on public.notifications for delete to authenticated using (user_id = auth.uid());

create table public.notification_preferences (
  user_id uuid primary key,
  in_app boolean not null default true,
  email boolean not null default false,
  sms boolean not null default false,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.notification_preferences to authenticated;
grant all on public.notification_preferences to service_role;
alter table public.notification_preferences enable row level security;
create policy "own prefs" on public.notification_preferences for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.notify(_user uuid, _title text, _body text, _link text)
returns void language sql security definer set search_path = public as $$
  insert into public.notifications(user_id, title, body, link) values (_user, _title, _body, _link);
$$;
revoke execute on function public.notify(uuid,text,text,text) from public, anon, authenticated;

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);
grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "staff read audit" on public.audit_logs for select to authenticated using (public.is_staff(auth.uid()));

create table public.need_reports (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('NR-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  user_id uuid not null default auth.uid(),
  need_type text not null,
  people_count int not null check (people_count between 1 and 10000),
  general_location text not null,
  address text,
  latitude double precision,
  longitude double precision,
  requested_time timestamptz,
  dietary text,
  description text,
  contact_phone text,
  consent boolean not null default false,
  status text not null default 'submitted' check (status in ('draft','submitted','under_review','verified','matched','assistance_scheduled','fulfilled','rejected','cancelled')),
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.need_reports(user_id);
create index on public.need_reports(status);
grant select, insert, update on public.need_reports to authenticated;
grant all on public.need_reports to service_role;
alter table public.need_reports enable row level security;
create policy "own or staff read reports" on public.need_reports for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "create own report" on public.need_reports for insert to authenticated with check (user_id = auth.uid() and consent = true and status in ('draft','submitted'));
create policy "own or staff update report" on public.need_reports for update to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid())) with check (user_id = auth.uid() or public.is_staff(auth.uid()));

create table public.need_report_evidence (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.need_reports(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  file_path text not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.need_report_evidence to authenticated;
grant all on public.need_report_evidence to service_role;
alter table public.need_report_evidence enable row level security;
create policy "evidence read" on public.need_report_evidence for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "evidence insert" on public.need_report_evidence for insert to authenticated with check (user_id = auth.uid() and exists (select 1 from public.need_reports r where r.id = report_id and r.user_id = auth.uid()));

create table public.review_notes (
  id uuid primary key default gen_random_uuid(),
  entity text not null check (entity in ('need_report','food_listing','food_provider')),
  entity_id uuid not null,
  reviewer_id uuid not null default auth.uid(),
  decision text,
  notes text,
  created_at timestamptz not null default now()
);
grant select, insert on public.review_notes to authenticated;
grant all on public.review_notes to service_role;
alter table public.review_notes enable row level security;
create policy "staff notes" on public.review_notes for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff notes insert" on public.review_notes for insert to authenticated with check (public.is_staff(auth.uid()) and reviewer_id = auth.uid());

create table public.food_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid(),
  name text not null,
  provider_type text not null default 'restaurant',
  address text not null,
  city text,
  phone text,
  fssai_license text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.food_providers to authenticated;
grant all on public.food_providers to service_role;
alter table public.food_providers enable row level security;
create policy "provider read" on public.food_providers for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "provider insert" on public.food_providers for insert to authenticated with check (user_id = auth.uid() and status = 'pending');
create policy "provider update" on public.food_providers for update to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid())) with check (user_id = auth.uid() or public.is_staff(auth.uid()));

create table public.food_listings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('FL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  provider_id uuid not null references public.food_providers(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  food_name text not null,
  description text,
  category text not null,
  quantity numeric not null check (quantity > 0),
  unit text not null,
  diet text not null check (diet in ('veg','non_veg','vegan','egg')),
  preparation_details text,
  prepared_at timestamptz,
  storage_details text,
  allergens text,
  pickup_address text not null,
  pickup_deadline timestamptz not null,
  contact_phone text,
  handling_instructions text,
  image_path text,
  latitude double precision,
  longitude double precision,
  status text not null default 'submitted' check (status in ('draft','submitted','under_review','approved','matched','pickup_assigned','collected','delivered','expired','rejected','cancelled')),
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.food_listings(status, pickup_deadline);
grant select, insert, update on public.food_listings to authenticated;
grant all on public.food_listings to service_role;
alter table public.food_listings enable row level security;
create policy "listing read" on public.food_listings for select to authenticated using (
  user_id = auth.uid() or public.is_staff(auth.uid())
  or (public.has_role(auth.uid(),'volunteer') and status = 'approved' and pickup_deadline > now())
);
create policy "listing insert" on public.food_listings for insert to authenticated with check (
  user_id = auth.uid() and status in ('draft','submitted')
  and exists (select 1 from public.food_providers p where p.id = provider_id and p.user_id = auth.uid() and p.status = 'approved')
);
create policy "listing update" on public.food_listings for update to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid())) with check (user_id = auth.uid() or public.is_staff(auth.uid()));

create table public.food_safety_reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.food_listings(id) on delete cascade,
  reviewer_id uuid not null default auth.uid(),
  decision text not null check (decision in ('approved','rejected','needs_info')),
  temperature_ok boolean,
  packaging_ok boolean,
  within_safe_window boolean,
  allergens_declared boolean,
  notes text,
  created_at timestamptz not null default now()
);
grant select, insert on public.food_safety_reviews to authenticated;
grant all on public.food_safety_reviews to service_role;
alter table public.food_safety_reviews enable row level security;
create policy "safety read" on public.food_safety_reviews for select to authenticated using (public.is_staff(auth.uid()));
create policy "safety insert" on public.food_safety_reviews for insert to authenticated with check (public.is_staff(auth.uid()) and reviewer_id = auth.uid());

create table public.volunteer_profiles (
  user_id uuid primary key default auth.uid(),
  available boolean not null default false,
  service_area text,
  vehicle text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.volunteer_profiles to authenticated;
grant all on public.volunteer_profiles to service_role;
alter table public.volunteer_profiles enable row level security;
create policy "vol read" on public.volunteer_profiles for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "vol insert" on public.volunteer_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "vol update" on public.volunteer_profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.delivery_assignments (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('DA-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  listing_id uuid references public.food_listings(id) on delete set null,
  need_report_id uuid references public.need_reports(id) on delete set null,
  volunteer_id uuid,
  status text not null default 'awaiting_assignment' check (status in ('awaiting_assignment','assigned','accepted','declined','en_route_pickup','arrived_pickup','collected','en_route_destination','delivered','delayed','failed','cancelled')),
  confirmation_code text not null default lpad((floor(random()*1000000))::int::text, 6, '0'),
  destination_note text,
  created_by uuid default auth.uid(),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.delivery_assignments(volunteer_id);
create index on public.delivery_assignments(status);
grant select, insert, update on public.delivery_assignments to authenticated;
grant all on public.delivery_assignments to service_role;
alter table public.delivery_assignments enable row level security;
create policy "staff all assignments" on public.delivery_assignments for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.delivery_events (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.delivery_assignments(id) on delete cascade,
  actor_id uuid,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);
grant select on public.delivery_events to authenticated;
grant all on public.delivery_events to service_role;
alter table public.delivery_events enable row level security;
create policy "events read" on public.delivery_events for select to authenticated using (
  public.is_staff(auth.uid()) or exists (select 1 from public.delivery_assignments a where a.id = assignment_id and a.volunteer_id = auth.uid())
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('DN-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  user_id uuid not null default auth.uid(),
  amount_inr int not null check (amount_inr between 10 and 1000000),
  meals int,
  campaign text,
  donor_name text not null,
  contact_preference text,
  mode text not null default 'demo' check (mode in ('demo','live')),
  status text not null default 'demo_recorded' check (status in ('demo_recorded','pending','verified','failed','refunded')),
  receipt_number text unique,
  created_at timestamptz not null default now()
);
grant select, insert on public.donations to authenticated;
grant all on public.donations to service_role;
alter table public.donations enable row level security;
create policy "own donations read" on public.donations for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "demo donation insert" on public.donations for insert to authenticated with check (user_id = auth.uid() and mode = 'demo' and status = 'demo_recorded' and receipt_number is null);

create or replace function public.guard_need_report() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff(auth.uid()) then
    if new.status is distinct from old.status and not (
      (old.status = 'draft' and new.status in ('submitted','cancelled')) or
      (old.status in ('submitted','under_review','verified') and new.status = 'cancelled')
    ) then raise exception 'You are not allowed to change this report status'; end if;
    if new.rejection_reason is distinct from old.rejection_reason or new.user_id <> old.user_id then
      raise exception 'Not allowed'; end if;
  end if;
  new.updated_at = now();
  if new.status is distinct from old.status then
    insert into public.audit_logs(actor_id, action, entity, entity_id, details) values (auth.uid(), 'status_change', 'need_report', new.id, jsonb_build_object('from', old.status, 'to', new.status));
    perform public.notify(new.user_id, 'Report ' || new.reference || ' is now ' || replace(new.status,'_',' '), new.rejection_reason, '/app/reports');
  end if;
  return new;
end $$;
create trigger need_reports_guard before update on public.need_reports for each row execute function public.guard_need_report();

create or replace function public.after_need_report_insert() returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.notify(new.user_id, 'Report ' || new.reference || ' submitted', 'Our team will review it shortly.', '/app/reports');
  insert into public.audit_logs(actor_id, action, entity, entity_id) values (auth.uid(), 'created', 'need_report', new.id);
  return new;
end $$;
create trigger need_reports_after_insert after insert on public.need_reports for each row execute function public.after_need_report_insert();

create or replace function public.guard_listing() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff(auth.uid()) then
    if new.status is distinct from old.status and not (
      (old.status = 'draft' and new.status in ('submitted','cancelled')) or
      (old.status in ('submitted','under_review','approved') and new.status = 'cancelled')
    ) then raise exception 'You are not allowed to change this listing status'; end if;
    if old.status not in ('draft','submitted') and new.status = old.status then
      raise exception 'Listings cannot be edited after review has started'; end if;
    if new.rejection_reason is distinct from old.rejection_reason or new.user_id <> old.user_id or new.provider_id <> old.provider_id then
      raise exception 'Not allowed'; end if;
  end if;
  new.updated_at = now();
  if new.status is distinct from old.status then
    insert into public.audit_logs(actor_id, action, entity, entity_id, details) values (auth.uid(), 'status_change', 'food_listing', new.id, jsonb_build_object('from', old.status, 'to', new.status));
    perform public.notify(new.user_id, 'Listing ' || new.food_name || ' is now ' || replace(new.status,'_',' '), new.rejection_reason, '/app/provider');
  end if;
  return new;
end $$;
create trigger food_listings_guard before update on public.food_listings for each row execute function public.guard_listing();

create or replace function public.guard_provider() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff(auth.uid()) and new.status is distinct from old.status then
    raise exception 'Only reviewers can change provider approval'; end if;
  new.updated_at = now();
  if new.status is distinct from old.status then
    perform public.notify(new.user_id, 'Provider account ' || new.status, null, '/app/provider');
    insert into public.audit_logs(actor_id, action, entity, entity_id, details) values (auth.uid(), 'status_change', 'food_provider', new.id, jsonb_build_object('to', new.status));
  end if;
  return new;
end $$;
create trigger food_providers_guard before update on public.food_providers for each row execute function public.guard_provider();

create or replace function public.after_assignment_change() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status or new.volunteer_id is distinct from old.volunteer_id then
    insert into public.delivery_events(assignment_id, actor_id, status) values (new.id, auth.uid(), new.status);
    if new.volunteer_id is not null and (tg_op = 'INSERT' or new.volunteer_id is distinct from old.volunteer_id) then
      perform public.notify(new.volunteer_id, 'New delivery assignment ' || new.reference, 'Open your volunteer dashboard to accept or decline.', '/app/volunteer');
    end if;
  end if;
  return new;
end $$;
create trigger delivery_assignments_after after insert or update on public.delivery_assignments for each row execute function public.after_assignment_change();
create trigger delivery_assignments_touch before update on public.delivery_assignments for each row execute function public.touch_updated_at();

create or replace function public.get_my_assignments()
returns table (
  id uuid, reference text, status text, created_at timestamptz, updated_at timestamptz, delivered_at timestamptz,
  food_name text, quantity numeric, unit text, pickup_address text, pickup_deadline timestamptz, provider_contact text, handling_instructions text,
  destination_location text, destination_address text, destination_people int, destination_note text
) language sql stable security definer set search_path = public as $$
  select a.id, a.reference, a.status, a.created_at, a.updated_at, a.delivered_at,
    l.food_name, l.quantity, l.unit, l.pickup_address, l.pickup_deadline, l.contact_phone, l.handling_instructions,
    r.general_location,
    case when a.status in ('accepted','en_route_pickup','arrived_pickup','collected','en_route_destination','delayed') then r.address else null end,
    r.people_count, a.destination_note
  from public.delivery_assignments a
  left join public.food_listings l on l.id = a.listing_id
  left join public.need_reports r on r.id = a.need_report_id
  where a.volunteer_id = auth.uid()
  order by a.created_at desc
$$;
revoke execute on function public.get_my_assignments() from anon;
grant execute on function public.get_my_assignments() to authenticated;

create or replace function public.update_delivery_status(_assignment uuid, _status text, _note text default null, _code text default null)
returns void language plpgsql security definer set search_path = public as $$
declare a public.delivery_assignments;
begin
  select * into a from public.delivery_assignments where id = _assignment for update;
  if a.id is null or a.volunteer_id is distinct from auth.uid() then raise exception 'Assignment not found'; end if;
  if not (
    (a.status = 'assigned' and _status in ('accepted','declined')) or
    (a.status = 'accepted' and _status in ('en_route_pickup','delayed')) or
    (a.status = 'en_route_pickup' and _status in ('arrived_pickup','delayed','failed')) or
    (a.status = 'arrived_pickup' and _status in ('collected','failed','delayed')) or
    (a.status = 'collected' and _status in ('en_route_destination','delayed')) or
    (a.status = 'en_route_destination' and _status in ('delivered','delayed','failed')) or
    (a.status = 'delayed' and _status in ('en_route_pickup','en_route_destination','failed'))
  ) then raise exception 'That status change is not allowed from %', a.status; end if;
  if _status = 'delivered' and (_code is null or _code <> a.confirmation_code) then
    raise exception 'Incorrect handoff confirmation code'; end if;
  update public.delivery_assignments set status = _status, delivered_at = case when _status='delivered' then now() else delivered_at end,
    volunteer_id = case when _status = 'declined' then null else volunteer_id end
  where id = _assignment;
  if _note is not null and length(_note) > 0 then
    insert into public.delivery_events(assignment_id, actor_id, status, note) values (_assignment, auth.uid(), _status, left(_note, 1000));
  end if;
  if _status = 'collected' and a.listing_id is not null then update public.food_listings set status='collected' where id = a.listing_id; end if;
  if _status = 'delivered' then
    if a.listing_id is not null then update public.food_listings set status='delivered' where id = a.listing_id; end if;
    if a.need_report_id is not null then update public.need_reports set status='fulfilled' where id = a.need_report_id; end if;
  end if;
end $$;
revoke execute on function public.update_delivery_status(uuid,text,text,text) from anon;
grant execute on function public.update_delivery_status(uuid,text,text,text) to authenticated;

create or replace function public.get_impact_stats()
returns table (deliveries_completed bigint, reports_fulfilled bigint, people_supported bigint, active_volunteers bigint)
language sql stable security definer set search_path = public as $$
  select
    (select count(*) from public.delivery_assignments where status = 'delivered'),
    (select count(*) from public.need_reports where status = 'fulfilled'),
    (select coalesce(sum(people_count),0) from public.need_reports where status = 'fulfilled'),
    (select count(*) from public.volunteer_profiles where available)
$$;
grant execute on function public.get_impact_stats() to anon, authenticated;

create policy "evidence upload own" on storage.objects for insert to authenticated with check (bucket_id in ('evidence','listing-images') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "evidence read own or staff" on storage.objects for select to authenticated using (bucket_id in ('evidence','listing-images') and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff(auth.uid())));
