import ConfirmationDetails from '@/components/business/booking/ConfirmationDetails'
import PaymentForm from '@/components/business/booking/PaymentForm'
import StripeProviderWrapper from '@/components/business/booking/StripeProviderWrapper'
import React from 'react'
import { View } from 'tamagui'

export default function ConfirmBooking() {
  return (
    <StripeProviderWrapper>
      <View style={{ height: "100%", width: "100%" }} backgroundColor={"$background"}>
        <ConfirmationDetails />
        <PaymentForm />
      </View>
    </StripeProviderWrapper>
    )
}
