"use client";
import { useImperativeHandle, useEffect, useId } from 'react';
//import { FormsManager } from '@components/Form/FormsManager';
import { GestureResponderEvent } from 'react-native';
import { ButtonBase } from './base';
import { IButtonContext, IButtonProps } from './types';
import { defaultStr } from '@resk/core/utils';
import useStateCallback from '@utils/stateCallback';
import { buttonVariant } from "@variants/button";


export function InteractiveButton<Context = unknown>({
    disabled: customDisabled,
    loading: customIsLoading,
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
    context: customContext,
    ...rest
}: IButtonProps<Context>) {
    const [isLoading, _setIsLoading] = useStateCallback(typeof customIsLoading == "boolean" ? customIsLoading : false);
    const [isDisabled, setIsDisabled] = useStateCallback(typeof customDisabled == "boolean" ? customDisabled : false);
    const uId = useId();
    const buttonId = defaultStr(id, uId);
    testID = defaultStr(testID, "resk-button-interactive");
    const disabled: boolean = isDisabled || isLoading;
    const disable = (cb?: () => void) => { setIsDisabled(true, cb); },
        enable = (cb?: () => void) => {
            setIsDisabled(false, cb);
        },
        isEnabled = () => {
            return !!!isDisabled;
        },
        setIsLoading = (customIsLoading: boolean, cb?: (isLoading: boolean) => void) => {
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
    const context: IButtonContext<Context> = {
        ...Object.assign({}, extendContext),
        enable,
        disable,
        isEnabled,
        loading: isLoading,
        computedVariant: buttonVariant(rest.variant),
        disabled,
        get id() { return buttonId },
        setIsLoading,
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

    return (<ButtonBase<Context>
        {...rest}
        context={Object.assign({}, customContext, context)}
        disabled={disabled}
        loading={isLoading}
        id={buttonId}
        testID={`${testID}`}
        ref={ref}
        onPress={(event: GestureResponderEvent, context) => {
            const form = null;//formName ? FormsManager.getForm(formName) : null;
            const hasForm = false;//form && (form as any).isValid();
            if (hasForm && typeof (form as any).getData == "function") {
                context.formData = (form as any).getData();
            }
            const r = typeof onPress === 'function' ? onPress(event, context) : true;
            if (r === false || submitFormOnPress === false) return;
            if (form && typeof (form as any)?.submit === 'function') {
                (form as any).submit();
            }
            return r
        }}
    />);
};

InteractiveButton.displayName = "Button.Interactive";
