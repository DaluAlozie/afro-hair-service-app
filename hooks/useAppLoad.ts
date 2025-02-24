import { useEffect } from "react";
import usePushNotifications from '@/hooks/notifications/usePushNotifications';
import { useBusinessStore } from "@/utils/stores/businessStore";
import { useAuthStore } from "@/utils/stores/authStore";
import { useCustomerStore } from "@/utils/stores/customerStore";

export default function useAppLoad() {

    const loadBusinessData = useBusinessStore((state) => state.load);
    const loadCustomerData = useCustomerStore((state) => state.load);
    const { registerForPushNotifications } = usePushNotifications();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

    useEffect(() => {
        if (isLoggedIn) {
            (async () => {
                loadBusinessData();
                loadCustomerData();
                registerForPushNotifications();
            })();
        }
    }, [isLoggedIn]);
}
