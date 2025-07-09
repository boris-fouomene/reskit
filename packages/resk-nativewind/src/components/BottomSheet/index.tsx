"use client";
import { bottomSheetVariant, IVariantPropsBottomSheet } from "@variants/bottomSheet";
import { Modal } from "@components/Modal";
import { defaultStr, isObj } from "@resk/core/utils";
import { IClassName } from "@src/types";
import { cn } from "@utils/cn";
import { AppBar, IAppBarProps } from "@components/AppBar";
import { IModalProps } from "@components/Modal/types";
import { View } from "react-native";
import { Backdrop } from "@components/Backdrop";

export function BottomSheet({ variant, visible, className, appBarClassName, contentContainerClassName, contentClassName, withAppBar, appBarProps, children, onLayout, testID, ...props }: IBottomSheetProps) {
    testID = defaultStr(testID, "resk-bottom-sheet");
    const computedVariant = bottomSheetVariant(variant);
    const renderAppBar = withAppBar !== false && isObj(appBarProps);
    return <Modal animationType="slide" visible={!!visible} testID={testID} {...props}
        className={cn(className, "bottom-sheet")}
        backdropClassName={cn("resk-bottom-sheet-backdrop", computedVariant.modalBackdrop())}
    >
        <View testID={testID + "-content-container"} className={cn("bottom-sheet-content-container", computedVariant.contentContainer(), contentContainerClassName)}>
            {<Backdrop className={cn("resk-bottom-sheet-backdrop")}
                testID={testID + "-bottom-sheet-backdrop"}
                onPress={props.onRequestClose}
            />}
            <View testID={testID + "-content"} className={cn("bottom-sheet-content", contentClassName, computedVariant.content())}>
                {renderAppBar ? <AppBar testID={testID + "-app-bar"} backAction={false} {...appBarProps} className={cn("bottom-sheet-app-bar", computedVariant.appBar(), appBarClassName)} /> : null}
                {children}
            </View>
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
     * The class name of the content container.
     * The content container is the view that contains the content of the bottom sheet.
     */
    contentContainerClassName?: IClassName;

    /***
        The class name of the content.
    */
    contentClassName?: IClassName;

    /**
     * The class name of the app bar.
     */
    appBarClassName?: IClassName;
}