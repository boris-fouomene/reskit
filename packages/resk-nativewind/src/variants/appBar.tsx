import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";
import { IVariantsColors } from "./colors";
import { cn } from "@utils/cn";

const appBar = tv({
    slots: {
        base: "",
        title: "",
        subtitle: "",
        action: "",
        actionMenuItem: "",
        icon : "",
    },
    variants: {
        colorScheme : Object.fromEntries(Object.entries(VariantsGeneratedColors.surface).map(([key, value]) => {
            return [key, {
                base: value,
                title: (VariantsGeneratedColors.color as any)[key],
                subtitle : cn((VariantsGeneratedColors.color as any)[key],"opacity-95"),
                action : cn((VariantsGeneratedColors.color as any)[key]),
                icon : cn((VariantsGeneratedColors.icon as any)[key]),
            }]
        })) as Record<IVariantsColors.ColorName, { base: string, title: string, subtitle: string, action: string, icon: string }>,
        ...VariantsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        })
    },
    defaultVariants: {
        colorScheme: "surface",
        shadow: "md",
        shadowColor: "surface",
    }
});

export default appBar;

export type IVariantPropsAppBar = VariantProps<typeof appBar>;
