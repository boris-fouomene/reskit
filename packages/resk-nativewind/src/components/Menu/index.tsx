"use client";

import MenuItems from './Items';
import { Portal } from '@components/Portal';
import { useEffect, useState, useRef, useMemo, RefObject, Fragment } from 'react';
import { View, LayoutChangeEvent, LayoutRectangle, Pressable, ScrollView } from 'react-native';
import { IMenuContext, IMenuProps } from './types';
import isValidElement from '@utils/isValidElement';
import { defaultStr } from '@resk/core';
import { MenuContext } from './context';
import useStateCallback from '@utils/stateCallback';
import { isNumber } from "@resk/core/utils";
import { measureContentHeight } from '@utils/measureContentHeight';
import { useMenuPosition } from './position';
import { cn } from '@utils/cn';
import surface from '@variants/surface';



export function Menu({
    onClose,
    children,
    anchor: customAnchor,
    position: customPosition,
    anchorContainerClassName,
    onOpen,
    testID,
    onLayout,
    sameWidth = true,
    visible,
    minWidth,
    preferedPositionAxis,
    dismissable,
    onDismiss,
    //renderAsBottomSheetInFullScreen,
    bottomSheetTitle,
    bottomSheetTitleDivider,
    backdropClassName,
    maxHeight,
    className,
    scrollViewProps,
    withScrollView,
    items,
    itemsProps,
    ...props
}: IMenuProps) {
    const isControlled = useMemo(() => typeof visible == "boolean", [visible]);
    const [state, setState] = useStateCallback({
        visible: isControlled ? !!visible : false,
        anchorMeasurements: {
            pageX: 0,
            pageY: 0,
            width: 0,
            height: 0,
            contentHeight: 0,
        }
    });
    const [menuLayout, setMenuLayout] = useState<LayoutRectangle | null>(null);
    const anchorRef = useRef<View>(null);
    testID = defaultStr(testID, "resk-menu");
    const isOpen = () => state.visible;
    const isVisible = useMemo(() => {
        return isControlled ? !!visible : state.visible;
    }, [state.visible, isControlled, visible]);
    const { menuPosition, menuStyle, isDesktop, isMobile, isTablet, windowWidth, windowHeight, fullScreen } = useMenuPosition({
        menuWidth: menuLayout?.width || 0,
        menuHeight: menuLayout?.height || 0,
        maxHeight,
        position: customPosition,
        visible: isVisible,
        sameWidth,
        minWidth,
        anchorMeasurements: state.anchorMeasurements,
        preferedPositionAxis,
    });
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
    useEffect(() => {
        measureAnchor(anchorRef).then((anchorMeasurements) => {
            setState(prevState => ({ ...prevState, anchorMeasurements }));
        });
    }, [windowWidth, windowHeight, anchorRef]);
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
    const open = (callback?: Function) => {
        measureAnchor(anchorRef).then((measures) => {
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
    const close = (callback?: Function) => {
        closeMenuInternal(callback);
    };
    const context: IMenuContext = { windowHeight, windowWidth, isMobile, isTablet, fullScreen, isDesktop, anchorMeasurements: state.anchorMeasurements, position: menuPosition, testID, isOpen, open, close, isVisible: isVisible };
    let anchor = null;
    if (typeof customAnchor === 'function') {
        const a = customAnchor(context);
        if (isValidElement(a)) {
            anchor = a;
        }
    } else if (isValidElement(customAnchor)) {
        anchor = customAnchor;
    }
    const child = useMemo(() => {
        if (typeof children == 'function') {
            return children(context);
        }
        return children;
    }, [children, context]);
    const { Wrapper, wrapperProps } = useMemo(() => {
        if (!withScrollView) {
            return { Wrapper: Fragment, wrapperProps: {} }
        }
        return {
            Wrapper: ScrollView,
            wrapperProps: Object.assign({}, { testID: testID + "-scroll-view" }, scrollViewProps, { style: StyleSheet.flatten([scrollViewProps?.style]) })
        }
    }, [withScrollView, testID, scrollViewProps]);
    return <>
        <MenuContext.Provider value={context}>
            <Pressable testID={testID + "-anchor-container"}
                ref={anchorRef}
                className={cn(anchorContainerClassName)}
                onAccessibilityEscape={dismissable !== false ? () => {
                    close();
                } : undefined}
                onLayout={(event) => {
                    measureAnchor(anchorRef).then((anchorMeasurements) => {
                        setState(prevState => {
                            return { ...prevState, anchorMeasurements }
                        });
                    });
                }}
                onPress={(event) => {
                    open();
                }}>
                {anchor}
            </Pressable>
        </MenuContext.Provider>
        {<Portal visible={isVisible} absoluteFill testID={testID + "-portal"} onPress={() => { close(); }} className={cn(backdropClassName)}>
            <MenuContext.Provider value={context}>
                <Pressable
                    testID={testID}
                    {...props}
                    onPress={(event) => {
                        event.stopPropagation();
                        if (typeof props.onPress === "function") {
                            return props.onPress(event);
                        }
                        return false;
                    }}
                    className={cn(surface({ color: "surface" }), className)}
                    onLayout={(event) => {
                        if (typeof onLayout === 'function') {
                            onLayout(event);
                        }
                        onMenuLayout(event);
                    }}
                    style={[menuStyle, props.style]}
                >
                    <Wrapper {...wrapperProps}>
                        {items ? <MenuItems testID={testID + "-menu-items"} items={items as any} {...Object.assign({}, itemsProps)} /> : null}
                        {child}
                    </Wrapper>
                </Pressable>
            </MenuContext.Provider>
        </Portal>}
    </>
};


const measureAnchor = (anchorRef: RefObject<any>, minContentHeight?: number) => {
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

/* Menu.Item = MenuItem;
Menu.displayName = 'Menu.Item';
Menu.displayName = 'Menu';

Menu.Items = MenuItems;
Menu.Items.displayName = 'Menu.Items';

Menu.ExpandableItem = ExpandableMenuItem;
Menu.ExpandableItemBase = ExpandableItem;
Menu.ExpandableItem.displayName = 'Menu.ExpandableItem';
Menu.ExpandableItemBase.displayName = 'Menu.ExpandableItemBase';

 */
export { MenuItems };
export * from "./utils";
export * from "./hooks";
export * from "./context";
export * from "./types";