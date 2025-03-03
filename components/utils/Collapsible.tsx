import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, View, LayoutChangeEvent, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';
import { ThemedView } from '@/components/utils/ThemedView';
import { IconSymbol } from '@/components/utils/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import Pressable from './Pressable';
import { useTheme, XStack } from 'tamagui';

export function Collapsible({
  children,
  defaultOpen,
  header,
  style,
}: PropsWithChildren<{
  defaultOpen?: boolean;
  header?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}>) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
  const [contentHeight, setContentHeight] = useState(0);
  const animation = useSharedValue(defaultOpen ? 1 : 0);
  const theme = useTheme();
  const scheme = useColorScheme();

  const toggleCollapse = () => {
    const newValue = !isOpen;
    setIsOpen(newValue);
    animation.value = withTiming(newValue ? 1 : 0, { duration: contentHeight * 0.1 + 200 });
  };

  // Animated style for the collapsible content (height and opacity)
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(animation.value, [0, 1], [0, contentHeight]),
    opacity: interpolate(animation.value, [0, 1], [0, 1]),
  }), [contentHeight]);

  // Animated style for the rotating icon
  const rotateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: interpolate(animation.value, [0, 1], [180, 90]) + 'deg' },
    ],
  }));

  // Measure the height of the children content
  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  return (
    <ThemedView style={[{ borderRadius: 10, backgroundColor: theme.background.val }, style]}>
      <Pressable
        style={styles.heading}
        onPress={toggleCollapse}
        scale={0.999}
        activeOpacity={0.8}
      >
        <XStack width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
        {header}
          <Animated.View style={rotateAnimatedStyle}>
            <IconSymbol
              name="chevron.right"
              size={18}
              weight="medium"
              color={scheme === 'light' ? Colors.light.icon : Colors.dark.icon}
            />
          </Animated.View>
        </XStack>
      </Pressable>

      {/* Animated Content */}
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <View style={styles.hiddenContent} onLayout={handleLayout}>
          {children}
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  content: {
    overflow: 'hidden',
  },
  hiddenContent: {
    position: 'absolute', // Ensure this doesn't affect layout outside animation
    top: 0,
    left: 0,
    right: 0,
  },
});
