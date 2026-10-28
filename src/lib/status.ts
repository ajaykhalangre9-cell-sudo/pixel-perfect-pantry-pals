export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const TONES: Record<string, Tone> = {
  draft: "neutral",
  submitted: "info",
  under_review: "warning",
  verified: "success",
  matched: "info",
  assistance_scheduled: "info",
  fulfilled: "success",
  rejected: "danger",
  cancelled: "neutral",
  approved: "success",
  pickup_assigned: "info",
  collected: "info",
  delivered: "success",
  expired: "neutral",
  pending: "warning",
  suspended: "danger",
  awaiting_assignment: "warning",
  assigned: "info",
  accepted: "info",
  declined: "neutral",
  en_route_pickup: "info",
  arrived_pickup: "info",
  en_route_destination: "info",
  delayed: "warning",
  failed: "danger",
  demo_recorded: "neutral",
  verified_payment: "success",
};

const LABELS: Record<string, string> = {
  en_route_pickup: "En route to pickup",
  arrived_pickup: "Arrived at pickup",
  en_route_destination: "En route to destination",
  failed: "Failed delivery",
  demo_recorded: "Demo — not a real payment",
  non_veg: "Non-veg",
  veg: "Veg",
};

export function statusLabel(s: string) {
  if (LABELS[s]) return LABELS[s];
  const t = s.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
export function statusTone(s: string): Tone {
  return TONES[s] ?? "neutral";
}

/** Listings past their pickup deadline that were never collected count as expired. */
export function effectiveListingStatus(status: string, pickupDeadline: string, now = new Date()) {
  const open = ["draft", "submitted", "under_review", "approved", "matched", "pickup_assigned"];
  if (open.includes(status) && new Date(pickupDeadline).getTime() < now.getTime()) return "expired";
  return status;
}

export const NEED_TYPES = [
  { value: "cooked_meals", label: "Cooked meals" },
  { value: "dry_rations", label: "Dry rations" },
  { value: "child_nutrition", label: "Child nutrition" },
  { value: "elderly_support", label: "Elderly support" },
  { value: "emergency_relief", label: "Emergency relief" },
];

export const MEAL_COST_INR = 40;

export function formatDateTime(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}
export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
