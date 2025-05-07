import { ITextStyle } from "@src/types";
import { IThemeColorsTokenName, IThemeFontVariant } from "@theme/types";
import { ReactNode } from "react";
import { Role, Text, TextProps } from "react-native";

/**
 * @interface
 * Props for the Label component.
 * This interface extends the TextProps from React Native
 * and includes additional properties for customization.
 */
export interface ILabelProps extends Omit<TextProps, "role" | "children" | "style"> {
    /***
     * @type Role
     * Role of the label, for accessibility
     */
    role?: Role | undefined;
    /***
    * @type boolean, If true, transforms the text to upper case
    */
    uppercase?: boolean;
    /**
     * @type number, Font size of the text
     */
    fontSize?: number;
    /***
     * @type : boolean
     * If true, wraps the text to the next line
     */
    wrapText?: boolean;

    /***
     * @type : string,  Text color, defaults to the theme's text color
     */
    color?: string;
    /***
     * @type : IThemeColorsTokenName, Color scheme for the label, one of the theme's tokens keys
     */
    colorScheme?: IThemeColorsTokenName;

    /***
     * @type string,  Background color of the text
     */
    backgroundColor?: string;

    /***
     *  User select behavior
     */
    userSelect?: boolean | "auto" | "text" | "none" | "contain" | "all";

    /***
     * @type boolean If true, applies an underline style to the text
     */
    underlined?: boolean;

    /***
     * @type boolean
     * If true, splits the text into multiple lines
     */
    splitText?: boolean;
    /***
     * @type boolean
     * If true, applies a bold font style to the text
     */
    textBold?: boolean;
    /***
     * @type ITextStyle
     * Additional styles for the label
     */
    style?: ITextStyle;
    /***
     * @type ReactNode, Children elements or text content
     */
    children?: ReactNode;

    /***
     * @type IThemeFontVariant
     * The font variant to use for the label
     */
    fontVariant?: IThemeFontVariant;
    
    ref?: React.Ref<Text>;
};