import { TouchableOpacity, Animated, ViewProps, GestureResponderEvent } from 'react-native';
import React, { useState } from 'react';
import { SizableText, useTheme } from 'tamagui';
import { StyleProps } from 'react-native-reanimated';

type PressableProps =  ViewProps & {
  children?: React.ReactNode | string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean | undefined;
  pressedStyle?: StyleProps | undefined;
  activeOpacity?: number | undefined;
  innerStyle?: StyleProps | undefined;
  scale?:  number | undefined;
};

export default function Pressable({
    children,
    disabled,
    onPress,
    pressedStyle,
    style,
    innerStyle,
    activeOpacity,
    scale,
    ...rest }: PressableProps
) {

    const [isPressed, setIsPressed] = useState(false);
    const [scaleValue] = useState(new Animated.Value(1));
    const theme = useTheme();
    const onPressIn = () => {
        setIsPressed(true);
        Animated.timing(scaleValue, {
        toValue: scale ?? 0.94, // Slightly smaller for the press effect
        duration: 100,
        useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        setIsPressed(false);
        Animated.timing(scaleValue, {
        toValue: 1, // Reset to original size
        duration: 100,
        useNativeDriver: true,
        }).start();
    };
    return (
        <Animated.View style={[{ transform: [{ scale: scaleValue}]}, (isPressed ? [style, pressedStyle] : style)]} {...rest}>
            <TouchableOpacity
                activeOpacity={activeOpacity}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={onPress}
                disabled={disabled}
                style={[{ height: "100%", width: "100%", alignItems: "center"}, innerStyle ?? style]}
            >
                {typeof children === 'string' ? (
                <SizableText style={{ color: theme.color.val, fontWeight: 900 }}>{children}</SizableText>
                ) : (
                children
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}