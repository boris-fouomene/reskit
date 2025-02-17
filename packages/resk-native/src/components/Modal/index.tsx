import React, { useEffect, useMemo, createContext, useContext, useRef } from "react";
import { useStableMemo } from "@utils";
import Platform from "@platform";
import { StyleSheet, ViewProps,Animated, Pressable, GestureResponderEvent, PressableProps, Easing } from "react-native";
import { IViewProps } from "@components/View";
import { useTheme } from "@theme";
import { Portal } from "@components/Portal";
import { MAX_WIDTH, MIN_HEIGHT } from "./utils";
import BackHandler from "@components/BackHandler";

const useNativeDriver = Platform.canUseNativeDriver()

import { useDimensions } from "@dimensions";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Modal = ({ visible, testID, maxWidth: customMaxWidth, maxHeight: customMaxHeight, contentContainerProps, animationDuration, responsive, isPreloader, dismissable, onDismiss, fullScreen: customFullScreen, backgroundOpacity: backgroundOpacityP, contentProps, ...props }: IModalProps) => {
  backgroundOpacityP = typeof backgroundOpacityP === "number" ? backgroundOpacityP : 0.5;
  contentProps = Object.assign({}, contentProps);
  animationDuration = typeof animationDuration === "number" ? animationDuration : 300;
  const { height, width, isMobileOrTablet } = useDimensions();
  const theme = useTheme();
  const { maxHeight, maxWidth } = useMemo(() => {
    const mWidth = Math.min(width, Math.max(typeof customMaxWidth === "number" ? customMaxWidth : MAX_WIDTH, MAX_WIDTH));
    const MAX_HEIGHT = (height > 600 ? (50) : 80) * height / 100;
    const mHeight = Math.min(height, Math.max(typeof customMaxHeight === "number" ? customMaxHeight : MAX_HEIGHT, MAX_HEIGHT));
    return {
      maxWidth: Math.min(mWidth, 80 * width / 100),
      maxHeight: Math.min(Math.max(mHeight, MIN_HEIGHT), height)
    }
  }, [width, height, customMaxWidth, customMaxHeight]);
  const { fullScreen, modalStyle, contentStyle } = useMemo(() => {
    const fullScreen = customFullScreen !== undefined ? customFullScreen : responsive !== false ? isMobileOrTablet : false;
    return {
      fullScreen,
      contentStyle: fullScreen ? [styles.modalFullScreen] : [{ maxWidth, maxHeight }],
      modalStyle: fullScreen ? [styles.modalFullScreen] : [styles.modalNotFullScreen, Platform.isWeb() ? { cursor: "default" } : null],
    };
  }, [isMobileOrTablet, width, height, responsive, visible, customFullScreen]);
  const children = useStableMemo(() => {
    return props.children;
  }, [props.children]) as React.ReactNode;
  contentContainerProps = Object.assign({}, contentContainerProps);
  testID = testID || "resk-modal";

  const backgroundOpacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const hiddenRef = useRef<boolean>(false);
  const generateAnimation = (value?: number) => {
    const val = typeof value == "number" ? value : visible ? backgroundOpacityP : 0;
    Animated.timing(backgroundOpacity, {
      toValue: val as number,
      duration: animationDuration,
      easing: Easing.inOut(Easing.exp),
      useNativeDriver, // Ensures smoother animation for supported props
    }).start();
  };
  useEffect(() => {
    hiddenRef.current = true;
    generateAnimation(!visible ? 0 : undefined);
  }, [visible]);
  hiddenRef.current = false;

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
  if (!visible) return null;
  return (
    <Portal style={styles.absoluteFill} testID={testID + "-modal-portal"}>
      <Animated.View
        testID={testID + "-modal-backdrop"}
        style={[
          { backgroundColor: theme.colors.backdrop },
          styles.backdrop,
          styles.absoluteFill,
          { opacity: backgroundOpacity },
        ]}
      />
      <AnimatedPressable
        testID={testID + "-modal-content-container"}
        {...contentContainerProps}
        style={[
          styles.content, styles.absoluteFill,
          modalStyle as any, 
          props.style,
          styles.notHidden,
          contentContainerProps.style,
        ]}
        onPress={(e: GestureResponderEvent) => {
          if (fullScreen || dismissable === false) return;
          handleDismiss(e);
        }}
      >
        <Animated.View
          testID={testID}
          {...props}
          style={[
            styles.content,
            { backgroundColor: theme.colors.background },
            contentStyle,
            props.style,
          ]}
        >
          <ModalContext.Provider value={{ ...props, isModal: true, modalVisible: visible as boolean, isModalClosed: () => !!!visible, isModalOpen: () => !!visible, modalMaxWidth: !fullScreen ? maxWidth : undefined, modalMaxHeight: !fullScreen ? maxHeight : undefined, handleDismiss, onDismiss, dismissable, backgroundOpacity: backgroundOpacityP, visible, responsive, fullScreen }}>
            {children}
          </ModalContext.Provider>
        </Animated.View>
      </AnimatedPressable>
    </Portal>
  );
};

/**
 * Represents the properties for a Modal component, extending the default properties of 
 * the Animated.View component from React Native Reanimated.
 * 
 * This interface extends the `Animated.AnimatedProps<ViewProps>` type to include additional 
 * properties specific to modal functionality. It allows for customization of 
 * the modal's visibility, responsiveness, fullscreen behavior, and more.
 *
 * @extends Animated.AnimatedProps<ViewProps>
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
 * @property {"up" | "right" | "left" | "down"} animationDirection - The direction from 
 * which the modal will be animated.  up - Represents an upward animation direction,
 *   right - Represents a rightward animation direction,left - Represents a leftward animation direction,
 *  down - Represents a downward animation direction.
 * 
 * @example
 * <Modal animationDirection="bottom" />
 *
 * @property {number} [animations.animationDuration] - The animationDuration of the animation in milliseconds. 
 * Defaults to 300 milliseconds if not specified.
 * 
 * @example
 * <Modal animations={{ animationDuration: 500 }} />
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
export interface IModalProps extends Animated.AnimatedProps<ViewProps> {
  /**
   * Indicates whether the modal is currently visible.
 * If set to true, the modal will be displayed; otherwise, it will be hidden. */
  visible?: boolean;
  
  /**
   * The duration of the animation in milliseconds.
   */
  animationDuration?: number;
  
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
  contentContainerProps?: Animated.AnimatedProps<PressableProps>;

  /***
   * the maximum width of the modal. This is particularly useful when the modal is not displayed in full-screen mode, allowing for better layout control.
   */
  maxWidth?: number;

  /***
   * the maximum height of the modal. This is particularly useful when the modal is not displayed in full-screen mode, allowing for better layout control.
   */
  maxHeight?: number;
}
const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
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
    pointerEvents: "none",
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
 * @property {() => boolean} [isModalOpen] - A function that determines if the modal 
 * is currently opened. Returns true if the modal is open, otherwise false.
 * 
 * @example
 * const modalContext: IModalContext = {
 *   isModalOpen: () => true,
 * };
 * console.log(modalContext.isModalOpen()); // Output: true
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
 * @property {number} [modalMaxWidth] - The maximum width of the modal. This is particularly 
 * useful when the modal is not displayed in full-screen mode, allowing for better 
 * layout control.
 * 
 * @example
 * const modalContext: IModalContext = {
 *   modalMaxWidth: 500,
 * };
 * console.log(modalContext.modalMaxWidth); // Output: 500
 *
 * @property {number} [modalMaxHeight] - The maximum height of the modal. This property 
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
  isModalOpen?: () => boolean;
  isModalClosed?: () => boolean;
  isModal: boolean;
  modalVisible?: boolean;
  modalMaxWidth?: number;
  modalMaxHeight?: number;
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
 *   const { isModalOpen, handleDismiss } = modalContext;
 *   
 *   return (
 *     <div>
 *       <button onClick={handleDismiss}>Dismiss Modal</button>
 *       <p>Is Modal Opened: {isModalOpen() ? "Yes" : "No"}</p>
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