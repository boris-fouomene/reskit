import React, { useEffect, useMemo, createContext, useContext, useRef } from "react";
import { useStableMemo, usePrevious } from "@utils";
import Platform from "@platform";
import { StyleSheet, ViewProps, Pressable, GestureResponderEvent, PressableProps } from "react-native";
import View, { IViewProps } from "@components/View";
import { useTheme } from "@theme";
import { Portal } from "@components/Portal";
import { MAX_WIDTH, MIN_WIDTH, MIN_HEIGHT } from "./utils";
import BackHandler from "@components/BackHandler";
import { ReanimatedView, IReanimatedViewProp } from "@components/ReanimatedView";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  AnimatedProps,
} from "react-native-reanimated";
import { useDimensions } from "@dimensions";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


export const Modal = ({ visible, testID, type = "fade", contentContainerProps, duration = 300, responsive, isPreloader, dismissable, onDismiss, fullScreen: customFullScreen, backgroundOpacity: backgroundOpacityP, contentProps, ...props }: IModalProps) => {
  backgroundOpacityP = typeof backgroundOpacityP === "number" ? backgroundOpacityP : 0.5;
  contentProps = Object.assign({}, contentProps);
  duration = typeof duration === "number" ? duration : 300;
  const { height, width, isMobileOrTablet } = useDimensions(responsive !== false);
  const prevVisible = usePrevious(visible);
  const isHidden = prevVisible === visible && !visible;
  const theme = useTheme();
  const { maxHeight, maxWidth } = useMemo(() => {
    return {
      maxHeight: Math.min(MAX_WIDTH, 80 * width / 100),
      maxWidth: Math.max((height > 600 ? (50) : 70) * height / 100, MIN_HEIGHT)
    }
  }, [width, height]);
  const { fullScreen, modalStyle, contentStyle } = useMemo(() => {
    const fullScreen = customFullScreen !== undefined ? customFullScreen : responsive !== false ? isMobileOrTablet : false;
    return {
      fullScreen,
      contentStyle: fullScreen ? [styles.modalFullScreen] : [{ maxWidth, maxHeight }],
      modalStyle: fullScreen ? [styles.modalFullScreen] : [styles.modalNotFullScreen, Platform.isWeb() ? { cursor: "default" } : null],
    };
  }, [isMobileOrTablet, responsive, visible, customFullScreen]);
  const children = useStableMemo(() => {
    return props.children;
  }, [props.children]) as React.ReactNode;
  contentContainerProps = Object.assign({}, contentContainerProps);
  testID = testID || "RNModal";

  const backgroundOpacity = useSharedValue(visible ? 1 : 0);
  const hiddenRef = useRef<boolean>(false);
  const generateBackgroundOpacity = (value?: number) => {
    const val = typeof value == "number" ? value : visible ? backgroundOpacityP : 0;
    backgroundOpacity.value = withTiming(val as number, {
      duration,
      easing: Easing.inOut(Easing.ease),
    });
  };
  useEffect(() => {
    hiddenRef.current = true;
    generateBackgroundOpacity(!visible ? 0 : undefined);
  }, [visible]);
  hiddenRef.current = false;
  const animatedStyle = null;

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });
  const handleDismiss = (e: GestureResponderEvent | KeyboardEvent): any => {
    if (onDismiss) {
      onDismiss(e);
    }
    return true;
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      function (event: KeyboardEvent) {
        if (dismissable === false) return true;
        return handleDismiss(event);
      },
    );
    return () => backHandler?.remove();
  }, []);

  return (
    <Portal>
      <ReanimatedView
        testID={testID}
        {...props}
        style={[
          { backgroundColor: theme.colors.backdrop },
          styles.backdrop,
          styles.absoluteFill,
          backgroundAnimatedStyle,
          !visible && styles.hidden,
          props.style,
        ]}
        pointerEvents="none"
      />
      <AnimatedPressable
        testID={testID + "_ModalContentContainer"}
        {...contentContainerProps}
        style={[
          styles.content, styles.absoluteFill,
          modalStyle, props.style,
          isHidden && styles.hidden || styles.notHidden,
          contentContainerProps.style,
          !visible && styles.hidden,
        ]}
        onPress={(e: GestureResponderEvent) => {
          if (fullScreen || dismissable === false) return;
          handleDismiss(e);
        }}
      >
        <View
          testID={testID + "_ModalContent"}
          {...contentProps}
          style={[
            styles.content,
            { backgroundColor: theme.colors.background },
            contentStyle,
            contentProps.style,
          ]}
        >
          <ModalContext.Provider value={{ ...props, modalVisible: visible as boolean, isModalClosed: () => !!!visible, isModalOpened: () => !!visible, maxWidth: !fullScreen ? maxWidth : undefined, maxHeight: !fullScreen ? maxHeight : undefined, handleDismiss, onDismiss, dismissable, backgroundOpacity: backgroundOpacityP, visible, responsive, fullScreen }}>
            {children}
          </ModalContext.Provider>
        </View>
      </AnimatedPressable>
    </Portal>
  );
};

/**
 * Represents the properties for a Modal component, extending the default properties of 
 * the Animated.View component from React Native Reanimated.
 * 
 * This interface extends the `IReanimatedViewProp` type to include additional 
 * properties specific to modal functionality. It allows for customization of 
 * the modal's visibility, responsiveness, fullscreen behavior, and more.
 *
 * @extends IReanimatedViewProp
 *
 * @interface IModalProps
 * @extends AnimatedProps<ViewProps>
 *
 * @property {boolean} [visible] - Indicates whether the modal is currently visible.
 * If set to true, the modal will be displayed; otherwise, it will be hidden.
 * 
 * @example
 * <Modal visible={true} />
 *
 * @property {boolean} [responsive] - Determines if the modal should be responsive. 
 * When set to true, the modal will occupy the full screen in mobile or tablets environments 
 * and a portion of the screen in desktop environments.
 * 
 * @example
 * <Modal responsive={true} />
 *
 * @property {boolean} [fullScreen] - Specifies whether the modal should be rendered 
 * in full screen. If true, the modal will take up the entire screen space.
 * 
 * @example
 * <Modal fullScreen={true} />
 *
 * @property {Object} [animations] - Configuration for modal animations.
 * 
 * 
 * @example
 * <Modal animations={{ fade: true }} />
 *
 * @property {"top" | "bottom" | "left" | "right"} animations.from - The direction from 
 * which the modal will be animated. Can be one of: "top", "bottom", "left", or "right".
 * 
 * @example
 * <Modal animations={{ from: "bottom" }} />
 *
 * @property {boolean} [animations.damping] - Indicates whether the animation should 
 * be damped. If true, the animation will have a damping effect.
 * 
 * @example
 * <Modal animations={{ damping: true }} />
 *
 * @property {number} [animations.duration] - The duration of the animation in milliseconds. 
 * Defaults to 300 milliseconds if not specified.
 * 
 * @example
 * <Modal animations={{ duration: 500 }} />
 *
 * @property {(event?: GestureResponderEvent | KeyboardEvent) => any} [onDismiss] - 
 * A callback function that is called when an attempt is made to close the modal. 
 * The event parameter can be either a GestureResponderEvent or a KeyboardEvent.
 * 
 * @example
 * const handleDismiss = (event) => {
 *   console.log("Modal dismissed", event);
 * };
 * <Modal onDismiss={handleDismiss} />
 *
 * @property {boolean} [dismissable] - When set to true, pressing the backdrop 
 * will close the modal. Defaults to true unless specified otherwise.
 * 
 * @example
 * <Modal dismissable={true} />

 * @property {number} [backgroundOpacity] - The opacity level of the background 
 * when the modal is displayed. Defaults to 0.5 if not specified.
 * 
 * @example
 * <Modal backgroundOpacity={0.8} />
 *
 * @property {IViewProps} [contentProps] - Properties for the content wrapper component 
 * that wraps the children of the modal. This allows for further customization of 
 * the modal's content.
 * 
 * @example
 * <Modal contentProps={{ style: { padding: 20 } }} />
 *
 * @property {boolean} [isPreloader] - Specifies if the modal is a preloader. 
 * If true, the modal can be styled or behaved differently to indicate loading status.
 * 
 * @example
 * <Modal isPreloader={true} />
 */
export interface IModalProps extends IReanimatedViewProp {
  /**
   * Indicates whether the modal is currently visible.
 * If set to true, the modal will be displayed; otherwise, it will be hidden. */
  visible?: boolean;
  /**
   *  Determines if the modal should be responsive. 
  * When set to true, the modal will occupy the full screen in mobile or tablets environments 
  * and a portion of the screen in desktop environments.
   */
  responsive?: boolean;
  /**
   * Specifies whether the modal should be rendered in full screen. If true, the modal will take up the entire screen space.
   */
  fullScreen?: boolean;
  /**
   * A callback function that is called when an attempt is made to close the modal. 
   * The event parameter can be either a GestureResponderEvent or a KeyboardEvent.
   * @param event 
   * @returns 
   */
  onDismiss?: (event?: GestureResponderEvent | KeyboardEvent) => any;

  /***
   * When set to true, pressing the backdrop will close the modal. Defaults to true unless specified otherwise.
   */
  dismissable?: boolean;

  /***
   * The opacity level of the background when the modal is displayed. Defaults to 0.5 if not specified.
   */
  backgroundOpacity?: number;
  /**
   * Properties for the content wrapper component that wraps the children of the modal. This allows for further customization of the modal's content.
   */
  contentProps?: IViewProps;
  /**
   * Specifies if the modal is a preloader. If true, the modal can be styled or behaved differently to indicate loading status.
   */
  isPreloader?: boolean;

  /***
   * Properties for the content wrapper component that wraps the children of the modal. This allows for further customization of the modal's content.
   */
  contentContainerProps?: AnimatedProps<PressableProps>;
}
const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  container: {
    ...StyleSheet.absoluteFillObject,

  },
  hidden: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  notHidden: {
    width: "100%",
    height: "100%",
  },
  content: {
    flexDirection: "column",
  },
  backdrop: {
    flex: 1,
  },
  backdropContent: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  modalFullScreen: {
    maxWidth: "100%",
    maxHeight: "100%",
    flex: 1,
  },
  modalNotFullScreen: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});

/**
 * Represents the context properties for a Modal component, extending the properties 
 * of IModalProps. This interface provides additional functionalities for managing 
 * the modal's state and dimensions.
 *
 * @interface IModalContext
 * @extends IModalProps
 *
 * @property {() => boolean} [isModalOpened] - A function that determines if the modal 
 * is currently opened. Returns true if the modal is open, otherwise false.
 * 
 * @example
 * const modalContext: IModalContext = {
 *   isModalOpened: () => true,
 * };
 * console.log(modalContext.isModalOpened()); // Output: true
 *
 * @property {() => boolean} [isModalClosed] - A function that determines if the modal 
 * is currently closed. Returns true if the modal is closed, otherwise false.
 * 
 * @example
 * const modalContext: IModalContext = {
 *   isModalClosed: () => false,
 * };
 * console.log(modalContext.isModalClosed()); // Output: false
 *
 * @property {boolean} [modalVisible] - The current visibility status of the modal. 
 * This property can be used to check if the modal is visible or not.
 * 
 * @example
 * const modalContext: IModalContext = {
 *   modalVisible: true,
 * };
 * console.log(modalContext.modalVisible); // Output: true
 *
 * @property {number} [maxWidth] - The maximum width of the modal. This is particularly 
 * useful when the modal is not displayed in full-screen mode, allowing for better 
 * layout control.
 * 
 * @example
 * const modalContext: IModalContext = {
 *   maxWidth: 500,
 * };
 * console.log(modalContext.maxWidth); // Output: 500
 *
 * @property {number} [maxHeight] - The maximum height of the modal. This property 
 * is utilized when the modal is not in full-screen mode, providing constraints on 
 * its height.
 * 
 * @example
 * const modalContext: IModalContext = {
 *   maxHeight: 400,
 * };
 * console.log(modalContext.maxHeight); // Output: 400
 *
 * @property {(e: GestureResponderEvent | KeyboardEvent) => any} [handleDismiss] - 
 * A function that is called when the modal needs to be dismissed. The event parameter 
 * can be either a GestureResponderEvent or a KeyboardEvent, allowing for flexible handling 
 * of dismissal actions.
 * 
 * @example
 * const handleModalDismiss = (event) => {
 *   console.log("Modal dismissed", event);
 * };
 * const modalContext: IModalContext = {
 *   handleDismiss: handleModalDismiss,
 * };
 * modalContext.handleDismiss(new KeyboardEvent("keydown")); // Output: Modal dismissed [KeyboardEvent]
 */
export interface IModalContext extends IModalProps {
  isModalOpened?: () => boolean;
  isModalClosed?: () => boolean;
  modalVisible?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  handleDismiss?: (e: GestureResponderEvent | KeyboardEvent) => any;
}

/**
 * Creates a context for managing modal states and properties in a React application.
 * The ModalContext provides a way to share modal-related data and functions 
 * throughout the component tree without having to pass props down manually at every level.
 *
 * @constant ModalContext
 * @type {React.Context<IModalContext | null>}
 *
 * @example
 * // Example of using ModalContext in a component
 * import React, { useContext } from 'react';
 * import { ModalContext } from './path/to/ModalContext';
 *
 * const ModalConsumerComponent = () => {
 *   const modalContext = useContext(ModalContext);
 *   
 *   if (!modalContext) {
 *     return <div>No Modal Context available</div>;
 *   }
 *   
 *   const { isModalOpened, handleDismiss } = modalContext;
 *   
 *   return (
 *     <div>
 *       <button onClick={handleDismiss}>Dismiss Modal</button>
 *       <p>Is Modal Opened: {isModalOpened() ? "Yes" : "No"}</p>
 *     </div>
 *   );
 * };
 *
 * @remarks
 * The context is initialized with a value of `null`, indicating that it may not be 
 * provided by a parent component. Components that consume this context should handle 
 * the possibility of it being null and provide a fallback or error handling as needed.
 *
 * It is recommended to wrap components that need access to this context with a 
 * corresponding provider that supplies the necessary modal state and functions.
 *
 * @see IModalContext for details on the properties and methods available in this context.
 */
const ModalContext = createContext<IModalContext | null>(null);

/**
 * A custom hook that provides access to the modal context. 
 * This hook allows components to easily consume the modal context 
 * without needing to use the `useContext` hook directly.
 *
 * @function useModal
 * @returns {IModalContext | null} The current modal context value, which includes 
 * properties and methods for managing modal state. Returns null if the context 
 * is not available, indicating that the component is not wrapped in a corresponding 
 * provider.
 *
 * @example
 * // Example of using the useModal hook in a component
 * import React from 'react';
 * import { useModal } from './path/to/useModal';
 *
 * const ModalComponent = () => {
 *   const modalContext = useModal();
 *   
 *   if (!modalContext) {
 *     return <div>No modal context available</div>;
 *   }
 *   
 *   const { modalVisible, handleDismiss } = modalContext;
 *   
 *   return (
 *     <div>
 *       <h1>{modalVisible ? "Modal is Open" : "Modal is Closed"}</h1>
 *       <button onClick={handleDismiss}>Close Modal</button>
 *     </div>
 *   );
 * };
 *
 * @remarks
 * This hook should be used within components that are descendants of the 
 * `ModalContext.Provider`. If used outside of this provider, it will return null, 
 * and the consuming component should handle this case appropriately.
 *
 * @see ModalContext for more information about the context and its provider.
 */
export const useModal = (): IModalContext | null => useContext(ModalContext);