import { Service } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useServices(businessId: number) {
    const fetchServices = useCallback(async (
        { queryKey }: { queryKey: [string, { businessId: number }] }
    ): Promise<Service[]> => {
        const [, { businessId }] = queryKey;
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Service')
            .select('*')
            .eq('enabled', true)
            .eq('business_id', businessId);
        if (error) {
            console.log(error);
            return [] as Service[]
        }
        const services = data as Service[];
        return services;
    }, [businessId]);
    const {
            data: services,
            isFetching: isFetchingServices,
            refetch: refetchServices,
            isRefetching: isRefetchingServices
        } = useQuery({
        queryKey: ['services', { businessId }],
        queryFn: fetchServices,
        initialData: [] as Service[],
    });

    return {
        services,
        isFetchingServices,
        refetchServices,
        isRefetchingServices
    };
}