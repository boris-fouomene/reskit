import { defaultStr, isEmpty, isNonNullString } from "@resk/core/utils";
import { IHtmlAccessibilityProps, IHtmlDivProps, INativeAccessibilityProps } from "./types";
import { cn, getTextContent, normalizeProps as baseNormalizeProps } from "@utils";
import { StyleSheet, Platform, PressableProps } from "react-native";
import { normalizeGestureEvent } from "./events";
import { MouseEvent, TouchEvent } from "react";
import { UIManager } from "./UIManager";

export * from "./events";

// Helper function to check if a value is an object
function isObj(value: any): value is Record<string, any> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Platform-aware props normalization function.
 * 
 * Automatically chooses the appropriate normalization function based on the platform:
 * - On web: Uses `normalizeHtmlProps` with React Native to DOM/ARIA conversion
 * - On native: Uses `normalizeNativeProps` preserving React Native accessibility props
 * 
 * @param props The props to normalize
 * @param defaultProps The default props to normalize
 * @returns Normalized props appropriate for the current platform
 */
export function normalizePlatformProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>(
    props: T & { android_ripple?: PressableProps["android_ripple"] },
    defaultProps?: T
): Record<string, any> {
    if (Platform.OS === "web") {
        return normalizeHtmlProps(props, defaultProps);
    } else {
        return normalizeNativeProps(props, defaultProps);
    }
}

/**
 * Normalize props for React Native elements preserving accessibility props for native platform.
 * This function is optimized for native platform usage where React Native accessibility props are preserved.
 * 
 * @param props The props to normalize
 * @param defaultProps The default props to normalize
 * @returns Normalized props suitable for React Native components
 */
export function normalizeNativeProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, nativeID, asHtmlTag, ...props }: T, defaultProps?: T): Record<string, any> {
    // Clean up web-specific props that shouldn't reach React Native
    delete (props as any).colSpan;
    delete (props as any).rowSpan;

    // On native, preserve React Native accessibility props and don't convert them
    const result: Record<string, any> = {
        ...baseNormalizeProps(props, defaultProps),
        id: defaultStr(props.id, nativeID),
        nativeID,
        testID: defaultStr(testID, defaultProps?.testID),
    };

    // Ensure React Native accessibility props are preserved for native platform
    // These will be handled by React Native's accessibility system
    return result;
}

/**
 * Normalizes props for HTML elements on web platform.
 *
 * This function takes all the props that can be passed to a React Native component,
 * and converts them into props that can be passed to an equivalent HTML element.
 * React Native accessibility props are converted to proper DOM/ARIA attributes.
 *
 * Web-specific transformations:
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
 * @param props The props to normalize for web/HTML
 * @param defaultProps The default props to normalize
 * @returns The normalized props for HTML/DOM elements
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
    // Extract additional React Native accessibility props
    accessibilityLabelledBy,
    accessibilityShowsLargeContentViewer,
    accessibilityLargeContentTitle,
    accessibilityRespondsToUserInteraction,
    onAccessibilityTap,
    onAccessibilityMagicTap,
    onAccessibilityAction,
    screenReaderFocusable,
    ...props
}: T & { android_ripple?: PressableProps["android_ripple"] }, defaultProps?: T): Record<string, any> {
    const disabled = !!(props as any).disabled || !!(props as any).readOnly || !!(props as any).readonly;

    // Convert React Native accessibility props to DOM attributes for web platform
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
        accessibilityLabelledBy,
        accessibilityShowsLargeContentViewer,
        accessibilityLargeContentTitle,
        accessibilityRespondsToUserInteraction,
        onAccessibilityEscape,
        onAccessibilityTap,
        onAccessibilityMagicTap,
        onAccessibilityAction,
        screenReaderFocusable,
        ...props
    } as any);

    const r: Record<string, any> = {
        style: style ? StyleSheet.flatten(style) : undefined as any,
        title: title ? getTextContent(title) : undefined,
        ...baseNormalizeProps(accessibilityPropsConverted, defaultProps),
        ref: ref !== undefined && ref ? function (personalizedRef: any) {
            UIManager.normalizeRef(personalizedRef);
            if (typeof ref == "function") {
                return ref(personalizedRef);
            }
            return ref;
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

    // Add cursor pointer for web interactivity
    if (Platform.OS === "web" && !(r as any).disabled && !(r as any).readOnly && !(r as any).readonly && (r.onClick || r.onMouseDown || r.onMouseUp)) {
        r.className = cn("cursor-pointer", r.className);
    }

    // Handle accessibility escape key for web
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

    // Clean up platform-specific props
    delete (r as any).closeOnPress;
    delete (r as any).android_ripple;

    // Ensure React Native accessibility props are completely removed from DOM output
    // These have been converted to ARIA attributes by convertAccessibilityPropsToDOM
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
    delete (r as any).accessibilityLabelledBy;
    delete (r as any).accessibilityShowsLargeContentViewer;
    delete (r as any).accessibilityLargeContentTitle;
    delete (r as any).accessibilityRespondsToUserInteraction;
    delete (r as any).onAccessibilityEscape;
    delete (r as any).onAccessibilityTap;
    delete (r as any).onAccessibilityMagicTap;
    delete (r as any).onAccessibilityAction;
    delete (r as any).screenReaderFocusable;

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
 * @param props.accessibilityLabelledBy - Maps to `aria-labelledby` attribute.
 * @param props.accessibilityShowsLargeContentViewer - Not mapped; iOS specific.
 * @param props.accessibilityLargeContentTitle - Not mapped; iOS specific.
 * @param props.accessibilityRespondsToUserInteraction - Not mapped; iOS specific.
 * @param props.onAccessibilityTap - Not mapped; included for compatibility.
 * @param props.onAccessibilityMagicTap - Not mapped; included for compatibility.
 * @param props.onAccessibilityAction - Not mapped; included for compatibility.
 * @param rnProps - Remaining props passed through to the DOM element.
 * @returns The props object with React Native accessibility props converted to DOM/ARIA attributes, omitting the original native accessibility props.
 */
export function convertAccessibilityPropsToDOM<T extends IHtmlDivProps>({
    accessible,
    onAccessibilityEscape,
    accessibilityLanguage,
    accessibilityActions,
    accessibilityIgnoresInvertColors,
    accessibilityViewIsModal,
    importantForAccessibility,
    accessibilityElementsHidden,
    role,
    accessibilityLiveRegion,
    accessibilityRole,
    accessibilityLabel,
    accessibilityState,
    accessibilityValue,
    accessibilityHint,
    // Additional React Native accessibility props that were missing
    accessibilityLabelledBy,
    accessibilityShowsLargeContentViewer,
    accessibilityLargeContentTitle,
    accessibilityRespondsToUserInteraction,
    onAccessibilityTap,
    onAccessibilityMagicTap,
    onAccessibilityAction,
    // Android specific
    screenReaderFocusable,
    // Event handlers that need to be filtered out
    ...rnProps
}: T): Omit<T, keyof INativeAccessibilityProps> {
    const domProps: Partial<T> & IHtmlAccessibilityProps = rnProps as any;

    // Primary accessibility label
    domProps['aria-label'] = defaultStr(rnProps["aria-label"], accessibilityLabel);

    // Accessibility description/hint
    domProps['aria-describedby'] = defaultStr(domProps["aria-describedby"], accessibilityHint);
    (domProps as any)["aria-description"] = defaultStr((domProps as any)["aria-description"], domProps["aria-describedby"]);

    // Role mapping
    (domProps as any).role = defaultStr(domProps.role, role, accessibilityRole && mapRoleToDOM(accessibilityRole));

    // Accessible/hidden state
    if (accessible === false) {
        (domProps as any)["aria-hidden"] = "true";
    } else if (accessibilityElementsHidden !== undefined) {
        domProps["aria-hidden"] = String(accessibilityElementsHidden) as any;
    }

    // Important for accessibility handling
    if (importantForAccessibility === "no" || importantForAccessibility === "no-hide-descendants") {
        (domProps as any)["aria-hidden"] = "true";
    }

    // Live regions
    (domProps as any)['aria-live'] = defaultStr(domProps["aria-live"], accessibilityLiveRegion && mapLiveRegionToDOM(accessibilityLiveRegion));

    // Accessibility state mapping
    if (isObj(accessibilityState)) {
        const value = accessibilityState;
        if (value && value.disabled !== undefined) domProps['aria-disabled'] = value.disabled;
        if (value && value.selected !== undefined) domProps['aria-selected'] = value.selected;
        if (value && value.checked !== undefined) {
            if (value.checked === 'mixed') {
                domProps['aria-checked'] = 'mixed';
            } else {
                domProps['aria-checked'] = String(value.checked) as any;
            }
        }
        if (value && value.busy !== undefined) domProps['aria-busy'] = String(value.busy) as any;
        if (value && value.expanded !== undefined) domProps['aria-expanded'] = String(value.expanded) as any;
    }

    // Accessibility value mapping
    if (isObj(accessibilityValue)) {
        const val = accessibilityValue;
        if (val && 'min' in val && val.min !== undefined) domProps['aria-valuemin'] = val.min;
        if (val && 'max' in val && val.max !== undefined) domProps['aria-valuemax'] = val.max;
        if (val && 'now' in val && val.now !== undefined) domProps['aria-valuenow'] = val.now;
        if (val && 'text' in val && val.text !== undefined) domProps['aria-valuetext'] = val.text;
    }

    // Language support
    if (isNonNullString(accessibilityLanguage)) {
        (domProps as any)["lang"] = accessibilityLanguage;
    }

    // Modal state
    if (accessibilityViewIsModal !== undefined) {
        (domProps as any)['aria-modal'] = String(accessibilityViewIsModal);
    }

    // Labelled by relationship (Android specific but has web equivalent)
    if (accessibilityLabelledBy !== undefined) {
        if (Array.isArray(accessibilityLabelledBy)) {
            (domProps as any)['aria-labelledby'] = accessibilityLabelledBy.join(' ');
        } else if (isNonNullString(accessibilityLabelledBy)) {
            (domProps as any)['aria-labelledby'] = accessibilityLabelledBy;
        }
    }

    // Screen reader focusable (Android specific)
    if (screenReaderFocusable !== undefined) {
        // This doesn't have a direct web equivalent, but we can use tabindex
        (domProps as any).tabIndex = screenReaderFocusable ? 0 : -1;
    }

    // Handle selectable prop (common in React Native)
    if ((domProps as any)["selectable"] !== undefined) {
        (domProps as any)["selectable"] = String((domProps as any)["selectable"]);
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
        case 'header': return 'heading';
        case 'image': return 'img';
        case 'imagebutton': return 'button';
        case 'keyboardkey': return 'key';
        case 'text': return 'textbox';
        case 'togglebutton': return 'button';
    }
    return defaultStr(role);
}
