

import ExpandableMenuItem from './ExpandableItem';
import MenuItems from './Items';
import { Portal } from '@components/Portal';
import { getDimensions, useDimensions } from '@dimensions/index';
import Theme, { useTheme } from '@theme/index';
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, TouchableOpacity, TouchableOpacityProps, StyleSheet, Dimensions, LayoutChangeEvent, ViewStyle, LayoutRectangle, Pressable, GestureResponderEvent, PressableStateCallbackType, ScrollView } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { IMenuAnchorMeasurements, IMenuCalculatedPosition, IMenuContext, IMenuPosition, IMenuProps, IUseMenuPositionProps } from './types';
import isValidElement from '@utils/isValidElement';
import { defaultStr, isObj } from '@resk/core';
import { MenuContext } from './context';
import useStateCallback from '@utils/stateCallback';
import { MenuItem } from './Item';
import usePrevious from '@utils/usePrevious';



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
export const useMenuPosition = (anchorRef: React.RefObject<any>, {
    menuWidth,
    menuHeight,
    padding = 0,
    position,
    responsive,
    visible,
    fullScreen: customFullScreen,
    animated,
    minWidth,
    sameWidth,
}: IUseMenuPositionProps) => {
    const isValidPosition = position && ["top", "left", "bottom", "right"].includes(String(position));
    const { width: screenWidth, isMobileOrTablet, height: screenHeight } = useDimensions(responsive !== false);
    const fullScreen = isFullScreen(customFullScreen, responsive, isMobileOrTablet);
    const anchorMeasurementsRef = useRef<IMenuAnchorMeasurements | null>(null);
    // Animation values
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const xAnimation = useSharedValue(0);
    const yAnimation = useSharedValue(0);
    const calculatedPositionRef = useRef<IMenuCalculatedPosition | null>(null);
    const calculatePosition = useCallback((): IMenuCalculatedPosition => {
        let x = 0, y = 0;
        // Handle null measurements or fullscreen mode
        if (!isObj(anchorMeasurementsRef.current) || !anchorMeasurementsRef.current || fullScreen) {
            position = "top";
        } else {
            const { pageX, pageY, width: anchorWidth, height: anchorHeight } = anchorMeasurementsRef.current;
            minWidth = typeof minWidth == 'number' && minWidth > 0 ? minWidth : anchorWidth;
            if (sameWidth) {
                menuWidth = anchorWidth;
            } else {
                menuWidth = Math.max(minWidth, menuWidth);
            }
            menuWidth = Math.min(menuWidth, screenWidth > padding ? screenWidth - padding : screenWidth);
            x = pageX;
            y = pageY;
            // Calculate available space in each direction
            const spaces = {
                top: pageY,
                bottom: Math.max(0, screenHeight - (pageY + anchorHeight)),
                left: pageX,
                right: Math.max(0, screenWidth - (pageX + anchorWidth)),
            };
            // Find position with maximum available space
            let preferredPosition: IMenuPosition = isValidPosition && position ? position : Object.entries(spaces).reduce((max, [pos, space]) =>
                space > spaces[max as IMenuPosition] ? pos as IMenuPosition : max
                , 'bottom' as IMenuPosition) as IMenuPosition;
            if (!isValidPosition && preferredPosition !== 'bottom' && (spaces.bottom >= 300 || (Math.abs(spaces.bottom - spaces[preferredPosition]) < 100))) {
                preferredPosition = 'bottom';
            };
            const checkFits = (pos: IPosition) => ({
                top: pos.top >= padding,
                bottom: pos.top + menuHeight <= screenHeight - padding,
                left: pos.left >= padding,
                right: pos.left + menuWidth <= screenWidth - padding
            });
            const positions: Record<IMenuPosition, IPosition> = {
                top: {
                    top: pageY - menuHeight,
                    left: pageX + (anchorWidth / 2),// - (menuWidth / 2),
                    position: 'top'
                },
                bottom: {
                    top: pageY + anchorHeight,
                    left: pageX + (anchorWidth / 2),// - (menuWidth / 2),
                    position: 'bottom'
                },
                left: {
                    top: pageY + (anchorHeight / 2),// - (menuHeight / 2),
                    left: pageX - menuWidth,
                    position: 'left'
                },
                right: {
                    top: pageY + (anchorHeight / 2),// - (menuHeight / 2),
                    left: pageX + anchorWidth,
                    position: 'right'
                }
            };
            position = preferredPosition;
            let bestPosition = positions[preferredPosition];

            // Check if preferred position fits
            const preferredFits = checkFits(bestPosition);
            // If preferred position doesn't fit, try alternatives
            if (preferredPosition !== 'bottom' && !Object.values(preferredFits).every(fit => fit)) {
                const alternatives: IMenuPosition[] = ['bottom', 'top', 'right', 'left'];
                for (const pos of alternatives) {
                    const alternative = positions[pos];
                    const altFits = checkFits(alternative);
                    if (Object.values(altFits).every(fit => fit)) {
                        bestPosition = alternative;
                        break;
                    }
                }
            }
            // Final boundary adjustments
            bestPosition.left = Math.max(
                padding,
                Math.min(screenWidth - menuWidth - padding, bestPosition.left)
            );
            bestPosition.top = Math.max(
                padding,
                Math.min(screenHeight - menuHeight - padding, bestPosition.top)
            );
            x = bestPosition.left;
            y = bestPosition.top;
            position = bestPosition.position;
        }
        // Update position when measurements change
        if (animated !== false) {
            xAnimation.value = withSpring(x);
            yAnimation.value = withSpring(y);
            opacity.value = withTiming(1, {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
            scale.value = withSpring(1);
        } else {
            xAnimation.value = x;
            xAnimation.value = y;
            opacity.value = 1;
            scale.value = 1;
        }
        calculatedPositionRef.current = { position, x, y, menuWidth };
        return calculatedPositionRef.current;
    }, [anchorMeasurementsRef.current, sameWidth, minWidth, visible, menuWidth, menuHeight, padding, position, fullScreen, screenWidth, screenHeight, anchorRef?.current]);
    const measureAnchor = useCallback((callback?: (anchorMeasurements: IMenuAnchorMeasurements) => void) => {
        if (anchorRef?.current && typeof anchorRef.current?.measureInWindow === "function") {
            anchorRef?.current.measureInWindow((x: number, y: number, width: number, height: number) => {
                const measures = { pageX: x, pageY: y, width, height };
                anchorMeasurementsRef.current = measures;
                calculatePosition();
                if (typeof callback === "function") callback(measures);
            });
        }
    }, [anchorRef?.current, screenWidth, screenHeight]);
    useEffect(() => {
        if (visible === false && animated) {
            opacity.value = withTiming(0);
            scale.value = withTiming(0.8);
        }
    }, [visible, animated]);
    // Animated styles
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        left: xAnimation.value,
        top: yAnimation.value,
        transform: [
            { scale: scale.value },
        ],
    }));
    return {
        calculatePosition,
        measureAnchor,
        fullScreen,
        animatedStyle,
        get anchorMeasurements() {
            return anchorMeasurementsRef.current;
        },
    };
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
    position: customPosition,
    fullScreen: customFullScreen,
    borderRadius = 8,
    anchorContainerProps,
    onOpen,
    testID,
    onLayout,
    beforeToggle,
    responsive,
    items,
    itemsProps,
    sameWidth,
    withScrollView = true,
    scrollViewProps,
    elevation = 10,
    visible,
    minWidth,
    ...props
}) => {
    // State for measurements
    const theme = useTheme();
    const isControlled = useMemo(() => typeof visible == "boolean", [visible]);
    const [isVisible, setIsVisible] = useStateCallback<boolean>(isControlled ? !!visible : false);
    const prevIsVisible = usePrevious(isVisible);
    const [menuLayout, setMenuLayout] = useState<LayoutRectangle | null>(null);
    const anchorRef = useRef<View>(null);
    anchorContainerProps = Object.assign({}, anchorContainerProps);
    testID = defaultStr(testID, "resk-menu");
    itemsProps = Object.assign({}, itemsProps);
    const callbackRef = useRef<Function | null | undefined>(null);
    useEffect(() => {
        if (!isControlled || prevIsVisible === isVisible || typeof callbackRef.current !== "function") {
            return;
        }
        if (typeof callbackRef.current === "function") {
            callbackRef.current();
        }
    }, [visible, isVisible, isControlled, callbackRef, prevIsVisible]);
    callbackRef.current = null;
    const isMenuOpen = () => isVisible;
    useEffect(() => {
        if (isControlled && isVisible !== visible) {
            setIsVisible(!!visible);
        }
    }, [visible, isVisible, isControlled]);
    const { width: screenWidth, height: screenHeight } = getDimensions();
    // Get position calculation from custom hook
    const { calculatePosition, fullScreen, anchorMeasurements, measureAnchor, animatedStyle } = useMenuPosition(anchorRef, {
        menuWidth: menuLayout?.width || 0,
        menuHeight: menuLayout?.height || 0,
        position: customPosition,
        fullScreen: customFullScreen,
        visible: isVisible,
        responsive,
        animated,
        sameWidth,
        minWidth,
    });
    const menuPosition = calculatePosition();
    const { position } = menuPosition;
    // Handle menu layout changes
    const onMenuLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setMenuLayout({ width, height, x: 0, y: 0 });
    }
    const context1 = { animated, anchorMeasurements, menuPosition, responsive, testID, borderRadius, fullScreen: fullScreen, ...props, isMenu: true, isMenuOpen, isMenuVisible: isVisible }
    const openMenu = (callback?: Function) => {
        measureAnchor((measures) => {
            if (typeof beforeToggle === 'function' && beforeToggle(Object.assign(context1, { openMenu, closeMenu })) === false) return;
            if (isControlled) {
                callbackRef.current = callback;
                if (typeof onOpen === "function") {
                    onOpen();
                }
                return;
            }
            setIsVisible(true, () => {
                if (typeof callback === "function") {
                    callback();
                }
                if (typeof onOpen === "function") {
                    onOpen();
                }
            });
        });
    };
    const closeMenu = (callback?: Function) => {
        if (typeof beforeToggle === 'function' && beforeToggle(Object.assign(context1, { openMenu, closeMenu })) === false) return;
        if (isControlled) {
            callbackRef.current = callback;
            if (typeof onClose === "function") {
                onClose();
            }
            return;
        }
        setIsVisible(false, () => {
            if (typeof callback === "function") {
                callback();
            }
            if (typeof onClose === "function") {
                onClose();
            }
        });
    };
    const context = { ...context1, isMenuVisible: isVisible, isMenuOpen, openMenu, closeMenu };
    const anchor = useMemo(() => {
        if (typeof customAnchor === 'function') {
            return (state: PressableStateCallbackType) => {
                const a = customAnchor({ ...state, ...context });
                if (!isValidElement(a)) return null;
                return a;
            }
        }
        return isValidElement(customAnchor) ? customAnchor : null;
    }, [customAnchor, isVisible, fullScreen, context]);
    // Full screen styles
    const menuContainerStyle = useMemo(() => {
        return fullScreen ? {
            width: screenWidth,
            height: screenHeight,
        } : {};
    }, [fullScreen, menuLayout?.height]);
    const menuAnchorStyle = useMemo(() => {
        if (typeof anchorMeasurements?.width != "number") return {};
        const { width } = anchorMeasurements;
        return sameWidth ? { width } : null;//{ minWidth: width };
    }, [anchorMeasurements?.width, sameWidth]);

    //React.setRef(ref,context);
    const child = useMemo(() => {
        if (typeof children == 'function') {
            return children(context);
        }
        return children;
    }, [children, context, isVisible]);
    const sizeToRemove = useMemo(() => {
        return {
            height: position === "top" ? anchorMeasurements?.height || 0 : 0,
            width: position === "right" ? anchorMeasurements?.width || 0 : 0,
        }
    }, [anchorMeasurements?.width, anchorMeasurements?.height, position, menuLayout]);
    const touchableBackdropStyle = useMemo(() => {
        return {
            maxWidth: screenWidth - (fullScreen ? 0 : Math.max(sizeToRemove.width, 10)),
            maxHeight: screenHeight - (fullScreen ? 0 : Math.max(sizeToRemove.height, 10)),
        }
    }, [menuLayout, fullScreen, screenWidth, screenHeight, sizeToRemove.width, sizeToRemove.height]);
    const { Wrapper, wrapperProps } = useMemo(() => {
        if (!withScrollView) {
            return { Wrapper: React.Fragment, wrapperProps: {} }
        }
        return {
            Wrapper: ScrollView,
            wrapperProps: Object.assign({}, { testID: testID + "-scroll-view" }, scrollViewProps)
        }
    }, [withScrollView, testID, scrollViewProps]);
    return <>
        <MenuContext.Provider value={context}>
            <Pressable testID={testID + "-anchor-container"}
                ref={anchorRef}
                {...anchorContainerProps}
                style={(state) => {
                    return [Theme.styles.relative, typeof anchorContainerProps?.style === 'function' ? anchorContainerProps?.style(state) : anchorContainerProps?.style];
                }}
                onLayout={(event) => {
                    if (typeof anchorContainerProps?.onLayout === 'function') {
                        anchorContainerProps?.onLayout(event);
                    }
                    measureAnchor();
                }}
                onPress={(event) => {
                    if (typeof anchorContainerProps?.onPress === 'function') {
                        anchorContainerProps?.onPress(event)
                    }
                    openMenu();
                }}>
                {anchor}
            </Pressable>
        </MenuContext.Provider>
        {<Portal absoluteFill visible={isVisible}>
            <Pressable
                onPress={(e) => { closeMenu() }}
                style={styles.portalBackdrop}
                testID={testID + "-menu-backdrop"}
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
                        fullScreen ? styles.menuContainerFullScreen : null,
                        menuAnchorStyle,
                        {
                            borderRadius,
                            ...menuContainerStyle,
                        },
                        typeof elevation === 'number' ? Theme.elevations[elevation] : null,
                        props.style,
                        touchableBackdropStyle,
                        animatedStyle,
                    ]}
                >
                    <Wrapper {...wrapperProps}>
                        {items ? <MenuItems testID={testID + "-menu-items"} items={items} {...itemsProps} /> : null}
                        {child}
                    </Wrapper>
                </Animated.View>
            </MenuContext.Provider>
        </Portal>}
    </>
};

/**
 * Default styles for the menu container
 */
const styles = StyleSheet.create({
    portalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "flex-start",
    },
    menuContainer: {
        position: 'absolute',
        paddingVertical: 10,
        paddingHorizontal: 2,
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        maxHeight: '100%',
        maxWidth: '100%',
    },
    menuContainerFullScreen: {
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
});

export * from "./context";
export * from "./types";
export * from "./utils";


/**
 * Type definition for a Menu component that includes nested Item components,
 * a collection of items, and expandable items. This type extends the base
 * Menu component type to provide a structured API for rendering menus and
 * their various item types.
 *
 * @type IMenu
 * @extends {typeof Menu} - Inherits the properties and methods of the base Menu component.
 * 
 * @property {typeof MenuItem} Item - A reference to the MenuItem component,
 * allowing it to be used as a nested component within the Menu.
 *
 * @property {typeof MenuItems} Items - A reference to the MenuItems component,
 * which can be used to render a collection of menu items.
 *
 * @property {typeof ExpandableMenuItem} ExpandableItem - A reference to the
 * ExpandableMenuItem component, allowing for items that can expand to show
 * additional content.
 */
type IMenu = typeof Menu & {
    Item: typeof MenuItem;
    Items: typeof MenuItems;
    ExpandableItem: typeof ExpandableMenuItem;
};

/**
 * Enhances the Menu component by adding references to Item, Items, and
 * ExpandableItem components. This allows developers to use the Menu in a
 * structured way, improving the organization of the code and the clarity
 * of the API.
 *
 * The MenuExported constant is created by casting the Menu to the IMenu type,
 * and then the Item, Items, and ExpandableItem properties are assigned to
 * their respective components. The displayName properties are set for better
 * debugging and identification in React DevTools.
 */
const MenuExported = Menu as unknown as IMenu;
MenuExported.Item = MenuItem;
MenuExported.displayName = 'Menu.Item';
MenuExported.displayName = 'Menu';

MenuExported.Items = MenuItems;
MenuExported.Items.displayName = 'Menu.Items';

MenuExported.ExpandableItem = ExpandableMenuItem;
MenuExported.ExpandableItem.displayName = 'Menu.ExpandableItem';

interface IPosition {
    top: number;
    left: number;
    position: IMenuPosition;
}

export { MenuExported as Menu };