import { Dropdown, IDropdownProps } from "@components/Dropdown";
import { CountriesManager, defaultStr, ICountry, ICountryCode, isNonNullString } from "@resk/core";
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from "react-native";
import React, { useMemo } from "react";
import { Icon } from "@components/Icon";
import Label from "@components/Label";
import View from "@components/View";
import Theme, { Colors } from "@theme/index";
import { ISelectCountryProps } from "./types";
import { SelectCountryRef } from "@components/TextInput/SelectCountryRef";

/***
 * The country selector component.
 * 
 * @component
 * @param {ISelectCountryProps} props - The props for the country selector component.
 * @returns {JSX.Element} The rendered country selector component.
 */
export const SelectCountry = React.forwardRef<any, ISelectCountryProps & {displayDialCode?:boolean}>(({ withLabel,displayDialCode, label, anchorProps, textColor, iconSize, ...props }, ref) => {
    const countries = useMemo(() => {
        return Object.values(CountriesManager.getCountries());
    }, []);
    anchorProps = Object.assign({}, anchorProps);
    iconSize = typeof iconSize == "number" ? iconSize : 24;
    const canDisplayDialCode = displayDialCode !== false;
    return <Dropdown<ICountry, ICountryCode>
        ref={ref}
        items={countries}
        multiple={false}
        label={label}
        withLabel={withLabel}
        getItemValue={({ item }) => item.code}
        getItemLabel={({ item }) => {
            return <View style={styles.countryFlagContainer}>
                <Icon.CountryFlag  countryCode={item.code} size={iconSize} style={styles.countryFlagIcon} />
                <Label>{item.name}</Label>
                {canDisplayDialCode && isNonNullString(item.dialCode) ? <Label style={styles.itemLabel}>{"(+" + item.dialCode.ltrim("+") + ") "}</Label> : null}
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
            }, [selectedItems,textColor]);
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
        menuProps={Object.assign({},{minWidth:canDisplayDialCode?280:260}, props.menuProps)}
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
    countryFlagIcon:{
        marginRight:5,
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "wrap"
    },
    chevronIcon: {},
    itemLabel : {
        fontSize:12,
        opacity:0.8
    }
})
SelectCountry.displayName = "SelectCountry";

SelectCountryRef.Component = SelectCountry;

export * from "./types";