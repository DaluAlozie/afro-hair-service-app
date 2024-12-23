import { useAuthStore } from '@/utils/stores/authStore';
import { Stack } from 'expo-router';
import React from 'react';
import { useTheme } from 'tamagui';

export default function AppStack() {
    const theme=useTheme()
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    return (
        <Stack initialRouteName="index" screenOptions={{
            headerStyle: {
            backgroundColor: theme.background.val,
            },
            headerTintColor: theme.colors?.val,
            headerTitleStyle: {
            fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
            headerShadowVisible: false,
        }}>
            {/* Landing Page */}
            <Stack.Screen name="index" options={{ title:  isLoggedIn ? 'Home': 'Login'}} />

            {/* Unprotected Routes */}
            <Stack.Screen name="signUp" options={{ title: 'Sign up', }}/>
            <Stack.Screen name="verifyEmail" options={{ title: 'Verify Email' }}/>
            <Stack.Screen name="forgotPassword" options={{ title: 'Forgot Password' }}/>
            <Stack.Screen name="passwordRecovery" options={{ title: 'Password Recovery' }}/>

            {/* Protected Routes */}
            <Stack.Screen name="home" options={{ title: 'Home', }} />
            <Stack.Screen name="resetPassword" options={{ title: 'Reset Password' }} />

            <Stack.Screen name="+not-found"/>
        </Stack>
    )
}

export const UnprotectedRoutes = [
  "/login",
  "/signUp",
  "/verifyEmail",
  "/forgotPassword",
  "/passwordRecovery",
  ""
]