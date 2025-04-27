import { Address } from "../business/businessLocation/types";
export const formatAddress = (address: Address | null | undefined): string => {
    if (!address) return '';
    return [address.city || address.locality, address.postcode, address.country]
        .filter(c => c !== undefined && c !== null && c !== '')
        .join(', ');
};

export const isNotEmpty = (str: string) => {
    return str !== "" && str !== null && str !== undefined
}

export const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

  
  /**
   * Calculates the Haversine distance (in miles) between two geographic points.
   */
  export function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  }

  