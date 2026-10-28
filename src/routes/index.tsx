import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardList, HandHeart, Truck, Store, ShieldCheck, Users, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-meals.jpg";
import { MEAL_COST_INR, formatINR } from "@/lib/status";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnnaSetu — Good food should reach those who need it" },
      { name: "description", content: "Report a food need, sponsor a meal, list surplus food or volunteer. AnnaSetu bridges surplus food and hunger across India." },
      { property: "og:title", content: "AnnaSetu — Good food should reach those who need it" },
      { property: "og:description", content: "Food rescue, hunger relief and meal sponsorship for India." },
    ],
  }),
  component: Home,
});

const STEPS = [
  { icon: ClipboardList, title: "Report or Share", body: "People or authorised community members report a food need, while restaurants list available surplus food." },
  { icon: Search, title: "Review and Match", body: "Authorised team members review reports and food listings before coordinating assistance." },
  { icon: Truck, title: "Collect and Deliver", body: "Volunteers or approved partners coordinate pickup and delivery, recording the outcome." },
];

const WAYS = [
  { icon: ClipboardList, title: "Report a need", body: "Tell us where food is needed. Reports are reviewed by a person before anything is shared.", to: "/app/report" as const },
  { icon: HandHeart, title: "Sponsor meals", body: `Fund cooked meals for families and shelters. About ${formatINR(MEAL_COST_INR)} covers one meal.`, to: "/donate" as const },
  { icon: Store, title: "Share surplus food", body: "Restaurants, caterers and hostels can list safe surplus food for pickup.", to: "/food-rescue" as const },
  { icon: Users, title: "Volunteer", body: "Pick up and deliver approved food in your neighbourhood when you have time.", to: "/volunteer" as const },
  { icon: Building2, title: "Partner as an NGO", body: "Community organisations can coordinate distribution through AnnaSetu.", to: "/about" as const },
];

const FAQ = [
  ["Who can report a food need?", "Anyone — an individual, a neighbour, or a community worker. Every report is reviewed by an authorised team member before it is acted on."],
  ["How do you keep donated food safe?", "Providers declare preparation time, storage and allergens. A food-safety reviewer checks each listing before it can be matched, and listings expire automatically at their pickup deadline."],
  ["Are online donations live?", "Not yet. Payments are in demonstration mode until a verified payment provider is connected. No money is collected and no receipts are issued in demo mode."],
  ["Is my location shared publicly?", "No. Precise addresses of people receiving food are visible only to reviewers and the volunteer assigned to that delivery."],
];

function Impact() {
  const { data, isLoading } = useQuery({
    queryKey: ["impact"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_impact_stats");
      if (error) throw error;
      return data?.[0];
    },
  });
  const hasData = data && (Number(data.deliveries_completed) > 0 || Number(data.reports_fulfilled) > 0);
  return (
    <section className="container-page mt-24">
      <div className="rounded-2xl border bg-card p-8 shadow-[var(--shadow-card)] md:p-12">
        <p className="eyebrow">Verified impact</p>
        <h2 className="mt-2 text-3xl font-semibold">Only confirmed outcomes are counted</h2>
        {isLoading ? (
          <div className="mt-8 h-20 animate-pulse rounded-lg bg-muted" />
        ) : hasData ? (
          <dl className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["Deliveries completed", data!.deliveries_completed],
              ["Requests fulfilled", data!.reports_fulfilled],
              ["People supported", data!.people_supported],
              ["Volunteers available now", data!.active_volunteers],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="text-sm text-muted-foreground">{k}</dt>
                <dd className="mt-1 font-display text-4xl font-semibold text-primary">{Number(v).toLocaleString("en-IN")}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 max-w-2xl text-muted-foreground">
            AnnaSetu is just getting started. Impact figures will appear here once deliveries are completed and confirmed with a handoff code — we never publish estimated or illustrative numbers.
          </p>
        )}
      </div>
    </section>
  );
}

function Home() {
  return (
    <SiteLayout>
      <section className="container-page grid items-center gap-10 py-12 md:py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Bridging Food. Ending Hunger.</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] md:text-6xl">
            Good Food Should Reach Those Who Need It.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            AnnaSetu connects communities, food donors, restaurants, and volunteers to turn surplus food into meaningful support for people facing hunger.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild><Link to="/app/report">Report a Food Need <ArrowRight /></Link></Button>
            <Button size="lg" variant="warm" asChild><Link to="/donate">Donate or Sponsor a Meal</Link></Button>
          </div>
        </div>
        <div className="relative">
          <img src={hero} alt="Volunteers packing freshly cooked meals into tiffins in a community kitchen" width={1600} height={1104} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-card)]" />
          <div className="absolute -bottom-5 left-5 hidden rounded-xl border bg-card px-4 py-3 shadow-[var(--shadow-card)] sm:flex sm:items-center sm:gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Every listing is safety-reviewed</span>
          </div>
        </div>
      </section>

      <section className="border-y bg-cream py-20">
        <div className="container-page">
          <p className="eyebrow">How AnnaSetu works</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Three steps, with people checking every one</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary"><s.icon className="h-5 w-5" /></span>
                  <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page mt-24">
        <p className="eyebrow">Ways to participate</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Find your part in the bridge</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WAYS.map((w) => (
            <Link key={w.title} to={w.to} className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card)]">
              <w.icon className="h-6 w-6 text-warm" />
              <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-24 grid gap-6 lg:grid-cols-3">
        {[
          ["Meal sponsorship", `Contributions fund cooked meals prepared by partner kitchens. Roughly ${formatINR(MEAL_COST_INR)} sponsors one meal. Online payments are currently in demonstration mode.`],
          ["Restaurant food rescue", "Approved providers list surplus food with preparation time, storage details and a pickup deadline. Nothing is matched until a reviewer approves it."],
          ["Food safety & accountability", "Safety checklists, expiring listings, handoff confirmation codes and an audit trail of every status change keep the process honest."],
        ].map(([t, b]) => (
          <div key={t} className="rounded-xl bg-primary-soft p-6">
            <h3 className="text-lg font-semibold text-accent-foreground">{t}</h3>
            <p className="mt-2 text-sm text-foreground/80">{b}</p>
          </div>
        ))}
      </section>

      <Impact />

      <section className="container-page mt-24 max-w-3xl">
        <p className="eyebrow">Questions</p>
        <h2 className="mt-2 text-3xl font-semibold">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-6">
          {FAQ.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left text-base">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container-page mt-24">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-primary p-10 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-14">
          <div>
            <h2 className="text-3xl font-semibold">Ready to help close the gap?</h2>
            <p className="mt-2 opacity-85">Create a free account and choose how you want to take part.</p>
          </div>
          <Button size="lg" variant="warm" asChild><Link to="/auth" search={{ mode: "signup" }}>Get Started</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}
