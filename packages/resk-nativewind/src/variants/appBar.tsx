import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./colors/generated";
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
        icon: "",
        content: "",//the content of the appBar
    },
    variants: {
        colorScheme: Object.fromEntries(Object.entries(VariantsGeneratedColors.surface).map(([key, value]) => {
            return [key, {
                base: value,
                title: (VariantsGeneratedColors.textForeground as any)[key],
                subtitle: cn((VariantsGeneratedColors.textForeground as any)[key], "opacity-95"),
                action: cn((VariantsGeneratedColors.textForeground as any)[key]),
                icon: cn((VariantsGeneratedColors.iconForeground as any)[key]),
            }]
        })) as Record<IVariantsColors.ColorName, { base: string, title: string, subtitle: string, action: string, icon: string }>,
        ...VariantsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        })
    },
    defaultVariants: {
        shadow: "md",
        shadowColor: "surface",
    }
});

export default appBar;

export type IVariantPropsAppBar = VariantProps<typeof appBar>;
