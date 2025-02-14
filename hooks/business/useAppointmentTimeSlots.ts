import { useCallback } from 'react';
import { supabaseClient } from '@/utils/auth/supabase';
import { useQuery } from '@tanstack/react-query';

export default function SelectTime(businessId: number | undefined) {
  const fetchAppointmentSlots= useCallback(async (
    { queryKey }: { queryKey: [string, { businessId: number | undefined }] }
  ) => {
      const [, { businessId }] = queryKey;
      if (!businessId) {
          return [] as { start_time: Date, end_time: Date
          }[];
      }
      const supabase = await supabaseClient;
      const { data, error } = await supabase
          .from('Appointment')
          .select('start_time, end_time')
          .gte('start_time', new Date())
          .eq('cancelled', false)
          .eq('business_id', businessId);
      if (error) {
          console.log(error);
          return [];
      }
      const slots = data.map((a: { start_time: string, end_time: string }) => ({
          start_time: new Date(a.start_time),
          end_time: new Date(a.end_time)
      }));
      return slots;
  }, [businessId]);

  const {
    data: appointmentSlots,
    isFetching: isFetchingAppointmentSlots,
    refetch: refetchAppointmentSlots,
    isRefetching: isRefetchingAppointmentSlots
  } = useQuery({
    queryKey: ['appointmentSlots', { businessId }],
    queryFn: fetchAppointmentSlots,
    initialData: [] as { start_time: Date, end_time: Date }[],
    enabled: !!businessId
  });

    return {
        appointmentSlots,
        isFetchingAppointmentSlots,
        refetchAppointmentSlots,
        isRefetchingAppointmentSlots
    };
}
