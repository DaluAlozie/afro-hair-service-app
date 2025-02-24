import { ServiceOption } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useServiceOptions(serviceIds: number[]) {
    const fetchServiceOptions = useCallback(async (
        { queryKey }: { queryKey: [string, { serviceIds: number[] }] }
    ): Promise<Map<number, ServiceOption[]>> => {
        const [, { serviceIds }] = queryKey;
        if (serviceIds.length === 0) {
            return new Map<number, ServiceOption[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('ServiceOption')
            .select('*')
            .eq('enabled', true)
            .in('service_id', serviceIds);
        if (error) {
            console.log(error);
            return new Map<number, ServiceOption[]>();
        }
        const serviceOptions = new Map<number, ServiceOption[]>();
        data.forEach((serviceOption: ServiceOption) => {
            const option = serviceOption as ServiceOption;
            if (!serviceOptions.has(option.service_id)) {
                serviceOptions.set(option.service_id, []);
            }
            serviceOptions.get(option.service_id)?.push(option);
        });
        return serviceOptions;
    }, [serviceIds]);

    const { data: serviceOptions,
        isFetching: isFetchingServiceOptions,
        refetch: refetchServiceOptions,
        isRefetching: isRefetchingServiceOptions
    } = useQuery({
        queryKey: ['serviceOptions', { serviceIds }],
        queryFn: fetchServiceOptions,
        initialData: new Map<number, ServiceOption[]>(),
        enabled: serviceIds.length > 0
    });
    return {
        serviceOptions,
        isFetchingServiceOptions,
        refetchServiceOptions,
        isRefetchingServiceOptions,
    };
}