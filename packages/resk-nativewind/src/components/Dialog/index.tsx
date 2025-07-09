"use client";
import { Modal } from "@components/Modal";
import {
  AppBar,
  IAppBarActionProps,
} from "@components/AppBar";
import { Fragment, ReactNode, useCallback, useMemo } from "react";
import { cn, isValidElement, useDimensions } from "@utils";
import { Dimensions, ScrollView, View } from "react-native";
import { IDialogContext, IDialogProps } from "./types";
import { defaultStr, isObj } from "@resk/core/utils";
import { Backdrop } from "@components/Backdrop";
import { dialogVariant } from "@variants/dialog";
import { Div } from "@html/Div";


export function Dialog<Context = unknown>({
  appBarProps,
  context: customContext,
  actions,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  children: dialogChildren,
  titleProps,
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
  ...props
}: IDialogProps<Context>) {
  testID = defaultStr(testID, "resk-dialog");
  const { isTablet, isDesktop, isMobile, isMobileOrTablet } = useDimensions(useDimensionsOptions);
  const isFullScreen = useMemo(() => {
    return !!(fullScreen || (fullScreenOnMobile && isMobile) || (fullScreenOnTablet && isTablet));
  }, [fullScreen, isMobile, isTablet]);
  const computedVariant = dialogVariant({ ...variant, fullScreen: isFullScreen });
  const handleRequestClose = useCallback((event: any) => {
    console.log("handleRequestClose", onRequestClose);
    if (typeof onRequestClose == "function") {
      return onRequestClose(event);
    }
  }, [onRequestClose]);
  const { context, appBar } = useMemo(() => {
    const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
    const context = Object.assign({}, customContext, { dialog: { close: handleRequestClose, isMobile, isTablet, isDesktop, isFullScreen, windowWidth, windowHeight } });
    const appBarActions: IAppBarActionProps<IDialogContext<Context>>[] = [];
    if (Array.isArray(actions) && actions.length) {
      actions.map((act) => {
        if (!act || !isObj(act)) {
          return;
        }
        const cloned = Object.clone(act);
        const { onPress, closeOnPress } = cloned;
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
      appBar: <AppBar<IDialogContext<Context>>
        maxVisibleActions={isFullScreen ? undefined : 2}
        backAction={!isFullScreen ? false : undefined}
        {...appBarProps}
        actionsProps={{ ...appBarProps?.actionsProps, actionClassName: cn("resk-dialog-actions", computedVariant.action(), appBarProps?.actionsProps?.actionClassName) }}
        context={context}
        actions={appBarActions}
        title={title}
        subtitle={subtitle}
        className={cn("resk-dialog-app-bar", computedVariant.appBar(), appBarProps?.className, appBarClassName)}
        titleClassName={cn("resk-dialog-title", computedVariant.title(), appBarProps?.titleClassName, titleClassName)}
        subtitleClassName={cn("resk-dialog-subtitle", computedVariant.subtitle(), appBarProps?.subtitleClassName, subtitleClassName)}
      />
    }
  }, [fullScreen, appBarProps, isTablet, isDesktop, isMobile, isMobileOrTablet, handleRequestClose, appBarClassName, titleClassName, subtitleClassName, customContext, appBarProps, title, subtitle]);
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
  return (
    <Modal animationType="fade" {...props} testID={testID}
      onRequestClose={handleRequestClose}
      backdropClassName={cn("resk-dialog-backdrop", computedVariant.modalbackdrop())}
      className={cn("resk-dialog", computedVariant.modal())}
    >
      <Div className={cn("resk-dialog-content-continer", computedVariant.contentContainer(), isFullScreen && computedVariant.contentContainerFullScreen(), contentContainerClassName)}>
        {!isFullScreen ? <Backdrop testID={testID + "-dialog-backdrop"} className={cn("resk-dialog-backdrop")} onPress={handleRequestClose} /> : null}

        <Div
          testID={testID + "-dialog-content"}
          className={cn("resk-dialog-content", computedVariant.content(), isFullScreen && computedVariant.contentFullScreen(), contentClassName)}
        >
          {fullScreen ? appBar : null}
          <Wrapper {...wrapperProps}>
            {children}
          </Wrapper>
          {!fullScreen ? appBar : null}
        </Div>
      </Div>
    </Modal>
  );
}




export * from "./types";