import { create } from 'zustand'
import { supabaseClient } from '../auth/supabase'
import { AuthError, PostgrestError } from '@supabase/supabase-js'
import { AddOn, Appointment, Business, Location, Service, Style, Variant } from '@/components/business/types'

export interface Booking {
    business: Business | undefined,
    service: Service| undefined,
    style: Style | undefined,
    variant: Variant| undefined,
    addOns: AddOn[],
    customizableOptions: Map<number, string>,
    location: Location | undefined,
    startTime: Date | undefined,
    endTime: Date | undefined,
    totalPrice: number | undefined,
    duration: number | undefined,
    setCustomizableOptions: (customizableOptions: Map<number, string>) => void,
    getTotalPrice: (
        variantId: number,
        addOns: number[],
    ) => Promise<number | AuthError | PostgrestError>,
    getAppointmentDuration: (
        variantId: number,
        addOns: number[],
    ) => Promise<number | AuthError | PostgrestError>,
    isAppointmentSlotValid: () => Promise<boolean | AuthError | PostgrestError>,
    isLocationValid: () => Promise<boolean | AuthError | PostgrestError>,
    isBusinessOnline: () => Promise<boolean | AuthError | PostgrestError>,
    refundBooking: (paymentIntentId: string) => Promise<Response>,
    reset: () => void
}


export const useBookingStore = create<Booking>((set, get) => ({
    business: undefined,
    service: undefined,
    style: undefined,
    variant: undefined,
    addOns: [],
    customizableOptions: new Map<number, string>(),
    location: undefined,
    startTime: undefined,
    endTime: undefined,
    totalPrice: undefined,
    duration: undefined,
    setCustomizableOptions: (customizableOptions: Map<number, string>) => set({ customizableOptions  }),
    bookAppointment: async (
        businessId: number,
        variantId: number,
        locationId: number,
        startTime: Date,
        endTime: Date,
        addOns: number[],
        customizableOptions: Map<number, string>,
        totalPrice: number
    ) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase.from('Appointment').insert({
            business_id: businessId,
            variant_id: variantId,
            location_id: locationId,
            start_time: startTime,
            end_time: endTime,
            total_price: totalPrice
        })
        .select()
        .single();
        if (error) return error;
        if (!data) return new Error("Failed to book appointment");
        const { error: error2 }  = await supabase
            .from('AppointmentAddOn')
            .insert(addOns.map(a => ({ appointment_id: data?.id, addon_id: a })))
        if (error2) {
            await supabase.from('Appointment').delete().eq('id', data.id)
            return error2;
        }
        return data as Appointment;
    },
    getTotalPrice: async (variantId: number, addOns: number[]) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase.rpc('calculate_total_price', {
                vid: variantId,
                addons: addOns
        });
        if (error) return error;
        return data;
    },
    getAppointmentDuration: async (variantId: number, addOns: number[]) => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase.rpc('calculate_total_duration', {
                vid: variantId,
                addons: addOns
        });
        if (error) return error;
        console.log(data);
        return data;
    },
    isAppointmentSlotValid: async () => {
        if (!get().business || !get().startTime || !get().endTime) return false;
        const supabase = await supabaseClient;
        const { data: doesOverlap, error } = await supabase.rpc('does_appointment_overlap', {
            aid: -1,
            bid: get().business?.id,
            input_start_time: get().startTime,
            input_end_time: get().endTime,
        })
        if (error) return error;
        return !(doesOverlap as boolean);
    },
    isLocationValid: async () => {
        if (!get().location) return false;
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Location')
            .select('id')
            .eq('id', get().location!.id)
            .single();
        if (error) return error;
        return !!data.id;
    },
    isBusinessOnline: async () => {
        if (!get().business) return false;
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Business')
            .select('online')
            .eq('id', get().business!.id)
            .single();
        if (error) return error;
        return data.online;
    },
    refundBooking: refundBooking,
    reset: () => set(initialState)
  })
)

const initialState = {
    business: undefined,
    service: undefined,
    style: undefined,
    variant: undefined,
    addOns: [],
    customizableOptions: new Map<number, string>(),
    location: undefined,
    startTime: undefined,
    endTime: undefined,
    totalPrice: undefined,
    duration: undefined,
}

export const refundBooking = async (paymentIntentId: string) => {
    const supabase = await supabaseClient;
    const response = await supabase.functions.invoke("refund-booking", {
        method: "POST",
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
        }),
        headers: {
            "API-KEY": process.env.EXPO_PUBLIC_WEB_API_KEY!,
        },
    });
    return response.data;
}