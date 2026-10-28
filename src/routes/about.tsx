import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InfoPage } from "@/components/site/SiteLayout";

const ITEMS: [string, string][] = [
  ['Our approach', 'Dignity first, verification always. We prefer a slower confirmed delivery over a fast unverified one.'],
  ['NGO and community partners', 'Registered organisations can join with the NGO role and coordinate with our operations team.'],
  ['Honest reporting', 'We publish only outcomes recorded in our system. No invented statistics, partners or testimonials.'],
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: 'Built to bridge food and hunger in India — AnnaSetu' },
      { name: "description", content: "AnnaSetu — 'food bridge' — is a social-impact platform connecting surplus food and meal sponsorship with people who need it." },
      { property: "og:title", content: 'Built to bridge food and hunger in India — AnnaSetu' },
      { property: "og:description", content: "AnnaSetu — 'food bridge' — is a social-impact platform connecting surplus food and meal sponsorship with people who need it." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoPage eyebrow={'About'} title={'Built to bridge food and hunger in India'} intro={"AnnaSetu — 'food bridge' — is a social-impact platform connecting surplus food and meal sponsorship with people who need it."}>
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
