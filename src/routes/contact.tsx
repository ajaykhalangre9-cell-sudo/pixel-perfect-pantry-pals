import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InfoPage } from "@/components/site/SiteLayout";

const ITEMS: [string, string][] = [
  ['Signed-in users', 'Use your dashboard to track reports, listings and deliveries — status updates appear in your notifications.'],
  ['Partnerships', 'Contact details for the AnnaSetu team will be published here once confirmed.'],
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: 'Get in touch — AnnaSetu' },
      { name: "description", content: 'Questions about partnering, volunteering or a report you submitted?' },
      { property: "og:title", content: 'Get in touch — AnnaSetu' },
      { property: "og:description", content: 'Questions about partnering, volunteering or a report you submitted?' },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <InfoPage eyebrow={'Contact'} title={'Get in touch'} intro={'Questions about partnering, volunteering or a report you submitted?'}>
      <div className="grid gap-5 md:grid-cols-2">
        {ITEMS.map(([t, b]) => (
          <div key={t} className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Button size="lg" asChild><Link to="/auth">Sign in</Link></Button>
      </div>
    </InfoPage>
  );
}
