import { BlurView } from "expo-blur";
import React from "react";
import { Platform, View } from "react-native";
import { useColorScheme } from "react-native";
// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  return (
    Platform.OS == "ios"?
    <BlurView
    intensity={90} tint={ colorScheme == "dark" ? "dark" : "light" }
    >

    </BlurView> :
    <View>
    </View>
  )
}

// export function useBottomTabOverflow() {
//   return 0;
// }
