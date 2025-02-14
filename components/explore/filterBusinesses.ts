import { Address } from "../business/businessLocation/types";
import { BusinessSummary, Filters, SortBy } from "./types";

const EARTH_RADIUS_MILES = 3958.8; // Earth's radius in miles

const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

export const calculateDistance = (
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
): number => {
    const lat1 = toRadians(latitude1);
    const lon1 = toRadians(longitude1);
    const lat2 = toRadians(latitude2);
    const lon2 = toRadians(longitude2);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_MILES * c;
};

// Calculate the minimum distance between a business and an address
const calculateMinDistance = (business: BusinessSummary, address: Address|undefined): number => {
    return Math.min(...business.locations.map(loc => calculateDistance(
        loc.latitude, loc.longitude, (address || loc).latitude, (address || loc).longitude
    )));
};

const filterByRadius = (business: BusinessSummary, address: Address, radius: string): boolean => {
    if (radius === 'any') return true;
    return business.locations.some(location => calculateDistance(
        location.latitude, location.longitude, address.latitude, address.longitude
    ) <= parseInt(radius));
};

const filterByRating = (business: BusinessSummary, rating: string): boolean => {
    if (rating === 'any') return true;
    return business.rating >= parseInt(rating);
};

const matchBusiness = (business: BusinessSummary, search: string): number => {
    if (!search) return 1; // Default score if no search input is provided
    const searchLower = search.toLowerCase();
    let score = 0;

    if (business.name.toLowerCase().includes(searchLower)) score += 5;
    if (business.description.toLowerCase().includes(searchLower)) score += 3;
    if (business.tags.some(tag => tag.toLowerCase().includes(searchLower))) score += 2;

    return score;
};

const sortBusinesses = (businesses: BusinessSummary[], sortBy: SortBy, address: Address|undefined): BusinessSummary[] => {
    switch (sortBy) {
        case 'distance':
            return businesses.sort((a, b) => {
                const distA = calculateMinDistance(a, address);
                const distB = calculateMinDistance(b, address);
                return distA - distB;
            });
        case 'rating':
            return businesses.sort((a, b) => b.rating - a.rating);
        case 'recommended':
            return recommendBusinesses(businesses, address);
        default:
            return businesses;
    }
};

export const filterBusiness = (businesses: BusinessSummary[], filter: Filters): [BusinessSummary, number][] => {
    const scores = new Map<number, number>();
    for (const business of businesses) {
        scores.set(business.id, matchBusiness(business, filter.searchInput));
    }

    let filteredBusinesses = businesses.filter(business =>
        filterByRadius(business, filter.address!, filter.radius) && filterByRating(business, filter.rating)
    );

    filteredBusinesses = sortBusinesses(filteredBusinesses, filter.sortBy, filter.address);
    filteredBusinesses = filteredBusinesses.filter(business => scores.get(business.id)! > 0);

    return filteredBusinesses.map(business => [business, calculateMinDistance(business, filter.address)]);
}

const recommendBusinesses = (businesses: BusinessSummary[], address: Address|undefined): BusinessSummary[] => {
    return businesses.map(business => {
        const minDistance = calculateMinDistance(business, address);
        const ratingScore = business.rating * 10; // Give higher weight to rating
        const distanceScore = Math.max(0, (100 - minDistance)); // Businesses closer get a higher score
        const popularityScore = (business.services.length * 2); // More services = better score

        // Final score calculation (adjust weights as needed)
        const finalScore = (ratingScore * 0.5) + (distanceScore * 0.3) + (popularityScore * 0.2);

        return { ...business, finalScore };
    }).sort((a, b) => b.finalScore - a.finalScore); // Sort by highest score
};
