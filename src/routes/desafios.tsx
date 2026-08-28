import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/trako/primitives";
import { challenges, groups } from "@/data/mock";
import { social, useSocial } from "@/lib/social-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desafios")({
  head: () => ({
    meta: [
      { title: "Desafios e grupos | TRAKO" },
      {
        name: "description",
        content:
          "Participe de desafios mensais de distância e elevação e entre em grupos de trilheiros da sua região.",
      },
      { property: "og:title", content: "Desafios e grupos | TRAKO" },
      {
        property: "og:description",
        content: "Metas de km, elevação e regiões inéditas, com badges e XP como recompensa.",
      },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const { joinedChallenges, joinedGroups } = useSocial();

  return (
    <AppShell title="Desafios" subtitle="Metas da comunidade off-road">
      <div className="flex flex-col gap-3">
        {challenges.map((c) => {
          const joined = Boolean(joinedChallenges[c.id]);
          return (
            <article key={c.id} className="rounded-2xl bg-card p-4 shadow-card">
              <h3 className="text-display text-base text-foreground">{c.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated">
                <div className="h-full bg-gradient-primary" style={{ width: `${c.progress}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Meta {c.goal} · {c.progress}% · {c.startsAt} a {c.endsAt}
              </p>
              <p className="mt-1 text-[11px] text-primary">{c.reward}</p>
              <button
                onClick={() => social.toggleChallenge(c.id)}
                className={cn(
                  "mt-3 w-full rounded-xl py-2.5 text-sm font-semibold",
                  joined
                    ? "bg-surface text-muted-foreground"
                    : "bg-gradient-primary text-primary-foreground",
                )}
              >
                {joined ? "Participando" : "Participar"}
              </button>
            </article>
          );
        })}
      </div>

      <SectionTitle>Grupos sugeridos</SectionTitle>
      <div className="flex flex-col gap-2">
        {groups.map((g) => {
          const joined = Boolean(joinedGroups[g.id]);
          return (
            <div key={g.id} className="flex items-center gap-3 rounded-xl bg-card p-3">
              <img src={g.photo} alt={g.name} className="size-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{g.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {g.region} · {g.members} membros
                </p>
              </div>
              <button
                onClick={() => social.toggleGroup(g.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold",
                  joined ? "bg-surface text-muted-foreground" : "bg-primary text-primary-foreground",
                )}
              >
                {joined ? "Membro" : "Entrar"}
              </button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
