import { useBusinessStore } from '@/utils/stores/businessStore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, RefreshControl, useWindowDimensions } from 'react-native';
import { useTheme, View } from 'tamagui';
import { Agenda } from 'react-native-calendars';
import { Appointment } from '@/components/business/types';
import { AppointmentSummary } from '@/hooks/business/useAppointmentSummaries';
import { useLocalSearchParams } from 'expo-router';
import { AppointmentItem } from '@/components/business/appointment/Appointment';
import PageSpinner from '@/components/utils/loading/PageSpinner';

const parseAgendaItems = (appointments: Appointment[]): Record<string, Appointment[]> => {
  // Get all appointment dates
  const appointmentDates = appointments
    .filter((appointment) => appointment.start_time) // Ensure the date exists
    .map((appointment) => new Date(appointment.start_time).toISOString().split('T')[0]);

  // Find the minimum and maximum dates
  const minDate = appointmentDates.length > 0
    ? Math.min(...appointmentDates.map((date) => new Date(date).getTime()))
    : new Date().getTime();
  const maxDate = appointmentDates.length > 0
    ? Math.max(...appointmentDates.map((date) => new Date(date).getTime()))
    : new Date().getTime();

  // Adjust minDate and maxDate to ±1 years
  const adjustedMinDate = new Date(minDate);
  adjustedMinDate.setFullYear(adjustedMinDate.getFullYear() - 1); // Subtract 2 years
  const adjustedMaxDate = new Date(maxDate);
  adjustedMaxDate.setFullYear(adjustedMaxDate.getFullYear() + 1); // Add 2 years

  // Initialize the items object
  const items: Record<string, Appointment[]> = {};
  // Iterate through each day between adjustedMinDate and adjustedMaxDate
  for (let currentDate = adjustedMinDate.getTime(); currentDate <= adjustedMaxDate.getTime(); currentDate += 86400000) { // 86400000 ms = 1 day
    const dateKey = new Date(currentDate).toISOString().split('T')[0];
    items[dateKey] = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start_time).toISOString().split('T')[0];
      return appointmentDate === dateKey;
    }).sort((a, b) =>  a.start_time.getTime() - b.start_time.getTime());
  }
  return items;
}

type AppointmentCalendarProps = {
    summaries: Map<number, AppointmentSummary>
    refetchAppointments: () => void,
    isFetchingAppointments: boolean,
    isRefetchingAppointments: boolean,
}
export default function AppointmentCalendar({
    summaries,
    refetchAppointments,
    isFetchingAppointments,
    isRefetchingAppointments
}: AppointmentCalendarProps) {
  const { appointmentId, date } = useLocalSearchParams();
  const agendaRef = useRef<Agenda>(null);
  const theme = useTheme();

  const appointmentsMap = useBusinessStore((state) => state.appointments);
  const loadAppointments = useBusinessStore((state) => state.loadBusinessAppointments);
  const isLoading = useBusinessStore((state) => state.loading);

  const appointments = Array.from(appointmentsMap.values());

  const { height: screenHeight } = useWindowDimensions();

  const extraData = [appointments, summaries]

  const isIPad = Platform.OS === 'ios' && Platform.isPad;

  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<Record<string, Appointment[]>>(parseAgendaItems([]))
  const [height, setHeight] = useState(isIPad ? screenHeight*1.0001:"100%");

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await refetchAppointments();
    await loadAppointments();
    setItems(parseAgendaItems(appointments));
    setRefreshing(false);
  }, [refetchAppointments, loadAppointments, appointments]);


  // Update the items when the appointments are fetched
  useEffect(() => {
    if (!isFetchingAppointments && !isLoading) {
      setRefreshing(true);
      setItems(parseAgendaItems(appointments));
      setRefreshing(false);
    }
  }, [isFetchingAppointments, isLoading, isRefetchingAppointments]);

  // Update the height when the appointments are fetched (iPad only) because the height is not calculated correctly
  useEffect(() => {
    if (!isFetchingAppointments && !isLoading) {
      setTimeout(() => {
        if (isIPad) {
          setHeight("100%");
        }
      }, 1);
    }
  }, [isFetchingAppointments, isLoading, isRefetchingAppointments]);

  useEffect(() => {
    if (agendaRef.current && appointmentId && date) {
      const yearFromNow = new Date();
      yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);

      const yearBeforeNow = new Date();
      yearBeforeNow.setFullYear(yearBeforeNow.getFullYear() - 1);

      const bookingDate = new Date(typeof date === "string" ? date : date[0]);

      // If the date is over a year ago or over a year from now, do not select it
      if (bookingDate.getTime() < yearBeforeNow.getTime() || bookingDate.getTime() > yearFromNow.getTime()) {
        return;
      }

      const dateData = {
        year: bookingDate.getFullYear(),
        month: bookingDate.getMonth() + 1,
        day: bookingDate.getDate(),
        timestamp: bookingDate.getTime(),
        dateString: bookingDate.toISOString().split('T')[0],
      }
      agendaRef.current.chooseDay(dateData, true);
    }
  }, [date, appointmentId, agendaRef.current]);

  return (
    <View height={height} width={"100%"} backgroundColor={theme.background.val} position='relative'>
    {isLoading && isFetchingAppointments && !isRefetchingAppointments ? <PageSpinner/>: (
    <Agenda
        ref={agendaRef}
        refreshControl={
        <RefreshControl
            refreshing={refreshing || isRefetchingAppointments}
            onRefresh={refresh}
            tintColor={theme.color.val}
            colors={[theme.color.val]}
        />
        }
        items={items}
        extraData={extraData}
        selected={new Date().toISOString().split('T')[0]}
        renderItem={(item: Appointment) => <AppointmentItem appointment={item} summary={summaries.get(item.id)} />}
        renderEmptyData={Separator}
        renderEmptyDate={() => {
        return(
            <View height={100} width={"100%"} justifyContent="flex-start" alignItems="flex-start">
            <View height={1} width={"99%"} backgroundColor={theme.gray5.val} opacity={0.8} />
            </View>
        )
        }}
        pastScrollRange={200}
        futureScrollRange={200}
        theme={{
        "stylesheet.agenda.main": {
            reservations: {
            paddingTop: 130,
            backgroundColor: theme.background.val,
            },
        },
        backgroundColor: theme.background.val,
        agendaBackground: theme.background.val,
        calendarBackground: theme.background.val,
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#00adf5',
        todayTextColor: theme.orangeRed.val,
        dayTextColor: '#2d4150',
        textDisabledColor: '#dd99ee',
        borderColor: theme.section.val,
        agendaTodayColor: theme.orangeRed.val,
        agendaKnobColor: theme.section.val,
        dotColor: theme.orangeRed.val,
        }}
        dayLabelsWrapper={{
        borderBottomWidth: 2,
        borderTopWidth: 2,
        }}
    />
    )}
    </View>
  );
}

const Separator = () => {
  const theme = useTheme();
  return (
    <View height={1} width={"100%"} justifyContent="flex-start" alignItems="flex-start">
      <View height={1} width={"99%"} backgroundColor={theme.gray5.val} opacity={0.6} />
    </View>
  );
}

