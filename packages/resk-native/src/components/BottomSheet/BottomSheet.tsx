import React, { createContext, ReactNode, useContext, useImperativeHandle, useMemo, useRef } from "react"
import theme from "@theme";
import { defaultObj, defaultStr, Platform as ReskPlatform, isObj } from "@resk/core";
import View, { IViewProps } from "@components/View";
import { Portal } from "@components/Portal";
import { ScrollView } from "react-native";
import BackHandler from "@components/BackHandler";
import { ExpandableItem } from "@components/Menu/ExpandableItem";
import {
    Pressable,
    Animated,
    PanResponder,
    StyleSheet,
} from "react-native";
import { ScrollViewProps } from "react-native";
import { AppBar, IAppBarProps } from "@components/AppBar";
import usePrevious from "@utils/usePrevious";
import { useDimensions } from "@dimensions/index";
import useStateCallback from "@utils/stateCallback";
import { IMenuItemBase, IMenuItems, useRenderMenuItems } from "@components/Menu";
import { Button } from "@components/Button";
import { Divider } from "@components/Divider";

const defaultHeight = 400;

/**
 * A React component that represents a bottom sheet.
 * 
 * A bottom sheet is a sheet that slides up from the bottom of the screen.
 * It can be used to display a list of items, a form, or any other content.
 * 
 * @example
 * ```typescript
 * <BottomSheet>
 *   <Text>Bottom sheet content</Text>
 * </BottomSheet>
 * ```
 */
const BottomSheet = React.forwardRef<any, IBottomSheetProps>((props, ref) => {
    let {
        closeOnDragDown,
        dragFromTopOnly,
        children,
        height: customHeight,
        visible: customVisible,
        animationDuration,
        contentProps: customChildrenContainerProps,
        onOpen,
        testID: customTestID,
        dismissable = true,
        onDismiss,
        withScrollView,
        elevation: customElevation,
        scrollViewProps: _scrollViewProps,
        containerProps: customContainerProps,
        appBarProps,
        items: customItems,
        itemsProps,
        style,
        dividerAfterAppBar,
        ...rest
    } = props;
    closeOnDragDown = typeof closeOnDragDown === 'boolean' ? closeOnDragDown : true;
    animationDuration = typeof animationDuration === 'number' && animationDuration ? animationDuration : 300;
    itemsProps = Object.assign({}, itemsProps);
    const { height: winHeight } = useDimensions();
    const hasAppBar = isObj(appBarProps);
    appBarProps = Object.assign({}, appBarProps);
    const elevation = typeof customElevation == 'number' && customElevation ? customElevation : 0;
    let height = typeof customHeight == 'number' && customHeight ? customHeight : 0;
    if (height > 0) {
        height = Math.max(height, defaultHeight);
    } else {
        height = Math.max(winHeight / 3, defaultHeight);
    }
    const [pan] = React.useState(new Animated.ValueXY());
    const [visibleState, setVisibleState] = useStateCallback(typeof customVisible === 'boolean' ? customVisible : false);
    const isControlled = useMemo(() => {
        return typeof customVisible === 'boolean';
    }, [customVisible]);
    const isVisible = useMemo(() => {
        if (isControlled) return !!customVisible;
        return visibleState;
    }, [visibleState, isControlled, customVisible]);
    const heightRef = React.useRef(height);
    heightRef.current = height;
    const prevVisible = usePrevious(isVisible);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const visibleRef = React.useRef(isVisible);
    visibleRef.current = isVisible;
    const animatedValueRef = React.useRef(0);
    const context = ({
        open: (cb?: () => void) => {
            if (isControlled) return;
            setVisibleState(true, cb);
        },
        close: (cb?: () => void) => {
            pan.setValue({ x: 0, y: 0 });
            const callback = () => {
                if (typeof onDismiss === 'function') {
                    onDismiss();
                }
                if (typeof cb === 'function') {
                    cb();
                }
            }
            animate({ toValue: 0 }, () => {
                if (isControlled) {
                    callback();
                    return;
                }
                setVisibleState(false, callback);
            })
        },
        get isOpened() {
            return visibleRef.current;
        }
    });

    const subscription = React.useRef<{ remove: () => void }>(null);
    const handleBack = React.useCallback(() => {
        if (dismissable) {
            context.close();
        }
        return true;
    }, [dismissable, context])
    const removeListeners = () => {
        if (subscription.current?.remove) {
            subscription.current.remove();
        } else {
            BackHandler.removeEventListener('hardwareBackPress', handleBack);
        }
    }
    const animate = (options: Omit<Partial<Animated.TimingAnimationConfig>, "toValue"> & { toValue: number }, callback?: Function) => {
        const options2 = Object.assign({}, { duration: animationDuration }, options, { useNativeDriver: false }) as Animated.TimingAnimationConfig;
        /*  if (animatedValueRef.current == options2.toValue) {
             if (typeof callback == "function") {
                 callback();
             }
             return;
         } */
        return Animated.timing(animatedHeight, options2).start(() => {
            (animatedValueRef as any).current = options2.toValue;
            if (typeof callback == "function") {
                callback();
            }
        });
    }


    const panResponder = useMemo(() => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => !!closeOnDragDown,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (e, gestureState) => {
                //const initialPosition = heightRef.current;
                //const newPosition = heightRef.current * 0.5 + gestureState.dy;
                const diff = gestureState.dy > 0 ? animatedValueRef.current - gestureState.dy :
                    Math.min(heightRef.current, animatedValueRef.current - gestureState.dy);
                if (diff > 0 && diff !== animatedValueRef.current) {
                    //animate({ toValue: diff, duration: 100 });
                    animatedHeight.setValue(diff);
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                // Threshold to determine if sheet should close
                const velocity = gestureState.vy;
                const movedDistance = gestureState.dy;

                // Close if swiped down with velocity or moved down significantly
                if (velocity > 0.5 || movedDistance > heightRef.current * 0.2) {
                    context.close();
                    return;
                }
                const height = animatedValueRef.current;
                if (height / 3 - gestureState.dy < 0) {
                    context.close();
                }
            }
        });
    }, []);
    React.useEffect(() => {
        removeListeners();
        if (prevVisible == isVisible) return;
        if (isVisible) {
            (subscription as any).current = BackHandler.addEventListener('hardwareBackPress', handleBack);
            pan.setValue({ x: 0, y: 0 });
            animate({ toValue: heightRef.current }, onOpen);
        } else {
            pan.setValue({ x: 0, y: 0 });
            animate({ toValue: 0 });
        }
    }, [isVisible, prevVisible])

    const panStyle = {
        transform: pan.getTranslateTransform()
    };
    const scrollViewProps = defaultObj(_scrollViewProps);
    const contentProps = defaultObj(customChildrenContainerProps);
    useImperativeHandle(ref, () => (context));
    const items = useRenderMenuItems<IBottomSheetMenuItemContext>({
        items: (Array.isArray(customItems) ? customItems : []),
        context: { bottomSheet: context },
        render: renderItem,
        renderExpandable,
    });
    const content = <>
        {items}
        {children}
    </>;
    React.useEffect(() => {
        return () => {
            removeListeners();
        }
    }, []);
    dragFromTopOnly = typeof dragFromTopOnly === 'boolean' ? dragFromTopOnly : false;
    const testID = defaultStr(customTestID, "resk-bottom-sheet");
    const containerProps = defaultObj(customContainerProps);
    const borderColor = theme.colors.outline, borderWidth = 1;
    return !isVisible ? null : (
        <Portal absoluteFill>
            <BottomSheetContext.Provider value={context}>
                <Pressable
                    testID={testID + "-backdrop"}
                    style={[styles.backdrop, { backgroundColor: theme.colors.backdrop }]}
                    onPress={() => handleBack()}
                />
                <Animated.View
                    {...(!dragFromTopOnly ? panResponder.panHandlers : {})}
                    testID={testID + "-container"} {...containerProps}
                    style={[styles.container, containerProps.style, { borderTopWidth: borderWidth, borderTopColor: borderColor, backgroundColor: theme.colors.surface }, theme.elevations[elevation], panStyle, {
                        transform: [{ translateX: 0 }],
                        backgroundColor: theme.colors.surface,
                        height: animatedHeight
                    }]}
                >
                    {closeOnDragDown && (
                        <View
                            {...(dragFromTopOnly && panResponder.panHandlers)}
                            style={[styles.draggableContainer, ReskPlatform.isWeb() ? { cursor: 'ns-resize' } as any : null]}
                            testID={testID + "-draggable-icon-container"}
                        >
                            <View testID={testID + "draggable-icon"} style={[styles.draggableIcon]} />
                        </View>
                    )}
                    <View testID={testID} {...rest} style={[styles.main, style]}>
                        {hasAppBar ? <>
                            <AppBar
                                colorScheme="surface"
                                statusBarHeight={0}
                                elevation={0}
                                backAction={false}
                                {...appBarProps}
                                titleProps={Object.assign({}, appBarProps.titleProps,{style:[styles.title, appBarProps.titleProps?.style]})}
                                context={Object.assign({}, appBarProps.context, { bottomSheet: context })}
                            />
                            {dividerAfterAppBar !== false ? <Divider
                                testID={testID + "-divider"}
                                style={styles.divider}
                            /> : null}
                        </> : null}
                        {withScrollView !== false ?
                            <ScrollView testID={testID + "-scroll-view"} contentProps={{ style: styles.scrollViewContent }} {...scrollViewProps} style={[styles.scrollView, scrollViewProps.style]} alwaysBounceVertical={false}
                                contentContainerStyle={[{ flexGrow: 1, margin: 0, paddingBottom: 30 }, scrollViewProps.contentContainerStyle]}
                            >
                                {content}
                            </ScrollView>
                            : <View testID={testID + "-content"} {...contentProps} style={[styles.childrenNotScroll, contentProps.style]}>
                                {content}
                            </View>}
                    </View>
                </Animated.View>
            </BottomSheetContext.Provider>
        </Portal >
    );
});

/**
 * A context for the bottom sheet component.
 * 
 * This context provides a way to access the bottom sheet's context from anywhere in the component tree.
 * 
 * @type {React.Context<IBottomSheetContext>}
 */
const BottomSheetContext = createContext<IBottomSheetContext>({} as IBottomSheetContext);

/**
 * A hook that provides access to the bottom sheet's context.
 * 
 * This hook returns the bottom sheet's context, or an empty object if the context is not available.
 * 
 * @returns {IBottomSheetContext} The bottom sheet's context.
 */
export const useBottomSheet = () => {
    /**
     * The context of the bottom sheet component.
     * 
     * This context is obtained using the `useContext` hook.
     */
    const context = useContext(BottomSheetContext);
    return context || {}
}
/**
 * An interface for the props of a bottom sheet item.
 * 
 * This interface extends the `IMenuItemBase` interface and adds no additional properties.
 * It is used to define the props of a bottom sheet item.
 * 
 * @extends IMenuItemBase<IBottomSheetMenuItemContext>
 */
export interface IBottomSheetItemProps extends IMenuItemBase<IBottomSheetMenuItemContext> {
    /**
     * No additional properties are defined in this interface.
     * 
     * The props of a bottom sheet item are defined by the `IMenuItemBase` interface.
     */
}

function BottomSheetItem({ closeOnPress, onPress: customOnPress, ...props }: IBottomSheetItemProps) {
    const bottomSheet = useBottomSheet();
    return <Button
        fullWidth
        testID="resk-bottom-sheet-item"
        {...props}
        onPress={(event, context) => {
            const callback = () => {
                if (typeof customOnPress === 'function') {
                    return customOnPress(event, context);
                }
            };
            closeOnPress !== false ? bottomSheet?.close(callback) : callback();
        }}
        context={Object.assign({}, props.context, { bottomSheet })}
    />;
}

function renderExpandable(props: IBottomSheetItemProps, index: number) {
    return <ExpandableItem {...props} as={BottomSheetItem} key={index} />;
}
function renderItem(props: IBottomSheetItemProps, index: number) {
    return <BottomSheetItem {...props} key={index} />;
}

/**
 * Interface for the context of the BottomSheet component.
 * 
 * This interface defines the properties and methods that are available in the context of the BottomSheet component.
 */
export interface IBottomSheetContext {
    /**
     * A method that opens the bottom sheet.
     * 
     * @example
     * ```typescript
     * const { open } = useContext(IBottomSheetContext);
     * open();
     * ```
     */
    open: (callback?: () => void) => void;

    /**
     * A method that closes the bottom sheet.
     * 
     * @example
     * ```typescript
     * const { close } = useContext(IBottomSheetContext);
     * close();
     * ```
     */
    close: (callback?: () => void) => void;

    /**
     * A property that indicates whether the bottom sheet is currently close.
     * 
     * @example
     * ```typescript
     * const { isOpened } = useContext(IBottomSheetContext);
     * if (isOpened) {
     *   console.log('Bottom sheet is close');
     * }
     * ```
     */
    isOpened: boolean;
}

/**
* Interface for the context of the BottomSheet menu item.
* 
* This interface defines the properties that are available in the context of the BottomSheet menu item.
*/
export interface IBottomSheetMenuItemContext {
    /**
     * The context of the BottomSheet component.
     * 
     * This property provides access to the methods and properties of the BottomSheet component, such as opening and closing the sheet.
     * 
     * @type IBottomSheetContext
     * @example
     * ```typescript
     * const { bottomSheet } = useContext(IBottomSheetMenuItemContext);
     * bottomSheet.close();
     * ```
     */
    bottomSheet: IBottomSheetContext;
}

/**
 * Interface for the props of the BottomSheet component.
 * 
 * @extends IViewProps
 */
export interface IBottomSheetProps extends IViewProps {
    /**
     * The height of the bottom sheet. If not provided, the default height will be used.
     * 
     * @default undefined
     * @example
     * ```typescript
     * <BottomSheet height={300} />
     * ```
     */
    height?: number;

    /**
     * Whether the bottom sheet should be wrapped in a ScrollView.
     * 
     * @default false
     * @example
     * ```typescript
     * <BottomSheet withScrollView={true} />
     * ```
     */
    withScrollView?: boolean;

    /**
     * Props for the container of the bottom sheet.
     * 
     * @type IViewProps
     * @example
     * ```typescript
     * <BottomSheet containerProps={{ style: { backgroundColor: 'white' } }} />
     * ```
     */
    containerProps?: IViewProps;

    /**
     * Props for the AppBar of the bottom sheet.
     * 
     * @type IAppBarProps<IBottomSheetContext>
     * @example
     * ```typescript
     * <BottomSheet appBarProps={{ title: 'Bottom Sheet' }} />
     * ```
     */
    appBarProps?: IAppBarProps<IBottomSheetMenuItemContext>;

    /**
     * Whether the bottom sheet is visible.
     * 
     * @default false
     * @example
     * ```typescript
     * <BottomSheet visible={true} />
     * ```
     */
    visible?: boolean;

    /**
     * The duration of the animation when the bottom sheet is opened or closed.
     * 
     * @default 300
     * @example
     * ```typescript
     * <BottomSheet animationDuration={500} />
     * ```
     */
    animationDuration?: number;

    /**
     * Whether the bottom sheet can be dismissed by the user.
     * 
     * @default true
     * @example
     * ```typescript
     * <BottomSheet dismissable={false} />
     * ```
     */
    dismissable?: boolean;

    /**
     * Whether the bottom sheet should be closed when the user drags it down.
     * 
     * @default true
     * @example
     * ```typescript
     * <BottomSheet closeOnDragDown={false} />
     * ```
     */
    closeOnDragDown?: boolean;

    /**
     * Whether the bottom sheet can only be dragged from the top.
     * 
     * @default false
     * @example
     * ```typescript
     * <BottomSheet dragFromTopOnly={true} />
     * ```
     */
    dragFromTopOnly?: boolean;

    /**
     * The elevation of the bottom sheet.
     * 
     * @default 4
     * @example
     * ```typescript
     * <BottomSheet elevation={8} />
     * ```
     */
    elevation?: number;

    /**
     * A callback function that is called when the bottom sheet is opened.
     * 
     * @type Function
     * @example
     * ```typescript
     * <BottomSheet onOpen={() => console.log('Bottom sheet opened')} />
     * ```
     */
    onOpen?: Function;

    /**
     * A callback function that is called when the bottom sheet is dismissed.
     * 
     * @type Function
     * @example
     * ```typescript
     * <BottomSheet onDismiss={() => console.log('Bottom sheet dismissed')} />
     * ```
     */
    onDismiss?: Function;

    /**
     * Props for the ScrollView of the bottom sheet.
     * 
     * @type ScrollViewProps
     * @example
     * ```typescript
     * <BottomSheet scrollViewProps={{ contentContainerStyle: { padding: 20 } }} />
     * ```
     */
    scrollViewProps?: ScrollViewProps;

    /**
     * The children of the bottom sheet.
     * 
     * @type ReactNode
     * @example
     * ```typescript
     * <BottomSheet>
     *   <Text>Bottom sheet content</Text>
     * </BottomSheet>
     * ```
     */
    children?: ReactNode;

    /**
     * Props for the content of the bottom sheet.
     * 
     * @type IViewProps
     * @example
     * ```typescript
     * <BottomSheet contentProps={{ style: { padding: 20 } }}>
     *   <Text>Bottom sheet content</Text>
     * </BottomSheet>
     * ```
     */
    contentProps?: IViewProps;

    /**
     * An optional property that defines an array of menu items. Each item can either be a valid menu item object or undefined/null.
     * 
     * @type IMenuItems<IBottomSheetMenuItemContext>["items"]
     * @example
     * ```typescript
     * <BottomSheet
     *   items={[
     *     { label: 'Item 1', onPress: () => console.log('Item 1 pressed') },
     *     { label: 'Item 2', onPress: () => console.log('Item 2 pressed') },
     *   ]}
     * />
     * ```
     */
    items?: IMenuItems<IBottomSheetMenuItemContext>["items"];

    /**
     * Props for the menu items component. This allows for additional customization of the items rendered within the menu.
     * 
     * @type Omit<IMenuItems<IBottomSheetMenuItemContext>, "items">
     * @example
     * ```typescript
     * <BottomSheet
     *   items={[
     *     { label: 'Item 1', onPress: () => console.log('Item 1 pressed') },
     *     { label: 'Item 2', onPress: () => console.log('Item 2 pressed') },
     *   ]}
     *   itemsProps={{ style: { backgroundColor: 'white' } }}
     * />
     * ```
     */
    itemsProps?: Omit<IMenuItems<IBottomSheetMenuItemContext>, "items">;

    /***
     * Wheater to display Divider after the App bar content
     * Default is true
     */
    dividerAfterAppBar?: boolean;
};

BottomSheet.displayName = "BottomSheet";

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: "transparent",
    },
    titleContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleWrapper: {

    },
    scrollView: {
        paddingBottom: 30,
        margin: 0,
        flex: 1,
    },
    scrollViewContent: {
        margin: 0,
    },
    main: {
        // height: '100%'
        width: "100%",
        flex: 1,
        flexGrow: 1,
    },
    wrapper: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        width: "100%",
        overflow: "hidden",
        alignSelf: "flex-end",
    },
    draggableContainer: {
        width: "100%",
        alignItems: "center",
        backgroundColor: "transparent",
        flexGrow: 0,
        alignSelf: "flex-start",
    },
    draggableIcon: {
        width: 35,
        height: 5,
        borderRadius: 5,
        margin: 10,
        backgroundColor: "#ccc"
    },
    actionsContainer: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        fontSize: 15,
        fontWeight:"400"
    },
    divider: {
        margin: 0,
        width: '100%'
    },
    childrenNotScroll: {
        flex: 1,
    }
});

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
