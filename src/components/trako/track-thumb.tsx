import { trackToSvgPath } from "@/lib/geo";
import { cn } from "@/lib/utils";
import type { GeoPoint } from "@/types";

/** Miniatura vetorial do traçado (sem custo de mapa). */
export function TrackThumb({ track, className }: { track: GeoPoint[]; className?: string }) {
  const path = trackToSvgPath(track);
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-full w-full bg-elevated", className)}
    >
      <path d={path} fill="none" stroke="var(--primary)" strokeOpacity="0.25" strokeWidth="4" />
      <path
        d={path}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
