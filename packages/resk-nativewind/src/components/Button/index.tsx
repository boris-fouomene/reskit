"use client";
import { useImperativeHandle, useEffect, useRef } from 'react';
//import { FormsManager } from '@components/Form/FormsManager';
import { GestureResponderEvent } from 'react-native';
import { ButtonBase } from './base';
import { IButtonContext, IButtonProps } from './types';
import { defaultStr, isNonNullString, uniqid } from '@resk/core/utils';
import { cn } from '@utils/cn';
import { useGetRippleContent } from './ripple';
import Auth from '@resk/core/auth';
import useStateCallback from '@utils/stateCallback';
import buttonVariants from "@variants/button";


export function Button<IButtonExtendContext = any>({
    disabled: customDisabled,
    loading: customIsLoading,
    rippleColor,
    disableRipple,
    id,
    context: extendContext,
    onPress,
    submitFormOnPress,
    formName,
    resourceName,
    perm,
    ref,
    android_ripple,
    rippleClassName,
    testID,
    ...rest
}: IButtonProps<IButtonExtendContext>) {
    const [isLoading, _setIsLoading] = useStateCallback(typeof customIsLoading == "boolean" ? customIsLoading : false);
    const [isDisabled, setIsDisabled] = useStateCallback(typeof customDisabled == "boolean" ? customDisabled : false);
    const buttonId = defaultStr(id, testID, "resk-button-id");
    testID = defaultStr(testID, "resk-button");
    const disabled: boolean = isDisabled || isLoading;
    const disable = (cb?: () => void) => { setIsDisabled(true, cb); },
        enable = (cb?: () => void) => {
            setIsDisabled(false, cb);
        },
        isEnabled = () => {
            return !!!isDisabled;
        },
        setIsLoading = (customIsLoading: boolean, cb?: (isLoading?: boolean) => void) => {
            if (typeof customIsLoading === "boolean") {
                _setIsLoading(customIsLoading, cb);
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
        get id() { return buttonId },
        setIsLoading,
        ...Object.assign({}, extendContext)
    }
    // Expose methods using useImperativeHandle
    useImperativeHandle(ref, () => (context as any));
    useEffect(() => {
        /*  if (isNonNullString(formName)) {
             FormsManager.mountAction(context, formName);
         }
         return () => {
             FormsManager.unmountAction(context.id, formName);
         }; */
    }, [formName, buttonId, context.id]);
    const aRipple = Object.assign({}, android_ripple);
    const isRippleDisabled = disableRipple || disabled;
    const rProps = isRippleDisabled ? {} : { android_ripple: { color: rippleColor || undefined, ...aRipple } };
    rippleClassName = cn(rest?.variant && buttonVariants(rest.variant)?.ripple?.(), rippleClassName);
    const { rippleContent, startRipple } = useGetRippleContent({
        rippleColor,
        disabled,
        testID,
        disableRipple: !!isRippleDisabled,
        rippleClassName,
    });
    if (perm !== undefined && !Auth.isAllowed(perm)) return null;
    return (<ButtonBase
        {...rest}
        {...rProps}
        disableRipple={isRippleDisabled}
        disabled={disabled}
        loading={isLoading}
        id={buttonId}
        testID={`${testID}`}
        ref={ref}
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
        rippleContent={rippleContent}
    />);
};

Button.displayName = "Button";
Button.Base = ButtonBase;

export * from "./base";
export * from "./types";