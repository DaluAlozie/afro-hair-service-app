import Pressable from '@/components/utils/Pressable'
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react'
import { View, Text, XStack, useTheme } from 'tamagui'
import notify from '@/components/utils/Alerts/Notify';


type EditButtonProps = {
    appointmentId: number | undefined,
    businessId: number | undefined,
    startTime: Date
    endTime: Date
    ownerId: string | undefined
}
// function that checks if an appointment is at lease 3 days from today
function isAtLeastThreeDaysFromToday(date: Date) {
    const today = new Date();
    const threeDaysFromNow = new Date(today.setDate(today.getDate() + 3));
    return date.getTime() >= threeDaysFromNow.getTime();
}

export default function CustomerRescheduleButton({ appointmentId, startTime, endTime, ownerId, businessId }: EditButtonProps) {
    const router = useRouter();
    const theme = useTheme();
    const queryParams = [
        `appointmentId=${appointmentId}`,
        `startTime=${startTime.toISOString()}`,
        `endTime=${endTime.toISOString()}`,
        `ownerId=${ownerId}`,
        `businessId=${businessId}`
    ].join('&')

    const onPress = () => {
        if (isAtLeastThreeDaysFromToday(startTime)) {
            router.push(
                `/booking/rescheduleBooking?${queryParams}`
            )
        }
        else {
            notify("Cannot Reschedule Appointment", "You can only reschedule appointments that are at least 3 days away")
        }
    }

    return (
        <View height={20} opacity={0.5}>
            <Pressable activeOpacity={0.7} onPress={onPress}>
                <XStack gap={5} alignItems='center'>
                    <Text>Reschedule</Text>
                    <MaterialIcons name="schedule" size={16} color={theme.color.val}/>
                </XStack>
            </Pressable>
        </View>
    )
}
