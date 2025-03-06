import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function BusinessLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

    <Drawer
      screenOptions={{
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
