import { Fragment } from "react";
import { Platform } from "react-native";
const isIos = Platform.OS === "ios";
/**
 * Checks if the provided font icon name is valid.
 *
 * @param name - The name of the font icon to validate.
 * @returns `true` if the font icon name is valid, otherwise `false`.
 */
export const isValidFontIconName = (name: string): boolean => {
    return false;
}

export default function FontIcon(props: any) {
    return null;
}


FontIcon.isValidName = isValidFontIconName;
FontIcon.getIconSet = () => ({ iconSetName: "", iconSetPrefix: "", iconName: "", iconSet: Fragment });
FontIcon.DEFAULT_SIZE = 20;
FontIcon.COPY = "content-copy";
FontIcon.MENU = "menu";
FontIcon.MORE = isIos ? "dots-horizontal" : "dots-vertical";
FontIcon.BACK = isIos ? "chevron-left" : "arrow-left";
FontIcon.PRINT = "printer";
FontIcon.CHECKED = isIos ? 'check' : "checkbox-marked";
FontIcon.UNCHECKED = "checkbox-blank-outline";

FontIcon.CHECK = "check";