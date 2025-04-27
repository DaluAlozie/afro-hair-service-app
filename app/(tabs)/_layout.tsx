/* eslint-disable react/prop-types */
import { Tabs, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { useTheme } from 'tamagui';
import TabBarBackground from '@/components/utils/ui/TabBarBackground';
import SearchBold from '@/assets/icons/search_bold';
import SearchOutline from '@/assets/icons/search_outline';
import { ThemedText, ThemedView } from '@/components/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import Pressable from '@/components/utils/Pressable';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import HomeFill from '@/assets/icons/home_fill';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const theme = useTheme();
  const bg = theme.background.val
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.color.val,
        tabBarBackground: () => <TabBarBackground/>,
        tabBarActiveBackgroundColor: bg,
        tabBarInactiveBackgroundColor: bg,
        headerBackgroundContainerStyle: {backgroundColor: bg},
        headerBackground: () => <ThemedView></ThemedView>,
        tabBarHideOnKeyboard: true,
        headerRight: HeaderRight,
        headerLeft: HeaderLeft,
        headerShown: true,
        tabBarShowLabel: false,
        tabBarLabelStyle:{},
        tabBarPosition: "bottom",
        headerTitleAlign: "center",
        tabBarLabelPosition: "below-icon",
        tabBarButton: TabBarButton,
        tabBarStyle: Platform.select({
          ios: styles.tabBarIOS,
          default:styles.tabBar,
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            focused ? <HomeFill size={24} color={color} />: <Octicons name="home" size={24} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => focused ? <SearchBold size={24} color={color}/>:<SearchOutline size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color, focused }) => focused ? <MaterialCommunityIcons name="robot" size={30} color={color} />:<MaterialCommunityIcons name="robot-outline" size={30} color={color} />,
        }}
      />
    </Tabs>
  );
}

const TabBarButton = ({ children, onPress, ...rest }: BottomTabBarButtonProps) => {
  return (
    <View {...rest}>
      <Pressable onPress={onPress} style={styles.tabBarButton}>
        {children}
      </Pressable>
    </View>
  )
}

const HeaderRight = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  return  (pathname != "/settings"?
    <Pressable onPress={() => router.push("/settings")} style={styles.headerRight}>
      <Ionicons name="settings-outline" size={24} color={theme.color.val} />
    </Pressable>
    :
    <ThemedText></ThemedText>
  )
}

const HeaderLeft = () => {
  const theme = useTheme();
  const router = useRouter();
  return  (
    <Pressable onPress={() => router.push("/(business)")} style={styles.headerLeft}>
      <Ionicons name="business" size={24} color={theme.color.val} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 0
  },
  tabBarIOS: {
    position: 'absolute',
    height: 80,
    width: "100%",
    opacity: 1,
    paddingTop: 0,
    paddingBottom: 0,
  },
  tabBarButton: {
    width: "100%",
    height:"100%",
    marginTop: 5,
    alignItems: "center",
  },
  headerRight: {
    marginRight: 7,
    justifyContent: "center",
    alignItems: "flex-end",
    height: 50,
    width: 50,
  },
  headerLeft: {
    marginLeft: 7,
    justifyContent: "center",
    alignItems: "flex-start",
    height: 50,
    width: 50
  }
})