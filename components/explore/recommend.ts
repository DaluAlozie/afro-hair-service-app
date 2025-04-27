import { BusinessSummary } from "./types";
import { Address } from "../business/businessLocation/types";
import { supabaseClient } from "@/utils/auth/supabase";
import { haversineDistance } from "./utils";

interface SimilarProfile {
  profile_id: string;
  similarity: number;
}

interface VisitCount {
  business_id: number;
  visits: number;
}

// 1) Fetch the current user's vector embedding (or null)
async function getUserEmbedding(): Promise<number[] | null> {
  const supabase = await supabaseClient;
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return null;

  const { data: profile, error: profErr } = await supabase
    .from("Profile")
    .select("embedding")
    .eq("id", user.id)
    .single();

  if (profErr || !profile?.embedding) return null;
  return profile.embedding;
}

// 2) Call the pgvector RPC to find similar user‑profiles
async function getSimilarProfiles(
  embedding: number[],
  minSimilarity = 0.5
): Promise<SimilarProfile[]> {
  const supabase = await supabaseClient;
  const { data, error } = await supabase
    .rpc("find_similar_profiles_", {
      query_embedding: embedding,
      min_similarity: minSimilarity,
    });
  if (error || !data) return [];
  return data;
}

// 3) Count how many times those similar users have booked each business
async function getVisitCounts(
  customerIds: string[]
): Promise<VisitCount[]> {
  const supabase = await supabaseClient;
  const { data, error } = await supabase
    .from("appointment_summaries")
    .select("business_id, visits: id.count()")
    .in("customer_id", customerIds);

  if (error || !data) return [];
  return data;
}

/**
 * Orchestrates the above to recommend businesses by CF visit frequency,
 * falling back to the original list if anything goes wrong.
 */
export async function recommendBusinesses(
  businesses: BusinessSummary[],
  address?: Address,
  alpha = 0.7,
  beta = 0.1
): Promise<BusinessSummary[]> {
  if (!address) return businesses;

  const embedding = await getUserEmbedding();
  if (!embedding) {
    console.warn("No embedding found — skipping CF recommendations");
    return businesses;
  }

  const sims = await getSimilarProfiles(embedding, 0.5);
  if (sims.length === 0) {
    console.warn("No similar users — skipping CF recommendations");
    return businesses;
  }

  const visitCounts = await getVisitCounts(sims.map((s) => s.profile_id));
  if (visitCounts.length === 0) {
    console.warn("No collaborative-filtering data — skipping CF recommendations");
    return businesses;
  }

  // Build a frequency map: business_id -> number of visits
  const freqMap = new Map<number, number>();
  visitCounts.forEach(({ business_id, visits }) => {
    freqMap.set(business_id, visits);
  });

  // Compute a recommendation score for each business
  const scored = businesses.map((b) => {
    const frequency = freqMap.get(b.id) ?? 0;
    const minDistance = b.locations.length > 0
      ? Math.min(...b.locations.map((loc) =>
          haversineDistance(
            address.latitude, address.longitude,
            loc.latitude, loc.longitude
          )
        ))
      : Infinity;

    const score = -1*alpha * frequency + (1 - alpha) * Math.exp(beta * minDistance);
    return { business: b, score };
  });

  // Sort businesses by ascending score (lower is better)
  scored.sort((a, b) => a.score - b.score);

  return scored.map(({ business }) => business);
}
