/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme, ScrollView, Text, View } from 'tamagui';
import * as Location from 'expo-location';
import { UseThemeResult } from '@tamagui/core';
import Pressable from '@/components/utils/Pressable';
import { StyleSheet } from 'react-native';
import PageSpinner from '@/components/utils/loading/PageSpinner';
import SearchBar from '@/components/utils/SearchBar';
import { Address } from './types';
import { getAddressPart } from './utils';

type Place = {
    name: string;
    placeId: string;
};

type LocationSearchProps = {
    address:  Address | null;
    setAddress: (location: Address) => void;
    resultsVisible: boolean;
    showResults: () => void;
    hideResults: () => void;
};



export default function LocationSearch({ setAddress, resultsVisible, showResults, hideResults }: LocationSearchProps) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [input, setInput] = useState('');
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const theme = useTheme();
    const styles = makeStyles(theme);

    useEffect(() => {
        async function getCurrentLocation() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }
        getCurrentLocation();
      }, []);

    const fetchPlaces = async (
        { queryKey }: { queryKey: [string, { input: string, location: Location.LocationObject | null }] }
    ): Promise<Place[]> => {
        const [, { input }] = queryKey

        if (!input) return ([] as Place[]);
        const response = await fetch("https://places.googleapis.com/v1/places:autocomplete",
            {
                method: "POST",
                    body: JSON.stringify({
                    input,
                    locationBias: location ? { circle:  {
                        center: { latitude: location.coords.latitude, longitude: location.coords.longitude },
                        radius: 10000,
                    }} : null,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_API_KEY!,
                }),
            });
        const data = await response.json();
        const places: Place[] = data.suggestions.map((suggestion: any) => {
            return {
                name: suggestion.placePrediction.text.text,
                placeId: suggestion.placePrediction.placeId,
            };
        });
        return places;
    };

    const { data: places, isFetching: isFetchingPlaces } = useQuery({
        queryKey: ['input', { input: input, location: location }],
        queryFn: fetchPlaces,
        enabled: !!input,
    });

    const fetchPlaceDetails = async ({ queryKey }: { queryKey: [string, { placeId: string | null }] }) => {
        const [, { placeId }] = queryKey;
        const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=address_components,location&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
        );
        const data = await response.json();
        const addressComponents = data.addressComponents;
        const location = data.location;
        setAddress({
            streetAddress: `${getAddressPart('street_number', addressComponents)??""} ${getAddressPart('route', addressComponents)}`,
            city: getAddressPart('postal_town', addressComponents),
            postcode: getAddressPart('postal_code', addressComponents),
            country: getAddressPart('country', addressComponents),
            locality: getAddressPart('locality', addressComponents),
            longitude: location.longitude,
            latitude: location.latitude,
        });
        return [];
    };
    const { isFetching: isFetchingPlace } = useQuery({
        queryKey: ['place', { placeId: selectedPlaceId }],
        queryFn: fetchPlaceDetails,
        enabled: !!selectedPlaceId,
    });

    return (
        <View style={styles.container}>
            <SearchBar
                style={{ zIndex:100 }}
                input={input}
                setInput={setInput}
                showResults={showResults}
                placeholder='Search for an address'
                />
            <View width={"100%"} height={100} justifyContent={"center"} alignItems={"center"}>
                {(isFetchingPlaces || isFetchingPlace) && (
                    <PageSpinner />
                )}
            </View>
            {resultsVisible && (
                <ScrollView style={styles.placeList}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                {places && places.length > 0 &&
                    <View
                        width={"100%"}
                        height={50}
                        backgroundColor={theme.section.val}
                        position='absolute'
                        top={-40} zIndex={1}/>
                }
                {places?.map((item, index) =>
                    <View key={item.placeId} zIndex={2}>
                        <Pressable
                            scale={0.98}
                            activeOpacity={0.7}
                            onPress={() => {
                                setSelectedPlaceId(item.placeId)
                                hideResults();
                            }}
                            style={styles.placeItem}>
                                <Text overflow='scroll' style={{ color: theme.color.val }}>{item.name}</Text>
                        </Pressable>
                        {index < places.length - 1 && <Separator />}
                    </View>
                 )}
                </ScrollView>
            )}
        </View>
    );
}

const Separator = () => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return <View style={styles.separator} />;
};

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        alignItems: 'center',
        height: 50,
    },
    placeList: {
        width: '99%',
        backgroundColor: theme.section.val,
        position: 'absolute',
        zIndex: 10,
        top: 55,
        borderRadius: 1,
        maxHeight: 300,
        overflow: "visible",
    },
    placeItem: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    resultCard: {
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 14,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: theme.gray5.val,
        marginVertical: 1,
    },
});
