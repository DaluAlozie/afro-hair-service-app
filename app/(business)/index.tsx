import React, { useMemo } from 'react'
import {  View, XStack, Text } from 'tamagui';
import { useTheme, UseThemeResult } from '@tamagui/core';
import { StyleSheet } from 'react-native';
import BusinessWrapper from '@/components/business/BusinessWrapper';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { Revenue } from './analytics';
import { hasPast, isSameDay, isToday } from '@/components/home/utils';
import { filterAppointments, generateFakeData, Month } from '@/components/business/analytics/utils';
import { useAppointmentSummaries } from '@/hooks/business/useAppointmentSummaries';
import { Service, ServiceOption } from '@/components/business/types';
import Pressable from '@/components/utils/Pressable';
import { useRouter } from 'expo-router';
import { formatTime } from '@/components/business/booking/BookingDetails';
import { formatDate } from '@/components/business/availability/utils';
import Pulse from '@/components/utils/ui/Pulse';
import OnlineIcon from '@/assets/icons/online';

export default function Overview() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container} $gtSm={{ paddingHorizontal: 50, paddingTop: 50 }} padding={20}>
      <OnlineComponent />
      <XStack width={"100%"} justifyContent='space-between'>
        <RevenueComponent />
        <AppointmentList />
      </XStack>
    </View>
  )
}

const OnlineComponent = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const online = useBusinessStore((state) => state.online);
  const loadingBusiness = useBusinessStore((state) => state.loadingBusiness)
  return (
    <View height={20} width={"100%"} mb={20}>
      <BusinessWrapper loading={loadingBusiness}>
        <XStack gap={10} width={"100%"} justifyContent='flex-start'>
          <Text style={styles.fadedText}>{online ? 'Online' : 'Offline'}</Text>
          { online ? (
            <Pulse>
              <View alignItems="center">
              <OnlineIcon size={20} color={"#2db324"} />
              </View>
            </Pulse>
          ) : (
            <View alignItems="center" opacity={0.5}>
             <OnlineIcon size={20} color={theme.color.val} />
            </View>
          )

          }

        </XStack>
      </BusinessWrapper>
    </View>
  )
}
const RevenueComponent = () => {
  const loadingAppointments = useBusinessStore((state) => state.loadingAppointments);
  const appointmentMap = useBusinessStore((state) => state.appointments);
  const router = useRouter();
  // Convert Map to array once.
  const appointments = useMemo(() => Array.from(appointmentMap.values()).filter(a => !a.cancelled && hasPast(a.start_time)), [appointmentMap]);
  const appointmentIds = useMemo(() => appointments.map(a => a.id), [appointments]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { appointments: summaries } = useAppointmentSummaries(appointmentIds);

  // Generate fake data based on the service list.
  const fakeService = {
    id: 122,
    service_options: new Map<number, ServiceOption>()
  } as Service;
  const [fakeAppointments, fakeSummaries] = useMemo(() => generateFakeData([fakeService]), []);

  const filter = {
    year: new Date().getFullYear(),
    month: "all" as "all" | Month,
    range: undefined,
    service: undefined,
    serviceOption: undefined,
  }

  // Use fake data for filtering.
  const filteredAppointments = useMemo(() => filterAppointments(fakeAppointments, fakeSummaries, filter),
    [fakeAppointments, fakeSummaries, filter]);

  return (
    <Pressable style={{ height: 80, width: 160 }} activeOpacity={0.7} scale={0.95} onPress={() => router.push('/(business)/analytics')}>
      <BusinessWrapper loading={loadingAppointments}>
        <View flex={1}>
          <Revenue filter={filter} appointments={filteredAppointments} unfilteredAppointments={fakeAppointments} titleFontSize={14}  />
        </View>
      </BusinessWrapper>
    </Pressable>
  )
}

const AppointmentList = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const loadingAppointments = useBusinessStore((state) => state.loadingAppointments);
  const appointmentMap = useBusinessStore((state) => state.appointments);
  const appointments = useMemo(() => Array.from(appointmentMap.values())
    .sort((a, b) =>  a.start_time.getTime() - b.start_time.getTime())
    .filter(a => !a.cancelled)
    , [appointmentMap]);

  const todayAppointments = useMemo(() => appointments.filter(a => !hasPast(a.start_time) && isToday(a.start_time)), [appointments]);
  const upcomingAppointments = useMemo(() => appointments.filter(a => !hasPast(a.start_time) && !isToday(a.start_time)), [appointments]);

  const { appointments: summaries } = useAppointmentSummaries(appointments.map(a => a.id));

  const router = useRouter();
  return (
    <Pressable style={{ height: 200, width: 190 }} activeOpacity={0.7} scale={0.95} onPress={() => router.push('/(business)/appointments')}>
      <BusinessWrapper loading={loadingAppointments}>
        <View flex={1} gap={30}>
          <View>
            <Text style={styles.title}>Today</Text>
            {todayAppointments.length === 0 && <Text style={styles.fadedText}>No appointments today</Text>}
            {todayAppointments.map(a => <Text key={a.id}>{formatTime(a.start_time)} - {formatTime(a.end_time)}</Text>)}
          </View>
          <View>
          <Text style={styles.title}>Upcoming</Text>
          {upcomingAppointments.length === 0
          ? <Text style={styles.fadedText}>No upcoming appointments</Text>
          :  (
            <View gap={5}>
            <Text style={styles.fadedText}>{formatDate(upcomingAppointments[0].start_time)}</Text>
              {upcomingAppointments
                .filter(a => isSameDay(a.start_time, upcomingAppointments[0].start_time))
                .map(a => {
                  const summary = summaries.get(a.id);
                  return (
                    <XStack key={a.id} gap={5} flexWrap='wrap'>
                      <Text>{summary?.service_option}: </Text>
                      <Text >{formatTime(a.start_time)} - {formatTime(a.end_time)}</Text>
                    </XStack>
                  )
                })}
            </View>
          )}

          </View>
        </View>
      </BusinessWrapper>
    </Pressable>
  )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: theme.background.val
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: 'bold',
    color: theme.color.val,
    opacity: 0.8,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  fadedText: {
    color: theme.color.val,
    opacity: 0.5,
  }
})