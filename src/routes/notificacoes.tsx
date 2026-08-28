import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { notifications } from "@/data/mock";
import { social, useSocial } from "@/lib/social-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notificacoes")({
  head: () => ({
    meta: [
      { title: "Notificações | TRAKO" },
      {
        name: "description",
        content:
          "Curtidas, comentários, convites de grupos e novos desafios das suas trilhas off-road.",
      },
      { property: "og:title", content: "Notificações | TRAKO" },
      {
        property: "og:description",
        content: "Acompanhe interações da comunidade e conquistas desbloqueadas.",
      },
    ],
  }),
  component: NotificationsPage,
});

const icons: Record<string, string> = {
  follow: "👤",
  like: "❤️",
  comment: "💬",
  group: "🤝",
  challenge: "🏁",
  badge: "🏆",
  event: "📅",
  route: "🗺",
};

function NotificationsPage() {
  const { readNotifications } = useSocial();

  return (
    <AppShell
      title="Notificações"
      action={
        <button
          onClick={() => social.markAllNotificationsRead(notifications.map((n) => n.id))}
          className="rounded-full bg-surface px-3 py-2 text-[11px] font-semibold text-muted-foreground"
        >
          Marcar lidas
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        {notifications.map((n) => {
          const read = n.read || readNotifications[n.id];
          return (
            <button
              key={n.id}
              onClick={() => social.markNotificationRead(n.id)}
              className={cn(
                "flex items-start gap-3 rounded-xl p-3 text-left",
                read ? "bg-card" : "bg-surface",
              )}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-elevated text-base">
                {icons[n.kind] ?? "🔔"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-foreground">{n.text}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">{n.time}</span>
              </span>
              {!read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}
