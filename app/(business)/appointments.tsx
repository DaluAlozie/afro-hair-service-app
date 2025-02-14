import AppointmentCalendar from '@/components/business/appointment/AgendaCalendar'
import AgendaList from '@/components/business/appointment/AgendaList'
import Pressable from '@/components/utils/Pressable'
import { useAppointmentSummaries } from '@/hooks/business/useAppointmentSummaries'
import { useBusinessStore } from '@/utils/stores/businessStore'
import { Entypo, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import { useTheme, View, Text } from 'tamagui'

export default function Appointments() {
  const theme = useTheme();
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const appointmentsMap = useBusinessStore((state) => state.appointments);
  const appointments = Array.from(appointmentsMap.values());
  const {
    appointments: summaries,
    refetchAppointments,
    isFetchingAppointments,
    isRefetchingAppointments
  } = useAppointmentSummaries(appointments.map((a) => a.id));

  return (
    <View>
      {view === "calendar" ?
      <AppointmentCalendar
        summaries={summaries}
        refetchAppointments={refetchAppointments}
        isFetchingAppointments={isFetchingAppointments}
        isRefetchingAppointments={isRefetchingAppointments}
       /> :
      <AgendaList
        summaries={summaries}
        refetchAppointments={refetchAppointments}
        isFetchingAppointments={isFetchingAppointments}
        isRefetchingAppointments={isRefetchingAppointments}
       />
      }
      <AvailabilityButton />
      <View position='absolute' bottom={40} left={20} zIndex={1000} height={50}>
        {view === "list" ?
        <Pressable onPress={() => setView("calendar")} activeOpacity={0.99}>
          <FontAwesome5 name="calendar-alt" size={24} color={theme.color.val}/>
        </Pressable>:
        <Pressable onPress={() => setView("list")} activeOpacity={0.99}>
          <FontAwesome6 name="list-ul" size={24} color={theme.color.val} />
        </Pressable>
        }
      </View>
    </View>
  )
}

const AvailabilityButton = () => {
  const router = useRouter();
  const theme = useTheme();
  const inverseTheme = useTheme({ inverse: true });
  const scheme = useColorScheme();
  return (
    <View position='absolute' bottom={50} right={20} zIndex={1000}>
      <Pressable onPress={() => router.push('/myBusiness/availability')} activeOpacity={0.99} style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: scheme === 'light' ? theme.section.val : inverseTheme.background.val,
          width: 130,
          height: 55,
          justifyContent: 'center',
          gap: 10,
          borderRadius: 100,
          }}>
          <Entypo name="calendar" size={24} color={ scheme === 'light' ? theme.color.val : inverseTheme.color.val} />
          <Text color={scheme === 'light' ? theme.color.val : inverseTheme.color.val}>Availability</Text>
      </Pressable>
    </View>
  )
}

