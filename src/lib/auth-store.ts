import { useSyncExternalStore } from "react";

import { currentRider } from "@/data/mock";
import { loadJson, removeKey, saveJson } from "@/lib/persist";

const KEY = "trako.session.v1";

export interface Session {
  name: string;
  email: string;
  bike: string;
  location: string;
}

interface AuthState {
  session: Session | null;
  hydrated: boolean;
}

let state: AuthState = { session: null, hydrated: false };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function set(patch: Partial<AuthState>) {
  state = { ...state, ...patch };
  emit();
}

/** Chamado uma vez no cliente (evita mismatch de hidratação). */
export function hydrateSession() {
  if (state.hydrated) return;
  set({ session: loadJson<Session | null>(KEY, null), hydrated: true });
}

export const auth = {
  signIn(input: { email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    if (!email.includes("@")) throw new Error("Informe um e-mail válido.");
    if (input.password.length < 6) throw new Error("A senha precisa ter ao menos 6 caracteres.");
    const existing = loadJson<Session | null>(KEY, null);
    const session: Session =
      existing && existing.email === email
        ? existing
        : {
            name: currentRider.name,
            email,
            bike: currentRider.bike,
            location: currentRider.location,
          };
    saveJson(KEY, session);
    set({ session, hydrated: true });
    return session;
  },
  signUp(input: { name: string; email: string; password: string; bike: string }) {
    const email = input.email.trim().toLowerCase();
    if (input.name.trim().length < 3) throw new Error("Informe seu nome completo.");
    if (!email.includes("@")) throw new Error("Informe um e-mail válido.");
    if (input.password.length < 6) throw new Error("A senha precisa ter ao menos 6 caracteres.");
    const session: Session = {
      name: input.name.trim(),
      email,
      bike: input.bike || currentRider.bike,
      location: currentRider.location,
    };
    saveJson(KEY, session);
    set({ session, hydrated: true });
    return session;
  },
  update(patch: Partial<Session>) {
    if (!state.session) return;
    const session = { ...state.session, ...patch };
    saveJson(KEY, session);
    set({ session });
  },
  signOut() {
    removeKey(KEY);
    set({ session: null, hydrated: true });
  },
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useAuth() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => ({ session: null, hydrated: false }) as AuthState,
  );
}
