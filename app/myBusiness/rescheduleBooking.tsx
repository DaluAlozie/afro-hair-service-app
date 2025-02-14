import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View, useTheme } from 'tamagui';
import { RefreshControl, StyleSheet, Text } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import ViewCalendar from '@/components/business/availability/ViewCalendar';
import { formatDate } from '@/components/business/availability/utils';
import { InputError, Picker } from '@/components/utils/form/inputs';
import { Controller, useForm } from 'react-hook-form';
import SubmitButton from '@/components/utils/form/SubmitButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PageSpinner from '@/components/utils/loading/PageSpinner';
import useAvailableTimeSlots from '@/hooks/business/useAvailableTimeSlots';
import { getDate } from '@/components/business/availability/Calendar';
import useToast from '@/hooks/useToast';
import usePushNotifications from '@/hooks/notifications/usePushNotifications';
import { useBusinessStore } from '@/utils/stores/businessStore';

const schema = yup.object().shape({
    date: yup.date().required("Please select a date"),
    time: yup.number().required("Please select a time")
});


// Main component for selecting a time slot
export default function rescheduleBooking() {
    const{
        appointmentId: appointmentIdParam,
        businessId: businessIdParam,
        startTime: startTimeParam,
        endTime: endTimeParam,
        customerId: customerIdParam
    } = useLocalSearchParams();

    const appointmentId = parseInt(typeof appointmentIdParam === 'string' ? appointmentIdParam : '');
    const businessId = parseInt(typeof businessIdParam === 'string' ? businessIdParam : '');
    const startTime = new Date(typeof startTimeParam === 'string' ? startTimeParam : '');
    const endTime = new Date(typeof endTimeParam === 'string' ? endTimeParam : '');
    const customerId = typeof customerIdParam === 'string' ? customerIdParam : '';

    // Gets the duration of the appointment in minutes
    const duration = (endTime.getTime() - startTime.getTime()) / 60000;

    const theme = useTheme();
    const styles = makeStyles(theme);
    const router = useRouter();
    const { showToast } = useToast();

    // Initialize form control using react-hook-form
    const { control, handleSubmit, formState: { errors, isSubmitting }, watch, reset, setValue} = useForm({
        resolver: yupResolver(schema),
    });

    const date = watch("date")
    const time = watch("time")

    const rescheduleAppointment = useBusinessStore(state => state.rescheduleAppointment);
    const { sendPushNotification } = usePushNotifications();

    // Fetch available slots data for the business
    const {
        availableSlots,
        availability,
        refetchAvailableSlots,
        isRefetchingAvailableSlots,
    } = useAvailableTimeSlots(businessId, duration, date);

    const timePickerItems = useMemo(() =>
        availableSlots.map((slot) => ({
        label: `${slot.getHours()}:${slot.getMinutes() < 10 ? '0' : ''}${slot.getMinutes()}`,
        value: slot.getTime(),
        }))
    ,[availableSlots]);

    const sendNotification = useCallback(() => {
        // if the appointment is rescheduled by the owner, send a notification to the customer
        sendPushNotification(
            "Appointment Rescheduled",
            "Your appointment has been rescheduled",
            {
                url: `/(tabs)?appointmentId=${appointmentId}`,
                type: "appointmentRescheduled"
            },
            customerId
        )
    }, [customerId, sendPushNotification, appointmentId])

    const onSubmit = useCallback(async (data: { date: Date, time: number }) => {
        const startTime = new Date(data.time);
        const endTime = new Date(startTime.getTime() + (duration ?? 0) * 60000); // Increment by 15 minutes
        const { error } = await rescheduleAppointment(appointmentId, startTime, endTime);
        if (error) {
            console.log(error);
            showToast("Something went wrong", "Failed to reschedule appointment", "error");
            return;
        }
        sendNotification();
        showToast("Appointment rescheduled", "The appointment has been moved successfully", "success");
        refetchAvailableSlots();
        reset();
        router.back();
    }, [rescheduleAppointment, appointmentId, duration, showToast, sendNotification, refetchAvailableSlots, reset, router]);

    useEffect(() => {
        setValue("time", timePickerItems[0]?.value)
    }, [timePickerItems])
    return (
        <View height="100%" width="100%" backgroundColor={theme.background.val}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetchingAvailableSlots}
                        onRefresh={refetchAvailableSlots}
                        tintColor={theme.color.val}
                        titleColor={theme.color.val}
                    >
                        <PageSpinner/>
                    </RefreshControl>
                }>
                {/* Calendar component for selecting a date */}
                <Controller
                control={control}
                render={({ field: { onChange } }) => (
                    <View>
                    {/* Header section displaying the selected date or a prompt to select a date */}
                    <View height={80} justifyContent="center" marginTop={1} marginBottom={20}>
                        {date ? (
                        <Text style={styles.heading}>{formatDate(date)}</Text>
                        ) : (
                        <Text style={{ fontSize: 25, fontWeight: 700, color: theme.color.val, textAlign: 'center' }}>
                            Select a Date
                        </Text>
                        )}
                    </View>
                    <ViewCalendar
                        date={date}
                        setDate={onChange}
                        disabledDates={(date: Date) =>
                        !availability.some(
                            (timeSlot) => getDate(timeSlot.from)?.getTime() === date.getTime()
                        )
                        }
                    />
                    {errors.date && <InputError>{errors.date.message}</InputError>}
                    </View>
                )}
                name={"date"}
                />
                {/* Picker component for selecting a time slot */}
                <View>
                <Picker
                    control={control}
                    placeholder='Select a Time'
                    name="time"
                    label="Time"
                    disabled={!date}
                    defaultValue={timePickerItems[0]?.value}
                    noItemsMessage="No available time slots"
                    items={timePickerItems}
                />
                {errors.time && <InputError>{errors.time.message}</InputError>}
                </View>
                <View>
                <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting} disabled={!date || !time}>
                    Reschedule Appointment
                </SubmitButton>
                </View>
                <View height={200}/>
            </ScrollView>
        </View>
    );
}

// Function to generate styles using the theme
const makeStyles = (theme: UseThemeResult) =>
    StyleSheet.create({
        container: {
        width: '100%',
        backgroundColor: theme.background.val,
        paddingHorizontal: 20,
        height: '100%',
        alignSelf: 'center',
        },
        heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: theme.color.val,
        textAlign: 'center',
        },
        calendar: {
        width: '100%',
        borderRadius: 10,
        alignSelf: 'center',
    },
});