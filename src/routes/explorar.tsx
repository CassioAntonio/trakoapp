import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { MapView } from "@/components/map/map-view";
import { Chip, SectionTitle } from "@/components/trako/primitives";
import { TrailCard } from "@/components/trako/trail-card";
import { poiMeta, pois, trails } from "@/data/mock";
import { difficultyLabel } from "@/lib/format";
import type { Difficulty } from "@/types";

export const Route = createFileRoute("/explorar")({
  head: () => ({
    meta: [
      { title: "Explorar trilhas | TRAKO" },
      {
        name: "description",
        content:
          "Descubra trilhas off-road por região, dificuldade e terreno, com mapa, pontos de apoio e avaliações da comunidade.",
      },
      { property: "og:title", content: "Explorar trilhas | TRAKO" },
      {
        property: "og:description",
        content: "Mapa de trilhas, postos, água, perigos e mirantes marcados por trilheiros.",
      },
    ],
  }),
  component: ExplorePage,
});

const difficulties: Difficulty[] = ["easy", "moderate", "hard", "extreme"];

function ExplorePage() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(
    () =>
      trails.filter((t) => {
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q ||
          t.name.toLowerCase().includes(q) ||
          t.region.toLowerCase().includes(q) ||
          t.terrain.toLowerCase().includes(q);
        return matchQuery && (!difficulty || t.difficulty === difficulty);
      }),
    [query, difficulty],
  );

  return (
    <AppShell title="Explorar" subtitle="Trilhas, pontos de apoio e rotas da comunidade">
      <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar trilha, região ou terreno"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        <Chip active={!difficulty} onClick={() => setDifficulty(null)}>
          Todas
        </Chip>
        {difficulties.map((d) => (
          <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
            {difficultyLabel[d]}
          </Chip>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl shadow-card">
        <MapView
          className="h-64 w-full"
          track={filtered[0]?.track ?? trails[0].track}
          pois={pois}
        />
      </div>

      <SectionTitle>{filtered.length} trilhas encontradas</SectionTitle>
      <div className="flex flex-col gap-3">
        {filtered.map((t) => (
          <TrailCard key={t.id} trail={t} />
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground">
            Nenhuma trilha com esses filtros. Tente ampliar a busca.
          </p>
        )}
      </div>

      <SectionTitle>Pontos de apoio no mapa</SectionTitle>
      <div className="flex flex-col gap-2">
        {pois.map((p) => (
          <div key={p.id} className="flex items-start gap-3 rounded-xl bg-card p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-elevated text-base">
              {poiMeta[p.kind].icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {poiMeta[p.kind].label} · nota {p.rating}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
