import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { useTheme } from "tamagui";

// This component renders an animated underline that moves and resizes based on the active tab.
type IndicatorProps = {
    activeLabelRef: View | null; // Reference to the currently active tab label
};

export const Indicator = ({ activeLabelRef }: IndicatorProps) => {
    const theme = useTheme();

    // Shared Animated Values
    const width = useSharedValue(0);      // Tracks the width of the indicator
    const marginLeft = useSharedValue(0); // Tracks the left position (x-offset)

    // Effect to Update Indicator Position and Width
    useEffect(() => {
        if (activeLabelRef) {
            activeLabelRef.measure((x, _, w) => {
                // Animate width and marginLeft when active label changes
                width.value = withTiming(w, { duration: 200 });
                marginLeft.value = withTiming(x, { duration: 200 });
            });
        }
    }, [activeLabelRef]);

    // Animated Styles for the Indicator
    const animatedStyle = useAnimatedStyle(() => ({
        width: width.value,          // Animate width dynamically
        marginLeft: marginLeft.value, // Animate left position dynamically
        height: 3,
        borderRadius: 100,
        backgroundColor: theme.secondaryAccent.val,
    }));

    return (
        <View style={{ height: 3, width: "100%" }}>
            <Animated.View style={animatedStyle} />
        </View>
    );
};
