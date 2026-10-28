import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InfoPage } from "@/components/site/SiteLayout";

const ITEMS: [string, string][] = [
  ['Register your kitchen', 'Create an account, choose the restaurant role and submit your provider details. A reviewer approves new providers before listings open.'],
  ["List what's available", "Food name, quantity, veg or non-veg, when it was prepared, how it's stored, allergens and a pickup deadline."],
  ['Safety review', 'A food-safety reviewer checks each listing. Photographs and declarations alone are never treated as proof of safety.'],
  ['Pickup', 'A volunteer collects at your chosen time. Listings expire automatically once the pickup deadline passes.'],
];

export const Route = createFileRoute("/food-rescue")({
  head: () => ({
    meta: [
      { title: "Turn your surplus into someone's next meal — AnnaSetu" },
      { name: "description", content: 'Restaurants, caterers, hostels and event venues can list safe surplus food for pickup by verified volunteers.' },
      { property: "og:title", content: "Turn your surplus into someone's next meal — AnnaSetu" },
      { property: "og:description", content: 'Restaurants, caterers, hostels and event venues can list safe surplus food for pickup by verified volunteers.' },
    ],
  }),
  component: FoodRescuePage,
});

function FoodRescuePage() {
  return (
    <InfoPage eyebrow={'Food rescue'} title={"Turn your surplus into someone's next meal"} intro={'Restaurants, caterers, hostels and event venues can list safe surplus food for pickup by verified volunteers.'}>
      <div className="grid gap-5 md:grid-cols-2">
        {ITEMS.map(([t, b]) => (
          <div key={t} className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Button size="lg" asChild><Link to="/app/provider">Register as a provider</Link></Button>
      </div>
    </InfoPage>
  );
}
