import { CustomizableOption } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useCustomizations(styleIds: number[]) {
    const fetchCustomizations = useCallback(async (
        { queryKey }: { queryKey: [string, { styleIds: number[] }] }
    ): Promise<Map<number, CustomizableOption[]>> => {
        const [, { styleIds }] = queryKey;
        if (styleIds.length === 0) {
            return new Map<number, CustomizableOption[]>();
        }
        if (styleIds.length === 0) {
            return new Map<number, CustomizableOption[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('CustomizableOption')
            .select('*')
            .in('style_id', styleIds);
        if (error) {
            console.log(error);
            return new Map<number, CustomizableOption[]>();
        }
        const customizations = new Map<number, CustomizableOption[]>();
        data.forEach((customizableOption: CustomizableOption) => {
            const co = customizableOption as CustomizableOption;
            if (!customizations.has(co.style_id)) {
                customizations.set(co.style_id, []);
            }
            customizations.get(co.style_id)?.push(co);
        });
        return customizations;
    }, [styleIds]);
    const {
        data: customizableOptions,
        isFetching: isFetchingCustomizableOptions,
        refetch: refetchCustomizableOptions,
        isRefetching: isRefetchingCustomizableOptions
    } = useQuery({
        queryKey: ['customizableOptions', { styleIds }],
        queryFn: fetchCustomizations,
        initialData: new Map<number, CustomizableOption[]>(),
        enabled: styleIds.length > 0
    });
    return {
        customizableOptions,
        isFetchingCustomizableOptions,
        refetchCustomizableOptions,
        isRefetchingCustomizableOptions
    };
}