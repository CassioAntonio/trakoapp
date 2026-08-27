import { useSyncExternalStore } from "react";

import { loadJson, saveJson } from "@/lib/persist";
import type { Comment } from "@/types";

const KEY = "trako.social.v1";

interface SocialState {
  likes: Record<string, boolean>;
  comments: Record<string, Comment[]>;
  favorites: Record<string, boolean>;
  joinedGroups: Record<string, boolean>;
  joinedChallenges: Record<string, boolean>;
  readNotifications: Record<string, boolean>;
}

const empty: SocialState = {
  likes: {},
  comments: {},
  favorites: {},
  joinedGroups: {},
  joinedChallenges: {},
  readNotifications: {},
};

let state: SocialState = empty;
let hydrated = false;
const listeners = new Set<() => void>();

function set(patch: Partial<SocialState>) {
  state = { ...state, ...patch };
  saveJson(KEY, state);
  listeners.forEach((l) => l());
}

export function hydrateSocial() {
  if (hydrated) return;
  hydrated = true;
  state = { ...empty, ...loadJson<Partial<SocialState>>(KEY, {}) };
  listeners.forEach((l) => l());
}

const toggle = (map: Record<string, boolean>, id: string) => ({ ...map, [id]: !map[id] });

export const social = {
  toggleLike: (id: string) => set({ likes: toggle(state.likes, id) }),
  toggleFavorite: (id: string) => set({ favorites: toggle(state.favorites, id) }),
  toggleGroup: (id: string) => set({ joinedGroups: toggle(state.joinedGroups, id) }),
  toggleChallenge: (id: string) => set({ joinedChallenges: toggle(state.joinedChallenges, id) }),
  addComment(activityId: string, text: string, riderId: string) {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      riderId,
      text: text.trim(),
      createdAt: "agora",
    };
    set({
      comments: {
        ...state.comments,
        [activityId]: [...(state.comments[activityId] ?? []), comment],
      },
    });
  },
  markAllNotificationsRead(ids: string[]) {
    const read = { ...state.readNotifications };
    ids.forEach((id) => (read[id] = true));
    set({ readNotifications: read });
  },
  markNotificationRead: (id: string) =>
    set({ readNotifications: { ...state.readNotifications, [id]: true } }),
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useSocial() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => empty,
  );
}
