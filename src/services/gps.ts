import type { GeoPoint } from "@/types";

/**
 * Camada de GPS com separação explícita entre MOCK e REAL.
 *
 * - `BrowserGpsProvider` usa a Geolocation API (foreground). Em um build
 *   nativo (Capacitor/Expo), substitua apenas esta implementação por
 *   localização em background, mantendo a mesma interface.
 * - `MockGpsProvider` reproduz um track gravado, usado em preview/dev e
 *   quando não há permissão de localização.
 */
export interface GpsProvider {
  readonly kind: "mock" | "real";
  start(onPoint: (point: GeoPoint) => void, onError?: (message: string) => void): void;
  stop(): void;
}

export class MockGpsProvider implements GpsProvider {
  readonly kind = "mock" as const;
  private timer: ReturnType<typeof setInterval> | null = null;
  private index = 0;

  constructor(
    private readonly track: GeoPoint[],
    private readonly intervalMs = 1000,
  ) {}

  start(onPoint: (point: GeoPoint) => void) {
    this.stop();
    this.timer = setInterval(() => {
      const point = this.track[this.index % this.track.length];
      this.index += 1;
      onPoint({ ...point, timestamp: Date.now() });
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}

export class BrowserGpsProvider implements GpsProvider {
  readonly kind = "real" as const;
  private watchId: number | null = null;

  start(onPoint: (point: GeoPoint) => void, onError?: (message: string) => void) {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      onError?.("Geolocalização não disponível neste dispositivo.");
      return;
    }
    this.watchId = navigator.geolocation.watchPosition(
      (pos) =>
        onPoint({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          altitude: pos.coords.altitude ?? undefined,
          speed: pos.coords.speed != null ? Math.max(0, pos.coords.speed * 3.6) : undefined,
          heading: pos.coords.heading ?? undefined,
          timestamp: pos.timestamp,
        }),
      (err) => onError?.(err.message),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 },
    );
  }

  stop() {
    if (this.watchId != null && typeof navigator !== "undefined") {
      navigator.geolocation.clearWatch(this.watchId);
    }
    this.watchId = null;
  }
}

export function createGpsProvider(mode: "mock" | "real", fallbackTrack: GeoPoint[]): GpsProvider {
  return mode === "real" ? new BrowserGpsProvider() : new MockGpsProvider(fallbackTrack);
}
