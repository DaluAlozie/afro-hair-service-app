import React, { useRef, useCallback, useEffect } from "react";
import { useWindowDimensions, View, NativeSyntheticEvent, NativeScrollEvent, Text } from "react-native";
import { useTheme, XStack, ScrollView } from "tamagui";
import Pressable from "../../Pressable";
import { Indicator } from "./Indicator";

// Props for the TabBar component
type TabBarProps = {
    labels: string[]; // Array of tab labels
    activeTab: string; // Currently active tab
    setActiveTab: (label: string) => void; // Function to set the active tab
};

export const TabBar = ({ labels, activeTab, setActiveTab }: TabBarProps) => {
    // Theme and color scheme
    const theme = useTheme();
    const bg = theme.background.val; // Background color based on theme
    const { width } = useWindowDimensions(); // Get the screen width

    // Refs for tab labels and scroll view
    const labelRefs = useRef<(View | null)[]>([]);
    const scrollRef = useRef<ScrollView>(null);
    const scrollX = useRef(0); // Track horizontal scroll position

    // Handle scroll events to track the horizontal scroll position
    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollX.current = event.nativeEvent.contentOffset.x;
    }, []);

    // Auto-scroll the tab bar when the active tab changes
    useEffect(() => {
        const index = labels.indexOf(activeTab); // Find the index of the active tab

        // Measure the position of the active tab and scroll if necessary
        labelRefs.current[index]?.measure((x, y, w) => {
            const currentScrollX = scrollX.current;
            if (x + w >= currentScrollX + width || x - 10 < currentScrollX) {
                scrollRef.current?.scrollTo({ x: x - 10, animated: true });
            }
        });
    }, [activeTab, labels, width]);

    return (
        <View style={{ marginLeft: "5%" }}>
            {/* Horizontal scrollable tab bar */}
            <ScrollView
                height={"auto"}
                horizontal
                backgroundColor={bg}
                contentContainerStyle={{ justifyContent: "flex-start" }}
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                onScroll={onScroll}
            >
                <View>
                    {/* Container for tab labels */}
                    <XStack width={"auto"} minWidth={width} justifyContent={"flex-start"} height={40} paddingTop={10}>
                        {labels.map((label, index) => (
                            <View key={label} ref={(el) => (labelRefs.current[index] = el)}>
                                {/* Pressable tab label */}
                                <Pressable
                                    onPress={() => {
                                        setActiveTab(label); // Set the active tab on press
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: theme.color.val,
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            marginHorizontal: 10,
                                            opacity: activeTab === label ? 1 : 0.4, // Highlight the active tab
                                        }}
                                    >
                                        {label}
                                    </Text>
                                </Pressable>
                            </View>
                        ))}
                    </XStack>
                    {/* Indicator for the active tab */}
                    <Indicator activeLabelRef={labelRefs.current[labels.indexOf(activeTab)]} />
                </View>
            </ScrollView>
        </View>
    );
};