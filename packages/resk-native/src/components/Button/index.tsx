import * as React from 'react';
import { FormsManager } from '@components/Form/FormsManager';
import {
    Animated,
    StyleSheet,
    TextStyle,
    View as RNView,
    ViewStyle,
    GestureResponderEvent,
} from 'react-native';

import Theme, { useTheme, Colors } from '@theme/index';
import { forwardRef } from 'react';
import { getButtonColors } from './utils';
import { ActivityIndicator } from '@components/ActivityIndicator';
import { Surface } from '@components/Surface';
import { TouchableRipple } from '@components/TouchableRipple';
import Label from '@components/Label';
import { IButtonProps, IButtonContext, IButtonRef } from './types';
import { useGetIcon } from '@components/Icon';
import { defaultStr, isNonNullString, uniqid } from '@resk/core/utils';
import Auth from "@resk/core/auth";
import { Tooltip } from '@components/Tooltip';
import isValidElement from '@utils/isValidElement';
import View from '@components/View';
import { getLabelOrLeftOrRightProps } from '@hooks/label2left2right';
import { Divider } from '@components/Divider';

/**
 * A customizable button component that supports various styles, states, and accessibility features.
 * This button can be used in different modes (text, outlined, contained) and can display isLoading indicators,
 * icons, and tooltips. It also supports accessibility features for better user experience.
 * 
 * @param T - A generic type that allows the inclusion of additional properties specific to the button implementation.
 * 
 * @param props - The properties for the button component.
 * 
 * @param props.disabled - Whether the button is disabled. When true, the button will not respond to user interactions.
 * 
 * @param props.compact - If true, the button will have a more compact appearance, useful for displaying multiple buttons in a row.
 * 
 * @param props.mode - The visual style of the button. Can be 'text', 'outlined', or 'contained'.
 * 
 * @param props.dark - If true, the button will use a dark color scheme.
 * 
 * @param props.isLoading - If true, the button will display a isLoading indicator instead of the label.
 * 
 * @param props.icon - An optional icon to display alongside the button label.
 * 
 * @param props.backgroundColor - Custom background color for the button.
 * 
 * @param props.textColor - Custom text color for the button label.
 * 
 * @param props.rippleColor - Color of the ripple effect when the button is pressed.
 * 
 * @param props.children - The content of the button, can be a string or any ReactNode.
 * 
 * @param props.accessibilityLabel - Accessibility label for the button, read by screen readers.
 * 
 * @param props.accessibilityHint - Accessibility hint for the button, providing additional context to screen readers.
 * 
 * @param props.accessibilityRole - Accessibility role for the button, default is 'button'.
 * 
 * @param props.onPress - Callback function called when the button is pressed.
 * 
 * @param props.onLongPress - Callback function called when the button is long-pressed.
 * 
 * @param props.style - Additional styles for the button component.
 * 
 * @param props.uppercase - If true, the button label will be displayed in uppercase.
 * 
 * @param props.testID - Optional test ID for testing purposes.
 * 
 * @param props.accessible - If true, the button is accessible to screen readers.
 * 
 * @param props.containerRef - Reference for the container that wraps the button.
 * 
 * @param props.labelProps - Props for the label of the button, allowing customization of its appearance.
 * 
 * @param props.contentProps - Props for the content of the button.
 * 
 * @param props.iconPosition - Position of the icon relative to the label. Can be 'left' or 'right'.
 * 
 * @param props.iconProps - Props for the icon, if an icon is provided.
 * 
 * @param props.containerProps - Additional props for the surface that contains the button.
 * 
 * @param props.label - Alias for children, representing the button's label.
 * 
 * @param props.colorScheme - Color scheme token key to apply a theme color to the button.
 * 
 * @param props.disableRipple - If true, the ripple effect will be disabled on button press.
 * 
 * @param props.borderRadius - The border radius of the button. This property can be used to control the rounded corners of the button.
 * 
 * @param props.resourceName - The name of the resource associated with the button.
 * 
 * @param props.perm - The permission associated with the button. This permission is used to determine if the button will be rendered or not.
 * If not provided, the button will be rendered regardless of the user's permissions.
 * 
 * @returns A React component representing a button.
 * 
 * @example
 * // Example usage of the Button component
 * import { Button } from '@resk/native';
 * <Button
 *     mode="contained"
 *     isLoading={false}
 *     icon={"check"}
 *     iconPosition="left"
 *     onPress={() => console.log("Button pressed!")}
 *     accessibilityLabel="Submit form"
 *     testID="submit-button"
 * >
 *     Submit
 * </Button>
 */
export const Button = forwardRef<any, IButtonProps>(function Button<IButtonExtendContext = any>({
    disabled: customDisabled,
    compact,
    mode = 'text',
    dark,
    isLoading: customIsLoading,
    icon: iconProp,
    backgroundColor: customBackgroundColor,
    textColor: customTextColor,
    rippleColor: customRippleColor,
    children,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    style,
    uppercase,
    testID,
    accessible,
    containerRef,
    labelProps,
    contentProps,
    leftContentWrapperProps,
    rightContentWrapperProps,
    iconPosition,
    iconProps,
    containerProps,
    label: customLabel,
    colorScheme,
    disableRipple,
    borderRadius,
    id,
    left: customLeft,
    right: customRight,
    dividerProps,
    divider: customDivider,
    context: extendContext,
    onPress,
    centered,
    submitFormOnPress,
    fullWidth,
    spaceBetweenContent,
    isExpandable,
    formName,
    hoverColor: customHoverColor,
    resourceName,
    perm,
    noPadding,
    ...rest
}: IButtonProps<IButtonExtendContext>, ref: IButtonRef<IButtonExtendContext>) {
    testID = defaultStr(testID, "resk-button");
    leftContentWrapperProps = Object.assign({}, leftContentWrapperProps);
    rightContentWrapperProps = Object.assign({}, rightContentWrapperProps);
    const theme = useTheme();
    const [isLoading, _setIsLoading] = React.useState(typeof customIsLoading == "boolean" ? customIsLoading : false);
    const [isDisabled, setIsDisabled] = React.useState(typeof customDisabled == "boolean" ? customDisabled : false);
    const idRef = React.useRef<string>(id || uniqid("menu-item-id-"));
    const disabled: boolean = isDisabled || isLoading;
    const divider = customDivider === true;
    const disable = () => {
        setIsDisabled(true);
    },
        enable = () => {
            setIsDisabled(false);
        },
        isEnabled = () => {
            return !!!isDisabled;
        },
        setIsLoading = (customIsLoading: boolean) => {
            if (typeof customIsLoading === "boolean") {
                _setIsLoading(customIsLoading);
            }
        };
    React.useEffect(() => {
        if (typeof customDisabled == "boolean") {
            setIsDisabled(customDisabled);
        }
    }, [customDisabled]);
    React.useEffect(() => {
        if (typeof customIsLoading == "boolean") {
            setIsLoading(customIsLoading);
        }
    }, [customIsLoading]);
    const { color: colorSchemeColor, backgroundColor: colorSchemeBackgroundColor } = Theme.getColorScheme(colorScheme);
    dark = dark ?? theme.dark;
    const innerRef = React.useRef<RNView>(null);
    const context = {
        enable,
        disable,
        isEnabled,
        get id() { return idRef.current },
        setIsLoading,
        get ref() {
            return innerRef.current;
        },
        ...Object.assign({}, extendContext)
    }
    // Expose methods using useImperativeHandle
    React.useImperativeHandle(ref, () => (context as IButtonContext<IButtonExtendContext>));
    const { roundness } = theme;
    containerProps = Object.assign({}, containerProps);

    const isElevationEntitled = !disabled;
    const initialElevation = 1;

    const { current: elevation } = React.useRef<Animated.Value>(
        new Animated.Value(isElevationEntitled ? initialElevation : 0)
    );

    React.useEffect(() => {
        elevation.setValue(isElevationEntitled ? initialElevation : 0);
    }, [isElevationEntitled, elevation, initialElevation]);

    const flattenedStyles = (StyleSheet.flatten(style) || {}) as ViewStyle;
    const [restButtonStyle, borderRadiusStyles] = Theme.splitStyles(flattenedStyles, (style) => style.startsWith('border') && style.endsWith('Radius'));
    borderRadius = typeof borderRadiusStyles?.borderRadius === "number" ? borderRadiusStyles.borderRadius : typeof (borderRadius) === 'number' ? borderRadius : 1 * (roundness || 8);
    const { backgroundColor, hoverColor, borderColor, textColor, borderWidth } =
        getButtonColors({
            customBackgroundColor: Colors.isValid(customBackgroundColor) ? customBackgroundColor : colorSchemeBackgroundColor,
            customTextColor: Colors.isValid(customTextColor) ? customTextColor : colorSchemeColor,
            theme,
            mode,
            hoverColor: customHoverColor,
            dark,
        });

    const rippleColor = Colors.isValid(customRippleColor) ? customRippleColor : backgroundColor !== "transparent" && Colors.isValid(backgroundColor) ? (Colors.isDark(backgroundColor) ? TouchableRipple.darkRippleColor : TouchableRipple.lightRippleColor) : theme.dark ? TouchableRipple.darkRippleColor : TouchableRipple.lightRippleColor;
    const touchableStyle = {
        ...borderRadiusStyles,
        borderRadius,
    };
    const iconSize = 18;
    iconProps = Object.assign({}, iconProps);

    const buttonStyle = {
        backgroundColor,
        borderColor,
        borderWidth,
        ...touchableStyle,
    };
    dividerProps = Object.assign({}, dividerProps);
    labelProps = Object.assign({}, labelProps);
    contentProps = Object.assign({}, contentProps);
    const { color: customLabelColor, fontSize: customLabelSize } = (StyleSheet.flatten([labelProps.style]) || {}) as TextStyle;
    const textStyle = {
        color: textColor,
    };
    const { left, right, label } = getLabelOrLeftOrRightProps({ label: customLabel, left: customLeft, right: customRight }, { textColor, context })
    const iconColor: string = (Colors.isValid(customLabelColor) ? customLabelColor : Colors.isValid(iconProps?.color) ? iconProps.color : textColor) as string;
    const icon = useGetIcon({ icon: iconProp, size: iconSize, ...iconProps, color: iconColor as unknown as string, theme });
    const iconContent = icon && isLoading !== true ? icon : null;
    const contentStyle = StyleSheet.flatten([contentProps.style]) as ViewStyle;
    const hasLeftContentWrapper = !!isExpandable || !!spaceBetweenContent;
    const LeftContentWrapper = hasLeftContentWrapper ? View : React.Fragment;
    const letContentWrapperProps = hasLeftContentWrapper ? {
        id: `${idRef.current}-left-content-wrapper`,
        testID: testID + "-left-content-wrapper",
        ...leftContentWrapperProps,
        style: [styles.leftContentWrapper, leftContentWrapperProps?.style],
    } : {};
    const iconStyle =
        StyleSheet.flatten(contentStyle)?.flexDirection === 'row-reverse'
            ? [
                styles.iconReverse,
                styles[`iconReverse${compact ? 'Compact' : ''}`],
            ]
            : [
                styles.icon,
                styles[`icon${compact ? 'Compact' : ''}`],
            ];
    React.useEffect(() => {
        if (isNonNullString(formName)) {
            FormsManager.mountAction(context, formName);
        }
        return () => {
            FormsManager.unmountAction(context.id, formName);
        };
    }, [formName, idRef.current, context.id]);
    if (perm !== undefined && !Auth.isAllowed(perm)) return null;
    const fullWidthStyle = fullWidth ? styles.fullWidth : null;
    const compactStyle = compact ? styles.compact : null;
    const hasRightContent = (iconPosition == "right" && iconContent) || (isValidElement(right) && right);
    return (<ButtonContext.Provider value={context}>
        <Surface
            role="none"
            id={`${idRef.current}-container`}
            {...containerProps}
            ref={containerRef}
            testID={`${testID}-button-container`}
            style={
                [
                    styles.buttonContainer,
                    compactStyle,
                    buttonStyle,
                    fullWidthStyle,
                    disabled && styles.disabled,
                    containerProps?.style,
                ]
            }
        >
            <Tooltip
                as={TouchableRipple}
                hoverColor={hoverColor}
                borderless
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole={accessibilityRole}
                accessibilityState={{ disabled }}
                accessible={accessible}
                disabled={disabled}
                disabledRipple={disableRipple}
                rippleColor={rippleColor}
                style={[styles.button, compactStyle, fullWidthStyle, noPadding && styles.noPadding, restButtonStyle, touchableStyle]}
                testID={testID}
                ref={innerRef}
                id={idRef.current}
                onPress={(event: GestureResponderEvent) => {
                    const form = formName ? FormsManager.getForm(formName) : null;
                    const hasForm = form && form.isValid();
                    const context2: IButtonContext<IButtonExtendContext> = context as IButtonContext<IButtonExtendContext>;
                    if (hasForm) {
                        (context2 as any).formData = form?.getData();
                    }
                    const r = typeof onPress === 'function' ? onPress(event, context2) : true;
                    if (r === false || submitFormOnPress === false) return;
                    if (form) {
                        form.submit();
                    }
                    return r
                }}
                borderRadius={borderRadius}
                {...rest}
                androidRipple={Object.assign({}, { radius: borderRadius }, rest.android_ripple)}
            >
                <View id={`${idRef.current}-content`} testID={testID + "-button-content"} {...contentProps} style={[styles.content, centered && styles.centeredContent, fullWidthStyle, contentStyle, hasLeftContentWrapper && styles.contentHasLeftContentWrapper]}>
                    <LeftContentWrapper {...letContentWrapperProps}>
                        {iconPosition != "right" ? iconContent : null}
                        {isLoading ? (
                            <ActivityIndicator
                                size={customLabelSize ?? iconSize}
                                color={
                                    typeof customLabelColor === 'string'
                                        ? customLabelColor
                                        : textColor
                                }
                                style={iconStyle}
                            />
                        ) : null}
                        {left}
                        <Label
                            id={`${idRef.current}-label`}
                            selectable={false}
                            numberOfLines={1}
                            testID={`${testID}-button-label`}
                            {...labelProps}
                            style={[
                                styles.label,
                                compact && styles.compactLabel,
                                uppercase && styles.uppercaseLabel,
                                textStyle,
                                labelProps.style,
                            ]}
                        >
                            {isValidElement(children, true) && children || label}
                        </Label>
                    </LeftContentWrapper>
                    {(hasRightContent) ? <View testID={testID + "-right-content-wrapper"} id={`${idRef.current}-right-content-wrapper`} {...rightContentWrapperProps} style={[styles.rightContentWrapper, rightContentWrapperProps?.style]}>
                        {iconPosition == "right" ? iconContent : null}
                        {right}
                    </View> : null}
                </View>
            </Tooltip>
        </Surface>
        {divider ? <Divider id={idRef.current + "-divider"} testID={testID + "-button-divider"} {...dividerProps} style={[dividerProps.style, Theme.styles.w100]} /> : null}
    </ButtonContext.Provider>);
});


const styles = StyleSheet.create({
    buttonContainer: {
        borderStyle: 'solid',
        minWidth: 64,
    },
    fullWidth: {
        width: "100%",
    },
    button: {
        width: "100%",
        paddingHorizontal: 7,
        paddingVertical: 7,
    },
    noPadding: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    compact: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginVertical: 0,
        marginHorizontal: 0,
        padding: 0,
    },
    leftContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'flex-start',
    },
    rightContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: "center",
    },
    centeredContent: {
        justifyContent: "center",
        alignSelf: "center",
    },
    contentHasLeftContentWrapper: {
        justifyContent: "space-between",
        width: "100%",
    },
    contentNotRightContent: {
        width: undefined,
        textAlign: 'center',
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    icon: {
        marginHorizontal: 7,
    },
    iconCompact: {
        marginHorizontal: 3,
    },
    iconReverse: {
        marginHorizontal: 7,
    },
    iconReverseCompact: {
        marginHorizontal: 3,
    },
    /* eslint-enable react-native/no-unused-styles */
    label: {
        textAlign: 'center',
        letterSpacing: 1,
        marginHorizontal: 7,
        marginVertical: 7,
    },
    compactLabel: {
        marginHorizontal: 8,
    },
    uppercaseLabel: {
        textTransform: 'uppercase',
    },
    disabled: {
        pointerEvents: "none",
        opacity: 0.92,
    }
});
Button.displayName = "Button";
/**
 * @constant ButtonContext
 * 
 * A React context that provides the button context values to components within the 
 * component tree. This context is useful for sharing button state and behavior 
 * across different components without prop drilling.
 * 
 * The default value is initialized as an empty object cast to `IButtonContext`, 
 * which should be replaced with a proper context value when the context provider is used.
 */
export const ButtonContext = React.createContext<IButtonContext>({} as IButtonContext);

/**
 * @function useButton
 * 
 * A custom hook that provides access to the button context. This hook allows 
 * components to easily consume the button context values without needing to 
 * use the `ButtonContext.Consumer` component.
 * 
 * @returns {IButtonContext} The current button context value, which includes 
 * methods and properties for managing button state and behavior.
 * 
 * @example
 * // Example of using the useButton hook in a functional component
 * const MyButtonComponent: React.FC = () => {
 *     const buttonContext = useButton(); // Access the button context
 *     
 *     return (
 *         <button onClick={buttonContext.enable}>
 *             {buttonContext.isEnabled() ? 'Enabled' : 'Disabled'}
 *         </button>
 *     );
 * };
 */
export const useButton = () => React.useContext(ButtonContext) || {};


export * from "./types";