import { useBusinessStore } from '@/utils/stores/businessStore';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, RefreshControl, useWindowDimensions } from 'react-native';
import { useTheme, View } from 'tamagui';
import { Agenda } from 'react-native-calendars';
import { Appointment } from '@/components/business/types';
import { AppointmentSummary } from '@/hooks/business/useAppointmentSummaries';
import { useLocalSearchParams } from 'expo-router';
import { AppointmentItem } from '@/components/business/appointment/Appointment';
import PageSpinner from '@/components/utils/loading/PageSpinner';

const parseAgendaItems = (appointments: Appointment[]): Record<string, Appointment[]> => {
  // Group appointments by date
  const groups: Record<string, Appointment[]> = {};
  let minTimestamp = Infinity;
  let maxTimestamp = -Infinity;

  appointments.forEach(app => {
    if (app.start_time) {
      const dateKey = new Date(app.start_time).toISOString().split('T')[0];
      groups[dateKey] = groups[dateKey] ? [...groups[dateKey], app] : [app];

      const startTs = new Date(app.start_time).getTime();
      const endTs = new Date(app.end_time).getTime();
      if (startTs < minTimestamp) minTimestamp = startTs;
      if (endTs > maxTimestamp) maxTimestamp = endTs;
    }
  });

  // Fallback if no appointments
  if (minTimestamp === Infinity) {
    minTimestamp = new Date().getTime();
    maxTimestamp = new Date().getTime();
  }

  // Adjust dates by one month on each side
  const adjustedMin = new Date(minTimestamp);
  adjustedMin.setMonth(adjustedMin.getMonth() - 1);
  const adjustedMax = new Date(maxTimestamp);
  adjustedMax.setMonth(adjustedMax.getMonth() + 1);

  const items: Record<string, Appointment[]> = {};
  // Iterate through every day between adjustedMin and adjustedMax
  for (let time = adjustedMin.getTime(); time <= adjustedMax.getTime(); time += 86400000) {
    const dateKey = new Date(time).toISOString().split('T')[0];
    if (groups[dateKey]) {
      items[dateKey] = groups[dateKey].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
    } else {
      items[dateKey] = [];
    }
  }
  return items;
};

type AppointmentCalendarProps = {
  summaries: Map<number, AppointmentSummary>;
  refetchAppointments: () => Promise<void>;
  isFetchingAppointments: boolean;
  isRefetchingAppointments: boolean;
};

export default function AppointmentCalendar({
  summaries,
  refetchAppointments,
  isFetchingAppointments,
  isRefetchingAppointments,
}: AppointmentCalendarProps) {

  const { appointmentId, date } = useLocalSearchParams();
  const agendaRef = useRef<Agenda>(null);
  const theme = useTheme();

  const appointmentsMap = useBusinessStore((state) => state.appointments);
  const loadAppointments = useBusinessStore((state) => state.loadBusinessAppointments);
  const isLoading = useBusinessStore((state) => state.loading);

  // Memoize the array of appointments to avoid unnecessary recalculations.
  const appointments = useMemo(() => Array.from(appointmentsMap.values()), [appointmentsMap]);

  const minDate = useMemo(() =>
    appointments.length > 0
      ? Math.min(...appointments.map(app => new Date(app.start_time).getTime()))
      : new Date().getTime(),
    [appointments]
  );

  const maxDate = useMemo(() =>
    appointments.length > 0
      ? Math.max(...appointments.map(app => new Date(app.end_time).getTime()))
      : new Date().getTime(),
    [appointments]
  );

  const { height: screenHeight } = useWindowDimensions();
  const isIPad = Platform.OS === 'ios' && Platform.isPad;
  const [refreshing, setRefreshing] = useState(false);
  const [height, setHeight] = useState(isIPad ? screenHeight * 1.0001 : "100%");

  // Compute agenda items only when appointments change.
  const items = useMemo(() => parseAgendaItems(appointments), [appointments]);

  // Extra data for the Agenda to trigger re-render only when necessary.
  const extraData = useMemo(() => [appointments, summaries], [appointments, summaries]);

  // Simplified refresh function.
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchAppointments(), loadAppointments()]);
    setRefreshing(false);
  agendaRef.current?.forceUpdate();
  }, [refetchAppointments, loadAppointments]);

  // For iPad, fix height issues after appointments are fetched.
  useEffect(() => {
    if (!isFetchingAppointments && !isLoading && isIPad) {
      setTimeout(() => {
        setHeight("100%");
      }, 1);
    }
  }, [isFetchingAppointments, isLoading, isIPad]);

  // Automatically select a day if appointmentId and date are provided.
  useEffect(() => {
    if (agendaRef.current && appointmentId && date) {
      const bookingDate = new Date(typeof date === "string" ? date : date[0]);
      const yearFromNow = new Date();
      yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
      const yearBeforeNow = new Date();
      yearBeforeNow.setFullYear(yearBeforeNow.getFullYear() - 1);

      if (
        bookingDate.getTime() < yearBeforeNow.getTime() ||
        bookingDate.getTime() > yearFromNow.getTime()
      ) {
        return;
      }

      const dateData = {
        year: bookingDate.getFullYear(),
        month: bookingDate.getMonth() + 1,
        day: bookingDate.getDate(),
        timestamp: bookingDate.getTime(),
        dateString: bookingDate.toISOString().split('T')[0],
      };
      agendaRef.current.chooseDay(dateData, true);
    }
  }, [date, appointmentId]);

  // Memoize render callbacks.
  const renderItem = useMemo(() => function Item(item: Appointment) {
    return <AppointmentItem appointment={item} summary={summaries.get(item.id)} />;
  }, []);

  const renderEmptyData = useMemo(() => function EmptyData() {
    return (
      <View
        height={100}
        width="100%"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <View
          height={1}
          width="99%"
          backgroundColor={theme.gray5.val}
          opacity={0.8}
        />
      </View>
    );
  }, [theme.gray5.val]);

  const RenderSeparator = useMemo(() => function Line(){ return <Separator /> }, []);

  if (isLoading && isFetchingAppointments && !isRefetchingAppointments) {
    return <PageSpinner />;
  }

  return (
    <View height={height} width="100%" backgroundColor={theme.background.val} position="relative">
      <Agenda
        ref={agendaRef}
        disableAllTouchEventsForInactiveDays
        disableAllTouchEventsForDisabledDays
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
        renderItem={renderItem}
        renderEmptyData={RenderSeparator}
        renderEmptyDate={renderEmptyData}
        pastScrollRange={1}
        futureScrollRange={3}
        minDate={new Date(minDate).toISOString().split('T')[0]}
        maxDate={new Date(maxDate).toISOString().split('T')[0]}
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
          selectedDayBackgroundColor: theme.accent.val,
          todayTextColor: theme.orangeRed.val,
          dayTextColor: theme.color.val,
          textDisabledColor: theme.gray5.val,
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
    </View>
  );
}

const Separator = () => {
  const theme = useTheme();
  return (
    <View height={1} width="100%" justifyContent="flex-start" alignItems="flex-start">
      <View height={1} width="99%" backgroundColor={theme.gray5.val} opacity={0.6} />
    </View>
  );
};
