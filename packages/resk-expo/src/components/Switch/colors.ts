import { ITheme } from "@theme/types";
import { IToggleableProps } from "./types";
import { Colors } from "@theme/index";
import Platform from "@platform";


/**
 * Gets the thumb tint color for a toggle switch based on the current theme, 
 * disabled state, and value.
 * @see : https://github.com/callstack/react-native-paper/blob/main/src/components/Switch/utils.ts
 * 
 * @param {Object} params - The parameters for the function.
 * @param {IBaseType} params.theme - The current theme object.
 * @param {boolean} params.disabled - Indicates if the toggle is disabled.
 * @param {boolean} params.value - Indicates the current value of the toggle.
 * @param {string} params.checkedColor - The color to use when the toggle is checked.
 * @returns {string | undefined} The color to use for the thumb tint.
 */
export const getThumbTintColor = ({
    theme,
    disabled,
    value,
    checkedColor,
}: IBaseType) => {
    const isIOS = Platform.isIos();
    if (isIOS) {
        return undefined;
    }
    if (disabled) {
        if (theme.dark) {
            return '#424242';//grey800;
        }
        return '#bdbdbd'//grey400;
    }

    if (value) {
        return checkedColor;
    }

    if (theme.dark) {
        return '#bdbdbd'//grey400;
    }
    return '#fafafa'//grey50;
};

/**
 * Gets the on tint color for a toggle switch based on the current theme, 
 * disabled state, and value.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {IBaseType} params.theme - The current theme object.
 * @param {boolean} params.disabled - Indicates if the toggle is disabled.
 * @param {boolean} params.value - Indicates the current value of the toggle.
 * @param {string} params.checkedColor - The color to use when the toggle is checked.
 * @returns {string} The color to use for the on tint.
 */
const getOnTintColor = ({
    theme,
    disabled,
    value,
    checkedColor,
}: IBaseType) => {
    const isIOS = Platform.isIos();
    if (isIOS) {
        return checkedColor;
    }

    if (disabled) {
        if (theme.dark) {
            return Colors.setAlpha("white", 0.06);
        }
        return Colors.setAlpha("black", 0.12);
    }
    if (value) {
        return Colors.setAlpha(checkedColor, 0.5);
    }

    if (theme.dark) {
        return '#616161'//grey700;
    }
    return 'rgb(178, 175, 177)';
};

/**
 * Gets the colors for a toggleable component based on the current theme, 
 * disabled state, and value.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {IToggleableProps} params.color - The color to use when the toggle is checked.
 * @param {IBaseType} params.theme - The current theme object.
 * @param {boolean} params.disabled - Indicates if the toggle is disabled.
 * @param {boolean} params.value - Indicates the current value of the toggle.
 * @returns {Object} An object containing the onTintColor, thumbTintColor, and checkedColor.
 */
export const getToggleableColor = ({
    theme,
    disabled,
    value,
    color,
}: IToggleableProps & IBaseType) => {
    const checkedColor = Colors.isValid(color) ? color : theme.colors.primary;
    return {
        onTintColor: getOnTintColor({ theme, disabled, value, checkedColor }),
        thumbTintColor: getThumbTintColor({ theme, disabled, value, checkedColor }),
        checkedColor,
    };
};

type IBaseType = { color?: string, checkedColor?: string, disabled: boolean, theme: ITheme, value: any };