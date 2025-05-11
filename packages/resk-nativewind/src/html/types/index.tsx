import { INativewindBaseProps } from "@src/types";
import { ImageProps, ImageStyle, PressableProps, TextProps, TextStyle, ViewProps, ViewStyle } from "react-native";

export interface IHtmlDivProps extends INativewindBaseProps {
    id?: ViewProps["id"];
    style?: ViewStyle;
    children?: ViewProps["children"];
    role?: ViewProps["role"];
    "data-testid"?: ViewProps["testID"];
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
    testID?: string;
    onPress?: PressableProps['onPress'];
}

export interface IHtmlTextProps extends Omit<IHtmlDivProps, "style" | "children" | "onPress"> {
    style?: TextStyle;
    children?: TextProps["children"];
    onPress?: TextProps["onPress"];
}

export interface IHtmlImageProps extends Omit<IHtmlDivProps, "style" | "children"> {
    style?: ImageStyle;
    src?: ImageProps["src"];
    alt?: string;
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