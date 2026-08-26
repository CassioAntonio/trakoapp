import { haversineKm, trackDistanceKm } from "@/lib/geo";
import type { ActivityStats, Difficulty, GeoPoint } from "@/types";

/** Calcula estatísticas de uma atividade a partir dos pontos de GPS. */
export function computeStats(track: GeoPoint[], elapsedSec: number, pauses = 0): ActivityStats {
  const distanceKm = trackDistanceKm(track);
  const durationMin = elapsedSec / 60;

  let gain = 0;
  let loss = 0;
  const alts: number[] = [];
  let movingSec = 0;
  let maxSpeed = 0;

  for (let i = 0; i < track.length; i++) {
    const p = track[i];
    if (p.altitude != null) alts.push(p.altitude);
    if (p.speed != null) maxSpeed = Math.max(maxSpeed, p.speed);
    if (i > 0) {
      const prev = track[i - 1];
      if (p.altitude != null && prev.altitude != null) {
        const d = p.altitude - prev.altitude;
        if (d > 0) gain += d;
        else loss += -d;
      }
      const dt =
        p.timestamp != null && prev.timestamp != null ? (p.timestamp - prev.timestamp) / 1000 : 1;
      if (haversineKm(prev, p) > 0.001) movingSec += Math.min(dt, 30);
    }
  }

  const movingMin = Math.min(durationMin, movingSec / 60);
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    durationMin: Math.round(durationMin),
    movingMin: Math.round(movingMin),
    avgSpeed: movingMin > 0 ? Math.round((distanceKm / (movingMin / 60)) * 10) / 10 : 0,
    maxSpeed: Math.round(maxSpeed * 10) / 10,
    elevationGainM: Math.round(gain),
    elevationLossM: Math.round(loss),
    minAltitudeM: alts.length ? Math.round(Math.min(...alts)) : 0,
    maxAltitudeM: alts.length ? Math.round(Math.max(...alts)) : 0,
    pauses,
  };
}

/** Dificuldade estimada por distância + elevação. */
export function estimateDifficulty(distanceKm: number, gainM: number): Difficulty {
  const score = distanceKm * 0.4 + gainM / 40;
  if (score < 18) return "easy";
  if (score < 38) return "moderate";
  if (score < 62) return "hard";
  return "extreme";
}

/** Série para o gráfico de elevação/velocidade. */
export function elevationSeries(track: GeoPoint[]) {
  let acc = 0;
  return track.map((p, i) => {
    if (i > 0) acc += haversineKm(track[i - 1], p);
    return {
      km: Math.round(acc * 100) / 100,
      altitude: Math.round(p.altitude ?? 0),
      speed: Math.round((p.speed ?? 0) * 10) / 10,
    };
  });
}
