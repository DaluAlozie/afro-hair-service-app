import { Address } from "../business/businessLocation/types";
import { BusinessSummary } from "./types";
import { haversineDistance } from "./utils";

  export interface SearchParams {
    alpha?: number;    // weight for text similarity [0,1]
    beta?: number;     // distance penalization factor (>0)
    gamma?: number;    // number of top features to average
    cutoff?: number;   // optional max combined score; businesses above this are filtered out
  }
  
  /**
   * Computes the Levenshtein distance between two strings.
   */
  export function levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
  
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  }
  
  interface ScoredBusiness {
    business: BusinessSummary;
    score: number;
    distance: number;
  }
  
  /**
   * Computes the ranking score for a single business.
   */
  export function transformBusiness(
    query: string,
    business: BusinessSummary,
    userLat: number,
    userLon: number,
    alpha: number,
    beta: number,
    gamma: number
  ): { score: number; distance: number } {
    // Gather textual features
    const features: string[] = [
      business.name,
      ...business.tags,
      ...business.services,
      ...business.service_descriptions,
      ...business.styles,
      ...business.style_descriptions,
      ...business.variants,
    ];
    
    // Compute Levenshtein distances
    const dists = features
      .map(f => levenshtein(query.toLowerCase(), f.toLowerCase()))
      .sort((a, b) => a - b);
  
    // Average of the smallest gamma distances
    const topK = dists.slice(0, Math.min(dists.length, gamma));
    const semanticScore = topK.reduce((sum, v) => sum + v, 0) / topK.length;
  
    // Compute geographic proximity
    const distsGeo = business.locations
      .filter(loc => loc.enabled)
      .map(loc => haversineDistance(userLat, userLon, loc.latitude, loc.longitude));
    const distGeo = distsGeo.length ? Math.min(...distsGeo) : Infinity;
  
    // Final combined score
    const combined = alpha * semanticScore + (1 - alpha) * Math.exp(beta * distGeo);
    return { score: combined, distance: distGeo };
  }
  
/**
 * Searches and ranks businesses based on textual query and user location.
 * Supports an optional score cutoff to filter out low-relevance results.
 */
export function searchBusinesses(
    query: string,
    userLocation: Address,
    businesses: BusinessSummary[],
    params: SearchParams = {}
  ): BusinessSummary[] {
    const { alpha = 0.5, beta = 0.1, gamma = 3, cutoff  = 1} = params;
  
    // Score each business
    let scored: ScoredBusiness[] = businesses.map(b => {
      const { score, distance } = transformBusiness(
        query,
        b,
        userLocation.latitude,
        userLocation.longitude,
        alpha,
        beta,
        gamma
      );
      return { business: b, score, distance };
    });
  
    // Apply optional cutoff filter
    if (typeof cutoff === 'number') {
      scored = scored.filter(item => item.score <= cutoff);
    }
  
    // Sort by recommended score ascending
    scored.sort((a, b) => a.score - b.score);
  
    return scored.map(item => item.business);
}
  