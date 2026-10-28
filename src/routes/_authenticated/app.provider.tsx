import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/StatusBadge";

export const Route = createFileRoute("/_authenticated/app/provider")({
  head: () => ({ meta: [{ title: "Provider dashboard — AnnaSetu" }] }),
  component: () => <EmptyState title="Provider dashboard" body="This screen isn't built yet — it's next on the list." />,
});
