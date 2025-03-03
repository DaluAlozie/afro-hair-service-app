import { useMemo } from 'react';
import { getDate } from '@/components/business/availability/Calendar';
import useAppointmentTimeSlots from '@/hooks/business/useAppointmentTimeSlots';
import useAvailability from './useAvailability';


// Main component for selecting a time slot
export default function useAvailableTimeSlots(businessId: number | undefined, duration: number | undefined, date: Date) {

    // Fetch availability data for the business
    const {
        availability,
        refetchAvailability,
        isRefetchingAvailability,
        } = useAvailability(businessId);

    // Calculate available time slots based on the selected date and availability
    const timeSlots = useMemo(() => {
        const slots = [] as Date[];
        // Find the availability slot that matches the selected date
        const selectedDate = availability.find(
            (slot) => getDate(slot.from)?.getTime() === getDate(date)?.getTime()
        );
        // If no matching date is found, return empty slots
        if (selectedDate === undefined) return slots;
        // Calculate the start and end times for the slots
        const from = new Date(selectedDate.from);
        const temp = new Date(selectedDate.to);
        const to = new Date(temp.getTime() - (duration ?? 0) * 60000); // Adjust end time by subtracting duration
        // If start or end time is invalid, return empty slots
        if (from === undefined || to === undefined) return slots;
        // Generate time slots in 5-minute intervals
        let currentTime = new Date(from);
        while (currentTime.getTime() <= to.getTime()) {
            slots.push(new Date(currentTime));
            currentTime = new Date(currentTime.getTime() + 5 * 60000); // Increment by 15 minutes
        }
        return slots;
    }, [date, availability]);

    // Fetch appointment time slots for the business
    const {
        appointmentSlots,
        refetchAppointmentSlots,
        isRefetchingAppointmentSlots
    } = useAppointmentTimeSlots(businessId);

    // Filter out unavailable slots based on existing appointments
    const availableSlots = useMemo(
        () =>
        timeSlots.filter(
            (slot) =>
            !appointmentSlots.some(({ start_time, end_time }) => {
                const slotEnd = new Date(slot.getTime() + (duration ?? 0) * 60000);
                const appointmentStart = new Date(start_time);
                const appointmentEnd = new Date(end_time);
                return appointmentStart.getTime() < slotEnd.getTime() && appointmentEnd.getTime() > slot.getTime();
            })
        ),
        [date, appointmentSlots]
    );

    return {
        availableSlots,
        availability,
        appointmentSlots,
        isRefetchingAppointmentSlots,
        isRefetchingAvailability,
        isRefetchingAvailableSlots: isRefetchingAppointmentSlots || isRefetchingAvailability,
        refetchAvailableSlots: async () => {
            await refetchAppointmentSlots();
            await refetchAvailability();
        },
        refetchAppointmentSlots,
        refetchAvailability
    };
}

