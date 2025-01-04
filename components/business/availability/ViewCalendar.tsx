import React from 'react';
import { View, useTheme } from 'tamagui';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { getDate } from './Calendar';


type CalendarProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabledDates: Date[] | ((date: Date) => boolean);
}

export default function ViewCalendar({
  date,
  setDate,
  disabledDates,
}: CalendarProps) {

  const theme = useTheme();
  const styles = makeStyles(theme);
  const { width } = useWindowDimensions();

  return (
    <View style={styles.calendar}>
      <DateTimePicker
        mode="range"
        startDate={date}
        endDate={date}
        disabledDates={(date) => {
          const d = getDate(date);
          return (
            d! < new Date() ||
            (
              Array.isArray(disabledDates) &&
              disabledDates.some((disabledDate) => d!.getTime() === disabledDate.getTime())
            ) ||
            (
              typeof disabledDates === 'function' && disabledDates(d!)
            )
          );
        }}
        onChange={({ startDate: newDate }: { startDate: DateType, endDate: DateType}) => {
          const d = getDate(newDate);
          if (!d) {
            setDate(undefined)
          }
          else if (!date) {
            setDate(d);
          }
          else if (d.getTime() !== date.getTime()) {
            setDate(d);
          }
          else if (d.getTime() === date.getTime()) {
            setDate(undefined);
          }
        }}
        calendarTextStyle	={{ color: theme.color.val }}
        headerTextStyle={{ color: theme.color.val }}
        selectedRangeBackgroundColor={theme.calendarSelectedRange.val}
        headerButtonColor={theme.color.val}
        weekDaysTextStyle={{ color: theme.color.val }}
        monthContainerStyle={{ backgroundColor: theme.section.val }}
        yearContainerStyle={{ backgroundColor: theme.section.val }}
        selectedItemColor={theme.calendarSelected.val}
        selectedTextStyle={{ color: theme.color.val }}
        todayContainerStyle={{ backgroundColor: "none", borderWidth: 0 }}
        todayTextStyle={{ color: theme.color.val, fontWeight: 900 }}
        dayContainerStyle={{
          borderWidth: 0,
          borderRadius: 200,
          minHeight: 40,
          width: width > 600 ? 60 : 40,
          padding: 0,
          backgroundColor: theme.gray3.val,
        }}
        />
    </View>
  );
}

const makeStyles = (theme: UseThemeResult) =>
  StyleSheet.create({
    container: {
      width: '90%',
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
