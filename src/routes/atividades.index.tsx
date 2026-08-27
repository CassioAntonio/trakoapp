import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bike, Route as RouteIcon } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Chip, DifficultyBadge, MetricTile, SectionTitle } from "@/components/trako/primitives";
import { TrackThumb } from "@/components/trako/track-thumb";
import { formatDuration, formatElevation, formatKm } from "@/lib/format";
import { useFeedActivities } from "@/lib/recorder-store";
import { currentRider } from "@/data/mock";

export const Route = createFileRoute("/atividades/")({
  head: () => ({
    meta: [
      { title: "Histórico de atividades | TRAKO" },
      {
        name: "description",
        content:
          "Todo o seu histórico off-road: distância, tempo, elevação e traçado de cada trilha gravada.",
      },
      { property: "og:title", content: "Histórico de atividades | TRAKO" },
      {
        property: "og:description",
        content: "Acompanhe a evolução das suas pilotadas com totais de distância, tempo e elevação.",
      },
    ],
  }),
  component: ActivitiesPage,
});

const periods = ["Tudo", "Minhas", "Comunidade"] as const;

function ActivitiesPage() {
  const feed = useFeedActivities();
  const [tab, setTab] = useState<string>(periods[0]);

  const list = useMemo(() => {
    if (tab === "Minhas") return feed.filter((a) => a.riderId === currentRider.id);
    if (tab === "Comunidade") return feed.filter((a) => a.riderId !== currentRider.id);
    return feed;
  }, [feed, tab]);

  const totals = useMemo(
    () =>
      list.reduce(
        (acc, a) => ({
          km: acc.km + a.stats.distanceKm,
          min: acc.min + a.stats.durationMin,
          gain: acc.gain + a.stats.elevationGainM,
        }),
        { km: 0, min: 0, gain: 0 },
      ),
    [list],
  );

  return (
    <AppShell title="Atividades" subtitle={`${list.length} registros`}>
      <div className="flex gap-2">
        {periods.map((p) => (
          <Chip key={p} active={tab === p} onClick={() => setTab(p)}>
            {p}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MetricTile label="Distância" value={formatKm(totals.km)} />
        <MetricTile label="Tempo" value={formatDuration(totals.min)} />
        <MetricTile label="Elevação" value={formatElevation(totals.gain)} />
      </div>

      <SectionTitle>Registros</SectionTitle>

      {list.length === 0 ? (
        <div className="rounded-2xl bg-card p-6 text-center shadow-card">
          <RouteIcon className="mx-auto size-8 text-muted-foreground" />
          <p className="text-display mt-3 text-base text-foreground">Nenhuma atividade ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Grave sua primeira trilha para ver estatísticas aqui.
          </p>
          <Link
            to="/gravar"
            className="mt-4 inline-flex rounded-xl bg-gradient-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground"
          >
            Gravar agora
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((a) => (
            <Link
              key={a.id}
              to="/atividades/$activityId"
              params={{ activityId: a.id }}
              className="flex gap-3 rounded-2xl bg-card p-3 shadow-card transition-colors hover:bg-elevated"
            >
              <div className="size-20 shrink-0 overflow-hidden rounded-xl">
                <TrackThumb track={a.track} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-display truncate text-base leading-tight text-foreground">
                  {a.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.date} · {a.location}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={a.difficulty} />
                  <span className="text-metric text-xs text-foreground">
                    {formatKm(a.stats.distanceKm)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(a.stats.durationMin)}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                  <Bike className="size-3" /> {a.bike}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
