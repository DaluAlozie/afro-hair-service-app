import { Address } from "../business/businessLocation/types";
import { recommendBusinesses } from "./recommend";
import { searchBusinesses } from "./search";
import { BusinessSummary, Filters, SortBy } from "./types";
import { haversineDistance } from "./utils";



// Calculate the minimum distance between a business and an address
const calculateMinDistance = (business: BusinessSummary, address: Address|undefined): number => {
    return Math.min(...business.locations.map(loc => haversineDistance(
        loc.latitude, loc.longitude, (address || loc).latitude, (address || loc).longitude
    )));
};

const filterByRadius = (business: BusinessSummary, address: Address, radius: string): boolean => {
    if (radius === 'any') return true;
    return business.locations.some(location => haversineDistance(
        location.latitude, location.longitude, address.latitude, address.longitude
    ) <= parseInt(radius));
};

const filterByRating = (business: BusinessSummary, rating: string): boolean => {
    if (rating === 'any') return true;
    return business.rating >= parseInt(rating);
};


const sortBusinesses = async (businesses: BusinessSummary[], sortBy: SortBy, address: Address|undefined): Promise<BusinessSummary[]> => {
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
            return await recommendBusinesses(businesses, address);
        default:
            return businesses;
    }
};

export const filterBusiness = async (businesses: BusinessSummary[], filter: Filters): Promise<[BusinessSummary, number][]> => {
    const scores = new Map<number, number>();

    const matchingBusinesses = searchBusinesses(
        filter.searchInput,
        filter.address || { latitude: 55.3781, longitude: 3.4360 } as Address,
        businesses,
        { alpha: 0.5, beta: 0.1, gamma: 10, cutoff: 1.7 },
    );

    let filteredBusinesses = matchingBusinesses.filter(business =>
        filterByRadius(business, filter.address!, filter.radius) && filterByRating(business, filter.rating)
    );

    filteredBusinesses = await sortBusinesses(filteredBusinesses, filter.sortBy, filter.address);
    filteredBusinesses = filteredBusinesses.filter(business => scores.get(business.id)! > 0);

    return filteredBusinesses.map(business => [business, calculateMinDistance(business, filter.address)]);
}
