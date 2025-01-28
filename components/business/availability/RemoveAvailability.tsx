import React, { useCallback, useState } from 'react';
import { View, useTheme } from 'tamagui';
import { StyleSheet } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import { useForm } from 'react-hook-form';
import SubmitButton from '@/components/utils/form/SubmitButton';
import { useBusinessStore } from '@/utils/stores/businessStore';
import Calendar, { getDate } from './Calendar';


export default function RemoveAvailability() {

  const { handleSubmit, formState: { isSubmitting }} = useForm({
  });

  const availability = useBusinessStore((state) => state.availability);

  const removeAvailability = useBusinessStore((state) => state.removeAvailability);
  const timeSlots = Array.from(availability.values()).map(({ from }) => {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const theme = useTheme();
  const styles = makeStyles(theme);
  const [startDate, setStartDate] = useState<Date|undefined>(undefined);
  const [endDate,setEndDate] = useState<Date|undefined>(undefined);

  const onSubmit = useCallback(async () => {

    if (!startDate) return;;

    const timeSlotsIds: number[] = [];
    for (const timeSlot of availability.values()) {
      const { id, from } = timeSlot;
      const date = getDate(from);
      if (!date) continue;
      if (
        date.getTime() === startDate.getTime() ||
        (endDate && date.getTime() === endDate.getTime())) {
        timeSlotsIds.push(id);
      }
      else if (
        endDate &&
        date.getTime() >= startDate.getTime() &&
        date.getTime() <= endDate.getTime()) {
        timeSlotsIds.push(id);
      }
    }
    const { error } = await removeAvailability(timeSlotsIds);
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
        disabledDates={(date: Date) => !timeSlots.some((timeSlot) => getDate(timeSlot)?.getTime() === date.getTime())}
        />
      <View marginTop={30}>
        <SubmitButton
          onPress={handleSubmit(onSubmit)}
          disabled={startDate === undefined}
          isSubmitting={isSubmitting}>
            Remove Availability
        </SubmitButton>
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
