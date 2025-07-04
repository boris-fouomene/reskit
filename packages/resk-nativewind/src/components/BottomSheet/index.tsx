"use client";
import { IVariantPropsBottomSheet } from "@variants/bottomSheet";
import { Portal } from "@components/Portal";
import { defaultStr, isObj } from "@resk/core/utils";
import bottomSheetVariant from "@variants/bottomSheet";
import { IClassName } from "@src/types";
import { cn } from "@utils/cn";
import { ViewProps, View } from "react-native";
import { useBackHandler } from "@components/BackHandler";
import { AppBar, IAppBarProps } from "@components/AppBar";
import { Div } from "@html/Div";

export function BottomSheet({ variant, className, dismissable: customDismissable, appBarClassName, onRequestClose, contentClassName, withAppBar, appBarProps, children, onLayout, testID, portalClassName, visible, ...props }: IBottomSheetProps) {
    testID = defaultStr(testID, "resk-bottom-sheet");
    const dismissable = customDismissable !== false;
    const computedVariant = bottomSheetVariant({ ...variant, visible });
    useBackHandler(function () {
        if (dismissable && typeof onRequestClose === "function") {
            onRequestClose();
        }
        return true;
    });
    const renderAppBar = withAppBar && isObj(appBarProps);
    return <Portal absoluteFill autoMountChildren visible={visible} testID={testID + "-portal"} onPress={dismissable ? onRequestClose : undefined} className={cn("bottom-sheet-portal", computedVariant.portal(), portalClassName)}>
        <View onAccessibilityEscape={dismissable ? onRequestClose : undefined}
            {...props}
            className={cn("bottom-sheet", computedVariant.base(), className)}
            testID={testID}
        >
            <Div testID={testID + "-content"} className={cn("bottom-sheet-content", computedVariant.content())}>
                {renderAppBar ? <AppBar testID={testID + "-app-bar"} backAction={false} {...appBarProps} className={cn("bottom-sheet-app-bar", computedVariant.appBar(), appBarClassName)} /> : null}
                {children}
            </Div>
        </View>
    </Portal>
}

export interface IBottomSheetProps<Context = unknown> extends ViewProps {
    /***
        The variant of the bottom sheet.
    */
    variant?: IVariantPropsBottomSheet;

    /***
        The class name of the portal wrapper.
    */
    portalClassName?: IClassName;

    /***
        The class name of the content.
    */
    contentClassName?: IClassName;

    /**
     * The class name of the app bar.
     */
    appBarClassName?: IClassName;

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
     * A callback function that is called when the bottom sheet is rquested to be closed.
     * 
     * @type Function
     * @example
     * ```typescript
     * <BottomSheet onRequestClose={() => console.log('Bottom sheet requested to be closed')} />
     * ```
     */
    onRequestClose?: () => void;

    /***
        whether to render the app bar in the bottom sheet
    */
    withAppBar?: boolean;

    /***
        The props to be passed to the AppBar component that wraps the bottom sheet content.
    */
    appBarProps?: IAppBarProps<Context>
}