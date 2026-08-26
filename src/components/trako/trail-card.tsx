import { Link } from "@tanstack/react-router";
import { Mountain, Star } from "lucide-react";

import { DifficultyBadge } from "@/components/trako/primitives";
import { formatElevation, formatKm } from "@/lib/format";
import type { Trail } from "@/types";

export function TrailCard({ trail }: { trail: Trail }) {
  return (
    <Link
      to="/trilhas/$trailId"
      params={{ trailId: trail.id }}
      className="flex gap-3 overflow-hidden rounded-2xl bg-card p-3 shadow-card transition-colors hover:bg-elevated"
    >
      <img
        src={trail.photo}
        alt={trail.name}
        loading="lazy"
        className="size-24 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-display text-base leading-tight text-foreground">{trail.name}</h3>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Star className="size-3 fill-primary" />
            {trail.rating}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">{trail.region}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={trail.difficulty} />
          <span className="text-metric text-xs text-foreground">{formatKm(trail.distanceKm)}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mountain className="size-3" />
            {formatElevation(trail.elevationGainM)}
          </span>
        </div>
      </div>
    </Link>
  );
}
