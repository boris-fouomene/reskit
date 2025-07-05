"use client";
import MenuItems from './Items';
import { Portal } from '@components/Portal';
import { useEffect, useState, useRef, useMemo, RefObject, Fragment, useImperativeHandle } from 'react';
import { View, LayoutChangeEvent, LayoutRectangle, ScrollView, ScrollViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { IMenuAnchorMeasurements, IMenuContext, IMenuProps, IMenuState } from './types';
import isValidElement from '@utils/isValidElement';
import { defaultStr, i18n } from '@resk/core';
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
import { Text } from '@html/Text';
import { Icon } from '@components/Icon';
import { Divider } from '@components/Divider';

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
    portalClassName,
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
    ref,
    ...props
}: IMenuProps<Context>) {
    const isControlled = useMemo(() => typeof visible == "boolean", [visible]);
    const menuContextRef = useRef<IMenuContext<Context> | null>(null);
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
    const measureAnchor = (updateState: boolean = true) => {
        return new Promise<IMenuAnchorMeasurements>((resolve) => {
            return measureInWindow(anchorRef).then(({ x, y, ...rest }) => {
                return { pageX: x, pageY: y, ...rest };
            }).then((measures) => {
                if (updateState) {
                    setState((prevState) => ({ ...prevState, anchorMeasurements: measures }), () => {
                        resolve(measures);
                    });
                } else {
                    resolve(measures);
                }
            });
        });
    }
    useEffect(() => {
        if (visible) {
            measureAnchor(true);
        }
    }, [windowWidth, windowHeight, anchorRef]);
    useEffect(() => {
        if (isControlled && visible !== state.visible) {
            if (visible) {
                measureAnchor(false).then((measures) => {
                    setState((prev) => ({ ...prev, anchorMeasurements: measures, visible }));
                })
            } else {
                setState((prev) => ({ ...prev, visible } as any));
            }
        }
    }, [isControlled, visible, state.visible]);
    const open = (callback?: Function) => {
        measureAnchor(false).then((measures) => {
            if (isControlled) {
                if (typeof onRequestOpen === "function") {
                    onRequestOpen(menuContextRef.current as any);
                }
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
        if (isControlled) {
            if (typeof onRequestClose == "function") {
                onRequestClose(menuContextRef.current as any);
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
    const computedBottomSheetVariant = bottomSheetVariant(Object.assign({}, bVariant, { visible: isVisible }));
    const { maxHeight: _maxMenuHeight } = Object.assign({}, menuStyle);
    const maxMenuHeight = !renderedAsBottomSheet && isNumber(_maxMenuHeight) && _maxMenuHeight > 0 ? _maxMenuHeight : undefined;
    const context: IMenuContext<Context> = { ...Object.assign({}, props.context), menu: { maxHeight: maxMenuHeight, measureAnchor, renderedAsBottomSheet, windowHeight, windowWidth, isMobile, isTablet, fullScreen, isDesktop, anchorMeasurements: state.anchorMeasurements, position: menuPosition, testID, isOpen, open, close, isVisible: isVisible } };
    useImperativeHandle(ref, () => context as any);
    menuContextRef.current = context;
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
                    measureAnchor();
                }}
                {...anchorProps}
            >
                {anchor}
            </AnchorComponent>
        </MenuContext.Provider>
        {<Portal visible={isVisible} absoluteFill testID={testID + "-portal"} onPress={() => close()} className={cn(renderedAsBottomSheet ? computedBottomSheetVariant.portal() : computedVariant.portal(), portalClassName, "menu-portal")}>
            <MenuContext.Provider value={context}>
                <View
                    testID={testID}
                    {...props}
                    ref={ref}
                    className={cn("resk-menu absolute", renderedAsBottomSheet ? computedBottomSheetVariant.base() : computedVariant.container(), className)}
                    onLayout={(event) => {
                        if (typeof onLayout === 'function') {
                            onLayout(event);
                        }
                        onMenuLayout(event);
                    }}
                    style={StyleSheet.flatten([!renderedAsBottomSheet && menuStyle, props.style])}
                >
                    <Div style={maxHeightStyle} testID={testID + "-menu-content-container"} className={cn("max-h-full", renderedAsBottomSheet ? computedBottomSheetVariant.content() : computedVariant.contentContainer(), contentContainerClassName)}>
                        <Wrapper {...wrapperProps}>
                            {renderedAsBottomSheet ? <Div className="self-start w-full">
                                <Div testID={testID + "-close-menu"} className="w-full flex flex-row justify-between items-center py-[10px]">
                                    <Div testID={testID + "-bottom-sheet-title-container"} className="flex-wrap px-[10px]" >
                                        <Text testID={testID + "-bottom-sheet-title"} variant={{ weight: "bold" }}>{bottomSheetTitle}</Text>
                                    </Div>
                                    <Icon
                                        iconName={'close' as any}
                                        title={i18n.t('components.menu.close')}
                                        size={30}
                                        onPress={() => {
                                            close();
                                        }}
                                    />
                                </Div>
                                {bottomSheetTitle && bottomSheetTitleDivider !== false ? <Divider testID={testID + "-divider"} className="w-full" /> : null}
                            </Div> : null}
                            {items ? <MenuItems context={props.context} testID={testID + "-menu-items"} items={items as any} {...itemsProps} /> : null}
                            {child}
                        </Wrapper>
                    </Div>
                </View>
            </MenuContext.Provider>
        </Portal>}
    </>
};



export * from "./context";
export * from "./types";