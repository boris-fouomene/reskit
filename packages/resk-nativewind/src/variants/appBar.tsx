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
        ...VariantsOptionsFactory.createTextVariants<IAppBarVariantSlot, "title">((value, colorName) => {
            return {
                title: value,
            }
        }, "title"),
        ...VariantsOptionsFactory.createTextVariants<IAppBarVariantSlot, "subtitle">((value, colorName) => {
            return { subtitle: value }
        }, "subtitle"),
        ...VariantsOptionsFactory.createTextVariants<IAppBarVariantSlot, "action">((value, colorName) => {
            return { action: value }
        }, "action"),
        ...VariantsOptionsFactory.createIconVariants<IAppBarVariantSlot, "icon">((value, colorName) => {
            return { icon: value }
        }, "icon"),
        ...VariantsOptionsFactory.createAllOpacity<IAppBarVariantSlot, "title">((value, colorName) => {
            return { title: value }
        }, "title"),
        ...VariantsOptionsFactory.createAllOpacity<IAppBarVariantSlot, "subtitle">((value, colorName) => {
            return { subtitle: value }
        }, "subtitle"),
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
        subtitleOpacity: 80,
    }
});

export type IAppBarVariant = VariantProps<typeof appBarVariant>;

type IAppBarVariantSlot = {
    base?: string;
    title?: string;
    subtitle?: string;
    action?: string;
    icon?: string;
    actionMenuItem?: string;
    content?: string;
}