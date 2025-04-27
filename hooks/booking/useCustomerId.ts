import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";
import { useAuthStore } from "@/utils/stores/authStore";

export function useCustomerId() {
    const userId = useAuthStore((state) => state.user?.id);
    const email = useAuthStore((state) => state.user?.email);

    const createStripeCustomer = useCallback(async () => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase.functions.invoke("create-stripe-customer", {
            body: JSON.stringify({
                record: {
                    id: userId,
                    email,
                }
            }),
            headers: {
                "API-KEY": process.env.EXPO_PUBLIC_WEB_API_KEY!,
            },
        });
        if (error) {
            console.log(error);
            return "";
        }
        return data;
    }, [userId, email]);

    const fetchCustomer = useCallback(async (): Promise<string> => {
        if (!userId || !email) {
            return "";
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Profile')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();
            // If there is an err and the error isn't just that the record doesn't exist
        if (error && error.code !== "PGRST116") {
            console.log(error);
            return "";
        }
        if (!data?.stripe_customer_id) {
            await createStripeCustomer();
            const { data: data2, error: error2 } = await supabase
                .from('Profile')
                .select('stripe_customer_id')
                .eq('id', userId)
                .single();
            if (error2) {
                console.log(error2);
                return "";
            }
            if (!data2.stripe_customer_id) {
                return "";
            }
            return data2.stripe_customer_id;
        }
        return data.stripe_customer_id;
    }, [userId]);
    const {
        data: customerId,
        isFetching: isFetchingCustomerId
    } = useQuery({
        queryKey: ['getCustomerId', {}],
        queryFn: fetchCustomer,
        initialData: undefined,
    });
    return {
        customerId,
        isFetchingCustomerId,
    };
}