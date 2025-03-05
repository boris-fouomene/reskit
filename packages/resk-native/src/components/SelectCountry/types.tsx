import { IDropdownProps } from "@components/Dropdown/types";
import { ICountryFlagProps } from "@components/Icon";
import { ICountry, ICountryCode } from "@resk/core";
import { TouchableOpacityProps } from 'react-native';

/***
 * The props for the country selector component.
 * 
 * @interface ISelectCountryProps
 * @extends IDropdownProps<ICountry, ICountryCode>
 */
export interface ISelectCountryProps extends IDropdownProps<ICountry, ICountryCode> {
    /***
     * The props for the country flag component.
     * This is an object that defines the props for the country flag component.
     */
    countryFlagProps?: Omit<ICountryFlagProps, "countryCode">;
    /***
     * The font size of the text when the Label is rendered.
     * This is a number that represents the font size of the text when the Label is rendered.
     */
    textFontSize?: number;

    /***
     * The props for the anchor component that wraps the dropdown anchor.
     * This is an object that defines the props for the anchor component, which is a TouchableOpacity component.
     */
    anchorProps?: Omit<TouchableOpacityProps, "onPress" | "disabled">;
}