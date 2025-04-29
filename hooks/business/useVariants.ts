import { Variant } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useVariants(styleIds: number[]) {
    const fetchVariants = useCallback(async ({
        queryKey,
    }: {
        queryKey: [string, { styleIds: number[] }];
    }): Promise<Map<number, Variant[]>> => {
        const [, { styleIds }] = queryKey;
        if (styleIds.length === 0) {
            return new Map<number, Variant[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Variant')
            .select('*')
            .in('style_id', styleIds);
        if (error) {
            console.log(error);
            return new Map<number, Variant[]>();
        }
        const variants = new Map<number, Variant[]>();
        data.forEach((variant: Variant) => {
            const v = variant as Variant;
            if (!variants.has(v.style_id)) {
                variants.set(v.style_id, []);
            }
            variants.get(v.style_id)?.push(v);
        });
        return variants;
    }, [styleIds]);
    const { data: variants,
        refetch: refetchVariants,
        isFetching: isFetchingVariants,
        isRefetching: isRefetchingVariants
    } = useQuery({
        queryKey: ['variants', { styleIds }],
        queryFn: fetchVariants,
        initialData: new Map<number, Variant[]>(),
        enabled: styleIds.length > 0
    });

    return {
        variants,
        isFetchingVariants,
        refetchVariants,
        isRefetchingVariants,
    };
}