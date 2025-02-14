import { AddOn, Service, ServiceOption, Variant, Location, Business, CustomizableOption } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useBusiness(businessId: number) {
    const fetchBusiness = useCallback(async (): Promise<Business> => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase.rpc('fetch_business', { bid: businessId });
        if (error) {
            console.log(error);
            return {} as Business;
        }
        const business = data[0] as Business;
        return business;
    }, [businessId]);
    const fetchServices = useCallback(async (): Promise<Service[]> => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Service')
            .select('*')
            .eq('business_id', businessId);
        if (error) {
            console.log(error);
            return [] as Service[]
        }
        const services = data as Service[];
        return services;
    }, [businessId]);

    const fetchServiceOptions = useCallback(
        async ({ queryKey }: { queryKey: [string, { serviceIds: number[] }] }): Promise<Map<number, ServiceOption[]>> => {
        const [, { serviceIds }] = queryKey;
        if (serviceIds.length === 0) {
            return new Map<number, ServiceOption[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('ServiceOption')
            .select('*')
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
    }, [businessId]);
    const fetchVariants = useCallback(async (
        { queryKey }: { queryKey: [string, { serviceOptionIds: number[] }] }): Promise<Map<number, Variant[]>> => {
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
    }, [businessId]);
    const fetchAddOns = useCallback(async (
        { queryKey }: { queryKey: [string, { serviceOptionIds: number[] }] }): Promise<Map<number, AddOn[]>> => {
        const [, { serviceOptionIds }] = queryKey;
        if (serviceOptionIds.length === 0) {
            return new Map<number, AddOn[]>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('AddOn')
            .select('*')
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
    }, [businessId]);
    const fetchCustomizations = useCallback(async (
        { queryKey }: { queryKey: [string, { serviceOptionIds: number[] }] }): Promise<Map<number, CustomizableOption[]>> => {
        const [, { serviceOptionIds }] = queryKey;
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
    }, [businessId]);
    const fetchLocations = useCallback(async (): Promise<Location[]> => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Location')
            .select('*')
            .eq('business_id', businessId);
        if (error) {
            console.log(error);
            return [] as Location[];
        }
        const locations = data as Location[];
        return locations;
    }, [businessId]);

    const {
        data: business,
        isFetching: isFetchingBusiness,
        refetch: refetchBusiness,
        isRefetching: isRefetchingBusiness
    } = useQuery({
        queryKey: ['business', {}],
        queryFn: fetchBusiness,
        initialData: {} as Business,
    });
    const {
            data: services,
            isFetching: isFetchingServices,
            refetch: refetchServices,
            isRefetching: isRefetchingServices
        } = useQuery({
        queryKey: ['services', {}],
        queryFn: fetchServices,
        initialData: [] as Service[],
    });
    const { data: serviceOptions,
        isFetching: isFetchingServiceOptions,
        refetch: refetchServiceOptions,
        isRefetching: isRefetchingServiceOptions
    } = useQuery({
        queryKey: ['serviceOptions', { serviceIds: services.map(service => service.id) }],
        queryFn: fetchServiceOptions,
        initialData: new Map<number, ServiceOption[]>(),
        enabled: services.length > 0
    });
    const { data: variants,
        refetch: refetchVariants,
        isFetching: isFetchingVariants,
        isRefetching: isRefetchingVariants
    } = useQuery({
        queryKey: ['variants', { serviceOptionIds: Array.from(serviceOptions.values()).flat().map(option => option.id) }],
        queryFn: fetchVariants,
        initialData: new Map<number, Variant[]>(),
        enabled: serviceOptions.size > 0
    });
    const {
        data: addOns,
        isFetching: isFetchingAddOns,
        refetch: refetchAddOns,
        isRefetching: isRefetchingAddOns
    } = useQuery({
        queryKey: ['addOns', { serviceOptionIds: Array.from(serviceOptions.values()).flat().map(option => option.id)}],
        queryFn: fetchAddOns,
        initialData: new Map<number, AddOn[]>(),
        enabled: serviceOptions.size > 0
    });
    const {
        data: customizableOptions,
        isFetching: isFetchingCustomizableOptions,
        refetch: refetchCustomizableOptions,
        isRefetching: isRefetchingCustomizableOptions
    } = useQuery({
        queryKey: ['customizableOptions', { serviceOptionIds: Array.from(serviceOptions.values()).flat().map(option => option.id)}],
        queryFn: fetchCustomizations,
        initialData: new Map<number, CustomizableOption[]>(),
        enabled: serviceOptions.size > 0
    });
    const {
        data: locations,
        isFetching: isFetchingLocations,
        refetch: refetchLocations,
        isRefetching: isRefetchingLocations
    } = useQuery({
        queryKey: ['locations', {}],
        queryFn: fetchLocations,
        initialData: [] as Location[],
    });

    return {
        business,
        services,
        serviceOptions,
        variants,
        addOns,
        customizableOptions,
        locations,
        isFetchingBusiness,
        isFetchingServices,
        isFetchingServiceOptions,
        isFetchingVariants,
        isFetchingAddOns,
        isFetchingCustomizableOptions,
        isFetchingLocations,
        refetchBusiness,
        refetchServices,
        refetchServiceOptions,
        refetchVariants,
        refetchAddOns,
        refetchCustomizableOptions,
        refetchLocations,
        isRefetchingBusiness,
        isRefetchingServices,
        isRefetchingServiceOptions,
        isRefetchingVariants,
        isRefetchingAddOns,
        isRefetchingLocations,
        isRefetchingCustomizableOptions,
        profilePictureUrl: `${process.env.EXPO_PUBLIC_BUSINESS_PROFILE_BASE_URL}/${business.owner_id}/profilePicture.png`

    };

}