import { BookingDetails } from '@/components/business/booking/BookingDetails';
import { useBookingStore } from '@/utils/stores/bookingStore';
import React from 'react';
import { useTheme, View, YStack, Text, XStack } from 'tamagui';
import { StyleSheet, useWindowDimensions } from 'react-native';

export default function ConfirmationDetails() {
  const theme = useTheme();

  // Retrieve booking details from the store
  const startTime = useBookingStore((state) => state.startTime);
  const endTime = useBookingStore((state) => state.endTime);
  const business = useBookingStore((state) => state.business);
  const duration = useBookingStore((state) => state.duration);
  const totalPrice = useBookingStore((state) => state.totalPrice);
  const location = useBookingStore((state) => state.location);
  const addOns = useBookingStore((state) => state.addOns);
  const service = useBookingStore((state) => state.service);
  const serviceOption = useBookingStore((state) => state.serviceOption);
  const variant = useBookingStore((state) => state.variant);

  // Calculate subtotal from variant price and add-ons
  const subtotal = (variant?.price || 0) + (addOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0);

  const { height } = useWindowDimensions();

  return (
    <View
      height={height-200}
      width={"90%"}
      alignSelf='center'
      backgroundColor={theme.background.val}
      paddingTop={20}
      justifyContent='space-between'>
      <YStack gap="$3">
        <BookingDetails
          startTime={startTime}
          endTime={endTime}
          duration={duration}
          totalPrice={totalPrice}
        />

        {/* Location and Business Details */}
        <XStack gap="$1">
          <XStack flexWrap='wrap' gap="$2">
            <Text style={styles.small}>{location?.street_address}</Text>
            <Text style={styles.small}>{location?.postcode}</Text>
            <Text style={styles.small}>{location?.city}</Text>
          </XStack>
          <Text style={styles.small}>• {business?.name}</Text>
        </XStack>

        {/* Price Breakdown */}
        <View borderWidth={1} borderColor={theme.color.val} padding={15} borderRadius={5} gap="$3" marginTop={20}>
          {/* Variant Price */}
          <XStack justifyContent='space-between'>
            <XStack alignItems='center'>
              <Text style={styles.label}>{serviceOption?.name}</Text>
              <Text style={styles.label} marginRight={2}>{service?.name}</Text>
              <Text style={styles.small}> • {variant?.name}</Text>
            </XStack>
            <Text style={styles.price}>£{variant?.price}</Text>
          </XStack>

          {/* Add-Ons */}
          <View>
            {addOns?.map((addOn, index) => (
              <XStack key={index} justifyContent='space-between' marginTop={5}>
                <Text style={styles.small}>{addOn.name}</Text>
                <Text style={styles.addOnPrice}>+ £{addOn.price}</Text>
              </XStack>
            ))}
          </View>
          {/* Subtotal */}
          <View height={1} width={"100%"} alignSelf='center' opacity={0.5} backgroundColor={"$color"}/>
          <XStack justifyContent='space-between' marginTop={10}>
            <Text fontSize={16} opacity={0.7}>Subtotal</Text>
            <Text style={styles.totalPrice}>£{subtotal}</Text>
          </XStack>
        </View>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
  },
  price: {
    fontSize: 16,
  },
  addOnPrice: {
    fontSize: 12
  },
  totalPrice: {
    fontSize: 17
  },
  small: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: "italic"
  },
});