import { defaultStr, isEmpty, isNonNullString, isObj } from "@resk/core/utils";
import { IHtmlAccessibilityProps, IHtmlDivProps, INativeAccessibilityProps } from "./types";
import { cn, getTextContent, normalizeProps } from "@utils";
import { StyleSheet, Platform, PressableProps } from "react-native";
import { normalizeGestureEvent } from "./events";
import { MouseEvent, TouchEvent } from "react";
import { UIManager } from "./UIManager";

export * from "./events";

/**
 * Normalizes props for React Native elements.
 *
 * This function takes all the props that can be passed to a React Native component,
 * and normalizes them into a format that can be passed to the component.
 *
 * The following props are normalized:
 * - `testID` is converted to `testID` (no change)
 * - `nativeID` is converted to `id` (for accessibility)
 * - `asHtmlTag` is not passed to the component
 *
 * @param props - The props to normalize
 * @param defaultProps - The default props to use if `props` is undefined
 * @returns The normalized props
 */
export function normalizeNativeProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, nativeID, asHtmlTag, ...props }: T, defaultProps?: T) {
    delete (props as any).colSpan;
    delete (props as any).rowSpan;
    return {
        ...normalizeProps(props, defaultProps),
        id: defaultStr(props.id, nativeID),
        nativeID,
        testID: defaultStr(testID, defaultProps?.testID),
    }
}

/**
 * Normalizes props for HTML elements.
 *
 * This function takes all the props that can be passed to a React Native component,
 * and converts them into props that can be passed to an equivalent HTML element.
 *
 * - `testID` is converted to `data-test-id`
 * - `ref` is converted to a function that normalizes the ref and calls the original ref function
 * - `android_ripple` is ignored
 * - `nativeID` is converted to `id`
 * - `onPress` is converted to `onClick` if it's a function
 * - `onPressIn` is converted to `onMouseDown` if it's a function
 * - `onPressOut` is converted to `onMouseUp` if it's a function
 * - `style` is flattened using `StyleSheet.flatten`
 * - `disabled`, `readOnly`, and `readonly` are converted to `disabled` and `readOnly`
 * - `className` is set to `"cursor-pointer"` if the element is not disabled and has an `onClick`, `onMouseDown`, or `onMouseUp` prop
 * - React Native accessibility props are converted to proper DOM/ARIA attributes
 *
 * @param props The props to normalize
 * @param defaultProps The default props to normalize
 * @returns The normalized props
 */
export function normalizeHtmlProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({
    testID,
    onAccessibilityEscape,
    title,
    ref,
    android_ripple,
    nativeID,
    onPress,
    onPressIn,
    onPressOut,
    style,
    // Extract React Native accessibility props to prevent them from being passed to DOM
    accessible,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    accessibilityState,
    accessibilityValue,
    accessibilityLiveRegion,
    accessibilityElementsHidden,
    accessibilityViewIsModal,
    accessibilityLanguage,
    accessibilityActions,
    accessibilityIgnoresInvertColors,
    importantForAccessibility,
    ...props
}: T & { android_ripple?: PressableProps["android_ripple"] }, defaultProps?: T) {
    const disabled = !!(props as any).disabled || !!(props as any).readOnly || !!(props as any).readonly;

    // Convert accessibility props to DOM attributes first
    const accessibilityPropsConverted = convertAccessibilityPropsToDOM({
        accessible,
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole,
        accessibilityState,
        accessibilityValue,
        accessibilityLiveRegion,
        accessibilityElementsHidden,
        accessibilityViewIsModal,
        accessibilityLanguage,
        accessibilityActions,
        accessibilityIgnoresInvertColors,
        importantForAccessibility,
        onAccessibilityEscape,
        ...props
    } as any);

    const r = {
        style: style ? StyleSheet.flatten(style) : undefined as any,
        title: title ? getTextContent(title) : undefined,
        ...normalizeProps(accessibilityPropsConverted, defaultProps),
        ref: ref !== undefined && ref ? function (personalizedRef: any) {
            UIManager.normalizeRef(personalizedRef);
            if (typeof ref == "function") {
                return ref(personalizedRef);
            }
        } as any : undefined,
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

    if (Platform.OS === "web" && !(r as any).disabled && !(r as any).readOnly && !(r as any).readonly && (r.onClick || r.onMouseDown || r.onMouseUp)) {
        r.className = cn("cursor-pointer", r.className);
    }

    if (typeof onAccessibilityEscape == "function") {
        (r as any).onKeyDown = function (event: KeyboardEvent) {
            if (event?.key === "Escape") {
                onAccessibilityEscape();
            }
            if (typeof (r as any).onKeyDown == "function") {
                (r as any).onKeyDown(event);
            }
        }
    }

    delete (r as any).closeOnPress;

    // Ensure React Native accessibility props are completely removed from DOM output
    delete (r as any).accessible;
    delete (r as any).accessibilityLabel;
    delete (r as any).accessibilityHint;
    delete (r as any).accessibilityRole;
    delete (r as any).accessibilityState;
    delete (r as any).accessibilityValue;
    delete (r as any).accessibilityLiveRegion;
    delete (r as any).accessibilityElementsHidden;
    delete (r as any).accessibilityViewIsModal;
    delete (r as any).accessibilityLanguage;
    delete (r as any).accessibilityActions;
    delete (r as any).accessibilityIgnoresInvertColors;
    delete (r as any).importantForAccessibility;
    delete (r as any).onAccessibilityEscape;

    return r;
}



/**
 * Converts React Native-style accessibility props to their corresponding DOM accessibility attributes.
 *
 * This utility function takes a set of accessibility-related props (commonly used in React Native)
 * and maps them to appropriate ARIA and DOM attributes for web compatibility.
 *
 * @template T - The type extending `IHtmlDivProps` that includes both native and DOM props.
 * @param props - An object containing accessibility props and other native props.
 * @param props.accessible - If `false`, sets `aria-hidden="true"` on the DOM element.
 * @param props.onAccessibilityEscape - Not mapped; included for compatibility.
 * @param props.accessibilityLanguage - Sets the `lang` attribute if provided.
 * @param props.accessibilityActions - Not mapped; included for compatibility.
 * @param props.accessibilityIgnoresInvertColors - Not mapped; included for compatibility.
 * @param props.accessibilityViewIsModal - Sets `aria-modal` if provided.
 * @param props.importantForAccessibility - If `"no-hide-descendants"`, sets `aria-hidden="true"`.
 * @param props.accessibilityElementsHidden - Sets `aria-hidden` based on value.
 * @param props.role - Sets the `role` attribute, or maps `accessibilityRole` to a DOM role.
 * @param props.accessibilityLiveRegion - Maps to `aria-live` attribute.
 * @param props.accessibilityRole - Maps to the corresponding DOM `role` attribute.
 * @param props.accessibilityLabel - Sets the `aria-label` attribute.
 * @param props.accessibilityState - Maps state values to ARIA attributes such as `aria-disabled`, `aria-selected`, `aria-checked`, `aria-busy`, and `aria-expanded`.
 * @param props.accessibilityValue - Maps value props to ARIA attributes such as `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext`.
 * @param props.accessibilityHint - Sets the `aria-describedby` and `aria-description` attributes.
 * @param rnProps - Remaining props passed through to the DOM element.
 * @returns The props object with React Native accessibility props converted to DOM/ARIA attributes, omitting the original native accessibility props.
 */
export function convertAccessibilityPropsToDOM<T extends IHtmlDivProps>({ accessible, onAccessibilityEscape, accessibilityLanguage, accessibilityActions, accessibilityIgnoresInvertColors, accessibilityViewIsModal, importantForAccessibility, accessibilityElementsHidden, role, accessibilityLiveRegion, accessibilityRole, accessibilityLabel, accessibilityState, accessibilityValue, accessibilityHint, ...rnProps }: T): Omit<T, keyof INativeAccessibilityProps> {
    const domProps: Partial<T> & IHtmlAccessibilityProps = rnProps as any;
    domProps['aria-label'] = defaultStr(rnProps["aria-label"], accessibilityLabel);
    domProps['aria-describedby'] = defaultStr(domProps["aria-describedby"], accessibilityHint);
    (domProps as any)["aria-description"] = defaultStr((domProps as any)["aria-description"], domProps["aria-describedby"]);
    (domProps as any).role = defaultStr(domProps.role, accessibilityRole && mapRoleToDOM(accessibilityRole));
    if (accessible === false) {
        (domProps as any)["aria-hidden"] = "true";
    } else if (accessibilityElementsHidden !== undefined) {
        domProps["aria-hidden"] = String(accessibilityElementsHidden) as any;
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
                domProps['aria-checked'] = String(value.checked) as any;
            }
        }
        if (value.busy !== undefined) domProps['aria-busy'] = String(value.busy) as any;
        if (value.expanded !== undefined) domProps['aria-expanded'] = String(value.expanded) as any;
    }
    if (isObj(accessibilityValue)) {
        const val = accessibilityValue;
        if ('min' in val) domProps['aria-valuemin'] = val.min;
        if ('max' in val) domProps['aria-valuemax'] = val.max;
        if ('now' in val) domProps['aria-valuenow'] = val.now;
        if ('text' in val) domProps['aria-valuetext'] = val.text;
    }
    if (importantForAccessibility === "no-hide-descendants") {
        domProps['aria-hidden'] = "true" as any;
    }
    if (isNonNullString(accessibilityLanguage)) {
        (domProps as any)["lang"] = accessibilityLanguage;
    }
    if (accessibilityViewIsModal !== undefined) {
        (domProps as any)['aria-modal'] = String(accessibilityViewIsModal);
    }
    if ((domProps as any)["selectable"] !== undefined) {
        (domProps as any)["selectable"] = String((domProps as any)["selectable"]);
    }
    return domProps as any;
}


/**
 * Picks and returns only the valid HTML-related properties from the given props object.
 *
 * This function creates a shallow copy of the input props, then filters out only the properties
 * that are relevant for HTML elements (such as accessibility, ARIA, and DOM props).
 * The returned object is normalized before being returned.
 *
 * @typeParam T - The type extending `IHtmlDivProps` from which to pick HTML props.
 * @param props - The props object to filter.
 * @param normalize - If `true`, normalizes the returned props object.
 * @returns A partial object containing only the valid HTML-related properties from the input.
 */
export function pickHtmlProps<T extends IHtmlDivProps>(props: T, normalize?: boolean): any {
    props = Object.assign({}, props);
    const r = {} as any;
    const domProps: (keyof IHtmlDivProps)[] = [
        "id", "role", "nativeID", "tabIndex", "aria-label", "aria-busy", "aria-checked", "aria-disabled", "aria-expanded", "aria-hidden", "aria-selected", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "collapsable", "title", "onPress", "onPressIn", "onPressOut", "ref", "asHtmlTag",
        //accessibility props : 
        "accessible", "accessibilityLabel", "accessibilityHint", "accessibilityRole", "accessibilityState", "accessibilityLiveRegion", "accessibilityValue", "accessibilityElementsHidden", "importantForAccessibility", "onAccessibilityEscape", "accessibilityLanguage", "accessibilityViewIsModal", "accessibilityActions", "accessibilityIgnoresInvertColors",
    ];
    domProps.map((p) => {
        if (!isEmpty(props[p])) {
            r[p] = props[p];
        }
    });
    return normalize ? normalizeHtmlProps(r as any) : r;
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
        case 'header': return 'heading';
        case 'image': return 'img';
        case 'imagebutton': return 'button';
        case 'keyboardkey': return 'key';
        case 'text': return 'textbox';
        case 'togglebutton': return 'button';
    }
    return defaultStr(role);
}
