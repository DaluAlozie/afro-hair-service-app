import AuthWrapper from "@/components/auth/AuthWrapper";
import Pressable from "@/components/utils/Pressable";
import SearchBar from "@/components/utils/SearchBar";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useCustomerStore } from "@/utils/stores/customerStore";
import { FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { UseThemeResult } from "@tamagui/core";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { View, Text, useTheme, XStack, RadioGroup } from "tamagui";
import { StyleSheet } from "react-native";
import { formatAddress } from "@/components/explore/utils";
import { filterBusiness } from "@/components/explore/utils";
import { useBusinessSummaries } from "@/hooks/useBusinessSummaries";
import { BusinessSummary } from "@/components/explore/types";
import { Text as RNText } from "react-native";
import { RadioGroupItemWithLabel } from "@/components/utils/form/inputs";
import { SortBy } from "@/components/explore/types";
import { Image } from "expo-image";
import emptyProfile from "@/assets/images/empty-profile.png";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native";
import SheetModal from "@/components/utils/ui/SheetModal";

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
      <View width={"10%"} height={"100%"} alignItems="center" >
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
        <View marginBottom={10} width={"100%"}>
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
  const inverseTheme = useTheme({ inverse: true });
  const scheme = useColorScheme();
  const router = useRouter();
  const theme = useTheme();
  return (
    <View position='absolute' bottom={100} right={20}>
    <Pressable onPress={() => router.push('/map')} activeOpacity={0.99} style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: scheme === 'light' ? theme.section.val : inverseTheme.background.val,
        width: 130,
        height: 55,
        justifyContent: 'center',
        gap: 12,
        borderRadius: 100,
      }}>
      <Text fontSize={18} fontWeight={"bold"} color={scheme === 'light' ? theme.color.val : inverseTheme.color.val}>Map</Text>
      <FontAwesome5 name="map-marker-alt" size={24} color={ scheme === 'light' ? theme.color.val : inverseTheme.color.val} />
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

const isNotEmpty = (str: string) => {
  return str !== "" && str !== null && str !== undefined
}

const Business = ({ business, distance, index }:
{ business: BusinessSummary, distance: number, index: number }
) => {
  const theme = useTheme();
  const styles = makeStyles(theme)
  const profilePicture = `${process.env.EXPO_PUBLIC_BUSINESS_PROFILE_BASE_URL}/${business.owner_id}/profilePicture.png`
  const services = business.services.filter(isNotEmpty).map(capitalise).join(", ");
  const tags = business.tags.map(capitalise).slice(0, 5);
  return (
  <>
    { index !== 0 &&
      <View width={"100%"} height={1} backgroundColor={theme.color.val} opacity={0.3} alignSelf="center"/>
    }
    <Pressable
      style={{
        width: '100%',
        minHeight: 220,
        maxHeight: 250,
        overflow: 'hidden',

        justifyContent: 'space-between',
        alignItems:"flex-start",
        borderRadius: 10,
      }}
      onPress={() => router.push(`/business/${business.id}?businessName=${business.name}`)}
      activeOpacity={0.8}
      scale={0.98}>
        <View width={"100%"} padding={15} gap={10}>
          <XStack width={"100%"} justifyContent="space-between">
            <View width={"60%"} height={"100%"} justifyContent="space-between">
              <View gap={20} marginTop={20}>
                <View gap={10}>
                  <Text fontSize={20} fontWeight={"bold"} numberOfLines={2}>{business.name}</Text>
                  <Text numberOfLines={1}>{business.description}</Text>
                </View>
                {services.length !== 0 &&
                <View gap={5}>
                  <Text fontSize={14} fontWeight={"bold"}>Services</Text>
                  <RNText
                    style={{
                      color: theme.color.val,
                      fontStyle: 'italic',
                      opacity: 0.8
                    }}
                    numberOfLines={1}>
                      {services}
                  </RNText>
                </View>
                }
                {tags.length !== 0 &&
                <XStack gap={10} maxWidth={"100%"} flexWrap="wrap" overflow="hidden">
                  {
                    tags.map(tag =>
                      <View key={tag} style={styles.tag}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      </View>
                  )}
                </XStack>
                }
              </View>
              <View>
                <Text numberOfLines={1} opacity={0.5}>{distance.toFixed(2)} miles</Text>
              </View>
            </View>
            <View width={"25%"} height={"100%"} justifyContent="flex-start" alignItems="center">
              <View alignItems='flex-end' alignSelf="flex-end" marginBottom={10}>
                <View alignSelf='flex-end' marginRight={-7} marginBottom={-5}>
                    <FontAwesome name="star" size={6} color="#FFD43B" />
                </View>
                <Text  numberOfLines={1} color={theme.color.val} fontSize={12} textAlign="left">
                    {business.rating ? `${business.rating.toFixed(1)}` : "4.5"}
                </Text>
              </View>
              {/* // Profile Picture */}
              <View width={120} height={120} borderRadius={100} overflow='hidden'>
                <Image
                  style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: theme.background.val,
                  }}
                  source={{ uri: profilePicture }}
                  placeholder={emptyProfile}
                  contentFit="cover"
                  transition={400}
                />
              </View>
            </View>
          </XStack>
        </View>
    </Pressable>
  </>
  )
}

const capitalise = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
          <Text fontWeight={"bold"} fontSize={13}>Sort by:  {capitalise(sortBy)}</Text>
          <Ionicons color={theme.color.val} size={16} name="chevron-down"/>
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
      backgroundColor: theme.section.val,
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