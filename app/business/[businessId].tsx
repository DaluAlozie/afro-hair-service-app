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
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { View, useTheme } from 'tamagui'
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

export default function BusinessPage() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const { businessName, businessId } = useLocalSearchParams();
  const parsedId = Array.isArray(businessId) ? parseInt(businessId[0]) : parseInt(businessId);

  const { business, profilePictureUrl, refetchBusiness, isRefetchingBusiness } = useBusiness(parsedId);
  const { services } = useServices(parsedId);
  const { serviceOptions } = useServiceOptions(services.map(service => service.id));
  const serviceOptionIds = Array.from(serviceOptions.values()).flat().map(option => option.id);
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
      </View>
    </AuthWrapper>
  )
}

const Header  = ({ business, profilePictureUrl }: { business: BusinessType, profilePictureUrl: string  }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View alignItems="center" gap={20} marginBottom={30} width={"90%"} alignSelf="center">
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: profilePictureUrl }}
          placeholder={emptyProfile}
          contentFit="cover"
          transition={400}
        />
      </View>
      <Text style={styles.businessName}>{business.name}</Text>
      <View style={styles.aboutUsContainer}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.businessDescription}>{business.description}</Text>
      </View>
    </View>
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
        >
          <Text style={{ color: theme.background.val, fontWeight: 'bold' }}>Book</Text>
        </Pressable>
      </View>
    </View>
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
    borderColor: theme.color.val,
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
    width: '100%',
    // paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.color.val,
    marginBottom: 10,
  },
  businessDescription: {
    fontSize: 16,
    color: theme.color.val,
    lineHeight: 24,
    opacity: 0.7,
  },
  serviceContainer: {
    paddingVertical: 20,
    backgroundColor: theme.background.val,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: theme.color.val,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    backgroundColor: theme.color.val,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});