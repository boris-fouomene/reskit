"use client";
import { Pressable } from 'react-native';
import { ITouchableRippleProps } from './types';
import { defaultStr } from '@resk/core';
import Platform from "@platform";

const version = parseInt(String(Platform.Version));
const isAndroid = Platform.isAndroid() && (typeof version == "number" ? version >= 21 : true);


export function TouchableRipple({
    children,
    className,
    disabled,
    style,
    rippleColor,
    disableRipple,
    testID,
    rippleDuration,
    shadowEnabled,
    onLayout,
    ref,
    rippleOpacity,
    ...props
}: ITouchableRippleProps) {
    testID = defaultStr(testID, "resk-touchable-ripple");
    const isRippleDisabled = disableRipple || disabled || isAndroid;
    rippleDuration = typeof rippleDuration == "number" && rippleDuration > 0 ? rippleDuration : 500;
    shadowEnabled = typeof shadowEnabled == "boolean" ? shadowEnabled : false;
    rippleOpacity = typeof rippleOpacity == "number" && rippleOpacity > 0 && rippleOpacity <= 1 ? rippleOpacity : 0.9;
    return <Pressable
        ref={ref}
        {...props}
        style={style}
        disabled={disabled}
        android_ripple={
            disableRipple ? undefined : Object.assign({
                color: rippleColor,
                duration: rippleDuration,
                foreground: Platform.OS === 'android' && Platform.Version >= 28 && !!props?.android_ripple?.borderless
            }, props.android_ripple)
        }
        testID={testID}
    >
        {children}
    </Pressable>;
};

export * from "./types";

TouchableRipple.displayName = "TouchableRipple";