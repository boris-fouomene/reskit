import { defaultStr, isObj } from "@resk/core/utils";
import { IHtmlDivProps } from "./types";
import { cn, normalizeProps } from "@utils";
import { StyleSheet, Platform } from "react-native";
import { variants } from "@variants/index";
import { normalizeGestureEvent } from "./events";
import { MouseEvent, TouchEvent } from "react";

export * from "./events";

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
    result.className = cn(variants.all({ disabled: !!((props as any).disabled) }), props.className);
    return result;
}
export function normalizeHtmlProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, onPress, onPressIn, onPressOut, style, ...props }: T, defaultProps?: T) {
    const r = {
        style: style ? StyleSheet.flatten(style) : undefined as any,
        ...normalizeProps(props, defaultProps),
        "data-test-id": defaultStr(testID, defaultProps?.testID),
        onClick: typeof onPress == "function" ? function normalizedOnClick(event: MouseEvent<any> | TouchEvent<any>) {
            return onPress(normalizeGestureEvent(event));
        } : undefined,
        onMouseDown: typeof onPressIn == "function" ? function normalizedOnMouseDown(event: MouseEvent<any> | TouchEvent<any>) {
            return onPressIn(normalizeGestureEvent(event));
        } : undefined,
        onMouseUp: typeof onPressOut == "function" ? function normalizedOnMouseUp(event: MouseEvent<any> | TouchEvent<any>) {
            return onPressOut(normalizeGestureEvent(event));
        } : undefined
    }
    if (Platform.OS === "web" && !r.disabled && !r.readonly && (r.onClick || r.onMouseDown || r.onMouseUp)) {
        r.className = cn("cursor-pointer", r.className);
    }
    return r;
}


