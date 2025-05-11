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

export function pickHtmlProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>(props: T): Partial<IHtmlDivProps> {
    if (!isObj(props)) return {} as Partial<IHtmlDivProps>;
    const result: Partial<IHtmlDivProps> = {};
    [
        "id",
        "tabIndex",
        "aria-label",
        "accessible",
        "accessibilityLabel",
        "accessibilityRole",
        "aria-busy",
        "aria-checked",
        "aria-disabled",
        "aria-expanded",
        "aria-hidden",
        "aria-selected",
        "aria-valuemax",
        "aria-valuemin",
        "aria-valuenow",
        "aria-valuetext",
        "collapsable",
    ].map((p) => {
        if (p in props && typeof props[p as keyof typeof props] !== "undefined") {
            (result as any)[p] = props[p as keyof typeof props];
        }
    });
    if (props?.disabled) {
        result.className = cn("pointer-events-none", props.className)
    }
    return result;
}

export function normalizeHtmlProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, style, ...props }: T, defaultProps?: T) {
    return {
        style: style ? StyleSheet.flatten(style) : undefined as any,
        ...normalizeProps(props, defaultProps),
        "data-test-id": defaultStr(testID, defaultProps?.testID),
    }
}


