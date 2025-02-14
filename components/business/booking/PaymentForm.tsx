import { useBookingStore } from '@/utils/stores/bookingStore';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'tamagui';
import { initPaymentSheet, presentPaymentSheet, resetPaymentSheetCustomer } from '@stripe/stripe-react-native';
import * as Linking from 'expo-linking';
import { useCustomerId } from '@/hooks/booking/useCustomerId';
import SubmitButton from '@/components/utils/form/SubmitButton';
import notify from '@/components/utils/Alerts/Notify';
import { useCustomerStore } from '@/utils/stores/customerStore';
import { useAuthStore } from '@/utils/stores/authStore';
import { useRouter } from 'expo-router';
import usePaymentSheetParams from '@/hooks/booking/usePaymentSheetParams';
import useToast from '@/hooks/useToast';

export default function Payment() {
  const booking = useBookingStore();
  const bookAppointment = useCustomerStore((state) => state.bookAppointment);
  const { showToast } = useToast();

  const { customerId } = useCustomerId();
  const { params, isFetchingPaymentSheetParams } = usePaymentSheetParams(customerId, booking.totalPrice);

  const userId = useAuthStore((state) => state.user?.id);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initializePaymentSheet = useCallback(async () => {
    if (!params) {
      console.log("No payment sheet data available");
      return;
    }
    const { paymentIntentClientSecret, ephemeralKey, customer } = params;
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Crown Space",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntentClientSecret,
      allowsDelayedPaymentMethods: true,
      applePay: {
        merchantCountryCode: "GB",
      },
      returnURL: Linking.createURL("stripe-redirect"),
    });
    if (error) {
      console.log("Error initializing payment sheet", error);
    }
    setLoading(false);
  }, [params]);

  const onBookingSuccess = useCallback(async () => {
    if (
      !booking.business || !booking.variant || !booking.startTime || !booking.endTime||
      !booking.location || !booking.customizableOptions || !booking.totalPrice || !userId
    ) {
      await booking.refundBooking(params?.paymentIntentId);
      notify('Error', 'Booking details are missing');
      setIsSubmitting(false);
      return;
    }
    const {data: appointment, error } = await bookAppointment(
      booking.business.id,
      booking.variant.id,
      booking.location.id,
      booking.startTime!,
      booking.endTime!,
      booking.addOns.map((addOn) => addOn.id),
      booking.customizableOptions,
      booking.totalPrice,
      true,
      userId
    );
    if (error) {
      await booking.refundBooking(params?.paymentIntentId);
      console.error(error);
      notify('Error', 'Failed to book appointment');
      setIsSubmitting(false);
      return;
    }
    if (!appointment) {
      await booking.refundBooking(params?.paymentIntentId);
      notify('Error', 'Failed to book appointment');
      setIsSubmitting(false);
      return;
    }
    resetPaymentSheetCustomer();

    showToast('Payment Successful', 'Your appointment is confirmed.', 'success');
    router.dismissTo("/(tabs)");
    booking.reset();
    setIsSubmitting(false);
  }, [booking, userId]);


  useEffect(() => {
    if (params?.publishableKey) {
      initializePaymentSheet();
    }
  }, [params]);

  const openPaymentSheet = async () => {
    setIsSubmitting(true);
    if (
      !booking.business || !booking.variant || !booking.startTime || !booking.endTime ||
      !booking.location || !booking.customizableOptions || !booking.totalPrice || !userId
    ) {
      notify('Error', 'Booking details are missing');
      return;
    }
    if (!booking.business.online){
      notify('Error', 'Business is not online');
      router.dismissTo("/(tabs)/explore");
      setIsSubmitting(false);
      booking.reset();
      return;
    }
    const isAppointmentSlotValidResult = await booking.isAppointmentSlotValid();
    const isLocationValidResult = await booking.isLocationValid();
    const isBusinessOnlineResult = await booking.isBusinessOnline();
    if (isAppointmentSlotValidResult !== true) {
      notify('Payment Error', 'Appointment slot is invalid');
      setIsSubmitting(false);
      router.dismissTo("/booking/selectTime");
      return;
    }
    if (isLocationValidResult !== true) {
      notify('Payment Error', 'Location is invalid');
      setIsSubmitting(false);
      router.dismissTo("/booking/selectLocation");
      return;
    }
    if (isBusinessOnlineResult !== true) {
      notify('Payment Error', 'Business is not online');
      setIsSubmitting(false);
      router.dismissTo("/(tabs)/explore");
      return;
    }
    const { error } = await presentPaymentSheet();

    if (error) {
      notify('Payment Cancelled', error.message);
      setIsSubmitting(false);
    } else {
      await onBookingSuccess();
    }
  };

  return (
    <View height={50} width={"90%"} alignSelf='center' justifyContent='center'>
      <SubmitButton
      onPress={openPaymentSheet}
      isSubmitting={isSubmitting || isFetchingPaymentSheetParams}
      disabled={(isFetchingPaymentSheetParams || loading) }>
        Proceed to Payment
      </SubmitButton>
    </View>  )
}