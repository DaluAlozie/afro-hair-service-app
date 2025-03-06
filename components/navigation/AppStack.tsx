import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useTheme, View } from 'tamagui';
import { ThemedText } from '../utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Pressable from '../utils/Pressable';
import { Platform, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import emptyProfile from '@/assets/images/empty-profile.png';
import { useBusinessStore } from '@/utils/stores/businessStore';

export const animationDuration = 200;
export default function AppStack() {
    const theme = useTheme();
    const router = useRouter();
    const bg = theme.background.val

    return (
        <Stack initialRouteName="(tabs)" screenOptions={{
            headerStyle: {
            backgroundColor: bg,
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
            <Stack.Screen name="landing" options={{ title: 'Landing', headerShown: false }} />

            <Stack.Screen name="login" options={{ title: 'Login' }}/>
            <Stack.Screen name="signUp" options={{ title: 'Sign up', }}/>
            <Stack.Screen name="verifyEmail" options={{ title: 'Verify Email' }}/>
            <Stack.Screen name="forgotPassword" options={{ title: 'Forgot Password' }}/>
            <Stack.Screen name="passwordRecovery" options={{ title: 'Password Recovery' }}/>

            {/* Protected Routes */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="map" options={{ title: 'Map', headerShown: false }}/>
            <Stack.Screen name="searchFilters" options={{
                title: 'Search Filters',
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureEnabled:true,
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="search" options={{
                title: 'Search',
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="(business)" options={{
                title: 'Your Business',
                headerLeft: () => (
                    <Pressable onPress={() => router.dismissTo("/(tabs)")} style={[styles.headerLeft]}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color={theme.color.val} />
                    </Pressable>
                ),
                headerRight: BusinessHeaderRight
            }}
            />
            <Stack.Screen name="myBusiness/createBusiness" options={{
                title: "Start your Business",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
                }} />
            <Stack.Screen name="myBusiness/addService" options={{
                title: "Add Service",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="myBusiness/locations" options={{
                title: "Locations",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="myBusiness/addLocation" options={{
                title: "Add Location",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="myBusiness/rescheduleBooking" options={{
                title: "Reschedule Appointment",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="myBusiness/availability" options={{
                title: "Availability",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="myBusiness/tags" options={{
                title: "Business Tags",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="service/[serviceId]/index" options={{
                title: "Service",
            }} />
            <Stack.Screen name="service/[serviceId]/addStyle" options={{
                title: "Add Style",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card" : "modal",
                gestureDirection: "vertical",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
            }} />
            <Stack.Screen name="service/[serviceId]/style/[styleId]/variants" options={{
                title: "Variants",
            }} />
            <Stack.Screen name="service/[serviceId]/style/[styleId]/addVariant" options={{
                title: "Add Variant",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card": "modal",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
                }} />
            <Stack.Screen name="service/[serviceId]/style/[styleId]/addOns" options={{
                title: "Add Ons",
                }} />
            <Stack.Screen name="service/[serviceId]/style/[styleId]/addAddOn" options={{
                title: "Add Add On",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card": "modal",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
                }} />
            <Stack.Screen name="service/[serviceId]/style/[styleId]/customizableOptions" options={{
                title: "Customizations",
                }} />
            <Stack.Screen name="service/[serviceId]/style/[styleId]/addCustomizableOption" options={{
                title: "Add Customization",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card": "modal",
                animation:"slide_from_bottom",
                headerLeft: HeaderLeftAlt
                }} />
            <Stack.Screen name="business/[businessId]" options={{
                title: "Business"
            }} />
            <Stack.Screen name="booking/selectTime" options={{
                title: "Book an Appointment",
            }} />
            <Stack.Screen name="booking/selectLocation" options={{
                title: "Book an Appointment",
            }} />
            <Stack.Screen name="booking/confirmBooking" options={{
                title: "Book an Appointment",
            }} />
            <Stack.Screen name="booking/rescheduleBooking" options={{
                title: "Reschedule Appointment",
                presentation: (Platform.OS === "ios" && Platform.isPad)? "card": "modal",
                animation:"slide_from_bottom",
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
        <Pressable onPress={() => router.back()} style={styles.headerLeft}>
            <Ionicons name="close" size={24} color={theme.color.val} />
        </Pressable>
    )
}

function BusinessHeaderRight() {
    const theme = useTheme();
    const router = useRouter();
    const profilePicture = useBusinessStore(state => state.profilePicture);
    return (
        <Pressable onPress={() => router.push("/(business)/businessSettings")}>
            <View height={35} width={35} position='relative' overflow='hidden' borderRadius={125} marginRight={5} marginTop={5}>
                <Image
                    style={{
                        flex: 1,
                        width: '100%',
                        backgroundColor: theme.background.val,
                    }}
                    source={profilePicture ? { uri: profilePicture } : emptyProfile}
                    contentFit="cover"
                    transition={400}
                    />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    headerLeft: {
        justifyContent: "center",
        alignItems: "flex-start",
        height: 50,
        width: 50,
    }
})

export const UnprotectedRoutes = [
  "/login",
  "/signUp",
  "/verifyEmail",
  "/forgotPassword",
  "/passwordRecovery",
  ""
]