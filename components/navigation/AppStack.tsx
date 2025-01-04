import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useTheme } from 'tamagui';
import { ThemedText } from '../utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Pressable from '../utils/Pressable';
import { Platform } from 'react-native';

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
            <Stack.Screen name="business/createBusiness" options={{
                title: "Start your Business",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "fullScreenModal" : "modal",
                fullScreenGestureEnabled: true,
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
                }} />
            <Stack.Screen name="business/addService" options={{
                title: "Add Service",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "fullScreenModal" : "modal",
                fullScreenGestureEnabled: true,
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="business/locations" options={{
                title: "Locations",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "fullScreenModal" : "modal",
                fullScreenGestureEnabled: true,
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="business/addLocation" options={{
                title: "Add Location",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "fullScreenModal" : "modal",
                fullScreenGestureEnabled: true,
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="business/availability" options={{
                title: "Availability",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "fullScreenModal" : "modal",
                fullScreenGestureEnabled: true,
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="service/[serviceId]/index" options={{
                title: "Service",
            }} />
            <Stack.Screen name="service/[serviceId]/addServiceOption" options={{
                title: "Add Service Option",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "fullScreenModal" : "modal",
                fullScreenGestureEnabled: true,
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="service/[serviceId]/serviceOption/[serviceOptionId]/variants" options={{
                title: "Variants",
            }} />
            <Stack.Screen name="service/[serviceId]/serviceOption/[serviceOptionId]/addVariant" options={{
                title: "Add Variant",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "fullScreenModal": "modal",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
                }} />
            <Stack.Screen name="service/[serviceId]/serviceOption/[serviceOptionId]/addOns" options={{
                title: "Add Ons",
                }} />
            <Stack.Screen name="service/[serviceId]/serviceOption/[serviceOptionId]/addAddOn" options={{
                title: "Add Add On",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "fullScreenModal": "modal",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
                }} />

            <Stack.Screen name="resetPassword" options={{ title: 'Reset Password' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
            <Stack.Screen name="+not-found"/>
        </Stack>
    )
}

function HeaderLeftAlt() {
    const router = useRouter();
    const theme = useTheme();
    return (
        <Pressable onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={theme.color.val} />
        </Pressable>
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