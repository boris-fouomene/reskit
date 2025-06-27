
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
        text : Record<IName,string>;
        textWithImportant : Record<IName,string>;
        textWithForegroundWithImportant : Record<IName2Foreground,string>;
        textForegroundWithImportant: Record<IName,string>;
        textWithForeground : Record<IName2Foreground ,string>;
        background : Record<IName,string>;
        textForeground : Record<IName,string>;
        shadow : Record<IName,string>;
        activityIndicator: Record<IName2Foreground,string>;
        borderColor : Record<IName2Foreground,string>;
        borderTopColor : Record<IName2Foreground,string>;
        borderBottomColor : Record<IName2Foreground,string>;
        borderLeftColor : Record<IName2Foreground,string>;
        borderRightColor : Record<IName2Foreground,string>;
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any;
    