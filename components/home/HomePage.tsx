import React, { useCallback, useState } from 'react';
import { useCustomerStore } from '@/utils/stores/customerStore';
import { View, useTheme } from 'tamagui';
import { Text } from 'react-native';
import { useAppointmentSummaries } from '@/hooks/business/useAppointmentSummaries';
import { Collapsible } from '../utils';
import { hasPast } from './utils';
import PageSpinner from '../utils/loading/PageSpinner';
import { AppointmentList } from './appointments/AppointmentList';


export default function HomePage() {
  const theme = useTheme();
  const appointmentMap = useCustomerStore((state) => state.appointments);
  const fetchAppointments = useCustomerStore((state) => state.loadAppointments);
  const loading = useCustomerStore((state) => state.loading);
  const [refreshing, setRefreshing] = useState(false);


  const appointments = Array.from(appointmentMap.values()).sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

  const items = appointments
    .filter((a) => !hasPast(a.start_time) && !a.cancelled);
  const past = appointments
    .filter((a) => hasPast(a.start_time) && !a.cancelled)
  const cancelled = appointments
    .filter((a) => a.cancelled)

  const {
    appointments: summaries,
    isFetchingAppointments,
    refetchAppointments
  } = useAppointmentSummaries(appointments.map((a) => a.id));
  const HeaderComponent = () => {
    return (
      <View gap={15}>
      <Collapsible
          defaultOpen={false}
          header={
            <Text style={{ fontSize: 14,  color: theme.color.val, opacity: 0.7, width: "90%"}}>
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
            <Text style={{ fontSize: 14,  color: theme.color.val, opacity: 0.7, width: "90%"}}>
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
    <View flex={1} backgroundColor={theme.background.val} paddingHorizontal={16} paddingTop={10}>

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
