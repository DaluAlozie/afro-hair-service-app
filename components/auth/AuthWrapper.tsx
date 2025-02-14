import { useAuthStore } from '@/utils/stores/authStore'
import React, { useEffect } from 'react'
import { useNavigationContainerRef, useRootNavigationState, useRouter } from 'expo-router';
import { useTheme, View } from 'tamagui';

export default function AuthWrapper({ children } : { children: React.ReactNode }) {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const theme = useTheme();
    const router = useRouter();
    const navigationContainerRef = useNavigationContainerRef();
    const rootNavigationState = useRootNavigationState();
    useEffect(() => {
        if (!navigationContainerRef.isReady()) return;
        if (!isLoggedIn) router.replace("/login");
    },[rootNavigationState?.key])
    return (
        <View flex={1} backgroundColor={theme.background.val}>
            { children }
        </View>
    )
}
