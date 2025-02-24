import { Business } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useBusiness(businessId: number) {
    const fetchBusiness = useCallback(async (
        { queryKey }: { queryKey: [string, { businessId: number }] }
    ): Promise<Business> => {
        const [, { businessId }] = queryKey;
        const supabase = await supabaseClient;
        const { data, error } = await supabase.rpc('get_business', { bid: businessId });
        if (error) {
            console.log(error);
            return {} as Business;
        }
        const business = data[0] as Business;
        return business;
    }, [businessId]);
    const {
        data: business,
        isFetching: isFetchingBusiness,
        refetch: refetchBusiness,
        isRefetching: isRefetchingBusiness
    } = useQuery({
        queryKey: ['business', { businessId }],
        queryFn: fetchBusiness,
        initialData: {} as Business,
    });
    return {
        business,
        isFetchingBusiness,
        refetchBusiness,
        isRefetchingBusiness,
        profilePictureUrl: `${process.env.EXPO_PUBLIC_BUSINESS_PROFILE_BASE_URL}/${business.owner_id}/profilePicture.png`
    };
}