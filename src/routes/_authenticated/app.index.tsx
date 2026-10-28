import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/StatusBadge";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [{ title: "Your dashboard — AnnaSetu" }] }),
  component: () => <EmptyState title="Your dashboard" body="This screen isn't built yet — it's next on the list." />,
});
