"use client";
import { useMemo, createContext, useContext } from "react";
import { GestureResponderEvent } from "react-native";
import { Portal } from "@components/Portal";
import { useBackHandler } from "@components/BackHandler/hooks";
import { defaultStr } from "@resk/core/utils";
import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { IClassName } from "@src/types";
import { cn } from "@utils/cn";
import modalVariants, { IVariantPropsModal } from "@variants/modal";

export const Modal = ({ visible, testID, backdropClassName, onPress, variant, className, onAccessibilityEscape, containerClassName, dismissable:customDismissable, onDismiss, ...props }: IModalProps) => {
  const children = useMemo(() => {
    return props.children;
  }, [props.children]);
  const dismissable = customDismissable !== false;
  testID = defaultStr(testID, "resk-modal");
  const modalVariant = modalVariants(variant);
  const handleDismiss = (e?: GestureResponderEvent | KeyboardEvent): any => {
    if (typeof onDismiss == "function") {
      onDismiss(e);
    }
    return true;
  }
  useBackHandler(dismissable ? handleDismiss : () => true);
  return (
    <Portal absoluteFill visible={visible} 
      testID={testID + "-modal-portal"} 
      handleOnPressOnlyOnTarget={true}
      onPress={dismissable ? handleDismiss : undefined} withBackdrop className={cn("modal-portal-container", modalVariant.container(), backdropClassName)}
      onAccessibilityEscape={() => {
          if (typeof onAccessibilityEscape === "function") {
            onAccessibilityEscape();
          }
          if (dismissable === false) return;
          handleDismiss(undefined as any);
      }}
    >
      <Div
          {...props}
          testID={testID}
          className={cn("resk-modal transition-opacity duration-500", modalVariant.content(), className)}
          onPress={(e: GestureResponderEvent) => {
            console.log(e," is pressedddd");
            typeof e?.stopPropagation == "function" && e.stopPropagation();
            typeof e?.preventDefault == "function" && e.preventDefault();
            if (typeof onPress == "function") {
              onPress(e);
            }
            return false;
          }}
        >
          <ModalContext.Provider value={{ isVisible: visible as boolean, isClosed: () => !!!visible, isOpen: () => !!visible, handleDismiss, dismissable: dismissable !== false }}>
            {children}
          </ModalContext.Provider>
        </Div>
    </Portal>
  );
};

export interface IModalProps extends IHtmlDivProps {
  /**
   * Indicates whether the modal is currently visible.
 * If set to true, the modal will be displayed; otherwise, it will be hidden. */
  visible?: boolean;

  backdropClassName?: IClassName;
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

  containerClassName?: IClassName;

  onAccessibilityEscape?: IHtmlDivProps["onAccessibilityEscape"];

  variant?: IVariantPropsModal;
}

export interface IModalContext {
  isOpen?: () => boolean;
  isClosed?: () => boolean;
  isVisible?: boolean;
  handleDismiss: (e: GestureResponderEvent | KeyboardEvent) => any;
  dismissable: boolean;
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
 *   const { isOpen, handleDismiss } = modalContext;
 *   
 *   return (
 *     <div>
 *       <button onClick={handleDismiss}>Dismiss Modal</button>
 *       <p>Is Modal Opened: {isOpen() ? "Yes" : "No"}</p>
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
 * import * as React from 'react';
 * import { useModal } from './path/to/useModal';
import { disabled } from '../../../../../../frontend-dash/src/decorators/all/index';
 *
 * const ModalComponent = () => {
 *   const modalContext = useModal();
 *   
 *   if (!modalContext) {
 *     return <div>No modal context available</div>;
 *   }
 *   
 *   const { isVisible, handleDismiss } = modalContext;
 *   
 *   return (
 *     <div>
 *       <h1>{isVisible ? "Modal is Open" : "Modal is Closed"}</h1>
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