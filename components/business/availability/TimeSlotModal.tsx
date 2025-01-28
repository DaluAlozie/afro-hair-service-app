import { Modal } from '@/components/utils/ui/Modal'
import { useBusinessStore } from '@/utils/stores/businessStore';
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, XStack, YStack, Form, useTheme } from 'tamagui';
import timeSchema from './timeSchema';
import { TimePicker, InputError } from '@/components/utils/form/inputs';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import SubmitButton from '@/components/utils/form/SubmitButton';
import Feather from '@expo/vector-icons/Feather';
import Pressable from '@/components/utils/Pressable';
import confirm from '@/components/utils/Alerts/Confirm';
import notify from '@/components/utils/Alerts/Notify';

export default function TimeSlotModal({ id, open, setOpen }: { id: number, open: boolean, setOpen: (value: boolean) => void }) {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(timeSchema),
    });
    const availability = useBusinessStore((state) => state.availability);
    const editAvailability = useBusinessStore((state) => state.editAvailability);
    const removeAvailability = useBusinessStore((state) => state.removeAvailability);
    const timeSlot = availability.get(id);
    const [isEditing, setIsEditing] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (!timeSlot) {
            setOpen(false);
        }
    }, [timeSlot])

    const onSubmit = useCallback(async (data: { start: string; end: string }) => {
        if (!timeSlot || !isEditing) return;
        const { start, end } = data;
        const currentDate = new Date(timeSlot.from);
        const startTime = new Date(start);
        const endTime = new Date(end);
        const from = new Date(timeSlot.from);
        from.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0); // Set time to start's time
        const to = new Date(currentDate);
        to.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0); // Set time to end's time
        editAvailability(id, { from, to });
        setIsEditing(false);
        notify("Time slot Changed", "Note that existing will not be affected by this change");
    }, [id, timeSlot, isEditing]);

    const deleteTimeSlot = useCallback(async () => {
        await confirm(async () => {
            const { error } = await removeAvailability([id]);
            if (error) console.log(error);
            else {
                setOpen(false);
                setIsEditing(false);
            }
        },
        "Delete Time Slot",
        "Are you sure you want to delete this time slot ?", "Delete", "Cancel", "destructive");
    }, [id]);



    const title = timeSlot ? new Date(timeSlot.from).toLocaleDateString(
        'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    ): "";
    return (
        <Modal open={open} setOpen={(value: boolean) => {
            if (!value) {
                setIsEditing(false);
            }
            setOpen(value);
        }}>
            <Form alignItems="center" height={300} width={"100%"} backgroundColor={theme.background.val}>
                <YStack
                    alignItems="stretch"
                    justifyContent="flex-start"
                    minWidth="60%"
                    width="100%"
                    height="100%"
                    gap="$5"
                    padding="$7"
                    paddingVertical="$6"
                    $gtSm={{
                    paddingVertical: '$4',
                    width: 400,
                    }}
                >
                    <View width="100%" alignItems="center">
                        {timeSlot && (<Text fontWeight={"bold"}>{title}</Text>)}
                    </View>
                    <XStack justifyContent='space-between'>
                        <YStack flex={1}alignItems='flex-start'>
                            <TimePicker control={control} name="start" label="Start Time" defaultValue={timeSlot?.from} disabled={!isEditing} />
                            {errors.start && <InputError>{errors.start.message?.toString()}</InputError>}
                        </YStack>
                        <View width={20} height={1} alignSelf='center' marginTop={40} backgroundColor={theme.color.val}></View>
                        <YStack flex={1} alignItems='flex-end'>
                            <TimePicker control={control} name="end" label="End Time" defaultValue={timeSlot?.to} disabled={!isEditing} />
                            {errors.end && <InputError>{errors.end.message?.toString()}</InputError>}
                        </YStack>
                        <View position='absolute' right={0} top={-20} zIndex={100} display={isEditing ? 'none' : 'flex'}>
                            <Pressable
                                onPress={() => setIsEditing(true)} activeOpacity={0.7} scale={0.99}>
                                <Feather name="edit-3" size={20} color={theme.color.val}/>
                            </Pressable>
                        </View>
                    </XStack>
                    <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting} disabled={!isEditing}>
                        Save
                    </SubmitButton>
                    <View height={30}>
                        <Pressable
                            onPress={deleteTimeSlot} activeOpacity={0.7} scale={0.99}>
                            <Text color={theme.danger.val}>Delete Time slot</Text>
                        </Pressable>
                    </View>
                </YStack>
            </Form>
        </Modal>
    )
}
