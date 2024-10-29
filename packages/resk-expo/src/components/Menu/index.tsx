/**
 * @fileoverview  Menu Component with Auto-positioning
 * @package @your-org/dynamic-menu
 * @version 1.0.0
 */

import { Portal } from '@components/Portal';
import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, TouchableOpacityProps, StyleSheet, Dimensions, LayoutChangeEvent, ViewStyle, LayoutRectangle, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';

/**
 * Represents the possible positions where the menu can be displayed
 * relative to its anchor element.
 * 
 * @enum {string}
 */
type Position = 'top' | 'bottom' | 'left' | 'right';

/**
 * Measurements of the anchor element's position and size
 * 
 * @interface AnchorMeasurements
 * @property {number} pageX - X coordinate relative to the window
 * @property {number} pageY - Y coordinate relative to the window
 * @property {number} width - Width of the anchor element
 * @property {number} height - Height of the anchor element
 */
type AnchorMeasurements = {
    pageX: number;
    pageY: number;
    width: number;
    height: number;
};

/**
 * Result of position calculations containing the final position and coordinates
 * 
 * @interface MenuPosition
 * @property {Position} position - The calculated position of the menu
 * @property {number} x - Final X coordinate
 * @property {number} y - Final Y coordinate
 */
interface MenuPosition {
    position: Position;
    x: number;
    y: number;
}

/**
 * Props for the useMenuPosition hook
 * 
 * @interface UseMenuPositionProps
 */
interface UseMenuPositionProps {
    /** Measurements of the anchor element */
    anchorMeasurements: AnchorMeasurements | null;
    /** Current width of the menu */
    menuWidth: number;
    /** Current height of the menu */
    menuHeight: number;
    /** Padding between menu and anchor */
    padding?: number;
    /** Force menu to specific position */
    forcePosition?: Position;
    /** Enable full-screen mode */
    isFullScreen?: boolean;
    /** Padding from screen edges */
    screenPadding?: number;
}

/**
 * Custom hook for calculating menu position based on anchor and screen constraints
 * 
 * @param {UseMenuPositionProps} props - Configuration properties
 * @returns {Function} Callback function that returns menu position calculations
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const calculatePosition = useMenuPosition({
 *     anchorMeasurements: { pageX: 100, pageY: 100, width: 50, height: 50 },
 *     menuWidth: 200,
 *     menuHeight: 300,
 *     padding: 8,
 *   });
 * 
 *   const { position, x, y } = calculatePosition();
 *   // Use the calculated position...
 * }
 * ```
 */
export const useMenuPosition = ({
    anchorMeasurements,
    menuWidth,
    menuHeight,
    padding = 0,
    forcePosition,
    isFullScreen,
    screenPadding = 16,
}: UseMenuPositionProps) => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    const calculatePosition = useCallback((): MenuPosition => {
        // Handle null measurements or fullscreen mode
        if (!anchorMeasurements || isFullScreen) {
            return {
                position: 'bottom',
                x: screenPadding,
                y: isFullScreen ? screenPadding : 0,
            };
        }
        const { pageX, pageY, width, height } = anchorMeasurements;

        // Handle forced position
        if (forcePosition) {
            let x = pageX;
            let y = pageY;

            // Calculate position based on forced direction
            switch (forcePosition) {
                case 'top':
                    x = pageX //+ width / 2 - menuWidth / 2;
                    y = pageY - menuHeight - padding;
                    break;
                case 'bottom':
                    x = pageX //+ width / 2 - menuWidth / 2;
                    y = pageY + height + padding;
                    break;
                case 'left':
                    x = pageX - menuWidth - padding;
                    y = pageY + height / 2 - menuHeight / 2;
                    break;
                case 'right':
                    x = pageX + width + padding;
                    y = pageY + height / 2 - menuHeight / 2;
                    break;
            }
            // Ensure menu stays within screen bounds
            //x = Math.max(screenPadding, Math.min(x, screenWidth - menuWidth - screenPadding));
            //y = Math.max(screenPadding, Math.min(y, screenHeight - menuHeight - screenPadding));

            return { position: forcePosition, x, y };
        }

        // Calculate available space in each direction
        const spaces = {
            top: pageY - screenPadding,
            bottom: screenHeight - (pageY + height + screenPadding),
            left: pageX - screenPadding,
            right: screenWidth - (pageX + width + screenPadding),
        };

        // Find position with maximum available space
        const bestPosition = Object.entries(spaces).reduce((max, [pos, space]) =>
            space > spaces[max as Position] ? pos as Position : max
            , 'bottom' as Position);

        // Calculate final coordinates
        let x = pageX;
        let y = pageY;
        switch (bestPosition) {
            case 'top':
                x = pageX //+ width / 2 - menuWidth / 2;
                y = pageY - menuHeight - padding;
                break;
            case 'bottom':
                x = pageX //+ width / 2 - menuWidth / 2;
                y = pageY + height + padding;
                break;
            case 'left':
                x = pageX - menuWidth - padding;
                y = pageY //+ height / 2 - menuHeight / 2;
                break;
            case 'right':
                x = pageX + width + padding;
                y = pageY //+ height / 2 - menuHeight / 2;
                break;
        }

        // Ensure menu stays within screen bounds
        x = Math.max(screenPadding, Math.min(x, screenWidth - menuWidth - screenPadding));
        y = Math.max(screenPadding, Math.min(y, screenHeight - menuHeight - screenPadding));
        return { position: bestPosition, x, y };
    }, [anchorMeasurements, menuWidth, menuHeight, padding, forcePosition, isFullScreen, screenWidth, screenHeight]);

    return calculatePosition;
};

/**
 * Props for the Menu component
 * 
 * @interface MenuProps
 */
interface MenuProps {
    /** Controls menu visibility */
    isVisible: boolean;
    /** Reference to the anchor element */
    anchor: React.RefObject<View>;
    /** Callback when menu should close */
    onClose: () => void;
    /** Menu content */
    children: React.ReactNode;
    /** Style for the menu container */
    menuStyle?: ViewStyle;
    /** Enable/disable animations */
    animated?: boolean;
    /** Force menu to specific position */
    forcePosition?: Position;
    /** Enable full-screen mode */
    isFullScreen?: boolean;
    /** Padding from screen edges */
    screenPadding?: number;
    /** Border radius of the menu */
    borderRadius?: number;
}

/**
 * Menu Component
 * 
 * A flexible menu component that automatically positions itself around an anchor element,
 * with support for animations, full-screen mode, and custom styling.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic Usage
 * const BasicExample = () => {
 *   const [menuVisible, setMenuVisible] = useState(false);
 *   const anchorRef = useRef<View>(null);
 * 
 *   return (
 *     <View>
 *       <TouchableOpacity ref={anchorRef} onPress={() => setMenuVisible(true)}>
 *         <Text>Open Menu</Text>
 *       </TouchableOpacity>
 * 
 *       <Menu
 *         isVisible={menuVisible}
 *         anchor={anchorRef}
 *         onClose={() => setMenuVisible(false)}
 *       >
 *         <View style={{ padding: 16 }}>
 *           <Text>Menu Content</Text>
 *         </View>
 *       </Menu>
 *     </View>
 *   );
 * };
 * 
 * // Full Screen Example
 * const FullScreenExample = () => {
 *   const [menuVisible, setMenuVisible] = useState(false);
 *   const anchorRef = useRef<View>(null);
 * 
 *   return (
 *     <Menu
 *       isVisible={menuVisible}
 *       anchor={anchorRef}
 *       onClose={() => setMenuVisible(false)}
 *       isFullScreen={true}
 *       menuStyle={{
 *         backgroundColor: '#fff',
 *         padding: 20,
 *       }}
 *     >
 *       <ScrollView>
 *         <Text>Full Screen Content</Text>
 *       </ScrollView>
 *     </Menu>
 *   );
 * };
 * 
 * // Custom Positioned Example
 * const CustomPositionExample = () => {
 *   const [menuVisible, setMenuVisible] = useState(false);
 *   const anchorRef = useRef<View>(null);
 * 
 *   return (
 *     <Menu
 *       isVisible={menuVisible}
 *       anchor={anchorRef}
 *       onClose={() => setMenuVisible(false)}
 *       forcePosition="right"
 *       animated={false}
 *       borderRadius={0}
 *     >
 *       <View style={{ padding: 16 }}>
 *         <Text>Right-aligned Menu</Text>
 *       </View>
 *     </Menu>
 *   );
 * };
 * ```
 */
export const Menu: React.FC<MenuProps> = ({
    isVisible,
    anchor,
    onClose,
    children,
    menuStyle,
    animated = true,
    forcePosition,
    isFullScreen = false,
    screenPadding = 16,
    borderRadius = 8,
}) => {
    // State for measurements
    const [anchorMeasurements, setAnchorMeasurements] = useState<AnchorMeasurements | null>(null);
    const [menuLayout, setMenuLayout] = useState<LayoutRectangle | null>(null);

    // Animation values
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);

    // Measure anchor element position
    const measureAnchor = useCallback(() => {
        if (anchor.current) {
            anchor.current.measureInWindow((x, y, width, height) => {
                setAnchorMeasurements({ pageX: x, pageY: y, width, height });
            });
        }
    }, [anchor]);

    // Handle menu layout changes
    const onMenuLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setMenuLayout({ width, height, x: 0, y: 0 });
    }, []);

    // Get position calculation from custom hook
    const calculatePosition = useMenuPosition({
        anchorMeasurements,
        menuWidth: menuLayout?.width || 0,
        menuHeight: menuLayout?.height || 0,
        forcePosition,
        isFullScreen,
        screenPadding,
    });

    // Update position when visibility changes
    useEffect(() => {
        if (isVisible) {
            measureAnchor();
        }
    }, [isVisible, measureAnchor]);

    // Update position when measurements change
    useEffect(() => {
        if (anchorMeasurements && menuLayout) {
            const { x, y } = calculatePosition();

            if (animated) {
                translateX.value = withSpring(x);
                translateY.value = withSpring(y);
                opacity.value = withTiming(1, {
                    duration: 200,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
                scale.value = withSpring(1);
            } else {
                translateX.value = x;
                translateY.value = y;
                opacity.value = 1;
                scale.value = 1;
            }
        }
    }, [anchorMeasurements, menuLayout]);

    // Handle closing animations
    useEffect(() => {
        if (!isVisible && animated) {
            opacity.value = withTiming(0);
            scale.value = withTiming(0.8);
        }
    }, [isVisible]);

    // Animated styles
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    // Full screen styles
    const menuContainerStyle = isFullScreen ? {
        width: Dimensions.get('window').width - (screenPadding * 2),
        height: Dimensions.get('window').height - (screenPadding * 2),
    } : {};

    if (!isVisible) return null;

    return (
        <Portal absoluteFill>
            <Pressable
                onPress={onClose}
                style={styles.portalBackdrop}
            />
            <Animated.View
                onLayout={onMenuLayout}
                style={[
                    styles.menuContainer,
                    {
                        borderRadius,
                        ...menuContainerStyle,
                    },
                    menuStyle,
                    animatedStyle,
                ]}
            >
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                    {children}
                </TouchableOpacity>
            </Animated.View>
        </Portal>
    );
};

/**
 * Default styles for the menu container
 */
const styles = StyleSheet.create({
    portalContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "flex-start",
    },
    portalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "flex-start",
    },
    menuContainer: {
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});