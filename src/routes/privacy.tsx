import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InfoPage } from "@/components/site/SiteLayout";

const ITEMS: [string, string][] = [
  ['What we collect', 'Account details (name, email, phone), the content of reports and listings you submit, and optional location when you explicitly allow it.'],
  ['Who can see it', 'Your reports are visible to you and authorised reviewers. Precise recipient addresses are shown only to the assigned volunteer while a delivery is active.'],
  ['Evidence files', 'Photos you upload are stored privately and are accessible only to you and reviewers.'],
  ['Your choices', 'You can update your profile, cancel open reports and request deletion of your account by contacting us.'],
];

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: 'Privacy policy — AnnaSetu' },
      { name: "description", content: 'How AnnaSetu collects and protects personal information.' },
      { property: "og:title", content: 'Privacy policy — AnnaSetu' },
      { property: "og:description", content: 'How AnnaSetu collects and protects personal information.' },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage eyebrow={'Privacy'} title={'Privacy policy'} intro={'How AnnaSetu collects and protects personal information.'}>
      <div className="grid gap-5 md:grid-cols-2">
        {ITEMS.map(([t, b]) => (
          <div key={t} className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Button size="lg" asChild><Link to="/contact">Contact us</Link></Button>
      </div>
    </InfoPage>
  );
}
