

import ExpandableMenuItem, { ExpandableItem } from './ExpandableItem';
import MenuItems from './Items';
import { Portal } from '@components/Portal';
import { useDimensions } from '@dimensions/index';
import Theme, { useTheme } from '@theme/index';
import { useEffect, useState, useCallback, useRef, useMemo, Fragment, RefObject } from 'react';
import { View, Animated, StyleSheet, LayoutChangeEvent, LayoutRectangle, Pressable, PressableStateCallbackType, ScrollView, Easing } from 'react-native';
import { IMenuAnchorMeasurements, IMenuCalculatedPosition, IMenuContext, IMenuPosition, IMenuProps, IUseMenuPositionProps } from './types';
import isValidElement from '@utils/isValidElement';
import { defaultStr, isObj } from '@resk/core';
import { MenuContext } from './context';
import useStateCallback from '@utils/stateCallback';
import { MenuItem } from './Item';
import { measureContentHeight } from '@components/BottomSheet/measureContentHeight';
import { Icon } from '@components/Icon';
import { useI18n } from '@src/i18n';
import usePrevious from '@utils/usePrevious';
import { usePrepareBottomSheet } from '@components/BottomSheet/utils';
import { KeyboardAvoidingView } from '@components/KeyboardAvoidingView';
import { Label } from '@components/Label';
import { Divider } from '@components/Divider';
import { defaultNumber, isNumber } from "@resk/core/utils";

const useNativeDriver = false;

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
 */
export const useMenuPosition = ({
    menuWidth,
    menuHeight,
    padding = 0,
    position,
    responsive,
    visible,
    fullScreen: customFullScreen,
    minWidth,
    borderRadius = 0,
    sameWidth,
    elevation: customElevation,
    preferedPositionAxis,
    anchorMeasurements,
    maxHeight: customMaxHeight,
    dynamicHeight,
}: IUseMenuPositionProps) => {
    dynamicHeight = dynamicHeight !== false;
    const theme = useTheme();
    const { width: screenWidth, isMobileOrTablet, height: screenHeight } = useDimensions();
    const fullScreen = isFullScreen(customFullScreen, responsive, isMobileOrTablet);
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
            const { pageX: pX, pageY: pY, width: anchorWidth, height: anchorHeight } = anchorMeasurements;
            const pageX = Math.max(0, pX), pageY = Math.max(0, pY);
            minWidth = typeof minWidth == 'number' && minWidth > 0 ? minWidth : anchorWidth;
            if (anchorWidth <= screenWidth - pageX) {
                minWidth = Math.max(minWidth, anchorWidth);
            }
            menuHeight = !dynamicHeight ? (typeof menuHeight == 'number' && menuHeight > 0 ? menuHeight : 0) : 0;
            const minMenuWidth = Math.max(minWidth, anchorWidth);
            if (sameWidth) {
                menuWidth = Math.max(minWidth, anchorWidth);
            } else {
                menuWidth = Math.max(minWidth, menuWidth);
            }
            menuWidth = Math.max(minWidth, Math.min(menuWidth, screenWidth > padding ? screenWidth - padding : screenWidth));
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
            const canUseAnchorSpace = menuWidth <= spaces.right + anchorWidth;
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
            let maxHeight = Math.max(spaces.top - 50, spaces.bottom - 50);
            if ((isNumber(customMaxHeight))) {
                if (customMaxHeight >= screenHeight * 0.45) {
                    maxHeight = Math.min(customMaxHeight, maxHeight);
                } else if (customMaxHeight < 200) {
                    maxHeight = customMaxHeight;
                }
            }
            const rProps: Partial<IMenuCalculatedPosition> = !dynamicHeight && maxHeight > 50 ? {
                height: maxHeight,
            } : {};
            if (sameWidth) {
                rProps.width = minMenuWidth;
            }
            const positions: Record<IMenuPosition, IMenuCalculatedPosition> = {
                top: {
                    ...rProps,
                    calculatedFromPosition: "top",
                    top: undefined,// pageY - menuHeight,
                    bottom: spaces.bottom + anchorHeight,
                    left: canUseAnchorSpace ? pageX : isMaxHorizontalSpaceLeft ? undefined : pageX,
                    right: canUseAnchorSpace ? undefined : isMaxHorizontalSpaceLeft ? spaces.right : undefined,
                    yPosition: 'top',
                    xPosition: maxHorizontalPosition,
                    maxHeight: spaces.top,
                },
                bottom: {
                    ...rProps,
                    calculatedFromPosition: "bottom",
                    top: pageY + anchorHeight,
                    bottom: undefined,
                    left: canUseAnchorSpace ? pageX : isMaxHorizontalSpaceLeft ? undefined : pageX,
                    right: canUseAnchorSpace ? undefined : isMaxHorizontalSpaceLeft ? spaces.right : undefined,
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
    }, [anchorMeasurements?.width, customMaxHeight, anchorMeasurements?.height, anchorMeasurements?.pageX, anchorMeasurements?.pageY, sameWidth, minWidth, visible, menuWidth, menuHeight, padding, position, fullScreen, screenWidth, screenHeight]);
    const menuPosition = calculatePosition();
    const menuAnchorStyle = useMemo(() => {
        if (typeof anchorMeasurements?.width != "number") return {};
        const { width, pageX } = anchorMeasurements;
        if (!isNumber(width)) return null;
        if (sameWidth) return { width };
        if (isNumber(pageX) && screenWidth >= pageX + width) return { minWidth: width };
        return null;
    }, [anchorMeasurements?.width, sameWidth, visible, screenWidth]);
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
            styles.menuAnimated,
            touchableBackdropStyle,
            !fullScreen && menuAnchorStyle,
            !fullScreen && typeof borderRadius === 'number' ? { borderRadius } : null,
            typeof elevation === 'number' ? Theme.elevations[elevation] : null,
            {
                backgroundColor: theme.colors.surface,
            },
            !fullScreen && positionStyle
        ],
    };
};

const isFullScreen = (fullScreen?: boolean, responsive?: boolean, isMobileOrTablet?: boolean) => {
    return !!fullScreen || responsive === true && !!isMobileOrTablet;
}
interface IMenuState {
    visible: boolean;
    anchorMeasurements: IMenuAnchorMeasurements & { contentHeight: number };
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
const Menu = function Menu({
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
    dismissable,
    onDismiss,
    animationDuration,
    bottomSheetFullScreen,
    renderAsBottomSheetInFullScreen,
    bottomSheetMinHeight,
    bottomSheetTitle,
    bottomSheetTitleDivider,
    maxHeight,
    ...props
}: IMenuProps) {
    const isControlled = useMemo(() => typeof visible == "boolean", [visible]);
    animationDuration = typeof animationDuration === 'number' && animationDuration > 0 ? animationDuration : 300;
    const i18n = useI18n();
    const theme = useTheme();
    const [state, setState] = useStateCallback<IMenuState>({
        visible: isControlled ? !!visible : false,
        anchorMeasurements: {
            pageX: 0,
            pageY: 0,
            width: 0,
            height: 0,
            contentHeight: 0,
        }
    } as IMenuState);
    const [menuLayout, setMenuLayout] = useState<LayoutRectangle | null>(null);
    const anchorRef = useRef<View>(null);
    anchorContainerProps = Object.assign({}, anchorContainerProps);
    testID = defaultStr(testID, "resk-menu");
    itemsProps = Object.assign({}, itemsProps);
    const isMenuOpen = () => state.visible;
    const isVisible = useMemo(() => {
        return isControlled ? !!visible : state.visible;
    }, [state.visible, isControlled, visible]);
    const { fullScreen, menuPosition, animatedStyle, screenWidth, screenHeight } = useMenuPosition({
        menuWidth: menuLayout?.width || 0,
        menuHeight: menuLayout?.height || 0,
        maxHeight,
        dynamicHeight,
        position: customPosition,
        fullScreen: customFullScreen,
        visible: isVisible,
        responsive,
        sameWidth,
        minWidth,
        borderRadius,
        elevation,
        anchorMeasurements: state.anchorMeasurements,
        preferedPositionAxis,
    });
    // Animation values
    const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(animated ? 0.5 : 1)).current;
    const prevIsVisible = usePrevious(isVisible);
    const animationsRef = useRef<Animated.CompositeAnimation>(null);
    const animateMenu = (visible: boolean, callback?: (() => void)) => {
        if (animationsRef.current && typeof animationsRef.current.stop == "function") {
            animationsRef.current.stop();
        }
        const animations = [
            Animated.timing(opacity, {
                toValue: visible ? 1 : 0,
                duration: animationDuration,
                useNativeDriver,
                easing: visible ? Easing.in(Easing.exp) : Easing.out(Easing.exp),
            }),
        ]
        if (animated) {
            animations.push(Animated.timing(scale, {
                toValue: visible ? 1 : 0.5,
                duration: animationDuration,
                useNativeDriver,
            }));
        }
        if (!visible) {
            animations.push(preparedBottomSheet.animate(0, undefined, false));
        }
        (animationsRef as any).current = animations;
        return Animated.parallel(animations).start(() => {
            (animationsRef as any).current = null;
            if (typeof callback == "function") {
                callback();
            }
        })
    }
    const closeMenuInternal = (callback?: Function) => {
        if (isControlled) {
            if (typeof onDismiss === "function") {
                onDismiss();
            }
            return;
        }
        setState((prevState) => ({ ...prevState, visible: false }), () => {
            if (typeof callback === "function") {
                callback();
            }
            if (typeof onClose === "function") {
                onClose();
            }
        });
    };
    const renderedAsBottomSheet = fullScreen && renderAsBottomSheetInFullScreen !== false;
    const preparedBottomSheet = usePrepareBottomSheet({
        visible: isVisible,
        height: state.anchorMeasurements?.contentHeight,
        animationDuration,
        dismissable,
        fullScreen: bottomSheetFullScreen,
        onDismiss: closeMenuInternal
    })

    useEffect(() => {
        if (prevIsVisible == isVisible) return;
        animateMenu(isVisible);
    }, [isVisible, prevIsVisible, animationDuration, animated]);
    useEffect(() => {
        measureAnchor(anchorRef, bottomSheetMinHeight).then((anchorMeasurements) => {
            setState(prevState => {
                return { ...prevState, anchorMeasurements }
            })
        });
    }, [screenWidth, screenHeight, anchorRef, bottomSheetMinHeight]);
    // Handle menu layout changes
    const onMenuLayout = (event: LayoutChangeEvent) => {
        const { width: mWidth, height } = event.nativeEvent.layout;
        const width = Math.max(mWidth, typeof minWidth === "number" ? minWidth : 0);
        const minPadding = 30;
        if ((isNumber(menuLayout?.width) && Math.abs(width - menuLayout.width) <= minPadding) && (isNumber(menuLayout?.height) && Math.abs(height - menuLayout.height) <= minPadding)) {
            return;
        }
        setMenuLayout({ width, height, x: 0, y: 0 });
    }
    const context1 = { animated, anchorMeasurements: state.anchorMeasurements, menuPosition, responsive, testID, borderRadius, fullScreen: fullScreen, ...props, isMenu: true, isMenuOpen, isMenuVisible: isVisible }
    const openMenu = (callback?: Function) => {
        measureAnchor(anchorRef, bottomSheetMinHeight).then((measures) => {
            if (isControlled) {
                setState((prevState) => {
                    return { ...prevState, anchorMeasurements: measures }
                });
                return;
            }
            setState((prevState) => {
                return { ...prevState, anchorMeasurements: measures, visible: true }
            }, () => {
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
        animateMenu(false, closeMenuInternal);
    };
    const context = { ...context1, isMenuVisible: isVisible, animateMenu, isMenuOpen, openMenu, closeMenu };
    const anchor = useMemo(() => {
        if (typeof customAnchor === 'function') {
            return (state: PressableStateCallbackType) => {
                const a = customAnchor({ ...state, ...context });
                if (!isValidElement(a)) return null;
                return a;
            }
        }
        return isValidElement(customAnchor) ? <View testID={testID + "-anchor-content-container"}>{customAnchor}</View> : null;
    }, [customAnchor, isVisible, fullScreen, context]);
    const child = useMemo(() => {
        if (typeof children == 'function') {
            return children(context);
        }
        return children;
    }, [children, context, isVisible]);
    const { Wrapper, wrapperProps } = useMemo(() => {
        if (!withScrollView) {
            return { Wrapper: Fragment, wrapperProps: {} }
        }
        return {
            Wrapper: ScrollView,
            wrapperProps: Object.assign({}, { testID: testID + "-scroll-view" }, scrollViewProps, { style: StyleSheet.flatten([styles.scrollview, scrollViewProps?.style]) })
        }
    }, [withScrollView, testID, scrollViewProps]);
    return <>
        <MenuContext.Provider value={context}>
            <Pressable testID={testID + "-anchor-container"}
                ref={anchorRef}
                {...anchorContainerProps}
                onAccessibilityEscape={() => {
                    if (typeof anchorContainerProps?.onAccessibilityEscape === "function") {
                        anchorContainerProps.onAccessibilityEscape()
                    }
                    if (dismissable !== false) {
                        closeMenu();
                    }
                }}
                style={(state) => {
                    return [Theme.styles.relative, typeof anchorContainerProps?.style === 'function' ? anchorContainerProps?.style(state) : anchorContainerProps?.style];
                }}
                onLayout={(event) => {
                    if (typeof anchorContainerProps?.onLayout === 'function') {
                        anchorContainerProps?.onLayout(event);
                    }
                    measureAnchor(anchorRef, bottomSheetMinHeight).then((anchorMeasurements) => {
                        setState(prevState => {
                            return { ...prevState, anchorMeasurements }
                        });
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
        {<Portal visible={isVisible} absoluteFill style={!isVisible && Theme.styles.hidden} testID={testID + "-portal"}>
            <MenuContext.Provider value={context}>
                <Pressable
                    onPress={() => {
                        closeMenu();
                    }}
                    style={[styles.portalBackdrop, renderedAsBottomSheet && preparedBottomSheet.backdropStyle]}
                    testID={testID + "-menu-backdrop"}
                >
                    <Animated.View
                        testID={testID}
                        {...props}
                        {...(renderedAsBottomSheet ? preparedBottomSheet.animatedProps : {})}
                        onLayout={(event) => {
                            if (typeof onLayout === 'function') {
                                onLayout(event);
                            }
                            onMenuLayout(event);
                        }}
                        style={[
                            animatedStyle,
                            { opacity, transform: [{ scale }] },
                            props.style,
                            renderedAsBottomSheet ? preparedBottomSheet.animatedProps.style : null,
                        ]}
                    >
                        <Wrapper {...wrapperProps}>
                            <KeyboardAvoidingView testID={testID + "-content-container"} style={[styles.contentContainer]}>
                                <Pressable testID={testID + "-content-wrapper"} style={styles.contentWrapper} onPress={(event) => { event.stopPropagation(); return false; }}>
                                    {renderedAsBottomSheet ? <View style={styles.bottomSheetCloseIconContainer}>
                                        <View testID={testID + "-close-menu"} style={[styles.bottomSheetCloseIcon]}>
                                            <View testID={testID + "-bottom-sheet-title-container"} style={[{ maxWidth: screenWidth - 70 }, styles.bottomSheetTitleContainer]} >
                                                <Label textBold testID={testID + "-bottom-sheet-title"} color={theme.colors.onSurface}>{bottomSheetTitle}</Label>
                                            </View>
                                            <Icon
                                                iconName='close'
                                                title={i18n.t('components.menu.close')}
                                                size={30}
                                                color={theme.colors.onSurface}
                                                onPress={() => {
                                                    closeMenu();
                                                }}
                                            />
                                        </View>
                                        {bottomSheetTitle && bottomSheetTitleDivider !== false ? <Divider testID={testID + "-divider"} /> : null}
                                    </View> : null}
                                    {items ? <MenuItems testID={testID + "-menu-items"} items={items as any} {...itemsProps} /> : null}
                                    {child}
                                </Pressable>
                            </KeyboardAvoidingView>
                        </Wrapper>
                    </Animated.View>
                </Pressable>
            </MenuContext.Provider>
        </Portal>}
    </>
};

/***
 * It measures the anchor element and returns the measurements.
 * @param {React.RefObject<any>} anchorRef - The ref of the anchor element.
 * @param {number} minContentHeight - The minimum content height.
 * @param {(anchorMeasurements: IMenuAnchorMeasurements) => void} callback - The callback function to be called with the measurements.
 * @returns void
 */
export const measureAnchor = (anchorRef: RefObject<any>, minContentHeight?: number) => {
    return measureContentHeight(anchorRef, minContentHeight).then(({ x, y, width, height, contentHeight }) => {
        return {
            pageX: x,
            pageY: y,
            width,
            height,
            contentHeight
        };
    });
}

/**
 * Default styles for the menu container
 */
const styles = StyleSheet.create({
    scrollview: {
        width: "100%",
    },
    contentContainer: {
        width: '100%',
        alignSelf: "flex-start",
        flexGrow: 1,
        overflow: "hidden",
        maxHeight: "100%",
    },
    contentWrapper: {
        flexGrow: 1,
        alignSelf: "flex-start",
        maxHeight: "100%",
        width: "100%",
        //overflow: "hidden",
    },
    bottomSheetCloseIconContainer: {
        alignSelf: "flex-start",
        width: "100%",
    },
    bottomSheetCloseIcon: {
        alignSelf: "flex-start",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    bottomSheetTitleContainer: {
        flexWrap: "wrap",
        paddingHorizontal: 10
    },
    portalBackdrop: {
        flex: 1,
        overflow: "hidden",
        position: "relative",
    },
    portalBottomSheet: {

    },
    menuAnimated: {
        overflow: "hidden",
        position: 'absolute',
        paddingVertical: 10,
        paddingHorizontal: 2,
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        maxHeight: '100%',
        maxWidth: '100%',
    },
});

export * from "./context";
export * from "./types";
export * from "./utils";

Menu.Item = MenuItem;
Menu.displayName = 'Menu.Item';
Menu.displayName = 'Menu';

Menu.Items = MenuItems;
Menu.Items.displayName = 'Menu.Items';

Menu.ExpandableItem = ExpandableMenuItem;
Menu.ExpandableItemBase = ExpandableItem;
Menu.ExpandableItem.displayName = 'Menu.ExpandableItem';
Menu.ExpandableItemBase.displayName = 'Menu.ExpandableItemBase';


export { Menu };