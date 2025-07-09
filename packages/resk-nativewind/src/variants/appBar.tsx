import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from "./variantsFactory";
import { IVariantsColors } from "./colors";
import { cn } from "@utils/cn";
import { typedEntries } from "@resk/core/utils";

export const appBarVariant = tv({
    slots: {
        base: "",
        title: "",
        subtitle: "",
        action: "",
        actionMenuItem: "",
        icon: "",
        content: "",//the content of the appBarVariant
    },
    variants: {
        ...VariantsOptionsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        }),
        titleSize: VariantsOptionsFactory.createTextSize((value) => {
            return {
                title: value,
            }
        }),
        titleWeight: VariantsOptionsFactory.createTextWeight((value) => {
            return {
                title: value,
            }
        }),
        titleOpacity: VariantsOptionsFactory.createOpacity((value) => {
            return {
                title: value,
            }
        }),
        hoverTitleOpacity: VariantsOptionsFactory.createHoverOpacity((value) => {
            return {
                title: value,
            }
        }),
        activeTitleOpacity: VariantsOptionsFactory.createActiveOpacity((value) => {
            return {
                title: value,
            }
        }),
        subtitleSize: VariantsOptionsFactory.createTextSize((value) => {
            return {
                subtitle: value,
            }
        }),
        subTitleWeight: VariantsOptionsFactory.createTextWeight((value) => {
            return {
                subtitle: value,
            }
        }),
        subTitleOpacity: VariantsOptionsFactory.createOpacity((value) => {
            return {
                subtitle: value,
            }
        }),
        hoverSubTitleOpacity: VariantsOptionsFactory.createHoverOpacity((value) => {
            return {
                subtitle: value,
            }
        }),
        activeSubTitleOpacity: VariantsOptionsFactory.createActiveOpacity((value) => {
            return {
                subtitle: value,
            }
        }),
        actionTextSize: VariantsOptionsFactory.createTextSize((value) => {
            return {
                action: value,
            }
        }),
        iconColor: VariantsOptionsFactory.createIconColor((value) => {
            return {
                icon: value,
            }
        }),
        iconSize: VariantsOptionsFactory.createIconSize((value) => {
            return {
                icon: value,
            }
        }),
        colorScheme: Object.fromEntries(typedEntries(VariantsColors.surface).map(([key, value]) => {
            return [key, {
                base: value,
                title: (VariantsColors.textForeground as any)[key],
                subtitle: cn((VariantsColors.textForeground as any)[key], "opacity-95"),
                action: cn((VariantsColors.textForeground as any)[key]),
                icon: cn((VariantsColors.iconForeground as any)[key]),
            }]
        })) as Record<IVariantsColors.ColorName, { base: string, title: string, subtitle: string, action: string, icon: string }>,
    },
    defaultVariants: {
        titleSize: "lg",
        titleWeight: "medium",
        subtitleSize: "sm",
        subTitleOpacity: 90
    }
});

export type IAppBarVariant = VariantProps<typeof appBarVariant>;
