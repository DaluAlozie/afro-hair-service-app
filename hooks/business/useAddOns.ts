import { AddOn } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useAddOns(serviceOptionIds: number[]) {
    const fetchAddOns = useCallback(async (
        { queryKey }: { queryKey: [string, { serviceOptionIds: number[] }] }
    ): Promise<Map<number, AddOn[]>> => {
        const [, { serviceOptionIds }] = queryKey;
        if (serviceOptionIds.length === 0) {
            return new Map<number, AddOn[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('AddOn')
            .select('*')
            .eq('enabled', true)
            .in('service_option_id', serviceOptionIds);
        if (error) {
            console.log(error);
            return new Map<number, AddOn[]>();
        }
        const addOns = new Map<number, AddOn[]>();
        data.forEach((addOn: AddOn) => {
            const a = addOn as AddOn;
            if (!addOns.has(a.service_option_id)) {
                addOns.set(a.service_option_id, []);
            }
            addOns.get(a.service_option_id)?.push(a);
        });
        return addOns;
    }, [serviceOptionIds]);
    const {
        data: addOns,
        isFetching: isFetchingAddOns,
        refetch: refetchAddOns,
        isRefetching: isRefetchingAddOns
    } = useQuery({
        queryKey: ['addOns', { serviceOptionIds}],
        queryFn: fetchAddOns,
        initialData: new Map<number, AddOn[]>(),
        enabled: serviceOptionIds.length > 0
    });

    return {
        addOns,
        isFetchingAddOns,
        refetchAddOns,
        isRefetchingAddOns,
    };
}