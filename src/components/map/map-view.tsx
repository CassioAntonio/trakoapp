import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { cn } from "@/lib/utils";
import type { TrailMapProps } from "./trail-map";

const TrailMap = lazy(() => import("./trail-map"));

function MapSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-elevated", className)}>
      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
        Carregando mapa…
      </div>
    </div>
  );
}

/** Mapa real (MapLibre + OpenStreetMap) carregado apenas no cliente. */
export function MapView({ className, ...props }: TrailMapProps) {
  return (
    <ClientOnly fallback={<MapSkeleton className={className} />}>
      <Suspense fallback={<MapSkeleton className={className} />}>
        <TrailMap className={className} {...props} />
      </Suspense>
    </ClientOnly>
  );
}
