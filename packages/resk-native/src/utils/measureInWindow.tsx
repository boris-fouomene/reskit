import { View } from "react-native";
import { isNumber } from "@resk/core/utils";

/**
 * Determines the location of the given view in the window and resolve the values. 
 * 
 * This function returns a promise that resolves with the layout coordinates
 * of the component in the window.
 * 
 * @param {React.RefObject<View>} ref - The reference to the component to measure.
 * @returns {Promise<{ x: number, y: number, width: number, height: number }>} A promise that resolves with the layout coordinates.
 */
export const measureInWindow = (ref: React.RefObject<View|null|undefined>): Promise<{ x: number, y: number, width: number, height: number }> => {
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
