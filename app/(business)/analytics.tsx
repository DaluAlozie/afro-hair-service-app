import React, { useMemo, useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { ScrollView, useTheme, View, XStack } from 'tamagui';
import { UseThemeResult } from '@tamagui/web';
import AreaChart, { Filter } from '@/components/business/analytics/AreaChart';
import BusinessWrapper from '@/components/business/BusinessWrapper';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { filterAppointments, formatMoney, generateFakeData, getChangePercentage, Month } from '@/components/business/analytics/utils';
import { Select } from '@/components/utils/inputs/Selector';
import { Appointment } from '@/components/business/types';
import { useAppointmentSummaries } from '@/hooks/business/useAppointmentSummaries';
import { hasPast } from '@/components/home/utils';

export default function Analytics() {
  const theme = useTheme();
  const loadingAppointments = useBusinessStore((state) => state.loadingAppointments);
  const loadingServices = useBusinessStore((state) => state.loadingServices);
  const appointmentMap = useBusinessStore((state) => state.appointments);
  // Convert Map to array once.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const appointments = useMemo(() => Array.from(appointmentMap.values()).filter(a => !a.cancelled && hasPast(a.start_time)), [appointmentMap]);
  const appointmentIds = useMemo(() => appointments.map(a => a.id), [appointments]);
  const services = useBusinessStore((state) => state.services);
  const serviceList = useMemo(() => Array.from(services.values()), [services]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { appointments: summaries } = useAppointmentSummaries(appointmentIds);

  // Generate fake data based on the service list.
  const [fakeAppointments, fakeSummaries] = useMemo(
    () => generateFakeData(serviceList),
    [serviceList]
  );

  const [filter, setFilters] = useState<Filter>({
    year: new Date().getFullYear(),
    month: "all",
    range: undefined,
    service: "all",
    style: "all",
  });

  // Use fake data for filtering.
  const filteredAppointments = useMemo(
    () => filterAppointments(fakeAppointments, fakeSummaries, filter),
    [fakeAppointments, fakeSummaries, filter]
  );

  return (
    <BusinessWrapper loading={loadingAppointments || loadingServices}>
      <ScrollView
        minHeight="100%"
        width="100%"
        backgroundColor={theme.background.val}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ gap: 10 }}
      >

          <RevenueHeader
            unfilteredAppointments={fakeAppointments}
            appointments={filteredAppointments}
            filter={filter}
          />
          <TimeFilterHeader
            appointments={fakeAppointments}
            filter={filter}
            setFilters={setFilters}
          />
        <AreaGraph appointments={filteredAppointments} filter={filter} />
        <ServiceFiltersHeader filter={filter} setFilters={setFilters} />
      </ScrollView>
    </BusinessWrapper>
  );
}

type AreaGraphProps = {
  appointments: Appointment[];
  filter: Filter;
};

const AreaGraph = ({ appointments, filter }: AreaGraphProps) => {
  // Aggregate revenue by date (YYYY-MM-DD)
  const chartData = useMemo(() => {
    return appointments.reduce((acc: Record<string, number>, appointment) => {
      const dateKey = appointment.start_time.toISOString().split("T")[0];
      acc[dateKey] = (acc[dateKey] || 0) + appointment.total_price;
      return acc;
    }, {});
  }, [appointments]);

  return (
    <View
      height="auto"
      width="100%"
      justifyContent="flex-start"
      alignItems="center"
      gap="$5"
    >
      <AreaChart data={chartData} filter={filter} />
    </View>
  );
};

type TimeFilterHeaderProps = {
  appointments: Appointment[];
  filter: Filter;
  setFilters: (filter: Filter) => void;
};

const TimeFilterHeader = ({ appointments, filter, setFilters }: TimeFilterHeaderProps) => {
  // Extract unique years from appointments.
  const yearOptions = useMemo(() => {
    const years = Array.from(new Set(appointments.map((a) => a.start_time.getFullYear())));
    return years
      .map((year) => ({ label: year.toString(), value: year.toString() }))
      .sort((a, b) => parseInt(b.value) - parseInt(a.value));
  }, [appointments]);

  return (
    <View
      flexDirection="row"
      marginBottom={20}
      width="100%"
      height={50}
      justifyContent="space-between"
      $sm={{ flexDirection: "column", height: 110, gap: 20 }}
      backgroundColor={"$background"}
      paddingHorizontal={20}
    >
      <XStack justifyContent="flex-start" gap="$4" height={50}>
        <Select
          label="Year"
          items={yearOptions}
          val={filter.year}
          setVal={(year: string) =>
            setFilters({ ...filter, year: parseInt(year), range: undefined })
          }
          width={100}
          height={60}
        />
        <Select
          label="Month"
          disabled={!filter.year}
          items={[
            { label: "All", value: "all" },
            { label: "January", value: "jan" },
            { label: "February", value: "feb" },
            { label: "March", value: "mar" },
            { label: "April", value: "apr" },
            { label: "May", value: "may" },
            { label: "June", value: "jun" },
            { label: "July", value: "jul" },
            { label: "August", value: "aug" },
            { label: "September", value: "sep" },
            { label: "October", value: "oct" },
            { label: "November", value: "nov" },
            { label: "December", value: "dec" },
          ]}
          val={filter.month}
          setVal={(month: Month | "all") =>
            setFilters({ ...filter, month, range: undefined })
          }
          width={140}
          height={60}
        />
      </XStack>
      <XStack height={50} gap="$4" justifyContent="flex-start">
        <Select
          label="Range"
          items={[
            { label: "Past 30 days", value: "1" },
            { label: "Past 3 months", value: "3" },
            { label: "Past 6 months", value: "6" },
            { label: "Past 12 months", value: "12" },
            { label: "All time", value: "all" },
          ]}
          val={filter.range}
          setVal={(range) =>
            setFilters({
              ...filter,
              year: undefined,
              month: undefined,
              range: range === "all" ? "all" : parseInt(range) as 1 | 3 | 6 | 12,
            })
          }
          width={175}
          height={60}
        />
      </XStack>
    </View>
  );
};

type ServiceFiltersProps = {
  filter: Filter;
  setFilters: (filter: Filter) => void;
};

const ServiceFiltersHeader = ({ filter, setFilters }: ServiceFiltersProps) => {
  const services = useBusinessStore((state) => state.services);
  const serviceList = useMemo(() => Array.from(services.values()), [services]);
  const serviceItems = useMemo(() => {
    const items = serviceList.map((s) => ({ label: s.name, value: s.name }));
    items.unshift({ label: "All", value: "all" });
    return items;
  }, [serviceList]);
  const selectedService = useMemo(
    () => serviceList.find((s) => s.name === filter.service),
    [serviceList, filter.service]
  );
  const styles = selectedService?.styles;
  const styleItems = useMemo(() => {
    const items = Array.from(styles?.values() || []).map((option) => ({
      label: option.name,
      value: option.name,
    }));
    items.unshift({ label: "All", value: "all" });
    return items;
  }, [styles]);

  return (
    <View
      flexDirection="row"
      marginVertical={20}
      paddingHorizontal={20}
      width="100%"
      height={50}
      justifyContent="space-between"
      $sm={{ flexDirection: "column", height: 110 }}
    >
      <XStack justifyContent="flex-start" gap="$4" height={50}>
        <Select
          label="Service"
          items={serviceItems}
          val={filter.service}
          setVal={(service: string) =>
            setFilters({ ...filter, service, style: undefined })
          }
          width={140}
          height={60}
        />
        <Select
          disabled={filter.service === "all"}
          label="Style"
          items={styleItems}
          val={filter.style}
          setVal={(option: string) => setFilters({ ...filter, style: option })}
          width={150}
          height={60}
        />
      </XStack>
    </View>
  );
};

type RevenueProps = {
  appointments: Appointment[];
  unfilteredAppointments: Appointment[];
  filter: Filter;
  titleFontSize?: number;
};

const RevenueHeader = (props: RevenueProps) => {

  return (
    <View
      width="100%"
      height={70}
      justifyContent="center"
      paddingLeft={10}
      backgroundColor={"$background"}
      marginVertical={20}
      paddingHorizontal={20}>
        <Revenue {...props} />
    </View>
  );
};

export const Revenue = ({ appointments, unfilteredAppointments, filter, titleFontSize }: RevenueProps) => {
  // Sum revenue from filtered appointments.
  const revenue = useMemo(
    () =>
      appointments.reduce((acc, a) => acc + a.total_price, 0),
    [appointments]
  );
  // Calculate change percentage relative to unfiltered data.
  const [revenueChange, context] = useMemo(
    () => getChangePercentage(unfilteredAppointments, filter, revenue),
    [unfilteredAppointments, filter, revenue]
  );
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View>
      <Text style={[styles.fadedText, { fontSize: titleFontSize! ?? styles.fadedText.fontSize! }]}>Revenue</Text>
      <Text style={styles.revenue}>£{formatMoney(revenue)}</Text>
      <XStack gap="$2" alignItems="center">
        <View>
          {revenueChange !== null && revenueChange > 0 && (
            <Text style={styles.positive}>+{revenueChange.toFixed(2)}%</Text>
          )}
          {revenueChange !== null && revenueChange < 0 && (
            <Text style={styles.negative}>{revenueChange.toFixed(2)}%</Text>
          )}
        </View>
        <Text style={[styles.fadedText, { fontSize: 10 }]}>{context}</Text>
      </XStack>
    </View>
  );
};


const makeStyles = (theme: UseThemeResult) =>
  StyleSheet.create({
    fadedText: {
      fontSize: 12,
      color: theme.color.val,
      fontWeight: '300',
      opacity: 0.5,
    },
    revenue: {
      fontSize: 30,
      color: theme.color.val,
      fontWeight: "700",
      fontFamily: Platform.OS === 'ios' ? "SF Pro" : "Roboto",
    },
    positive: {
      fontSize: 14,
      color: theme.green10.val,
      fontWeight: '300',
    },
    negative: {
      fontSize: 14,
      color: theme.red11Dark.val,
      fontWeight: '300',
    },
  });
