
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "ripple" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "ripple" | "activityIndicator",string>>;
        icon : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        color : Record<IName,string>;
        background : Record<IName,string>;
        shadow : Record<IName,string>;
        activityIndicator: Record<IName,string>;
        borderColor : Record<IName,string>;
        borderTopColor : Record<IName,string>;
        borderBottomColor : Record<IName,string>;
        borderLeftColor : Record<IName,string>;
        borderRightColor : Record<IName,string>;
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any;
    