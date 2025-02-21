

import ExpandableMenuItem from './ExpandableItem';
import MenuItems from './Items';
import { Portal } from '@components/Portal';
import { isNumber, transform } from "lodash";
import { useDimensions } from '@dimensions/index';
import Theme, { useTheme } from '@theme/index';
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, LayoutChangeEvent, LayoutRectangle, Pressable, PressableStateCallbackType, ScrollView, Dimensions } from 'react-native';
import { IMenuAnchorMeasurements, IMenuCalculatedPosition, IMenuPosition, IMenuProps, IUseMenuPositionProps } from './types';
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
export const useMenuPosition = ({
    menuWidth,
    menuHeight,
    padding = 0,
    position,
    responsive,
    visible,
    fullScreen: customFullScreen,
    animated,
    minWidth,
    borderRadius = 0,
    sameWidth,
    elevation: customElevation,
    preferedPositionAxis,
    anchorMeasurements,
    dynamicHeight,
}: IUseMenuPositionProps) => {
    dynamicHeight = dynamicHeight !== false;
    const theme = useTheme();
    const { width: screenWidth, isMobileOrTablet, height: screenHeight } = useDimensions();
    const fullScreen = isFullScreen(customFullScreen, responsive, isMobileOrTablet);
    // Animation values
    const opacity = useRef<Animated.Value>(new Animated.Value(animated ? 0 : 1)).current;
    const scale = useRef(new Animated.Value(animated ? 0.8 : 1)).current;
    const elevation = typeof customElevation === "number" ? customElevation : fullScreen ? 0 : 10;
    const calculatePosition = useCallback((): IMenuCalculatedPosition => {
        const isValidPosition = position && ["top", "left", "bottom", "right"].includes(String(position));
        let calculatedPosition: IMenuCalculatedPosition = {
            calculatedFromPosition: "bottom",
            xPosition: "left",
            yPosition: "top",
            left: 0,
            top: 0,
        };
        // Handle null measurements or fullscreen mode
        if (!isObj(anchorMeasurements) || !anchorMeasurements || fullScreen) {
            calculatedPosition.height = screenHeight;
            calculatedPosition.width = screenWidth;
        } else {
            const { pageX, pageY, width: anchorWidth, height: anchorHeight } = anchorMeasurements;

            minWidth = typeof minWidth == 'number' && minWidth > 0 ? minWidth : anchorWidth;
            menuHeight = !dynamicHeight ? (typeof menuHeight == 'number' && menuHeight > 0 ? menuHeight : 0) : 0;
            if (sameWidth) {
                menuWidth = anchorWidth;
            } else {
                menuWidth = Math.max(minWidth, menuWidth);
            }
            menuWidth = Math.min(menuWidth, screenWidth > padding ? screenWidth - padding : screenWidth);
            // Calculate available space in each direction
            const spaces = {
                top: pageY,
                bottom: Math.max(0, screenHeight - (pageY + anchorHeight)),
                left: pageX,
                right: Math.max(0, screenWidth - (pageX + anchorWidth)),
            };
            const isPreferedHorizontal = preferedPositionAxis == "horizontal";
            const isPreferedVertical = preferedPositionAxis == "vertical";
            const maxVerticalSpace = Math.max(spaces.top, spaces.bottom);
            const maxHorizontalSpace = Math.max(spaces.left, spaces.right);
            const isMaxVerticalSpaceTop = maxVerticalSpace === spaces.top;
            const isMaxVerticalSpaceBottom = maxVerticalSpace === spaces.bottom;
            const isMaxHorizontalSpaceLeft = maxHorizontalSpace === spaces.left;
            const isMaxHorizontalSpaceRight = maxHorizontalSpace === spaces.right;
            const hasMenuHeight = menuHeight >= 50;
            const maxHorizontalPosition = isMaxHorizontalSpaceLeft ? "left" : "right";
            const maxVerticalPosition = isMaxVerticalSpaceTop ? "top" : "bottom";
            const defaultPreferedPosition = isPreferedHorizontal ? (isMaxHorizontalSpaceLeft ? "left" : "right") : (isPreferedVertical ? (isMaxVerticalSpaceTop ? "top" : "bottom") : ((hasMenuHeight || !isMaxVerticalSpaceTop ? "bottom" : "top")));
            const spacesPos = isPreferedHorizontal ? ["left", "right"] : isPreferedVertical ? ["bottom", "top"] : ["bottom", "left", "top", "right"];
            // Find position with maximum available space
            const preferredPosition: IMenuPosition = isValidPosition && position ? position : spacesPos.reduce((max, pos) =>
                spaces[pos as IMenuPosition] > spaces[max as IMenuPosition] ? pos as IMenuPosition : max
                , defaultPreferedPosition as IMenuPosition) as IMenuPosition;
            const checkFits = (pos: IMenuCalculatedPosition) => ({
                top: isMaxVerticalSpaceTop,
                bottom: hasMenuHeight && isNumber(pos.top) && (pos.top + menuHeight <= screenHeight - padding) || isMaxVerticalSpaceBottom,// (pos.top + menuHeight <= screenHeight - padding),
                left: isMaxHorizontalSpaceLeft,//(pos.left >= padding),// && isMaxHorizontalSpaceLeft,
                right: isNumber(pos.left) && (pos.left + menuWidth <= screenWidth - padding) || isMaxHorizontalSpaceRight,// ,// && isMaxHorizontalSpaceRight,
            });
            const maxHeight = Math.max(spaces.top - 50, spaces.bottom - 50);
            const rProps: Partial<IMenuCalculatedPosition> = !dynamicHeight && maxHeight > 50 ? {
                height: maxHeight,
            } : {};
            if (sameWidth) {
                rProps.width = anchorWidth;
            }
            const positions: Record<IMenuPosition, IMenuCalculatedPosition> = {
                top: {
                    ...rProps,
                    calculatedFromPosition: "top",
                    top: undefined,// pageY - menuHeight,
                    bottom: spaces.bottom + anchorHeight,
                    left: isMaxHorizontalSpaceLeft ? undefined : pageX,
                    right: isMaxHorizontalSpaceLeft ? spaces.right : undefined,
                    yPosition: 'top',
                    xPosition: maxHorizontalPosition,
                    maxHeight: spaces.top,
                },
                bottom: {
                    ...rProps,
                    calculatedFromPosition: "bottom",
                    top: pageY + anchorHeight,
                    bottom: undefined,
                    left: isMaxHorizontalSpaceLeft ? undefined : pageX,
                    right: isMaxHorizontalSpaceLeft ? spaces.right : undefined,
                    yPosition: 'bottom',
                    xPosition: maxHorizontalPosition,
                    maxHeight: spaces.bottom,
                },
                /***
                 * in case the menu will appear on the left side
                 */
                left: {
                    ...rProps,
                    calculatedFromPosition: "left",
                    xPosition: 'left',
                    yPosition: maxVerticalPosition,
                    left: undefined,//Math.max(0, pageX + anchorWidth - padding),
                    right: spaces.right,
                    top: isMaxVerticalSpaceBottom ? (pageY + (anchorHeight)) : undefined,// - (menuHeight / 2),
                    bottom: isMaxVerticalSpaceBottom ? undefined : (spaces.bottom + anchorHeight),
                    maxHeight: isMaxVerticalSpaceBottom ? spaces.bottom : spaces.top,
                },
                right: {
                    ...rProps,
                    calculatedFromPosition: "right",
                    left: pageX,// + anchorWidth,
                    right: undefined,
                    top: isMaxVerticalSpaceBottom ? (pageY + (anchorHeight)) : undefined,// + (anchorHeight / 2),// - (menuHeight / 2),
                    bottom: isMaxVerticalSpaceBottom ? undefined : (spaces.bottom + anchorHeight),
                    xPosition: 'right',
                    yPosition: maxVerticalPosition,
                    maxHeight: isMaxVerticalSpaceBottom ? spaces.bottom : spaces.top,
                }
            };
            position = preferredPosition;
            let bestPosition = positions[preferredPosition];

            // Check if preferred position fits
            const preferredFits = checkFits(bestPosition);
            const toCheck = preferedPositionAxis == "horizontal" ? ["left", "right"] : preferedPositionAxis == "vertical" ? ["bottom", "top"] : ["bottom", "left", "top", "right"];
            // If preferred position doesn't fit, try alternatives
            if (!Object.values(preferredFits).every(fit => fit)) {
                const alternatives: IMenuPosition[] = toCheck as IMenuPosition[];
                for (const pos of alternatives) {
                    const alternative = positions[pos];
                    const altFits = checkFits(alternative);
                    if (Object.values(altFits).every(fit => fit)) {
                        bestPosition = alternative;
                        position = pos;
                        break;
                    }
                }
            }
            calculatedPosition = bestPosition;
        }
        return calculatedPosition;
    }, [anchorMeasurements?.width, anchorMeasurements?.height, anchorMeasurements?.pageX, anchorMeasurements?.pageY, sameWidth, minWidth, visible, menuWidth, menuHeight, padding, position, fullScreen, screenWidth, screenHeight]);
    const menuPosition = calculatePosition();
    useEffect(() => {
        if (animated) {
            opacity.setValue(visible ? 1 : 0);
            scale.setValue(visible ? 1 : 0.8);
        }
    }, [visible, animated]);
    const menuAnchorStyle = useMemo(() => {
        if (typeof anchorMeasurements?.width != "number") return {};
        const { width } = anchorMeasurements;
        return sameWidth ? { width } : null;//{ minWidth: width };
    }, [anchorMeasurements?.width, sameWidth]);
    // Full screen styles
    const menuContainerStyle = useMemo(() => {
        return fullScreen ? {
            width: screenWidth,
            height: screenHeight,
        } : {};
    }, [fullScreen]);
    const sizeToRemove = useMemo(() => {
        return {
            height: position === "top" ? anchorMeasurements?.height || 0 : 0,
            width: position === "right" ? anchorMeasurements?.width || 0 : 0,
        }
    }, [anchorMeasurements?.width, anchorMeasurements?.height, position, menuPosition]);
    const touchableBackdropStyle = useMemo(() => {
        return {
            maxWidth: screenWidth - (fullScreen ? 0 : Math.max(sizeToRemove.width, 10)),
            maxHeight: screenHeight - (fullScreen ? 0 : Math.max(sizeToRemove.height, 10)),
        }
    }, [menuPosition, fullScreen, screenWidth, screenHeight, sizeToRemove.width, sizeToRemove.height]);
    const { xPosition, calculatedFromPosition, yPosition, ...positionStyle } = menuPosition;
    return {
        calculatePosition,
        fullScreen,
        menuPosition,
        screenWidth,
        screenHeight,
        animatedStyle: [
            styles.menuContainer,
            fullScreen ? styles.menuContainerFullScreen : null,
            touchableBackdropStyle,
            menuAnchorStyle,
            {
                borderRadius,
                overflow: "hidden",
                ...menuContainerStyle,
            },
            typeof elevation === 'number' ? Theme.elevations[elevation] : null,
            !fullScreen && typeof borderRadius === 'number' ? { borderRadius } : null,
            {
                backgroundColor: theme.colors.surface,
                position: "absolute",
                opacity,
                transform: [{ scale }],
            },
            positionStyle,
        ],
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
    borderRadius,
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
    dynamicHeight,
    minWidth,
    preferedPositionAxis,
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
    const [anchorMeasurements, setAnchorMeasurements] = useState<IMenuAnchorMeasurements | undefined>(undefined);
    // Get position calculation from custom hook
    const { fullScreen, menuPosition, animatedStyle, screenWidth, screenHeight } = useMenuPosition({
        menuWidth: menuLayout?.width || 0,
        menuHeight: menuLayout?.height || 0,
        dynamicHeight,
        position: customPosition,
        fullScreen: customFullScreen,
        visible: isVisible,
        responsive,
        animated,
        sameWidth,
        minWidth,
        borderRadius,
        elevation,
        anchorMeasurements,
        preferedPositionAxis,
    });
    useEffect(() => {
        measureAnchor(anchorRef, (measures) => {
            setAnchorMeasurements(measures);
        });
    }, [screenWidth, screenHeight]);
    // Handle menu layout changes
    const onMenuLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        const minPadding = 30;
        if ((isNumber(menuLayout?.width) && Math.abs(width - menuLayout.width) <= minPadding) && (isNumber(menuLayout?.height) && Math.abs(height - menuLayout.height) <= minPadding)) {
            return;
        }
        setMenuLayout({ width, height, x: 0, y: 0 });
    }

    const context1 = { animated, anchorMeasurements, menuPosition, responsive, testID, borderRadius, fullScreen: fullScreen, ...props, isMenu: true, isMenuOpen, isMenuVisible: isVisible }
    const openMenu = (callback?: Function) => {
        measureAnchor(anchorRef, (measures) => {
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
        })
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



    //React.setRef(ref,context);
    const child = useMemo(() => {
        if (typeof children == 'function') {
            return children(context);
        }
        return children;
    }, [children, context, isVisible]);
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
                    measureAnchor(anchorRef, (measures) => {
                        setAnchorMeasurements(measures);
                    });
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
        {isVisible ? <Portal absoluteFill testID={testID + "-portal"}>
            <Pressable
                onPress={(e) => { closeMenu() }}
                style={[styles.portalBackdrop]}
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
                        animatedStyle,
                        props.style,
                    ]}
                >
                    <Wrapper {...wrapperProps}>
                        {items ? <MenuItems testID={testID + "-menu-items"} items={items} {...itemsProps} /> : null}
                        {child}
                    </Wrapper>
                </Animated.View>
            </MenuContext.Provider>
        </Portal> : null}
    </>
};

/***
 * It measures the anchor element and returns the measurements.
 * @param {React.RefObject<any>} anchorRef - The ref of the anchor element.
 * @param {(anchorMeasurements: IMenuAnchorMeasurements) => void} callback - The callback function to be called with the measurements.
 * @returns void
 */
export const measureAnchor = (anchorRef: React.RefObject<any>, callback?: (anchorMeasurements: IMenuAnchorMeasurements) => void) => {
    if (anchorRef?.current && typeof anchorRef.current?.measureInWindow === "function") {
        anchorRef?.current.measureInWindow((x: number, y: number, width: number, height: number) => {
            if (typeof callback === "function") callback({ pageX: x, pageY: y, width, height });
        });
    }
}

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
    animated: {
        position: 'absolute',
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


export { MenuExported as Menu };