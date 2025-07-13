"use client";
import TextInput from "./Input";
import { ITextInputProps } from "./types";
import { TextInput as RNTextInput } from "react-native";
import { CountrySelector } from "@components/CountrySelector";
import { ICountryCode } from "@resk/core/countries";
import { Div } from "@html/Div";
import { defaultStr, isNonNullString } from "@resk/core/utils";
import { Icon } from "@components/Icon";
import { Text } from "@html/Text";

/**
 * Specialized phone number input component for React Native and web.
 *
 * This component extends the universal {@link TextInput} to provide an optimized experience for phone number entry,
 * including country code selection, phone formatting, and seamless integration with design systems and Tailwind CSS.
 *
 * @param props - {@link ITextInputProps} All standard text input props, plus:
 * - `phoneCountryCode`: The initial country code for phone formatting and flag display.
 * - All other {@link TextInput} props are supported and passed through.
 *
 * @returns The rendered phone input component, including a country selector and a text input field.
 *
 * @example
 * ```tsx
 * import { TelInput } from "@resk/nativewind/components/TextInput";
 *
 * // Basic phone input with country selector
 * <TelInput label="Phone" placeholder="Enter your phone number" />
 *
 * // Pre-select a country code
 * <TelInput phoneCountryCode="US" />
 *
 * // Use with form libraries or custom validation
 * <TelInput
 *   phoneCountryCode="FR"
 *   onChange={({ value, phoneCountryCode }) => {
 *     console.log("Phone:", value, "Country:", phoneCountryCode);
 *   }}
 * />
 * ```
 *
 * @remarks
 * - The country selector is rendered using {@link CountrySelector} and displays a flag or dial code.
 * - The input field is always set to `type="tel"` and disables the default dial code display (handled by the selector).
 * - All styling and behavior can be customized via standard {@link TextInput} props.
 * - The component manages its own country code state and updates the input formatting accordingly.
 * - Designed for accessibility and mobile-friendly UX.
 *
 * @see {@link TextInput}
 * @see {@link ITelInputProps}
 * @see {@link CountrySelector}
 * @see {@link ICountryCode}
 *
 * @public
 */
export function TelInput(props: ITelInputProps) {
    return <TextInput<string>
        displayPhoneDialCode={false}
        renderTextInput={(inputProps, { formatValue, updateInputState, phoneCountryCode, inputTextClassName, label, labelTextClassName, iconTextClassName, phoneDialCodeText, editable, disabled }) => {
            return <>
                <CountrySelector
                    disabled={disabled}
                    readOnly={!editable}
                    multiple={false}
                    defaultValue={phoneCountryCode}
                    menuProps={{ bottomSheetTitle: label }}
                    required
                    onChange={!editable ? undefined : ({ value }) => {
                        if (isNonNullString(value) && value !== phoneCountryCode) {
                            updateInputState(formatValue({ value: "", phoneCountryCode: Array.isArray(value) ? value[0] : value }));
                        }
                    }}
                    anchor={({ dropdown, selectedValues, selectedItems, disabled }) => {
                        const selectedValue = selectedValues[0];
                        const selectedItem = selectedItems[0];
                        const dialCode = defaultStr(selectedItem?.dialCode).ltrim("+").trim();
                        const dialCodeText = phoneDialCodeText || (dialCode ? `+${dialCode}` : "");
                        return <Div testID={defaultStr(dropdown?.getTestID()) + "-anchor-label"} className="flex flex-row items-center self-center justify-start" disabled={disabled}>
                            {selectedValue ? <Icon.CountryFlag
                                countryCode={selectedValue}
                                fallback={<Text className={inputTextClassName}>[{dialCodeText}]</Text>}
                            /> :
                                <>
                                    <Icon.Font
                                        variant={{ size: "25px" }}
                                        name={"material-language" as never}
                                        className={iconTextClassName}
                                        disabled={disabled}
                                    />
                                </>
                            }
                            {<Icon.Font variant={{ size: "20px" }} className={iconTextClassName} name={"chevron-down" as never}
                                disabled={disabled}
                            />}
                        </Div>
                    }}
                />
                <RNTextInput
                    {...inputProps}
                />
            </>
        }}
        {...props}
        type={"tel"}
    />
}

TextInput.displayName = "TextInput.Tel";

export interface ITelInputProps extends Omit<ITextInputProps<string>, "type"> { }