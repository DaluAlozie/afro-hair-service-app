import { withLayoutContext } from 'expo-router';
import React from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { useTheme } from '@tamagui/core';
import { useWindowDimensions } from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function BusinessLayout() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const numberOfTabs = 6;
  const overflow = width < 100*numberOfTabs;
  const bg = theme.background.val


  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarScrollEnabled: true, // Enable horizontal scrolling
        tabBarContentContainerStyle: {
          backgroundColor: bg,
          justifyContent: 'center',
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.secondaryAccent.val, // Sensible, theme-aligned underline colour
          height: 11, // Thin underline
          alignSelf: 'center', // Center the underline beneath the text
        },
        tabBarIndicatorContainerStyle: {
          backgroundColor: theme.background.val, // Ensure the underline doesn't have a background
          justifyContent: 'center', // Center the underline beneath the text
        },
        tabBarLabelStyle: {
            width: "auto",
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize', // Ensures headings are legible
        },
        tabBarStyle: {
          height: 50,
        },
        tabBarItemStyle: {
            width: "auto",
            height: 47,
            minWidth: overflow ? undefined : width/numberOfTabs,
        }
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: 'Overview' }} />
      <MaterialTopTabs.Screen name="services" options={{ title: 'Services' }}/>
      <MaterialTopTabs.Screen name="analytics" options={{ title: 'Analytics', }}/>
      <MaterialTopTabs.Screen name="appointments" options={{ title: 'Appointments' }}/>
      <MaterialTopTabs.Screen name="reviews" options={{ title: 'Reviews' }} />
      <MaterialTopTabs.Screen name="businessSettings" options={{ title: 'Settings' }}/>
    </MaterialTopTabs>
  );
}
