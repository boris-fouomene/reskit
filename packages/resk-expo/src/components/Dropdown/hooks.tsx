import { createContext, useContext } from "react";
import { IDropdownContext } from "./types";
export const MIN_HEIGHT = 200;

export const DropdownContext = createContext<IDropdownContext<any, any>>({} as IDropdownContext<any, any>);

export function useDropdown<ItemType = any, ValueType = any>(): IDropdownContext<ItemType, ValueType> {
    const context = useContext(DropdownContext);
    return context || {} as IDropdownContext<ItemType, ValueType>;
};