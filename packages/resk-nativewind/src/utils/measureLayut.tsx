"use client";
import { Dimensions, View } from "react-native";
import { isNumber } from "@resk/core/utils";
import { RefObject } from "react";

/**
 * Determines the location of the given view in the window and resolve the values. 
 * 
 * This function returns a promise that resolves with the layout coordinates
 * of the component in the window.
 * 
 * @param {React.RefObject<View>} ref - The reference to the component to measure.
 * @returns {Promise<{ x: number, y: number, width: number, height: number }>} A promise that resolves with the layout coordinates.
 */
export const measureInWindow = (ref: React.RefObject<View | null | undefined>): Promise<{ x: number, y: number, width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        try {
            const _ref = ref && ref?.current && typeof ref?.current?.measureInWindow === 'function' ? ref.current : undefined;
            if (_ref) {
                /**
                 * Measures the layout of the component.
                 * 
                 * This function calls the `measureInWindow` method of the component's ref.
                 * 
                 * @param {number} x The x-coordinate of the component.
                 * @param {number} y The y-coordinate of the component.
                 * @param {number} width The width of the component.
                 * @param {number} height The height of the component.
                 */
                return _ref.measureInWindow((x: number, y: number, width: number, height: number) => {
                    if (isNumber(x) && isNumber(y) && isNumber(width) && isNumber(height)) {
                        resolve({ x, y, width, height });
                    } else {
                        reject({ message: "Invalid layout result" });
                    }
                });
            }
        } catch (e) {
            reject({ message: "Invalid ref object" });
            return;
        }
        reject({ message: "measureInWindow is not supported on this platform" });
    });
};

/**
 * Measures the layout of a React Native {@link View} component and returns its position and size relative to its parent and the screen.
 *
 * This utility function wraps the native `measure` method in a Promise, making it easier to use with async/await patterns.
 * It is useful for determining the exact position and dimensions of a component, for example, when implementing custom tooltips,
 * popovers, or drag-and-drop features.
 *
 * @param ref - A React ref object pointing to a {@link View} (or compatible) component to be measured. The ref must be attached to a rendered component that supports the `measure` method.
 *
 * @returns A Promise that resolves to an object containing the following properties:
 * - `x`: The X position of the component relative to its parent.
 * - `y`: The Y position of the component relative to its parent.
 * - `width`: The width of the component.
 * - `height`: The height of the component.
 * - `pageX`: The X position of the component relative to the root of the screen.
 * - `pageY`: The Y position of the component relative to the root of the screen.
 *
 * The Promise will reject if the ref is invalid, the component does not support measurement, or the measurement fails.
 *
 * @example
 * ```tsx
 * import { useRef, useEffect } from "react";
 * import { View } from "react-native";
 * import { measureLayout } from "@resk/nativewind/utils/measureInWindow";
 *
 * function Example() {
 *   const viewRef = useRef<View>(null);
 *
 *   useEffect(() => {
 *     measureLayout(viewRef)
 *       .then(layout => {
 *         console.log("Layout:", layout);
 *         // { x, y, width, height, pageX, pageY }
 *       })
 *       .catch(error => {
 *         console.error("Measurement failed:", error);
 *       });
 *   }, []);
 *
 *   return <View ref={viewRef} style={{ width: 100, height: 100 }} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using with async/await
 * const layout = await measureLayout(ref);
 * alert(`Component is at (${layout.pageX}, ${layout.pageY}) with size ${layout.width}x${layout.height}`);
 * ```
 *
 * @remarks
 * - This function is intended for use with React Native components that implement the `measure` method.
 * - If the ref is not attached or the component does not support measurement, the Promise will reject.
 * - For measuring absolute position on the screen, use the `pageX` and `pageY` values.
 *
 * @see {@link https://reactnative.dev/docs/direct-manipulation#measurecallback | React Native: measure}
 * @see {@link measureInWindow}
 *
 * @public
 */
export const measureLayout = (ref: React.RefObject<View | null | undefined>): Promise<{ x: number, y: number, width: number, height: number, pageX: number, pageY: number }> => {
    return new Promise((resolve, reject) => {
        try {
            const _ref = ref && ref?.current && typeof ref?.current?.measure === 'function' ? ref.current : undefined;
            if (_ref) {
                return _ref.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                    if (isNumber(x) && isNumber(y) && isNumber(width) && isNumber(height)) {
                        resolve({ x, y, width, height, pageX, pageY });
                    } else {
                        reject({ message: "Invalid layout result" });
                    }
                });
            }
        } catch (e) {
            reject({ message: "Invalid ref object" });
            return;
        }
        reject({ message: "measureInWindow is not supported on this platform" });
    });
};

/**
 * 
 * Measures the content height of a component to display in the Bottom sheet, based on it's anchor element.
 * 
 * @param {React.RefObject<View>} anchorRef - The reference the anchor element.
 * @param {number} [screenIndent=20] - The screen indentation.
 * @param {boolean} [_measureInWindow=false] - Whether to measure in window or in the anchor element.
 * @returns {Promise<{ x: number, y: number, width: number,pageX?:number,pageY?:number, height: number, contentHeight: number }>} A promise that resolves with the layout coordinates and content height.
 */
export function measureContentHeight(anchorRef: RefObject<View>, minContentHeight: number = 400, _measureInWindow = false): Promise<{ x: number, y: number, width: number, pageX?: number, pageY?: number, height: number, contentHeight: number }> {
    return (_measureInWindow ? measureInWindow : measureLayout)(anchorRef).then((result) => {
        const { height, y } = result;
        const winHeight = Dimensions.get("window").height;
        minContentHeight = typeof minContentHeight == "number" && minContentHeight > 0 ? minContentHeight : 400;
        const contentHeight = Math.max(Math.min(winHeight - y - height, winHeight - 100), minContentHeight);
        return {
            ...result,
            contentHeight: Math.min(contentHeight, winHeight)
        };
    })
}   