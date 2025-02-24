import React, { PropsWithChildren, useRef, useState } from 'react';
import { Animated, StyleSheet, View, LayoutChangeEvent, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/utils/ThemedView';
import { IconSymbol } from '@/components/utils/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import Pressable from './Pressable';
import { useTheme } from 'tamagui';

export function Collapsible({ children, defaultOpen, header, style }: PropsWithChildren & {
  defaultOpen?: boolean | undefined;
  header? : React.ReactNode | undefined;
  style?: StyleProp<ViewStyle> | undefined;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
  const [contentHeight, setContentHeight] = useState(0); // Store the measured height of children
  const animation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const theme = useTheme();
  const scheme =  useColorScheme();

  const toggleCollapse = () => {
    setIsOpen((prev) => !prev);
    Animated.timing(animation, {
      toValue: isOpen ? 0 : 1,
      duration: contentHeight * 0.1 + 200,
      useNativeDriver: false, // Required for animating height
    }).start();
  };

  // Interpolate values for height and opacity
  const heightAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const opacityAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

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
        activeOpacity={0.8}>
        {header}
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['180deg', '90deg'],
                }),
              },
            ],
          }}>
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color={scheme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
        </Animated.View>
      </Pressable>

      {/* Animated Content */}
      <Animated.View
        style={[
          styles.content,
          { height: heightAnimation, opacity: opacityAnimation },
        ]}>
        {/* Measure content height using View */}
        <View
          style={styles.hiddenContent}
          onLayout={handleLayout}>
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
