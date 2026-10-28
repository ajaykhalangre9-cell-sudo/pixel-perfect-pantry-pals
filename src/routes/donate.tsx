import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/donate")({
  head: () => ({ meta: [{ title: "Donate — AnnaSetu" }, { name: "description", content: "Sponsor meals with AnnaSetu." }, { property: "og:title", content: "Donate — AnnaSetu" }, { property: "og:description", content: "Sponsor meals with AnnaSetu." }] }),
  component: () => (
    <InfoPage eyebrow="Donate" title="Sponsor a meal" intro="Online payments are not enabled yet. No money is collected and no receipts are issued until a verified payment provider is connected.">
      <p className="text-muted-foreground">The donation checkout is coming in the next build step.</p>
    </InfoPage>
  ),
});
