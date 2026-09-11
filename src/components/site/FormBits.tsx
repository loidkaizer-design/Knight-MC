import type { ReactNode } from "react";

import type { AddonRequest } from "@/lib/lightcraft-data";
import { cn } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition-smooth focus:border-primary";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export const statusLabels: Record<AddonRequest["status"], string> = {
  requested: "Requested",
  "under-consideration": "Under consideration",
  "in-development": "In development",
  completed: "Completed",
  rejected: "Rejected",
};

export function StatusPill({ status }: { status: AddonRequest["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        status === "completed" && "bg-success/15 text-success",
        status === "in-development" && "bg-primary/20 text-primary-glow",
        status === "under-consideration" && "bg-warning/15 text-warning",
        status === "requested" && "bg-secondary text-muted-foreground",
        status === "rejected" && "bg-destructive/15 text-destructive",
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
