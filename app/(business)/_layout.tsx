import { withLayoutContext } from 'expo-router';
import React from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { useTheme } from '@tamagui/core';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function BusinessLayout() {
  const theme = useTheme();

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarScrollEnabled: true, // Enable horizontal scrolling
        tabBarContentContainerStyle: {
          backgroundColor: theme.background.val,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.color.val, // Sensible, theme-aligned underline colour
          height: 2, // Thin underline
          alignSelf: 'center', // Center the underline beneath the text
        },
        tabBarLabelStyle: {
            width: "auto",
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize', // Ensures headings are legible
        },
        tabBarStyle: {
          height: 50,
          marginTop: 5
        },
        tabBarItemStyle: {
            width: "auto"
        }
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: 'Overview' }} />
      <MaterialTopTabs.Screen name="services" options={{ title: 'Services' }}/>
      <MaterialTopTabs.Screen name="analytics" options={{ title: 'Analytics' }}/>
      <MaterialTopTabs.Screen name="appointments" options={{ title: 'Appointments' }}/>
      <MaterialTopTabs.Screen name="reviews" options={{ title: 'Reviews' }} />
      <MaterialTopTabs.Screen name="businessSettings" options={{ title: 'Settings' }}/>
    </MaterialTopTabs>
  );
}
