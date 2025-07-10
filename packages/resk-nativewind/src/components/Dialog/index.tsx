"use client";
import { Modal } from "@components/Modal";
import { AppBar, IAppBarActionProps, IAppBarProps } from "@components/AppBar";
import { Fragment, ReactNode, useCallback, useMemo, Context, useImperativeHandle, Ref } from 'react';
import { cn, Component, createProvider, isValidElement, useDimensions } from "@utils";
import { Dimensions, ScrollView, View } from "react-native";
import { defaultStr, isObj } from "@resk/core/utils";
import { Backdrop } from "@components/Backdrop";
import { dialogVariant } from "@variants/dialog";
import { Div } from "@html/Div";
import { Text } from "@html/Text";
import { IModalProps } from "@components/Modal/types";
import { IUseDimensionsOptons } from "@utils/dimensions";
import { IClassName } from "@src/types";
import { IDialogVariant } from "@variants/dialog";


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
  contentClassName,
  appBarClassName,
  variant,
  contentContainerClassName,
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
    return {
      context,
      titleContent: isFullScreen && title ? null : <Text className={cn("resk-dialog-modal-title", titleClx)} testID={testID + "-title"}>{title}</Text>,
      appBar: <AppBar<IDialogContext<Context, IsControlled>>
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
      props: canRenderScrollView ? { testID: testID + "-scrollview", className: cn("resk-dialog-scroll-view", computedVariant.scrollView(), scrollViewClassName), contentContainerClassName: cn("resk-dialog-scroll-view-content-container", computedVariant.scrollViewContentContainer(), scrollViewContentContainerClassName) } : {}
    }
  }, [withScrollView, scrollViewClassName, testID, scrollViewContentContainerClassName]);
  useImperativeHandle(ref, () => context);
  return (
    <Modal animationType="fade" {...props} testID={testID}
      onRequestClose={handleRequestClose}
      backdropClassName={cn("resk-dialog-backdrop", computedVariant.modalbackdrop())}
      className={cn("resk-dialog", computedVariant.modal())}
    >
      <Div className={cn("resk-dialog-content-continer", computedVariant.contentContainer(), contentContainerClassName)}>
        {!isFullScreen ? <Backdrop testID={testID + "-dialog-backdrop"} className={cn("resk-dialog-backdrop")} onPress={handleRequestClose} /> : null}
        <Div
          testID={testID + "-dialog-content"}
          className={cn("resk-dialog-content", computedVariant.content(), contentClassName)}
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

export class DialogControlled<Context = unknown> extends Component<IDialogControlledProps<Context>, IDialogControlledState<Context>> {
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
  toggle(options?: IDialogControlledOptions<Context>, callback?: IDialogControlledCallback<Context>) {
    const newState: IDialogControlledState<Context> = { visible: !this.state.visible } as any;
    if (options && isObj(options)) {
      newState.controlledProps = options;
    }
    this.setState(newState, () => {
      this.invokeCallback(callback);
    });
    return this;
  }

  open(options?: IDialogControlledOptions<Context>, callback?: IDialogControlledCallback<Context>) {
    return this.toggle(options, callback);
  }
  close(callback?: IDialogControlledCallback<Context>) {
    return this.toggle(undefined, callback);
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



export class DialogProvider extends createProvider<IDialogControlledProps, DialogControlled, IDialogControlledProps>(DialogControlled, {}) { }


Dialog.Provider = DialogProvider;
Dialog.Controlled = DialogControlled;


type IDialogControlledCallback<Context = unknown> = (dialog: DialogControlled<Context>) => void;


export interface IDialogProps<Context = unknown> extends Omit<IDialogControllableProps<Context, false>, "dialogControlledContext"> { }


interface IDialogControllableProps<Context = unknown, IsControlled extends boolean = false> extends Omit<IModalProps, "ref"> {
  actions?: IDialogActionProps<Context, IsControlled>[];
  title?: ReactNode;
  titleClassName?: IClassName;
  subtitle?: ReactNode;
  subtitleClassName?: IClassName;
  appBarClassName?: IClassName;
  appBarProps?: Omit<IAppBarProps<IDialogContext<Context, IsControlled>>, "title" | "subtitle" | "actions" | "context">;

  /**
   * The class name of the content container.
   */
  contentClassName?: IClassName;

  /**
   * The class name of the content container.
   */
  contentContainerClassName?: IClassName;

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
   * This is used to apply contentContainerStyle to the scroll view.
   */
  scrollViewContentContainerClassName?: IClassName;

  variant?: IDialogVariant;

  dialogControlledContext: IsControlled extends true ? DialogControlled<Context> : undefined;

  ref?: Ref<IDialogContext<Context, IsControlled>>;
}

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

export type IDialogContext<Context = unknown, IsControlled extends boolean = false> = Context & {
  /**
   * Current device layout information and device type detection.
   * 
   * Contains responsive layout data used to determine how the dialog should be
   * rendered and positioned based on the current device dimensions and device type.
   * 
   * 
   * @remarks
   * This data is typically used to:
   * - Determine dialog sizing and positioning
   * - Apply responsive styles and layouts
   * - Control fullscreen behavior on mobile devices
   * - Adjust spacing and padding based on screen real estate
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
  dialog: IsControlled extends true ? DialogControlled<Context> : {
    close: (event: any) => void, isFullScreen: () => boolean; isControlled: () => boolean
  };
};





export interface IDialogControlledProps<Context = unknown> extends Omit<IDialogControllableProps<Context, true>, "visible" | 'dialogControlledContext'> {

}

export interface IDialogControlledOptions<Context = unknown> extends Omit<IDialogControlledProps<Context>, "ref"> { }


export interface IDialogControlledState<Context = unknown> {
  /**
   * Indicates whether the dialog is currently visible.
   */
  visible: boolean;

  /**
   * The properties passed to the dialog provider.
   */
  controlledProps: Omit<IDialogControlledProps<Context>, "ref">;
}
