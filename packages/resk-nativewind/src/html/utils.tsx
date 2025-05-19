import { defaultStr, isNonNullString, isObj } from "@resk/core/utils";
import { IHtmlAccessibilityProps, IHtmlDivProps, INativeAccessibilityProps } from "./types";
import { cn, normalizeProps } from "@utils";
import { StyleSheet, Platform, PressableProps } from "react-native";
import { normalizeGestureEvent } from "./events";
import { MouseEvent, TouchEvent } from "react";

export * from "./events";

export function normalizeNativeProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, nativeID, asHtmlTag, ...props }: T, defaultProps?: T) {
    return {
        ...normalizeProps(props, defaultProps),
        id: defaultStr(props.id, nativeID),
        nativeID,
        testID: defaultStr(testID, defaultProps?.testID),
    }
}

export function normalizeHtmlProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, android_ripple, nativeID, onPress, onPressIn, onPressOut, style, ...props }: T & { android_ripple?: PressableProps["android_ripple"] }, defaultProps?: T) {
    const disabled = !!(props as any).disabled || !!(props as any).readOnly || !!(props as any).readonly;
    const r = {
        style: style ? StyleSheet.flatten(style) : undefined as any,
        ...convertAccessibilityPropsToDOM(normalizeProps(props, defaultProps)),
        "data-test-id": defaultStr(testID, defaultProps?.testID),
        id: defaultStr(props.id, nativeID),
        onClick: !disabled && typeof onPress == "function" ? function normalizedOnClick(event: MouseEvent<any> | TouchEvent<any>) {
            return onPress(normalizeGestureEvent(event));
        } : undefined,
        onMouseDown: !disabled && disabled ? undefined : typeof onPressIn == "function" ? function normalizedOnMouseDown(event: MouseEvent<any> | TouchEvent<any>) {
            return onPressIn(normalizeGestureEvent(event));
        } : undefined,
        onMouseUp: !disabled && typeof onPressOut == "function" ? function normalizedOnMouseUp(event: MouseEvent<any> | TouchEvent<any>) {
            return onPressOut(normalizeGestureEvent(event));
        } : undefined
    }
    if (Platform.OS === "web" && !r.disabled && !r.readOnly && !(r as any).readonly && (r.onClick || r.onMouseDown || r.onMouseUp)) {
        r.className = cn("cursor-pointer", r.className);
    }
    return r;
}



export function convertAccessibilityPropsToDOM<T extends IHtmlDivProps>({ accessible, onAccessibilityEscape, accessibilityLanguage, accessibilityActions, accessibilityIgnoresInvertColors, accessibilityViewIsModal, importantForAccessibility, accessibilityElementsHidden, role, accessibilityLiveRegion, accessibilityRole, accessibilityLabel, accessibilityState, accessibilityValue, accessibilityHint, ...rnProps }: T): Omit<T, keyof INativeAccessibilityProps> {
    const domProps: Partial<T> & IHtmlAccessibilityProps = { ...(isObj(rnProps) ? rnProps : {}) } as any;
    domProps['aria-label'] = defaultStr(rnProps["aria-label"], accessibilityLabel);
    domProps['aria-describedby'] = defaultStr(domProps["aria-describedby"], accessibilityHint);
    (domProps as any)["aria-description"] = defaultStr((domProps as any)["aria-description"], domProps["aria-describedby"]);
    (domProps as any).role = defaultStr(domProps.role, accessibilityRole && mapRoleToDOM(accessibilityRole));
    if (accessible === false) {
        (domProps as any)["aria-hidden"] = "true";
    } else if (accessibilityElementsHidden !== undefined) {
        domProps["aria-hidden"] = accessibilityElementsHidden;;
    }
    (domProps as any)['aria-live'] = defaultStr(domProps["aria-live"], accessibilityLiveRegion && mapLiveRegionToDOM(accessibilityLiveRegion));
    if (isObj(accessibilityState)) {
        const value = accessibilityState;
        if (value.disabled !== undefined) domProps['aria-disabled'] = value.disabled;
        if (value.selected !== undefined) domProps['aria-selected'] = value.selected;
        if (value.checked !== undefined) {
            if (value.checked === 'mixed') {
                domProps['aria-checked'] = 'mixed';
            } else {
                domProps['aria-checked'] = value.checked;
            }
        }
        if (value.busy !== undefined) domProps['aria-busy'] = value.busy;
        if (value.expanded !== undefined) domProps['aria-expanded'] = value.expanded;
    }
    if (isObj(accessibilityValue)) {
        const val = accessibilityValue;
        if ('min' in val) domProps['aria-valuemin'] = val.min;
        if ('max' in val) domProps['aria-valuemax'] = val.max;
        if ('now' in val) domProps['aria-valuenow'] = val.now;
        if ('text' in val) domProps['aria-valuetext'] = val.text;
    }
    if (importantForAccessibility === "no-hide-descendants") {
        domProps['aria-hidden'] = true;
    }
    if (isNonNullString(accessibilityLanguage)) {
        (domProps as any)["lang"] = accessibilityLanguage;
    }
    if (accessibilityViewIsModal !== undefined) {
        (domProps as any)['aria-modal'] = String(accessibilityViewIsModal);
    }
    return domProps as any;
}

/**
 * Maps React Native live region values to ARIA live region values
 */
function mapLiveRegionToDOM(liveRegion: string): string {
    switch (liveRegion) {
        case 'assertive': return 'assertive';
        case 'polite': return 'polite';
        case 'none': return 'off';
        default: return 'off';
    }
}

/**
 * Maps React Native accessibility roles to ARIA/DOM roles
 */
function mapRoleToDOM(role: string): string {
    switch (role) {
        case 'adjustable': return 'slider';
        case 'alert': return 'alert';
        case 'button': return 'button';
        case 'checkbox': return 'checkbox';
        case 'combobox': return 'combobox';
        case 'header': return 'heading';
        case 'image': return 'img';
        case 'imagebutton': return 'button';
        case 'keyboardkey': return 'key';
        case 'link': return 'link';
        case 'menu': return 'menu';
        case 'menubar': return 'menubar';
        case 'menuitem': return 'menuitem';
        case 'none': return 'none';
        case 'progressbar': return 'progressbar';
        case 'radio': return 'radio';
        case 'radiogroup': return 'radiogroup';
        case 'scrollbar': return 'scrollbar';
        case 'search': return 'search';
        case 'spinbutton': return 'spinbutton';
        case 'summary': return 'summary';
        case 'switch': return 'switch';
        case 'tab': return 'tab';
        case 'tablist': return 'tablist';
        case 'text': return 'textbox';
        case 'timer': return 'timer';
        case 'togglebutton': return 'button';
        case 'toolbar': return 'toolbar';
        default: return role; // Return as-is for custom or unknown roles
    }
}