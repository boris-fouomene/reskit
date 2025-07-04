"use client";
import { IVariantPropsBottomSheet } from "@variants/bottomSheet";
import { Portal } from "@components/Portal";
import { defaultStr } from "@resk/core/utils";
import bottomSheetVariant from "@variants/bottomSheet";
import { IClassName } from "@src/types";
import { cn } from "@utils/cn";
import { ViewProps, View } from "react-native";
import { useBackHandler } from "@components/BackHandler";

export function BottomSheet({ variant, className, dismissable, onRequestClose, children, onLayout, testID, portalClassName, visible, ...props }: IBottomSheetProps) {
    testID = defaultStr(testID, "resk-bottom-sheet");
    const computedVariant = bottomSheetVariant(variant);
    useBackHandler(function () {
        if (dismissable && typeof onRequestClose === "function") {
            onRequestClose();
        }
        return true;
    });
    return <Portal autoMountChildren visible={visible} testID={testID + "-portal"} onPress={dismissable ? onRequestClose : undefined} className={cn("bottom-sheet-portal", computedVariant.portal(), portalClassName)}>
        <View onAccessibilityEscape={dismissable ? onRequestClose : undefined}
            {...props}
            className={cn("bottom-sheet", computedVariant.base(), className)}
            testID={testID}
        >
            {children}
        </View>
    </Portal>
}

export interface IBottomSheetProps extends ViewProps {
    /***
        The variant of the bottom sheet.
    */
    variant?: IVariantPropsBottomSheet;

    /***
        The class name of the portal wrapper.
    */
    portalClassName?: IClassName;


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
}