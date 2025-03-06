import { Address } from "../business/businessLocation/types";
import { Location } from "../business/types";

interface BusinessSummary {
    id: number,
    name: string,
    description: string,
    rating: number,
    services: string[],
    service_descriptions: string[],
    styles: string[],
    style_descriptions: string[],
    add_ons: string[],
    variants: string[],
    tags: string[],
    owner_id: number,
    locations: Location[],
}

type Radius = "1" | "5" | "10" | "25" | "any";
type Rating = "1" | "2" | "3" | "4" | "5" | "any";
interface Filters {
    searchInput: string,
    address: Address | undefined,
    radius: Radius,
    rating: Rating,
    sortBy: SortBy,
}

type SortBy = 'rating' | 'distance' | 'recommended';

export { BusinessSummary, Filters, SortBy, Radius, Rating };