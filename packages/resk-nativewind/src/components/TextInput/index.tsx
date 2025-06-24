"use client";
import { cn, isValidElement, useHydrationStatus, useMergeRefs } from "@utils";
import { Text } from "@html/Text";
import { NativeSyntheticEvent, TextInput as RNTextInput, StyleSheet, TextInputChangeEventData, TextInputFocusEventData, TextInputKeyPressEventData } from 'react-native';
import { useEffect, useMemo, useRef, useState } from "react";
import { InputFormatter, isNumber, ICountryCode, IDict, isNonNullString, isStringNumber, isEmpty, defaultStr, IInputFormatterMaskResult, defaultBool, DateHelper, IInputFormatterResult } from "@resk/core";
import FontIcon from "@components/Icon/Font";
import { ITextInputCallbackOptions, ITextInputProps, ITextInputRenderOptions, ITextInputType } from "./types";
import p from "@platform";
import { TouchableOpacity } from "react-native";
import { KeyboardAvoidingView } from "@components/KeyboardAvoidingView";
import textInputVariant, { IVariantPropsTextInput } from "@variants/textInput";
import allVariants from "@variants/all";
import { extractTextClasses } from "@utils/textClasses";
import { Div } from "@html/Div";

const isNative = p.isNative();


export function TextInput({
    readOnly,
    render, testID, error: customError, phoneCountryCode: customPhoneCountryCode, handleMaskValidationErrors,
    defaultValue, toCase: cToCase, inputMode: cInputMode, dateFormat: customDateFormat, emptyValue: cIsEmptyValue,
    mask: customMask, maskOptions: customMaskOptions, secureTextEntry, withKeyboardAvoidingView, type, ref,
    minHeight: customMinHeight,
    maxHeight: customMaxHeight,
    affix,
    maxLength,
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
    ...props
}: ITextInputProps) {
    const isHydrated = useHydrationStatus();
    const isLabelEmbeded = !!labelEmbeded;
    const [isFocused, setIsFocused] = useState(false);
    const { isPhone, isDateOrTime, typeString } = useMemo(() => {
        const t = String(type).toLowerCase();
        return {
            isPhone: t == "tel",
            typeString: t,
            isDateOrTime: t == "datetime" || t == "date" || t == "time"
        }
    }, [type]);
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
    const [inputState, setInputState] = useState<IInputFormatterResult & { phoneCountryCode?: ICountryCode }>(valCase);
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
    const computedVariant = textInputVariant(Object.assign({}, variant, { error, focused: !error && isFocused } as IVariantPropsTextInput));
    const disabled = props.disabled || readOnly || !isHydrated;
    const editable = !disabled && props.editable !== false && readOnly !== false || false;
    const focus = () => {
        if (!editable) return;
        if (innerRef?.current && typeof innerRef.current.focus === "function") {
            innerRef.current.focus();
        }
    };

    const canToggleSecure = isPasswordField;
    const multiline = !!props.multiline;
    const labelClx = cn(isLabelEmbeded ? ["mx-[5px]", computedVariant.labelEmbeded()] : computedVariant.label(), labelClassName);
    const inputClx = cn(multiline && "py-[5px]", "outline-none flex-1 grow overflow-hidden text-base border-transparent border-b-transparent border-b-0 border-t-0 border-t-transparent border-l-0 border-l-transparent border-r-0 border-r-transparent", computedVariant.input(), className);
    const inputTextClx = extractTextClasses(inputClx);
    const leftContainerClx = cn(computedVariant.leftContainer(), leftContainerClassName);
    const rightContainerClx = cn(computedVariant.rightContainer(), rightContainerClassName);
    const contentContainerClx = cn(computedVariant.contentContainer(), contentContainerClassName);
    const iconClx = cn(computedVariant.icon(), iconClassName);
    const containerClx = cn(computedVariant.container(), containerClassName);

    const phoneDialCodeLabel = useMemo(() => {
        if (!isPhone || !isNonNullString(phoneDialCode)) return "";
        const dialCode = "+" + phoneDialCode.trim().ltrim("+");
        if (String(inputValue).startsWith(dialCode)) {
            return "";
        }
        return dialCode.trim() + " ";
    }, [phoneDialCode, isPhone, inputValue, inputTextClx]);
    const callOptions: ITextInputCallbackOptions = { ...inputState, isPhone, phoneDialCodeLabel, labelClassName: labelClx, iconClassName: iconClx, inputClassName: inputClx, focus, labelEmbeded: isLabelEmbeded, error: !!error, isFocused, computedVariant, editable, disabled: !!disabled };
    const minHeight = useMemo(() => {
        return typeof customMinHeight === "number" ? customMinHeight : isLabelEmbeded ? 30 : 46;
    }, [customMinHeight, isLabelEmbeded]);
    const maxHeight = useMemo(() => {
        return typeof customMaxHeight === "number" ? customMaxHeight : undefined;
    }, [customMaxHeight]);
    const inputDimensionsRef = useRef<IDict>({ width: 0, height: minHeight });
    const { height } = inputDimensionsRef.current;
    const affixContent = useMemo(() => {
        if (affix === false) return null;
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
    }, [focusedValue, isDateOrTime, canValueBeDecimal, error, multiline, inputTextClx, affix, isPasswordField]);

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
    label = typeof label === "string" ? `${label}${labelSuffix}` : isValidElement(label) ? <>{label}<Text className={extractTextClasses(labelClx)}>{labelSuffix}</Text></> : null;
    label = <Text testID={testID + "-label"} className={cn(labelClx)}>{label}</Text>;
    const labelContent = !canRenderLabel ? null : editable ? <Div testID={testID + "-text-text-input-pressable-container"} onPress={focus}>{label}</Div> : label;
    const canWrapWithTouchable = props.isDropdownAnchor && editable && !readOnly;
    const Wrapper = canWrapWithTouchable ? TouchableOpacity : Div;
    const pressableProps = { onPress, onPressIn, onPressOut, testID: `${testID}-dropdown-anchor-container`, className: cn("grouw cursor-pointer px-[5px]") };
    const wrapperProps = canWrapWithTouchable ? Object.assign({}, pressableProps) : {};
    const inputStyle = StyleSheet.flatten([
        minHeight > 0 && { minHeight },
        multiline && { height: inputHeight },
        props.style,
    ])
    const inputProps: ITextInputRenderOptions = {
        autoComplete: "off",
        ...(!canWrapWithTouchable && editable ? pressableProps : {}),
        ...props,
        className: inputClx,
        //placeholderTextColor: isFocused || error ? textColor : theme.colors.placeholder,
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
        placeholder: hasInputMask ? inputMaskPlaceholder : (isEmpty(props.placeholder) ? "" : defaultStr(props.placeholder)),
        testID: testID,
        readOnly: editable === false,
        editable,
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
    };
    const inputElement = typeof render == "function" ? render(inputProps, callOptions) : <RNTextInput {...inputProps as any} ref={inputRef} />;
    const Avoiding = useMemo(() => {
        return withKeyboardAvoidingView ? KeyboardAvoidingView : Div;
    }, [withKeyboardAvoidingView]);
    const leftContainerWrappedWithTouchableClassName = cn(canWrapWithTouchable && "px-0");
    const leftOrRightClassName = cn("flex flex flex-row items-center self-center justify-start", disabledClx);
    const leftContent = left,
        rightContent = (right || canToggleSecure || affixContent) ? <>
            {affixContent}
            {right}
            {secureIcon}
        </> : null
    return <Avoiding className={cn(containerClx, disabledClx, readOnlyClx, "text-input-container")} testID={testID + "-container"}>
        {isLabelEmbeded ? null : labelContent}
        <Wrapper {...wrapperProps} testID={testID + "-content-container"} className={cn("text-input-content-container w-full flex flex-row relative justify-center self-start items-center", contentContainerClx)}>
            <Div testID={testID + "-left-content-container"} className={cn(leftOrRightClassName, "grow-0 self-center", leftContainerClx, leftContainerWrappedWithTouchableClassName)}>
                {leftContent}
                {isLabelEmbeded ? labelContent : null}
            </Div>
            {isHydrated ? inputElement : <Text className={cn(inputClx)} style={inputStyle} children={String(inputValue)} />}
            {rightContent ? (<Div testID={testID + "-right-content-container"} className={cn(leftOrRightClassName, "text-input-right-content-container grow-0 self-center justify-end", rightContainerClx)}>
                {rightContent}
            </Div>) : null}
        </Wrapper>
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
