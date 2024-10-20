import Label from "@components/Label";
import { isValidElement, mergeRefs } from "@utils";
import { NativeSyntheticEvent, Pressable, TextInput as RNTextInput, Animated as RNAnimated, StyleSheet, TextInputChangeEventData, TextInputFocusEventData, TouchableOpacity } from "react-native";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { formatValueToObject, Platform, IDict, isNonNullString, isStringNumber, parseDecimal, isEmpty } from "@resk/core";
import _, { isNumber } from "lodash";
import Theme, { useTheme } from "@theme";
import FontIcon from "@components/Icon/Font";
import View, { IViewProps } from "@components/View";
import { getLabelOrLeftOrRightProps } from "@hooks/index";
import { ITextInputCallbackOptions, ITextInputProps, ITextInputType } from "./types";
import { ITheme } from "@theme/types";
import { IStyle } from "@src/types";
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, SharedValue, useAnimatedRef, runOnUI, measure, MeasuredDimensions } from 'react-native-reanimated';

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
 * import {TextInput} from "@resk/expo";
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
 *             affix={<Icon name="info" />} // Adds an info icon as an affix
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
const TextInput = React.forwardRef(({ defaultValue, testID, left: customLeft, variant = "default", error, label: customLabel, labelProps, containerProps, right: customRight, contentContainerProps, debounceTimeout, rightContainerProps, leftContainerProps, emptyValue: cIsEmptyValue, maxLength, length, affix, type, readOnly, secureTextEntry, toCase: cToCase, inputMode: cInputMode, onChange, ...props }: ITextInputProps, ref?: React.Ref<RNTextInput>) => {
    const [focused, setIsFocused] = React.useState(false);
    const theme = useTheme();
    contentContainerProps = Object.assign({}, contentContainerProps);
    rightContainerProps = Object.assign({}, rightContainerProps);
    leftContainerProps = Object.assign({}, leftContainerProps);
    containerProps = Object.assign({}, containerProps);
    testID = testID || "RN_TextInputComponent";
    const isPasswordField = useMemo<boolean>(() => String(type).toLowerCase() === "password", [type]);
    const isLabelEmbededVariant = variant == "labelEmbeded";
    const isFlatVariant = variant === "flat", isOutlinedVariant = variant == "outlined";
    const isDefaultVariant = !isFlatVariant && !isOutlinedVariant && !isOutlinedVariant;
    const [isSecure, setIsSecure] = React.useState(typeof secureTextEntry === "boolean" ? secureTextEntry : true);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
    const floatingLabelPosition = useSharedValue(0);
    // Create an animated reference for the input field
    const containerRef = useAnimatedRef();
    const contentContainerRef = useAnimatedRef();
    const containerLayoutRef = useRef<MeasuredDimensions | null>(null);
    const contentContainerLayoutRef = useRef<MeasuredDimensions | null>(null);
    const placeholder = isEmpty(props.placeholder) ? "" : props.placeholder;
    const canHandleFloadingLabel = isFlatVariant || isOutlinedVariant;
    useEffect(() => {
        // Run this on the UI thread (since `measure()` is a UI operation)
        runOnUI(() => {
            // Measure the height of the input field to position the label correctly
            containerLayoutRef.current = measure(containerRef);
            contentContainerLayoutRef.current = measure(contentContainerRef);
        })();
    }, [canHandleFloadingLabel]);
    const containerLayout = containerLayoutRef.current;
    const contentContainerLayout = containerLayoutRef.current;

    const floatingLabelAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withTiming(floatingLabelPosition.value, {
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                }),
            },
        ],
    }));
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
        const inputMode = !focused ? "text" : cInputMode || type == "number" ? "decimal" : type !== "password" ? type : "text";
        const isNumberType = isDecimalType(inputMode as string);
        return {
            inputMode,
            isNumberType
        }
    }, [type, cInputMode, focused]);
    const emptyValue = cIsEmptyValue || (canValueBeDecimal ? "0" : "");
    const toCase = (value: any): any => {
        if (canValueBeDecimal && focused && (value === '.' || value == '.')) {
            value = "0" + value;
        }
        if (value === emptyValue && focused) {
            value = "";
        }
        if (cToCase) return cToCase(value);
        if (value == undefined) value = '';
        if (isStringNumber(String(value))) value += "";
        if (canValueBeDecimal) {
            return parseDecimal(value);
        }
        return value;
    };
    const [inputState, setInputState] = React.useState({
        value: toCase(defaultValue),
        event: null,
    } as IDict);
    /**
     * la valeur affichée est la valeur formattée
     */
    const formated = useMemo(() => {
        return formatValueToObject({ ...inputState, type, value: inputState.value, ...props });
    }, [inputState.value]);
    const focusedValue = focused ? (formated.value == emptyValue ? '' : formated.value) : '';
    useEffect(() => {
        if (defaultValue === inputState.value) return;
        setInputState({ ...inputState, value: defaultValue, event: null });
    }, [defaultValue]);
    const disabled = props.disabled || readOnly;
    const editable = !disabled && props.editable !== false && readOnly !== false || false;
    const canToggleSecure = isPasswordField;
    const textColor = error ? theme.colors.error : focused && editable ? theme.colors.primary : theme.colors.onSurfaceVariant;
    const callOptions: ITextInputCallbackOptions = { ...formated, variant, focused, color: textColor as string, editable, disabled };
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
        if (React.isValidElement(affContent)) {
            return affContent;
        }
        return <Label children={affContent} style={[styles.affix, { color: textColor }]} />;
    }, [focusedValue, canValueBeDecimal, error, props.multiline, affix, isPasswordField]);
    const inputValue = focused ? focusedValue : formated.formattedValue || emptyValue || "";
    const isInputValueEmpty = isEmpty(inputValue);
    const canRenderLabel = isDefaultVariant || (isLabelEmbededVariant && !placeholder && isInputValueEmpty || (canHandleFloadingLabel));
    useMemo(() => {
        if (!canHandleFloadingLabel) return;
        const height = containerLayout?.height ? (containerLayout.height - 5) : 0;
        if (focused || !isInputValueEmpty) {
            floatingLabelPosition.value = -1 * height;
        } else if (isEmpty(inputValue) && !isEmpty(props.placeholder)) {
            floatingLabelPosition.value = 0;
        }
    }, [focused, containerLayout, contentContainerLayout, canHandleFloadingLabel, inputValue, canRenderLabel, isInputValueEmpty]);
    const { left, right, label } = getLabelOrLeftOrRightProps<ITextInputCallbackOptions>({ left: customLeft, right: customRight, label: canRenderLabel ? customLabel : null }, callOptions);
    const disabledOrEditStyle = [!editable ? Theme.styles.readOnly : null, props.disabled ? Theme.styles.disabled : null];
    const secureIcon = isPasswordField ? <FontIcon color={textColor} size={25} name={isSecure ? "eye" : "eye-off"} /> : null;
    const borderColor = focused || error ? textColor : theme.colors.outline;
    const { containerStyle, contentContainerStyle, inputStyle, labelStyle } = getContainerAndContentStyle({ floatingLabelPosition, canHandleFloadingLabel, isLabelEmbededVariant, canRenderLabel, focused, theme, textColor, borderColor, isFlatVariant, isOutlinedVariant, isDefaultVariant })
    const lContent = (label ? <Label color={textColor} testID={`${testID}_Label`} {...Object.assign({}, labelProps)} style={[labelStyle, labelProps?.style]}>{label}{isLabelEmbededVariant ? ` : ` : ""}</Label> : null);
    const innerRef = useRef<RNTextInput | null>(null);
    const labelContent = !isEmpty(lContent) && editable ? <TouchableOpacity onPress={(e) => {
        if (innerRef?.current && typeof innerRef.current.focus === "function") {
            innerRef.current.focus();
        }
    }}>{lContent}</TouchableOpacity> : lContent;
    return <View ref={containerRef} testID={`${testID}_Container`} {...containerProps} style={[styles.container, containerStyle, disabledOrEditStyle, containerProps.style]}>
        {isLabelEmbededVariant ? null :
            (canHandleFloadingLabel ? <Animated.Text testID={`${testID}_FloatingLabelContainer`} style={[styles.floatingLabel, floatingLabelAnimatedStyle, focused && styles.floatingLabelFocused]}>
                {labelContent}
            </Animated.Text> : labelContent)}
        <View ref={contentContainerRef} testID={`${testID}_ContentContainer`} {...contentContainerProps} style={[styles.contentContainer, contentContainerStyle, contentContainerProps.style]}>
            {left || isLabelEmbededVariant && !isEmpty(label) ? <View testID={`${testID}_LeftContainer`} {...leftContainerProps} style={[styles.leftOrRightContainer, disabledOrEditStyle, leftContainerProps.style]}>
                {left}
                {isLabelEmbededVariant !== false ? labelContent : null}
            </View> : null}
            <RNTextInput
                autoComplete="off"
                {...props}
                placeholder={!canHandleFloadingLabel || !labelContent ? placeholder : undefined}
                underlineColorAndroid="transparent"
                testID={testID}
                readOnly={editable === false}
                secureTextEntry={isPasswordField ? isSecure : secureTextEntry}
                style={[styles.outlineNone, Object.assign({}, Platform.isWeb() ? { outline: "none" } : null), styles.input, inputStyle, props.style, disabledOrEditStyle]}
                value={inputValue}
                inputMode={inputMode}
                ref={mergeRefs(innerRef, ref)}
                onChange={(event: NativeSyntheticEvent<TextInputChangeEventData>) => {
                    const { nativeEvent: { target, text } } = event;
                    let textString = String(text);
                    if (canValueBeDecimal && (textString && !isStringNumber(textString) && !textString.endsWith(".") && !textString.endsWith(","))) {
                        return;
                    }
                    const valCase = toCase(textString);
                    if (textString !== inputState.value && valCase !== inputState.value) {
                        const options = { ...inputState, value: valCase, text: textString, event };
                        setInputState(options);
                        if (typeof onChange == "function") {
                            clearTimeout(debounceTimeoutRef.current);
                            debounceTimeoutRef.current = setTimeout(() => {
                                onChange({ ...options, ...inputState, focused, event, ...formatValueToObject({ ...options, type }) });
                            }, isNumber(debounceTimeout) && debounceTimeout || 0);
                        }
                    }
                }}
                onKeyPress={(event, ...rest) => {
                    if (props.onKeyPress) {
                        props.onKeyPress(event, ...rest);
                    }
                    if (!focused) {
                        setIsFocused(true);
                    }
                }}
                onBlur={(event: NativeSyntheticEvent<TextInputFocusEventData>, ...rest) => {
                    setIsFocused(false);
                    if (props.onBlur) {
                        props.onBlur(event, ...rest);
                    }
                }}
                onFocus={
                    (event: NativeSyntheticEvent<TextInputFocusEventData>, ...rest) => {
                        setIsFocused(true);
                        if (props.onFocus) {
                            props.onFocus(event, ...rest);
                        }
                    }
                }
            />
            {right || canToggleSecure ? <View testID={`${testID}_RightContainer`} {...leftContainerProps} style={[styles.leftOrRightContainer, disabledOrEditStyle, rightContainerProps.style]}>
                {affixContent}
                {right}
                {!editable || disabled && isPasswordField ? secureIcon : <Pressable children={secureIcon} onPress={(e) => setIsSecure(!isSecure)} />}
            </View> : null}
        </View>
    </View>
});

const getContainerAndContentStyle = ({ isLabelEmbededVariant, canHandleFloadingLabel, textColor, borderColor, theme, isFlatVariant, isOutlinedVariant, floatingLabelPosition, isDefaultVariant }: { isLabelEmbededVariant: boolean, floatingLabelPosition: SharedValue<number>, canRenderLabel: boolean, canHandleFloadingLabel: boolean, theme: ITheme, focused: boolean, textColor?: string, borderColor?: string, isFlatVariant: boolean, isOutlinedVariant: boolean, isDefaultVariant: boolean }) => {
    const contentContainerStyle: IStyle = [], containerStyle: IStyle = [], inputStyle: IStyle = [{ color: textColor }], labelStyle: IStyle = [{ color: textColor }];
    const borderedStyle = [
        styles.containerLabelEmbeded,
        { borderColor, borderRadius: theme.roundness },
    ];
    const notEmbeededLabelStyle = [styles.notEmbededLabelStyle],
        notEmbeededInputStyle = [styles.inputNotEmbededLabelVariant]
    if (isLabelEmbededVariant) {
        inputStyle.push(styles.inputLabelEmbeded);
        containerStyle.push(borderedStyle);
        containerStyle.push(styles.labelEmbededVariantContainer);
    } else {
        inputStyle.push(notEmbeededInputStyle);
        labelStyle.push(notEmbeededLabelStyle)
        if (isFlatVariant) {
            contentContainerStyle.push([styles.flatVariantContentContainer, { borderColor }])
            inputStyle.push(styles.flatVariantInput)
        } else if (isOutlinedVariant) {
            contentContainerStyle.push(borderedStyle);
            contentContainerStyle.push(styles.outlinedVarientContentContainer)
        } else {
            contentContainerStyle.push(borderedStyle);
        }
    }
    if (isDefaultVariant) {
        labelStyle.push(styles.defaultVariantLabel);
    }
    if (canHandleFloadingLabel) {
        inputStyle.push(styles.floatingInput);
        containerStyle.push(styles.containerWithFloatingLabel);
    }

    return { containerStyle, contentContainerStyle, inputStyle, labelStyle }
}

TextInput.displayName = "TextInput";

export default TextInput;


const styles = StyleSheet.create({
    affix: {
        paddingHorizontal: 0,
        marginHorizontal: 0,
        marginLeft: 5,
        fontSize: 15
    },
    inputLabelEmbeded: {
        paddingRight: 5,
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
        paddingHorizontal: 2,
    },
    inputNotEmbededLabelVariant: {
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    focusedInput: {
        borderColor: 'transparent', // No border on focus
        borderWidth: 0,
    },
    outlineNone: {},
    containerLabelEmbeded: {
        borderWidth: 1,
    },
    affixMultiline: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    rightContainer: {
        justifyContent: "center",
    },
    container: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        position: 'relative',
    },
    containerWithFloatingLabel: {
        marginTop: 10,
        paddingBottom: 5,
    },
    contentContainer: {
        justifyContent: "space-between",
        alignSelf: "flex-start",
        flexWrap: "nowrap",
        backgroundColor: "transparent",
        flexDirection: "row",
    },
    leftOrRightContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    flatVariantContentContainer: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        paddingHorizontal: 0,
    },
    outlinedVarientContentContainer: {

    },
    notEmbededLabelStyle: {
        fontWeight: "500",
    },
    flatVariantInput: {
        paddingHorizontal: 0,
    },
    floatingLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    floatingLabelFocused: {
        //position: "relative",
    },
    floatingInput: {
        paddingVertical: 0,
    },
    defaultVariantLabel: {

    },
    labelEmbededVariantContainer: {
        padding: 5,
    }
})

const isDecimalType = (type: ITextInputType | string): boolean => {
    return ['decimal', 'numeric', 'number'].includes(String(type).toLowerCase());
}