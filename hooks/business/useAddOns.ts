import { AddOn } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useAddOns(styleIds: number[]) {
    const fetchAddOns = useCallback(async (
        { queryKey }: { queryKey: [string, { styleIds: number[] }] }
    ): Promise<Map<number, AddOn[]>> => {
        const [, { styleIds }] = queryKey;
        if (styleIds.length === 0) {
            return new Map<number, AddOn[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('AddOn')
            .select('*')
            .eq('enabled', true)
            .in('style_id', styleIds);
        if (error) {
            console.log(error);
            return new Map<number, AddOn[]>();
        }
        const addOns = new Map<number, AddOn[]>();
        data.forEach((addOn: AddOn) => {
            const a = addOn as AddOn;
            if (!addOns.has(a.style_id)) {
                addOns.set(a.style_id, []);
            }
            addOns.get(a.style_id)?.push(a);
        });
        return addOns;
    }, [styleIds]);
    const {
        data: addOns,
        isFetching: isFetchingAddOns,
        refetch: refetchAddOns,
        isRefetching: isRefetchingAddOns
    } = useQuery({
        queryKey: ['addOns', { styleIds}],
        queryFn: fetchAddOns,
        initialData: new Map<number, AddOn[]>(),
        enabled: styleIds.length > 0
    });

    return {
        addOns,
        isFetchingAddOns,
        refetchAddOns,
        isRefetchingAddOns,
    };
}