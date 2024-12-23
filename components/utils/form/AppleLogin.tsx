import React from "react";
import { Platform, useColorScheme } from "react-native";
import AppleLogoDark from "@/assets/icons/apple_dark";
import AppleLogoLight from "@/assets/icons/apple_light";
import { useAuthStore } from "@/utils/stores/authStore";
import { View } from "tamagui";
import ThirdPartySignIn from "./ThirdPartySignIn";

export default function AppleLogin() {
  const colorScheme = useColorScheme() ?? 'light';
  const onPress = useAuthStore((state) => state.appleSignIn);

  return (
    <>
      {Platform.OS === "ios" && (
        <ThirdPartySignIn name="Apple" onPress={onPress}>
          <View marginLeft="-10">
            { colorScheme === "light" ? (
              <AppleLogoDark></AppleLogoDark>
            ): (
              <AppleLogoLight></AppleLogoLight>
            )}
          </View>
        </ThirdPartySignIn>
      )}
    </>
  );
}
