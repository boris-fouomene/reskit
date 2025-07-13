"use client";
import { Dropdown } from "@components/Dropdown";
import { isNonNullString } from "@resk/core/utils";
import { CountriesManager, ICountry, ICountryCode, } from "@resk/core/countries";
import { useMemo } from "react";
import { Icon } from "@components/Icon";
import { Div } from "@html/Div";
import { Text } from "@html/Text";
import { cn } from "@utils/cn";
import { ICountrySelectorProps } from "./types";


export function CountrySelector({ countryFlagProps: customCountryFlagProps, displayDialCode, label, anchorProps, ...props }: ICountrySelectorProps) {
    const countries = useMemo(() => {
        return Object.values(CountriesManager.getCountries());
    }, []);
    const { textClassName, textVariant, iconClassName, iconVariant, fallback, ...countryFlagProps } = Object.assign({}, customCountryFlagProps);
    anchorProps = Object.assign({}, anchorProps);
    props.menuProps = Object.assign({}, props.menuProps);
    props.menuProps.bottomSheetVariant = Object.assign({}, props.menuProps.variant);
    props.menuProps.bottomSheetVariant = { minHeight: "threeQuarters", ...props.menuProps.bottomSheetVariant }
    const canDisplayDialCode = displayDialCode !== false;

    return <Dropdown<ICountry, ICountryCode>
        items={countries}
        multiple={false}
        label={label}
        getItemValue={({ item }) => item.code}
        getItemText={({ item }) => `[${item.code}] ${item.name} ( ${item.dialCode.ltrim("+")})`}
        getItemLabel={({ item, index }) => {
            return <Div className={cn("flex flex-row items-center justify-start flex-nowrap")}>
                <Icon.CountryFlag {...countryFlagProps} countryCode={item.code} className={cn("mr-[5px]", countryFlagProps?.className)} />
                <Text>{item.name}</Text>
                {canDisplayDialCode && isNonNullString(item.dialCode) ? <Text className={cn(textClassName)} variant={textVariant}>{"(+" + item.dialCode.ltrim("+") + ")"}</Text> : null}
            </Div>;
        }}
        {...props}
        menuProps={Object.assign({}, { minWidth: canDisplayDialCode ? 280 : 260 }, props.menuProps)}
    />
};

CountrySelector.displayName = "CountrySelector";


CountrySelector.displayName = "CountrySelector";

export * from "./types";