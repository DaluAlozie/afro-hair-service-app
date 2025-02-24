import React from 'react';
import { Text, useTheme, View, XStack, YStack } from 'tamagui';
import { formatDate } from '../availability/utils';
import { StyleSheet } from 'react-native';

interface BookingDetailsProps {
  startTime: Date | undefined;
  endTime: Date | undefined;
  duration: number | undefined;
  totalPrice: number | undefined;
}

export const formatTime = (time: Date | undefined) => {
  if (!time) return 'N/A';
  return time
  ? `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
  : 'N/A';
};

export const BookingDetails: React.FC<BookingDetailsProps> = ({
  startTime,
  endTime,
}) => {
  const theme = useTheme();
  return (
    <YStack gap="$3">
      <Text fontSize={25} fontWeight="bold">
        {formatDate(startTime)}
      </Text>
      <XStack alignItems='center' gap="$3">
        <Text style={styles.value}>{formatTime(startTime)}</Text>
        <View width={15} height={2} opacity={0.8} alignSelf='center' backgroundColor={theme.color.val}/>
        <Text style={styles.value}>{formatTime(endTime)}</Text>
      </XStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    opacity: 0.7,
  },
  value: {
    fontSize: 25,
  },
});