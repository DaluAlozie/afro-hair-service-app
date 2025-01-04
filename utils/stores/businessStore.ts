import { create } from 'zustand'
import { supabaseClient } from '../auth/supabase'
import {
    AddOn,
    Appointment,
    Service,
    ServiceOption,
    Location,
    ServiceLocation,
    Review,
    Variant,
    TimeSlot
} from '@/components/business/types'
import { PostgrestError } from '@supabase/supabase-js'

export type BusinessProps = {
  error?: PostgrestError | PostgrestError | undefined
}

export interface BusinessStore {
    id: number,
    name: string,
    phoneNumber: string | null,
    description: string,
    rating: number,
    services: Map<number, Service>
    appointments: Map<number, Appointment>,
    notifications: Map<string, Notification>,
    locations: Map<number, Location>,
    reviews: Map<number, Review>,
    facebook: string | null,
    instagram: string | null,
    twitter: string | null,
    online: boolean,
    hasBusiness: boolean,
    loading: boolean,
    availability: Map<number, TimeSlot>,
    createBusiness: (name: string, number: string | null, description: string) => Promise<BusinessProps>,
    load(): Promise<unknown>,
    loadBusiness: () => Promise<BusinessProps>,
    loadServices: () => Promise<BusinessProps>,
    loadBusinessLocations: () => Promise<BusinessProps>,
    loadBusinessAppointments: () => Promise<BusinessProps>,
    loadAvailability: () => Promise<BusinessProps>,
    loadServiceLocations: (serviceId: number) => Promise<BusinessProps>,
    loadServiceOptions: (serviceId: number) => Promise<BusinessProps>,
    loadAddOns: (serviceId: number, serviceOptionId: number) => Promise<BusinessProps>,
    loadVariants: (serviceId: number, serviceOptionId: number) => Promise<BusinessProps>,
    addService: (
        title: string,
        description: string,
    ) => Promise<BusinessProps>,
    addAvailability: (
        availabilities: { from: Date, to: Date }[]
    ) => Promise<BusinessProps>,
    addBusinessLocation: (
        streetAddress: string,
        flatNumber: string | null,
        city: string,
        postcode: string,
        country: string,
        longitude: number,
        latitude: number
    ) => Promise<BusinessProps>
    addServiceOption: (
        title: string,
        description: string,
        enabled: boolean,
        serviceId: number
    ) => Promise<BusinessProps>,
    addServiceLocation: (
        locationId: number,
        serviceId: number
    ) => Promise<BusinessProps>,
    addAddOn: (
        name: string,
        price: number,
        duration: number,
        enabled: boolean,
        serviceOptionId: number,
        serviceId: number,
    ) => Promise<BusinessProps>,
    addVariant: (
        name: string,
        price: number,
        duration: number,
        enabled: boolean,
        serviceOptionId: number,
        serviceId: number,
    ) => Promise<BusinessProps>,
    removeService: (serviceId: number) => Promise<BusinessProps>,
    removeAvailability: (availabilityIds: number[]) => Promise<BusinessProps>,
    removeBusinessLocation: (locationId: number) => Promise<BusinessProps>,
    removeServiceLocation: (serviceId: number, locationId: number) => Promise<BusinessProps>
    removeServiceOption: (serviceId: number, serviceOptionId: number) => Promise<BusinessProps>,
    removeAddOn: (serviceId: number, serviceOptionId: number, addOnId: number) => Promise<BusinessProps>
    removeVariant: (serviceId: number, serviceOptionId: number, variantId: number) => Promise<BusinessProps>
    cancelAppointment: (appointmentId: number) => Promise<BusinessProps>
    editBusinessName: (newName: string) => Promise<BusinessProps>
    editBusinessPhoneNumber: (newNumber: string | null) => Promise<BusinessProps>
    editBusinessDescription: (newDescription: string) => Promise<BusinessProps>
    editBusinessFacebook: (newFacebook: string | null) => Promise<BusinessProps>
    editBusinessInstagram: (newInstagram: string | null) => Promise<BusinessProps>
    editBusinessTwitter: (newTwitter: string | null) => Promise<BusinessProps>
    editServiceName: (serviceId: number, newName: string) => Promise<BusinessProps>
    editAvailability: (availabilityId: number, newAvailability: { from: Date, to: Date }) => Promise<BusinessProps>
    editServiceDescription: (serviceId: number, newDescription: string) => Promise<BusinessProps>
    editVariantPrice: (serviceId: number, serviceOptionId: number, variantId: number, newCost: number) => Promise<BusinessProps>
    editAddOnPrice: (serviceId: number, serviceOptionId: number, addOnId: number, newCost: number) => Promise<BusinessProps>
    activateBusiness: () => Promise<BusinessProps>
    deactivateBusiness: () => Promise<BusinessProps>
    enableService: (serviceId: number) => Promise<BusinessProps>
    disableService: (serviceId: number) => Promise<BusinessProps>
    enableLocation: (locationId: number) => Promise<BusinessProps>
    disableLocation: (locationId: number) => Promise<BusinessProps>
    enableServiceOption: (serviceId: number, serviceOptionId: number) => Promise<BusinessProps>
    disableServiceOption: (serviceId: number, serviceOptionId: number) => Promise<BusinessProps>
    enableVariant: (serviceId: number, serviceOptionId: number, variantId: number) => Promise<BusinessProps>
    disableVariant: (serviceId: number, serviceOptionId: number, variantId: number) => Promise<BusinessProps>
    enableAddOn: (serviceId: number, serviceOptionId: number, addOnId: number) => Promise<BusinessProps>
    disableAddOn: (serviceId: number, serviceOptionId: number, addOnId: number) => Promise<BusinessProps>
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
    id: -1,
    name: "",
    phoneNumber: "",
    description: "",
    rating: 0,
    services: new Map<number, Service>(),
    availability: new Map<number, TimeSlot>(),
    appointments: new Map<number, Appointment>(),
    locations: new Map<number, Location>(),
    notifications: new Map<string, Notification>(),
    reviews: new Map<number, Review>(),
    facebook: "",
    instagram: "",
    twitter: "",
    online: false,
    hasBusiness: false,
    loading: true,
    createBusiness: async (name: string, number: string | null, description: string) => {
        const supabase = await supabaseClient;
        const user = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('Business')
            .insert([{
                name,
                phone_number: number,
                description,
                owner_id: user.data.user?.id }])
            .select()
            .limit(1)
            .single()
        if (error) {
            return { error };
        }
        set({
            id: data.id,
            name: data.name,
            phoneNumber: data.phoneNumber,
            description: data.description,
            hasBusiness: true
        })
        return {};
    },
    load: async () => {
        try {
            await get().loadBusiness();
            if (!get().hasBusiness) {
                set({ loading: false })
                return {};
            }
            await get().loadAvailability();
            await get().loadServices();
            await get().loadBusinessLocations();
            await get().loadBusinessAppointments();
            const serviceIds = Array.from(get().services.keys());
            // Load service options and add-ons for each service
            for (const id of serviceIds) {
                await get().loadServiceLocations(id);
                await get().loadServiceOptions(id);
                const serviceOptionIds = Array.from(get().services.get(id)?.service_options.keys() as IterableIterator<number>);
                // Load add-ons for each service option
                for (const serviceOptionId of serviceOptionIds) {
                    await get().loadAddOns(id, serviceOptionId);
                    await get().loadVariants(id, serviceOptionId);
                }
            }
            set({ loading: false })
            console.log("Business data loaded");
            return {};
        } catch (error) {
            console.log(error);
            set({ loading: false });
            return { error };
        }
    },
    loadBusiness: async () => {
        const supabase = await supabaseClient;
        const user = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('Business')
            .select('*')
            .eq('owner_id', user.data.user?.id)
            .limit(1)
            .single()
        if (error) {
            throw { error };
        }
        if (data) {
            set({
                id: data.id,
                name: data.name,
                phoneNumber: data.phone_number,
                description: data.description,
                rating: data.rating,
                online: data.online,
                hasBusiness: true,
                facebook: data.facebook,
                instagram: data.instagram,
                twitter: data.twitter
            })
        }
        return {};
    },
    loadServices: async () => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Service')
            .select('*')
            .eq('business_id', get().id)
        if (error) {
            throw { error };
        }
        const services = new Map<number, Service>()
        data?.forEach((service: Service) => {
            services.set(service.id, service)
        })
        set({ services });
        return {};
    },
    loadAvailability: async () => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Availability')
            .select('*')
            .eq('business_id', get().id)
        if (error) {
            throw { error };
        }
        const availability = new Map<number, TimeSlot>()
        data?.forEach((avail: TimeSlot) => {
            availability.set(
                avail.id, {
                    id: avail.id,
                    from: new Date(avail.from),
                    to: new Date(avail.to),
                    business_id: get().id
                } as TimeSlot)
        })
        set({ availability });
        return {};
    },
    loadBusinessLocations: async () => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Location')
            .select('*')
            .eq('business_id', get().id)
        if (error) {
            throw { error };
        }
        const locations = new Map<number, Location>()
        data?.forEach((location: Location) => {
            locations.set(location.id, location)
        })
        set({ locations })
        return {};
    },
    loadBusinessAppointments: async () => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Appointment')
            .select('*')
            .eq('business_id', get().id)
        if (error) {
            throw { error };
        }
        const appointments = new Map<number, Appointment>()
        data?.forEach((appointment: Appointment) => {
            appointments.set(appointment.id, appointment)
        })
        set({ appointments })
        return {};
    },
    loadServiceOptions: async (serviceId: number) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('ServiceOption')
            .select('*')
            .eq('service_id', serviceId)
        if (error) {
            throw { error };
        }
        const serviceOptions = new Map<number, ServiceOption>()
        data?.forEach((serviceOption: ServiceOption) => {
            serviceOptions.set(
                serviceOption.id, {...serviceOption, addOns: new Map<number, AddOn>(), variants: new Map<number, Variant>()}
            )
        })
        if (error) {
            throw { error };
        }
        const service = get().services.get(serviceId) as Service;
        const newService = { ...service, service_options: serviceOptions } as Service;

        set((state) => ({
            services: new Map(state.services).set(serviceId, newService)
        }));
        return {};
    },
    loadServiceLocations: async (serviceId: number) => {
        await get().loadBusinessLocations();
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('ServiceLocation')
            .select('*')
            .eq('service_id', serviceId)
        if (error) {
            throw { error };
        }
        const service = get().services.get(serviceId) as Service;
        const locations = new Map<number, Location>()
        data?.forEach((serviceLocation: ServiceLocation) => {
            locations.set(serviceLocation.location_id, get().locations.get(serviceLocation.location_id) as Location)
        })
        const newService = { ...service, locations } as Service;
        set((state) => ({
            services: new Map(state.services).set(service.id, newService)
        }));
        return {};
    },
    loadAddOns: async (serviceId: number, serviceOptionId: number) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('AddOn')
            .select('*')
            .eq('service_option_id', serviceOptionId)
        if (error) {
            throw { error };
        }
        const addOns = new Map<number, AddOn>();
        data?.forEach((addOn: AddOn) => {
            addOns.set(addOn.id, {...addOn, service_id: serviceId})
        })
        const service = get().services.get(serviceId) as Service;
        const serviceOption = service.service_options.get(serviceOptionId) as ServiceOption;
        serviceOption.addOns = addOns;
        set((state) => ({
            services: new Map(state.services).set(service.id, service)
        }));
        return {};
    },
    loadVariants: async (serviceId: number, serviceOptionId: number) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Variant')
            .select('*')
            .eq('service_option_id', serviceOptionId)
        if (error) {
            throw { error };
        }
        const variants = new Map<number, Variant>();
        data?.forEach((variant: Variant) => {
            variants.set(variant.id, {...variant, service_id: serviceId})
        })
        const service = get().services.get(serviceId) as Service;
        const serviceOption = service.service_options.get(serviceOptionId) as ServiceOption;
        serviceOption.variants = variants;
        set((state) => ({
            services: new Map(state.services).set(service.id, service)
        }));
        return {};
    },
    addService: async (
        title: string,
        description: string,
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Service')
            .insert([{ title, description, business_id: get().id }])
            .select()
            .limit(1)
            .single()
        if (error) {
            return { error };
        }
        const service = {
            id: data.id,
            title: data.title,
            description: data.description,
            enabled: data.enabled,
            service_options: new Map<number, ServiceOption>(),
            locations: new Map<number, Location>()
            ,
        } as Service
        get().services.set(data.id, service);
        return {};
    },
    addAvailability: async (
        availabilities: { from: Date, to: Date }[]
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Availability')
            .insert(availabilities.map(({ from, to }) => ({
                from,
                to,
                business_id: get().id
            }))
            )
            .select()
        if (error) {
            return { error };
        }
        const availability = new Map<number, TimeSlot>(get().availability);
        data?.forEach((avail: TimeSlot) => {
            availability.set(
                avail.id, {
                    id: avail.id,
                    from: new Date(avail.from),
                    to: new Date(avail.to),
                    business_id: get().id
                } as TimeSlot)
        })
        set({ availability });
        return {};
    },
    addBusinessLocation: async (
        streetAddress: string,
        flatNumber: string | null,
        city: string,
        postcode: string,
        country: string,
        longitude: number,
        latitude: number
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Location')
            .insert([{
                street_address: streetAddress,
                flat_number: flatNumber,
                city,
                postcode,
                country,
                longitude,
                latitude,
                business_id: get().id,
                enabled: true
            }])
            .select()
            .limit(1)
            .single()

        if (error) {
            return { error };
        }
        set((state) => ({
            locations: new Map(state.locations).set(data.id, data)
        }));
        return {};
     },
    addServiceOption: async (
        title: string,
        description: string,
        enabled: boolean,
        serviceId: number
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('ServiceOption')
            .insert([{
                title,
                description,
                enabled,
                service_id: serviceId
            }])
            .select()
            .limit(1)
            .single()

        if (error) {
            return { error };
        }
        const service = get().services.get(serviceId);
        if (!service) return {};
        service.service_options.set(data.id, {...data, addOns: new Map<number, AddOn>(), variants: new Map<number, Variant>()});
        return {};
    },
    addServiceLocation: async (
        locationId: number,
        serviceId: number
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('ServiceLocation')
            .insert([{
                location_id: locationId,
                service_id: serviceId
            }])
            .select()
            .limit(1)
            .single()

        if (error) {
            return { error };
        }
        const service = get().services.get(data.service_id) as Service;
        const newService = { ...service, locations: new Map(service.locations).set(data.id, data) };
        set((state) => ({
            services: new Map(state.services).set(service.id, newService)
        }));
        return {};

    },
    addAddOn: async (
        name: string,
        price: number,
        duration: number,
        enabled: boolean,
        serviceOptionId: number,
        serviceId: number,
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('AddOn')
            .insert([{
                name,
                price,
                duration,
                enabled,
                service_option_id: serviceOptionId
            }])
            .select()
            .limit(1)
            .single()

        if (error) {
            return { error };
        }
        const service = get().services.get(serviceId) as Service;
        if (!service) return {};
        service.service_options.get(serviceOptionId)?.addOns.set(data.id, {...data, service_id: serviceId});
        set((state) => ({
            services: new Map(state.services).set(serviceId, service)
        }));
        return {}
    },
    addVariant: async (
        name: string,
        price: number,
        duration: number,
        enabled: boolean,
        serviceOptionId: number,
        serviceId: number,
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Variant')
            .insert([{
                name,
                price,
                duration,
                enabled,
                service_option_id: serviceOptionId
            }])
            .select()
            .limit(1)
            .single()

        if (error) {
            return { error };
        }
        const service = get().services.get(serviceId);
        if (!service) return {};
        service.service_options.get(serviceOptionId)?.variants.set(data.id, {...data, service_id: serviceId});
        return {};
    },
    removeService: async (serviceId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Service')
            .delete()
            .eq('id', serviceId)
        if (error) {
            return { error };
        }
        set((state) => {
            const services = new Map(state.services);
            services.delete(serviceId);
            return { services };
        });
        return {};
    },
    removeAvailability: async (availabilityIds: number[]) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Availability')
            .delete()
            .in('id', availabilityIds)
        if (error) {
            return { error };
        }
        set((state) => {
            const availability = new Map(state.availability);
            availability.forEach((avail, id) => {
                if (availabilityIds.includes(id)) {
                    availability.delete(id);
                }
            });
            return { availability };
        });
        return {};
    },
    removeBusinessLocation: async (locationId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Location')
            .delete()
            .eq('id', locationId)
        if (error) {
            return { error };
        }
        set((state) => {
            const locations = new Map(state.locations);
            locations.delete(locationId);
            return { locations };
        });
        return {};
    },
    removeServiceLocation: async (serviceId: number, locationId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('ServiceLocation')
            .delete()
            .eq('service_id', serviceId)
        if (error) {
            return { error };
        }
        set((state) => {
            const service = state.services.get(serviceId) as Service;
            const locations = new Map(service.locations).delete(locationId);
            const newService = { ...service, locations } as unknown as Service;
            const services = new Map(state.services).set(serviceId, newService);
            return { services };
        });
        return {};
    },
    removeServiceOption: async (serviceId: number, serviceOptionId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('ServiceOption')
            .delete()
            .eq('id', serviceOptionId)
        if (error) {
            return { error };
        }
        set((state) => {
            const service = state.services.get(serviceId) as Service;
            service.service_options.delete(serviceOptionId);
            const services = new Map(state.services).set(serviceId, service);
            return { services };
        });
        return {};
    },
    removeAddOn: async (serviceId: number, serviceOptionId: number, addOnId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('AddOn')
            .delete()
            .eq('id', addOnId)
        if (error) {
            return { error };
        }
        set((state) => {
            const service = state.services.get(serviceId);
            if (!service) return {};
            service.service_options.get(serviceOptionId)?.addOns.delete(addOnId);
            const services = new Map(state.services).set(serviceId, service);
            return { services };
        });
        return {};
    },
    removeVariant: async (serviceId: number, serviceOptionId: number, variantId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Variant')
            .delete()
            .eq('id', variantId)
        if (error) {
            return { error };
        }
        set((state) => {
            const service = state.services.get(serviceId);
            if (!service) return {};
            service.service_options.get(serviceOptionId)?.variants.delete(variantId);
            return { services: new Map(state.services).set(serviceId, service) };
        });
        return {};
    },
    cancelAppointment: async (appointmentId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Appointment')
            .delete()
            .eq('id', appointmentId)
        if (error) {
            return { error };
        }
        set((state) => {
            const appointments = new Map(state.appointments);
            appointments.delete(appointmentId);
            return { appointments };
        });
        return {};
    },
    editBusinessName: async (newName: string) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Business')
            .update({ name: newName })
            .eq('id', get().id)
        if (error) {
            return { error };
        }
        set({ name: newName });
        return {};
    },
    editBusinessPhoneNumber: async (newNumber: string | null) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Business')
            .update({ phone_number: newNumber })
            .eq('id', get().id)
        if (error) {
            return { error };
        }
        set({ phoneNumber: newNumber });
        return {};
    },
    editBusinessDescription: async (newDescription: string) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Business')
            .update({ description: newDescription })
            .eq('id', get().id)
        if (error) {
            return { error };
        }
        set({ description: newDescription });
        return {};
    },
    editBusinessFacebook: async (newFacebook: string | null) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Business')
            .update({ facebook: newFacebook })
            .eq('id', get().id)
        if (error) {
            return { error };
        }
        set({ facebook: newFacebook });
        return {};
    },
    editBusinessInstagram: async (newInstagram: string | null) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Business')
            .update({ instagram: newInstagram })
            .eq('id', get().id)
        if (error) {
            return { error };
        }
        set({ instagram: newInstagram });
        return {};
    },
    editBusinessTwitter: async (newTwitter: string | null) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Business')
            .update({ twitter: newTwitter })
            .eq('id', get().id)
        if (error) {
            return { error };
        }
        set({ twitter: newTwitter });
        return {};
    },
    editServiceName: async (serviceId: number, newName: string) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Service')
            .update({ title: newName })
            .eq('id', serviceId)
        if (error) {
            return { error };
        }
        const service = get().services.get(serviceId);
        if (!service) return {};
        service.title = newName;
        set((state) => ({
            services: new Map(state.services).set(serviceId, service)
        }));
        return {};
    },
    editAvailability: async (availabilityId: number, newAvailability: { from: Date, to: Date }) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Availability')
            .update(newAvailability)
            .eq('id', availabilityId)
        if (error) {
            return { error };
        }
        const timeSlot = get().availability.get(availabilityId);
        if (!timeSlot) return {};
        timeSlot.from = newAvailability.from;
        timeSlot.to = newAvailability.to;
        set((state) => ({
            availability: new Map(state.availability).set(availabilityId, timeSlot)
        }));
        return {};
    },
    editServiceDescription: async (serviceId: number, newDescription: string) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Service')
            .update({ description: newDescription })
            .eq('id', serviceId)
        if (error) {
            return { error };
        }
        const service = get().services.get(serviceId);
        if (!service) return {};
        service.description = newDescription;
        set((state) => ({
            services: new Map(state.services).set(serviceId, service)
        }));
        return {};
    },
    editVariantPrice: async (serviceId: number, serviceOptionId: number, variantId: number, newPrice: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Variant')
            .update({ price: newPrice })
            .eq('id', variantId)
        if (error) {
            return { error };
        }
        const variant = get().services.get(serviceId)?.service_options.get(serviceOptionId)?.variants.get(variantId);
        if (!variant) return {};
        variant.price = newPrice;
        return {};
    },
    editAddOnPrice: async (serviceId: number, serviceOptionId: number, addOnId: number, newPrice: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('AddOn')
            .update({ price: newPrice })
            .eq('id', addOnId)
        if (error) {
            return { error };
        }
        const service = get().services.get(serviceId);
        if (!service) return {};
        const addOn = service.service_options.get(serviceOptionId)?.addOns.get(addOnId);
        if (!addOn) return {};
        addOn.price = newPrice;
        set((state) => ({
            services: new Map(state.services).set(serviceId, service)
        }));
        return {};
    },
    activateBusiness: async () => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Business')
            .update({ online: true })
            .eq('id', get().id)
        if (error) {
            return { error };
        }
        set({ online: true });
        return {};
    },
    deactivateBusiness: async () => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Business')
            .update({ online: false })
            .eq('id', get().id)
        if (error) {
            return { error };
        }
        set({ online: false });
        return {};
    },
    enableService: async (serviceId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Service')
            .update({ enabled: true })
            .eq('id', serviceId)
        if (error) {
            return { error };
        }
        const service = get().services.get(serviceId);
        if (!service) return {};
        service.enabled = true;
        set((state) => ({
            services: new Map(state.services).set(serviceId, service)
        }));
        return {};
    },
    disableService: async (serviceId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Service')
            .update({ enabled: false })
            .eq('id', serviceId)
        if (error) {
            return { error };
        }
        const service = get().services.get(serviceId);
        if (!service) return {};
        service.enabled = false;
        set((state) => ({
            services: new Map(state.services).set(serviceId, service)
        }));
        return {};
    },
    enableLocation: async (locationId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Location')
            .update({ enabled: true })
            .eq('id', locationId)
        if (error) {
            return { error };
        }
        const location = get().locations.get(locationId);
        if (!location) return {};
        location.enabled = true;
        return {};
    },
    disableLocation: async (locationId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Location')
            .update({ enabled: false })
            .eq('id', locationId)
        if (error) {
            return { error };
        }
        const location = get().locations.get(locationId);
        if (!location) return {};
        location.enabled = false;
        return {};
    },
    enableServiceOption: async (serviceId: number, serviceOptionId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('ServiceOption')
            .update({ enabled: true })
            .eq('id', serviceOptionId)
        if (error) {
            return { error };
        }
        const serviceOption = get().services.get(serviceId)?.service_options.get(serviceOptionId);
        if (!serviceOption) return {};
        serviceOption.enabled = true;
        return {};
    },
    disableServiceOption: async (serviceId: number, serviceOptionId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('ServiceOption')
            .update({ enabled: false })
            .eq('id', serviceOptionId)
        if (error) {
            return { error };
        }
        const serviceOption = get().services.get(serviceId)?.service_options.get(serviceOptionId);
        if (!serviceOption) return {};
        serviceOption.enabled = false;
        return {};
    },
    enableVariant: async (serviceId: number, serviceOptionId: number, variantId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Variant')
            .update({ enabled: true })
            .eq('id', variantId)
        if (error) {
            return { error };
        }
        const variant = get().services.get(serviceId)?.service_options.get(serviceOptionId)?.variants.get(variantId);
        if (!variant) return {};
        variant.enabled = true;
        return {};
    },
    disableVariant: async (serviceId: number, serviceOptionId: number, variantId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Variant')
            .update({ enabled: false })
            .eq('id', variantId)
        if (error) {
            return { error };
        }
        const variant = get().services.get(serviceId)?.service_options.get(serviceOptionId)?.variants.get(variantId);
        if (!variant) return {};
        variant.enabled = false;
        return {};
    },
    enableAddOn: async (serviceId: number, serviceOptionId: number, addOnId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('AddOn')
            .update({ enabled: true })
            .eq('id', addOnId)
        if (error) {
            return { error };
        }
        const addOn = get().services.get(serviceId)?.service_options.get(serviceOptionId)?.addOns.get(addOnId);
        if (!addOn) return {};
        addOn.enabled = true;
        return {};
    },
    disableAddOn: async (serviceId: number, serviceOptionId: number, addOnId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('AddOn')
            .update({ enabled: false })
            .eq('id', addOnId)
        if (error) {
            return { error };
        }
        const addOn = get().services.get(serviceId)?.service_options.get(serviceOptionId)?.addOns.get(addOnId);
        if (!addOn) return {};
        addOn.enabled = false;
        return {};
    }
  })
)