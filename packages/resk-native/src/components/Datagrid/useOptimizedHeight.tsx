import { useDimensions } from '@dimensions/index';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, LayoutChangeEvent, Dimensions, ScrollView, FlatList } from 'react-native';

interface UseOptimalHeightProps {
    /**
     * Optional maximum height the FlatList can take
     */
    maxHeight?: number;

    /**
     * Whether the FlatList is in a scrollable parent component
     */
    isInScrollView?: boolean;

    /**
     * Bottom padding to leave space for other UI elements
     */
    bottomPadding?: number;

    /**
     * Minimum height the FlatList should have
     */
    minHeight?: number;

    /**
     * Reference to the parent view containing the FlatList and siblings
     */
    containerRef?: React.RefObject<View>;

    /**
     * Dependent values that should trigger a height recalculation
     */
    dependencies?: any[];
}

/**
 * Custom hook to calculate the optimal height for a FlatList container
 */
export const useOptimalFlatListHeight = ({
    maxHeight,
    isInScrollView = false,
    bottomPadding = 0,
    minHeight = 100,
    containerRef,
    dependencies = [],
}: UseOptimalHeightProps) => {
    const [optimalHeight, setOptimalHeight] = useState<number>(minHeight);
    const siblingsHeightRef = useRef<number>(0);
    const containerYRef = useRef<number>(0);
    const { height: screenHeight } = useDimensions();

    // Calculate available height based on screen dimensions, container position, and siblings
    const calculateAvailableHeight = useCallback(() => {
        if (!containerRef?.current) return;
        // Get container position
        containerRef.current.measure((x, y, width, height, pageX, pageY) => {
            containerYRef.current = pageY;

            // If it's in a ScrollView, we don't need to worry about screen boundaries
            if (isInScrollView) {
                const availableHeight = Math.max(minHeight, height - siblingsHeightRef.current);
                setOptimalHeight(maxHeight ? Math.min(maxHeight, availableHeight) : availableHeight);
            } else {
                // If not in ScrollView, adjust for screen boundaries
                const remainingScreenHeight = screenHeight - pageY - bottomPadding;
                const availableHeight = Math.max(minHeight, remainingScreenHeight - siblingsHeightRef.current);
                setOptimalHeight(maxHeight ? Math.min(maxHeight, availableHeight) : availableHeight);
            }
        });
    }, [screenHeight, minHeight, maxHeight, isInScrollView, bottomPadding]);

    // Measure siblings height
    const onSiblingsLayout = useCallback((e: LayoutChangeEvent) => {
        siblingsHeightRef.current = e.nativeEvent.layout.height;
        calculateAvailableHeight();
    }, [calculateAvailableHeight]);

    // Recalculate when dependencies change
    useEffect(() => {
        calculateAvailableHeight();
    }, [calculateAvailableHeight, ...dependencies]);
    return {
        optimalHeight,
        onSiblingsLayout,
    };
};

/**
 * Container component that optimizes FlatList height
 */
interface OptimizedFlatListContainerProps {
    renderFlatList: (height: number) => React.ReactNode;
    siblings?: React.ReactNode;
    maxHeight?: number;
    isInScrollView?: boolean;
    bottomPadding?: number;
    minHeight?: number;
    dependencies?: any[];
}

export const OptimizedFlatListContainer: React.FC<OptimizedFlatListContainerProps> = ({
    renderFlatList,
    siblings,
    maxHeight,
    isInScrollView = false,
    bottomPadding = 0,
    minHeight = 100,
    dependencies = [],
}) => {
    const containerRef = useRef<View>(null);

    const { optimalHeight, onSiblingsLayout } = useOptimalFlatListHeight({
        maxHeight,
        isInScrollView,
        bottomPadding,
        minHeight,
        containerRef,
        dependencies,
    });

    return (
        <View ref={containerRef} style={{ flex: 1 }}>
            {siblings && <View onLayout={onSiblingsLayout}>{siblings}</View>}
            {renderFlatList(optimalHeight)}
        </View>
    );
};

/**
 * Usage example
 */
export const ExampleUsage: React.FC = () => {
    const data = Array(20).fill(0).map((_, i) => ({ id: i, title: `Item ${i}` }));

    // Example 1: In a non-scrollable parent
    const Example1 = () => (
        <View style={{ flex: 1 }}>
            <OptimizedFlatListContainer
                siblings={
                    <>
                        <View style={{ height: 50, backgroundColor: 'lightblue' }} />
                        <View style={{ height: 80, backgroundColor: 'lightgreen' }} />
                    </>
                }
                renderFlatList={(height) => (
                    <FlatList
                        style={{ height }}
                        data={data}
                        renderItem={({ item }) => (
                            <View style={{ height: 50, borderBottomWidth: 1 }}>
                                {/* Item content */}
                            </View>
                        )}
                        keyExtractor={(item) => `item-${item.id}`}
                    />
                )}
            />
            <View style={{ height: 60, backgroundColor: 'pink' }} />
        </View>
    );

    // Example 2: In a ScrollView
    const Example2 = () => (
        <ScrollView>
            <View style={{ height: 100, backgroundColor: 'yellow' }} />
            <OptimizedFlatListContainer
                isInScrollView={true}
                maxHeight={300}
                renderFlatList={(height) => (
                    <FlatList
                        style={{ height }}
                        scrollEnabled={false} // Important when inside ScrollView
                        data={data}
                        renderItem={({ item }) => (
                            <View style={{ height: 50, borderBottomWidth: 1 }}>
                                {/* Item content */}
                            </View>
                        )}
                        keyExtractor={(item) => `item-${item.id}`}
                    />
                )}
            />
            <View style={{ height: 200, backgroundColor: 'orange' }} />
        </ScrollView>
    );

    return <Example1 />;
};