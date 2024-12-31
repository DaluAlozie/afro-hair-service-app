import React from "react";
import { TouchableOpacity, StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { LinkProps as ExpoLinkProps, useRouter } from "expo-router";
import { useTheme, UseThemeResult } from "@tamagui/web";

type LinkProps = ExpoLinkProps & {
  style?: StyleProp<ViewStyle>; // Custom styles for the TouchableOpacity wrapper
  textStyle?: StyleProp<TextStyle>; // Custom styles for the text
  activeOpacity?: number; // Customizable opacity for press feedback
};

export default function Link({
  href,
  children,
  style,
  textStyle,
  activeOpacity = 0.6,
  ...props
}: LinkProps) {

    const theme = useTheme();
    const styles = makeStyle(theme);
    const router = useRouter();
    const onPress = () => {
        router.push(href)
    }
    return (
        <TouchableOpacity style={style} activeOpacity={activeOpacity} onPress={onPress} {...props}>
            <Text style={[styles.text, textStyle]}>{children}</Text>
        </TouchableOpacity>
    );
}

const makeStyle = (theme: UseThemeResult) =>  StyleSheet.create({
    text: {
        color: theme.gray10Dark.val,
        fontSize: 16,
    },
});