import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InfoPage } from "@/components/site/SiteLayout";

const ITEMS: [string, string][] = [
  ['Accurate information', 'Submit truthful reports and listings. Misleading submissions may be rejected and accounts suspended.'],
  ['Food safety', 'Providers are responsible for food they list. Reviewers apply a safety checklist but AnnaSetu does not certify food.'],
  ['Donations', 'Online donations are in demonstration mode. No payment is processed and no receipt or tax benefit is issued until live payments are enabled.'],
  ['Roles', 'Reviewer and administrator roles are assigned only by AnnaSetu administrators.'],
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: 'Terms of use — AnnaSetu' },
      { name: "description", content: 'The basic rules for using AnnaSetu.' },
      { property: "og:title", content: 'Terms of use — AnnaSetu' },
      { property: "og:description", content: 'The basic rules for using AnnaSetu.' },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <InfoPage eyebrow={'Terms'} title={'Terms of use'} intro={'The basic rules for using AnnaSetu.'}>
      <div className="grid gap-5 md:grid-cols-2">
        {ITEMS.map(([t, b]) => (
          <div key={t} className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Button size="lg" asChild><Link to="/">Back to home</Link></Button>
      </div>
    </InfoPage>
  );
}
