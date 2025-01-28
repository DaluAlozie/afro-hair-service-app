import React, { useEffect, useState } from 'react';
import { View, useTheme } from 'tamagui';
import { StyleSheet } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import { useBusinessStore } from '@/utils/stores/businessStore';
import ViewCalendar from './ViewCalendar';
import { getDate } from './Calendar';
import TimeSlotModal from './TimeSlotModal';

export default function ViewAvailability() {

  const availability = useBusinessStore((state) => state.availability);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [date, setDate] = useState<Date|undefined>(undefined);
  const [timeSlotId, setTimeSlotId] = useState<number | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const timeSlot = Array.from(availability.values()).find((timeSlot) => {
      const d = getDate(timeSlot.from);
      if (!d) return false;
      if (!date) return false;
      return d.getTime() === date.getTime()
    });
    if (timeSlot) {
      setModalOpen(true);
      setTimeSlotId(timeSlot.id);
    }
  }, [date, availability]);
  const timeSlots = Array.from(availability.values()).map(({ from }) => {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  useEffect(() => {
    if (!modalOpen) {
      setDate(undefined);
    }
  }, [modalOpen]);

  return (
    <View style={styles.container}>
      <TimeSlotModal id={timeSlotId ?? -1} open={modalOpen && timeSlotId !== undefined} setOpen={setModalOpen}/>
      <ViewCalendar
        date={date}
        setDate={setDate}
        disabledDates={(date: Date) => !timeSlots.some((timeSlot) => getDate(timeSlot)?.getTime() === date.getTime())}
        />
    </View>
  );
}

const makeStyles = (theme: UseThemeResult) =>
  StyleSheet.create({
    container: {
      width: '100%',
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
