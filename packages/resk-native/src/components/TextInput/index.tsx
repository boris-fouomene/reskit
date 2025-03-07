import Label from "@components/Label";
import { isValidElement, useMergeRefs } from "@utils";
import { NativeSyntheticEvent, Pressable, TextInput as RNTextInput, StyleSheet, TextInputChangeEventData, TextInputFocusEventData, TextInputKeyPressEventData } from 'react-native';
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { InputFormatter, ICountryCode, Platform, IDict, isNonNullString, isStringNumber, isEmpty, defaultStr, IInputFormatterMaskResult, defaultBool, DateHelper, IInputFormatterResult } from "@resk/core";
import _, { isNumber } from "lodash";
import Theme, { useTheme } from "@theme";
import FontIcon from "@components/Icon/Font";
import View from "@components/View";
import { getLabelOrLeftOrRightProps } from "@hooks/label2left2right";
import { ITextInputCallbackOptions, ITextInputProps, ITextInputType, IUseTextInputProps } from "./types";
import { ITheme } from "@theme/types";
import { IStyle } from "@src/types";
import { IFontIconProps } from "@components/Icon";
import Breakpoints from "@breakpoints/index";
import { Calendar, CalendarModalContext } from "@components/Date";
import { useI18n } from "@src/i18n";
import { SelectCountryRef } from "./SelectCountryRef";
import p from "@platform";
import { TouchableOpacity } from "react-native";
import { KeyboardAvoidingView } from "@components/KeyboardAvoidingView";

const isNative = p.isNative();

/**
 * @description
 * The `TextInput` component is an enhanced version of the standard TextInput from React Native.
 * It is designed to be highly customizable and feature-rich, catering to various user input requirements.
 *
 * Key Features:
 * - **Custom Formatting**: Automatically formats the input value based on the provided options, ensuring that the data adheres to the desired format.
 * - **Affixes**: Allows for the addition of suffix elements (such as icons or labels) to the input field, enhancing its usability and aesthetic appeal.
 * - **Secure Text Entry**: Supports secure text entry for sensitive information (like passwords), with a toggle feature to show or hide the input.
 * - **Debouncing**: Implements a debouncing mechanism for input changes to optimize performance and reduce the frequency of change events being fired.
 * - **Dynamic Input Modes**: Automatically adjusts the input mode (e.g., text, number, decimal) based on user interaction, improving the overall user experience.
 * - **Accessibility Features**: Incorporates accessibility props to ensure that the component is usable for all users, including those using assistive technologies.
 *
 * Props:
 * - `defaultValue`: The initial value displayed in the input field before any user interaction.
 * - `testID`: A unique identifier for testing purposes, useful in automated tests.
 * - `left` / `right`: Custom components that can be rendered on the left or right side of the input, such as icons or buttons.
 * - `debounceTimeout`: The time (in milliseconds) to wait before firing the onChange event after the user stops typing.
 * - `length`: The number of characters allowed in the input field.
 * - `maxLength`: The maximum number of characters allowed in the input field.
 * - `secureTextEntry`: A boolean that determines whether the input should be obscured (for passwords).
 * - `onChange`: A callback function that is triggered whenever the input value changes, allowing for real-time updates.
 * - `affix`: Can be a ReactNode of false or a function that returns a React element, used to display additional information alongside the input.
 *
 * Example Usage:
 * ```ts
 * import {TextInput} from "@resk/native";
import defaultVal from '../../../../../../frontend-dash/src/utils/defaultVal';
 *
 * export function MyTextInput() {
 *     // Callback function to handle changes in the input
 *     const handleInputChange = (input) => {
 *         console.log("Input changed:", input);
 *     };
 *     return (
 *         <TextInput
 *             defaultValue="Enter your text here" // Initial value of the input
 *             type="text" // Specifies the type of input
 *             maxLength={100} // Limits the input to 100 characters
 *             onChange={handleInputChange} // Callback for handling changes
 *             affix={<Icon iconName="info" />} // Adds an info icon as an affix
 *             secureTextEntry={false} // Indicates that the input does not require secure handling
 *         />
 *     );
 * }
 * ```
 *
 * In this example, the `MyTextInput` function demonstrates how to utilize the `TextInput` component:
 * - The `defaultValue` prop initializes the input with placeholder text, guiding the user on what to enter.
 * - The `type` prop specifies that the input is of type "text", meaning it will accept regular text input.
 * - The `maxLength` prop restricts the user from entering more than 100 characters, ensuring data integrity.
 * - The `onChange` prop is a function that logs the input value to the console whenever it changes, allowing for real-time data handling.
 * - The `affix` prop adds an information icon next to the input, which can provide context or additional functionality.
 * - The `secureTextEntry` prop is set to false, indicating that this input field is not for sensitive information.
 *
 * The `TextInput` component is designed to be versatile and reusable across various parts of an application, ensuring a consistent and engaging user experience. 
 * It can be easily integrated with other components and libraries, making it a valuable addition to any React Native project.
 */
const TextInput = React.forwardRef(({ render, ...props }: ITextInputProps, ref?: React.Ref<RNTextInput>) => {
    const { variant, containerProps, onPress, focus, onPressIn, onPressOut, editable, canRenderLabel, isFocused, leftContainerProps: cLeftContainerProps, contentContainerProps, left, inputRef, right, label, ...rest } = useTextInput(props);
    const leftContainerProps = Object.assign({}, cLeftContainerProps);
    const isLabelEmbededVariant = variant === "labelEmbeded";
    const { testID } = rest;
    const labelContent = !isEmpty(label) && editable ? <Pressable testID={testID + "-text-input-pressable-container"} onPress={focus}>{label}</Pressable> : label;
    const canWrapWithTouchable = props.isDropdownAnchor && editable && !props.readOnly;
    const Wrapper = canWrapWithTouchable ? TouchableOpacity : View;
    const pressableProps = { onPress, onPressIn, onPressOut, testID: `${testID}-dropdown-anchor-container`, style: [styles.dropdownAnchorContainer] };
    const wrapperProps = canWrapWithTouchable ? Object.assign({}, pressableProps) : {};
    const inputProps = { ...(!canWrapWithTouchable && editable ? pressableProps : {}), focus, ...rest, editable: canWrapWithTouchable ? false : editable, readOnly: canWrapWithTouchable ? true : props.readOnly }
    const inputElement = typeof render == "function" ? render(inputProps, inputRef) : <RNTextInput {...inputProps} ref={inputRef} />;
    return <KeyboardAvoidingView {...containerProps} >
        {isLabelEmbededVariant ? null : labelContent}
        <Wrapper {...wrapperProps} {...contentContainerProps} style={[styles.wrapper, contentContainerProps?.style]}>
            <View testID={testID + "-left-content-container"} {...leftContainerProps} style={[styles.leftOrRightContainer, styles.leftContentContainer, canWrapWithTouchable && styles.leftContainerWrappedWithTouchable, leftContainerProps.style]}>
                {left}
                {isLabelEmbededVariant ? labelContent : null}
            </View>
            <View testID={testID + "-input-container"} style={[styles.inputContainer, canWrapWithTouchable && styles.leftContainerWrappedWithTouchable]}>
                {inputElement}
            </View>
            {right ? (<View testID={testID + "-right-content-container"} style={[styles.leftOrRightContainer, styles.rightContentContainer]}>
                {right}
            </View>) : null}
        </Wrapper>
    </KeyboardAvoidingView>
});

/**
 * Function to determine the styles for the container and content based on the input state.
 *
 * @param {Object} params - The parameters for the function.
 * @param {boolean} params.isLabelEmbededVariant - Indicates if the label is embedded within the input.
 * @param {boolean} params.canHandleFloatingLabel - Indicates if the input can handle a floating label.
 * @param {boolean} params.isFocused - Indicates if the input is currently isFocused.
 * @param {string} [params.textColor] - The color of the text displayed in the input.
 * @param {string} [params.borderColor] - The color of the input's border.
 * @param {ITheme} params.theme - The theme object providing styling information.
 * @param {boolean} params.isFlatVariant - Indicates if the input has a flat variant styling.
 * @param {boolean} params.isOutlinedVariant - Indicates if the input has an outlined variant styling.
 * @param {boolean} params.isDefaultVariant - Indicates if the input is in the default variant styling.
 * @returns {Object} An object containing styles for the container, content, input, and label.
 *
 * @example
 * const styles = getContainerAndContentStyle({
 *   isLabelEmbededVariant: true,
 *   canHandleFloatingLabel: true,
 *   isFocused: false,
 *   textColor: '#000',
 *   borderColor: '#ccc',
 *   theme: myTheme,
 *   isFlatVariant: false,
 *   isOutlinedVariant: false,
 *   isDefaultVariant: true,
 * });
 * 
 * console.log(styles); // { containerStyle: [...], contentContainerStyle: [...], inputStyle: [...], labelStyle: [...] }
 */
const getContainerAndContentStyle = ({ isFocused, variant, withBackground, compact, isLabelEmbededVariant, textColor, borderColor, theme, isDefaultVariant }: { isLabelEmbededVariant: boolean, canRenderLabel: boolean, theme: ITheme, variant: ITextInputProps["variant"], isFocused: boolean, textColor?: string, borderColor?: string, isDefaultVariant: boolean, compact?: boolean, withBackground?: boolean }) => {
    const isFlatVariant = false;//variant === "flat";
    const backgroundColor = withBackground !== false ? theme.colors.surfaceVariant : undefined;
    const contentContainerStyle: IStyle = [], containerStyle: IStyle = [], inputStyle: IStyle = [styles.input, { color: textColor }], labelStyle: IStyle = [{ color: textColor }];
    const borderedStyle = [
        isFocused ? styles.focusedOutlineBorder : styles.borderWidth1,
        { borderColor, borderRadius: theme.roundness },
    ];
    const notEmbeededLabelStyle = [styles.notEmbededLabelStyle],
        notEmbeededInputStyle: IStyle[] = []
    if (isLabelEmbededVariant) {
        contentContainerStyle.push(borderedStyle);
    } else if (isFlatVariant) {
        contentContainerStyle.push(styles.flatVariantContentContainer);
    } else {
        inputStyle.push(notEmbeededInputStyle);
        labelStyle.push(notEmbeededLabelStyle)
        contentContainerStyle.push(borderedStyle);
    }
    if (backgroundColor) {
        contentContainerStyle.push({ backgroundColor });
    }
    if (compact) {
        inputStyle.push(styles.compact);
        contentContainerStyle.push(styles.compact);
        //labelStyle.push(styles.compact);
    }
    return { containerStyle, contentContainerStyle, inputStyle, labelStyle }
}
const iconSize = 25;
/***
 * A custom hook for managing the state and behavior of a text input component.
 * This hook encapsulates logic for handling focus, value formatting, and various
 * properties related to the text input, such as error handling, secure text entry,
 * and label rendering.
 *
 * @function useTextInput
 * @param {ITextInputProps} props - The properties for configuring the text input behavior.
 * 
 * @param {string} [props.defaultValue] - The default value of the input, it's the initial value of the text input when it is rendered.
 * 
 * @param {string} [props.testID] - An optional identifier for testing purposes, useful for UI testing frameworks.
 * 
 * @param {string} [props.value] - The controlled value of the text input. This is omitted from the function's parameters.
 * 
 * @param {boolean} [props.withLabel] - A flag indicating whether to display a label with the input.
 * 
 * @param {ReactNode} [props.left] - Custom content to be rendered on the left side of the text input, such as an icon.
 * 
 * @param {string} [props.variant] - The variant of the text input, determining its style (e.g., "default", "flat", "outlined"). Defaults to "default".
 * 
 * @param {boolean} [props.error] - A flag indicating whether there is an error associated with the input.
 * 
 * @param {ReactNode} [props.label] - Custom label content for the text input.
 * 
 * @param {object} [props.labelProps] - Additional properties to customize the label's behavior or appearance.
 * 
 * @param {object} [props.containerProps] - Properties for customizing the container of the text input.
 * 
 * @param {ReactNode} [props.right] - Custom content to be rendered on the right side of the text input.
 * 
 * @param {object} [props.contentContainerProps] - Properties for customizing the content container of the text input.
 * 
 * @param {number} [props.debounceTimeout] - The debounce timeout in milliseconds for handling input changes.
 * 
 * @param {object} [props.rightContainerProps] - Properties for customizing the right container of the text input.
 * 
 * @param {object} [props.leftContainerProps] - Properties for customizing the left container of the text input.
 * 
 * @param {boolean} [props.emptyValue] - A flag indicating whether the input can be empty.
 * 
 * @param {number} [props.maxLength] - The maximum length of the input value.
 * 
 * @param {number} [props.length] - The current length of the input value.
 * 
 * @param {function} [props.affix] - A function or ReactNode to render additional content associated with the input.
 * 
 * @param {string} [props.type] - The type of the input (e.g., "text", "password", "number").
 * 
 * @param {boolean} [props.readOnly] - A flag indicating whether the input is read-only.
 * 
 * @param {boolean} [props.secureTextEntry] - A flag indicating whether the input should hide the text (for passwords).
 * 
 * @param {function} [props.toCase] - A function to transform the input value.
 * 
 * @param {string} [props.inputMode] - The input mode for the text input, which can affect the keyboard layout on mobile devices.
 * 
 * @param {function} [props.onChange] - A callback function that is invoked when the input value changes.
 * 
 * @returns {IUseTextInputProps} An object containing properties and methods to manage the text input state, including:
 * 
 * - `autoComplete`: The auto-complete behavior for the text input.
 * - `placeholderTextColor`: The color of the placeholder text.
 * - `underlineColorAndroid`: The underline color for Android (set to "transparent" for no underline).
 * - `containerProps`: Properties for the container element.
 * - `contentContainerProps`: Properties for the content container element.
 * - `label`: The label element for the text input.
 * - `placeholder`: The placeholder text for the input.
 * - `testID`: The test ID for the input component.
 * - `readOnly`: Whether the input is read-only.
 * - `secureTextEntry`: Whether the input should hide the text.
 * - `style`: The style for the text input.
 * - `value`: The current value of the text input.
 * - `inputMode`: The input mode for the text input.
 * - `onChange`: A callback function for handling input changes.
 * @example
 * @example
 * const { containerProps,label,left,right, contentContainerProps, value, onChange } = useTextInput({
 *   defaultValue: "Hello",
 *   testID: "myTextInput",
 *   onChange: ({value:newValue}) => console.log("Value changed:", newValue),
 * });
 * return (
 *   <View {...containerProps}>
 *     <View {...contentContainerProps}>
 *      {left}
 *      {label}
 *      <TextInput {...props} value={value} onChange={onChange} />
 *      {right}
 *     </View>
 *   </View>
 * );
 * 
 */
export const useTextInput = ({ defaultValue, dateFormat: customDateFormat, style: customStyle, mask: customMask, handleMaskValidationErrors, phoneCountryCode: customPhoneCountryCode, suffixLabelWithMaskPlaceholder, maskOptions: customMaskOptions, maxHeight: customMaxHeight, withBackground, onContentSizeChange, minHeight: customMinHeight, compact, opacity, isDropdownAnchor, secureTextEntryGetToggleIconProps, testID, value: omittedValue, withLabel, left: customLeft, variant = "default", error: customError, label: customLabel, labelProps, containerProps, right: customRight, contentContainerProps, debounceTimeout, rightContainerProps, emptyValue: cIsEmptyValue, maxLength, length, calendarProps: customDateProps, affix, type, readOnly, secureTextEntry, toCase: cToCase, inputMode: cInputMode, onChange, ...props }: ITextInputProps, ref?: React.Ref<RNTextInput>): IUseTextInputProps => {
    const [isFocused, setIsFocused] = React.useState(false);
    const style = StyleSheet.flatten([customStyle])
    const fontSize = style.fontSize ?? 16;
    const { isPhone, isDateOrTime, typeString } = useMemo(() => {
        const t = String(type).toLowerCase();
        return {
            isPhone: t == "tel",
            typeString: t,
            isDateOrTime: t == "datetime" || t == "date" || t == "time"
        }
    }, [type]);
    const i18n = useI18n();
    const theme = useTheme();
    const innerRef = useRef<RNTextInput | null>(null);
    const inputRef = useMergeRefs(ref, innerRef);
    const focus = () => {
        if (innerRef?.current && typeof innerRef.current.focus === "function") {
            innerRef.current.focus();
        }
    };
    contentContainerProps = Object.assign({}, contentContainerProps);
    rightContainerProps = Object.assign({}, rightContainerProps);
    containerProps = Object.assign({}, containerProps);
    testID = testID || "resk-text-input";
    const isPasswordField = useMemo<boolean>(() => String(type).toLowerCase() === "password", [type]);
    const isLabelEmbededVariant = variant == "labelEmbeded";
    const isDefaultVariant = !isLabelEmbededVariant;
    const [isSecure, setIsSecure] = React.useState(typeof secureTextEntry === "boolean" ? secureTextEntry : true);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
    useEffect(() => {
        return () => {
            clearTimeout(debounceTimeoutRef.current);
        }
    }, []);
    useEffect(() => {
        if (secureTextEntry !== isSecure && typeof secureTextEntry === 'boolean') {
            setIsSecure(secureTextEntry);
        }
    }, [secureTextEntry]);

    const { inputMode, isNumberType: canValueBeDecimal } = useMemo(() => {
        let inputMode = !isFocused ? "text" : cInputMode || type == "number" ? "decimal" : type !== "password" ? type : "text";
        if (isPhone) {
            inputMode = "tel";
        } else if (isDateOrTime) {
            inputMode = "datetime";
        } else if (typeString === "email") {
            inputMode = "email";
        }
        const isNumberType = isDecimalType(inputMode as string);
        return {
            inputMode,
            isNumberType
        }
    }, [type, cInputMode, isFocused, isPhone, isDateOrTime, typeString]);
    const emptyValue = cIsEmptyValue || (canValueBeDecimal ? "0" : "");

    ///mask handling
    const { mask, maskOptions, dateFormat, calendarProps: { iconProps, ...calendarProps }, canRenderCalendar } = useMemo(() => {
        const maskOptions = Object.assign({}, { placeholder: '_' }, customMaskOptions);
        let mask = InputFormatter.isValidMask(customMask) ? customMask : undefined;
        const calendarProps = Object.assign({}, customDateProps);
        let validate = (value: string) => true;
        const isDate = typeString == "date", isTime = typeString == "time";
        const dateFormat = calendarProps.dateFormat = !isDateOrTime ? defaultStr(calendarProps.dateFormat, customDateFormat) : defaultStr(calendarProps.dateFormat, customDateFormat, isDate ? DateHelper.DEFAULT_DATE_FORMAT : isTime ? DateHelper.DEFAULT_TIME_FORMAT : DateHelper.DEFAULT_DATE_TIME_FORMAT);
        if (!mask || !Array.isArray(mask) || !mask.length) {
            if (isDateOrTime) {
                const m2 = InputFormatter.createDateMask(dateFormat);
                mask = m2.mask;
                validate = m2.validate;
            }
        }
        const { validate: maskOptionsValidate } = maskOptions;
        (maskOptions as any).validate = (value: string) => {
            return validate(value) && (typeof maskOptionsValidate == "function" ? maskOptionsValidate(value) : true);
        }
        return {
            maskOptions,
            mask,
            validate,
            dateFormat,
            calendarProps,
            canRenderCalendar: ["datetime", "date"].includes(typeString),
        }
    }, [customMask, customMaskOptions, typeString, customDateFormat, isDateOrTime, customDateProps]);
    const toCase = (value: any, phoneCountryCode?: ICountryCode): IInputFormatterResult & { phoneCountryCode?: ICountryCode } => {
        const valString = String(value);
        const valEndsWithDecimal = InputFormatter.endsWithDecimalSeparator(valString);
        if (canValueBeDecimal && isFocused && (valString.length == 1 && valEndsWithDecimal)) {
            value = "0" + value;
        }
        if (value === emptyValue && isFocused) {
            value = "";
        }
        if (cToCase) return cToCase(value);
        if (value == undefined) value = '';
        if (isStringNumber(String(value))) value += "";
        if (canValueBeDecimal && (!valEndsWithDecimal && (String(value).length <= 1 || !String(value).endsWith("0")))) {
            value = InputFormatter.parseDecimal(value);
        }
        if (isPhone && value) {
            value = InputFormatter.formatPhoneNumber(value, phoneCountryCode);
        }
        return {
            phoneCountryCode,
            ...(mask ? InputFormatter.formatWithMask({ ...maskOptions, maskAutoComplete: true, value, mask, type }) : {}),
            ...InputFormatter.formatValue({ ...props, phoneCountryCode, dateFormat, type, value }),
            value,
        }
    };
    const valCase = useMemo(() => {
        return toCase(defaultValue, customPhoneCountryCode);
    }, [defaultValue, mask, maskOptions, customPhoneCountryCode])
    const [inputState, setInputState] = React.useState<IInputFormatterResult & { phoneCountryCode?: ICountryCode }>(valCase);
    const focusedValue = isFocused ? (inputState.value === emptyValue ? '' : inputState.value) : '';
    useEffect(() => {
        if (areCasesEquals(valCase, inputState)) return;
        setInputState({ ...inputState, ...valCase });
    }, [defaultValue, valCase]);

    //handle mask
    const { maskArray, maskHasObfuscation, placeholder: inputMaskPlaceholder, dialCode: phoneDialCode } = inputState;
    const hasInputMask = Array.isArray(maskArray) && !!maskArray.length;

    const inputValue = hasInputMask ? defaultStr(maskHasObfuscation && !isFocused ? inputState.obfuscated : inputState.masked) : (isFocused ? focusedValue : inputState.formattedValue || emptyValue || "");
    const isPhoneValid = (value: string, phoneCountryCode?: ICountryCode) => {
        const v = String(value);
        return v ? InputFormatter.isValidPhoneNumber(v, phoneCountryCode) : true
    };
    const isInputValid = useMemo(() => {
        return (inputState.isValid !== false && (!isPhone || isPhoneValid(inputState.value, inputState.phoneCountryCode)));
    }, [inputState.value, inputState.isValid, isPhone, inputState.phoneCountryCode]);
    const error = useMemo(() => {
        return !!customError || defaultBool(handleMaskValidationErrors, !!inputState.value) && !isInputValid;
    }, [customError, isInputValid, handleMaskValidationErrors, inputState.value])

    const disabled = props.disabled || readOnly;
    const editable = !disabled && props.editable !== false && readOnly !== false || false;
    const canToggleSecure = isPasswordField;
    const textColor = error ? theme.colors.error : isFocused && editable ? theme.colors.primary : theme.colors.onSurfaceVariant;
    const callOptions: ITextInputCallbackOptions = { ...inputState, error: !!error, variant, isFocused, textColor: textColor as string, editable, disabled: disabled as boolean };
    const multiline = !!props.multiline;
    const isMobile = Breakpoints.isMobileMedia();
    const minHeight = useMemo(() => {
        return typeof customMinHeight === "number" ? customMinHeight : isLabelEmbededVariant ? 30 : isMobile ? 50 : 46;
    }, [customMinHeight, isLabelEmbededVariant, isMobile]);
    const maxHeight = useMemo(() => {
        return typeof customMaxHeight === "number" ? customMaxHeight : undefined;
    }, [customMaxHeight]);
    const inputDimensionsRef = useRef<IDict>({ width: 0, height: minHeight });
    const { height } = inputDimensionsRef.current;
    const affixContent = useMemo(() => {
        if (affix === false || (isDateOrTime && !affix)) return null;
        let affContent = typeof affix == "function" ? affix(callOptions) : isValidElement(affix, true) ? affix : null;
        if (!affContent && !isPasswordField) {
            if (!focusedValue || canValueBeDecimal) return null;
            affContent = isNonNullString(focusedValue) ? focusedValue.length.formatNumber() : "";
            if (isNumber(maxLength) && affContent) {
                affContent += ((isNumber(length) ? "-" : "/") + maxLength.formatNumber());
            }
        }
        if (!affContent) return null;
        if (React.isValidElement(affContent)) {
            return affContent;
        }
        return <Label children={affContent} style={[styles.affix, { color: textColor }]} />;
    }, [focusedValue, isDateOrTime, canValueBeDecimal, error, multiline, textColor, affix, isPasswordField]);

    const inputHeight = useMemo(() => {
        return !inputValue ? minHeight : height;
    }, [height, inputValue]);
    const calcHeight = (actualHeight: number, limit?: number) => {
        return typeof limit === "number" && limit > 10
            ? Math.max(Math.min(limit, actualHeight), minHeight)
            : Math.max(minHeight, actualHeight);
    }
    const canRenderLabel = withLabel !== false;
    const { left, right, label } = getLabelOrLeftOrRightProps<ITextInputCallbackOptions>({ left: customLeft, right: customRight, label: canRenderLabel ? customLabel : null }, callOptions);
    const disabledOrEditStyle = [!editable ? Theme.styles.readOnly : null, props.disabled ? Theme.styles.disabled : null, typeof opacity === "number" ? { opacity } : null];
    const secureIconProps: Partial<IFontIconProps> = React.useMemo(() => {
        if (!isPasswordField) return {} as IFontIconProps;
        if (typeof secureTextEntryGetToggleIconProps == "function") {
            return Object.assign({}, secureTextEntryGetToggleIconProps({ isPasswordVisible: isSecure }));
        }
        return {} as IFontIconProps;
    }, [isPasswordField, secureTextEntryGetToggleIconProps, isSecure]);
    const secureIcon = isPasswordField && editable ? <FontIcon size={iconSize}  {...secureIconProps} name={secureIconProps?.name || (isSecure ? "eye" : "eye-off")} onPress={() => { setIsSecure(!isSecure); focus(); }} color={textColor} /> : null;
    const borderColor = isFocused || error ? textColor : theme.colors.outline;
    const { containerStyle, contentContainerStyle, inputStyle, labelStyle } = getContainerAndContentStyle({ variant, withBackground, compact, canRenderLabel, isFocused, isLabelEmbededVariant, theme, textColor, borderColor, isDefaultVariant })
    const labelSuffix = suffixLabelWithMaskPlaceholder !== false && hasInputMask && !isLabelEmbededVariant && inputMaskPlaceholder ? <Label color={textColor}>{" "}[{inputMaskPlaceholder}]</Label> : null;
    const calendarIProps = Object.assign({}, iconProps);
    const calendarRef = useRef<CalendarModalContext>(null);
    const calendarFlag = canRenderCalendar && editable ? <>
        <FontIcon
            color={textColor}
            testID={`${testID}-calendar-icon`}
            {...calendarIProps}
            size={calendarIProps?.size || iconSize}
            name={calendarIProps?.name || "calendar"}
            onPress={(event) => {
                calendarRef.current?.open(() => { });
            }}
        />
        <Calendar.ModalDayView
            testID={`${testID}-calendar-modal`}
            {...calendarProps}
            ref={calendarRef}
            defaultValue={inputState.dateValue}
            header={isValidElement(calendarProps.header) ? calendarProps.header : <Label color={textColor}>{label}</Label>}
            onChange={({ value: date }) => {
                const dateValue = inputState.dateValue;
                const hasValidDate = DateHelper.isDateObj(dateValue);
                const newDate = hasValidDate ? dateValue : new Date(date);
                if (hasValidDate) {
                    newDate.setDate(date.getDate());
                    newDate.setMonth(date.getMonth());
                    newDate.setFullYear(date.getFullYear());
                } else {
                    newDate.setMinutes(0);
                    newDate.setSeconds(0);
                    newDate.setMilliseconds(0);
                }
                const valCase = toCase(DateHelper.formatDate(newDate, dateFormat), inputState.phoneCountryCode);
                if (!areCasesEquals(valCase, inputState)) {
                    const nState = { ...inputState, ...valCase };
                    setInputState(nState);
                    if (typeof onChange === "function") {
                        onChange({ ...nState, dateValue: newDate, value: canValueBeDecimal ? InputFormatter.parseDecimal(nState.value) : nState.value });
                    }
                }
            }}
        />
    </> : null;
    const SelectCountryComponent = useMemo(() => {
        return SelectCountryRef.Component;
    }, [SelectCountryRef.Component]);
    const phoneDialCodeLabel = useMemo(() => {
        if (!isPhone || !isNonNullString(phoneDialCode)) return null;
        const dialCode = "+" + phoneDialCode.trim().ltrim("+");
        if (String(inputValue).startsWith(dialCode)) {
            return null;
        }
        return <Label color={textColor}>{dialCode.trim() + " "}</Label>
    }, [phoneDialCode, isPhone, textColor, inputValue]);
    const phoneCountryFlag = isPhone && SelectCountryComponent ? <>
        <SelectCountryComponent
            multiple={false}
            textFontSize={fontSize}
            disabled={!editable}
            defaultValue={inputState.phoneCountryCode}
            onChange={!editable ? undefined : ({ value }) => {
                if (isNonNullString(value) && value !== inputState.phoneCountryCode && String(value).toLowerCase() !== "undefined") {
                    setInputState({
                        ...inputState,
                        ...toCase("", Array.isArray(value) ? value[0] : value)
                    });
                }
            }}
            countryFlagProps={{ textColor, textFontSize: fontSize }}
        />
        {phoneDialCodeLabel}
    </> : null;
    return {
        autoComplete: "off",
        placeholderTextColor: isFocused || error ? textColor : theme.colors.placeholder,
        underlineColorAndroid: "transparent",
        ...props,
        defaultValue: undefined,
        inputRef,
        focus,
        onContentSizeChange: (event) => {
            if (typeof onContentSizeChange == "function") {
                onContentSizeChange(event);
            }
            const { contentSize } = event.nativeEvent;
            const width = contentSize.width;
            const height = calcHeight(contentSize.height, maxHeight);
            inputDimensionsRef.current = { width, height };
        },
        variant,
        canRenderLabel,
        error,
        isFocused,
        containerProps: Object.assign({}, { testID: `${testID}-container` }, containerProps, { style: [styles.container, containerStyle, disabledOrEditStyle, containerProps.style] }),
        contentContainerProps: Object.assign({}, { testID: `${testID}-content-container` }, contentContainerProps, {
            style: [styles.contentContainer, contentContainerStyle,
            contentContainerProps.style]
        }),
        label: (label ? <Label color={textColor} testID={`${testID}-label`} {...Object.assign({}, labelProps)} style={[labelStyle, labelProps?.style]}>{label}{labelSuffix}{isLabelEmbededVariant ? ` : ` : ""}</Label> : null),
        withLabel,
        placeholder: hasInputMask ? inputMaskPlaceholder : (isEmpty(props.placeholder) ? "" : defaultStr(props.placeholder)),
        testID: testID,
        readOnly: editable === false,
        editable,
        secureTextEntry: isPasswordField ? isSecure : secureTextEntry,
        style: [
            Object.assign({}, Platform.isWeb() ? { outline: "none" } : {}) as IStyle,
            styles.input,
            minHeight > 0 && { minHeight },
            inputStyle,
            compact && styles.compact,
            multiline && { height: inputHeight },
            multiline && styles.multilineInput,
            style,
            { fontSize },
            disabledOrEditStyle,
            isDropdownAnchor && editable && styles.dropdownAnchorInput,
        ],
        value: String(inputValue),
        inputMode: inputMode as any,
        autoCorrect: !maskArray?.length && props?.autoCorrect,
        spellCheck: !maskArray?.length && props?.spellCheck,
        importantForAutofill: maskArray?.length ? "no" : props?.importantForAutofill,
        onChange: (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
            const { text: textString } = event.nativeEvent;
            const { phoneCountryCode } = inputState;
            const valCase2 = toCase(textString, phoneCountryCode);
            const value = inputState.placeholder ? valCase2.masked : valCase2.value;
            if (textString !== inputState.value && inputState.value !== value && !areCasesEquals(valCase2, inputState)) {
                //Fix repeated input, from native text input in animated mobile input
                if (isNative && Array.isArray(valCase2.nonRegexReplacedChars) && valCase2.nonRegexReplacedChars?.length) {
                    return;
                }
                const options = { ...inputState, isFocused, type, dateFormat, phoneCountryCode, ...valCase2, value, text: textString, event };
                const isValid = (valCase2.isValid !== false) && (isPhone ? isPhoneValid(valCase2.value, phoneCountryCode) : true);
                setInputState(options);
                if (typeof onChange == "function" && isValid) {
                    clearTimeout(debounceTimeoutRef.current);
                    debounceTimeoutRef.current = setTimeout(() => {
                        onChange(options);
                    }, isNumber(debounceTimeout) && debounceTimeout > 0 ? debounceTimeout : 0);
                }
            }
        },
        onChangeText: (textString: string) => {
            if (typeof props.onChangeText === "function") {
                props.onChangeText(textString);
            }
        },
        onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
            if (!isFocused) {
                setIsFocused(true);
            }
            if (typeof props.onKeyPress == "function") {
                props.onKeyPress(event);
            }
        },
        onBlur: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setIsFocused(false);
            if (typeof props.onBlur == "function") {
                props.onBlur(event);
            }
        },
        onFocus: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setIsFocused(true);
            if (typeof props.onFocus == "function") {
                props.onFocus(event);
            }
        },
        left: phoneCountryFlag ? <>
            {left}
            {phoneCountryFlag}
        </> : left,
        right: (right || canToggleSecure || affixContent || calendarFlag) ? <View testID={`${testID}-right-container`} {...rightContainerProps} style={[styles.leftOrRightContainer, styles.rightContainer, disabledOrEditStyle, rightContainerProps.style]}>
            {affixContent}
            {right}
            {editable || disabled !== false && isPasswordField ? secureIcon : null}
            {calendarFlag}
        </View> : null
    }
}

const areCasesEquals = (case1: Partial<IInputFormatterMaskResult>, case2: Partial<IInputFormatterMaskResult>) => {
    return String((case1 as any).value) === String((case2 as any).value)
        && case1.masked === case2.masked && case1.unmasked === case2.unmasked && case1.obfuscated === case2.obfuscated;
}



TextInput.displayName = "TextInput";

export default TextInput;


const styles = StyleSheet.create({
    affix: {
        paddingHorizontal: 0,
        marginHorizontal: 5,
        fontSize: 15
    },
    dropdownAnchorInput: {
        cursor: "pointer",
    },
    dropdownAnchorContainer: {
        flexGrow: 1,
        paddingHorizontal: 5,
    },
    input: {
        borderColor: 'transparent', // No border
        borderWidth: 0, // Remove border
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        borderTopColor: "transparent",
        borderTopWidth: 0,
        borderLeftColor: "transparent",
        borderLeftWidth: 0,
        borderRightColor: "transparent",
        borderRightWidth: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        flexGrow: 1,
        overflow: 'hidden',
        fontSize: 16,
    },
    compact: {
        padding: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    multilineInput: {
        paddingVertical: 5,
    },
    borderWidth1: {
        borderWidth: 1,
    },
    focusedOutlineBorder: {
        borderWidth: 2,
    },
    rightContainer: {
        alignSelf: "center",
    },
    container: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        position: 'relative',
        width: "100%",
    },
    contentContainer: {
        justifyContent: "space-between",
        alignSelf: "flex-start",
        flexWrap: "nowrap",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        width: "100%",
        paddingHorizontal: 5,
    },
    leftContentContainer: {
        flexGrow: 0,
        alignSelf: "center",
    },
    wrapper: {
        width: '100%',
        flexDirection: "row",
        position: 'relative',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    inputContainer: {
        flex: 1,
        flexGrow: 1,
    },
    rightContentContainer: {
        flexGrow: 0,
        alignSelf: 'center',
        justifyContent: 'flex-end'
    },
    leftOrRightContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
    },
    leftContainerWrappedWithTouchable: {
        paddingHorizontal: 0,
    },
    notEmbededLabelStyle: {
        fontWeight: "500",
        paddingBottom: 5,
    },
    flatVariantContentContainer: {
        borderWidth: 0,
        borderBottomWidth: 1,
    },
})

const isDecimalType = (type: ITextInputType | string): boolean => {
    return ['decimal', 'numeric', 'number'].includes(String(type).toLowerCase());
}
