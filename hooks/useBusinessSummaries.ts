import { Location as LocationType } from "@/components/business/types";
import { BusinessSummary } from "@/components/explore/types";
import { supabaseClient } from "@/utils/auth/supabase";
import { useQuery } from '@tanstack/react-query';
import { useCallback } from "react";

const isNotEmpty = (value: string) => {
    return !(value === '' || value === null || value === undefined);
}

export const useBusinessSummaries = () => {
    // Fetches business summaries from the database
    const fetchBusinessSummaries = useCallback(async (): Promise<Map<number, BusinessSummary>> => {

        const supabase = await supabaseClient;
        const { data, error } = await supabase.rpc('get_business_summaries');

        if (error) {
            console.log(error);
            return new Map<number, BusinessSummary>();
        }
        const businessSummaries = new Map<number, BusinessSummary>();
        data.forEach((business: BusinessSummary) => {
            const summary = business as BusinessSummary;
            // Filter out empty strings or null/undefined values
            summary.services = summary.services.filter(isNotEmpty);
            summary.service_descriptions = summary.service_descriptions.filter(isNotEmpty);
            summary.service_options = summary.service_options.filter(isNotEmpty);
            summary.service_option_descriptions = summary.service_option_descriptions.filter(isNotEmpty);
            summary.add_ons = summary.add_ons.filter(isNotEmpty);
            summary.variants = summary.variants.filter(isNotEmpty);
            summary.tags = summary.tags.filter(isNotEmpty);
            summary.locations = [];
            businessSummaries.set(summary.id, summary);
        });
        const businessLocations = await fetchBusinessLocations();
        for (const location of businessLocations) {
            const business = businessSummaries.get(location.business_id);
            if (business) {
                if (!business.locations) {
                    business.locations = [];
                }
                business.locations.push(location);
            }
        }
        return businessSummaries;
    }, []);
    // Fetches business locations from the database.
    const fetchBusinessLocations = async (): Promise<LocationType[]> => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Location')
            .select('*');
        if (error) {
            console.log(error);
            return [] as LocationType[];
        }
        const locations = data as LocationType[];
        return locations;
    };

    const { data: businessDetails, refetch: refetchDetails, isRefetching: isRefetchingDetails } = useQuery({
        queryKey: ['getBusinessDetails', {}],
        queryFn: fetchBusinessSummaries,
        initialData: new Map<number, BusinessSummary>(),
    });

    return { businessDetails, refetchDetails, isRefetchingDetails };
}