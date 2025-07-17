"use client";
import { useImperativeHandle, useEffect, useId } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button } from './base';
import { IButtonInteractiveContext, IButtonInteractiveProps } from './types';
import { defaultStr } from '@resk/core/utils';
import useStateCallback from '@utils/stateCallback';
import { buttonVariant } from "@variants/button";
import { cn } from '@utils/cn';



export function InteractiveButton<Context = unknown>({
    disabled: customDisabled,
    loading: customIsLoading,
    id,
    onPress,
    resourceName,
    perm,
    ref,
    testID,
    context: customContext,
    className,
    ...rest
}: IButtonInteractiveProps<Context>) {
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
    const context: IButtonInteractiveContext<Context> = {
        ...Object.assign({}, customContext),
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

    return (<Button<IButtonInteractiveContext<Context>>
        {...rest}
        className={cn("resk-button-interactive btn-interactive", className)}
        context={Object.assign({}, customContext, context)}
        disabled={disabled}
        loading={isLoading}
        id={buttonId}
        testID={`${testID}`}
        ref={ref}
        onPress={(event: GestureResponderEvent, context) => {
            return typeof onPress === 'function' ? onPress(event, context) : true;
        }}
    />);
};

InteractiveButton.displayName = "Button.Interactive";
