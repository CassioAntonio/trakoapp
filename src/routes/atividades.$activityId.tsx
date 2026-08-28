import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { MapView } from "@/components/map/map-view";
import { ElevationChart } from "@/components/trako/elevation-chart";
import { DifficultyBadge, MetricTile, SectionTitle } from "@/components/trako/primitives";
import { currentRider, riderById } from "@/data/mock";
import { formatDuration, formatElevation, formatKm, formatSpeed } from "@/lib/format";
import { findActivity, useFeedActivities } from "@/lib/recorder-store";
import { social, useSocial } from "@/lib/social-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/atividades/$activityId")({
  head: () => ({
    meta: [
      { title: "Resumo da atividade | TRAKO" },
      {
        name: "description",
        content:
          "Resumo completo da pilotada: mapa do trajeto, gráficos de elevação e velocidade, tempo e distância.",
      },
      { property: "og:title", content: "Resumo da atividade | TRAKO" },
      {
        property: "og:description",
        content: "Veja o trajeto no mapa, elevação, velocidade média e comentários da comunidade.",
      },
    ],
  }),
  component: ActivityDetail,
});

function ActivityDetail() {
  const { activityId } = Route.useParams();
  const feed = useFeedActivities();
  const activity = feed.find((a) => a.id === activityId) ?? findActivity(activityId);
  const { likes, comments } = useSocial();
  const [metric, setMetric] = useState<"altitude" | "speed">("altitude");
  const [text, setText] = useState("");

  if (!activity) {
    return (
      <AppShell title="Atividade">
        <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground">
          Atividade não encontrada.
        </p>
        <Link to="/atividades" className="mt-4 block text-center text-sm text-primary">
          Voltar ao histórico
        </Link>
      </AppShell>
    );
  }

  const rider = riderById(activity.riderId);
  const liked = Boolean(likes[activity.id]) !== Boolean(activity.liked);
  const allComments = [...activity.comments, ...(comments[activity.id] ?? [])];
  const s = activity.stats;

  return (
    <AppShell title={activity.title} subtitle={`${activity.date} · ${activity.location}`}>
      <Link
        to="/atividades"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ArrowLeft className="size-3.5" /> Histórico
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{rider.ridername}</p>
          <p className="text-xs text-muted-foreground">
            {activity.modality} · {activity.bike}
          </p>
        </div>
        <DifficultyBadge difficulty={activity.difficulty} />
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl shadow-card">
        <MapView className="h-56 w-full" track={activity.track} interactive={false} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <MetricTile label="Distância" value={formatKm(s.distanceKm)} />
        <MetricTile label="Tempo" value={formatDuration(s.durationMin)} />
        <MetricTile label="Movimento" value={formatDuration(s.movingMin)} />
        <MetricTile label="Vel. média" value={formatSpeed(s.avgSpeed)} />
        <MetricTile label="Vel. máx" value={formatSpeed(s.maxSpeed)} />
        <MetricTile label="Pausas" value={String(s.pauses)} />
        <MetricTile label="Subida" value={formatElevation(s.elevationGainM)} />
        <MetricTile label="Descida" value={formatElevation(s.elevationLossM)} />
        <MetricTile label="Alt. máx" value={formatElevation(s.maxAltitudeM)} />
      </div>

      <SectionTitle
        action={
          <div className="flex gap-1">
            {(["altitude", "speed"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-semibold uppercase",
                  metric === m ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground",
                )}
              >
                {m === "altitude" ? "Elevação" : "Velocidade"}
              </button>
            ))}
          </div>
        }
      >
        Perfil do percurso
      </SectionTitle>
      <div className="rounded-2xl bg-card p-2">
        <ElevationChart track={activity.track} metric={metric} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => social.toggleLike(activity.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm",
            liked ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Heart className={cn("size-4", liked && "fill-current")} />
          {activity.likes + (liked ? 1 : 0)}
        </button>
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm text-muted-foreground">
          <MessageCircle className="size-4" />
          {allComments.length}
        </span>
      </div>

      <SectionTitle>Comentários</SectionTitle>
      <div className="flex flex-col gap-2">
        {allComments.map((c) => (
          <div key={c.id} className="rounded-xl bg-card p-3">
            <p className="text-xs font-semibold text-foreground">{riderById(c.riderId).ridername}</p>
            <p className="text-sm text-muted-foreground">{c.text}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{c.createdAt}</p>
          </div>
        ))}
        {allComments.length === 0 && (
          <p className="text-sm text-muted-foreground">Seja o primeiro a comentar.</p>
        )}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          social.addComment(activity.id, text, currentRider.id);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva um comentário"
          className="input-trako"
        />
        <button
          type="submit"
          className="rounded-xl bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Enviar
        </button>
      </form>
    </AppShell>
  );
}
