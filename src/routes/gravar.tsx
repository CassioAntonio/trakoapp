import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Pause, Play, Square, Trash2, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { MapView } from "@/components/map/map-view";
import { Chip, MetricTile } from "@/components/trako/primitives";
import { bikes, modalities } from "@/data/mock";
import { formatClock, formatElevation, formatKm, formatSpeed } from "@/lib/format";
import { recorder, useRecorder } from "@/lib/recorder-store";
import { computeStats } from "@/lib/stats";
import type { Modality } from "@/types";

export const Route = createFileRoute("/gravar")({
  head: () => ({
    meta: [
      { title: "Gravar atividade | TRAKO" },
      {
        name: "description",
        content:
          "Grave sua trilha por GPS: distância, velocidade, altitude e traçado no mapa em tempo real.",
      },
      { property: "og:title", content: "Gravar atividade | TRAKO" },
      {
        property: "og:description",
        content: "Registro por GPS com mapa ao vivo, pausas, elevação e resumo automático.",
      },
    ],
  }),
  component: RecordPage,
});

function RecordPage() {
  const navigate = useNavigate();
  const state = useRecorder();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [confirm, setConfirm] = useState(false);

  const stats = useMemo(
    () => computeStats(state.points, state.elapsedSec, state.pauses),
    [state.points, state.elapsedSec, state.pauses],
  );
  const last = state.points[state.points.length - 1] ?? null;

  function finish() {
    const id = recorder.finish(title, location);
    setTitle("");
    setLocation("");
    setConfirm(false);
    navigate({ to: "/atividades/$activityId", params: { activityId: id } });
  }

  return (
    <AppShell
      title="Gravar"
      subtitle={
        state.status === "idle"
          ? "Configure e inicie sua trilha"
          : `${state.gpsKind === "real" ? "GPS do dispositivo" : "GPS simulado"} · ${state.points.length} pontos`
      }
    >
      <div className="overflow-hidden rounded-2xl">
        <MapView
          className="h-56 w-full"
          track={state.points}
          position={last}
          follow
          interactive={false}
        />
      </div>

      {state.error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-elevated px-3 py-2 text-xs text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-hard" />
          {state.error} Seguimos gravando com trajeto simulado para não perder a atividade.
        </p>
      )}

      <div className="mt-4 rounded-2xl bg-card p-4 shadow-card">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Tempo em movimento
        </p>
        <p className="text-metric text-5xl leading-none text-foreground">
          {formatClock(state.elapsedSec)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetricTile label="Distância" value={formatKm(stats.distanceKm)} />
          <MetricTile label="Vel. média" value={formatSpeed(stats.avgSpeed)} />
          <MetricTile label="Vel. máxima" value={formatSpeed(stats.maxSpeed)} />
          <MetricTile label="Elevação" value={formatElevation(stats.elevationGainM)} />
        </div>
      </div>

      {state.status === "idle" ? (
        <>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Modalidade
          </p>
          <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4">
            {modalities.map((m) => (
              <Chip
                key={m}
                active={state.modality === m}
                onClick={() => recorder.configure({ modality: m as Modality })}
              >
                {m}
              </Chip>
            ))}
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Moto
          </p>
          <select
            value={state.bike}
            onChange={(e) => recorder.configure({ bike: e.target.value })}
            className="input-trako mt-2"
          >
            {bikes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Fonte de GPS
          </p>
          <div className="mt-2 flex gap-2">
            <Chip active={state.mode === "real"} onClick={() => recorder.configure({ mode: "real" })}>
              GPS real
            </Chip>
            <Chip active={state.mode === "mock"} onClick={() => recorder.configure({ mode: "mock" })}>
              Simulado (demo)
            </Chip>
          </div>

          <button
            type="button"
            onClick={() => recorder.start()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-4 py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-glow"
          >
            <Play className="size-5" /> Iniciar gravação
          </button>
        </>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {state.status === "recording" ? (
              <button
                type="button"
                onClick={() => recorder.pause()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-surface px-4 py-4 text-sm font-bold uppercase tracking-wide text-foreground"
              >
                <Pause className="size-5" /> Pausar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => recorder.resume()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-surface px-4 py-4 text-sm font-bold uppercase tracking-wide text-foreground"
              >
                <Play className="size-5" /> Retomar
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirm(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-4 py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-glow"
            >
              <Square className="size-5" /> Finalizar
            </button>
          </div>

          <button
            type="button"
            onClick={() => recorder.discard()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            <Trash2 className="size-4" /> Descartar
          </button>
        </>
      )}

      {confirm && (
        <div className="mt-5 rounded-2xl bg-card p-4 shadow-card">
          <p className="text-display text-base text-foreground">Salvar atividade</p>
          <div className="mt-3 flex flex-col gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Trilha de ${state.modality}`}
              className="input-trako"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Local (ex.: Passos, MG)"
              className="input-trako"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="rounded-xl bg-surface px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={finish}
                className="rounded-xl bg-gradient-primary px-4 py-3 text-xs font-bold uppercase tracking-wide text-primary-foreground"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
