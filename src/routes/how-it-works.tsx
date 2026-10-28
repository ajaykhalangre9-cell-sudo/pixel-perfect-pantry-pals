import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InfoPage } from "@/components/site/SiteLayout";

const ITEMS: [string, string][] = [
  ['1. Report or share', 'Community members submit a food-need report with a general location and the number of people. Approved restaurants list surplus food with preparation, storage and pickup details.'],
  ['2. Review', 'Reviewers verify need reports and run a food-safety checklist on every listing. Rejected items get a written reason.'],
  ['3. Match', 'Approved food is matched to a verified need. A volunteer is assigned and receives only the details they need.'],
  ['4. Collect and deliver', 'The volunteer updates each step — en route, collected, delivered. Delivery is confirmed with a six-digit handoff code held by the receiving point.'],
  ['5. Record', 'Every status change is timestamped and kept in an audit log. Only confirmed deliveries count towards public impact.'],
];

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: 'From report to doorstep, with checks at every step — AnnaSetu' },
      { name: "description", content: 'AnnaSetu is a human-reviewed workflow. Nothing moves until an authorised team member has looked at it.' },
      { property: "og:title", content: 'From report to doorstep, with checks at every step — AnnaSetu' },
      { property: "og:description", content: 'AnnaSetu is a human-reviewed workflow. Nothing moves until an authorised team member has looked at it.' },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <InfoPage eyebrow={'How it works'} title={'From report to doorstep, with checks at every step'} intro={'AnnaSetu is a human-reviewed workflow. Nothing moves until an authorised team member has looked at it.'}>
      <div className="grid gap-5 md:grid-cols-2">
        {ITEMS.map(([t, b]) => (
          <div key={t} className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Button size="lg" asChild><Link to="/auth">Get started</Link></Button>
      </div>
    </InfoPage>
  );
}
