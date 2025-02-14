import { create } from 'zustand'
import { supabaseClient } from '../auth/supabase'
import { AuthError, PostgrestError } from '@supabase/supabase-js'
import { Appointment, Notification } from '@/components/business/types'
import { Address } from '@/components/business/businessLocation/types'
import { Filters, Radius, Rating, SortBy } from '@/components/explore/types'
import { formatAddress } from '@/components/explore/utils'
export interface CustomerStore {
    appointments: Map<number, Appointment>,
    notifications: Map<number, Notification>,
    searchHistory: Address[],
    searchFilters: Filters,
    loading: boolean,
    load: () => Promise<void>,
    loadAppointments: () => Promise<void>,
    setSearchFilters: (filters: Filters) => void,
    setSearchAddress: (address: Address) => void,
    setSearchSortBy: (sortBy: SortBy) => void,
    setSearchRadius: (radius: Radius) => void,
    setSearchRating: (rating: Rating) => void,
    setSearchInput: (searchInput: string) => void,
    clearSearchFilters: () => void,
    addSearchHistory: (address: Address) => void,
    bookAppointment: (
        businessId: number,
        variantId: number,
        locationId: number,
        startTime: Date,
        endTime: Date,
        addOns: number[],
        customizableOptions: Map<number, string>,
        totalPrice: number,
        paid: boolean,
        customerId: string
    ) => Promise<{ data?: Appointment | undefined, error?: AuthError | PostgrestError | Error }>,
rescheduleAppointment: (
        appointmentId: number,
        newStartTime: Date,
        newEndTime: Date
    ) => Promise<{ error?: AuthError | PostgrestError |  Error }>,
    cancelAppointment: (appointmentId: number) => Promise< { error?: AuthError | PostgrestError | Error }>,
    reset: () => void
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
    appointments: new Map<number, Appointment>(),
    notifications: new Map<number, Notification>(),
    searchHistory: [],
    searchFilters: {
        radius: "any",
        rating: "any",
        sortBy: "recommended",
        searchInput: "",
        address: undefined
    },
    loading: true,
    load: async () => {
        await get().loadAppointments();
        set({ loading: false });
    },
    loadAppointments: async () => {
        const supabase = await supabaseClient;
        const user = await supabase.auth.getUser();
        if (!user || !user.data.user) return;
        const { data, error } = await supabase
            .from('Appointment')
            .select()
            .eq('customer_id', user.data.user.id)
        if (error) {
            console.log(error);
            return;
        }
        if (data) {
            const appointments = new Map<number, Appointment>();
            data.forEach((a: Appointment) => {
                appointments.set(a.id, {...a, start_time: new Date(a.start_time), end_time: new Date(a.end_time)});
            });
            set({ appointments });
        }
    },
    setSearchFilters: (filters: Filters) => set({ searchFilters: filters }),
    setSearchSortBy: (sortBy: SortBy) => set({ searchFilters: {...get().searchFilters, sortBy } }),
    setSearchRadius: (radius: Radius) => set({ searchFilters: {...get().searchFilters, radius: radius } }),
    setSearchRating: (rating: Rating) => set({ searchFilters: {...get().searchFilters, rating } }),
    setSearchAddress: (address: Address) => set({ searchFilters: {...get().searchFilters, address } }),
    setSearchInput: (searchInput: string) => set({ searchFilters: {...get().searchFilters, searchInput } }),
    clearSearchFilters: () => set({ searchFilters: {...initialFilters} }),
    addSearchHistory: (address: Address) => {
        let history = get().searchHistory;
        const formattedAddress = formatAddress(address);
        history = history.filter(a => formattedAddress !== formatAddress(a));
        const newHistory = [address, ...history].slice(0, 5)
        set({ searchHistory: newHistory })
    },
    bookAppointment: async (
        businessId: number,
        variantId: number,
        locationId: number,
        startTime: Date,
        endTime: Date,
        addOns: number[],
        customizableOptions: Map<number, string>,
        totalPrice: number,
        paid: boolean,
        customerId: string
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase.from('Appointment').insert({
            business_id: businessId,
            variant_id: variantId,
            location_id: locationId,
            start_time: startTime,
            end_time: endTime,
            total_price: totalPrice,
            paid: paid,
            customer_id: customerId
        })
        .select()
        .single();
        if (error) {
            console.log(error);
            return { data: undefined, error };
        };
        if (!data) return { data: undefined, error: new Error("Failed to book appointment") };
        const { error: error2 }  = await supabase
            .from('AppointmentAddOn')
            .insert(addOns.map(a => ({ appointment_id: data?.id, addon_id: a })))
        if (error2) {
            console.log(error2);
            await supabase.from('Appointment').delete().eq('id', data.id)
            return { data: undefined, error: error2 };
        }
        set({
            appointments: new Map([
                ...get().appointments, [
                    data.id, {...data, start_time: new Date(data.start_time), end_time: new Date(data.end_time)}
                ]])
            });
        return { data: data as Appointment, error: undefined };
    },
    rescheduleAppointment: async (appointmentId: number, newStartTime: Date, newEndTime: Date) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Appointment')
            .update({ start_time: newStartTime, end_time: newEndTime })
            .eq('id', appointmentId);
        if (error) {
            console.log(error);
            return { error };
        }
        const appointments = new Map(get().appointments);
        const appointment = appointments.get(appointmentId);
        if (appointment) {
            appointments.set(appointmentId, {...appointment, start_time: newStartTime, end_time: newEndTime});
            set({ appointments });
        }
        return {};
    },
    cancelAppointment: async (appointmentId: number) => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Appointment')
            .update({ cancelled: true })
            .eq('id', appointmentId);
        if (error) {
            console.log(error);
            return { error };
        }
        const appointment = get().appointments.get(appointmentId);
        if (!appointment) return { error: new Error("Appointment not found") };
        appointment.cancelled = true;
        set((state) => ({
            appointments: new Map(state.appointments).set(appointmentId, appointment)
        }));
        return { error: undefined };
    },
    reset: () => set(initialState)
  })
)

const initialFilters = {
    radius: "any",
    rating: "any",
    sortBy: "recommended",
    searchInput: "",
    address: undefined,
} as Filters

const initialState = {
    appointments: new Map<number, Appointment>(),
    notifications: new Map<number, Notification>(),
    loading: true,
    searchHistory: [],
    searchFilters: {...initialFilters},
}