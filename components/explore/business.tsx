import { useTheme, View, XStack } from "tamagui";
import Pressable from "../utils/Pressable";
import React, { useMemo } from "react";
import { BusinessSummary } from "./types";
import { capitalise, isNotEmpty } from "./utils";
import { useRouter } from "expo-router";
import { Text as RNText, StyleSheet } from "react-native";
import { Text } from "tamagui";
import { Image } from "expo-image";
import emptyProfile from "@/assets/images/empty-profile.png";
import { FontAwesome } from "@expo/vector-icons";
import { UseThemeResult } from "@tamagui/core";

export const Business = ({ business, distance, index }:
    { business: BusinessSummary, distance: number, index: number }
  ) => {
    const theme = useTheme();
    const profilePicture = `${process.env.EXPO_PUBLIC_BUSINESS_PROFILE_BASE_URL}/${business.owner_id}/profilePicture.png`
    const tags = business.tags.map(capitalise).slice(0, 5);
    const router = useRouter();
    return (
    <>
      { index !== 0 &&
        <View width={"100%"} height={1} backgroundColor={theme.color.val} opacity={0.3} alignSelf="center"/>
      }
        <Pressable
            style={{
            width: '100%',
            minHeight: 220,
            maxHeight: 280,
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
                    {business.services.length !== 0 && <Services services={business.services} />}
                    {tags.length !== 0 && <Tags tags={tags}/>}
                    </View>
                    <View>
                    <Text numberOfLines={1} opacity={0.5}>{distance.toFixed(2)} miles</Text>
                    </View>
                </View>
                <View width={"25%"} height={"100%"} justifyContent="flex-start" alignItems="center">
                    <Rating rating={business.rating} />
                    <ProfilePicture profilePicture={profilePicture}/>
                </View>
                </XStack>
            </View>
        </Pressable>
    </>
    )
}

const Services = ({ services }: { services: string[] }) => {
    const formattedServices = useMemo(() => services.filter(isNotEmpty).map(capitalise).join(", "), [services]);

    const theme = useTheme();
    return (
        <View gap={5}>
            <Text fontSize={14} fontWeight={"bold"}>Services</Text>
            <RNText
                style={{
                    color: theme.color.val,
                    fontStyle: 'italic',
                    opacity: 0.8
                }}
                numberOfLines={1}>
                {formattedServices}
            </RNText>
        </View>
    )

}

const Rating = ({ rating }: { rating: number }) => {
    const theme = useTheme();
    return (
        <View alignItems='flex-end' alignSelf="flex-end" marginBottom={10}>
            <View alignSelf='flex-end' marginRight={-7} marginBottom={-5}>
                <FontAwesome name="star" size={7} color="#FFD43B" />
            </View>
            <Text  numberOfLines={1} color={theme.color.val} fontSize={12} textAlign="left">
                {rating ? `${rating.toFixed(1)}` : "4.5"}
            </Text>
      </View>
    )
}

const Tags = ({ tags }: { tags: string[] }) => {
    const theme = useTheme();
    const styles = makeStyles(theme)
    return (
        <XStack gap={10} maxWidth={"100%"} flexWrap="wrap" overflow="hidden" maxHeight={70}>
        {
          tags.map(tag =>
            <View key={tag} style={styles.tag}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            </View>
        )}
      </XStack>
    )
}

const ProfilePicture = ({ profilePicture }: { profilePicture: string }) => {
    const theme = useTheme();
    return (
        <View
            width={120}
            height={120}
            borderRadius={100}
            overflow='hidden'
            borderWidth={3}
            borderColor={theme.secondaryAccent.val}>
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