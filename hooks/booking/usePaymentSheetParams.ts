import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react'

export type PaymentSheetParams = {
  paymentIntentId: string;
  paymentIntentClientSecret: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
};

export default function usePaymentSheetParams(customerId: string | undefined, totalPrice: number | undefined) {
  const fetchPaymentSheetParams = useCallback(async (
    { queryKey }: { queryKey: [string,{ customerId: string | undefined; totalPrice: number | undefined; }]}
  ) => {
    const [, { customerId, totalPrice }] = queryKey;
      if (!customerId) {
        console.log("No customer ID provided");
        return {} as PaymentSheetParams;
      }
      if (!totalPrice) {
        console.log("No total price provided");
        return {} as PaymentSheetParams;
      }
      // Here you would fetch the payment sheet parameters
      // from your server
      const response = await fetch(`${process.env.EXPO_PUBLIC_WEB_APP_URL}/api/create-payment-intent`, {
        method: "POST",
        body: JSON.stringify({
          customer_id: customerId,
          amount: totalPrice * 100,
          currency: "gbp",
        }),
        headers: new Headers({
          "Content-Type": "application/json",
          "API-KEY": process.env.EXPO_PUBLIC_WEB_API_KEY!,
        }),
      });
      const data = await response.json();
      return data as PaymentSheetParams;
    }, [customerId, totalPrice]
  );

  const { data, isFetching: isFetchingPaymentSheetParams } = useQuery({
    queryKey: ['business', { customerId, totalPrice }],
    queryFn: fetchPaymentSheetParams,
    initialData: { paymentIntentId: "", paymentIntentClientSecret: "", ephemeralKey: "", customer: "", publishableKey: "" },
  });

  return {
    params: data,
    isFetchingPaymentSheetParams,
  };
}
