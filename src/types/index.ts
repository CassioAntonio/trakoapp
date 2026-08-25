export type Difficulty = "easy" | "moderate" | "hard" | "extreme";

export type Modality =
  | "Enduro"
  | "Trilha"
  | "Rally"
  | "Motocross"
  | "Adventure"
  | "Trail"
  | "Hard Enduro"
  | "Dual Sport"
  | "Passeio Off-Road";

export type Privacy = "public" | "followers" | "private";

export interface GeoPoint {
  lat: number;
  lng: number;
  /** metros */
  altitude?: number;
  /** km/h */
  speed?: number;
  /** graus */
  heading?: number;
  /** epoch ms */
  timestamp?: number;
}

export interface Rider {
  id: string;
  name: string;
  ridername: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  bike: string;
  displacement: string;
  modalities: Modality[];
  level: number;
  levelTitle: string;
  xp: number;
  xpToNext: number;
  followers: number;
  following: number;
  activityCount: number;
  totalDistanceKm: number;
  totalElevationM: number;
  totalTimeMin: number;
  longestRideKm: number;
}

export interface ActivityStats {
  distanceKm: number;
  durationMin: number;
  movingMin: number;
  avgSpeed: number;
  maxSpeed: number;
  elevationGainM: number;
  elevationLossM: number;
  minAltitudeM: number;
  maxAltitudeM: number;
  pauses: number;
}

export interface Activity {
  id: string;
  riderId: string;
  title: string;
  modality: Modality;
  difficulty: Difficulty;
  date: string;
  location: string;
  privacy: Privacy;
  photo: string;
  bike: string;
  stats: ActivityStats;
  track: GeoPoint[];
  likes: number;
  liked?: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  riderId: string;
  text: string;
  createdAt: string;
}

export interface Trail {
  id: string;
  name: string;
  description: string;
  region: string;
  distanceKm: number;
  elevationGainM: number;
  difficulty: Difficulty;
  terrain: string;
  modality: Modality;
  rating: number;
  ratingCount: number;
  authorId: string;
  photo: string;
  track: GeoPoint[];
  favorite?: boolean;
}

export type PoiKind =
  | "fuel"
  | "water"
  | "camp"
  | "food"
  | "danger"
  | "workshop"
  | "meeting"
  | "viewpoint"
  | "landmark";

export interface Poi {
  id: string;
  kind: PoiKind;
  name: string;
  description: string;
  lat: number;
  lng: number;
  rating: number;
}

export interface Group {
  id: string;
  name: string;
  region: string;
  description: string;
  photo: string;
  members: number;
  trails: number;
  events: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  progress: number;
  participants: number;
  reward: string;
  startsAt: string;
  endsAt: string;
}

export interface RankingEntry {
  riderId: string;
  position: number;
  distanceKm: number;
  elevationM: number;
  activities: number;
  timeMin: number;
}

export interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface AppNotification {
  id: string;
  kind: "follow" | "like" | "comment" | "group" | "challenge" | "badge" | "event" | "route";
  text: string;
  time: string;
  read: boolean;
}
