"use client";
import MenuItems from './Items';
import { Portal } from '@components/Portal';
import { useEffect, useState, useRef, useMemo, RefObject, Fragment } from 'react';
import { View, LayoutChangeEvent, LayoutRectangle, Pressable, ScrollView, ScrollViewProps } from 'react-native';
import { IMenuContext, IMenuProps } from './types';
import isValidElement from '@utils/isValidElement';
import { defaultStr } from '@resk/core';
import { MenuContext } from './context';
import useStateCallback from '@utils/stateCallback';
import { isNumber } from "@resk/core/utils";
import { measureContentHeight } from '@utils/measureContentHeight';
import { useMenuPosition } from './position';
import { cn } from '@utils/cn';
import { useBackHandler } from '@components/BackHandler';
import menuVariants from '@variants/menu';
import { classes } from '@variants/classes';



export function Menu<Context = unknown>({
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
    scrollViewClassName,
    scrollViewContentContainerClassName,
    withScrollView,
    items,
    itemsProps,
    variant,
    ...props
}: IMenuProps<Context>) {
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
    const context: IMenuContext<Context> = { ...Object.assign({}, props.context), menu: { windowHeight, windowWidth, isMobile, isTablet, fullScreen, isDesktop, anchorMeasurements: state.anchorMeasurements, position: menuPosition, testID, isOpen, open, close, isVisible: isVisible } };
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
    useBackHandler(function () {
        close();
        return true;
    });
    const menuVariant = menuVariants(variant);
    const Wrapper = !withScrollView ? Fragment : ScrollView;
    const wrapperProps = !withScrollView ? {} : { testID: testID + "-scroll-view", className: cn(menuVariant.scrollView(), scrollViewClassName), contentContainerClassName: cn(menuVariant.scrollViewContentContainer(), scrollViewContentContainerClassName) } as ScrollViewProps;
    itemsProps = Object.assign({}, itemsProps);
    itemsProps.className = cn(menuVariant.items(), itemsProps.className); 
    return <>
        <MenuContext.Provider value={context}>
            <Pressable testID={testID + "-anchor-container"}
                ref={anchorRef}
                className={cn(menuVariant.anchorContainer(), anchorContainerClassName, "menu-anchor-container")}
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
        {<Portal visible={isVisible} absoluteFill testID={testID + "-portal"} handleOnPressOnlyOnTarget onPress={(event) => {
            if (event.target == event.currentTarget) {
                close();
                return;
            }
        }} className={cn(menuVariant.portal(), backdropClassName, "menu-portal")}>
            <MenuContext.Provider value={context}>
                <View
                    testID={testID}
                    {...props}
                    className={cn(classes.positionFixed,menuVariant.base(), className)}
                    onLayout={(event) => {
                        if (typeof onLayout === 'function') {
                            onLayout(event);
                        }
                        onMenuLayout(event);
                    }}
                    style={[menuStyle, props.style]}
                >
                    <Wrapper {...wrapperProps}>
                        {items ? <MenuItems context={props.context} testID={testID + "-menu-items"} items={items as any} {...itemsProps} /> : null}
                        {child}
                    </Wrapper>
                </View>
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

export * from "./context";
export * from "./types";