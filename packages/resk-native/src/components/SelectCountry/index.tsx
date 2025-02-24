import { Dropdown, IDropdownProps } from "@components/Dropdown";
import { CountriesManager, defaultStr, ICountry, ICountryCode, isNonNullString } from "@resk/core";
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from "react-native";
import React, { useMemo } from "react";
import { Icon } from "@components/Icon";
import Label from "@components/Label";
import View from "@components/View";
import Theme from "@theme/index";

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

/***
 * The country selector component.
 * 
 * @component
 * @param {ISelectCountryProps} props - The props for the country selector component.
 * @returns {JSX.Element} The rendered country selector component.
 */
export const SelectCountry = React.forwardRef<any, ISelectCountryProps>(({ withLabel, label, anchorProps, textColor, iconSize, ...props }, ref) => {
    const countries = useMemo(() => {
        return Object.values(CountriesManager.getCountries());
    }, []);
    anchorProps = Object.assign({}, anchorProps);
    iconSize = typeof iconSize == "number" ? iconSize : 24;
    return <Dropdown<ICountry, ICountryCode>
        ref={ref}
        items={countries}
        multiple={false}
        label={label}
        withLabel={withLabel}
        getItemValue={({ item }) => item.code}
        getItemLabel={({ item }) => {
            return <View style={styles.countryFlagContainer}>
                <Icon.CountryFlag countryCode={item.code} size={iconSize} />
                <Label>{item.name}</Label>
                {isNonNullString(item.dialCode) && <Label>{"(+" + item.dialCode.ltrim("+") + ") "}</Label>}
            </View>;
        }}
        anchor={({ dropdownContext, selectedItems, selectedValues, onPress, disabled }) => {
            const itemsContent = useMemo(() => {
                return selectedItems.map((item) => {
                    return <Icon.CountryFlag
                        key={item.code}
                        countryCode={item.code}
                        size={iconSize}
                        style={styles.countryFlag}
                        fallback={<Label color={textColor} >[{item.code}]</Label>}
                    />
                });
            }, [selectedItems]);
            return <TouchableOpacity
                testID={defaultStr(dropdownContext?.getTestID()) + "-anchor"}
                {...anchorProps}
                onPress={onPress}
                disabled={disabled}
            >
                {<View testID={defaultStr(dropdownContext?.getTestID()) + "-anchor-label"} style={[styles.labelContainer, disabled && Theme.styles.disabled]}>
                    {itemsContent.length ? itemsContent :
                        <>
                            <Icon.Font
                                name={"material-language"}
                                size={iconSize}
                                color={textColor}
                                disabled={disabled}
                            />
                            {withLabel ? label : null}
                        </>
                    }
                    {<Icon.Font style={styles.chevronIcon} name={"chevron-down"} size={20} color={textColor} disabled={disabled} />}
                </View>}
            </TouchableOpacity>;
        }}
        {...props}
    />
});

SelectCountry.displayName = "SelectCountry";


const styles = StyleSheet.create({
    countryFlagContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    countryFlag: { pointerEvents: "box-none" },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "wrap"
    },
    chevronIcon: {}
})
SelectCountry.displayName = "SelectCountry";
