import { Location } from '@/components/business/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAddressPart = (type: string, addressComponents: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = addressComponents.find((c: { types: string | any[]; }) => c.types.includes(type));
    if (component) {
        return component.longText;
    }
    return '';
};
const formatLocation = (location: Location | null | undefined): string => {
    if (!location) return '';
    return [location.street_address, location.flat_number, location.city, location.postcode, location.country]
        .map(c => c?.trim())
        .filter(c => c !== undefined && c !== null && c !== '')
        .join(', ');
};

export { getAddressPart, formatLocation };