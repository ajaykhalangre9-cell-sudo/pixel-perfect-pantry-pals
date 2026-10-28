import { Link } from "@tanstack/react-router";
import { Wheat } from "lucide-react";

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Wheat className="h-4 w-4" />
      </span>
      Anna<span className="text-warm">Setu</span>
    </Link>
  );
}
