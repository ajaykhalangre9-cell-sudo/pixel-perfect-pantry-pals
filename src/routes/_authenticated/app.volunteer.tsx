import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/StatusBadge";

export const Route = createFileRoute("/_authenticated/app/volunteer")({
  head: () => ({ meta: [{ title: "Volunteer dashboard — AnnaSetu" }] }),
  component: () => <EmptyState title="Volunteer dashboard" body="This screen isn't built yet — it's next on the list." />,
});
