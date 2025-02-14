import { Location } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useLocations(businessId: number | undefined) {
    const fetchLocations = useCallback(async (
        { queryKey }: { queryKey: [string, { businessId: number | undefined }] }
    ): Promise<Location[]> => {
        const [, { businessId }] = queryKey;
        if (!businessId) {
            return [] as Location[];
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Location')
            .select('*')
            .eq('enabled', true)
            .eq('business_id', businessId);
        if (error) {
            console.log(error);
            return [] as Location[];
        }
        const locations = data as Location[];
        return locations;
    }, [businessId]);
    const {
        data: locations,
        isFetching: isFetchingLocations,
        refetch: refetchLocations,
        isRefetching: isRefetchingLocations
    } = useQuery({
        queryKey: ['locations', { businessId }],
        queryFn: fetchLocations,
        initialData: [] as Location[],
        enabled: !!businessId,
    });

    return {
        locations,
        isFetchingLocations,
        refetchLocations,
        isRefetchingLocations,
    };
}