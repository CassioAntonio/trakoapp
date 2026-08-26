import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Users } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { ActivityCard } from "@/components/trako/activity-card";
import { Chip, SectionTitle } from "@/components/trako/primitives";
import { challenges, currentRider, groups } from "@/data/mock";
import { formatKm } from "@/lib/format";
import { useFeedActivities } from "@/lib/recorder-store";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRAKO — Feed de trilhas off-road" },
      {
        name: "description",
        content:
          "Acompanhe as trilhas da sua comunidade off-road: distância, elevação, traçado no mapa e desafios da semana.",
      },
      { property: "og:title", content: "TRAKO — Feed de trilhas off-road" },
      {
        property: "og:description",
        content: "Sua rota. Sua trilha. Gravação por GPS, mapas e estatísticas de cada pilotada.",
      },
    ],
  }),
  component: HomeFeed,
});

const filters = ["Seguindo", "Meu clube", "Perto de mim", "Destaques"] as const;

function HomeFeed() {
  const feed = useFeedActivities();
  const [filter, setFilter] = useState<string>(filters[0]);
  const challenge = challenges[0];

  return (
    <AppShell
      title="TRAKO"
      subtitle={`Bom dia, ${currentRider.name.split(" ")[0]} · ${formatKm(currentRider.totalDistanceKm)} no total`}
    >
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </div>

      <Link
        to="/desafios"
        className="mt-4 block overflow-hidden rounded-2xl bg-gradient-dusk p-4 shadow-card"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
          <Trophy className="size-4" /> Desafio da semana
        </div>
        <p className="text-display mt-1 text-lg text-foreground">{challenge.title}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-elevated">
          <div className="h-full bg-gradient-primary" style={{ width: `${challenge.progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {challenge.progress}% concluído · {challenge.participants.toLocaleString("pt-BR")}{" "}
          participantes
        </p>
      </Link>

      <SectionTitle
        action={
          <Link to="/explorar" className="text-xs font-semibold text-primary">
            Explorar trilhas
          </Link>
        }
      >
        Atividades recentes
      </SectionTitle>

      <div className="flex flex-col gap-4">
        {feed.map((a) => (
          <ActivityCard key={a.id} activity={a} />
        ))}
      </div>

      <SectionTitle>Grupos sugeridos</SectionTitle>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {groups.map((g) => (
          <div key={g.id} className="w-56 shrink-0 overflow-hidden rounded-2xl bg-card shadow-card">
            <img src={g.photo} alt={g.name} loading="lazy" className="h-24 w-full object-cover" />
            <div className="p-3">
              <p className="text-display text-sm leading-tight text-foreground">{g.name}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3" /> {g.members.toLocaleString("pt-BR")} membros
              </p>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
