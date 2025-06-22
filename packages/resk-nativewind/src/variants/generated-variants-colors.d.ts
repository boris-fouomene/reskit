
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    type IName2Foreground = IVariantsColors.ColorName2Foreground;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        icon : Record<IName,string>;
        iconForeground : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        color : Record<IName,string>;
        colorWithImportant : Record<IName,string>;
        color2foregroundWithImportant : Record<IName2Foreground,string>;
        foregroundWithImportant: Record<IName,string>;
        color2foreground : Record<IName2Foreground ,string>;
        background : Record<IName,string>;
        foreground : Record<IName,string>;
        shadow : Record<IName,string>;
        activityIndicator: Record<IName,string>;
        borderColor : Record<IName,string>;
        borderTopColor : Record<IName,string>;
        borderBottomColor : Record<IName,string>;
        borderLeftColor : Record<IName,string>;
        borderRightColor : Record<IName,string>;
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any;
    