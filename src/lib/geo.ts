import type { GeoPoint } from "@/types";

/** Distância em km entre dois pontos (Haversine). */
export function haversineKm(a: GeoPoint, b: GeoPoint) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function trackDistanceKm(track: GeoPoint[]) {
  let total = 0;
  for (let i = 1; i < track.length; i++) total += haversineKm(track[i - 1], track[i]);
  return total;
}

export function trackBounds(track: GeoPoint[]) {
  const lats = track.map((p) => p.lat);
  const lngs = track.map((p) => p.lng);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

/** Converte o track em um path SVG normalizado (viewBox 0 0 100 60). */
export function trackToSvgPath(track: GeoPoint[]) {
  if (track.length < 2) return "";
  const { minLat, maxLat, minLng, maxLng } = trackBounds(track);
  const spanLat = Math.max(maxLat - minLat, 1e-6);
  const spanLng = Math.max(maxLng - minLng, 1e-6);
  return track
    .map((p, i) => {
      const x = ((p.lng - minLng) / spanLng) * 92 + 4;
      const y = 56 - ((p.lat - minLat) / spanLat) * 52;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

/** Gerador determinístico de trilhas (sem Math.random — SSR safe). */
export function buildTrack(
  seed: number,
  center: [number, number],
  points = 90,
  spread = 0.055,
): GeoPoint[] {
  const out: GeoPoint[] = [];
  let lat = center[0];
  let lng = center[1];
  const start = Date.UTC(2026, 6, 12, 11, 0, 0);
  for (let i = 0; i < points; i++) {
    const t = i / points;
    const wob = Math.sin(t * Math.PI * (3 + (seed % 4)) + seed) * spread * 0.45;
    lat = center[0] + Math.sin(t * Math.PI * 2 + seed) * spread + wob * 0.6;
    lng = center[1] + Math.cos(t * Math.PI * 2.4 + seed * 1.7) * spread * 1.3 + wob;
    const altitude =
      760 + Math.sin(t * Math.PI * 3 + seed) * 210 + Math.sin(t * Math.PI * 11) * 35;
    const speed = 26 + Math.sin(t * Math.PI * 7 + seed) * 14 + Math.cos(t * 9) * 5;
    out.push({
      lat,
      lng,
      altitude: Math.round(altitude),
      speed: Math.max(0, Math.round(speed * 10) / 10),
      timestamp: start + i * 100_000,
      heading: Math.round((t * 360 + seed * 30) % 360),
    });
  }
  return out;
}
