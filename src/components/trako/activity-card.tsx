import { Link } from "@tanstack/react-router";
import { Heart, MapPin, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

import { DifficultyBadge, RiderAvatar } from "@/components/trako/primitives";
import { TrackThumb } from "@/components/trako/track-thumb";
import { riderById } from "@/data/mock";
import { formatDuration, formatElevation, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types";

export function ActivityCard({ activity }: { activity: Activity }) {
  const rider = riderById(activity.riderId);
  const [liked, setLiked] = useState(Boolean(activity.liked));
  const likes = activity.likes + (liked ? 1 : 0);

  return (
    <article className="overflow-hidden rounded-2xl bg-card shadow-card">
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <RiderAvatar rider={rider} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{rider.ridername}</p>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            {activity.date} · <MapPin className="size-3" /> {activity.location}
          </p>
        </div>
        <DifficultyBadge difficulty={activity.difficulty} />
      </div>

      <Link
        to="/atividades/$activityId"
        params={{ activityId: activity.id }}
        className="block px-4"
      >
        <h3 className="text-display text-lg leading-tight text-foreground">{activity.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {activity.modality} · {activity.bike}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Metric label="Distância" value={formatKm(activity.stats.distanceKm)} />
          <Metric label="Tempo" value={formatDuration(activity.stats.durationMin)} />
          <Metric label="Elevação" value={formatElevation(activity.stats.elevationGainM)} />
        </div>

        <div className="mt-3 h-40 overflow-hidden rounded-xl">
          {activity.photo ? (
            <div className="relative h-full w-full">
              <img
                src={activity.photo}
                alt={activity.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 opacity-70 [background:linear-gradient(to_top,var(--background),transparent)]" />
              <div className="absolute bottom-2 right-2 h-12 w-24 overflow-hidden rounded-md border border-border/60 bg-background/70">
                <TrackThumb track={activity.track} className="bg-transparent" />
              </div>
            </div>
          ) : (
            <TrackThumb track={activity.track} />
          )}
        </div>
      </Link>

      <div className="mt-1 flex items-center gap-1 px-2 py-2">
        <Action
          icon={<Heart className={cn("size-[18px]", liked && "fill-primary text-primary")} />}
          label={String(likes)}
          onClick={() => setLiked((v) => !v)}
        />
        <Link
          to="/atividades/$activityId"
          params={{ activityId: activity.id }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <MessageCircle className="size-[18px]" />
          {activity.comments.length}
        </Link>
        <Action icon={<Share2 className="size-[18px]" />} label="Compartilhar" />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-metric text-base text-foreground">{value}</p>
    </div>
  );
}

function Action({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
    >
      {icon}
      {label}
    </button>
  );
}
