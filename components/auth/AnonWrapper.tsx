import { useAuthStore } from '@/utils/stores/authStore'
import React, { useEffect } from 'react'
import { useNavigationContainerRef, useRootNavigationState, useRouter } from 'expo-router';

export default function AnonWrapper({ children } : { children: React.ReactNode }) {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const router = useRouter();
    const navigationContainerRef = useNavigationContainerRef();
    const rootNavigationState = useRootNavigationState();

    useEffect(() => {
        if (!navigationContainerRef.isReady()) return;
        if (isLoggedIn) router.replace("/(tabs)");
    },[rootNavigationState?.key])
    return (
        <>
            { children }
        </>
    )
}
