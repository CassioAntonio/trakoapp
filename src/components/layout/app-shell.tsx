import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Compass, Home, ListOrdered, Radio, User } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { hydrateSession, useAuth } from "@/lib/auth-store";
import { hydrateSocial, useSocial } from "@/lib/social-store";
import { notifications as seedNotifications } from "@/data/mock";
import { hydrateRecorder, useRecorder } from "@/lib/recorder-store";

interface AppShellProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Remove o padding lateral (telas de mapa). */
  bleed?: boolean;
  hideHeader?: boolean;
}

const tabs = [
  { to: "/", label: "Início", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/atividades", label: "Atividades", icon: ListOrdered },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ title, subtitle, action, children, bleed, hideHeader }: AppShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { status } = useRecorder();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col bg-background">
      {!hideHeader && (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
            <div className="min-w-0">
              <h1 className="truncate text-display text-2xl leading-none text-foreground">
                {title ?? "TRAKO"}
              </h1>
              {subtitle && (
                <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {action}
              <Link
                to="/notificacoes"
                aria-label="Notificações"
                className="relative grid size-10 place-items-center rounded-full bg-surface text-foreground transition-colors hover:bg-elevated"
              >
                <Bell className="size-[18px]" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary" />
              </Link>
            </div>
          </div>
        </header>
      )}

      {status !== "idle" && pathname !== "/gravar" && (
        <Link
          to="/gravar"
          className="sticky top-[68px] z-20 flex items-center gap-2 bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Radio className="size-4 animate-pulse" />
          {status === "recording" ? "Gravando atividade — toque para abrir" : "Gravação pausada"}
        </Link>
      )}

      <main className={cn("flex-1 pb-28", bleed ? "" : "px-4 pt-4")}>{children}</main>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[520px] -translate-x-1/2 border-t border-border/70 bg-background/95 backdrop-blur-xl">
        <div className="relative grid grid-cols-5 items-end px-2 pb-3 pt-2">
          {tabs.slice(0, 2).map((t) => (
            <TabLink key={t.to} {...t} active={pathname === t.to} />
          ))}

          <div className="flex justify-center">
            <Link
              to="/gravar"
              aria-label="Gravar atividade"
              className="-mt-7 grid size-16 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform active:scale-95"
            >
              <span className="text-display text-[11px] leading-none">
                {status === "idle" ? "GRAVAR" : "AO VIVO"}
              </span>
            </Link>
          </div>

          {tabs.slice(2).map((t) => (
            <TabLink key={t.to} {...t} active={pathname.startsWith(t.to)} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function TabLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-1 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-[20px]" />
      {label}
    </Link>
  );
}
