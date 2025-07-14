"use client";
import { Modal } from "@components/Modal";
import { AppBar, IAppBarActionProps, IAppBarProps } from "@components/AppBar";
import { Fragment, ReactNode, useCallback, useMemo, Context, useImperativeHandle, Ref } from 'react';
import { cn, Component as AppComponent, createProvider, isValidElement, useDimensions } from "@utils";
import { Dimensions, ScrollView } from "react-native";
import { defaultStr, isObj } from "@resk/core/utils";
import { Backdrop } from "@components/Backdrop";
import { dialogVariant } from "@variants/dialog";
import { Div } from "@html/Div";
import { Text } from "@html/Text";
import { IModalProps } from "@components/Modal/types";
import { IUseDimensionsOptons } from "@utils/dimensions";
import { IClassName } from "@src/types";
import { IDialogVariant } from "@variants/dialog";
import { i18n } from "@resk/core/i18n";
import { ITextVariant, textVariant } from "@variants/text";
import { INavItems } from "@components/Nav";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { IActivityIndicatorVariant } from "@variants/activityIndicator";

/**
 * Dialog component for displaying modal dialogs with flexible configuration.
 *
 * This is the main entry point for rendering a dialog. It supports both controlled and uncontrolled usage,
 * and provides a consistent API for displaying dialogs with titles, subtitles, actions, and custom base.
 *
 * @typeParam Context - The type of the custom context object passed to the dialog.
 *
 * @param props - The dialog properties.
 * @returns The rendered dialog component.
 * 
 * This component is responsible for rendering the dialog UI, including the app bar,
 * title, subtitle, actions, and base. It supports both full-screen and modal modes,
 * and can be customized with various props for responsive layouts, scrollable base,
 * and custom actions.
 *
 * @param props - The properties used to configure the dialog.
 * @param props.appBarProps - Additional props for the AppBar component.
 * @param props.context - Custom context object to be passed to the dialog.
 * @param props.actions - Array of action objects to display in the app bar.
 * @param props.title - The title of the dialog.
 * @param props.subtitle - The subtitle of the dialog.
 * @param props.titleClassName - Custom class name for the title.
 * @param props.subtitleClassName - Custom class name for the subtitle.
 * @param props.children - The children to display inside the dialog.
 * @param props.testID - Test identifier for the dialog (for testing purposes).
 * @param props.useDimensionsOptions - Options for the useDimensions hook to control responsive behavior.
 * @param props.fullScreen - If true, the dialog will be displayed in full-screen mode.
 * @param props.fullScreenOnMobile - If true, the dialog will be full-screen on mobile devices.
 * @param props.fullScreenOnTablet - If true, the dialog will be full-screen on tablets.
 * @param props.onRequestClose - Callback invoked when the dialog requests to close.
 * @param props.withScrollView - If true, wraps the content in a ScrollView for scrollable base.
 * @param props.scrollViewClassName - Custom class name for the ScrollView.
 * @param props.scrollViewContentContainerClassName - Custom class name for the ScrollView content container.
 * @param props.contentClassName - Custom class name for the dialog base.
 * @param props.appBarClassName - Custom class name for the app bar.
 * @param props.variant - Variant configuration for dialog styling.
 * @param props.containerClassName - Custom class name for the content container.
 * @param props.dialogControlledContext - Reference to the controlled dialog context (if controlled).
 * @param props.ref - Ref to access the dialog context imperatively.
 * @returns The rendered dialog component.
 *
 * @example
 * ```tsx
 * <DialogControllable
 *   title="My Dialog"
 *   subtitle="Dialog Subtitle"
 *   actions={[
 *     { label: "Close", onPress: () => console.log("Closed") }
 *   ]}
 *   fullScreenOnMobile
 *   withScrollView
 * >
 *   <Text>This is the dialog base.</Text>
 * </DialogControllable>
 * ```
 *
 * @remarks
 * - The dialog adapts its layout based on device type (mobile, tablet, desktop).
 * - Actions can be conditionally shown in full-screen mode using `showInFullScreen`.
 * - Use the `variant` prop to customize the dialog's appearance.
 * - The dialog can be controlled externally via the `dialogControlledContext` prop.
 *
 *
 * @example
 * ```tsx
 * <Dialog
 *   title="Welcome"
 *   subtitle="Please confirm your action"
 *   actions={[
 *     { label: "Cancel", onPress: () => setOpen(false) },
 *     { label: "Confirm", onPress: handleConfirm }
 *   ]}
 *   fullScreenOnMobile
 * >
 *   <Text>This is a dialog body.</Text>
 * </Dialog>
 * ```
 *
 * @see DialogControllable
 * @see DialogControlled
 * @see DialogAlert
 */
export function Dialog<Context = unknown>(props: IDialogProps<Context>) {
  return <DialogControllable<Context, false>  {...props} dialogControlledContext={undefined} />
}


function DialogControllable<Context = unknown, IsControlled extends boolean = false>({
  appBarProps,
  context: customContext,
  actions,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  children: dialogChildren,
  testID,
  useDimensionsOptions,
  fullScreen,
  fullScreenOnMobile,
  fullScreenOnTablet,
  onRequestClose,
  withScrollView,
  scrollViewClassName,
  scrollViewContentContainerClassName,
  appBarClassName,
  variant,
  className,
  containerClassName,
  dialogControlledContext,
  ref,
  ...props
}: IDialogControllableProps<Context, IsControlled>) {
  testID = defaultStr(testID, "resk-dialog");
  const { isTablet, isDesktop, isMobile, isMobileOrTablet } = useDimensions(useDimensionsOptions);
  const isFullScreen = useMemo(() => {
    return !!(fullScreen || (fullScreenOnMobile && isMobile) || (fullScreenOnTablet && isTablet));
  }, [fullScreen, isMobile, isTablet]);
  const computedVariant = dialogVariant({ ...variant, fullScreen: isFullScreen });
  const handleRequestClose = useCallback((event: any) => {
    if (typeof onRequestClose == "function") {
      return onRequestClose(event);
    }
  }, [onRequestClose]);
  const { context, appBar, titleContent } = useMemo(() => {
    const titleClx = cn("resk-dialog-title", computedVariant.title(), !isFullScreen && computedVariant.modalTitle(), appBarProps?.titleClassName, titleClassName);
    const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
    const deviceLayout = { windowWidth, windowHeight, isTablet, isDesktop, isMobile, screenWidth: Dimensions.get("screen").width, screenHeight: Dimensions.get("screen").height };
    const insControlled = dialogControlledContext instanceof DialogControlled;
    const context: IDialogContext<Context, IsControlled> = Object.assign({}, customContext, { deviceLayout }, { dialog: insControlled ? dialogControlledContext : { close: handleRequestClose, isFullScreen: () => isFullScreen, isControlled: () => { return false as boolean; } } }) as any;
    const appBarActions: IAppBarActionProps<IDialogContext<Context, IsControlled>>[] = [];
    if (insControlled) {
      dialogControlledContext.setDialogRef({ isFullScreen, deviceLayout });
    }
    if (Array.isArray(actions) && actions.length) {
      actions.map((act) => {
        if (!act || !isObj(act) || isFullScreen && act.showInFullScreen === false) {
          return;
        }
        const cloned = Object.clone(act);
        const { onPress, showInFullScreen, closeOnPress } = cloned;
        delete cloned.showInFullScreen;
        cloned.onPress = async (event: any, context) => {
          if (typeof onPress == "function" && await onPress(event, context) === false) {
            return;
          }
          if (closeOnPress === false) return;
          handleRequestClose(event);
        }
        appBarActions.push(cloned);
      });
    }
    const canRenderAppBar = isFullScreen || appBarActions.length;
    return {
      context,
      titleContent: isFullScreen && title ? null : <Text className={cn("resk-dialog-modal-title", titleClx)} testID={testID + "-title"}>{title}</Text>,
      appBar: !canRenderAppBar ? null : <AppBar<IDialogContext<Context, IsControlled>>
        maxVisibleActions={isFullScreen ? undefined : 2}
        backAction={!isFullScreen ? false : undefined}
        onBackActionPress={handleRequestClose}
        {...appBarProps}
        actionsProps={{ ...appBarProps?.actionsProps, actionClassName: cn("resk-dialog-actions", computedVariant.action(), appBarProps?.actionsProps?.actionClassName) }}
        context={context}
        actions={appBarActions}
        title={isFullScreen ? title : undefined}
        subtitle={isFullScreen ? subtitle : undefined}
        className={cn("resk-dialog-app-bar", computedVariant.appBar(), appBarProps?.className, appBarClassName)}
        titleClassName={titleClx}
        subtitleClassName={cn("resk-dialog-subtitle", computedVariant.subtitle(), appBarProps?.subtitleClassName, subtitleClassName)}
      />
    }
  }, [fullScreen, variant, appBarProps, isTablet, isDesktop, isMobile, isMobileOrTablet, handleRequestClose, appBarClassName, titleClassName, subtitleClassName, customContext, appBarProps, title, subtitle]);
  const children = useMemo(() => {
    return isValidElement(dialogChildren)
      ? (dialogChildren as ReactNode)
      : null;
  }, [dialogChildren]);
  const { Component: Wrapper, props: wrapperProps } = useMemo(() => {
    const canRenderScrollView = withScrollView !== false;
    return {
      Component: canRenderScrollView ? ScrollView : Fragment,
      props: canRenderScrollView ? { testID: testID + "-scrollview", className: cn("resk-dialog-scroll-view", computedVariant.scrollView(), scrollViewClassName), containerClassName: cn("resk-dialog-scroll-view-container", computedVariant.scrollViewContentContainer(), scrollViewContentContainerClassName) } : {}
    }
  }, [withScrollView, scrollViewClassName, testID, scrollViewContentContainerClassName]);
  useImperativeHandle(ref, () => context);
  return (
    <Modal animationType="fade" {...props}
      testID={testID + "-modal"}
      onRequestClose={handleRequestClose}
      backdropClassName={cn("resk-dialog-backdrop", computedVariant.modalbackdrop())}
      className={cn("resk-dialog-modal", computedVariant.modal())}
    >
      <Div className={cn("resk-dialog-container", computedVariant.container(), containerClassName)}>
        {!isFullScreen && props.dismissible !== false ? <Backdrop testID={testID + "-dialog-backdrop"} className={cn("resk-dialog-backdrop")} onPress={handleRequestClose} /> : null}
        <Div
          testID={testID}
          className={cn("resk-dialog", computedVariant.base(), isFullScreen && computedVariant.fullScreen(), className)}
        >
          {isFullScreen ? appBar : titleContent}
          <Wrapper {...wrapperProps}>
            {children}
          </Wrapper>
          {!isFullScreen ? appBar : null}
        </Div>
      </Div>
    </Modal>
  );
}

class DialogControlled<Context = unknown> extends AppComponent<IDialogControlledProps<Context>, IDialogControlledState<Context>> {
  constructor(props: IDialogControlledProps<Context>) {
    super(props);
    this.state = {
      visible: false,
      controlledProps: props,
    };
  }
  private dialogRef: { isFullScreen: boolean, deviceLayout: IDialogContext["deviceLayout"] } | null = null;
  setDialogRef(ref: { isFullScreen: boolean, deviceLayout: IDialogContext["deviceLayout"] }) {
    if (ref) {
      this.dialogRef = ref;
    }
  }
  isFullScreen() {
    return !!this.dialogRef?.isFullScreen;
  }
  isControlled() {
    return false;
  }
  invokeCallback(callback?: IDialogControlledCallback<Context>) {
    if (typeof callback == 'function') {
      callback(this);
    }
  }
  openOrClose(visible: boolean, options?: IDialogControlledOptions<Context>, callback?: IDialogControlledCallback<Context>) {
    const newState: IDialogControlledState<Context> = { visible } as any;
    if (options && isObj(options)) {
      newState.controlledProps = options;
    }
    this.setState(newState, () => {
      this.invokeCallback(callback);
    });
    return this;
  }
  toggle(options?: IDialogControlledOptions<Context>, callback?: IDialogControlledCallback<Context>) {
    return this.openOrClose(!this.state.visible, options, callback);
  }
  open(options?: IDialogControlledOptions<Context>, callback?: IDialogControlledCallback<Context>) {
    return this.openOrClose(true, options, callback);
  }
  close(callback?: IDialogControlledCallback<Context>) {
    return this.openOrClose(false, undefined, callback);
  }
  /**
   * Checks if the dialog is currently open.
   * 
   * @returns True if the dialog is open, otherwise false.
   */
  isOpen() {
    return this.state.visible;
  }
  /**
   * Checks if the dialog is currently closed.
   * 
   * @returns True if the dialog is closed, otherwise false.
   */
  isClosed() {
    return !this.state.visible;
  }
  getOptions(): IDialogControlledOptions<Context> {
    return this.state.controlledProps;
  }
  /**
   * Gets the test identifier for the dialog.
   * 
   * @returns The test ID string for the dialog.
   */
  getTestID(): string {
    const { testID } = this.getOptions();
    return defaultStr(testID, "resk-dialog-controlled");
  }
  render() {
    const { onRequestClose, ...props } = this.getOptions();
    return <DialogControllable<Context, true>
      {...props}
      testID={this.getTestID()}
      dialogControlledContext={this}
      visible={this.state.visible}
      onRequestClose={(event) => {
        if (typeof onRequestClose === 'function' && onRequestClose(event)) return true;
        this.close();
      }}
    />
  }
}


const DialogProvider = createProvider<IDialogControlledProps, DialogControlled>(DialogControlled, { dismissible: false });

const DialogAlert = createProvider<IDialogControlledProps, DialogControlled, IDialogControlledCallback>(DialogControlled, { dismissible: false, fullScreen: false });
const { open } = DialogAlert;

DialogAlert.open = function <Context = unknown>(props: IDialogControlledProps<Context> & {
  message?: ReactNode;

  // Primary action (usually positive/confirm action)
  confirmButton?: false | IDialogControlledActionProps<Context>;

  // Secondary action (usually negative/cancel action)  
  cancelButton?: false | IDialogControlledActionProps<Context>;

  // Layout control
  buttonsOrder?: "confirm-cancel" | "cancel-confirm";

  // Convenience event handlers
  onConfirm?: IDialogControlledActionProps<Context>["onPress"];
  onCancel?: IDialogControlledActionProps<Context>["onPress"];

  // Message styling
  messageVariant?: ITextVariant;
  messageClassName?: IClassName;
}, innerProviderRef?: Ref<DialogControlled<Context>>, callback?: IDialogControlledCallback<Context>) {
  const {
    confirmButton: confirmConfig,
    cancelButton: cancelConfig,
    onConfirm,
    onCancel,
    buttonsOrder = "cancel-confirm",
    message,
    messageClassName,
    messageVariant,
    children,
    ...rest
  } = Object.assign({}, props);
  const testID = defaultStr(rest.testID, "resk-dialog-alert");
  // Configure confirm button
  const confirmButton: IDialogControlledActionProps<Context> | undefined = confirmConfig === false ? undefined : {
    label: i18n.t("components.dialog.alert.confirmButton"),
    variant: { colorScheme: "primary", padding: 2 },
    testID: testID + "-confirm-button",
    ...confirmConfig,
    onPress: typeof confirmConfig?.onPress === "function" ? confirmConfig?.onPress : onConfirm
  };

  // Configure cancel button  
  const cancelButton: IDialogControlledActionProps<Context> | undefined = cancelConfig === false ? undefined : {
    label: i18n.t("components.dialog.alert.cancelButton"),
    variant: { colorScheme: "error", padding: 2 },
    showInFullScreen: false,
    testID: testID + "-cancel-button",
    ...cancelConfig,
    onPress: typeof cancelConfig?.onPress == "function" ? cancelConfig?.onPress : onCancel
  };

  // Arrange buttons based on order preference
  const actions = String(buttonsOrder).toLowerCase() === "confirm-cancel" ? [confirmButton, cancelButton] : [cancelButton, confirmButton];

  return open({
    ...rest,
    dismissible: false,
    testID,
    children: (
      <Text
        testID={testID + "-message"}
        className={cn("resk-dialog-alert-message", textVariant({ padding: 4, ...messageVariant }), messageClassName)}
      >
        {message}
      </Text>
    ),
    actions: (Array.isArray(props?.actions) && props.actions.length ? props.actions : actions) as IDialogControlledActionProps<Context>[],
  } as any, innerProviderRef, callback as any);
}

export const Preloader = createProvider<Omit<IDialogControlledProps, "children"> & { content?: ReactNode, textClassName?: IClassName; textVariant?: ITextVariant; contentContainerClassName?: IClassName; activityIndicatorPosition?: "left" | "right", withActivityIndicator?: boolean, activityIndicatorVariant?: IActivityIndicatorVariant; activityIndicatorClassName?: IClassName }, DialogControlled>(DialogControlled, { dismissible: false, fullScreen: false },
  (options) => {
    options.withScrollView = typeof options.withScrollView === "boolean" ? options.withScrollView : false;
    options.variant = { padding: 2, ...options.variant };
    const testID = options.testID = defaultStr(options.testID, "resk-dialog-preloader");
    const { content: children, activityIndicatorVariant, textClassName, textVariant: tVariant, withActivityIndicator, activityIndicatorClassName, contentContainerClassName, activityIndicatorPosition, ...rest } = options;
    const content = isValidElement(children, false) ? children : <Text numberOfLines={10} testID={testID + "-content"} variant={{ marginX: 2, ...tVariant }} className={cn("resk-preloader-content", textClassName)}>{children as ReactNode || 'Loading...'}</Text>;
    const indicator = withActivityIndicator === false ? null : <ActivityIndicator size={"large"} variant={{ marginX: 2, ...activityIndicatorVariant }} className={cn("resk-dialog-preloader-indicator", activityIndicatorClassName)} />;
    const indicatorOnRight = activityIndicatorPosition === "right";
    (rest as any).children = indicator ? <Div testID={testID + "-content-container"} className={cn("resk-dialog-preloader-container flex flex-row items-center justify-start py-1 flex-wrap", contentContainerClassName)}>
      {!indicatorOnRight ? indicator : null}
      {content as ReactNode}
      {indicatorOnRight ? indicator : null}
    </Div> : content;
    return rest;
  });

/**
 * Exposes static members for Dialog-related components and providers.
 *
 * @property Provider - The DialogProvider class for global dialog management.
 * @property Controlled - The DialogControlled class for imperative dialog control.
 * @property Alert - The DialogAlert class for alert/confirmation dialogs.
 *
 * @example
 * ```tsx
 * // Access the Dialog provider to open dialogs globally
 * Dialog.Provider.getProviderInstance()?.open({
 *   title: "Global Dialog",
 *   children: <Text>This dialog is managed by the provider.</Text>
 * });
 *
 * // Use Dialog.Alert for quick alert dialogs
 * Dialog.Alert.open({
 *   title: "Delete Item",
 *   message: "Are you sure you want to delete this item?",
 *   onConfirm: () => { },
 *   onCancel: () => { }
 * });
 * ```
 *
 * @remarks
 * - Use `Dialog.Provider` to wrap your application for global dialog access.
 * - Use `Dialog.Controlled` for advanced, imperative dialog control.
 * - Use `Dialog.Alert` for simple confirmation or alert dialogs.
 */
Dialog.Provider = DialogProvider;


/**
 * The DialogControlled class provides imperative control over dialog visibility and state.
 *
 * This static property exposes the DialogControlled class, allowing advanced usage such as
 * programmatically opening, closing, or toggling dialogs from outside the React render tree.
 * Use this for scenarios where you need to manage dialog state outside of typical React state flows,
 * such as in service layers, event handlers, or global managers.
 *
 * @see DialogControlled
 * @see Dialog.Provider
 * @see Dialog.Alert
 *
 * @example
 * ```tsx
 * // Create a ref to the controlled dialog instance
 * const dialogRef = useRef<DialogControlled>(null);
 *
 * // Open the dialog imperatively
 * dialogRef.current?.open({
 *   title: "Controlled Dialog",
 *   children: <Text>This dialog is controlled programmatically.</Text>
 * });
 *
 * // Close the dialog
 * dialogRef.current?.close();
 * ```
 *
 * @remarks
 * - Use Dialog.Controlled for advanced dialog management scenarios.
 * - For most use cases, prefer Dialog or Dialog.Provider for declarative usage.
 */
Dialog.Controlled = DialogControlled;


/**
 * The DialogAlert class provides a static interface for displaying alert dialogs with confirm and cancel actions.
 *
 * This static property exposes the DialogAlert class, which is a specialized dialog provider for alert and confirmation dialogs.
 * Use this for quick, user-friendly dialogs that require user confirmation or cancellation, such as delete confirmations or warnings.
 *
 * @see DialogAlert
 * @see Dialog
 * @see Dialog.Provider
 *
 * @example
 * ```tsx
 * // Show a confirmation dialog
 * Dialog.Alert.open({
 *   title: "Delete Item",
 *   message: "Are you sure you want to delete this item?",
 *   onConfirm: () => { },
 *   onCancel: () => { }
 * });
 * ```
 *
 * @remarks
 * - Use Dialog.Alert for simple, preconfigured alert dialogs.
 * - Customize button labels, order, and appearance using the `confirmButton`, `cancelButton`, and `buttonsOrder` props.
 * - The alert dialog can be styled using `messageVariant` and `messageClassName`.
 */
Dialog.Alert = DialogAlert;

type IDialogControlledCallback<Context = unknown> = (dialog: DialogControlled<Context>) => void;



/**
 * Represents the properties for an uncontrolled (declarative) Dialog component.
 *
 * This interface extends {@link IDialogControllableProps} with `IsControlled` set to `false`,
 * and omits the `dialogControlledContext` property, as it is only used for controlled dialogs.
 *
 * Use this interface when rendering dialogs declaratively via the {@link Dialog} component,
 * where dialog visibility and state are managed by React state or props.
 *
 * @typeParam Context - The type of the custom context object passed to the dialog.
 *
 * @example
 * ```tsx
 * // Example: Render a simple dialog with title, subtitle, and actions
 * <Dialog
 *   title="Welcome"
 *   subtitle="Please confirm your action"
 *   actions={[
 *     { label: "Cancel", onPress: () => setOpen(false) },
 *     { label: "Confirm", onPress: handleConfirm }
 *   ]}
 *   fullScreenOnMobile
 * >
 *   <Text>This is a dialog body.</Text>
 * </Dialog>
 * ```
 *
 * @remarks
 * - Use this interface for dialogs that are managed declaratively (uncontrolled).
 * - All dialog configuration options (title, actions, base, etc.) are supported.
 * - The `dialogControlledContext` property is omitted, as it is only relevant for controlled dialogs.
 *
 * @see Dialog
 * @see IDialogControllableProps
 * @see DialogControlled
 */
export interface IDialogProps<Context = unknown> extends Omit<IDialogControllableProps<Context, false>, "dialogControlledContext"> { }


interface IDialogControllableProps<Context = unknown, IsControlled extends boolean = false> extends Omit<IModalProps, "ref"> {
  actions?: INavItems<IDialogActionProps<Context, IsControlled>>;
  title?: ReactNode;
  titleClassName?: IClassName;
  subtitle?: ReactNode;
  subtitleClassName?: IClassName;
  appBarClassName?: IClassName;
  appBarProps?: Omit<IAppBarProps<IDialogContext<Context, IsControlled>>, "title" | "subtitle" | "actions" | "context">;


  /**
   * The class name of the content container.
   */
  containerClassName?: IClassName;

  context?: Context;

  /**
   * If true, the dialog will take the full screen
   */
  fullScreen?: boolean;
  /**
   * If true, the dialog will take the full screen on mobile
   */
  fullScreenOnMobile?: boolean;

  /**
   * If true, the dialog will take the full screen on tablet
   */
  fullScreenOnTablet?: boolean;

  /**
   * The dimensions options to pass to the useDimensions hook
   */
  useDimensionsOptions?: IUseDimensionsOptons;
  /**
   * If true, the dialog content will be wrapped in a ScrollView
   */
  withScrollView?: boolean;

  /**
   * The class name of the scroll view.
   * This is used to apply style to the scroll view.
   */
  scrollViewClassName?: IClassName;
  /**
   * The class name of the scroll view content container.
   * This is used to apply containerStyle to the scroll view.
   */
  scrollViewContentContainerClassName?: IClassName;

  variant?: IDialogVariant;

  dialogControlledContext: IsControlled extends true ? DialogControlled<Context> : undefined;

  ref?: Ref<IDialogContext<Context, IsControlled>>;
}

/**
 * Represents an action button or item that can be displayed in the dialog's app bar or action area.
 *
 * This interface extends {@link IAppBarActionProps} and adds dialog-specific options, such as controlling
 * the visibility of the action in full screen mode.
 *
 * @typeParam Context - The type of the custom context object passed to the dialog.
 * @typeParam IsControlled - Indicates whether the dialog is controlled (true) or uncontrolled (false).
 *
 * @property showInFullScreen - Controls whether the action is visible when the dialog is in full screen mode.
 *
 * @example
 * ```tsx
 * // Example: Hide an action in full screen mode
 * const actions = [
 *   {
 *     label: "Close",
 *     icon: "close",
 *     onPress: handleClose,
 *     showInFullScreen: false // Only show when NOT in full screen
 *   },
 *   {
 *     label: "Save",
 *     icon: "save",
 *     onPress: handleSave
 *     // showInFullScreen defaults to true, so this action is always visible
 *   }
 * ];
 * 
 * <Dialog actions={actions} />
 * ```
 *
 * @remarks
 * - Use `showInFullScreen: false` for actions that should only appear in modal (windowed) dialogs.
 * - By default, actions are shown in both full screen and modal dialogs.
 * - This is useful for minimizing clutter in mobile or tablet full screen dialogs.
 *
 * @see IAppBarActionProps
 * @see Dialog
 * @see DialogControllable
 */
export interface IDialogActionProps<Context = unknown, IsControlled extends boolean = false> extends IAppBarActionProps<IDialogContext<Context, IsControlled>> {
  /**
   * Whether the action should be visible when the dialog is in full screen mode.
   * 
   * When set to `false`, the action will be hidden when the dialog is displayed
   * in full screen mode. This is useful for actions that are not relevant or
   * take up unnecessary space in full screen layouts.
   * 
   * @example
   * ```tsx
   * // Action only visible in windowed mode
   * {
   *   label: "Minimize",
   *   onPress: handleMinimize,
   *   showInFullScreen: false
   * }
   * 
   * // Action visible in both modes (default)
   * {
   *   label: "Save",
   *   onPress: handleSave,
   *   showInFullScreen: true // or omit (default)
   * }
   * ```
   * 
   * @defaultValue true
   * @since 1.0.0
   */
  showInFullScreen?: boolean;
};

/**
 * Represents the context object passed to dialog actions, app bar, and base.
 *
 * This type combines a custom context (if provided) with device layout information and dialog control methods.
 * It is used to provide contextual data and imperative dialog controls to actions, app bar, and dialog base.
 *
 * @typeParam Context - The type of the custom context object passed to the dialog.
 * @typeParam IsControlled - Indicates whether the dialog is controlled (true) or uncontrolled (false).
 *
 * @property deviceLayout - Information about the current device's layout and type (mobile, tablet, desktop).
 * @property dialog - Provides imperative dialog control methods, such as `close`, `isFullScreen`, and `isControlled`.
 *   - If the dialog is controlled, this is an instance of {@link DialogControlled}.
 *   - Otherwise, it is an object with imperative methods for dialog control.
 *
 * @example
 * ```tsx
 * // Accessing dialog context in an action
 * const actions = [
 *   {
 *     label: "Close",
 *     onPress: (event, context) => {
 *       if (context.deviceLayout.isMobile) {
 *         // Do something specific for mobile
 *       }
 *       context.dialog.close(event); // Imperatively close the dialog
 *     }
 *   }
 * ];
 * ```
 *
 * @example
 * ```tsx
 * // Using device layout information in dialog base
 * function CustomDialogContent({ context }: { context: IDialogContext }) {
 *   return (
 *     <View>
 *       {context.deviceLayout.isTablet && <Text>This is a tablet!</Text>}
 *       <Button onPress={() => context.dialog.close()}>Close</Button>
 *     </View>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Use `deviceLayout` to adapt dialog content or actions based on device type or screen size.
 * - Use `dialog.close()` to programmatically close the dialog from within actions or base.
 * - When using a controlled dialog, `dialog` is a {@link DialogControlled} instance, providing advanced control methods.
 *
 * @see DialogControlled
 * @see IDialogActionProps
 * @see IDialogControllableProps
 */
export type IDialogContext<Context = unknown, IsControlled extends boolean = false> = Context & {
  /**
   * Current device layout information and device type detection.
   *
   * Contains responsive layout data used to determine how the dialog should be
   * rendered and positioned based on the current device dimensions and device type.
   *
   * @remarks
   * This data is typically used to:
   * - Determine dialog sizing and positioning
   * - Apply responsive styles and layouts
   * - Control fullscreen behavior on mobile devices
   * - Adjust spacing and padding based on screen real estate
   *
   * @example
   * ```tsx
   * if (context.deviceLayout.isMobile) {
   *   // Render mobile-specific UI
   * }
   * ```
   */
  deviceLayout: {
    /** Current device window width in pixels */
    windowWidth: number;
    /** Current device window height in pixels */
    windowHeight: number;
    /** True if the current window width matches tablet breakpoint criteria */
    isTablet: boolean;
    /** True if the current window width matches desktop breakpoint criteria */
    isDesktop: boolean;
    /** True if the current window width matches mobile breakpoint criteria */
    isMobile: boolean;
    /**
     * The screen width in pixels.
     */
    screenWidth: number;

    /**
     * The screen height in pixels.
     */
    screenHeight: number;
  };

  /**
   * Provides imperative dialog control methods.
   *
   * - If the dialog is controlled, this is an instance of {@link DialogControlled}.
   * - Otherwise, it is an object with imperative methods for dialog control.
   *
   * @example
   * ```tsx
   * // Close the dialog from an action
   * context.dialog.close();
   * ```
   */
  dialog: IsControlled extends true ? DialogControlled<Context> : {
    /**
     * Closes the dialog.
     * @param event - The event that triggered the close action.
     */
    close: (event: any) => void;
    /**
     * Returns true if the dialog is currently in full screen mode.
     */
    isFullScreen: () => boolean;
    /**
     * Returns true if the dialog is controlled.
     */
    isControlled: () => boolean;
  };
};


/**
 * Represents an action button or item specifically for controlled dialogs.
 *
 * This interface extends {@link IDialogActionProps} with `IsControlled` set to `true`,
 * and is used for defining actions in dialogs that are managed imperatively via {@link DialogControlled}.
 *
 * @typeParam Context - The type of the custom context object passed to the dialog.
 *
 * @example
 * ```tsx
 * // Example: Define confirm and cancel actions for a controlled dialog
 * const confirmAction: IDialogControlledActionProps = {
 *   label: "Confirm",
 *   icon: "check",
 *   onPress: (event, context) => {
 *     // Handle confirm logic
 *     context.dialog.close();
 *   }
 * };
 * 
 * const cancelAction: IDialogControlledActionProps = {
 *   label: "Cancel",
 *   icon: "close",
 *   showInFullScreen: false, // Only show in modal mode
 *   onPress: (event, context) => {
 *     // Handle cancel logic
 *     context.dialog.close();
 *   }
 * };
 * 
 * <Dialog.Controlled
 *   actions={[confirmAction, cancelAction]}
 *   title="Controlled Dialog"
 *   children={<Text>Dialog base</Text>}
 * />
 * ```
 *
 * @remarks
 * - Use this type for actions passed to controlled dialogs, such as those managed by {@link DialogControlled}, {@link DialogProvider}, or {@link DialogAlert}.
 * - Supports all properties of {@link IDialogActionProps}, including `showInFullScreen`.
 * - Enables advanced dialog control scenarios, such as programmatic open/close and dynamic action configuration.
 *
 * @see IDialogActionProps
 * @see DialogControlled
 * @see DialogProvider
 * @see DialogAlert
 */
export interface IDialogControlledActionProps<Context = unknown> extends IDialogActionProps<Context, true> { }

/**
 * Represents the properties for a controlled dialog instance.
 *
 * This interface extends {@link IDialogControllableProps} with `IsControlled` set to `true`,
 * omitting the `visible` and `dialogControlledContext` properties, as these are managed internally
 * by the controlled dialog logic.
 *
 * Use this interface when creating or configuring dialogs that are managed imperatively via
 * {@link DialogControlled}, {@link DialogProvider}, or {@link DialogAlert}.
 *
 * @typeParam Context - The type of the custom context object passed to the dialog.
 *
 * @example
 * ```tsx
 * // Example: Open a controlled dialog with custom actions and base
 * Dialog.Controlled.open({
 *   title: "Controlled Dialog",
 *   actions: [
 *     {
 *       label: "Confirm",
 *       onPress: (event, context) => {
 *         // Handle confirm logic
 *         context.dialog.close();
 *       }
 *     },
 *     {
 *       label: "Cancel",
 *       showInFullScreen: false,
 *       onPress: (event, context) => {
 *         // Handle cancel logic
 *         context.dialog.close();
 *       }
 *     }
 *   ],
 *   children: <Text>This dialog is controlled programmatically.</Text>
 * });
 * ```
 *
 * @remarks
 * - Use this interface for dialogs that require programmatic control over visibility and state.
 * - All dialog configuration options (title, actions, base, etc.) are supported.
 * - The `visible` and `dialogControlledContext` properties are omitted, as they are managed by the dialog controller.
 *
 * @see DialogControlled
 * @see DialogProvider
 * @see DialogAlert
 * @see IDialogControllableProps
 */
export interface IDialogControlledProps<Context = unknown> extends Omit<IDialogControllableProps<Context, true>, "visible" | 'dialogControlledContext'> {

}

/**
 * Represents the options for configuring a controlled dialog instance.
 *
 * This interface extends {@link IDialogControlledProps} (excluding the `ref` property)
 * and is used for providing dialog configuration when opening or updating a controlled dialog
 * via {@link DialogControlled}, {@link DialogProvider}, or {@link DialogAlert}.
 *
 * @typeParam Context - The type of the custom context object passed to the dialog.
 *
 * @example
 * ```tsx
 * // Open a controlled dialog with custom options
 * Dialog.Controlled.open({
 *   title: "My Controlled Dialog",
 *   actions: [
 *     {
 *       label: "OK",
 *       onPress: (event, context) => {
 *         // Handle OK action
 *         context.dialog.close();
 *       }
 *     }
 *   ],
 *   children: <Text>This dialog is opened with options.</Text>
 * });
 * ```
 *
 * @remarks
 * - Use this interface to specify dialog properties when opening or updating a controlled dialog.
 * - All dialog configuration options (title, actions, base, etc.) are supported.
 * - The `ref` property is omitted, as it is managed internally by the dialog controller.
 *
 * @see DialogControlled
 * @see DialogProvider
 * @see DialogAlert
 * @see IDialogControlledProps
 */
export interface IDialogControlledOptions<Context = unknown> extends Omit<IDialogControlledProps<Context>, "ref"> { }


/**
 * Represents the state of a controlled dialog instance.
 *
 * This interface is used internally by {@link DialogControlled} and dialog providers
 * to manage the visibility and configuration of a dialog that is controlled imperatively.
 *
 * @typeParam Context - The type of the custom context object passed to the dialog.
 *
 * @property visible - Indicates whether the dialog is currently visible (open).
 * @property controlledProps - The properties currently applied to the dialog instance.
 *
 * @example
 * ```tsx
 * // Example usage in a DialogControlled component
 * const [state, setState] = useState<IDialogControlledState>({
 *   visible: false,
 *   controlledProps: {
 *     title: "My Dialog",
 *     children: <Text>Dialog base</Text>
 *   }
 * });
 *
 * // Open the dialog
 * setState({ ...state, visible: true });
 *
 * // Update dialog properties
 * setState({
 *   visible: true,
 *   controlledProps: {
 *     ...state.controlledProps,
 *     title: "Updated Title"
 *   }
 * });
 * ```
 *
 * @see DialogControlled
 * @see DialogProvider
 */
export interface IDialogControlledState<Context = unknown> {
  /**
   * Indicates whether the dialog is currently visible (open).
   *
   * @remarks
   * Set to `true` to show the dialog, or `false` to hide it.
   *
   * @example
   * ```tsx
   * if (state.visible) {
   *   // Render dialog
   * }
   * ```
   */
  visible: boolean;

  /**
   * The properties passed to the dialog provider.
   *
   * @remarks
   * These are the current dialog props (such as title, actions, children, etc.)
   * that are applied to the dialog instance.
   *
   * @example
   * ```tsx
   * // Access the dialog title
   * const title = state.controlledProps.title;
   * ```
   */
  controlledProps: Omit<IDialogControlledProps<Context>, "ref">;
}
