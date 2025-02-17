import { Modal, useModal } from "@components/Modal";
import DialogAppBar from "./DialogAppBar";
import {
  AppBar,
  IAppBarAction,
  IAppBarProps,
} from "@components/AppBar";
import DialogTitle from "./DialogTitle";
import DialogFooter from "./DialogFooter";
import React, { ReactNode, useMemo } from "react";
import { isValidElement } from "@utils";
import View from "@components/View";
import DialogActions from "./DialogActions";
import { ScrollView, StyleSheet } from "react-native";
import { IDialogProps } from "./types";
import { defaultStr } from "@resk/core";

/**
 * A Dialog component that renders a modal dialog with customizable content,
 * title, footer, and actions.
 * 
 * This component integrates with the Modal component and provides a structured
 * layout for displaying dialogs in the application.
 * 
 * @template DialogContextExtend - Optional type parameter for extending the dialog context.
 * 
 * @param props - The properties for the Dialog component.
 * @param props.fullScreenAppBarProps - Properties for the app bar when dialog is full-screen.
 * @param props.context - Additional context for the dialog.
 * @param props.actionsProps - Properties for modal actions.
 * @param props.actions - Actions to display in the dialog.
 * @param props.dialogContentProps - Properties for the dialog content area.
 * @param props.footerProps - Properties for the dialog footer.
 * @param props.title - The title of the dialog.
 * @param props.children - The content to display inside the dialog.
 * @param props.titleProps - Properties for the dialog title.
 * @param props.testID - Optional test identifier for testing purposes.
 * 
 * @returns A React element representing the dialog.
 * 
 * @example
 * <Dialog title="My Dialog" footerProps={{ someProp: value }}>
 *   <Text>This is the dialog content.</Text>
 * </Dialog>
 */
export default function Dialog<DialogContextExtend = any>({
  fullScreenAppBarProps,
  context,
  actionsProps,
  actions,
  dialogContentProps,
  footerProps,
  title,
  children: dialogChildren,
  titleProps,
  testID,
  ...props
}: IDialogProps<DialogContextExtend>) {
  testID = testID || "resk-dialog";
  return (
    <Modal {...props} testID={testID}>
      <ModalWrapper
        testID={testID}
        {...{
          isPreloader: props.isPreloader,
          context,
          fullScreenAppBarProps,
          actionsProps,
          actions,
          dialogContentProps,
          footerProps,
          title,
          children: dialogChildren,
          titleProps,
        }}
      />
    </Modal>
  );
}

/**
 * A wrapper component for the Dialog that handles rendering of the app bar,
 * title, content, actions, and footer.
 * 
 * @template DialogContextExtend - Optional type parameter for extending the dialog context.
 * 
 * @param props - The properties for the ModalWrapper component.
 * @param props.fullScreenAppBarProps - Properties for the full-screen app bar.
 * @param props.context - Additional context for the dialog.
 * @param props.actionsProps - Properties for modal actions.
 * @param props.actions - Actions to display in the dialog.
 * @param props.testID - Optional test identifier for testing purposes.
 * @param props.dialogContentProps - Properties for the dialog content area.
 * @param props.footerProps - Properties for the dialog footer.
 * @param props.title - The title of the dialog.
 * @param props.children - The content to display inside the dialog.
 * @param props.titleProps - Properties for the dialog title.
 * @param props.isPreloader - Indicates if the dialog is a preloader.
 * 
 * @returns A React fragment containing the dialog structure.
 */
function ModalWrapper<DialogContextExtend = any>({
  fullScreenAppBarProps,
  context,
  actionsProps,
  actions,
  testID,
  dialogContentProps,
  footerProps,
  title,
  children: dialogChildren,
  titleProps,
  isPreloader,
  withScrollView,
  scrollViewProps,
}: IDialogProps<DialogContextExtend>) {
  testID = defaultStr(testID, "resk-dialog");
  fullScreenAppBarProps = Object.assign({}, fullScreenAppBarProps);
  titleProps = Object.assign({}, titleProps);
  dialogContentProps = Object.assign({}, dialogContentProps);
  actionsProps = Object.assign({}, actionsProps);
  context = Object.assign({}, context);
  const modalContext = useModal();
  const children = useMemo(() => {
    return isValidElement(dialogChildren)
      ? (dialogChildren as ReactNode)
      : null;
  }, [dialogChildren]);
  const setOnPressAction = (props: IAppBarAction<DialogContextExtend>): any => {
    const { onPress } = props;
    props.onPress = async (event, context) => {
      if (typeof onPress == "function" && await onPress(event, context) === false) {
        return;
      }
      if (modalContext?.handleDismiss && props.closeOnPress !== false) {
        modalContext.handleDismiss(event);
      }
    };
  };
  const renderAction: IAppBarProps<DialogContextExtend>["renderAction"] = (props, index,) => {
    setOnPressAction(props);
    return (
      <AppBar.Action
        testID={testID + "-dialog-action-" + index}
        {...props}
        key={index}
      />
    );
  },
    renderExpandableAction: IAppBarProps<DialogContextExtend>["renderExpandableAction"] = (props, index,) => {
      setOnPressAction(props);
      return (
        <AppBar.ExpandableAction
          testID={testID + "-dialog-expandable-action-" + index}
          {...props}
          key={index}
        />
      );
    };
  const getAppBarProps = (
    props: IAppBarProps<DialogContextExtend>,
    actionProps?: Partial<IAppBarAction<DialogContextExtend>>,
  ): IAppBarProps => {
    return {
      windowWidth: modalContext?.maxWidth,
      renderAction: (props, index) => {
        return renderAction(Object.assign({}, props, actionProps), index);
      },
      renderExpandableAction: (props, index) => {
        return renderExpandableAction(Object.assign({}, props, actionProps), index);
      },
      actions,
      ...props,
      context: Object.assign({}, modalContext, { isDialog: true }, context),
    };
  };
  const { Component: Wrapper, props: wrapperProps } = useMemo(() => {
    const canRenderScrollView = withScrollView !== false && !isPreloader;
    return {
      Component: canRenderScrollView ? ScrollView : React.Fragment,
      props: canRenderScrollView ? Object.assign({}, { testID: testID + "-scrollview" }, scrollViewProps) : {}
    }
  }, [withScrollView, scrollViewProps, testID, isPreloader]);
  return (
    <>
      <DialogAppBar
        testID={testID + "-dialog-app-bar"}
        {...getAppBarProps(fullScreenAppBarProps, { colorScheme: undefined })}
        title={fullScreenAppBarProps.title || title}
        titleProps={{
          ...titleProps,
          ...Object.assign({}, fullScreenAppBarProps?.titleProps),
        }}
      />
      <DialogTitle
        testID={testID + "-dialog-title"}
        children={title}
        {...titleProps}
      />
      <View
        testID={testID + "-dialog-content"}
        {...dialogContentProps}
        style={[styles.content, !modalContext?.fullScreen && styles.modalContent, isPreloader && styles.dialogContentPreloader, dialogContentProps.style]}
      >
        <Wrapper {...wrapperProps}>
          {children}
        </Wrapper>
      </View>
      <DialogActions statusBarHeight={0} {...getAppBarProps(actionsProps)} />
      <DialogFooter
        testID={testID + "dialog-footer"}
        {...Object.assign({}, footerProps)}
      />
    </>
  );
};

/***
 * Il s'agit des props à passer au composant Dialog, ils étendent les props du composant Modal
 */

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  modalContent: {
    flex: 1,
  },
  dialogContentPreloader: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
