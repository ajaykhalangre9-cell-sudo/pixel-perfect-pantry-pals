import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InfoPage } from "@/components/site/SiteLayout";

const ITEMS: [string, string][] = [
  ['Set availability', 'Toggle yourself available when you can help, and say which area you cover.'],
  ['Accept assignments', 'Operations staff assign approved pickups. You can accept or decline each one.'],
  ['Update as you go', 'Mark en route, arrived, collected and delivered. Report delays or problems at any point.'],
  ['Confirm the handoff', 'Enter the confirmation code provided at the destination to complete a delivery.'],
];

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: 'Deliver meals in your neighbourhood — AnnaSetu' },
      { name: "description", content: 'Volunteers are the last mile. Set your availability and accept pickups that fit your schedule.' },
      { property: "og:title", content: 'Deliver meals in your neighbourhood — AnnaSetu' },
      { property: "og:description", content: 'Volunteers are the last mile. Set your availability and accept pickups that fit your schedule.' },
    ],
  }),
  component: VolunteerPage,
});

function VolunteerPage() {
  return (
    <InfoPage eyebrow={'Volunteer'} title={'Deliver meals in your neighbourhood'} intro={'Volunteers are the last mile. Set your availability and accept pickups that fit your schedule.'}>
      <div className="grid gap-5 md:grid-cols-2">
        {ITEMS.map(([t, b]) => (
          <div key={t} className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Button size="lg" asChild><Link to="/app/volunteer">Become a volunteer</Link></Button>
      </div>
    </InfoPage>
  );
}
