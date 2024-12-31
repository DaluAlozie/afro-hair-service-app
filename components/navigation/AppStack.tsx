import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useTheme } from 'tamagui';
import { ThemedText } from '../utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Pressable from '../utils/Pressable';

export const animationDuration = 200;
export default function AppStack() {
    const theme = useTheme()
    const router = useRouter()
    return (
        <Stack initialRouteName="login" screenOptions={{
            headerStyle: {
            backgroundColor: theme.background.val,
            },
            headerTintColor: theme.colors?.val,
            headerTitleStyle: {
            fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            animationDuration: animationDuration,
            headerLeft: () => ( router.canGoBack() ?
            <Pressable onPress={() => router.back()}>
                <MaterialIcons name="arrow-back-ios-new" size={24} color={theme.color.val} />
            </Pressable>
             : <ThemedText></ThemedText>)
        }}>
            {/* Unprotected Routes */}
            <Stack.Screen name="login" options={{ title: 'Login' }}
            />
            <Stack.Screen name="signUp" options={{ title: 'Sign up', }}/>
            <Stack.Screen name="verifyEmail" options={{ title: 'Verify Email' }}/>
            <Stack.Screen name="forgotPassword" options={{ title: 'Forgot Password' }}/>
            <Stack.Screen name="passwordRecovery" options={{ title: 'Password Recovery' }}/>

            {/* Protected Routes */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(business)" options={{
                title: 'Your Business',
                headerLeft: () => (
                    <Pressable onPress={() => router.dismissTo("/(tabs)")}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color={theme.color.val} />
                    </Pressable>
                )}}
            />
            <Stack.Screen name="resetPassword" options={{ title: 'Reset Password' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />

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