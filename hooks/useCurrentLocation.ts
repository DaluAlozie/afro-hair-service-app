import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Address } from "@/components/business/businessLocation/types";
import { useQuery } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAddressPart = (type: string, addressComponents: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = addressComponents.find((c: { types: string | any[]; }) => c.types.includes(type));
    if (component) {
        return component.long_name;
    }
    return '';
};
export const useCurrentLocation = () => {
    const[currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        async function getCurrentLocation() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
        }
        getCurrentLocation();
    }, []);

    const fetchCurrentAddress = async (
        { queryKey }: { queryKey: [string, { currentLocation: Location.LocationObject | null }] }
    ): Promise<Address | null> => {
        const [, { currentLocation }] = queryKey;
        if (!currentLocation) return null;
        const lat = currentLocation?.coords.latitude;
        const long = currentLocation?.coords.longitude;
        const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
        );
        const data = await response.json();
        const addressComponents = data.results[0].address_components;
        const location = data.results[0].geometry.location;
        const res =  {
            streetAddress: `${getAddressPart('street_number', addressComponents)??""} ${getAddressPart('route', addressComponents)}`,
            city: getAddressPart('postal_town', addressComponents),
            postcode: getAddressPart('postal_code', addressComponents),
            country: getAddressPart('country', addressComponents),
            locality: getAddressPart('locality', addressComponents),
            longitude: location.lng,
            latitude: location.lat,
        };
        return res;
    };

    const { data: currentAddress, isFetching } = useQuery({
        queryKey: ['fetchCurrentAddress', { currentLocation }],
        queryFn: fetchCurrentAddress,
        initialData: null,
    });

    return { currentLocation, currentAddress, isFetching };
}
