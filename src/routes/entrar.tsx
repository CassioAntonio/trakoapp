import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, MountainSnow } from "lucide-react";

import { auth, hydrateSession, useAuth } from "@/lib/auth-store";
import { bikes } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar no TRAKO — sua conta de trilheiro" },
      {
        name: "description",
        content:
          "Acesse sua conta TRAKO para gravar trilhas por GPS, acompanhar estatísticas e seguir a comunidade off-road.",
      },
      { property: "og:title", content: "Entrar no TRAKO" },
      {
        property: "og:description",
        content: "Sua rota. Sua trilha. Entre e comece a gravar suas pilotadas off-road.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, hydrated } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [form, setForm] = useState({ name: "", email: "", password: "", bike: bikes[0] });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hydrateSession();
  }, []);

  useEffect(() => {
    if (hydrated && session) navigate({ to: "/", replace: true });
  }, [hydrated, session, navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "in") auth.signIn({ email: form.email, password: form.password });
      else auth.signUp(form);
      navigate({ to: "/", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center gap-6 bg-background px-5 py-10">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <MountainSnow className="size-4" /> Off-road
        </span>
        <h1 className="text-display mt-4 text-4xl leading-none text-foreground">TRAKO</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sua rota. Sua trilha. Grave suas pilotadas com GPS, mapa e estatísticas reais.
        </p>
      </div>

      <div className="flex gap-2">
        {(
          [
            ["in", "Entrar"],
            ["up", "Criar conta"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMode(value);
              setError(null);
            }}
            className={cn(
              "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              mode === value
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === "up" && (
          <Field label="Nome completo">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Como aparece no seu perfil"
              className="input-trako"
              autoComplete="name"
            />
          </Field>
        )}
        <Field label="E-mail">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="voce@email.com"
            className="input-trako"
            autoComplete="email"
          />
        </Field>
        <Field label="Senha">
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="mínimo 6 caracteres"
            className="input-trako"
            autoComplete={mode === "in" ? "current-password" : "new-password"}
          />
        </Field>
        {mode === "up" && (
          <Field label="Sua moto">
            <select
              value={form.bike}
              onChange={(e) => setForm({ ...form, bike: e.target.value })}
              className="input-trako"
            >
              {bikes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
        )}

        {error && (
          <p className="rounded-lg bg-elevated px-3 py-2 text-xs font-semibold text-extreme">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {mode === "in" ? "Entrar" : "Criar minha conta"}
        </button>
        <p className="text-center text-[11px] text-muted-foreground">
          Sessão salva neste dispositivo. Nenhum dado é enviado para servidores externos.
        </p>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
