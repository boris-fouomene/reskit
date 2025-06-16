
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "ripple" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "ripple" | "activityIndicator",string>>;
        icon : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        divider : Record<IName,string>;
        heading : Record<IName,string>;
        text : Record<IName,string>;
        shadow : Record<IName,string>;
        activityIndicator: Record<IName,string>;
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any;
    