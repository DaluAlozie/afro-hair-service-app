import LocationSearch from '@/components/business/businessLocation/LocationSearch';
import { Address } from '@/components/business/businessLocation/types';
import { formatAddress } from '@/components/explore/utils';
import Pressable from '@/components/utils/Pressable';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useCustomerStore } from '@/utils/stores/customerStore';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native';
import { View, XStack, Text, useTheme } from 'tamagui'

export default function Search() {
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const theme = useTheme();
    const searchAddress = useCustomerStore(state => state.searchFilters.address);
    const setSearchAddress = useCustomerStore(state => state.setSearchAddress);
    const addSearchHistory = useCustomerStore(state => state.addSearchHistory);
    useEffect(() => {
        setVisible(false);
    }, [searchAddress])
    return (
        <TouchableOpacity
            style={{ height: "100%", width: "100%", backgroundColor: theme.background.val }}
            activeOpacity={1}
            onPress={() => {
                setVisible(false)
                Keyboard.dismiss();
            }}
            >
            <View width={"90%"} alignSelf='center' gap={20}>
                <LocationSearch
                    address={searchAddress ?? null}
                    setAddress={(location: Address) => {
                        setSearchAddress(location);
                        setVisible(false);
                        addSearchHistory(location);
                        router.back();
                    }}
                    resultsVisible={visible}
                    showResults={() => setVisible(true)}
                    hideResults={() => setVisible(false)}
                />
                <UseCurrentLocation/>
                <SearchHistory/>
            </View>
        </TouchableOpacity>
    )
}

const UseCurrentLocation = () => {
    const theme = useTheme();
    const router = useRouter();
    const { currentAddress } = useCurrentLocation();
    const setSearchAddress = useCustomerStore(state => state.setSearchAddress);

    return (
        <View marginBottom={10}>
            <View height={70} width={"100%"}>
                <Pressable
                    activeOpacity={0.8}
                    scale={0.95}
                    style={{
                        width: "100%",
                        justifyContent: 'center',
                        alignItems:"flex-start",
                    }}
                    onPress={() => {
                        if (currentAddress){
                            setSearchAddress(currentAddress);
                            router.back();
                        }
                    }}>
                    <XStack alignItems='center' justifyContent='space-between' width={"100%"}>
                        <View alignItems='flex-start' justifyContent='flex-start' gap={7}>
                            <Text fontSize={16} fontWeight={"bold"}>
                                Current Location
                            </Text>
                            <Text color={theme.color.val} opacity={0.7}>{formatAddress(currentAddress)}</Text>
                        </View>
                        <FontAwesome5 name="location-arrow" size={20} color={theme.color.val} />
                    </XStack>
                </Pressable>
            </View>
            <View width={"100%"} height={1} backgroundColor={theme.color.val} opacity={0.5}/>
        </View>
    )
}

const SearchHistory = () => {
    const theme = useTheme();
    const searchHistory = useCustomerStore(state => state.searchHistory);
    const setSearchAddress = useCustomerStore(state => state.setSearchAddress);
    const router = useRouter();

    return (
        <View width={"100%"}>
            <Text fontSize={16} fontWeight={"bold"}>Search History</Text>
            {searchHistory.map((address, i) => {
                return (
                    <View key={i} height={50} width={"100%"} justifyContent='center'>
                        <Pressable activeOpacity={0.7} scale={0.95}
                            onPress={() => {
                            setSearchAddress(address);
                            router.back();
                        }}>
                            <XStack height={"100%"} width={"100%"} justifyContent='flex-start' alignItems='center' gap={10}>
                                <FontAwesome name="search" color={theme.gray9.val} size={16} />
                                <Text fontSize={16} width={"95%"}>{formatAddress(address)}</Text>
                            </XStack>
                        </Pressable>
                    </View>
                )
            }
        )}
        </View>
    )
}