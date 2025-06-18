import { ClassValue } from "tailwind-variants";

export const classes: IVariantsClasses = {
    disabled: "pointer-events-none opacity-70 web:cursor-not-allowed",
    readOnly: "pointer-events-none opacity-80 web:cursor-not-allowed",
    hidden: "hidden opacity-0",
    hover: "hover:opacity-80",
    cursorPointed: "cursor-pointer",
    positionFixed : "absolute web:fixed",
}
export interface IVariantsClasses {
    disabled: ClassValue;
    readOnly: ClassValue;
    hidden: ClassValue;
    hover: ClassValue;
    cursorPointed: ClassValue;
    positionFixed: ClassValue;
}

