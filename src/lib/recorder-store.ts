import { useSyncExternalStore } from "react";

import { activities as seedActivities, currentRider } from "@/data/mock";
import { buildTrack } from "@/lib/geo";
import { computeStats, estimateDifficulty } from "@/lib/stats";
import { loadJson, saveJson } from "@/lib/persist";
import { createGpsProvider, type GpsProvider } from "@/services/gps";
import type { Activity, GeoPoint, Modality } from "@/types";

export type RecordStatus = "idle" | "recording" | "paused";

export interface RecorderState {
  status: RecordStatus;
  mode: "mock" | "real";
  gpsKind: "mock" | "real";
  modality: Modality;
  bike: string;
  points: GeoPoint[];
  elapsedSec: number;
  pauses: number;
  error: string | null;
  saved: Activity[];
  lastSavedId: string | null;
}

let state: RecorderState = {
  status: "idle",
  mode: "real",
  gpsKind: "mock",
  modality: "Trilha",
  bike: currentRider.bike,
  points: [],
  elapsedSec: 0,
  pauses: 0,
  error: null,
  saved: [],
  lastSavedId: null,
};

const SAVED_KEY = "trako.activities.v1";
let hydrated = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<RecorderState>) => {
  state = { ...state, ...patch };
  emit();
};

let provider: GpsProvider | null = null;
let ticker: ReturnType<typeof setInterval> | null = null;

const fallbackTrack = () => buildTrack(7, [-20.719, -46.61], 240, 0.03);

function startClock() {
  if (ticker) return;
  ticker = setInterval(() => {
    if (state.status === "recording") set({ elapsedSec: state.elapsedSec + 1 });
  }, 1000);
}

function stopClock() {
  if (ticker) clearInterval(ticker);
  ticker = null;
}

function attachGps() {
  const track = fallbackTrack();
  provider = createGpsProvider(state.mode, track);
  set({ gpsKind: provider.kind });
  provider.start(
    (point) => {
      if (state.status !== "recording") return;
      set({ points: [...state.points, point] });
    },
    (message) => {
      // Sem permissão / sem sinal: cai para o provider simulado, sem parar a gravação.
      provider?.stop();
      provider = createGpsProvider("mock", track);
      set({ error: message, gpsKind: "mock" });
      provider.start((point) => {
        if (state.status !== "recording") return;
        set({ points: [...state.points, point] });
      });
    },
  );
}

export const recorder = {
  configure(patch: Partial<Pick<RecorderState, "modality" | "bike" | "mode">>) {
    set(patch);
  },
  start() {
    if (state.status !== "idle") return;
    set({ status: "recording", points: [], elapsedSec: 0, pauses: 0, error: null });
    attachGps();
    startClock();
  },
  pause() {
    if (state.status !== "recording") return;
    set({ status: "paused", pauses: state.pauses + 1 });
  },
  resume() {
    if (state.status !== "paused") return;
    set({ status: "recording" });
  },
  discard() {
    provider?.stop();
    provider = null;
    stopClock();
    set({ status: "idle", points: [], elapsedSec: 0, pauses: 0, error: null });
  },
  /** Finaliza e salva a atividade localmente. Retorna o id criado. */
  finish(title: string, location: string) {
    const points = state.points.length > 1 ? state.points : fallbackTrack().slice(0, 60);
    const elapsed = state.elapsedSec > 10 ? state.elapsedSec : points.length * 12;
    const stats = computeStats(points, elapsed, state.pauses);
    const id = `local-${Date.now()}`;
    const activity: Activity = {
      id,
      riderId: currentRider.id,
      title: title.trim() || `Trilha de ${state.modality}`,
      modality: state.modality,
      difficulty: estimateDifficulty(stats.distanceKm, stats.elevationGainM),
      date: "Agora mesmo",
      location: location.trim() || currentRider.location,
      privacy: "public",
      photo: "",
      bike: state.bike,
      stats,
      track: points,
      likes: 0,
      comments: [],
    };
    provider?.stop();
    provider = null;
    stopClock();
    const saved = [activity, ...state.saved];
    saveJson(SAVED_KEY, saved);
    set({
      status: "idle",
      points: [],
      elapsedSec: 0,
      pauses: 0,
      saved,
      lastSavedId: id,
    });
    return id;
  },
  remove(id: string) {
    const saved = state.saved.filter((a) => a.id !== id);
    saveJson(SAVED_KEY, saved);
    set({ saved });
  },
};

/** Recupera atividades salvas no dispositivo (client-only). */
export function hydrateRecorder() {
  if (hydrated) return;
  hydrated = true;
  const saved = loadJson<Activity[]>(SAVED_KEY, []);
  if (saved.length) set({ saved });
}


const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useRecorder() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

/** Feed combinado: atividades gravadas localmente + mock. */
export function useFeedActivities(): Activity[] {
  const { saved } = useRecorder();
  return [...saved, ...seedActivities];
}

export function findActivity(id: string) {
  return state.saved.find((a) => a.id === id) ?? seedActivities.find((a) => a.id === id);
}
