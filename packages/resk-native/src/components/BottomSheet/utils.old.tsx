import { IAppBarProps } from "@components/AppBar/types";
import { IMenuItemBase, IMenuItems } from "@components/Menu/types";
import { IViewProps } from "@components/View";
import useStateCallback from "@utils/stateCallback";
import usePrevious from "@utils/usePrevious";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, LayoutChangeEvent, PanResponder, ScrollViewProps, StyleSheet, View } from "react-native";
import Theme, { useTheme } from "@theme/index";
import { useBackHandler } from "@components/BackHandler";
import { isNumber } from "@resk/core";
import Platform from "@platform";
const defaultHeight = 400;
import platform from "@platform/index";

const useNativeDriver = platform.canUseNativeDriver();

const isWeb = platform.isWeb();

/**
 * Hook to prepare the bottom sheet.
 * 
 * This hook provides the necessary functionality to manage the bottom sheet's state, 
 * animation, and gestures. It returns an object with various properties and methods 
 * to control the bottom sheet.
 * 
 * @param {IUsePrepareBottomSheetProps} props - The props for the hook.
 * @returns {Object} An object with the following properties:
 *   - closeOnDragDown: Whether the bottom sheet should be closed when dragged down.
 *   - dragFromTopOnly: Whether the bottom sheet can only be dragged from the top.
 *   - panResponder: The pan responder for the bottom sheet.
 *   - animate: A function to animate the bottom sheet.
 *   - handleBackPress: A function to handle the back press event.
 *   - context: The context of the bottom sheet.
 *   - animatedProps: The animated props for the bottom sheet.
 */
export const usePrepareBottomSheet = ({
    closeOnDragDown,
    height: customHeight,
    visible: customVisible,
    animationDuration,
    dismissable,
    onDismiss,
    elevation: customElevation,
    onOpen,
    minHeight,
    dragFromTopOnly,
    fullScreen,
    cornerRadius,
    backdropOpacity = 0.5,
    animationConfig,
}: IUsePrepareBottomSheetProps) => {
    dismissable = typeof dismissable === 'boolean' ? dismissable : true;
    const theme = useTheme();
    const elevation = typeof customElevation == "number" ? customElevation : 0;
    closeOnDragDown = typeof closeOnDragDown === 'boolean' ? closeOnDragDown : true;
    animationDuration = isNumber(animationDuration) ? animationDuration : 300;
    const { height: SCREEN_HEIGHT } = Dimensions.get('window');
    const maxHeight = 0.8 * SCREEN_HEIGHT;
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [sheetHeight, setSheetHeight] = useState(0);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [sheetHeight, 0],
    });
    const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;
    const lastGestureDy = useRef(0);
    dragFromTopOnly = typeof dragFromTopOnly === 'boolean' ? dragFromTopOnly : false;
    const pan = useRef(new Animated.ValueXY()).current;
    const [visibleState, setVisibleState] = useStateCallback(typeof customVisible === 'boolean' ? customVisible : false);
    const isControlled = useMemo(() => {
        return typeof customVisible === 'boolean';
    }, [customVisible]);
    const isVisible = useMemo(() => {
        if (isControlled) return !!customVisible;
        return visibleState;
    }, [visibleState, isControlled, customVisible]);



    const callbackRef = useRef<() => void>();
    const prevCustomVisible = usePrevious(customVisible);
    useEffect(() => {
        if (!isControlled || prevCustomVisible === customVisible) {
            callbackRef.current = undefined;
            return;
        }
        if (typeof callbackRef.current == 'function') {
            callbackRef.current();
        }
        callbackRef.current = undefined;
    }, [isControlled, customVisible, prevCustomVisible]);

    const prevVisible = usePrevious(isVisible);
    const getTranslatedY = (value: number) => {
        return isWeb ? value : Dimensions.get('window').height - value;
    }
    const animatedHeight = useRef(new Animated.Value(getTranslatedY(0))).current;
    const visibleRef = useRef(isVisible);
    visibleRef.current = isVisible;
    const animatedValueRef = useRef(0);
    const borderRadius = useMemo(() => {
        if (typeof cornerRadius === 'number' && cornerRadius >= 0) {
            return cornerRadius;
        }
        if (Math.abs(SCREEN_HEIGHT - sheetHeight) <= 50) {
            return 0;
        }
        return 20;
    }, [cornerRadius, SCREEN_HEIGHT, sheetHeight])
    const context: IBottomSheetContext = ({
        get height() {
            return sheetHeight;
        },
        open: (cb?: () => void) => {
            if (isControlled) {
                callbackRef.current = cb;
                return;
            }
            setVisibleState(true, cb);
        },
        close: (cb?: () => void) => {
            animate(false, () => {
                if (isControlled) {
                    callbackRef.current = cb;
                    if (typeof onDismiss === 'function') {
                        onDismiss();
                    }
                    return;
                }
                setVisibleState(false, () => {
                    if (typeof cb === 'function') {
                        cb();
                    }
                });
            })
        },
        get isOpened() {
            return visibleRef.current;
        }
    });
    const handleBackPress = useCallback(() => {
        if (dismissable) {
            context.close();
        }
        return true;
    }, [dismissable, context]);
    useBackHandler(handleBackPress);
    const animationsRef = useRef<Animated.CompositeAnimation>(null);
    const animate = (visible: boolean, callback?: Function, start: boolean = true) => {
        const a = Animated.parallel([
            visible ? Animated.spring(animatedValue, {
                bounciness: visible ? 0 : undefined,
                ...Object.assign({}, animationConfig),
                toValue: 1,
                useNativeDriver,
            }) : Animated.timing(animatedValue, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver,
            }),
            Animated.timing(opacity, {
                toValue: visible ? 1 : 0,
                duration: animationDuration,
                useNativeDriver,
            }),
        ]);
        if (start) {
            if (animationsRef.current && typeof animationsRef.current.stop == "function") {
                animationsRef.current.stop();
            }
            (animationsRef as any).current = a;
            a.start(() => {
                if (!visible) {
                    pan.setValue({ x: 0, y: 0 });
                }
                if (typeof callback == "function") {
                    callback();
                }
                (animationsRef as any).current = null;
            })
        }
        return a;
    }
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !!closeOnDragDown,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                const newTranslateY = Math.max(0, gestureState.dy);
                // Adjust the animated value based on the gesture
                const newAnimatedValue = 1 - (newTranslateY / sheetHeight);
                animatedValue.setValue(Math.max(0, newAnimatedValue));

                // const diff = gestureState.dy > 0 ? animatedValueRef.current - gestureState.dy :
                //     Math.min(heightRef.current, animatedValueRef.current - gestureState.dy);
                // if (diff > 0 && diff !== animatedValueRef.current) {
                //     animatedHeight.setValue(getTranslatedY(diff));
                // }
            },
            onPanResponderRelease: (_, gestureState) => {
                // Threshold to determine if sheet should close
                const velocity = gestureState.vy;
                const movedDistance = gestureState.dy;
                // Close if swiped down with velocity or moved down significantly
                if (velocity > 0.5 || movedDistance > sheetHeight * 0.2) {
                    context.close();
                    return;
                }
                if (sheetHeight / 3 - gestureState.dy < 0) {
                    context.close();
                }
            },
        })
    ).current;
    useEffect(() => {
        if (prevVisible == isVisible) return;
        animate(isVisible, () => {
            if (isVisible && typeof onOpen == "function") {
                onOpen();
            }
        });
    }, [isVisible, prevVisible]);



    return {
        closeOnDragDownIcon: closeOnDragDown ? (
            <View
                {...(dragFromTopOnly && panResponder.panHandlers)}
                style={[styles.draggableContainer, Platform.isWeb() ? { cursor: 'ns-resize' } as any : null]}
                testID={"-draggable-icon-container"}
            >
                <View testID={"draggable-icon"} style={[styles.draggableIcon]} />
            </View>
        ) : null,
        dragFromTopOnly,
        panResponder,
        animate,
        handleBackPress,
        context,
        backdropStyle: [styles.backdrop, !isVisible ? Theme.styles.hidden : undefined, { backgroundColor: theme.colors.backdrop }],
        onContentLayout: (event: LayoutChangeEvent) => {
            const { height } = event.nativeEvent.layout;
            // Set sheet height based on content with a maximum limit
            const calculatedHeight = Math.min(sheetHeight, maxHeight);
            if (Math.abs(sheetHeight - calculatedHeight) > 50) {
                setSheetHeight(calculatedHeight);
            }
        },
        animatedProps: {
            ...(!dragFromTopOnly ? panResponder.panHandlers : {}),
            style: [
                styles.container,
                theme.elevations[elevation],
                {

                    borderTopRightRadius: borderRadius,
                    borderTopLeftRadius: borderRadius,
                    opacity,
                    backgroundColor: theme.colors.surface,
                    transform: [{ translateY }],
                    maxHeight: sheetHeight || maxHeight,
                },
            ],
        }
    }
};

/***
 * @interface IUsePrepareBottomSheetProps
 * An interface for the props of the usePrepareBottomSheet hook.
 */
export interface IUsePrepareBottomSheetProps {
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
     * Whether the bottom sheet can only be dragged from the top.
     * 
     * @default false
     * @examplef
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

    /***
        The minimum height of the bottom sheet.
    */
    minHeight?: number;


    /***
        Whether the Bottom sheet is full screen or not
    */
    fullScreen?: boolean;

    /***
     * The corner radius of the bottom sheet.
     * This is a number that represents the corner radius of the bottom sheet.
     * It is used to define the borderTopLeftRadius and borderTopRightRadius properties of the bottom sheet.
     */
    cornerRadius?: number;

    /**
     * Maximum opacity of the backdrop when fully opened
     * @default 0.5
     */
    backdropOpacity?: number;


    /**
     * Animation config for the bottom sheet
     */
    animationConfig?: Partial<Animated.SpringAnimationConfig>;
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

    /***
     * The height of the Bottom sheet
     */
    height: number;
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
 * @extends {IUsePrepareBottomSheetProps}
 * @see {@link IUsePrepareBottomSheetProps}, for more information about IUsePrepareBottomSheetProps interface
 */
export interface IBottomSheetProps extends IViewProps, IUsePrepareBottomSheetProps {
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


const styles = StyleSheet.create({
    backdrop: {
        position: "relative",
        flex: 1,
        justifyContent: 'flex-end',
        overflow: "hidden",
    },
    container: {
        position: "relative",
        flexGrow: 0,
        width: "100%",
        overflow: "hidden",
        alignSelf: "flex-end",
        paddingVertical: 10,
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
    keyboardVisible: {
        top: 0,
        bottom: 0,
    }
});