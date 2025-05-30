"use client";
import { useEffect, useRef } from "react";
import BackHandler from "./BackHandler";

/**
 * Hook to handle the back button press event on Android.
 * 
 * This hook provides a way to handle the back button press event in a React Native application.
 * It returns an object with methods to add and remove the event listener.
 * 
 * @param {() => boolean | null | undefined} handler - The function to call when the back button is pressed.
 * @returns {{ addEventListener: () => void, removeEventListener: () => void }} An object with methods to add and remove the event listener.
 */
export function useBackHandler(handler: () => boolean | null | undefined) {
    const subscription = useRef<{ remove: () => void }>(null);
    const addEventListener = () => {
        (subscription as any).current = BackHandler.addEventListener('hardwareBackPress', handler);
    }
    const removeEventListener = () => {
        if (typeof subscription.current?.remove == "function") {
            subscription.current.remove();
        } else {
            BackHandler.removeEventListener('hardwareBackPress', handler);
        }
    };
    useEffect(() => {
        addEventListener();
        return removeEventListener;
    }, [handler]);
    useEffect(() => {
        return removeEventListener;
    }, []);
    return {
        addEventListener,
        removeEventListener
    }
}