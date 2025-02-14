import Pressable from '@/components/utils/Pressable'
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react'
import { View, Text, XStack, useTheme } from 'tamagui'
import confirm from '@/components/utils/Alerts/Confirm';
import usePushNotifications from '@/hooks/notifications/usePushNotifications';
import useToast from '@/hooks/useToast';
import { useCustomerStore } from '@/utils/stores/customerStore';

type CancelButtonProps = {
    appointmentId: number | undefined,
    ownerId: string | undefined,
    date: Date | undefined,
}
export default function CustomerCancelButton({ appointmentId, ownerId, date }: CancelButtonProps) {
    const theme = useTheme();
    const cancelAppointment = useCustomerStore((state) => state.cancelAppointment);
    const { showToast } = useToast();

    const { sendPushNotification } = usePushNotifications();
    const onPress = useCallback(() => {
        if (!appointmentId || !ownerId) return
        confirm(async () => {
            const { error } = await cancelAppointment(appointmentId)
            if (error) {
                console.log(error)
                showToast("Failed to cancel appointment", "", "error")
                return
            }
            else {
                sendPushNotification(
                    "Appointment Cancelled",
                    "A booking has been cancelled",
                    {
                        url: `/(business)?appointmentId=${appointmentId}&date=${date}`,
                        type: "appointmentCancelled"
                    },
                    ownerId
                )
                showToast("Appointment cancelled", "Your booking has been cancelled", "success")
            }
        },
        "Cancel Appointment",
        "Are you sure you want to cancel your appointment ?",
        "Yes",
        "No",
        "destructive")
    }, [appointmentId, ownerId, cancelAppointment, sendPushNotification, showToast])
    return (
        <View height={20} opacity={0.5}>
            <Pressable onPress={onPress} activeOpacity={0.7}>
                <XStack gap={5} alignItems='center'>
                    <Text fontSize={14}>Cancel</Text>
                    <MaterialIcons name="cancel" size={16} color={theme.color.val}/>
                </XStack>
            </Pressable>
        </View>
    )

}
