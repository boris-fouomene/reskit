/**
 * @fileoverview  Menu Component with Auto-positioning
 * @package @your-org/dynamic-menu
 * @version 1.0.0
 */

import { Portal } from '@components/Portal';
import { getDimensions, useDimensions } from '@dimensions/index';
import { useTheme } from '@theme/index';
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, TouchableOpacity, TouchableOpacityProps, StyleSheet, Dimensions, LayoutChangeEvent, ViewStyle, LayoutRectangle, Pressable, GestureResponderEvent, PressableStateCallbackType } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { IMenuAnchorMeasurements, IMenuCalculatedPosition, IMenuPosition, IMenuProps, IUseMenuPositionProps } from './types';
import isValidElement from '@utils/isValidElement';
import { defaultStr } from '@resk/core';
import { MenuContext } from './context';
import useStateCallback from '@utils/stateCallback';
import { MenuItem } from './Item';



/**
 * Custom hook to calculate the optimal position for a menu based on the anchor element's measurements.
 * 
 * This hook takes into account the dimensions of the anchor element, the desired menu size, 
 * and optional padding to determine the best position for the menu. It also considers the 
 * screen size and whether the menu should be displayed in full-screen mode. 
 * 
 * The hook returns a function that calculates the menu's position, which can be called 
 * whenever the anchor measurements change or when the screen size is adjusted.
 * 
 * @param {IUseMenuPositionProps} props - The properties required for position calculation.
 * @returns {() => IMenuCalculatedPosition} A function that calculates and returns the menu's position.
 * 
 * @see {@link IUseMenuPositionProps} for the type definition of the props.
 * @see {@link IMenuCalculatedPosition} for the type definition of calculated position
 * 
 * @example
 * // Example usage of useMenuPosition hook
 * const MyComponent = () => {
 *     const anchorRef = useRef(null);
 *     const anchorMeasurements = anchorRef.current ? anchorRef.current.getBoundingClientRect() : null;
 *     
 *     // Define menu dimensions
 *     const menuWidth = 200;
 *     const menuHeight = 150;
 *     
 *     // Use the hook to calculate the menu position
 *     const calculateMenuPosition = useMenuPosition({
 *         anchorMeasurements,
 *         menuWidth,
 *         menuHeight,
 *         padding: 10, // Optional padding
 *         position: 'bottom', // Optional forced position
 *         responsive: true, // Enable responsive behavior
 *         fullScreen: false, // Disable full-screen mode
 *     });
 *     
 *     // Calculate the position when needed
 *     const { position, x, y } = calculateMenuPosition();
 *     
 *     return (
 *         <div>
 *             <button ref={anchorRef}>Open Menu</button>
 *             <div style={{ position: 'absolute', left: x, top: y }}>
 *                 <Menu />
 *             </div>
 *         </div>
 *     );
 * };
 */
export const useMenuPosition = ({
    anchorMeasurements,
    menuWidth,
    menuHeight,
    padding = 0,
    position,
    responsive,
    fullScreen: customFullScreen,
}: IUseMenuPositionProps) => {
    const isValidPosition = ["top", "left", "bottom", "right"].includes(String(position));
    const { width: screenWidth, isMobileOrTablet, height: screenHeight } = useDimensions(responsive === true && !isValidPosition);
    const fullScreen = isFullScreen(customFullScreen, responsive, isMobileOrTablet);
    const calculatePosition = useCallback((): IMenuCalculatedPosition => {
        // Handle null measurements or fullscreen mode
        if (!anchorMeasurements || fullScreen) {
            return {
                position: 'bottom',
                x: 0,
                y: 0,
            };
        }
        const { pageX, pageY, width, height } = anchorMeasurements;

        // Handle forced position
        if (isValidPosition && position) {
            let x = pageX;
            let y = pageY;

            // Calculate position based on forced direction
            switch (position) {
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
            x = Math.min(x, screenWidth - menuWidth);
            y = Math.min(y, screenHeight - menuHeight);

            return { position, x, y };
        }

        // Calculate available space in each direction
        const spaces = {
            top: pageY,
            bottom: screenHeight - (pageY + height),
            left: pageX,
            right: screenWidth - (pageX + width),
        };

        // Find position with maximum available space
        const bestPosition = Object.entries(spaces).reduce((max, [pos, space]) =>
            space > spaces[max as IMenuPosition] ? pos as IMenuPosition : max
            , 'bottom' as IMenuPosition);

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
        x = Math.min(x, screenWidth - menuWidth);
        y = Math.min(y, screenHeight - menuHeight);
        return { position: bestPosition, x, y };
    }, [anchorMeasurements, menuWidth, menuHeight, padding, position, fullScreen, screenWidth, screenHeight]);

    return calculatePosition;
};

const isFullScreen = (fullScreen?: boolean, responsive?: boolean, isMobileOrTablet?: boolean) => {
    return !!fullScreen || responsive === true && !!isMobileOrTablet;
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
 *       fullScreen={true}
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
 *       position="right"
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
const Menu: React.FC<IMenuProps> = ({
    onClose,
    children,
    animated = true,
    anchor: customAnchor,
    position,
    fullScreen,
    borderRadius = 8,
    anchorContainerProps,
    onOpen,
    testID,
    onLayout,
    beforeToggle,
    responsive,
    ...props
}) => {
    // State for measurements
    const theme = useTheme();
    const [isVisible, setIsVisible] = useStateCallback<boolean>(false);
    const [anchorMeasurements, setAnchorMeasurements] = useState<IMenuAnchorMeasurements | null>(null);
    const [menuLayout, setMenuLayout] = useState<LayoutRectangle | null>(null);
    const anchorRef = useRef<View>(null);
    anchorContainerProps = Object.assign({}, anchorContainerProps);
    testID = defaultStr(testID, "rn-menu");
    // Animation values
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);


    const isOpen = () => isVisible;
    // Measure anchor element position
    const measureAnchor = useCallback(() => {
        if (anchorRef.current) {
            anchorRef.current.measureInWindow((x, y, width, height) => {
                setAnchorMeasurements({ pageX: x, pageY: y, width, height });
            });
        }
    }, [anchorRef]);

    // Handle menu layout changes
    const onMenuLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setMenuLayout({ width, height, x: 0, y: 0 });
    }, []);
    const { isMobileOrTablet, width: screenWidth, height: screenHeight } = getDimensions();
    const _isFullScreen = isFullScreen(fullScreen, responsive, isMobileOrTablet);
    // Get position calculation from custom hook
    const calculatePosition = useMenuPosition({
        anchorMeasurements,
        menuWidth: menuLayout?.width || 0,
        menuHeight: menuLayout?.height || 0,
        position,
        fullScreen,
        responsive,
    });
    const context1 = { animated, responsive, testID, borderRadius, fullScreen: _isFullScreen, ...props, isOpen, visible: isVisible, calculatePosition }
    const openMenu = (callback?: Function) => {
        if (typeof beforeToggle === 'function' && beforeToggle(Object.assign(context1, { openMenu, closeMenu })) === false) return;
        setIsVisible(true, () => {
            if (typeof callback === "function") {
                callback();
            }
            if (typeof onOpen === "function") {
                onOpen();
            }
        });
    };
    const closeMenu = (callback?: Function) => {
        if (typeof beforeToggle === 'function' && beforeToggle(Object.assign(context1, { openMenu, closeMenu })) === false) return;
        setIsVisible(false, () => {
            if (typeof callback === "function") {
                callback();
            }
            if (typeof onClose === "function") {
                onClose();
            }
        });
    };
    const context = { ...context1, visible: isVisible, isOpen, openMenu, closeMenu };
    const anchor = useMemo(() => {
        if (typeof customAnchor === 'function') {
            return (state: PressableStateCallbackType) => {
                const a = customAnchor({ ...state, ...context });
                if (!isValidElement(a)) return null;
                return a;
            }
        }
        return isValidElement(customAnchor) ? customAnchor : null;
    }, [customAnchor, calculatePosition, isVisible]);
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
    const menuContainerStyle = _isFullScreen ? {
        width: screenWidth,
        height: screenHeight,
    } : {};

    //React.setRef(ref,context);
    const child = useMemo(() => {
        if (typeof children == 'function') {
            return children(context);
        }
        return children;
    }, [children, context, isVisible]);
    return <>
        <MenuContext.Provider value={context}>
            <Pressable testID={testID + "-anchor-container"} ref={anchorRef} {...anchorContainerProps} onPress={(event) => {
                if (typeof anchorContainerProps?.onPress === 'function') {
                    anchorContainerProps?.onPress(event)
                }
                openMenu();
            }}>
                {anchor}
            </Pressable>
        </MenuContext.Provider>
        {isVisible ? <Portal absoluteFill>
            <Pressable
                onPress={(e) => { closeMenu() }}
                style={styles.portalBackdrop}
            />
            <MenuContext.Provider value={context}>
                <Animated.View
                    testID={testID}
                    {...props}
                    onLayout={(event) => {
                        if (typeof onLayout === 'function') {
                            onLayout(event);
                        }
                        onMenuLayout(event);
                    }}
                    style={[
                        styles.menuContainer,
                        { backgroundColor: theme.colors.surface },
                        {
                            borderRadius,
                            ...menuContainerStyle,
                        },
                        props.style,
                        animatedStyle,
                    ]}
                >
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <> {child}</>
                    </TouchableOpacity>
                </Animated.View>
            </MenuContext.Provider>
        </Portal> : null}
    </>
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

type IMenu = typeof Menu & {
    Item: typeof MenuItem;
};
export * from "./context";
export * from "./types";

const MenuWithItem = Menu as unknown as IMenu;
MenuWithItem.Item = MenuItem;
MenuWithItem.displayName = 'Menu.Item';
MenuWithItem.displayName = 'Menu';

export { MenuWithItem as Menu, MenuItem };