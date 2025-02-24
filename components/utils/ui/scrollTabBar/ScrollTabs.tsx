import React, { isValidElement, ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ViewStyle, NativeScrollEvent, NativeSyntheticEvent, RefreshControl } from 'react-native';
import { ScrollView } from 'tamagui';
import { TabBar } from './TabBar';

// Props for the ScrollTabs component
type ScrollTabsProps = {
    children: ReactNode;
    header: () => ReactNode;
    refreshing: boolean;
    refresh: () => void | Promise<void>;
};

// Main ScrollTabs component
export default function ScrollTabs({ children, header, refresh, refreshing }: ScrollTabsProps) {
    // Refs for tabs, scroll view, and scroll container
    const tabRefs = useRef<(View | null)[]>([]);
    const scrollRef = useRef<ScrollView>(null);
    const scrollContainerRef = useRef<View>(null);

    // State for active tab, scroll view height, and drag status
    const [activeTab, setActiveTab] = useState("");
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [isDrag, setIsDrag] = useState(false);

    // Convert children to an array for easier manipulation
    const childrenArray = React.Children.toArray(children);

    // Measure the scroll container height once the component mounts
    useEffect(() => {
        scrollContainerRef.current?.measure((x, y, w, h) => {
            setScrollViewHeight(h);
        });
    }, []);

    // Set the first tab as the active tab initially
    useEffect(() => {
        if (childrenArray.length > 0) {
            const firstTab = childrenArray.find(isTab);
            if (firstTab) setActiveTab(firstTab.props.label);
        }
    }, [childrenArray.length]);

    // Handles scrolling behavior and updates the active tab based on position
    const onScroll = useCallback(async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!tabRefs.current || !scrollContainerRef.current || !isDrag) return;

        const middleOfView = event.nativeEvent.contentOffset.y+scrollViewHeight/2;
        let selectedIndex: number | undefined = undefined;

        // Determine which tab is currently in view
        for (let i = tabRefs.current.length - 1; i >= 0; i--) {
            const tab = tabRefs.current[i];
            tab?.measure((x, y) => {
                if (middleOfView >= y) {
                    selectedIndex = i;
                }
            });
            if (selectedIndex !== undefined) break;
        }

        // Update the active tab if a new tab is selected
        if (selectedIndex !== undefined) {
            setActiveTab(labels[selectedIndex]);
        }
    }, [scrollViewHeight, isDrag]);

    // Check if a child is a Tab component
    const isTab = useCallback((child: ReactNode): child is ReactElement<SectionProps> => {
        return isValidElement(child) && child.type === Section;
    }, []);

    // Store labels and their corresponding indices
    const labelMap = useMemo(() => {
        const map = new Map<string, number>();
        childrenArray.forEach((child, index) => {
            if (isTab(child)) map.set(child.props.label, index);
        });
        return map;
    }, [childrenArray]);

    // Extract labels from the label map
    const labels = useMemo(() => Array.from(labelMap.keys()), [labelMap]);

    // Scroll to the selected tab and update the active tab
    const activateAndScrollToTab = useCallback((label: string) => {
        setActiveTab(label);
        const index = labelMap.get(label);
        const tabRef = tabRefs.current[index!];

        // Scroll to the selected tab
        tabRef?.measure((x, y) => {
            scrollRef.current?.scrollTo({ y: y-20, animated: true });
        });
    }, [labelMap]);

    return (
        <View style={{ height: "100%", width: "100%" }}>
            {/* Scrollable container for tabs section */}
            <View ref={scrollContainerRef} style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={onScroll}
                    onScrollBeginDrag={() => setIsDrag(true)}
                    onMomentumScrollEnd={() => setIsDrag(false)}
                    stickyHeaderIndices={[1]}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
                >
                    { header() }
                    {/* TabBar component for navigation */}
                    <TabBar labels={labels} activeTab={activeTab} setActiveTab={activateAndScrollToTab} />
                    {/* Render children, wrapping Tab components with refs */}
                    {childrenArray.map((child, index) => (
                        isTab(child) ? (
                            <View key={index} ref={(el) => (tabRefs.current[index] = el)}>
                                {child}
                            </View>
                        ) : child
                    ))}
                    <View style={{ height: 100 }}/>
                </ScrollView>
            </View>
        </View>
    );
}

// Props for the Tab component
type SectionProps = {
    label: string;
    style?: ViewStyle;
    children?: ReactNode;
    active?: boolean;
};

// Tab component
const Section = ({ style, children }: SectionProps) => {
    return <View style={[style]}>{children}</View>;
};

// Attach Tab component to ScrollTabs for easier access
ScrollTabs.Section = Section;