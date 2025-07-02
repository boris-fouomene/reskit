import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
import { IVariantsColors } from "./colors";
import { cn } from "@utils/cn";
import { typedEntries } from "@resk/core/utils";

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
        colorScheme: Object.fromEntries(typedEntries(VariantsColors.surface).map(([key, value]) => {
            return [key, {
                base: value,
                title: (VariantsColors.textForeground as any)[key],
                subtitle: cn((VariantsColors.textForeground as any)[key], "opacity-95"),
                action: cn((VariantsColors.textForeground as any)[key]),
                icon: cn((VariantsColors.iconForeground as any)[key]),
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
