import React, { useEffect, useState } from 'react';
import { ViewStyle, LayoutChangeEvent } from 'react-native';
import { StackProps, useTheme, View } from 'tamagui';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface SuspenseProps extends StackProps {
  /** Number of placeholder items to display */
  count?: number;
  itemStyle: ViewStyle;
  containerStyle?: ViewStyle;
}

export const Suspense = ({
  count = 1,
  itemStyle,
  containerStyle
}: SuspenseProps) => {
  // Shared value for the pulse animation (0 to 1 loop)
  const progress = useSharedValue(0);

  const theme = useTheme();
  // Shared value for the shimmer animation (0 to 1 loop)
  const shimmerProgress = useSharedValue(0);

  // State to store the measured width of the skeleton item
  const [itemWidth, setItemWidth] = useState(0);

  // Start the animations on mount
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // Animated style for pulse (alternating opacity)
  const pulseStyle = useAnimatedStyle((): ViewStyle => {
    const opacity = 0.5 + 0.5 * Math.sin(progress.value * 2 * Math.PI);
    return { opacity };
  });

  // Base style for each skeleton item
  const baseItemStyle: ViewStyle = {
    borderRadius: 4,
    overflow: 'hidden', // ensure shimmer does not overflow the item
  };

  // Compute shimmer width as 30% of the measured item width
  const shimmerWidth = itemWidth ? itemWidth * 0.9 : 0;

  // Animated style for the shimmer overlay
  const shimmerStyle = useAnimatedStyle((): ViewStyle => {
    if (itemWidth === 0) return {};
    // Animate translateX from -shimmerWidth to itemWidth so that the gradient slides through
    const translateX = shimmerProgress.value * (itemWidth + shimmerWidth) - shimmerWidth;
    return { transform: [{ translateX }] };
  });

  // Capture the width of the first skeleton item
  const onItemLayout = (event: LayoutChangeEvent) => {
    if (itemWidth === 0) {
      setItemWidth(event.nativeEvent.layout.width);
    }
  };

  return (
    <View position="relative" style={containerStyle} backgroundColor={theme.section.val}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={`skeleton-${index}`}
          // Only measure the first item to get the width
          onLayout={index === 0 ? onItemLayout : undefined}
          style={[
            baseItemStyle,
            pulseStyle,
            { marginBottom: index < count - 1 ? 8 : 0, backgroundColor: theme.background.val },
            itemStyle

          ]}
        >
          {itemWidth > 0 && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: shimmerWidth,
                },
                shimmerStyle,
              ]}
            >
              <LinearGradient
                colors={['transparent', theme.gray11Light.val, 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          )}
        </Animated.View>
      ))}
    </View>
  );
};
