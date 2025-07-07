import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    View,
    Animated,
    PanResponder,
    Dimensions,
    StatusBar,
    Modal,
    TouchableWithoutFeedback,
    BackHandler,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    snapPoints?: number[];
    initialSnap?: number;
    enablePanDownToClose?: boolean;
    backdropOpacity?: number;
    cornerRadius?: number;
    handleIndicatorStyle?: object;
    containerStyle?: object;
    animationDuration?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    visible,
    onClose,
    children,
    snapPoints = [0.3, 0.7],
    initialSnap = 0,
    enablePanDownToClose = true,
    backdropOpacity = 0.5,
    cornerRadius = 16,
    handleIndicatorStyle = {},
    containerStyle = {},
    animationDuration = 300,
}) => {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity_anim = useRef(new Animated.Value(0)).current;
    const lastGesture = useRef(0);
    const [contentHeight, setContentHeight] = useState(0);
    const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);

    // Convert snap points to actual heights
    const getSnapHeights = useCallback(() => {
        const maxHeight = SCREEN_HEIGHT - 100; // Safe area padding
        return snapPoints.map(point => {
            if (point <= 1) {
                return maxHeight * point;
            }
            return Math.min(point, maxHeight);
        });
    }, [snapPoints]);

    const snapHeights = getSnapHeights();

    // Get the target height for current snap
    const getTargetHeight = useCallback(() => {
        if (contentHeight > 0) {
            const autoHeight = contentHeight + 64; // padding + handle
            const snapHeight = snapHeights[currentSnapIndex];
            return Math.min(autoHeight, snapHeight);
        }
        return snapHeights[currentSnapIndex];
    }, [contentHeight, snapHeights, currentSnapIndex]);

    // Animate to position
    const animateToPosition = useCallback((height: number, duration = animationDuration) => {
        const toValue = SCREEN_HEIGHT - height;

        Animated.parallel([
            Animated.timing(translateY, {
                toValue,
                duration,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity_anim, {
                toValue: visible ? backdropOpacity : 0,
                duration,
                useNativeDriver: true,
            }),
        ]).start();
    }, [translateY, backdropOpacity_anim, visible, backdropOpacity, animationDuration]);

    // Show/hide bottom sheet
    useEffect(() => {
        if (visible) {
            const targetHeight = getTargetHeight();
            animateToPosition(targetHeight);
        } else {
            animateToPosition(0);
        }
    }, [visible, contentHeight, animateToPosition, getTargetHeight]);

    // Handle back button on Android
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (visible) {
                onClose();
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [visible, onClose]);

    // Pan responder for gesture handling
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dy) > 10;
            },
            onPanResponderMove: (evt, gestureState) => {
                const { dy } = gestureState;
                lastGesture.current = dy;

                // Only allow dragging down or up within bounds
                const currentHeight = getTargetHeight();
                const newTranslateY = Math.max(
                    SCREEN_HEIGHT - Math.max(...snapHeights),
                    Math.min(
                        SCREEN_HEIGHT - currentHeight + dy,
                        SCREEN_HEIGHT
                    )
                );

                translateY.setValue(newTranslateY);
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { dy, vy } = gestureState;

                // Determine which snap point to animate to
                const currentHeight = getTargetHeight();
                const draggedHeight = currentHeight - dy;

                // Find closest snap point
                let closestSnapIndex = 0;
                let minDistance = Math.abs(snapHeights[0] - draggedHeight);

                snapHeights.forEach((height, index) => {
                    const distance = Math.abs(height - draggedHeight);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSnapIndex = index;
                    }
                });

                // Consider velocity for better UX
                if (Math.abs(vy) > 0.5) {
                    if (vy > 0) {
                        // Fast downward swipe
                        if (enablePanDownToClose && closestSnapIndex === 0) {
                            onClose();
                            return;
                        }
                        closestSnapIndex = Math.max(0, closestSnapIndex - 1);
                    } else {
                        // Fast upward swipe
                        closestSnapIndex = Math.min(snapHeights.length - 1, closestSnapIndex + 1);
                    }
                }

                // Close if dragged down significantly
                if (enablePanDownToClose && (dy > 100 || vy > 0.5)) {
                    onClose();
                    return;
                }

                setCurrentSnapIndex(closestSnapIndex);
                animateToPosition(snapHeights[closestSnapIndex]);
            },
        })
    ).current;

    // Handle content layout
    const onContentLayout = useCallback((event: any) => {
        const { height } = event.nativeEvent.layout;
        setContentHeight(height);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
            animationType="none"
            statusBarTranslucent
        >
            <View className="flex-1">
                {/* Backdrop */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View
                        className="absolute inset-0 bg-black"
                        style={{ opacity: backdropOpacity_anim }}
                    />
                </TouchableWithoutFeedback>

                {/* Bottom Sheet */}
                <Animated.View
                    className="absolute left-0 right-0 bottom-0 bg-white"
                    style={[
                        {
                            transform: [{ translateY }],
                            borderTopLeftRadius: cornerRadius,
                            borderTopRightRadius: cornerRadius,
                            minHeight: 100,
                            maxHeight: SCREEN_HEIGHT - 100,
                        },
                        containerStyle,
                    ]}
                    {...panResponder.panHandlers}
                >
                    {/* Handle Indicator */}
                    <View className="items-center py-3">
                        <View
                            className="w-10 h-1 bg-gray-300 rounded-full"
                            style={handleIndicatorStyle}
                        />
                    </View>

                    {/* Content */}
                    <View
                        className="flex-1 px-4 pb-4"
                        onLayout={onContentLayout}
                    >
                        {children}
                    </View>

                    {/* Safe area bottom padding */}
                    <View style={{ height: 20 }} />
                </Animated.View>
            </View>
        </Modal>
    );
};

// Usage Example Component
export const BottomSheetExample: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [contentType, setContentType] = useState<'short' | 'medium' | 'long'>('short');

    const shortContent = (
        <View className="py-4">
            <Text className="text-xl font-bold mb-4">Short Content</Text>
            <Text className="text-gray-600 mb-4">
                This is a short content example that will auto-size the bottom sheet.
            </Text>
            <TouchableOpacity
                className="bg-blue-500 p-4 rounded-lg"
                onPress={() => setIsVisible(false)}
            >
                <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
        </View>
    );

    const mediumContent = (
        <View className="py-4">
            <Text className="text-xl font-bold mb-4">Medium Content</Text>
            <Text className="text-gray-600 mb-4">
                This is a medium content example with more text to demonstrate auto-height functionality.
                The bottom sheet will automatically adjust to fit this content while respecting the snap points.
            </Text>
            <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-gray-700">
                    Additional content section that adds more height to the bottom sheet.
                </Text>
            </View>
            <TouchableOpacity
                className="bg-green-500 p-4 rounded-lg"
                onPress={() => setIsVisible(false)}
            >
                <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
        </View>
    );

    const longContent = (
        <ScrollView className="py-4">
            <Text className="text-xl font-bold mb-4">Long Content</Text>
            <Text className="text-gray-600 mb-4">
                This is a long content example that will test the maximum height constraints.
                The bottom sheet will respect the snap points while providing smooth scrolling.
            </Text>
            {Array.from({ length: 10 }).map((_, i) => (
                <View key={i} className="bg-gray-100 p-4 rounded-lg mb-4">
                    <Text className="text-gray-700 font-semibold">Section {i + 1}</Text>
                    <Text className="text-gray-600 mt-2">
                        This is section {i + 1} content. The bottom sheet maintains smooth performance
                        even with scrollable content and respects the snap points.
                    </Text>
                </View>
            ))}
            <TouchableOpacity
                className="bg-red-500 p-4 rounded-lg"
                onPress={() => setIsVisible(false)}
            >
                <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const getContent = () => {
        switch (contentType) {
            case 'short': return shortContent;
            case 'medium': return mediumContent;
            case 'long': return longContent;
            default: return shortContent;
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-50">
            <Text className="text-2xl font-bold mb-8">Bottom Sheet Demo</Text>

            <View className="space-y-4">
                <TouchableOpacity
                    className="bg-blue-500 p-4 rounded-lg min-w-48"
                    onPress={() => {
                        setContentType('short');
                        setIsVisible(true);
                    }}
                >
                    <Text className="text-white text-center font-semibold">Show Short Content</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-green-500 p-4 rounded-lg min-w-48"
                    onPress={() => {
                        setContentType('medium');
                        setIsVisible(true);
                    }}
                >
                    <Text className="text-white text-center font-semibold">Show Medium Content</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-red-500 p-4 rounded-lg min-w-48"
                    onPress={() => {
                        setContentType('long');
                        setIsVisible(true);
                    }}
                >
                    <Text className="text-white text-center font-semibold">Show Long Content</Text>
                </TouchableOpacity>
            </View>

            <BottomSheet
                visible={isVisible}
                onClose={() => setIsVisible(false)}
                snapPoints={[0.3, 0.6, 0.9]}
                initialSnap={0}
                enablePanDownToClose={true}
                backdropOpacity={0.5}
                cornerRadius={16}
            >
                {getContent()}
            </BottomSheet>
        </View>
    );
};