import { IDropdownProps } from "@components/Dropdown/types";
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
     * The color for text elements in the component.
     */
    textColor?: string;
    iconSize?: number;

    /***
     * The props for the anchor component that wraps the dropdown anchor.
     * This is an object that defines the props for the anchor component, which is a TouchableOpacity component.
     */
    anchorProps?: Omit<TouchableOpacityProps, "onPress" | "disabled">;
}