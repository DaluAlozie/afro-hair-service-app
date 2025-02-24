import React from 'react';
import { View } from 'tamagui';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function Payment({ children }: { children: React.ReactNode }) {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier={process.env.EXPO_PUBLIC_APPLE_MERCHANT_ID!} // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
        <View>
            {children}
        </View>
    </StripeProvider>
  );
}