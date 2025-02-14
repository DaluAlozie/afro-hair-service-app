import { useAuthStore } from '@/utils/stores/authStore';
import { useBookingStore } from '@/utils/stores/bookingStore';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { useCustomerStore } from '@/utils/stores/customerStore';
import usePushNotifications from './notifications/usePushNotifications';

export default function useResetStores() {
    const resetAuth = useAuthStore((state) => state.reset);
    const resetBusiness = useBusinessStore((state) => state.reset);
    const resetCustomer = useCustomerStore((state) => state.reset);
    const resetBooking = useBookingStore((state) => state.reset)
    const { removePushNotificationToken } = usePushNotifications()
    return async function reset() {
        resetAuth();
        resetBusiness();
        resetCustomer();
        resetBooking();
        await removePushNotificationToken();
    }
}
