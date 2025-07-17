import { INativewindBaseProps } from "@src/types";
import { IHeadingVariant } from "@variants/heading";
import { ITextVariant } from "@variants/text";
import { JSX, Ref } from "react";
import { ImageProps, ImageStyle, PressableProps, TextProps, TextStyle, ViewProps, ViewStyle } from "react-native";

export interface IHtmlDivProps extends INativewindBaseProps, INativeAccessibilityProps {
    id?: ViewProps["id"];
    disabled?: boolean;
    style?: ViewStyle;
    children?: ViewProps["children"];
    role?: ViewProps["role"];
    nativeID?: ViewProps["nativeID"];
    tabIndex?: ViewProps["tabIndex"];
    // Core ARIA attributes
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-description"?: string;
    // State ARIA attributes
    "aria-disabled"?: boolean;
    "aria-selected"?: boolean;
    "aria-checked"?: boolean | 'mixed';
    "aria-busy"?: boolean;
    "aria-expanded"?: boolean;
    "aria-hidden"?: boolean | 'true' | 'false';
    // Live region attributes
    "aria-live"?: 'off' | 'polite' | 'assertive';
    "aria-modal"?: boolean | 'true' | 'false';
    // Value attributes
    "aria-valuemin"?: number;
    "aria-valuemax"?: number;
    "aria-valuenow"?: number;
    "aria-valuetext"?: string;
    // Additional ARIA attributes that may be output by convertAccessibilityPropsToDOM
    "aria-atomic"?: boolean;
    "aria-autocomplete"?: 'none' | 'inline' | 'list' | 'both';
    "aria-controls"?: string;
    "aria-current"?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
    "aria-details"?: string;
    "aria-errormessage"?: string;
    "aria-flowto"?: string;
    "aria-haspopup"?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    "aria-invalid"?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
    "aria-keyshortcuts"?: string;
    "aria-level"?: number;
    "aria-multiline"?: boolean;
    "aria-multiselectable"?: boolean;
    "aria-orientation"?: 'horizontal' | 'vertical' | 'undefined';
    "aria-owns"?: string;
    "aria-placeholder"?: string;
    "aria-posinset"?: number;
    "aria-pressed"?: boolean | 'false' | 'mixed' | 'true';
    "aria-readonly"?: boolean;
    "aria-relevant"?: 'additions' | 'additions text' | 'all' | 'removals' | 'text';
    "aria-required"?: boolean;
    "aria-roledescription"?: string;
    "aria-setsize"?: number;
    "aria-sort"?: 'none' | 'ascending' | 'descending' | 'other';
    // Language support
    lang?: string;
    // Other attributes
    "collapsable"?: ViewProps["collapsable"];
    "title"?: string;
    // Selectable prop (common in React Native, handled by conversion function)
    selectable?: boolean | string;
    /**@platform native */
    testID?: ViewProps["testID"];
    onPress?: PressableProps["onPress"];
    onPressIn?: PressableProps["onPressIn"];
    onPressOut?: PressableProps["onPressOut"];
    ref?: Ref<any>;
    asHtmlTag?: keyof JSX.IntrinsicElements;
    /***
        The shadow elevation of the element.
    */
    elevation?: number;
}

export interface IHtmlTextProps extends Omit<IHtmlDivProps, "style" | "onPress" | "onPressIn" | "onPressOut"> {
    style?: TextStyle;
    onPress?: TextProps["onPress"];
    onPressIn?: TextProps["onPressIn"];
    onPressOut?: TextProps["onPressOut"];
    selectable?: TextProps["selectable"];
    numberOfLines?: TextProps["numberOfLines"];
    adjustsFontSizeToFit?: TextProps["adjustsFontSizeToFit"];
    minimumFontScale?: TextProps["minimumFontScale"];
    suppressHighlighting?: TextProps["suppressHighlighting"];
    allowFontScaling?: TextProps["allowFontScaling"];
    ellipsizeMode?: TextProps["ellipsizeMode"];
    lineBreakMode?: TextProps["lineBreakMode"];
    maxFontSizeMultiplier?: TextProps["maxFontSizeMultiplier"];
    /**@platform native */
    testID?: TextProps["testID"];
    variant?: ITextVariant;
}
/**
 * Converts React Native accessibility props to corresponding DOM accessibility props.
 * Useful when rendering React Native-style props on the web (e.g., via React Native Web).
 */

export interface INativeAccessibilityProps {
    accessible?: boolean;
    accessibilityLabel?: ViewProps["accessibilityLabel"];
    accessibilityHint?: ViewProps["accessibilityHint"];
    accessibilityRole?: ViewProps["accessibilityRole"];
    accessibilityState?: ViewProps["accessibilityState"]
    accessibilityLiveRegion?: ViewProps["accessibilityLiveRegion"];
    accessibilityValue?: ViewProps["accessibilityValue"];
    accessibilityElementsHidden?: ViewProps["accessibilityElementsHidden"];
    importantForAccessibility?: ViewProps["importantForAccessibility"];
    onAccessibilityEscape?: ViewProps["onAccessibilityEscape"];
    accessibilityLanguage?: ViewProps["accessibilityLanguage"];
    accessibilityViewIsModal?: ViewProps["accessibilityViewIsModal"];
    accessibilityActions?: ViewProps["accessibilityActions"];
    accessibilityIgnoresInvertColors?: ViewProps["accessibilityIgnoresInvertColors"];
    // Additional React Native accessibility props
    accessibilityLabelledBy?: string | string[];
    accessibilityShowsLargeContentViewer?: boolean;
    accessibilityLargeContentTitle?: string;
    accessibilityRespondsToUserInteraction?: boolean;
    onAccessibilityTap?: () => void;
    onAccessibilityMagicTap?: () => void;
    onAccessibilityAction?: (event: any) => void;
    // Android specific
    screenReaderFocusable?: boolean;
};
export interface IHtmlAccessibilityProps {
    role?: ViewProps["role"];
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-description'?: string;
    'aria-disabled'?: boolean;
    'aria-selected'?: boolean;
    'aria-checked'?: boolean | 'mixed';
    'aria-busy'?: boolean;
    'aria-expanded'?: boolean;
    'aria-hidden'?: boolean | 'true' | 'false';
    'aria-live'?: 'off' | 'polite' | 'assertive';
    'aria-modal'?: boolean | 'true' | 'false';
    'aria-valuemin'?: number;
    'aria-valuemax'?: number;
    'aria-valuenow'?: number;
    'aria-valuetext'?: string;
    'aria-atomic'?: boolean;
    'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
    'aria-controls'?: string;
    'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
    'aria-details'?: string;
    'aria-errormessage'?: string;
    'aria-flowto'?: string;
    'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
    'aria-keyshortcuts'?: string;
    'aria-level'?: number;
    'aria-multiline'?: boolean;
    'aria-multiselectable'?: boolean;
    'aria-orientation'?: 'horizontal' | 'vertical' | 'undefined';
    'aria-owns'?: string;
    'aria-placeholder'?: string;
    'aria-posinset'?: number;
    'aria-pressed'?: boolean | 'false' | 'mixed' | 'true';
    'aria-readonly'?: boolean;
    'aria-relevant'?: 'additions' | 'additions text' | 'all' | 'removals' | 'text';
    'aria-required'?: boolean;
    'aria-roledescription'?: string;
    'aria-setsize'?: number;
    'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
    lang?: string;
};
export interface IHtmlImageProps extends Omit<IHtmlDivProps, "style" | "children" | "asHtmlTag"> {
    style?: ImageStyle;
    srcSet?: ImageProps["srcSet"];
    /***
     * @platform native
     */
    defaultSource?: ImageProps["defaultSource"];
    referrerPolicy?: ImageProps["referrerPolicy"];
    alt?: ImageProps["alt"];
    src?: ImageProps["src"];
    height?: ImageProps["height"];
    width?: ImageProps["width"];
    resizeMethod?: ImageProps["resizeMethod"];
    resizeMode?: ImageProps["resizeMode"];
    crossOrigin?: ImageProps["crossOrigin"];
}

export interface IHtmlQuoteProps extends IHtmlTextProps {
    cite?: string
}

export interface IHtmlBlockQuoteProps extends IHtmlTextProps {
    cite?: string
}

export interface IHtmlAprops extends Omit<IHtmlTextProps, "asHtmlTag"> {
    /** @platform web */
    href?: string;
    /** @platform web */
    target?: string;
    /** @platform web */
    rel?: string;
    /** @platform web */
    download?: boolean | string;
}

export interface IHtmlHeadingProps extends Omit<IHtmlTextProps, "asHtmlTag" | "variant"> {
    variant?: IHeadingVariant;
}


export interface IHtmlTableTextProps extends IHtmlTextProps {
    /** @platform web */
    colSpan?: number | string;
    /** @platform web */
    rowSpan?: number | string;
}