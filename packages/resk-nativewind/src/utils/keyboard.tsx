"use client";
import { useState, useEffect } from "react";
import { Keyboard, type KeyboardEvent } from 'react-native';

const EVENT_TYPE = {
    // Only keyboardDidShow and keyboardDidHide events are available on Android with 1 exception: https://reactnative.dev/docs/keyboard#addlistener
    didShow: { show: 'keyboardDidShow', hide: 'keyboardDidHide' },
    willShow: { show: 'keyboardWillShow', hide: 'keyboardWillHide' },
} as const;


/**
 * React hook that tracks the state of the keyboard.
 *
 * @param options An object with a single property, `eventType`, which is the type of keyboard event to listen for. The default is `'didShow'`, which listens for `'keyboardDidShow'` and `'keyboardDidHide'` events.
 *
 * @returns An object with three properties: `isKeyboardVisible` (a boolean indicating whether the keyboard is currently visible), `keyboardHeight` (the height of the keyboard in pixels), and `dismissKeyboard` (a function that will dismiss the keyboard if it is visible).
 * @remarks
 * This is an original copy from https://github.com/mrzachnugent/react-native-reusables/blob/main/packages/reusables/src/lib/keyboard.tsx
 * @returns {IUseKeyboardResult}
*/
export function useKeyboard({ eventType = 'didShow' }: { eventType?: keyof typeof EVENT_TYPE } = { eventType: 'didShow' }): IUseKeyboardResult {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    useEffect(() => {
        const showListener = Keyboard.addListener(EVENT_TYPE[eventType].show, (e: KeyboardEvent) => {
            setKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideListener = Keyboard.addListener(EVENT_TYPE[eventType].hide, () => {
            setKeyboardVisible(false);
            setKeyboardHeight(0);
        });

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    function dismissKeyboard() {
        Keyboard.dismiss();
        setKeyboardVisible(false);
    }
    return {
        isKeyboardVisible,
        keyboardHeight,
        dismissKeyboard,
    };
}

export interface IUseKeyboardResult {
    isKeyboardVisible: boolean;
    keyboardHeight: number;
    dismissKeyboard: Function;
}