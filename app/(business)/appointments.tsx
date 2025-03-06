import AppointmentCalendar from '@/components/business/appointment/AgendaCalendar'
import BusinessWrapper from '@/components/business/BusinessWrapper'
import Pressable from '@/components/utils/Pressable'
import { useAppointmentSummaries } from '@/hooks/business/useAppointmentSummaries'
import { useBusinessStore } from '@/utils/stores/businessStore'
import { Entypo } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { useTheme, View, Text } from 'tamagui'

export default function Appointments() {
  const appointmentsMap = useBusinessStore((state) => state.appointments);
  const appointments = useMemo(() => Array.from(appointmentsMap.values()), [appointmentsMap]);
  const loadingAppointments = useBusinessStore((state) => state.loadingAppointments);
  const {
    appointments: summaries,
    refetchAppointments,
    isFetchingAppointments,
    isRefetchingAppointments
  } = useAppointmentSummaries(appointments.map((a) => a.id));

  return (
    <BusinessWrapper loading={loadingAppointments || isFetchingAppointments}>
      <AppointmentCalendar
        summaries={summaries}
        refetchAppointments={async () => { await refetchAppointments()}}
        isFetchingAppointments={isFetchingAppointments}
        isRefetchingAppointments={isRefetchingAppointments}
       />
      <AvailabilityButton />
    </BusinessWrapper>
  )
}

const AvailabilityButton = () => {
  const router = useRouter();
  const theme = useTheme();
  return (
    <View position='absolute' bottom={50} right={20} zIndex={1000}>
      <Pressable onPress={() => router.push('/myBusiness/availability')} activeOpacity={0.99} style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.accent.val,
        width: 140,
        height: 55,
        justifyContent: 'center',
        gap: 10,
        borderRadius: 100,
        }}>
          <Entypo name="calendar" size={24} color={theme.white1.val} />
          <Text color={theme.white1.val}>Availability</Text>

      </Pressable>
    </View>
  )
}

