import { IDropdownProps } from "@components/Dropdown";
import { ICountryFlagProps } from "@components/Icon/CountryFlag";
import { ICountry, ICountryCode } from "@resk/core/countries";
import { TouchableOpacityProps } from 'react-native';

/***
 * The props for the country selector component.
 * 
 * @interface ICountrySelectorProps
 * @extends IDropdownProps<ICountry, ICountryCode>
 */
export interface ICountrySelectorProps extends IDropdownProps<ICountry, ICountryCode> {
    /***
     * The props for the country flag component.
     * This is an object that defines the props for the country flag component.
     */
    countryFlagProps?: Omit<ICountryFlagProps, "countryCode">;
    /**
     * Whether to display the dial code for each country item.
     */
    displayDialCode?: boolean;
    /***
     * The props for the anchor component that wraps the dropdown anchor.
     * This is an object that defines the props for the anchor component, which is a TouchableOpacity component.
     */
    anchorProps?: Omit<TouchableOpacityProps, "onPress" | "disabled">;
}