"use client";
import { useState, useImperativeHandle, useEffect, useRef } from 'react';
//import { FormsManager } from '@components/Form/FormsManager';
import { Animated, GestureResponderEvent } from 'react-native';
import iconVariants from "@variants/icon";
import { ActivityIndicator } from '@components/ActivityIndicator';
import { Surface } from '@components/Surface';
import { Text } from '@html/Text';
import { IButtonProps, IButtonContext } from './types';
import { defaultStr, isNonNullString, uniqid } from '@resk/core/utils';
import Auth from "@resk/core/auth";
import isValidElement from '@utils/isValidElement';
import { Divider } from '@components/Divider';
import { cn } from '@utils/cn';
import { Icon } from '@components/Icon';
import { Div } from '@html/Div';
import buttonVariant from "@variants/button";
import { Platform, StyleSheet } from 'react-native';
import { useGetRippleContent } from './ripple';


/**
 * A button component that can be used to handle user interactions. It can be used to wrap any type of content
 * and provides a way to customize the appearance and behavior of the button. The component also supports
 * accessibility features and can be used with React Native's built-in accessibility features.
 *
 * @typedef {{}} IButtonProps
 * @typedef {{}} IButtonContext
 * @typedef {import('@theme/types').ITheme} ITheme
 *
 * @param {IButtonProps} props - The properties for the button component.
 * @returns {JSX.Element} The button component.
 */
export function Button<IButtonExtendContext = any>({
    disabled: customDisabled,
    isLoading: customIsLoading,
    icon: iconProp,
    rippleColor,
    children,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    testID,
    accessible,
    labelClassName,
    contentClassName,
    leftContainerClassName,
    rightContainerClassName,
    iconPosition,
    iconProps,
    containerClassName,
    label,
    disableRipple,
    id,
    left,
    right,
    dividerClassName,
    divider: customDivider,
    context: extendContext,
    onPress,
    submitFormOnPress,
    formName,
    resourceName,
    perm,
    ref,
    className,
    android_ripple,
    activityIndicatorClassName,
    variant,
    rippleOpacity,
    rippleDuration,
    rippleClassName,
    ...rest
}: IButtonProps<IButtonExtendContext>) {
    testID = defaultStr(testID, "resk-button");
    const [isLoading, _setIsLoading] = useState(typeof customIsLoading == "boolean" ? customIsLoading : false);
    const [isDisabled, setIsDisabled] = useState(typeof customDisabled == "boolean" ? customDisabled : false);
    const idRef = useRef<string>(defaultStr(id, uniqid("button-id-")));
    if (isNonNullString(id) && id !== idRef.current) {
        idRef.current = id;
    }
    const buttonId = idRef.current;
    const disabled: boolean = isDisabled || isLoading;
    const divider = customDivider === true;
    const bVariant = buttonVariant(variant);
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
    useEffect(() => {
        if (typeof customDisabled == "boolean") {
            setIsDisabled(customDisabled);
        }
    }, [customDisabled]);
    useEffect(() => {
        if (typeof customIsLoading == "boolean") {
            setIsLoading(customIsLoading);
        }
    }, [customIsLoading]);
    const context = {
        enable,
        disable,
        isEnabled,
        get id() { return idRef.current },
        setIsLoading,
        ...Object.assign({}, extendContext)
    }
    // Expose methods using useImperativeHandle
    useImperativeHandle(ref, () => (context as any));

    const isElevationEntitled = !disabled;
    const initialElevation = 1;

    const { current: elevation } = useRef<Animated.Value>(
        new Animated.Value(isElevationEntitled ? initialElevation : 0)
    );

    useEffect(() => {
        elevation.setValue(isElevationEntitled ? initialElevation : 0);
    }, [isElevationEntitled, elevation, initialElevation]);

    const iconSize = 18;
    iconProps = Object.assign({}, iconProps);
    const labelVariant = variant?.color && buttonVariant({ color: variant?.color });
    iconProps.className = cn(labelVariant?.label?.(), iconProps?.variant && iconVariants(iconProps.variant), iconProps.className);
    const icon = Icon.getIcon({ icon: iconProp, size: iconSize, ...iconProps, variant: undefined });
    const iconContent = icon && isLoading !== true ? icon : null;

    useEffect(() => {
        /*  if (isNonNullString(formName)) {
             FormsManager.mountAction(context, formName);
         }
         return () => {
             FormsManager.unmountAction(context.id, formName);
         }; */
    }, [formName, idRef.current, context.id]);
    const hasRightContent = isValidElement(right) && !!right;
    const rowClassName = "flex flex-row items-center self-center justify-center";
    const aRipple = Object.assign({}, android_ripple);
    const isRippleDisabled = disableRipple || disabled || Platform.OS === 'android';
    const rProps = isRippleDisabled ? {} : { android_ripple: { color: rippleColor || undefined, ...aRipple } };
    const { rippleContent, startRipple } = useGetRippleContent({
        rippleColor: defaultStr(rProps?.android_ripple?.color) || undefined,
        rippleOpacity, rippleDuration,
        disabled,
        testID,
        disableRipple: !!isRippleDisabled,
        rippleClassName: cn(rippleClassName, bVariant?.ripple?.()),
    });
    if (perm !== undefined && !Auth.isAllowed(perm)) return null;
    return (<>
        <Surface
            role="none"
            {...rest}
            {...rProps}
            id={buttonId}
            testID={`${testID}`}
            ref={ref}
            className={cn("relative", bVariant?.base?.(), className)}
            onPress={(event: GestureResponderEvent) => {
                if (typeof startRipple === "function") {
                    startRipple(event);
                }
                const form = null;//formName ? FormsManager.getForm(formName) : null;
                const hasForm = false;//form && (form as any).isValid();
                const context2: IButtonContext<IButtonExtendContext> = context as IButtonContext<IButtonExtendContext>;
                if (hasForm && typeof (form as any).getData == "function") {
                    (context2 as any).formData = (form as any).getData();
                }
                const r = typeof onPress === 'function' ? onPress(event, context2) : true;
                if (r === false || submitFormOnPress === false) return;
                if (form && typeof (form as any)?.submit === 'function') {
                    (form as any).submit();
                }
                return r
            }}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ disabled }}
            accessible={accessible}
            disabled={disabled}
        >
            <Div id={`${buttonId}-content`} testID={testID + "-button-content"} className={cn("button-contain flex flex-row items-center self-center", bVariant?.content?.(), contentClassName)}>
                <Div className={cn("button-left-container", rowClassName, bVariant?.leftContainer?.(), leftContainerClassName)} testID={testID + "-button-left-container"}>
                    {iconPosition != "right" ? iconContent : null}
                    {isLoading ? (
                        <ActivityIndicator
                            size={iconProps?.size || "small"}
                            className={cn(activityIndicatorClassName)}
                            testID={testID + "-button-activity-indicator"}
                        />
                    ) : null}
                    {left}
                    <Text
                        id={`${buttonId}-label`}
                        selectable={false}
                        numberOfLines={1}
                        testID={`${testID}-button-label`}
                        className={cn(bVariant?.label?.(), labelClassName)}
                    >
                        {isValidElement(children, true) && children || label}
                    </Text>
                </Div>
                {(hasRightContent) ? <Div testID={testID + "-right-content-wrapper"} id={`${buttonId}-right-content-wrapper`} className={cn("button-right-container", rowClassName, bVariant?.rightContainer?.(), rightContainerClassName)}>
                    {iconPosition == "right" ? iconContent : null}
                    {right}
                </Div> : null}
            </Div>
            {rippleContent}
        </Surface>
        {divider ? <Divider id={buttonId + "-divider"} testID={testID + "-button-divider"} className={cn("button-divider", dividerClassName)} /> : null}
    </>);
};

Button.displayName = "Button";

export * from "./types";