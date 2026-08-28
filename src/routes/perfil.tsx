import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { MetricTile, RiderAvatar, SectionTitle } from "@/components/trako/primitives";
import { badges, currentRider, ranking, riderById } from "@/data/mock";
import { formatDuration, formatElevation, formatKm } from "@/lib/format";
import { auth, useAuth } from "@/lib/auth-store";
import { useFeedActivities } from "@/lib/recorder-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil de trilheiro | TRAKO" },
      {
        name: "description",
        content:
          "Seu perfil off-road: totais de distância, elevação e tempo, conquistas desbloqueadas e ranking.",
      },
      { property: "og:title", content: "Meu perfil de trilheiro | TRAKO" },
      {
        property: "og:description",
        content: "Nível, XP, conquistas e estatísticas acumuladas das suas trilhas.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { session } = useAuth();
  const feed = useFeedActivities();
  const navigate = useNavigate();

  const mine = feed.filter((a) => a.riderId === currentRider.id);
  const totals = mine.reduce(
    (acc, a) => ({
      km: acc.km + a.stats.distanceKm,
      min: acc.min + a.stats.durationMin,
      gain: acc.gain + a.stats.elevationGainM,
    }),
    { km: 0, min: 0, gain: 0 },
  );
  const xpPct = Math.round((currentRider.xp / currentRider.xpToNext) * 100);

  return (
    <AppShell title="Perfil" subtitle={session?.email ?? currentRider.username}>
      <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
        <RiderAvatar rider={currentRider} size={56} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-display text-lg text-foreground">
            {session?.name ?? currentRider.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {session?.bike ?? currentRider.bike} · {session?.location ?? currentRider.location}
          </p>
          <div className="mt-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
              <div className="h-full bg-gradient-primary" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              Nível {currentRider.level} · {currentRider.levelTitle} · {currentRider.xp}/
              {currentRider.xpToNext} XP
            </p>
          </div>
        </div>
      </div>

      <SectionTitle>Totais</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        <MetricTile label="Atividades" value={String(mine.length)} />
        <MetricTile label="Distância" value={formatKm(totals.km)} />
        <MetricTile label="Tempo" value={formatDuration(totals.min)} />
        <MetricTile label="Elevação" value={formatElevation(totals.gain)} />
        <MetricTile label="Seguidores" value={String(currentRider.followers)} />
        <MetricTile label="Seguindo" value={String(currentRider.following)} />
      </div>

      <SectionTitle>Conquistas</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {badges.map((b) => (
          <div
            key={b.id}
            className={cn(
              "rounded-xl bg-card p-3 text-center",
              !b.unlocked && "opacity-40 grayscale",
            )}
          >
            <p className="text-xl">{b.icon}</p>
            <p className="mt-1 text-[11px] font-semibold text-foreground">{b.name}</p>
          </div>
        ))}
      </div>

      <SectionTitle>Ranking mensal</SectionTitle>
      <div className="flex flex-col gap-2">
        {ranking.map((r) => (
          <div key={r.riderId} className="flex items-center gap-3 rounded-xl bg-card p-3">
            <span className="text-display text-sm text-primary">{r.position}º</span>
            <span className="min-w-0 flex-1 truncate text-sm text-foreground">
              {riderById(r.riderId).ridername}
            </span>
            <span className="text-xs text-muted-foreground">{formatKm(r.distanceKm)}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          auth.signOut();
          navigate({ to: "/entrar", replace: true });
        }}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-surface py-3 text-sm font-semibold text-muted-foreground"
      >
        <LogOut className="size-4" /> Sair da conta
      </button>
    </AppShell>
  );
}
