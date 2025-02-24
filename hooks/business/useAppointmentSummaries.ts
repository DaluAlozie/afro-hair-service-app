import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export interface AppointmentSummary {
  id: number,
  start_time: Date,
  end_time: Date,
  total_price: number,
  paid: boolean,
  cancelled: boolean,
  business: string,
  business_owner_id: string,
  service: string,
  service_option: string,
  variant: string,
  add_ons: string[],
  street_address: string,
  flat_number: string,
  city: string,
  locality: string,
  postal_code: string,
  country: string,
  latitude: number,
  longitude: number
}

export function useAppointmentSummaries(appointment_ids: number[]) {
    const fetchAppointment = useCallback(
        async ({ queryKey }: { queryKey: [string, { appointment_ids: number[] }] }): Promise<Map<number, AppointmentSummary>> => {
        const [,{ appointment_ids }] = queryKey;
        if (appointment_ids.length === 0) {
            return new Map<number, AppointmentSummary>();
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .rpc('get_appointment_summaries', {
              appointment_ids: appointment_ids
            })
        if (error) {
            return new Map<number, AppointmentSummary>();
        }
        const summaries =  new Map((data as AppointmentSummary[]).map(
            (a: AppointmentSummary) => [a.id, {...a, start_time: new Date(a.start_time), end_time: new Date(a.end_time)}]));
        return summaries;
    }, [appointment_ids]);
    const {
        data: appointments,
        isFetching: isFetchingAppointments,
        refetch: refetchAppointments,
        isRefetching: isRefetchingAppointments
    } = useQuery({
        queryKey: ['appointment', { appointment_ids }],
        queryFn: fetchAppointment,
        initialData: new Map<number, AppointmentSummary>(),
        enabled: !!appointment_ids,
    });

    return {
        appointments,
        isFetchingAppointments,
        refetchAppointments,
        isRefetchingAppointments,
    };
}