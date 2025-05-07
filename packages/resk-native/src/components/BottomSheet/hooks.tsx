import { createContext, useContext } from "react";
import { IBottomSheetContext } from "./utils";

/**
 * A context for the bottom sheet component.
 * 
 * This context provides a way to access the bottom sheet's context from anywhere in the component tree.
 * 
 * @type {React.Context<IBottomSheetContext>}
 */
export const BottomSheetContext = createContext<IBottomSheetContext>({} as IBottomSheetContext);

/**
 * A hook that provides access to the bottom sheet's context.
 * 
 * This hook returns the bottom sheet's context, or an empty object if the context is not available.
 * 
 * @returns {IBottomSheetContext} The bottom sheet's context.
 */
export const useBottomSheet = () => {
    const context = useContext(BottomSheetContext);
    return context || {}
}