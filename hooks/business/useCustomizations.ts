import { CustomizableOption } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useCustomizations(serviceOptionIds: number[]) {
    const fetchCustomizations = useCallback(async (
        { queryKey }: { queryKey: [string, { serviceOptionIds: number[] }] }
    ): Promise<Map<number, CustomizableOption[]>> => {
        const [, { serviceOptionIds }] = queryKey;
        if (serviceOptionIds.length === 0) {
            return new Map<number, CustomizableOption[]>();
        }
        if (serviceOptionIds.length === 0) {
            return new Map<number, CustomizableOption[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('CustomizableOption')
            .select('*')
            .in('service_option_id', serviceOptionIds);
        if (error) {
            console.log(error);
            return new Map<number, CustomizableOption[]>();
        }
        const customizations = new Map<number, CustomizableOption[]>();
        data.forEach((customizableOption: CustomizableOption) => {
            const co = customizableOption as CustomizableOption;
            if (!customizations.has(co.service_option_id)) {
                customizations.set(co.service_option_id, []);
            }
            customizations.get(co.service_option_id)?.push(co);
        });
        return customizations;
    }, [serviceOptionIds]);
    const {
        data: customizableOptions,
        isFetching: isFetchingCustomizableOptions,
        refetch: refetchCustomizableOptions,
        isRefetching: isRefetchingCustomizableOptions
    } = useQuery({
        queryKey: ['customizableOptions', { serviceOptionIds }],
        queryFn: fetchCustomizations,
        initialData: new Map<number, CustomizableOption[]>(),
        enabled: serviceOptionIds.length > 0
    });
    return {
        customizableOptions,
        isFetchingCustomizableOptions,
        refetchCustomizableOptions,
        isRefetchingCustomizableOptions
    };
}