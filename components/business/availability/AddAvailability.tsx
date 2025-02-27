import React, { useCallback, useMemo, useState } from 'react';
import { View, XStack, YStack, useTheme } from 'tamagui';
import { StyleSheet } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import { InputError, Switch, TimePicker } from '@/components/utils/form/inputs';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { timeSchema } from './utils';
import SubmitButton from '@/components/utils/form/SubmitButton';
import { useBusinessStore } from '@/utils/stores/businessStore';
import Calendar from './Calendar';

const schema = timeSchema;

export default function AddAvailability() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [startDate, setStartDate] = useState<Date|undefined>(undefined);
  const [endDate,setEndDate] = useState<Date|undefined>(undefined);

  const availability = useBusinessStore((state) => state.availability);
  const  nine = new Date();
  nine.setHours(9, 0, 0, 0);
  const fivePm = new Date();
  fivePm.setHours(17, 0, 0, 0);
  const { control, handleSubmit, formState: { errors, isSubmitting }} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      start: nine,
      end: fivePm,
    }
  });

  const yearFromNow = new Date();
  yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);

  const addAvailability = useBusinessStore((state) => state.addAvailability);
  const timeSlots = useMemo(() => Array.from(availability.values()).map(({ from }) => {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    return d;
  }), [availability]);

  const onSubmit = useCallback(async (data: { start: Date; end: Date; excludeWeekends: boolean; }) => {

    if (!startDate) return;
    const { start, end, excludeWeekends } = data;
    const startTime = new Date(start);
    const endTime = new Date(end);

    const timeSlots: { from: Date; to: Date }[] = [];

    // Loop from startDate to endDate (inclusive)
    const currentDate = new Date(startDate!);
    while (currentDate <= (endDate ?? startDate!)) {
      // Skip weekends if excludeWeekends is true
      if (excludeWeekends && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      const from = new Date(currentDate);
      from.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0); // Set time to start's time

      const to = new Date(currentDate);
      to.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0); // Set time to end's time

      timeSlots.push({ from, to });
      // Increment by one day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const { error } = await addAvailability(timeSlots);
    if (error) {
      console.error(error);
    }
    setEndDate(undefined);
    setStartDate(undefined);
  }, [startDate, endDate]);

  return (
    <View style={styles.container}>
      <Calendar
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        disabledDates={timeSlots}
        maxDate={yearFromNow}
        />

      <View width={"100%"} gap={15} justifyContent='space-between' height={"45%"}>
        <XStack justifyContent='space-between'>
          <YStack flex={1}alignItems='flex-start'>
            <TimePicker control={control} name="start" label="Start Time" disabled={startDate === undefined} />
            {errors.start && <InputError>{errors.start.message?.toString()}</InputError>}
          </YStack>
          <View opacity={startDate === undefined ? 0.3: 1} width={20} height={1} alignSelf='center' marginTop={40} backgroundColor={theme.color.val}></View>
          <YStack flex={1} alignItems='flex-end'>
            <TimePicker  control={control} name="end" label="End Time" disabled={startDate === undefined} />
            <View>
              {errors.end && <InputError>{errors.end.message?.toString()}</InputError>}
            </View>
          </YStack>
        </XStack>
        <YStack alignItems='flex-start' width={200}>
          <Switch
            label='Exclude Weekends'
            control={control}
            name='excludeWeekends'
            defaultValue={false}
            disabled={startDate === undefined}
          />
        </YStack>
        <View marginTop={30}>
          <SubmitButton
            onPress={handleSubmit(onSubmit)}
            disabled={startDate === undefined}
            isSubmitting={isSubmitting}>
              Add Availability
          </SubmitButton>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme: UseThemeResult) =>
  StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
      paddingTop: 20,
      gap: 20,
    },
    calendar: {
      width: '100%',
      borderRadius: 10,
      alignSelf: 'center',
      backgroundColor: theme.section.val,
      padding: 20,
    },
  });
