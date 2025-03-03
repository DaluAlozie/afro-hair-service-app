import {
  AddOn as AddOnType,
  Service as ServiceType,
  ServiceOption as ServiceOptionType,
  Variant as VariantType,
  Location as LocationType,
  Business as BusinessType,
} from "@/components/business/types";
import ScrollTabs from '@/components/utils/ui/scrollTabBar/ScrollTabs'
import { useBusiness } from '@/hooks/business/useBusiness';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { View, XStack, useTheme } from 'tamagui'
import { UseThemeResult } from '@tamagui/core';
import { StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import emptyProfile from "@/assets/images/empty-profile.png";
import AuthWrapper from "@/components/auth/AuthWrapper";
import Pressable from "@/components/utils/Pressable";
import { BookingInfo } from "@/components/business/booking/types";
import { BookingForm } from "@/components/business/booking/BookingForm";
import { useServices } from "@/hooks/business/useServices";
import { useServiceOptions } from "@/hooks/business/useServiceOptions";
import { useVariants } from "@/hooks/business/useVariants";
import { useAddOns } from "@/hooks/business/useAddOns";
import { useCustomizations } from "@/hooks/business/useCustomizations";
import SheetModal from "@/components/utils/ui/SheetModal";
import * as Linking from 'expo-linking';
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import ReviewModal from "@/components/business/review/ReviewModal";
import { useReviews } from "@/hooks/business/useReviews";

export default function BusinessPage() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const { businessName, businessId } = useLocalSearchParams();
  const parsedId = Array.isArray(businessId) ? parseInt(businessId[0]) : parseInt(businessId);

  const { business, profilePictureUrl, refetchBusiness, isRefetchingBusiness } = useBusiness(parsedId);
  const { services } = useServices(parsedId);
  const { serviceOptions } = useServiceOptions(services.map(service => service.id));
  const serviceOptionIds = useMemo(() => Array.from(serviceOptions.values()).flat().map(option => option.id), [serviceOptions]);
  const { variants } = useVariants(serviceOptionIds);
  const { addOns } = useAddOns(serviceOptionIds);
  const { customizableOptions } = useCustomizations(serviceOptionIds);

  const [optionInfo, setOptionInfo] = useState<BookingInfo>({
    business: business,
    service: undefined,
    serviceOption: undefined,
    variants: [],
    addOns: [],
    customizableOptions: []
  });

  useEffect(() => {
    setOptionInfo({...optionInfo, business: business});
  }, [business]);

  useLayoutEffect(() => {
    if (businessName) {
      navigation.setOptions({ title: businessName });
    }
  }, [businessName]);


  const openBookingModal = useCallback((option: ServiceOptionType) => {
    setOptionInfo({
      business: business,
      service: services.find(service => service.id === option.service_id),
      serviceOption: option,
      variants: variants.get(option.id) || [],
      addOns: addOns.get(option.id) || [],
      customizableOptions: customizableOptions.get(option.id) || []
    });
    setOpen(true);
  },[variants]);

  return (
    <AuthWrapper>
      <BookingModal open={open} setOpen={(val: boolean) => setOpen(val)} {...optionInfo} />
      <View width={"100%"} alignSelf="center" backgroundColor={theme.background.val}>
        { useMemo(() => (
          <ScrollTabs
            refreshing={isRefetchingBusiness}
            refresh={async () => {await refetchBusiness()}}
            header={() => <Header business={business} profilePictureUrl={profilePictureUrl} />}>
            {services.map(service => (
              <ScrollTabs.Section key={service.id} label={service.name}>
                <View width={"100%"} alignSelf="center" alignItems="center">
                  <Service
                    key={service.id}
                    service={service}
                    serviceOptions={serviceOptions.get(service.id) || []}
                    addOns={addOns}
                    variants={variants}
                    book={openBookingModal}
                  />
                </View>
              </ScrollTabs.Section>
            ))}
          </ScrollTabs>
        ), [services, serviceOptions, addOns, variants])
      }
      </View>
    </AuthWrapper>
  )
}

const Header  = ({ business, profilePictureUrl }: { business: BusinessType, profilePictureUrl: string  }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const twitterUrl= `twitter://user?screen_name=${business.twitter}`;
  const instagramUrl = `instagram://user?username=${business.instagram}`;
  const facebookUrl = `fb://profile/${business.facebook}`
  const textUrl = `sms:${business.phone_number}`

  const twitterFallback = `https://twitter.com/${business.twitter}`;
  const instagramFallback = `https://instagram.com/${business.instagram}`;
  const facebookFallback = `https://facebook.com/${business.facebook}`

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const { reviews, refetchReviews, isRefetchingReviews } = useReviews(business.id);

  return (
    <>
    <ReviewModal
      open={openReviewModal}
      setOpen={setOpenReviewModal}
      reviews={reviews}
      refresh={async () => { refetchReviews() }}
      refreshing={isRefetchingReviews}
      />
    <View alignItems="center" gap={20} marginBottom={30} width={"90%"} alignSelf="center" position="relative">
      <View position="absolute" top={0} right={0} alignSelf="center" zIndex={100}>
        <View alignItems='flex-end' alignSelf="flex-end" marginBottom={10}>
          <View alignSelf='flex-end' marginRight={-10} marginBottom={-5}>
              <FontAwesome name="star" size={10} color="#FFD43B" />
          </View>
          <Text numberOfLines={1} style={{ color: theme.color.val, fontSize: 14, textAlign: "left"}}>
              {business.rating ? `${business.rating.toFixed(1)}` : "4.5"}
          </Text>
      </View>
      </View>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: profilePictureUrl }}
          placeholder={emptyProfile}
          contentFit="cover"
          transition={400}
        />
      </View>
      <View alignItems="center" justifyContent="center" gap={20}>
        <Text style={styles.businessName}>{business.name}</Text>
        { business.phone_number && (
        <SocialLink url={textUrl} fallback={"/"}>
          <XStack gap={5} opacity={0.7}>
            <Ionicons name="call" size={16} color={theme.color.val} />
            <Text style={{ color: theme.color.val, fontSize: 12 }}>{business.phone_number}</Text>
          </XStack>
        </SocialLink>
          )}
      </View>
      <XStack justifyContent="space-between" width={"100%"} gap={20}>
        <View style={styles.aboutUsContainer}>
          <XStack alignItems="center" gap={10} marginBottom={10}>
            <Text style={styles.sectionTitle}>About Us</Text>
            <View>
              <Pressable onPress={() => setOpenReviewModal(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: theme.color.val, fontSize: 12, opacity: 0.7, textDecorationLine: 'underline' }}>
                  Reviews
                </Text>
              </Pressable>
            </View>
          </XStack>
          <Text style={styles.businessDescription}>{business.description}</Text>
        </View>
          <XStack gap={20}>
            { business.twitter && (
              <SocialLink url={twitterUrl} fallback={twitterFallback}>
                <Ionicons name="logo-twitter" size={30} color={theme.color.val} />
              </SocialLink>
            )}
            { business.instagram && (
              <SocialLink url={instagramUrl} fallback={instagramFallback}>
                <Ionicons name="logo-instagram" size={30} color={theme.color.val} />
              </SocialLink>
            )}
            { business.facebook && (
              <SocialLink url={facebookUrl} fallback={facebookFallback}>
                <Ionicons name="logo-facebook" size={30} color={theme.color.val} />
              </SocialLink>
            )}
          </XStack>
      </XStack>
    </View>
    </>
  )
}

type ServiceProps = {
  service: ServiceType,
  serviceOptions: ServiceOptionType[],
  addOns: Map<number, AddOnType[]>,
  variants: Map<number, VariantType[]>,
  book: (option: ServiceOptionType) => void
}

const Service = ({ service, serviceOptions, addOns, variants, book }: ServiceProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.serviceContainer}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
      </View>
      <View style={styles.serviceOptionList}>
        {serviceOptions.map(serviceOption => (
          <ServiceOption
            key={serviceOption.id}
            serviceOption={serviceOption}
            addOns={addOns.get(serviceOption.id) || []}
            variants={variants.get(serviceOption.id) || []}
            book={book}
          />
        ))}
      </View>
    </View>
  )
}

type ServiceOptionProps = {
  serviceOption: ServiceOptionType,
  addOns: AddOnType[],
  variants: VariantType[],
  book: (option: ServiceOptionType) => void
}

const ServiceOption = ({ serviceOption, variants, book }: ServiceOptionProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  variants.sort((a, b) => a.price - b.price);
  return (
    <View style={styles.serviceOptionContainer}>
      <View style={styles.serviceOptionHeader}>
        <Text style={styles.serviceOptionName}>{serviceOption.name}</Text>
        <Text style={styles.serviceOptionDescription}>{serviceOption.description}</Text>
      </View>
      <View style={styles.variantList}>
      {/* <Text style={{ fontWeight: 600, marginBottom: 10 }}>Options</Text> */}
        {variants.map(variant => (
          <Variant key={variant.id} variant={variant} />
        ))}
      </View>
      {/* <View style={styles.addOnList}>
        <Text style={{ fontWeight: 600, marginBottom: 10 }}>Add Ons</Text>
        {addOns.map(addOn => (
          <AddOn key={addOn.id} addOn={addOn} />
        ))}
      </View> */}
      <View>
        <Pressable
          onPress={() => book(serviceOption)}
          style={styles.bookButton}
          scale={0.98}
          pressedStyle={{ backgroundColor: theme.accent.val, opacity: 0.8 }}
        >
          <Text style={{ color: theme.white1.val, fontWeight: 'bold' }}>Book</Text>
        </Pressable>
      </View>
    </View>
  )
}

const SocialLink = ({ url, fallback, children }: { url: string, fallback: string, children: React.ReactNode }) => {
  const onPress = useCallback(async () => {
    try {
      await Linking.openURL(url);
    } catch {
      await Linking.openURL(fallback);
    }
  }, [url, fallback]);
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
      {children}
    </Pressable>
  )
}

const Variant = ({ variant }: { variant: VariantType }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.variantContainer}>
      <Text style={styles.variantName}>{variant.name}</Text>
      <Text style={styles.variantPrice}>${variant.price}</Text>
    </View>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AddOn = ({ addOn }: { addOn: AddOnType }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.addOnContainer}>
      <Text style={styles.addOnName}>{addOn.name}</Text>
      <Text style={styles.addOnPrice}>${addOn.price}</Text>
    </View>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Location = ({ location }: { location: LocationType }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.locationContainer}>
      <Text style={styles.locationText}>{location.street_address}, {location.city}, {location.postcode}</Text>
    </View>
  )
}


const BookingModal = ({ open, setOpen, ...rest }: {
    open: boolean,
    setOpen: (val: boolean) => void,
  } & BookingInfo
) => {
  const snapPoints = [75];
  const theme = useTheme();

  return (
    <SheetModal open={open} setOpen={setOpen} snapPoints={snapPoints}>
      <View style={{ height: '100%', width: "100%", gap: 20, padding: 20, }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.color.val }}>Booking</Text>
        </View>
        <BookingForm {...rest} close={() => setOpen(false)} />
      </View>
    </SheetModal>
  )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  profileImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: theme.secondaryAccent.val,
  },
  profileImage: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.background.val,
  },
  businessName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.color.val,
    textAlign: 'center',
  },
  aboutUsContainer: {
    position: 'relative',
    width: "auto"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.color.val,
  },
  businessDescription: {
    fontSize: 16,
    color: theme.color.val,
    lineHeight: 24,
    wordWrap: 'break-word',
    height: "auto",
    opacity: 0.7,
    maxWidth: 250,
  },
  serviceContainer: {
    paddingVertical: 20,
    backgroundColor: theme.background.val,
    borderRadius: 10,
    marginVertical: 10,
    height: "auto",
    width: "90%",
  },
  serviceHeader: {
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.color.val,
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 16,
    color: theme.color.val,
    lineHeight: 24,
    opacity: 0.7,
  },
  serviceOptionList: {
    marginTop: 10,
    width: "100%",
  },
  serviceOptionContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: theme.background.val,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.borderColor.val,
  },
  serviceOptionHeader: {
    marginBottom: 10,
  },
  serviceOptionName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.color.val,
    marginBottom: 5,
  },
  serviceOptionDescription: {
    fontSize: 14,
    color: theme.color.val,
    lineHeight: 20,
    opacity: 0.7,
  },
  variantList: {
    marginTop: 10,
  },
  variantContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: theme.background.val,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.borderColor.val,
  },
  variantName: {
    fontSize: 14,
    color: theme.color.val,
  },
  variantPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.val,
  },
  addOnList: {
    marginTop: 10,
  },
  addOnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: theme.background.val,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.borderColor.val,
  },
  addOnName: {
    fontSize: 14,
    color: theme.color.val,
  },
  addOnPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.val,
  },
  locationContainer: {
    padding: 15,
    backgroundColor: theme.background.val,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.borderColor.val,
  },
  locationText: {
    fontSize: 14,
    color: theme.color.val,
  },
  bookButton: {
    width: '100%',
    backgroundColor: theme.accent.val,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});