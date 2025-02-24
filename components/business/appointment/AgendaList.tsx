import React, { useCallback, useState } from 'react';
import { View, useTheme } from 'tamagui';
import { Text } from 'react-native';
import { AppointmentSummary } from '@/hooks/business/useAppointmentSummaries';
import { hasPast } from '@/components/home/utils';
import { Collapsible } from '@/components/utils';
import { AppointmentList } from '@/components/home/appointments/AppointmentList';
import PageSpinner from '@/components/utils/loading/PageSpinner';
import { useBusinessStore } from '@/utils/stores/businessStore';

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
}: AppointmentCalendarProps) {
  const theme = useTheme();
  const appointmentMap = useBusinessStore((state) => state.appointments);
  const fetchAppointments = useBusinessStore((state) => state.loadBusinessAppointments);
  const loading = useBusinessStore((state) => state.loading);
  const [refreshing, setRefreshing] = useState(false);

  const appointments = Array.from(appointmentMap.values()).sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

  const items = appointments
    .filter((a) => !hasPast(a.start_time) && !a.cancelled);
  const past = appointments
    .filter((a) => hasPast(a.start_time) && !a.cancelled)
  const cancelled = appointments
    .filter((a) => a.cancelled)

  const HeaderComponent = () => {
    return (
      <View gap={15}>
      <Collapsible
          defaultOpen={false}
          header={
            <Text style={{ fontSize: 14,  color: theme.color.val, opacity: 0.7}}>
              Past Appointments
            </Text>
          }>
          <AppointmentList
            appointments={past}
            summaries={summaries}
            refreshing={false}
            onRefresh={() => {}}
            headerText="Past Appointments"
            emptyText="No past appointments"
            />
        </Collapsible>
        <Collapsible
          defaultOpen={false}
          header={
            <Text style={{ fontSize: 14,  color: theme.color.val, opacity: 0.7}}>
              Cancelled Appointments
            </Text>
          }>
          <AppointmentList
            appointments={cancelled}
            summaries={summaries}
            refreshing={false}
            onRefresh={() => {}}
            headerText="Cancelled Appointments"
            emptyText="No cancelled appointments"
            />
        </Collapsible>
      </View>
    );
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAppointments();
    await refetchAppointments();
    setRefreshing(false);
  }, []);
  return (
    <View height={"100%"} width={"100%"} backgroundColor={theme.background.val} paddingHorizontal={16} paddingTop={10}>

      {
        (loading || isFetchingAppointments) ?
          <PageSpinner />
          :
        <AppointmentList
          appointments={items}
          summaries={summaries}
          refreshing={refreshing}
          onRefresh={onRefresh}
          headerComponent={<HeaderComponent />}
          headerText="Upcoming Appointments"
          emptyText="No upcoming appointments"
          />
      }
    </View>
  );
}
