"use client";
import { cn, isValidElement, useHydrationStatus, useMergeRefs } from "@utils";
import { Text } from "@html/Text";
import { NativeSyntheticEvent, TextInput as RNTextInput, StyleSheet, TextInputChangeEventData, TextInputFocusEventData, TextInputKeyPressEventData } from 'react-native';
import { useEffect, useMemo, useRef, useState } from "react";
import InputFormatter from "@resk/core/inputFormatter";
import { IInputFormatterMaskResult, IInputFormatterOptions, IInputFormatterResult } from "@resk/core/inputFormatter";
import { ICountryCode } from "@resk/core/countries";
import { isNumber, isNonNullString, isStringNumber, isEmpty, defaultStr, defaultBool, DateHelper } from "@resk/core/utils";
import FontIcon from "@components/Icon/Font";
import { ITextInputCallOptions, ITextInputProps, ITextInputRenderOptions, ITextInputType } from "./types";
import p from "@platform";
import { TouchableOpacity } from "react-native";
import { KeyboardAvoidingView } from "@components/KeyboardAvoidingView";
import textInputVariant from "@variants/textInput";
import allVariants from "@variants/all";
import { extractTextClasses } from "@utils/textClasses";
import { Div } from "@html/Div";
import { classes } from "@variants/classes";


const isNative = p.isNative();

/**
 * Universal, highly-configurable TextInput component for React Native and web.
 *
 * This component supports advanced features such as input masking, phone and date formatting, validation, affixes, password visibility toggling, keyboard avoidance, and custom rendering.
 * It is designed for accessibility, SSR/CSR hydration, and seamless integration with Tailwind CSS utility classes.
 *
 * @template ValueType - The type of the value associated with the text input.
 * @param props - {@link ITextInputProps} All input props and configuration options.
 * - `type`: Input type (e.g., "text", "password", "number", "tel", "date", "datetime", "email", etc.).
 * - `mask`, `maskOptions`: Masking pattern and options for formatted inputs (phone, date, custom).
 * - `secureTextEntry`: If `true`, hides input text (for passwords).
 * - `withKeyboardAvoidingView`: If `true`, wraps input in a keyboard avoiding view component.
 * - `affix`, `left`, `right`: Custom affix or icon components/functions for left/right input adornments.
 * - `label`, `labelEmbeded`: Label text or element, optionally embedded inside the input row.
 * - `onChange`, `onContentSizeChange`, `onFocus`, `onBlur`, `onKeyPress`: Event handlers for input events.
 * - `variant`, `className`, `containerClassName`, etc.: Tailwind utility class overrides for styling.
 * - `debounceTimeout`: Debounce delay for `onChange` callback.
 * - `maxLength`, `length`: Character count/limit display and enforcement.
 * - `readOnly`, `disabled`, `editable`: Input state controls.
 * - `phoneCountryCode`, `displayPhoneDialCode`: Phone formatting and dial code display.
 * - `placeholder`, `placeholderClassName`: Placeholder text and styling.
 * - `minHeight`, `maxHeight`: Minimum and maximum input height (for multiline).
 * - `renderTextInput`: Custom render function for the underlying input.
 * - ...and many more advanced options.
 *
 * @returns The rendered input component, with all configured features and styling.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextInput label="Name" placeholder="Enter your name" />
 *
 * // Password input with visibility toggle
 * <TextInput type="password" label="Password" />
 *
 * // Phone input with mask and country code
 * <TextInput type="tel" mask="+9 (999) 999-9999" phoneCountryCode="US" />
 *
 * // Date input with custom format and calendar icon
 * <TextInput type="date" dateFormat="YYYY-MM-DD" right={<CalendarIcon />} />
 *
 * // Multiline input with character counter
 * <TextInput multiline maxLength={200} affix={({ value }) => `${value.length}/200`} />
 *
 * // Custom rendering
 * <TextInput renderTextInput={(inputProps, callOptions) => (
 *   <CustomInput {...inputProps} icon={callOptions.isPhone ? <PhoneIcon /> : null} />
 * )} />
 * ```
 *
 * @remarks
 * - Supports SSR/CSR hydration and accessibility best practices.
 * - Input masking and formatting are handled via {@link InputFormatter}.
 * - All event handlers receive rich context and validation info.
 * - Easily style every part of the component with Tailwind utility classes.
 * - Keyboard avoidance and focus management are built-in for mobile.
 * - Designed for extensibility and composability in design systems.
 *
 * @see {@link ITextInputProps}
 * @see {@link IInputFormatterResult}
 * @see {@link InputFormatter}
 * @see {@link useHydrationStatus}
 * @see {@link useMergeRefs}
 * @see {@link KeyboardAvoidingView}
 * @see {@link textInputVariant}
 * @see {@link allVariants}
 * @see {@link extractTextClasses}
 * @see {@link ITextInputCallOptions}
 * @see {@link ITextInputRenderOptions}
 * @see {@link ITextInputType}
 * @see {@link ICountryCode}
 * @see {@link areCasesEquals}
 * @see {@link isDecimalType}
 *
 * @public
 */
export default function TextInput<ValueType = any>({
    readOnly,
    renderTextInput, testID, error: customError, phoneCountryCode: customPhoneCountryCode, handleMaskValidationErrors,
    defaultValue, sanitizeValue, inputMode: cInputMode, dateFormat: customDateFormat, emptyValue: cIsEmptyValue,
    mask: customMask, maskOptions: customMaskOptions, secureTextEntry, withKeyboardAvoidingView, type, ref,
    minHeight: customMinHeight,
    maxHeight: customMaxHeight,
    affix,
    maxLength,
    length,
    labelClassName,
    className,
    containerClassName,
    leftContainerClassName,
    rightContainerClassName,
    contentContainerClassName,
    inputContainerClassName,
    variant,
    onContentSizeChange,
    onChange,
    debounceTimeout,
    withLabel,
    suffixLabelWithMaskPlaceholder,
    iconClassName,
    left: customLeft,
    right: customRight,
    label,
    onPress,
    onPressIn,
    onPressOut,
    labelEmbeded,
    passwordHiddenIconName,
    passwordVisibleIconName,
    displayPhoneDialCode = true,
    placeholderClassName,
    isDropdownAnchor,
    ...props
}: ITextInputProps<ValueType>) {
    const isHydrated = useHydrationStatus();
    const isLabelEmbeded = !!labelEmbeded;
    const [isFocused, setIsFocused] = useState(false);
    type = defaultStr(type, "text") as ITextInputType;
    const { isPhone, isDateOrTime, typeString } = useMemo(() => {
        const t = String(type).toLowerCase();
        return {
            isPhone: t == "tel",
            typeString: t,
            isDateOrTime: t == "datetime" || t == "date" || t == "time"
        }
    }, [type]);
    const cursorDefault = cn(classes.cursorDefault, !isHydrated && "cursor-not-allowed", " select-none");
    const innerRef = useRef<RNTextInput | null>(null);
    const inputRef = useMergeRefs(ref, innerRef);
    testID = defaultStr(testID, "resk-text-input");
    const isPasswordField = useMemo<boolean>(() => String(type).toLowerCase() === "password", [type]);
    const [isSecure, setIsSecure] = useState(typeof secureTextEntry === "boolean" ? secureTextEntry : true);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(null);
    useEffect(() => {
        return () => {
            clearTimeout(debounceTimeoutRef.current as any);
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
    const { mask, maskOptions, dateFormat, canRenderCalendar } = useMemo(() => {
        const maskOptions = Object.assign({}, { placeholder: '_' }, customMaskOptions);
        let mask = InputFormatter.isValidMask(customMask) ? customMask : undefined;
        let validate = (value: string) => true;
        const isDate = typeString == "date", isTime = typeString == "time";
        const dateFormat = !isDateOrTime ? defaultStr(customDateFormat) : defaultStr(customDateFormat, isDate ? DateHelper.DEFAULT_DATE_FORMAT : isTime ? DateHelper.DEFAULT_TIME_FORMAT : DateHelper.DEFAULT_DATE_TIME_FORMAT);
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
            canRenderCalendar: ["datetime", "date"].includes(typeString),
        }
    }, [customMask, customMaskOptions, typeString, customDateFormat, isDateOrTime]);
    const formatValue = (options?: IInputFormatterOptions): IInputFormatterResult => {
        let { value, ...rest } = Object.assign({}, options);
        const valString = String(value);
        const valEndsWithDecimal = InputFormatter.endsWithDecimalSeparator(valString);
        if (canValueBeDecimal && isFocused && (valString.length == 1 && valEndsWithDecimal)) {
            value = "0" + value;
        }
        if (value === emptyValue && isFocused) {
            value = "";
        }
        if (value == undefined) value = '';
        if (isStringNumber(String(value))) value += "";
        if (canValueBeDecimal && (!valEndsWithDecimal && (String(value).length <= 1 || !String(value).endsWith("0")))) {
            value = InputFormatter.parseDecimal(value);
        }
        if (isPhone && value) {
            value = InputFormatter.formatPhoneNumber(value, rest.phoneCountryCode);
        }
        const formatOptions = { ...props, ...rest, dateFormat, type, value };
        if (typeof sanitizeValue === "function") {
            value = sanitizeValue(formatOptions);
        }
        return {
            ...(mask ? InputFormatter.formatWithMask({ ...maskOptions, maskAutoComplete: true, value, mask, type }) : {}),
            ...InputFormatter.formatValue({ ...formatOptions, value }),
            value,
        }
    };
    const valCase = useMemo<IInputFormatterResult>(() => {
        return formatValue({ ...props, value: defaultValue, phoneCountryCode: customPhoneCountryCode });
    }, [defaultValue, mask, maskOptions, customPhoneCountryCode])
    const [inputState, setInputState] = useState<IInputFormatterResult>(valCase);
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
    const computedVariant = textInputVariant(variant);
    const disabled = props.disabled || readOnly || !isHydrated;
    const editable = !disabled && props.editable !== false && readOnly !== false || false;
    const canWrapWithTouchable = isDropdownAnchor && editable && !readOnly;

    const phoneDialCodeText = useMemo(() => {
        if (!isPhone || !isNonNullString(phoneDialCode)) return "";
        const dialCode = "+" + phoneDialCode.trim().ltrim("+");
        if (String(inputValue).startsWith(dialCode)) {
            return "";
        }
        return dialCode.trim() + '\u00A0';
    }, [phoneDialCode, isPhone, inputValue]);
    const handleFocus = () => {
        setIsFocused(true);
    };
    const handleBlur = () => {
        if (isFocused) {
            setIsFocused(false);
        }
    };
    const focus = () => {
        if (!editable) return;
        if (innerRef?.current && typeof innerRef.current.focus === "function") {
            innerRef.current.focus();
        }
    };

    useEffect(() => {
        if (editable && props.autoFocus && isHydrated && !isFocused) {
            focus();
        }
    }, [props.autoFocus, editable, isHydrated, isFocused]);

    const canToggleSecure = isPasswordField;
    const multiline = !!props.multiline;
    const isErrorVariant = !!error;
    const isFocusedVariant = !isErrorVariant && isFocused;
    const focusedContentContainerClx = isFocusedVariant && computedVariant.focusedContentContainer();
    const errorContentContainerClx = isErrorVariant && computedVariant.errorContentContainer();
    const focusedInputClx = isFocusedVariant && computedVariant.focusedInput();
    const focusedLabelClx = isFocusedVariant && computedVariant.focusedLabel();
    const errorInputClx = isErrorVariant && computedVariant.errorInput();
    const errorLabelClx = isErrorVariant && computedVariant.errorLabel();
    const focusedIconClx = isFocusedVariant && computedVariant.focusedIcon();
    const errorIconClx = isErrorVariant && computedVariant.errorIcon();
    const focusedLabelEmbededClx = isFocusedVariant && isLabelEmbeded && computedVariant.focusedLabelEmbeded();
    const errorLabelEmbededClx = isErrorVariant && isLabelEmbeded && computedVariant.errorLabelEmbeded();

    const labelClx = cn("flex flex-row self-center justify-start items-center input-label", isLabelEmbeded ? ["input-label-embeded mx-[5px]", computedVariant.labelEmbeded()] : computedVariant.label(), !isLabelEmbeded ? [focusedLabelClx, errorLabelClx] : [focusedLabelEmbededClx, errorLabelEmbededClx], labelClassName);
    const inputClx = cn(multiline && "py-[5px]", "outline-none grow border-transparent border-b-transparent border-b-0 border-t-0 border-t-transparent border-l-0 border-l-transparent border-r-0 border-r-transparent", canWrapWithTouchable && "cursor-pointer", computedVariant.input(), focusedInputClx, errorInputClx, className);
    const leftContainerClx = cn(computedVariant.leftContainer(), leftContainerClassName);
    const rightContainerClx = cn(computedVariant.rightContainer(), rightContainerClassName);
    const contentContainerClx = cn(computedVariant.contentContainer(), focusedContentContainerClx, errorContentContainerClx, contentContainerClassName);
    const iconClx = cn(computedVariant.icon(), focusedIconClx, errorIconClx, iconClassName);
    const containerClx = cn(computedVariant.container(), containerClassName);
    const inputTextClx = extractTextClasses(inputClx);
    const labelTextClx = extractTextClasses(labelClx);
    const iconTextClx = extractTextClasses(iconClx);
    const phoneDialCodeClx = cn("input-phone-dial-code-label", inputTextClx);
    const phoneDialCodeLabel = displayPhoneDialCode && phoneDialCodeText ? <Text className={phoneDialCodeClx}>{phoneDialCodeText}</Text> : null;
    const callOptions: ITextInputCallOptions = {
        formatValue, label, renderedWithLabel: withLabel !== false, ...inputState, inputState, updateInputState: (newInputState) => (
            setInputState((prev) => ({ ...prev, ...newInputState }))
        ), isPhone, phoneDialCodeText, labelClassName: labelClx, labelTextClassName: labelTextClx, iconClassName: iconClx, iconTextClassName: iconTextClx, inputClassName: inputClx, inputTextClassName: inputTextClx, focus, labelEmbeded: isLabelEmbeded, error: !!error, isFocused, computedVariant, editable, disabled: !!disabled
    };
    const minHeight = useMemo(() => {
        return typeof customMinHeight === "number" ? customMinHeight : isLabelEmbeded ? 30 : 46;
    }, [customMinHeight, isLabelEmbeded]);
    const maxHeight = useMemo(() => {
        return typeof customMaxHeight === "number" ? customMaxHeight : undefined;
    }, [customMaxHeight]);
    const inputDimensionsRef = useRef({ width: 0, height: minHeight });
    const { height } = inputDimensionsRef.current;
    const affixContent = useMemo(() => {
        if (!affix && !isNumber(maxLength) && !isNumber(length)) return null;
        let affContent = typeof affix == "function" ? affix(callOptions) : isValidElement(affix, true) ? affix : null;
        if (!affContent && !isPasswordField) {
            if (!focusedValue || canValueBeDecimal) return null;
            affContent = isNonNullString(focusedValue) ? focusedValue.length.formatNumber() : "";
            if (isNumber(maxLength) && affContent) {
                affContent += ((isNumber(length) ? "-" : "/") + maxLength.formatNumber());
            }
        }
        if (!affContent) return null;
        if (isValidElement(affContent)) {
            return affContent;
        }
        return <Text children={affContent} className={cn("mx-[5px]", inputTextClx)} />;
    }, [focusedValue, isDateOrTime, canValueBeDecimal, error, multiline, inputTextClx, affix, isPasswordField, maxLength, length]);

    const inputHeight = useMemo(() => {
        return !inputValue ? minHeight : height;
    }, [height, inputValue]);
    const calcHeight = (actualHeight: number, limit?: number) => {
        return typeof limit === "number" && limit > 10
            ? Math.max(Math.min(limit, actualHeight), minHeight)
            : Math.max(minHeight, actualHeight);
    }
    const canRenderLabel = withLabel !== false;
    const left = typeof customLeft === "function" ? customLeft(callOptions) : customLeft;
    const right = typeof customRight === "function" ? customRight(callOptions) : customRight;
    const disabledClx = cn(allVariants({ disabled }));
    const readOnlyClx = cn(allVariants({ readOnly }));
    const secureIcon = isPasswordField && editable ? <FontIcon
        name={(isSecure ? defaultStr(passwordHiddenIconName, "eye") : defaultStr(passwordVisibleIconName, "eye-off")) as never}
        onPress={() => { setIsSecure(!isSecure); focus(); }} className={iconClx}
    /> : null;
    const labelSuffix = (suffixLabelWithMaskPlaceholder !== false && hasInputMask && !isLabelEmbeded && inputMaskPlaceholder ? ` [${inputMaskPlaceholder}]` : "") + (isLabelEmbeded ? ` : ` : "");
    label = typeof label === "string" ? `${label}${labelSuffix}` : isValidElement(label) ? <>{label}<Text className={labelTextClx}>{labelSuffix}</Text></> : null;
    const labelContent = canRenderLabel && label ? <Text testID={testID + "-label"} onPress={editable ? focus : undefined} className={labelClx} children={label} /> : null;
    const Wrapper = canWrapWithTouchable ? TouchableOpacity : Div;
    const pressableProps = { onPress, onPressIn, onPressOut, testID: `${testID}-dropdown-anchor-container`, className: cn("grouw cursor-pointer px-[5px]") };
    const wrapperProps = canWrapWithTouchable ? Object.assign({}, pressableProps) : {};
    const inputPlaceholder = hasInputMask ? inputMaskPlaceholder : (isEmpty(props.placeholder) ? "" : defaultStr(props.placeholder));
    const inputStyle = StyleSheet.flatten([
        minHeight > 0 && { minHeight },
        multiline && { height: inputHeight },
        props.style,
    ]);
    const inputProps: ITextInputRenderOptions = {
        autoComplete: "off",
        placeholderClassName: cn("text-placeholder dark:text-dark-placeholder", computedVariant.placeholder(), placeholderClassName),
        ...(!canWrapWithTouchable && editable ? pressableProps : {}),
        ...props,
        className: inputClx,
        underlineColorAndroid: "transparent",
        ...props,
        defaultValue: undefined,
        ref: inputRef,
        onContentSizeChange: (event: any) => {
            if (typeof onContentSizeChange == "function") {
                onContentSizeChange(event);
            }
            const { contentSize } = event.nativeEvent;
            const width = contentSize.width;
            const height = calcHeight(contentSize.height, maxHeight);
            inputDimensionsRef.current = { width, height };
        },
        placeholder: inputPlaceholder,
        testID: testID,
        readOnly: editable === false || canWrapWithTouchable,
        editable: editable && !canWrapWithTouchable,
        secureTextEntry: isPasswordField ? isSecure : secureTextEntry,
        style: inputStyle,
        value: String(inputValue),
        inputMode: inputMode as any,
        autoCorrect: !maskArray?.length && props?.autoCorrect,
        spellCheck: !maskArray?.length && props?.spellCheck,
        importantForAutofill: maskArray?.length ? "no" : props?.importantForAutofill,
        onChange: (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
            const { text: textString } = event.nativeEvent;
            const { phoneCountryCode } = inputState;
            const valCase2 = formatValue({ value: textString, phoneCountryCode });
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
                    clearTimeout(debounceTimeoutRef.current as any);
                    (debounceTimeoutRef as any).current = setTimeout(() => {
                        onChange(options as any);
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
                handleFocus();
            }
            if (typeof props.onKeyPress == "function") {
                props.onKeyPress(event);
            }
        },
        onBlur: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            handleBlur();
            if (typeof props.onBlur == "function") {
                props.onBlur(event);
            }
        },
        onFocus: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            handleFocus();
            if (typeof props.onFocus == "function") {
                props.onFocus(event);
            }
        },
    };
    const inputElement = typeof renderTextInput == "function" ? renderTextInput(inputProps, callOptions) : <RNTextInput {...inputProps as any} ref={inputRef} />;
    const Avoiding = useMemo(() => {
        return withKeyboardAvoidingView ? KeyboardAvoidingView : Div;
    }, [withKeyboardAvoidingView]);
    const leftContainerWrappedWithTouchableClassName = cn(canWrapWithTouchable && "px-0");
    const leftOrRightClassName = cn("flex flex-row items-center self-center justify-start", disabledClx);
    const leftContent = left,
        rightContent = (right || canToggleSecure || affixContent) ? <>
            {affixContent}
            {right}
            {secureIcon}
        </> : null
    return <Avoiding className={cn(containerClx, disabledClx, readOnlyClx, cursorDefault, "input-container input-type-" + type + "-container")} testID={testID + "-container"}>
        <Div className={cn(cursorDefault, "w-full relative input-wrapper")} testID={testID + "-wrapper"}>
            {isLabelEmbeded ? null : labelContent}
            <Wrapper {...wrapperProps} testID={testID + "-content-container"} className={cn(cursorDefault, "input-content-container w-full flex flex-row justify-between self-start items-center", contentContainerClx)}>
                <Div testID={testID + "-left-content-container"} className={cn(leftOrRightClassName, cursorDefault, "grow", leftContainerClx, leftContainerWrappedWithTouchableClassName)}>
                    {leftContent}
                    {isLabelEmbeded ? labelContent : null}
                    {phoneDialCodeLabel ? <Text className={phoneDialCodeClx} onPress={editable ? focus : undefined}>{phoneDialCodeText}</Text> : null}
                    {isHydrated ? inputElement : <Text className={cn(inputClx, "animate-pulse", cursorDefault)} style={inputStyle}  >{String(inputValue)}</Text>}
                </Div>
                {rightContent ? (<Div className="right-content-wrapper self-center grow-0">
                    <Div testID={testID + "-right-content-container"} className={cn(leftOrRightClassName, cursorDefault, "input-right-content-container self-center", rightContainerClx)}>
                        {rightContent}
                    </Div>
                </Div>) : null}
            </Wrapper>
        </Div>
    </Avoiding>
}

const areCasesEquals = (case1: Partial<IInputFormatterMaskResult>, case2: Partial<IInputFormatterMaskResult>) => {
    return String((case1 as any).value) === String((case2 as any).value)
        && case1.masked === case2.masked && case1.unmasked === case2.unmasked && case1.obfuscated === case2.obfuscated;
}



TextInput.displayName = "TextInput";

const isDecimalType = (type: ITextInputType | string): boolean => {
    return ['decimal', 'numeric', 'number'].includes(String(type).toLowerCase());
}