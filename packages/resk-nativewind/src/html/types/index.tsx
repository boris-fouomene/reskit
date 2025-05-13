import { INativewindBaseProps } from "@src/types";
import { ImageProps, ImageStyle, PressableProps, TextProps, TextStyle, ViewProps, ViewStyle } from "react-native";

export interface IHtmlDivProps extends INativewindBaseProps {
    id?: ViewProps["id"];
    disabled?: boolean;
    style?: ViewStyle;
    children?: ViewProps["children"];
    role?: ViewProps["role"];
    tabIndex?: ViewProps["tabIndex"];
    "aria-label"?: ViewProps["aria-label"];
    accessible?: ViewProps["accessible"];
    accessibilityLabel?: ViewProps["accessibilityLabel"];
    accessibilityRole?: ViewProps["accessibilityRole"];
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
}

export interface IHtmlTextProps extends Omit<IHtmlDivProps, "style" | "children" | "onPress" | "onPressIn" | "onPressOut"> {
    style?: TextStyle;
    children?: TextProps["children"];
    onPress?: TextProps["onPress"];
    onPressIn?: TextProps["onPressIn"];
    onPressOut?: TextProps["onPressOut"];
}

export interface IHtmlImageProps extends Omit<IHtmlDivProps, "style" | "children"> {
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

export interface IHtmlAprops extends IHtmlTextProps {
    /** @platform web */
    href?: string;
    /** @platform web */
    target?: string;
    /** @platform web */
    rel?: string;
    /** @platform web */
    download?: boolean | string;
}