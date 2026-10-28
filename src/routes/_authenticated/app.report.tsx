import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/StatusBadge";

export const Route = createFileRoute("/_authenticated/app/report")({
  head: () => ({ meta: [{ title: "Report a food need — AnnaSetu" }] }),
  component: () => <EmptyState title="Report a food need" body="This screen isn't built yet — it's next on the list." />,
});
