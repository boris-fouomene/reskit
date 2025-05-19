import { INativewindBaseProps } from "@src/types";
import { IVariantPropsHeading } from "@variants/heading";
import { JSX, Ref } from "react";
import { ImageProps, ImageStyle, PressableProps, TextProps, TextStyle, View, ViewProps, ViewStyle } from "react-native";

export interface IHtmlDivProps extends INativewindBaseProps, INativeAccessibilityProps {
    id?: ViewProps["id"];
    disabled?: boolean;
    style?: ViewStyle;
    children?: ViewProps["children"];
    role?: ViewProps["role"];
    nativeID?: ViewProps["nativeID"];
    tabIndex?: ViewProps["tabIndex"];
    "aria-label"?: ViewProps["aria-label"];
    "aria-busy"?: ViewProps["aria-busy"];
    "aria-checked"?: ViewProps["aria-checked"];
    "aria-disabled"?: ViewProps["aria-disabled"];
    "aria-expanded"?: ViewProps["aria-expanded"];
    "aria-hidden"?: ViewProps["aria-hidden"];
    "aria-selected"?: ViewProps["aria-selected"];
    "aria-valuemax"?: ViewProps["aria-valuemax"];
    "aria-valuemin"?: ViewProps["aria-valuemin"];
    "aria-valuenow"?: ViewProps["aria-valuenow"];
    "aria-valuetext"?: ViewProps["aria-valuetext"];
    "collapsable"?: ViewProps["collapsable"];
    "title"?: string;
    /**@platform native */
    testID?: ViewProps["testID"];
    onPress?: PressableProps["onPress"];
    onPressIn?: PressableProps["onPressIn"];
    onPressOut?: PressableProps["onPressOut"];
    ref?: Ref<any>;
    asHtmlTag?: keyof JSX.IntrinsicElements;
}

export interface IHtmlTextProps extends Omit<IHtmlDivProps, "style" | "children" | "onPress" | "onPressIn" | "onPressOut"> {
    style?: TextStyle;
    children?: TextProps["children"];
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
};
export interface IHtmlAccessibilityProps {
    role?: ViewProps["role"];
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-disabled'?: boolean;
    'aria-selected'?: boolean;
    'aria-checked'?: boolean | 'mixed';
    'aria-busy'?: boolean;
    'aria-expanded'?: boolean;
    'aria-live'?: 'off' | 'polite' | 'assertive';
    'aria-valuemin'?: number;
    'aria-valuemax'?: number;
    'aria-valuenow'?: number;
    'aria-valuetext'?: string;
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

export interface IHtmlBlockQuoteProps extends IHtmlDivProps {
    cite?: string
}
export interface IHtmlTimeProps extends IHtmlTextProps {
    dateTime?: string
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

export interface IHtmlHeadingProps extends Omit<IHtmlTextProps, "asHtmlTag"> {
    variant?: IVariantPropsHeading;
}