import React, { useCallback } from 'react';
import { View, useTheme } from 'tamagui';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';

export const getDate = (date: DateType): Date|undefined => {
  if (!date || typeof date === "number") {
    return undefined;
  }
  if (typeof date === 'string') {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (date instanceof Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(date.year(), date.month(), date.date());
}

const getRange = (startDate: Date, endDate: Date) => {
  const range: Date[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    range.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return range;
}

type CalendarProps = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  disabledDates: Date[] | ((date: Date) => boolean);
}

export default function Calendar({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  disabledDates,
}: CalendarProps) {

  const theme = useTheme();
  const styles = makeStyles(theme);
  const { width } = useWindowDimensions();

  const isRangeInvalid = useCallback((
    startDate: Date,
    endDate: Date,
  ): boolean => {
    // Normalise a date by resetting its time components to midnight
    const normaliseDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Normalise the start and end dates
    const normalisedStart = normaliseDate(startDate);
    const normalisedEnd = normaliseDate(endDate);
    if (typeof disabledDates === 'function') {
      const range = getRange(normalisedStart, normalisedEnd);
      return range.some(date => disabledDates(date));
    }

    // Check if any normalised disabled date falls within the range
    return disabledDates.some(date => {
      const normalisedDisabledDate = normaliseDate(date);
      return normalisedDisabledDate >= normalisedStart && normalisedDisabledDate <= normalisedEnd;
    });
  }, [startDate, endDate, disabledDates]);

  return (
    <View style={styles.calendar}>
      <DateTimePicker
        mode="range"
        startDate={startDate}
        endDate={endDate}
        disabledDates={(date) => {
          const d = getDate(date);
          return d! < new Date() || isRangeInvalid(d!, d!);
        }}
        onChange={({ startDate: sDate, endDate: eDate }: { startDate: DateType, endDate: DateType}) => {
          const newStart = getDate(sDate);
          const newEnd = getDate(eDate);
          if (!startDate) {
            setStartDate(newStart);
            setEndDate(undefined);
          }
          else if (newStart && newEnd && newStart.getTime() == newEnd.getTime()) {
            setStartDate(undefined);
            setEndDate(undefined);
          }
          else if (newStart && newStart < startDate) {
            setStartDate(newStart);
            setEndDate(undefined);
          }
          else if (newEnd && newEnd > startDate) {
            if (isRangeInvalid(startDate, newEnd)) {
              setStartDate(newEnd);
              setEndDate(undefined);
              return;
            }
            setEndDate(newEnd);
          }
          else if (newEnd && newEnd <= startDate) {
            setStartDate(newEnd);
            setEndDate(undefined);
          }
          else if (
            startDate &&
            newStart &&
            newEnd &&
            endDate &&
            startDate.getTime() == newStart.getTime() &&
            endDate.getTime() == newEnd.getTime()) {
            setStartDate(undefined);
            setEndDate(undefined);
          }
          if (startDate && endDate) {
            const date = newStart;

            if (date && endDate &&  date.getTime() == endDate.getTime()) {
              setEndDate(undefined);
            }
            else if (date && date > startDate) {
              if (isRangeInvalid(startDate, date)) {
                setStartDate(date);
                setEndDate(undefined);
                return;
              }
              setEndDate(date);
            }
            else if (date && date <= startDate) {
              setStartDate(date);
              setEndDate(undefined);
            }
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
