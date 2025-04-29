import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useTheme } from 'tamagui';

export default function BusinessLayout() {
    const theme = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

    <Drawer
      screenOptions={{
        headerTintColor: theme.color.val,
        headerStyle:{
            backgroundColor: theme.background.val,
        },
        headerShown: true,
        headerTitleStyle: {
            opacity: 0
        },
        drawerActiveBackgroundColor: theme.accent.val+"60",
        drawerActiveTintColor: theme.tertiaryAccent.val,
        headerBackgroundContainerStyle: {
            backgroundColor: theme.background.val,
            borderColor: theme.gray1.val,
            borderTopWidth: 1,
            marginTop: 2,
        },
        headerShadowVisible: false,
        drawerStyle: {
            backgroundColor: theme.background.val,
            borderRightWidth: 0,
            width: "80%",
        },
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Overview' }} />
      <Drawer.Screen name="services" options={{ title: 'Services' }}/>
      <Drawer.Screen name="analytics" options={{ title: 'Analytics', }}/>
      <Drawer.Screen name="appointments" options={{ title: 'Appointments' }}/>
      <Drawer.Screen name="reviews" options={{ title: 'Reviews' }} />
      <Drawer.Screen name="businessSettings" options={{ title: 'Settings' }}/>
    </Drawer>
    </GestureHandlerRootView>
  );
}
