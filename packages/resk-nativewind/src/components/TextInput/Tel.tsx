"use client";
import TextInput from "./Input";
import { ITextInputProps } from "./types";
import { TextInput as RNTextInput, TouchableOpacity } from "react-native";
import { SelectCountry } from "@components/SelectCountry";
import useStateCallback from "@utils/stateCallback";
import { ICountryCode } from "@resk/core/countries";
import { Div } from "@html/Div";
import { defaultStr, isNonNullString } from "@resk/core/utils";
import { Icon } from "@components/Icon";
import { Text } from "@html/Text";
import { useMemo } from "react";
/**
 * A variant of the TextInput component specifically designed for phone number input.
 * @param {ITextInputProps} props - The props for the TextInput component.
 * @param {ICountryCode | undefined} [phoneCountryCode] - The country code to display as a dropdown.
 * @returns {JSX.Element} - The rendered TelInput component.
 */
export function TelInput({ phoneCountryCode: customPhoneCountryCode, ...props }: ITextInputProps) {
    const [phoneCountryCode, setPhoneCountryCode] = useStateCallback<ICountryCode | undefined>(customPhoneCountryCode);
    useMemo(() => {
        if (phoneCountryCode !== customPhoneCountryCode && isNonNullString(customPhoneCountryCode)) {
            setPhoneCountryCode(customPhoneCountryCode);
        }
    }, [phoneCountryCode, customPhoneCountryCode]);
    const editable = !props.disabled && props.editable !== false && !props.readOnly;
    return <TextInput
        disabled={props.disabled}
        editable={editable}
        displayPhoneDialCode={false}
        phoneCountryCode={phoneCountryCode}
        renderTextInput={(inputProps, { toCase, isPhone, labelClassName, iconClassName, phoneDialCodeLabel, editable, disabled, computedVariant }) => {
            return <>
                <SelectCountry
                    disabled={disabled}
                    readOnly={!editable}
                    multiple={false}
                    defaultValue={phoneCountryCode}
                    onChange={({ value }) => {
                        setPhoneCountryCode(value as any);
                    }}
                    anchor={({ dropdown, selectedItems, selectedValues, onPress, disabled }) => {
                        const selectedValue = selectedValues[0];
                        return <TouchableOpacity
                            testID={defaultStr(dropdown?.getTestID()) + "-anchor"}
                            onPress={onPress}
                            disabled={disabled}
                        >
                            {<Div testID={defaultStr(dropdown?.getTestID()) + "-anchor-label"} className="flex-row items-center self-center justify-start" disabled={disabled}>
                                {selectedValue ? <Icon.CountryFlag
                                    countryCode={selectedValue}
                                    fallback={phoneDialCodeLabel ? phoneDialCodeLabel : <Text className={labelClassName}>[{selectedValue}]</Text>}
                                /> :
                                    <>
                                        <Icon.Font
                                            name={"language" as never}
                                            className={iconClassName}
                                            disabled={disabled}
                                        />
                                    </>
                                }
                                {<Icon.Font variant={{ size: "20px" }} className={iconClassName} name={"chevron-down" as never}
                                    disabled={disabled}
                                />}
                            </Div>}
                        </TouchableOpacity>;
                    }}
                />
                <RNTextInput
                    {...inputProps}
                />
            </>
        }}
        {...props}
    />
}

TextInput.displayName = "TextInput.Tel";

export interface ITelInputProps extends Omit<ITextInputProps, "type"> {
    type: "tel";
}