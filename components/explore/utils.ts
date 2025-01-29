import { Address } from "../business/businessLocation/types";
export const formatAddress = (address: Address | null | undefined): string => {
    if (!address) return '';
    return [address.city || address.locality, address.postcode, address.country]
        .filter(c => c !== undefined && c !== null && c !== '')
        .join(', ');
};

export * from './filterBusinesses';
