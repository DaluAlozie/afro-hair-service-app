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

export * from './filterBusinesses';
