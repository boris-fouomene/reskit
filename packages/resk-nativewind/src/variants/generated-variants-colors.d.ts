
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon",string>>;
        icon : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        divider : Record<IName,string>;
        heading : Record<IName,string>;
        text : Record<IName,string>;
        ripple : {
            color : Record<IName,string>;
            compoundVariants : Array<{
                color : IName;
                effect : 'material' | 'strong';
                class : string;
            }>;
        }
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any as IVariantsGeneratedColors;
    