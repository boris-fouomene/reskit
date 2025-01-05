import Label from "@components/Label";
import { isValidElement, mergeRefs } from "@utils";
import { NativeSyntheticEvent, Pressable, TextInput as RNTextInput, StyleSheet, TextInputChangeEventData, TextInputFocusEventData, TextInputKeyPressEventData } from "react-native";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { formatValueToObject, Platform, IDict, isNonNullString, isStringNumber, parseDecimal, isEmpty } from "@resk/core";
import _, { isNumber } from "lodash";
import Theme, { useTheme } from "@theme";
import FontIcon from "@components/Icon/Font";
import View from "@components/View";
import { getLabelOrLeftOrRightProps } from "@hooks/label2left2right";
import { ITextInputCallbackOptions, ITextInputProps, ITextInputType, IUseTextInputProps } from "./types";
import { ITheme } from "@theme/types";
import { IStyle } from "@src/types";
import { IFontIconProps } from "@components/Icon";
import { TouchableRipple } from "@components/TouchableRipple";

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
const TextInput = React.forwardRef((props: ITextInputProps, ref?: React.Ref<RNTextInput>) => {
    const { variant, containerProps, onPress, onPressIn, onPressOut, editable, canRenderLabel, isFocused, leftContainerProps: cLeftContainerProps, contentContainerProps, left, right, label, ...rest } = useTextInput(props);
    const leftContainerProps = Object.assign({}, cLeftContainerProps);
    const isLabelEmbededVariant = variant === "labelEmbeded";
    const { testID } = rest;
    const innerRef = useRef<RNTextInput | null>(null);
    const labelContent = !isEmpty(label) && editable ? <Pressable testID={testID + "-text-input-pressable-container"} onPress={(e) => {
        if (innerRef?.current && typeof innerRef.current.focus === "function") {
            innerRef.current.focus();
        }
    }}>{label}</Pressable> : label;
    const canWrapWithTouchable = props.isDropdownAnchor && editable;
    const Wrapper = canWrapWithTouchable ? TouchableRipple : React.Fragment;
    const pressableProps = { onPress, onPressIn, onPressOut, testID: `${testID}-dropdown-anchor-container`, style: [styles.dropdownAnchorContainer] };
    const wrapperProps = canWrapWithTouchable ? pressableProps : undefined;
    return <View  {...containerProps}>
        {isLabelEmbededVariant ? null : labelContent}
        <View {...contentContainerProps}>
            {<View testID={`${testID}-left-container`} {...leftContainerProps} style={[styles.leftOrRightContainer, styles.leftContainer, canWrapWithTouchable && styles.leftContainerWrappedWithTouchable, leftContainerProps.style]}>
                {left}
                {isLabelEmbededVariant ? labelContent : null}
                <Wrapper {...wrapperProps}>
                    <RNTextInput
                        {...(!canWrapWithTouchable ? pressableProps : {})}
                        {...rest}
                        editable={canWrapWithTouchable ? false : editable}
                        ref={mergeRefs(innerRef, ref)}
                    />
                </Wrapper>
            </View>}
            {right}
        </View>
    </View>
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
const getContainerAndContentStyle = ({ isFocused, isLabelEmbededVariant, textColor, borderColor, theme, isDefaultVariant }: { isLabelEmbededVariant: boolean, canRenderLabel: boolean, theme: ITheme, isFocused: boolean, textColor?: string, borderColor?: string, isDefaultVariant: boolean }) => {
    const contentContainerStyle: IStyle = [], containerStyle: IStyle = [], inputStyle: IStyle = [styles.input, { color: textColor }], labelStyle: IStyle = [{ color: textColor }];
    const borderedStyle = [
        isFocused ? styles.focusedOutlineBorder : styles.containerLabelEmbeded,
        { borderColor, borderRadius: theme.roundness },
    ];
    const notEmbeededLabelStyle = [styles.notEmbededLabelStyle],
        notEmbeededInputStyle = [styles.inputNotEmbededLabelVariant]
    if (isLabelEmbededVariant) {
        inputStyle.push(styles.inputLabelEmbededVariant);
        containerStyle.push(borderedStyle);
        containerStyle.push(styles.labelEmbededVariantContainer);
        labelStyle.push(styles.labelEmbededVariantLabel);
    } else {
        inputStyle.push(notEmbeededInputStyle);
        labelStyle.push(notEmbeededLabelStyle)
        contentContainerStyle.push(borderedStyle);
    }
    if (isDefaultVariant) {
        labelStyle.push(styles.defaultVariantLabel);
    }
    return { containerStyle, contentContainerStyle, inputStyle, labelStyle }
}

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
export const useTextInput = ({ defaultValue, opacity, isDropdownAnchor, secureTextEntryGetToggleIconProps, testID, value: omittedValue, withLabel, left: customLeft, variant = "default", error, label: customLabel, labelProps, containerProps, right: customRight, contentContainerProps, debounceTimeout, rightContainerProps, emptyValue: cIsEmptyValue, maxLength, length, affix, type, readOnly, secureTextEntry, toCase: cToCase, inputMode: cInputMode, onChange, ...props }: ITextInputProps): IUseTextInputProps => {
    const [isFocused, setIsFocused] = React.useState(false);
    const theme = useTheme();
    contentContainerProps = Object.assign({}, contentContainerProps);
    rightContainerProps = Object.assign({}, rightContainerProps);
    containerProps = Object.assign({}, containerProps);
    testID = testID || "resk-text-input";
    const isPasswordField = useMemo<boolean>(() => String(type).toLowerCase() === "password", [type]);
    const isLabelEmbededVariant = variant == "labelEmbeded";
    const isDefaultVariant = !isLabelEmbededVariant;
    const [isSecure, setIsSecure] = React.useState(typeof secureTextEntry === "boolean" ? secureTextEntry : true);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
    const placeholder = isEmpty(props.placeholder) ? "" : props.placeholder;
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
        const inputMode = !isFocused ? "text" : cInputMode || type == "number" ? "decimal" : type !== "password" ? type : "text";
        const isNumberType = isDecimalType(inputMode as string);
        return {
            inputMode,
            isNumberType
        }
    }, [type, cInputMode, isFocused]);
    const emptyValue = cIsEmptyValue || (canValueBeDecimal ? "0" : "");
    const toCase = (value: any): any => {
        if (canValueBeDecimal && isFocused && (value === '.' || value == '.')) {
            value = "0" + value;
        }
        if (value === emptyValue && isFocused) {
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
    const formated = useMemo(() => {
        return formatValueToObject({ ...inputState, type, value: inputState.value, ...props });
    }, [inputState.value]);
    const focusedValue = isFocused ? (formated.value == emptyValue ? '' : formated.value) : '';
    useEffect(() => {
        if (defaultValue === inputState.value) return;
        setInputState({ ...inputState, value: defaultValue, event: null });
    }, [defaultValue]);
    const disabled = props.disabled || readOnly;
    const editable = !disabled && props.editable !== false && readOnly !== false || false;
    const canToggleSecure = isPasswordField;
    const textColor = error ? theme.colors.error : isFocused && editable ? theme.colors.primary : theme.colors.onSurfaceVariant;
    const callOptions: ITextInputCallbackOptions = { ...formated, error: !!error, variant, isFocused, textColor: textColor as string, editable, disabled: disabled as boolean };
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
    }, [focusedValue, canValueBeDecimal, error, props.multiline, textColor, affix, isPasswordField]);
    const inputValue = isFocused ? focusedValue : formated.formattedValue || emptyValue || "";
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
    const secureIcon = isPasswordField ? <FontIcon size={25}  {...secureIconProps} name={secureIconProps?.name || (isSecure ? "eye" : "eye-off")} onPress={() => { setIsSecure(!isSecure) }} color={textColor} /> : null;
    const borderColor = isFocused || error ? textColor : theme.colors.outline;
    const { containerStyle, contentContainerStyle, inputStyle, labelStyle } = getContainerAndContentStyle({ canRenderLabel, isFocused, isLabelEmbededVariant, theme, textColor, borderColor, isDefaultVariant })
    return {
        autoComplete: "off",
        placeholderTextColor: isFocused || error ? undefined : theme.colors.placeholder,
        underlineColorAndroid: "transparent",
        ...props,
        variant,
        canRenderLabel,
        error,
        isFocused,
        containerProps: Object.assign({}, { testID: `${testID}-container` }, containerProps, { style: [styles.container, containerStyle, disabledOrEditStyle, containerProps.style] }),
        contentContainerProps: Object.assign({}, { testID: `${testID}-content-container` }, contentContainerProps, { style: [styles.contentContainer, contentContainerStyle, contentContainerProps.style] }),
        label: (label ? <Label color={textColor} testID={`${testID}-label`} {...Object.assign({}, labelProps)} style={[labelStyle, labelProps?.style]}>{label}{isLabelEmbededVariant ? ` : ` : ""}</Label> : null),
        withLabel,
        placeholder: placeholder,
        testID: testID,
        readOnly: editable === false,
        editable: isDropdownAnchor ? false : editable,
        secureTextEntry: isPasswordField ? isSecure : secureTextEntry,
        style: [
            styles.outlineNone, Object.assign({}, Platform.isWeb() ? { outline: "none" } : null),
            styles.input, inputStyle,
            props.style,
            disabledOrEditStyle,
            isDropdownAnchor && editable && styles.dropdownAnchorInput,
        ],
        value: inputValue,
        inputMode: inputMode,
        onChange: (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
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
                        onChange({ ...options, ...inputState, isFocused, event, ...formatValueToObject({ ...options, type }) });
                    }, isNumber(debounceTimeout) && debounceTimeout || 0);
                }
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
        left,
        right: (right || canToggleSecure || affixContent) ? <View testID={`${testID}-right-container`} {...rightContainerProps} style={[styles.leftOrRightContainer, styles.rightContainer, disabledOrEditStyle, rightContainerProps.style]}>
            {affixContent}
            {right}
            {editable || disabled !== false && isPasswordField ? secureIcon : null}
        </View> : null
    }
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
    hidden: { display: "none", opacity: 0 },
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
        flexGrow: 1,
        overflow: 'hidden',
        paddingVertical: 8,
    },
    inputLabelEmbededVariant: {
        paddingVertical: 3,
        paddingHorizontal: 0,
        margin: 0,
    },
    inputNotEmbededLabelVariant: {},
    focusedInput: {
        borderColor: 'transparent', // No border on focus
        borderWidth: 0,
    },
    outlineNone: {},
    containerLabelEmbeded: {
        borderWidth: 1,
    },
    focusedOutlineBorder: {
        borderWidth: 2,
    },
    affixMultiline: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    rightContainer: {
        paddingRight: 5,
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
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        width: "100%",
    },
    leftContainer: {
        paddingLeft: 5,
        flexGrow: 1,
    },
    leftOrRightContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
    },
    leftContainerWrappedWithTouchable: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    notEmbededLabelStyle: {
        fontWeight: "500",
    },
    defaultVariantLabel: {

    },
    labelEmbededVariantContainer: {
        //paddingHorizontal: 5,
        paddingVertical: 5,
    },
    labelEmbededVariantLabel: {
        //paddingLeft: 3,
    },
})

const isDecimalType = (type: ITextInputType | string): boolean => {
    return ['decimal', 'numeric', 'number'].includes(String(type).toLowerCase());
}