import { defaultStr, isObj } from "@resk/core/utils";
import { IHtmlDivProps } from "./types";
import { cn, normalizeProps } from "@utils";
import { StyleSheet } from "react-native";


export function normalizeNativeProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, ...props }: T, defaultProps?: T) {
    return {
        ...normalizeProps(props, defaultProps),
        testID: defaultStr(testID, defaultProps?.testID),
    }
}

export function normalizeHtmlProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, style, ...props }: T, defaultProps?: T) {
    return {
        style: style ? StyleSheet.flatten(style) : undefined as any,
        ...normalizeProps(props, defaultProps),
        "data-test-id": defaultStr(testID, defaultProps?.testID),
    }
}


