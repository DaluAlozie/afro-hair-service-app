import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

type PulseProps = {
  children: React.ReactNode;
  style?: ViewStyle; // Optional custom styles
};

export default function Pulse({ children, style }: PulseProps) {
  // Create an Animated.Value for opacity
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Configure the pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4, // Fade out to 50% opacity
          duration: 700, // Duration of the fade-out
          easing: Easing.inOut(Easing.ease), // Smooth easing function
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(opacity, {
          toValue: 1, // Fade back to 100% opacity
          duration: 700, // Duration of the fade-in
          easing: Easing.inOut(Easing.ease), // Smooth easing function
          useNativeDriver: true, // Use native driver for better performance
        }),
      ])
    );

    // Start the animation
    pulseAnimation.start();

    // Cleanup: Stop the animation when the component unmounts
    return () => {
      pulseAnimation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacity, // Bind opacity to the animated value
        },
        style, // Apply any custom styles passed as props
      ]}
    >
      {children}
    </Animated.View>
  );
}