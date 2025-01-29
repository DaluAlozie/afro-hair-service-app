import React, { useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { View, XStack } from 'tamagui';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme, UseThemeResult } from '@tamagui/core';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { googleMapsDarkStyle } from '@/googleMapsDarkStyle';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Pressable from '../utils/Pressable';
import { Image } from 'expo-image';
import emptyProfile from '@/assets/images/empty-profile.png';
import mapMarker from '@/assets/images/map_marker.png';
import { router } from 'expo-router';
import { Text } from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { useCustomerStore } from '@/utils/stores/customerStore';
import PageSpinner from '../utils/loading/PageSpinner';
import { useBusinessSummaries } from '@/hooks/useBusinessSummaries';
import { BusinessSummary } from './types';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';

export default function BusinessMap() {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const colorScheme = useColorScheme();
    const mapRef = useRef<MapView>(null);
    const searchAddress = useCustomerStore((state) => state.searchFilters.address);
    const { businessDetails,
        refetchDetails,
        isRefetchingDetails
    } = useBusinessSummaries()

    const { currentLocation } = useCurrentLocation();

    // Goes to users location when location is updated.
    useEffect(() => {
        if (currentLocation && !searchAddress) {
            goToUserLocation();
        }
    }, [currentLocation]);

    useEffect(() => {
        if (searchAddress) {
            goToLocation(searchAddress.latitude, searchAddress.longitude);
        }
    }, [searchAddress]);


    const refresh = async () => {
        await refetchDetails();
        if (searchAddress) {
            goToLocation(searchAddress.latitude, searchAddress.longitude);
        }
        else {
            goToUserLocation();
        }
    };

    const goToLocation = (lat: number, long: number) => {
        if (mapRef.current) {
            mapRef.current.animateCamera({
                center: {
                    latitude: lat,
                    longitude: long,
                },
                zoom: 15, // Adjust the zoom level as needed
                altitude: 500,
            }, { duration: 500 });
        }
    };

    const goToUserLocation = () => {
        if (currentLocation) {
            goToLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation?.coords.latitude || 52.402586 ,
                    longitude: currentLocation?.coords.longitude ||  -1.487667,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                provider={Platform.OS === 'android'? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                customMapStyle={colorScheme === 'dark' ? googleMapsDarkStyle : []}
                showsUserLocation={true}
                showsCompass={false}
                showsMyLocationButton={false}
                showsScale={false}
                showsBuildings={false}
                showsIndoors={false}
                zoomEnabled={true}
                rotateEnabled={false}
                showsPointsOfInterest={false}
            >
                {Array.from(businessDetails.values()).map((business) => {
                    return (
                        business.locations.map((location) =>(
                            <Marker
                                key={location.id}
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                }}
                                style={styles.marker}
                                image={mapMarker}
                            >
                                <BusinessCallout {...business} />
                            </Marker>
                        ))
                    );
                })}
            </MapView>
            {/* Overlay */}
            <Overlay goToUserLocation={goToUserLocation} refresh={refresh} isRefreshing={isRefetchingDetails}/>
        </View>
    );
}

type OverlayProps = {
    goToUserLocation: () => void;
    refresh: () => void;
    isRefreshing: boolean;
}

const Overlay = ({ goToUserLocation, refresh, isRefreshing }: OverlayProps) => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const { height } = useWindowDimensions();
    const { top } = initialWindowMetrics!.insets;

    return (
        <View position='absolute' top={top} width='100%' height={height-top}>
            <XStack
                position='absolute'
                top={0} width='100%'
                justifyContent='space-between'
                alignItems='flex-start'
                paddingHorizontal={10}>
                <Pressable onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color={theme.color.val} />
                </Pressable>
                <View width={50} justifyContent='center' alignItems='center' marginTop={3}>
                    <Pressable onPress={goToUserLocation} style={styles.locationButton} disabled={isRefreshing}>
                        <FontAwesome5 name="location-arrow" size={20} color={theme.color.val} />
                    </Pressable>
                </View>
            </XStack>
            <XStack
                position='absolute'
                bottom={30}
                width='100%'
                justifyContent='flex-end'
                alignItems='flex-start'
                paddingHorizontal={10}>
                <View width={50} justifyContent='center' alignItems='center' marginTop={3}>
                    <Pressable onPress={refresh} style={styles.locationButton}>
                    { isRefreshing ?
                        <Text style={{ width: "50%", height: "50%" }}><PageSpinner /> </Text>:
                        <FontAwesome name="refresh" size={24} color={theme.color.val} />
                    }
                    </Pressable>
                </View>
            </XStack>
        </View>
    );
}

const BusinessCallout = (props: BusinessSummary) => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const profilePicture = `${process.env.EXPO_PUBLIC_BUSINESS_PROFILE_BASE_URL}/${props.owner_id}/profilePicture.png`

    return (
        <Callout style={styles.callout} onPress={() => router.push(`/business/${props.id}`)}>
            <XStack justifyContent='center' width='95%' height='95%' alignSelf='center'>
                <View width={"65%"}>
                    <XStack gap={5} width={"94%"}>
                        <View>
                            <Text numberOfLines={2} style={styles.calloutTitle}>
                                {props.name}
                            </Text>
                            <Text numberOfLines={2} style={styles.calloutDescription}>
                                {props.description}
                            </Text>
                        </View>
                        <View alignItems='flex-start'>
                            <View alignSelf='flex-end' marginRight={-3} marginBottom={-2}>
                                <FontAwesome name="star" size={6} color="#FFD43B" />
                            </View>
                            <Text numberOfLines={1} style={styles.calloutRating}>
                                {props.rating ? `${props.rating.toFixed(1)}` : "--"}
                            </Text>
                        </View>
                    </XStack>
                    <Service {...props} />
                </View>
                <View width={"35%"} height="100%" justifyContent='space-between' alignItems='flex-end'>
                    <View width={50} height={50} borderRadius={25} overflow='hidden' marginRight={10}>
                        <Image
                            style={styles.image}
                            source={{ uri: profilePicture }}
                            placeholder={emptyProfile}
                            contentFit="cover"
                            transition={400}
                            cachePolicy={"none"}
                        />
                    </View>
                    <XStack
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            marginLeft: 10,
                        }}
                        >
                        <Text style={{ color: "rgba(0,0,0,0.7)", fontSize: 12 }}>
                            View Page
                        </Text>
                        <MaterialIcons name="arrow-forward-ios" size={14} color="rgba(0,0,0,0.7)" />
                    </XStack>
                </View>
            </XStack>
        </Callout>
    )
}

const Service = (props: BusinessSummary) => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    if (props.services.length === 0) {
        return null;
    }
    const services = props.services.join(', ');
    const serviceStyles = props.service_options.join(', ');
    return (
        <View marginTop={10} gap={10} width={"95%"}>
            <View width={"100%"}>
                <Text style={styles.serviceTitle}>Services:</Text>
                <Text numberOfLines={1} style={styles.serviceContent}>{services}</Text>
            </View>
            <View width={"100%"}>
                <Text style={styles.serviceTitle}>Styles:</Text>
                <Text numberOfLines={1} style={styles.serviceContent}>{serviceStyles}</Text>
            </View>
        </View>
    );
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    marker: {
        width: 48,
        height: 48,
    },
    locationButton: {
        height: 50,
        width: 50,
        backgroundColor: theme.section.val,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: "black",
        textAlign: 'left',
    },
    calloutDescription: {
        fontSize: 14,
        color: "black",
        textAlign: 'left',
        marginTop: 5,
    },
    calloutRating: {
        fontSize: 10,
        color: "black",
        textAlign: 'left',
        opacity: 0.7,
    },
    callout: {
        width: 220,
        minHeight: 140,
        height: 'auto',
        maxHeight: 200,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 5,
    },
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: "white",
    },
    serviceTitle: {
        fontWeight: 'bold',
        fontSize: 12,
        color: "black",
        opacity: 0.7,
    },
    serviceContent: {
        fontSize: 12,
        color: "black",
        opacity: 0.6,
        width: '95%',
        fontStyle: 'italic',
    },
});