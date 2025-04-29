import { TouchableOpacity, ViewProps, GestureResponderEvent } from 'react-native';
import React, { useState } from 'react';
import { SizableText, useTheme } from 'tamagui';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { StyleProps } from 'react-native-reanimated';

type PressableProps = ViewProps & {
  children?: React.ReactNode | string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  pressedStyle?: StyleProps;
  activeOpacity?: number;
  innerStyle?: StyleProps;
  scale?: number;
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
  ...rest
}: PressableProps) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleValue = useSharedValue(1);
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const onPressIn = () => {
    setIsPressed(true);
    scaleValue.value = withTiming(scale ?? 0.94, { duration: 50 });
  };

  const onPressOut = () => {
    setIsPressed(false);
    scaleValue.value = withTiming(1, { duration: 50 });
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        isPressed ? [style, pressedStyle] : style,
      ]}
      {...rest}
    >
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        disabled={disabled}
        style={[
          { height: 'auto', width: 'auto', alignItems: 'center' },
          innerStyle ?? style,
        ]}
      >
        {typeof children === 'string' ? (
          <SizableText style={{ color: theme.color.val, fontWeight: '900' }}>
            {children}
          </SizableText>
        ) : (
          children
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
