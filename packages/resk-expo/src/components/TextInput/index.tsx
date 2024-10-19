import Label from "@components/Label";
import { isValidElement } from "@utils";
import { InputModeOptions, NativeSyntheticEvent, Pressable, TextInput as RNTextInput, StyleSheet, TextInputChangeEventData, TextInputFocusEventData } from "react-native";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { isNonNullString, isStringNumber } from "@resk/core";
import _, { isNumber } from "lodash";
import Theme, { useTheme } from "@theme";
import FontIcon from "@components/Icon/Font";
import View, { IViewProps } from "@components/View";
import { ILeftOrRightProps, getLeftOrRightProps } from "@hooks/index";

/***
 * Le composant TextInput, étend le composant TextInput de react-native-paper
 * @see https://callstack.github.io/react-native-paper/docs/components/TextInput
    example : 
    ```ts
        import TextInput from "$components/TextInput";
        export function MyTextInput(){
            return <TexField {p as ITextInputProps}/>
        }
    ```
*/
const TextInput = React.forwardRef(({ defaultValue, testID, value: customValue, debounceTimeout, left, leftProps, leftChildrenCount, rightChildrenCount, rightProps, rightContainerProps, leftContainerProps, emptyValue: cIsEmptyValue, maxLength, length, affix, type, readOnly, right, secureTextEntry, toCase: cToCase, inputMode: cInputMode, onChange, ...props }: ITextInputProps, ref: React.Ref<RNTextInput>) => {
    const [focused, setIsFocused] = React.useState(false);
    rightContainerProps = Object.assign({}, rightContainerProps);
    leftContainerProps = Object.assign({}, leftContainerProps);
    leftProps = Object.assign({}, leftProps);
    rightProps = Object.assign({}, rightProps);
    testID = testID || "RN_TextInputComponent";
    const isPasswordField = useMemo<boolean>(() => String(type).toLowerCase() === "password", [type]);
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
        const inputMode = !focused ? "text" : cInputMode || type == "number" ? "decimal" : type !== "password" ? type : "text";
        const isNumberType = isDecimalType(inputMode as string);
        return {
            inputMode,
            isNumberType
        }
    }, [type, cInputMode, focused]);
    const emptyValue = cIsEmptyValue || (canValueBeDecimal ? "0" : "");
    const toCase = (value: ITextInputValue): ITextInputValue => {
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
    } as IDynamicObject);
    /**
     * la valeur affichée est la valeur formattée
     */
    const formated = useMemo(() => {
        return formatValue({ ...inputState, type, value: inputState.value, ...props }, true);
    }, [inputState.value]) as IFieldFormatValueResult;
    const focusedValue = focused ? (formated.value == emptyValue ? '' : formated.value) : '';
    useEffect(() => {
        if (defaultValue === inputState.value) return;
        setInputState({ ...inputState, value: defaultValue, event: null });
    }, [defaultValue]);
    const disabled = props.disabled || readOnly;
    const editable = !disabled && props.editable !== false && readOnly !== false || false;
    const canToggleSecure = isPasswordField;
    const textColor = props.error ? theme.colors.error : focused && editable ? theme.colors.primary : undefined;
    const callOptions: ITextInputCallbackOptions = { ...formated, focused, color: textColor as string, editable, disabled };
    const customRight = typeof right == "function" ? right(callOptions) : right;
    const customLeft = typeof left == "function" ? left(callOptions) : left;
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
        return <Label children={affContent} style={[textFieldStyles.affix, props.multiline && textFieldStyles.affixMultiline, { color: textColor }]} />;
    }, [focusedValue, canValueBeDecimal, props.multiline, affix, isPasswordField]);
    const mLeft = React.isValidElement(customLeft) ? customLeft : null;
    const mRight = React.isValidElement(customRight) ? customRight : null;
    const SIZE = 40;
    const { left: leftWidth, right: rightWidth } = useMemo<{ left: number, right: number }>(() => {
        let right = (affixContent ? SIZE : 0) + (canToggleSecure ? SIZE : 0);
        let left = typeof leftChildrenCount == "number" ? leftChildrenCount : 0;
        if (typeof rightChildrenCount === 'number') {
            right += rightChildrenCount * SIZE;
        }
        if (mRight) {
            right += SIZE;
        }
        return { left: Math.max(SIZE, left), right: Math.max(SIZE, right) };
    }, [affixContent, canToggleSecure, mRight]);
    const disabledOrEditStyle = [!editable ? styles.readOnly : null, props.disabled ? styles.disabled : null];
    const secureIcon = isPasswordField ? <FontIcon color={textColor} size={25} name={isSecure ? "eye" : "eye-off"} /> : null;
    return <TextInput
        mode={"outlined"}
        textColor={textColor}
        autoComplete="off"
        {...props}
        testID={testID}
        editable={editable}
        secureTextEntry={isPasswordField ? isSecure : secureTextEntry}
        disabled={props.disabled}
        style={[props.style, disabledOrEditStyle]}
        value={focused ? focusedValue : formated.formattedValue || emptyValue}
        inputMode={inputMode}
        ref={ref}
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
                        onChange({ ...options, ...inputState, focused, event, ...formatValue({ ...options, type }, true) as IFieldFormatValueResult });
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
        left={mLeft ? <TextInput.Icon
            size={leftWidth}
            {...leftProps}
            style={[{ width: leftWidth, height: '100%' }, disabledOrEditStyle, leftProps.style]}
            icon={() => {
                return <HStack testID={testID + "_LeftContainer"} {...leftContainerProps} style={[disabledOrEditStyle, textFieldStyles.leftOrRightContainer, leftContainerProps.style]}>
                    {mLeft}
                </HStack>
            }}
        /> : null}
        right={mRight || canToggleSecure ? <TextInput.Icon
            size={rightWidth}
            {...rightProps}
            style={[{ width: rightWidth, height: '100%' }, disabledOrEditStyle, rightProps.style]}
            icon={() => {
                return <HStack testID={testID + "_RightContainer"} {...rightContainerProps} style={[disabledOrEditStyle, textFieldStyles.leftOrRightContainer, rightContainerProps.style]}>
                    {affixContent}
                    {!editable || disabled && isPasswordField ? secureIcon : <Pressable children={secureIcon} onPress={(e) => setIsSecure(!isSecure)} />}
                    {mRight}
                </HStack>
            }}
        /> : null}
    />
});

TextInput.displayName = "TextInput";

export default TextInput;

export type ITextInputValue = string | number | undefined;

const textFieldStyles = StyleSheet.create({
    affix: {
        paddingHorizontal: 0,
        marginHorizontal: 0,
        marginLeft: 5,
        fontSize: 15
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
        justifyContent: "space-between",
        flexWrap: "nowrap",
        backgroundColor: "transparent"
    },
    leftOrRightContainer: {
        position: "relative",
    }
})

export type ITextInputCallbackOptions = IFieldFormatValueResult & {
    color?: string;
    /***
     * si le composant est focused
     */
    focused?: boolean;
    editable?: boolean;
    disabled?: boolean;
}

export const roundLayoutSize = (size: number): number => Math.round(size * 1000) / 1000;

/***
 * cette interface étend celle du composant TextInput de react-native-paper
 * @see : https://github.com/callstack/react-native-paper/blob/main/src/components/TextInput/TextInput.tsx
 */
export type ITextInputProps = Omit<TextInputProps, 'onChange' | 'defaultValue' | 'left' | 'react'> & {
    inputMode?: InputModeOptions | null;
    left?: ReactNode | ((options?: ITextInputCallbackOptions) => ReactNode);
    right?: ReactNode | ((options?: ITextInputCallbackOptions) => ReactNode);
    /****
     * spécifie la longueur de texte autorisée pour le champs. 
     * cas des champs à longueur fixe
     */
    length?: number;
    defaultValue?: ITextInputValue; //la valeur par défaut du champ
    type?: ITextInputType,
    /***
     * les props du container parent aux élément right du composant
     */
    rightContainerProps?: IHStackProps;
    /*
        les props du container parent aux élément left du composant
    */
    leftContainerProps?: IHStackProps;

    leftProps?: TextInputIconProps;
    leftChildrenCount?: number; //le nombre d'enfants à gauche
    rightProps?: TextInputIconProps;
    rightChildrenCount?: number; //le nombre d'enfants à droite
    /***
     * permet d'afficher un texte ou une valeur en position affixe du composant
     * utile pour afficher par exemple le nombre de caractère restant ou pour le composant
     * Par défaut, affiche le nombre de caractère entrés dans le composant TextInput
     * Afix peut être une fonction qui retourne un élément node ou un nombre ou une chaine de caractère
     * si affix vaut false, alors aucun élément d'affixe ne sera affiché
     */
    affix?: ReactNode | ((options: ITextInputCallbackOptions) => ReactNode) | false;
    onChange?: (options: ITextInputOnChangeOptions) => any;
    /***
     * la fonction toCase permet de formatter le rendu attendu
     */
    toCase?: (value: ITextInputValue) => ITextInputValue;
    format?: IFieldFormatValue; //la fonction permettant de formatter la valeur à afficher à l'inputText
    emptyValue?: ITextInputValue; //la valeur considérée nulle ou vide par défaut
    /**
     * permet de spécifier l'interval de temps d'écoute de la valeur débouncée
     * si définit, alors en cas de changement de la valeur, la fonction qui handle le onChange sera appelée après ce temps découte
     */
    debounceTimeout?: number;
}

export type ITextInputEvent = NativeSyntheticEvent<TextInputChangeEventData> | null;