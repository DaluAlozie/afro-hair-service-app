import AuthWrapper from "@/components/auth/AuthWrapper";
import Pressable from "@/components/utils/Pressable";
import SearchBar from "@/components/utils/SearchBar";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useCustomerStore } from "@/utils/stores/customerStore";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { UseThemeResult } from "@tamagui/core";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, useTheme, XStack, RadioGroup } from "tamagui";
import { Platform, StyleSheet } from "react-native";
import { capitalise, formatAddress } from "@/components/explore/utils";
import { filterBusiness } from "@/components/explore/utils";
import { useBusinessSummaries } from "@/hooks/useBusinessSummaries";
import { Text as RNText } from "react-native";
import { RadioGroupItemWithLabel } from "@/components/utils/form/inputs";
import { SortBy } from "@/components/explore/types";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native";
import SheetModal from "@/components/utils/ui/SheetModal";
import { Business } from "@/components/explore/business";

export default function Explore() {
  const theme  = useTheme();
  return (
    <AuthWrapper>
    <View marginTop={20} paddingHorizontal={20} flex={1} gap={40} backgroundColor={theme.background.val}>
        <Results/>
      </View>
      <AddMapButton/>
    </AuthWrapper>
  );
}

const BusinessSearch = () => {
  const searchInput = useCustomerStore(state => state.searchFilters.searchInput);
  const setSearchInput = useCustomerStore(state => state.setSearchInput);
  const theme = useTheme();
  return (
    <XStack gap={10} height={60}>
    <View width={"90%"}>
      <SearchBar
        input={searchInput}
        setInput={(val) => {
          setSearchInput(val);
        }}
        showResults={() => {}}
        placeholder="Search for businesses"
        />
    </View>
      <View width={"10%"} height={"100%"} alignItems="center" justifyContent="center">
        <Pressable
          onPress={() => router.push('/searchFilters')}
          style={{ justifyContent: 'center' }}
          activeOpacity={0.8}
          scale={0.85}
          >
        <MaterialIcons name="filter-list-alt" size={30} color={theme.color.val} />
        </Pressable>
      </View>
  </XStack>
  )
}

const SelectLocation = () => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const { currentAddress } = useCurrentLocation();
    const searchAddress = useCustomerStore(state => state.searchFilters.address);
    const setSearchAddress = useCustomerStore(state => state.setSearchAddress);
    const router = useRouter();

    // Sets search address to current address if search address is not set.
    useEffect(() => {
        if (currentAddress && !searchAddress){
            setSearchAddress(currentAddress);
        }
    }, [currentAddress]);

    const address = (searchAddress || currentAddress) ? formatAddress(searchAddress ?? currentAddress):  "Choose a location";

    return (
      <View marginVertical={10} width={"100%"}>
          <View height={50} width={"100%"}>
              <Pressable
                activeOpacity={0.8}
                scale={0.95}
                style={{
                    width: "100%",
                    justifyContent: 'center',
                    alignItems:"center",
                }}
                onPress={() => router.push('/search')}>
                  <XStack justifyContent="space-between" alignItems='center' width={"99%"}>
                    <XStack gap={20} alignItems='center'>
                      <View marginBottom={5}>
                        <FontAwesome5 name="map-marker-alt" size={24} color={theme.color.val} />
                      </View>
                      <Text style={styles.sectionContentText}>{address}</Text>
                    </XStack>
                      <Ionicons color={theme.color.val} size={24} name="chevron-forward"/>
                  </XStack>
              </Pressable>
          </View>
          <View width={"100%"} height={1} backgroundColor={theme.color.val} opacity={0.4}/>
      </View>
    )
}

const AddMapButton = () => {
  const theme = useTheme();
  return (
    <View position='absolute' bottom={Platform.OS === "android" ? 20 : 100} right={20}>
    <Pressable onPress={() => router.push('/map')} activeOpacity={0.99} style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.accent.val,
        width: 130,
        height: 55,
        justifyContent: 'center',
        gap: 12,
        borderRadius: 100,
      }}>
      <Text fontSize={18} fontWeight={"bold"} color={theme.white1.val}>Map</Text>
      <FontAwesome5 name="map-marker-alt" size={24} color={theme.white1.val} />
    </Pressable>
  </View>
  )
}

const Results = () => {
  const theme = useTheme();
  const { businessDetails, refetchDetails, isRefetchingDetails } = useBusinessSummaries();
  const filters = useCustomerStore(state => state.searchFilters);
  const filteredBusinesses = filterBusiness(Array.from(businessDetails.values()), filters);
  const [open, setOpen] = useState(false);

  return (
    <View flex={1}>
      <SortByModal open={open} setOpen={setOpen}/>
      <FlashList
        data={filteredBusinesses}
        keyExtractor={(item) => item[0].id.toString()}
        estimatedItemSize={100}
        refreshControl={
          <RefreshControl refreshing={isRefetchingDetails} onRefresh={refetchDetails} />
        }
        ListHeaderComponent={() => (
          <View style={{ paddingTop: 10 }}>
            {/* Space below sticky search */}
            <BusinessSearch />
            <SelectLocation />
            <SortByButton setOpen={setOpen} />
            <RNText
              style={{
                color: theme.color.val,
                fontSize: 16,
                opacity: 0.4,
                marginBottom: 10,
                fontStyle: "italic",
                marginTop: 20
              }}
            >
              Results ({filteredBusinesses.length}):
            </RNText>
          </View>
        )}
        renderItem={({ item, index }) => (
          <Business key={item[0].id} index={index} business={item[0]} distance={item[1]} />
        )}
        ListFooterComponent={<View height={150} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const SortByButton = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const theme = useTheme();
  const styles = makeStyles(theme)
  const sortBy = useCustomerStore(state => state.searchFilters.sortBy);

  return (
    <>
      <View marginTop={10}>
        <Pressable
          onPress={() => {setOpen(true)}}
          style={styles.sortButton}
          activeOpacity={0.8}
          scale={0.95}>
          <Text fontWeight={"bold"} fontSize={13} color={theme.white1.val}>Sort by:  {capitalise(sortBy)}</Text>
          <Ionicons color={theme.white1.val} size={20} name="chevron-down"/>
        </Pressable>
      </View>
    </>
  )
}

const SortByModal = ({ open, setOpen }: { open: boolean, setOpen: (val: boolean) => void}) => {
  const snapPoints = [50];
  const sortBy = useCustomerStore(state => state.searchFilters.sortBy);
  const setSortBy = useCustomerStore(state => state.setSearchSortBy);
  return (
    <SheetModal
      snapPoints={snapPoints}
      open={open}
      setOpen={setOpen}
    >
      <View style={{ width: '100%', height: '100%', gap: 20, padding: 20 }}>
        <Text fontSize={18} fontWeight={"bold"} alignSelf="center">Sort By</Text>
        <View>
          <RadioGroup
            defaultValue={sortBy}
            value={sortBy}
            onValueChange={(val: string) => {
              if (['recommended', 'distance', 'rating'].includes(val))
                setSortBy(val as SortBy)
              }}
              gap={"$4"}
          >
            <RadioGroupItemWithLabel selectedValue={sortBy} value="recommended" label="Recommended" size={24} />
            <RadioGroupItemWithLabel selectedValue={sortBy} value="distance" label="Distance" size={24}/>
            <RadioGroupItemWithLabel selectedValue={sortBy} value="rating" label="Rating" size={24}/>
          </RadioGroup>
        </View>
      </View>
    </SheetModal>
  )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
        backgroundColor: theme.background.val,
        height: '100%',
        width: '90%',
        paddingTop: 40,
        gap: 20,
        alignSelf: 'center'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionContentText: {
        fontSize: 16,
        color: theme.color.val
    },
    tag: {
      borderRadius: 20,
      backgroundColor: theme.section.val,
      width: 'auto',
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      opacity: 0.8
    },
    sortButton: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 5,
      width: 200,
      height: 50,
      backgroundColor: theme.accent.val,
      padding: 10,
      borderRadius: 10
    },
    tagText: {
      color: theme.color.val,
      justifyContent: 'center',
      alignItems: 'center',
      height: "auto",
      fontSize: 12,
      alignSelf: 'center',
      fontWeight: "bold",
      marginHorizontal: 6,
  }
})