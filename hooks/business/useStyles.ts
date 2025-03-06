import { Style } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useStyles(serviceIds: number[]) {
    const fetchStyles = useCallback(async (
        { queryKey }: { queryKey: [string, { serviceIds: number[] }] }
    ): Promise<Map<number, Style[]>> => {
        const [, { serviceIds }] = queryKey;
        if (serviceIds.length === 0) {
            return new Map<number, Style[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Style')
            .select('*')
            .eq('enabled', true)
            .in('service_id', serviceIds);
        if (error) {
            console.log(error);
            return new Map<number, Style[]>();
        }
        const styles = new Map<number, Style[]>();
        data.forEach((style: Style) => {
            const option = style as Style;
            if (!styles.has(option.service_id)) {
                styles.set(option.service_id, []);
            }
            styles.get(option.service_id)?.push(option);
        });
        return styles;
    }, [serviceIds]);

    const { data: styles,
        isFetching: isFetchingStyles,
        refetch: refetchStyles,
        isRefetching: isRefetchingStyles
    } = useQuery({
        queryKey: ['styles', { serviceIds }],
        queryFn: fetchStyles,
        initialData: new Map<number, Style[]>(),
        enabled: serviceIds.length > 0
    });
    return {
        styles,
        isFetchingStyles,
        refetchStyles,
        isRefetchingStyles,
    };
}