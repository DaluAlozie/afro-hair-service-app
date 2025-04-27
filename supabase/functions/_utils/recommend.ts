import { supabase } from "./supabase.ts";

// --- Constants & Mappings ---
export const MAX_HAIR_LEN = 36;
export const MAX_AGE = 100;
export const MAX_SCALP = 3;
export const MAX_CURL = 12;
export const MAX_RATING = 5;

export const categories = [
  "wave", "locs", "silk press", "wig", "braid", "knots", "knotless",
  "fade", "skin", "tape", "trim", "beard", "wash", "pick",
  "cornrow", "stitch", "straight", "dutch", "french", "crochet",
  "weave", "afro"
];

export const scalpMap: Record<string, number> = {
  not_sensitive: 1, slightly_sensitive: 2, very_sensitive: 3,
};
export const curlMap: Record<string, number> = {
  "1a": 1, "1b": 2, "1c": 3,
  "2a": 4, "2b": 5, "2c": 6,
  "3a": 7, "3b": 8, "3c": 9,
  "4a": 10, "4b": 11, "4c": 12,
};

// --- Interfaces ---
export interface ProfileData {
  hair_length: number;
  scalp_sensitivity: keyof typeof scalpMap;
  curl_pattern: keyof typeof curlMap;
  age: number;
}
export interface AppointmentRow {
  business: string;
  service: string;
  style: string;
  variant: string;
  rating: number | null;
}
export interface Stats {
  avgRating: number;
  freqVec: number[];
}

// --- Data Fetching ---
export async function fetchProfile(userId: string): Promise<ProfileData> {
  const { data, error } = await supabase
    .from("Profile")
    .select("hair_length, scalp_sensitivity, curl_pattern, age")
    .eq("id", userId)
    .single();
  if (error || !data) throw new Error("Profile fetch error");
  return data;
}

export async function fetchAppointments(userId: string): Promise<AppointmentRow[]> {
  const { data, error } = await supabase
    .from("appointment_summaries")
    .select("business, service, style, variant, rating")
    .eq("customer_id", userId);
  if (error || !data) throw new Error("Appointments fetch error");
  return data;
}

// --- Embedding Computation ---
export function computeStats(apps: AppointmentRow[]): Stats {
  // Average rating
  const ratings = apps.map(a => a.rating).filter((r): r is number => r !== null);
  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    : 0;

  // Category frequency
  const counts = new Map<string, number>();
  apps.forEach(({ business, service, style, variant }) => {
    const text = [business, service, style, variant].join(' ').toLowerCase();
    categories.forEach(cat => {
      if (text.includes(cat)) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    });
  });
  const total = apps.length || 1;
  const freqVec = categories.map(cat => (counts.get(cat) ?? 0) / total);

  return { avgRating, freqVec };
}

export function normaliseFeatures(profile: ProfileData, stats: Stats): number[] {
  const raw = [
    profile.hair_length / MAX_HAIR_LEN,
    (scalpMap[profile.scalp_sensitivity] || 1) / MAX_SCALP,
    (curlMap[profile.curl_pattern] || 1) / MAX_CURL,
    profile.age / MAX_AGE,
    stats.avgRating / MAX_RATING,
    ...stats.freqVec,
  ];
  const norm = Math.hypot(...raw) || 1;
  return raw.map(v => v / norm);
}

// --- Storage ---
export async function upsertEmbedding(userId: string, embedding: number[]) {
  const { error } = await supabase
    .from("Profile")
    .update({ embedding })
    .eq("id", userId);
  if (error) throw new Error("Embedding upsert error");
}
