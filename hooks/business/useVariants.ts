import { Variant } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useVariants(serviceOptionIds: number[]) {
    const fetchVariants = useCallback(async ({
        queryKey,
    }: {
        queryKey: [string, { serviceOptionIds: number[] }];
    }): Promise<Map<number, Variant[]>> => {
        const [, { serviceOptionIds }] = queryKey;
        if (serviceOptionIds.length === 0) {
            return new Map<number, Variant[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Variant')
            .select('*')
            .in('service_option_id', serviceOptionIds);
        if (error) {
            console.log(error);
            return new Map<number, Variant[]>();
        }
        const variants = new Map<number, Variant[]>();
        data.forEach((variant: Variant) => {
            const v = variant as Variant;
            if (!variants.has(v.service_option_id)) {
                variants.set(v.service_option_id, []);
            }
            variants.get(v.service_option_id)?.push(v);
        });
        return variants;
    }, [serviceOptionIds]);
    const { data: variants,
        refetch: refetchVariants,
        isFetching: isFetchingVariants,
        isRefetching: isRefetchingVariants
    } = useQuery({
        queryKey: ['variants', { serviceOptionIds }],
        queryFn: fetchVariants,
        initialData: new Map<number, Variant[]>(),
        enabled: serviceOptionIds.length > 0
    });

    return {
        variants,
        isFetchingVariants,
        refetchVariants,
        isRefetchingVariants,
    };
}