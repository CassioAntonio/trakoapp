import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { MapView } from "@/components/map/map-view";
import { ElevationChart } from "@/components/trako/elevation-chart";
import { DifficultyBadge, MetricTile, SectionTitle } from "@/components/trako/primitives";
import { poiMeta, pois, riderById, trailById } from "@/data/mock";
import { formatElevation, formatKm } from "@/lib/format";
import { social, useSocial } from "@/lib/social-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trilhas/$trailId")({
  head: () => ({
    meta: [
      { title: "Detalhes da trilha | TRAKO" },
      {
        name: "description",
        content:
          "Mapa, altimetria, terreno, dificuldade e pontos de apoio da trilha off-road escolhida.",
      },
      { property: "og:title", content: "Detalhes da trilha | TRAKO" },
      {
        property: "og:description",
        content: "Veja altimetria, terreno e pontos de apoio antes de encarar a trilha.",
      },
    ],
  }),
  component: TrailDetail,
});

function TrailDetail() {
  const { trailId } = Route.useParams();
  const trail = trailById(trailId);
  const { favorites } = useSocial();

  if (!trail) {
    return (
      <AppShell title="Trilha">
        <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground">
          Trilha não encontrada.
        </p>
        <Link to="/explorar" className="mt-4 block text-center text-sm text-primary">
          Voltar ao explorar
        </Link>
      </AppShell>
    );
  }

  const fav = Boolean(favorites[trail.id]) !== Boolean(trail.favorite);

  return (
    <AppShell title={trail.name} subtitle={trail.region}>
      <Link
        to="/explorar"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ArrowLeft className="size-3.5" /> Explorar
      </Link>

      <div className="overflow-hidden rounded-2xl shadow-card">
        <img src={trail.photo} alt={trail.name} className="h-44 w-full object-cover" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <DifficultyBadge difficulty={trail.difficulty} />
        <button
          onClick={() => social.toggleFavorite(trail.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm",
            fav ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Star className={cn("size-4", fav && "fill-current")} />
          {fav ? "Favoritada" : "Favoritar"}
        </button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{trail.description}</p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <MetricTile label="Distância" value={formatKm(trail.distanceKm)} />
        <MetricTile label="Elevação" value={formatElevation(trail.elevationGainM)} />
        <MetricTile label="Nota" value={`${trail.rating}`} hint={`${trail.ratingCount} avaliações`} />
        <MetricTile label="Terreno" value={trail.terrain} />
        <MetricTile label="Modalidade" value={trail.modality} />
        <MetricTile label="Autor" value={riderById(trail.authorId).ridername} />
      </div>

      <SectionTitle>Mapa</SectionTitle>
      <div className="overflow-hidden rounded-2xl shadow-card">
        <MapView className="h-56 w-full" track={trail.track} pois={pois} />
      </div>

      <SectionTitle>Altimetria</SectionTitle>
      <div className="rounded-2xl bg-card p-2">
        <ElevationChart track={trail.track} />
      </div>

      <SectionTitle>Pontos de apoio</SectionTitle>
      <div className="flex flex-col gap-2">
        {pois.slice(0, 4).map((p) => (
          <div key={p.id} className="flex items-start gap-3 rounded-xl bg-card p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-elevated text-base">
              {poiMeta[p.kind].icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">{poiMeta[p.kind].label}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/gravar"
        className="mt-6 block rounded-xl bg-gradient-primary py-3 text-center text-sm font-semibold text-primary-foreground"
      >
        Gravar esta trilha
      </Link>
    </AppShell>
  );
}
