import type { ReactNode } from "react";

import { difficultyDot, difficultyLabel, difficultyText, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Difficulty, Rider } from "@/types";

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-elevated px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
        difficultyText[difficulty],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", difficultyDot[difficulty])} />
      {difficultyLabel[difficulty]}
    </span>
  );
}

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function MetricTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl bg-surface px-3 py-2.5", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-metric mt-0.5 text-lg text-foreground">{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function RiderAvatar({
  rider,
  size = 40,
  className,
}: {
  rider: Rider;
  size?: number;
  className?: string;
}) {
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-gradient-primary text-display text-primary-foreground",
        className,
      )}
    >
      {initials(rider.name)}
    </span>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 mt-6 flex items-end justify-between gap-3">
      <h2 className="text-display text-base text-foreground">{children}</h2>
      {action}
    </div>
  );
}
