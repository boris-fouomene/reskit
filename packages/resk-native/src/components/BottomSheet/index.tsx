import { Dimensions, MeasureInWindowOnSuccessCallback, View } from "react-native";
import BottomSheet from "./BottomSheet";
import BottomSheetProvider from "./Provider";
export * from "./BottomSheet";
export * from "./Provider";





/**
 * A function that gets the content height of a component.
 * 
 * This function measures the layout of a component and returns its height.
 * 
 * @param {React.Ref} innerRef A reference to the component to measure.
 * @param {Function} cb A callback function to call with the measurement result.
 * @returns {Promise} A promise that resolves with the measurement result.
 */
export const measureContentHeight = (innerRef: React.RefObject<View>, cb?: (height: number, layout: { x: number, y: number, width: number, height: number }) => void, errorCb?: () => void) => {
    /**
        * The reference to the component to measure.
        * 
        * This can be either a React ref or a React ref's current value.
        */
    const ref = innerRef.current && typeof innerRef.current.measureInWindow == 'function' ? innerRef.current : undefined;
    const cScreenIndent = 20;
    if (ref) {
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
        ref.measureInWindow((x, y, width, height) => {
            /**
             * The measurement result.
             * 
             * This object contains the layout properties of the component.
             */
            const layout = { x, y, width, height };

            /**
             * Calculates the content height of the component.
             * 
             * This function takes into account the y-coordinate and height of the component,
             * as well as the screen indentation.
             */
            if (isNumber(y) && isNumber(height)) {
                const winHeight = Dimensions.get("window").height;
                const rHeight = winHeight - y - height - cScreenIndent;
                if (typeof cb == 'function') {
                    cb(rHeight > 200 ? (rHeight < winHeight - 100 ? rHeight : Math.max(Math.min(rHeight, winHeight - 150), 250)) : 0, layout)
                }
            } else {
                if (typeof errorCb == 'function') {
                    errorCb();
                }
            }
        });
    } else {
    }
};
const isNumber = (x: any) => typeof x === 'number';


type IBottomSheetExported = typeof BottomSheet & {
    Provider: typeof BottomSheetProvider;
    measureContentHeight: typeof measureContentHeight;
}

const BottomSheetExported: IBottomSheetExported = BottomSheet as IBottomSheetExported;
BottomSheetExported.Provider = BottomSheetProvider;
BottomSheetExported.measureContentHeight = measureContentHeight;

export { BottomSheetExported as BottomSheet };