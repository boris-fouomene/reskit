import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

/**
 * Hook to track the state of the keyboard.
 * 
 * @returns An object containing the current state of the keyboard, including whether it is visible and the last keyboard event.
 * 
 * @example
 * const { event, visible } = useKeyboardState();
 * console.log(visible); // Output: true or false
 * console.log(event); // Output: KeyboardEvent object or undefined
 */
export const useKeyboardState = (): { event?: KeyboardEvent, visible: boolean } => {
    const [state, setState] = useState<{ event?: KeyboardEvent, visible: boolean }>({
        visible: Keyboard.isVisible(),
        event: undefined
    })
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
            (event: KeyboardEvent) => {
                setState({
                    event,
                    visible: true,
                })
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
            (event: KeyboardEvent) => {
                setState({
                    event,
                    visible: false,
                })
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    return state;
}