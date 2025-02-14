import { supabaseClient } from "@/utils/auth/supabase";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export default function useAvailability(businessId: number | undefined) {
    const fetchAvailability = useCallback(async (
        { queryKey }: { queryKey: [string, { businessId: number | undefined }] }
    ) => {
        const [, { businessId }] = queryKey;
        if (!businessId) {
            return [] as { from: Date, to: Date }[];
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Availability')
            .select('from, to')
            .gte('from', new Date())
            .eq('business_id', businessId);
        if (error) {
            console.log(error);
            return [];
        }
        const slots = data.map((a: { from: string, to: string }) => ({
            from: new Date(a.from),
            to: new Date(a.to)
        }));
        return slots;
    }, [businessId]);

    const {
        data: availability,
        isFetching: isFetchingAvailability,
        isRefetching: isRefetchingAvailability,
        refetch: refetchAvailability} = useQuery({
        queryKey: ['availability', { businessId }],
        queryFn: fetchAvailability,
        initialData: [] as { from: Date, to: Date }[],
        enabled: !!businessId
      });

    return {
        availability,
        isFetchingAvailability,
        isRefetchingAvailability,
        refetchAvailability
    };
}