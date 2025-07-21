
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    type IName2Foreground = IVariantsColors.ColorName2Foreground;
    type IForegroundName = IVariantsColors.ForegroundColorName;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        surface : Record<IName,string>;
        badge : Record<IName,string>;
        icon : Record<IName2Foreground,string>;
        hoverIcon : Record<IName2Foreground,string>;
        activeIcon : Record<IName2Foreground,string>;
        text : Record<IName2Foreground ,string>;
        hoverText : Record<IName2Foreground ,string>;
        activeText : Record<IName2Foreground ,string>;
        background : Record<IName,string>;
        hoverBackground : Record<IName,string>;
        activeBackground : Record<IName,string>;
        textForeground : Record<IForegroundName,string>;
        hoverTextForeground : Record<IForegroundName,string>;
        activeTextForeground : Record<IForegroundName,string>;
        iconForeground : Record<IForegroundName,string>;
        hoverIconForeground : Record<IForegroundName,string>;
        activeIconForeground : Record<IForegroundName,string>;
        shadow : Record<IName,string>;
        hoverShadow : Record<IName,string>;
        activeShadow : Record<IName,string>;
        activityIndicator: Record<IName2Foreground,string>;
        outlineColor : Record<IName2Foreground,string>;
        hoverOutlineColor : Record<IName2Foreground,string>;
        activeOutlineColor : Record<IName2Foreground,string>;
        borderColor : Record<IName2Foreground,string>;
        hoverBorderColor : Record<IName2Foreground,string>;
        activeBorderColor : Record<IName2Foreground,string>;
        borderTopColor : Record<IName2Foreground,string>;
        borderBottomColor : Record<IName2Foreground,string>;
        borderLeftColor : Record<IName2Foreground,string>;
        borderRightColor : Record<IName2Foreground,string>;
        ringColors : Record<IName2Foreground,string>;
        hoverRingColors: Record<IName2Foreground,string>;
        activeRingColors: Record<IName2Foreground,string>;
        focusRingColors: Record<IName2Foreground,string>;
        fillColor:Record<IName2Foreground,string>;
    }
export const VariantsColors : IVariantsGeneratedColors = {} as any;
    