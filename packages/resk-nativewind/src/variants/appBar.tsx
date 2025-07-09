import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
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
        ...VariantsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        }),
        titleSize: VariantsFactory.createTextSize((value) => {
            return {
                title: value,
            }
        }),
        titleWeight: VariantsFactory.createTextWeight((value) => {
            return {
                title: value,
            }
        }),
        titleOpacity: VariantsFactory.createOpacity((value) => {
            return {
                title: value,
            }
        }),
        hoverTitleOpacity: VariantsFactory.createHoverOpacity((value) => {
            return {
                title: value,
            }
        }),
        activeTitleOpacity: VariantsFactory.createActiveOpacity((value) => {
            return {
                title: value,
            }
        }),
        subtitleSize: VariantsFactory.createTextSize((value) => {
            return {
                subtitle: value,
            }
        }),
        subTitleWeight: VariantsFactory.createTextWeight((value) => {
            return {
                subtitle: value,
            }
        }),
        subTitleOpacity: VariantsFactory.createOpacity((value) => {
            return {
                subtitle: value,
            }
        }),
        hoverSubTitleOpacity: VariantsFactory.createHoverOpacity((value) => {
            return {
                subtitle: value,
            }
        }),
        activeSubTitleOpacity: VariantsFactory.createActiveOpacity((value) => {
            return {
                subtitle: value,
            }
        }),
        actionTextSize: VariantsFactory.createTextSize((value) => {
            return {
                action: value,
            }
        }),
        iconColor: VariantsFactory.createIconColor((value) => {
            return {
                icon: value,
            }
        }),
        iconSize: VariantsFactory.createIconSize((value) => {
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
