import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Entypo from '@expo/vector-icons/Entypo'
import React, { useCallback, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider, View } from 'tamagui';
import config from '../tamagui.config'

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/utils/stores/authStore';

import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { supabaseClient } from '@/utils/auth/supabase';
import { CurrentToast } from '@/components/utils/Toast/CurrentToast';
import { Colors } from '@/constants/Colors';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { setStatusBarBackgroundColor, setStatusBarStyle, StatusBar } from 'expo-status-bar';
import AppStack, { animationDuration } from '@/components/navigation/AppStack';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotificationObserver } from '@/hooks/notifications/useNotificationObserver';
import useResetStores from '@/hooks/useResetStores';
import useStripeDeepLinkHandler from '@/hooks/booking/useStripeDeepLinkHandler';
import useAppLoad from '@/hooks/useAppLoad';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 300,
  fade: true,
});


export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const { left, top, right } = initialWindowMetrics!.insets;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const resetStores = useResetStores();

  const router = useRouter();

  // Handle deep links for Stripe
  useStripeDeepLinkHandler();

  // Handle deep links for notifications
  const { handleNotification } = useNotificationObserver();

  // Load app data when the app is ready and the user is logged in
  useAppLoad();

  // Prepare the app for rendering after the splash screen is hidden
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        if (Platform.OS == "android") {
          setStatusBarBackgroundColor(
            colorScheme === 'dark' ? Colors.dark.background : Colors.light.background
          )
          setStatusBarStyle(colorScheme === 'dark' ? "light" : "dark")
           // enables edge-to-edge mode
          await NavigationBar.setPositionAsync('absolute');
          NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? "dark" : "light");
          await NavigationBar.setBackgroundColorAsync(
          colorScheme === 'dark' ? Colors.dark.background : Colors.light.background
        )
        }
        const supabase = await supabaseClient;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await resetStores();
          setUser(user);
          setIsLoggedIn(true);
        }

        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);

      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);


  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      if (!isLoggedIn){
        if (router.canDismiss()){
          router.dismissAll();
        }
        router.replace("/landing");
        await new Promise(resolve => setTimeout(resolve, animationDuration*1.5));
      }
      SplashScreen.hide();
      if (isLoggedIn) {
        return handleNotification();
      }
    }
  }, [appIsReady, isLoggedIn]);

  if (!appIsReady) return null;

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme ?? 'light'}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ToastProvider swipeDirection="up" duration={5000}>
          <QueryClientProvider client={queryClient}>
            <StatusBar style={colorScheme === 'dark' ? "light" : "dark"}/>
            <View onLayout={onLayoutRootView} style={{ height: '100%', width: '100%' }} backgroundColor={"$background"}>
                <CurrentToast />
                <ToastViewport flexDirection="column-reverse" top={top} left={left} right={right} />
                <AppStack/>
            </View>
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}

export const unstable_settings = {
  initialRouteName: '(tabs)/index',
}