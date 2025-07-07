"use client";
import { IVariantPropsBottomSheet } from "@variants/bottomSheet";
import { Modal } from "@components/Modal";
import { defaultStr, isObj } from "@resk/core/utils";
import bottomSheetVariant from "@variants/bottomSheet";
import { IClassName } from "@src/types";
import { cn } from "@utils/cn";
import { AppBar, IAppBarProps } from "@components/AppBar";
import { IModalProps } from "@components/Modal/types";
import { View } from "react-native";

export function BottomSheet({ variant, className, appBarClassName, contentClassName, withAppBar, appBarProps, children, onLayout, testID, visible, ...props }: IBottomSheetProps) {
    testID = defaultStr(testID, "resk-bottom-sheet");
    const computedVariant = bottomSheetVariant(variant);
    const renderAppBar = withAppBar && isObj(appBarProps);
    return <Modal {...props} backdropClassName={computedVariant.modalBackdrop()} contentClassName={computedVariant.modalContent()} visible={visible} testID={testID + "-modal"} className={cn("bottom-sheet-modal", computedVariant.base(), className)}>
        <View testID={testID} className={cn("bottom-sheet", computedVariant.base())}>
            {renderAppBar ? <AppBar testID={testID + "-app-bar"} backAction={false} {...appBarProps} className={cn("bottom-sheet-app-bar", computedVariant.appBar(), appBarClassName)} /> : null}
            {children}
        </View>
    </Modal>
}

export interface IBottomSheetProps<Context = unknown> extends IModalProps {
    /***
        The variant of the bottom sheet.
    */
    variant?: IVariantPropsBottomSheet;


    /***
        whether to render the app bar in the bottom sheet
    */
    withAppBar?: boolean;

    /***
        The props to be passed to the AppBar component that wraps the bottom sheet content.
    */
    appBarProps?: IAppBarProps<Context>;


    /***
        The class name of the content.
    */
    contentClassName?: IClassName;

    /**
     * The class name of the app bar.
     */
    appBarClassName?: IClassName;
}