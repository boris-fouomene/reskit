"use client";
import MenuItems from './Items';
import { Portal } from '@components/Portal';
import { useEffect, useState, useRef, useMemo, RefObject, Fragment } from 'react';
import { View, LayoutChangeEvent, LayoutRectangle, ScrollView, ScrollViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { IMenuContext, IMenuProps } from './types';
import isValidElement from '@utils/isValidElement';
import { defaultStr } from '@resk/core';
import { MenuContext } from './context';
import useStateCallback from '@utils/stateCallback';
import { isNumber } from "@resk/core/utils";
import { measureInWindow } from '@utils/measureLayut';
import { useMenuPosition } from './position';
import { cn } from '@utils/cn';
import { useBackHandler } from '@components/BackHandler';
import menuVariants from '@variants/menu';
import usePrevious from '@utils/usePrevious';
import bottomSheetVariant from '@variants/bottomSheet';
import { Div } from '@html/Div';
import { classes } from '@variants/classes';
import allVariants from '@variants/all';

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
    onRequestClose,
    renderAsBottomSheetInFullScreen,
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
    bottomSheetVariant: bVariant,
    fullScreenOnMobile,
    fullScreenOnTablet,
    onRequestOpen,
    disabled,
    contentContainerClassName,
    ...props
}: IMenuProps<Context>) {
    const isControlled = useMemo(() => typeof visible == "boolean", [visible]);
    const openOrCloseCallbackRef = useRef<Function | null>(null);
    fullScreenOnMobile = typeof fullScreenOnMobile === "boolean" ? fullScreenOnMobile : !!(renderAsBottomSheetInFullScreen);
    fullScreenOnTablet = typeof fullScreenOnTablet === "boolean" ? fullScreenOnTablet : !!(renderAsBottomSheetInFullScreen);
    const [state, setState] = useStateCallback({
        visible: isControlled ? !!visible : false,
        anchorMeasurements: {
            //x: 0,
            //y: 0,
            pageX: 0,
            pageY: 0,
            width: 0,
            height: 0
        }
    });
    const [menuLayout, setMenuLayout] = useState<LayoutRectangle | null>(null);
    const anchorRef = useRef<View>(null);
    testID = defaultStr(testID, "resk-menu");
    const isOpen = () => state.visible;
    const isVisible = useMemo(() => {
        return isControlled ? !!visible : state.visible;
    }, [state.visible, isControlled, visible]);
    const prevVisible = usePrevious(isVisible);
    useEffect(() => {
        if (isVisible !== prevVisible && isControlled && typeof openOrCloseCallbackRef.current == "function") {
            openOrCloseCallbackRef.current();
        }
        openOrCloseCallbackRef.current = null;
    }, [isVisible, isControlled, prevVisible]);
    const { menuPosition, menuStyle, isDesktop, isMobile, isTablet, windowWidth, windowHeight, fullScreen } = useMenuPosition({
        ...props,
        fullScreenOnMobile,
        fullScreenOnTablet,
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
        const cb = () => {
            if (typeof callback === "function") {
                callback();
            }
            if (typeof onClose === "function") {
                onClose();
            }
        };
        if (isControlled) {
            (openOrCloseCallbackRef as any).current = cb;
            if (typeof onRequestClose === "function") {
                onRequestClose();
            }
            return;
        }
        setState((prevState) => ({ ...prevState, visible: false }), cb);
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
            const cb = () => {
                if (typeof callback === "function") {
                    callback();
                }
                if (typeof onOpen === "function") {
                    onOpen();
                }
            };
            if (isControlled) {
                (openOrCloseCallbackRef as any).current = cb;
                setState((prevState) => {
                    return { ...prevState, anchorMeasurements: measures }
                }, onRequestOpen);
                return;
            }
            setState((prevState) => {
                return { ...prevState, anchorMeasurements: measures, visible: true }
            }, cb);
        });
    };
    const close = (callback?: Function) => {
        closeMenuInternal(callback);
    };
    const renderedAsBottomSheet = fullScreen && renderAsBottomSheetInFullScreen !== false;
    const computedBottomSheetVariant = bottomSheetVariant(Object.assign({}, bVariant, { visible: isVisible }));
    const { maxHeight: _maxMenuHeight } = Object.assign({}, menuStyle);
    const maxMenuHeight = !renderedAsBottomSheet && isNumber(_maxMenuHeight) && _maxMenuHeight > 0 ? _maxMenuHeight : undefined;
    const context: IMenuContext<Context> = { ...Object.assign({}, props.context), menu: { maxHeight: maxMenuHeight, renderedAsBottomSheet, windowHeight, windowWidth, isMobile, isTablet, fullScreen, isDesktop, anchorMeasurements: state.anchorMeasurements, position: menuPosition, testID, isOpen, open, close, isVisible: isVisible } };
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

    const maxHeightStyle = maxMenuHeight ? { maxHeight: maxMenuHeight } : undefined;
    const computedVariant = menuVariants(Object.assign({}, variant, { visible: isVisible }));
    const Wrapper = !withScrollView ? Fragment : ScrollView;
    const wrapperProps = !withScrollView ? {} : { testID: testID + "-scroll-view", style: maxHeightStyle, className: cn("max-w-full", computedVariant.scrollView(), scrollViewClassName), contentContainerClassName: cn(computedVariant.scrollViewContentContainer(), scrollViewContentContainerClassName) } as ScrollViewProps;
    itemsProps = Object.assign({}, itemsProps);
    itemsProps.className = cn(computedVariant.items(), itemsProps.className);
    const AnchorComponent = typeof customAnchor == "function" ? View : TouchableOpacity;
    const anchorProps = typeof customAnchor == "function" ? {} : {
        onPress: () => {
            open();
        }
    }
    return <>
        <MenuContext.Provider value={context}>
            <AnchorComponent
                testID={testID + "-anchor-container"}
                ref={anchorRef}
                className={cn(classes.cursorPointed, allVariants({ disabled }), computedVariant.anchorContainer(), anchorContainerClassName, "relative menu-anchor-container")}
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
                {...anchorProps}
            >
                {anchor}
            </AnchorComponent>
        </MenuContext.Provider>
        {<Portal autoMountChildren visible={isVisible} absoluteFill testID={testID + "-portal"} onPress={() => close()} className={cn(renderedAsBottomSheet ? computedBottomSheetVariant.portal() : computedVariant.portal(), backdropClassName, "menu-portal")}>
            <MenuContext.Provider value={context}>
                <View
                    testID={testID}
                    {...props}
                    className={cn("resk-menu absolute", renderedAsBottomSheet ? computedBottomSheetVariant.container() : computedVariant.container(), className)}
                    onLayout={(event) => {
                        if (typeof onLayout === 'function') {
                            onLayout(event);
                        }
                        onMenuLayout(event);
                    }}
                    style={StyleSheet.flatten([!renderedAsBottomSheet && menuStyle, props.style])}
                >
                    <Div style={maxHeightStyle} testID={testID + "-menu-content-container"} className={cn("max-h-full", renderedAsBottomSheet ? computedBottomSheetVariant.contentContainer() : computedVariant.contentContainer(), contentContainerClassName)}>
                        <Wrapper {...wrapperProps}>
                            {items ? <MenuItems context={props.context} testID={testID + "-menu-items"} items={items as any} {...itemsProps} /> : null}
                            {child}
                        </Wrapper>
                    </Div>
                </View>
            </MenuContext.Provider>
        </Portal>}
    </>
};


const measureAnchor = (anchorRef: RefObject<any>, minContentHeight?: number) => {
    return measureInWindow(anchorRef).then((({ x, y, ...rest }) => ({ pageX: x, pageY: y, ...rest })));
}

export * from "./context";
export * from "./types";