import type { Difficulty } from "@/types";

export const formatKm = (km: number) =>
  `${km.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}min` : `${m}min`;
};

export const formatClock = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const formatSpeed = (kmh: number) =>
  `${kmh.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km/h`;

export const formatElevation = (m: number) => `${Math.round(m).toLocaleString("pt-BR")} m`;

export const difficultyLabel: Record<Difficulty, string> = {
  easy: "Fácil",
  moderate: "Moderada",
  hard: "Difícil",
  extreme: "Extrema",
};

export const difficultyDot: Record<Difficulty, string> = {
  easy: "bg-easy",
  moderate: "bg-moderate",
  hard: "bg-hard",
  extreme: "bg-extreme",
};

export const difficultyText: Record<Difficulty, string> = {
  easy: "text-easy",
  moderate: "text-moderate",
  hard: "text-hard",
  extreme: "text-extreme",
};

export const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
