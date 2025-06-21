import { ClassValue } from "tailwind-variants";

export const classes: IVariantsClasses = {
    disabled: "pointer-events-none opacity-70 web:cursor-not-allowed",
    readOnly: "pointer-events-none opacity-80 web:cursor-not-allowed",
    hidden: "hidden opacity-0",
    active2hoverState: "hover:opacity-80 active:opacity-75",
    cursorPointed: "cursor-pointer",
    positionFixed: "absolute web:fixed",
    absoluteFill: " absolute web:fixed flex-1 w-screen h-screenleft-0 right-0 top-0 bottom-0",
}
export interface IVariantsClasses {
    disabled: ClassValue;
    readOnly: ClassValue;
    hidden: ClassValue;
    active2hoverState: ClassValue;
    cursorPointed: ClassValue;
    positionFixed: ClassValue;
    absoluteFill: ClassValue;
}

