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
        actionOnAppBar: "",
        actionOnMenu: "",
        backAction: "",
        actions: "",
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
        ...VariantsOptionsFactory.createIconVariants<IAppBarVariantSlot, "icon">((value, colorName) => {
            return { icon: value }
        }, "icon"),
        ...VariantsOptionsFactory.createIconVariants<IAppBarVariantSlot, "backAction">((value, colorName) => {
            return { backAction: value }
        }, "backAction"),
        ...VariantsOptionsFactory.createAllOpacity<IAppBarVariantSlot, "title">((value, colorName) => {
            return { title: value }
        }, "title"),
        ...VariantsOptionsFactory.createAllOpacity<IAppBarVariantSlot, "subtitle">((value, colorName) => {
            return { subtitle: value }
        }, "subtitle"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IAppBarVariantSlot, "actions">((value, colorName) => {
            return { actions: value }
        }, "actions"),
        ...VariantsOptionsFactory.createAllFlex<IAppBarVariantSlot, "actions">((value, colorName) => {
            return { actions: value }
        }, "actions"),
        ...VariantsOptionsFactory.createAllGaps<IAppBarVariantSlot, "actions">((value) => {
            return { actions: value }
        }, "actions"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IAppBarVariantSlot, "actionOnAppBar">((value, colorName) => {
            return { actionOnAppBar: value }
        }, "actionOnAppBar"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IAppBarVariantSlot, "actionOnMenu">((value, colorName) => {
            return { actionOnMenu: value }
        }, "actionOnMenu"),
        ...VariantsOptionsFactory.createAllRounded<IAppBarVariantSlot, "actionOnAppBar">((value, colorName) => {
            return { actionOnAppBar: value }
        }, "actionOnAppBar"),
        ...VariantsOptionsFactory.createAllRounded<IAppBarVariantSlot, "actionOnMenu">((value, colorName) => {
            return { actionOnMenu: value }
        }, "actionOnMenu"),
        ...VariantsOptionsFactory.createAllBorders<IAppBarVariantSlot, "actionOnAppBar">((value, colorName) => {
            return { actionOnAppBar: value }
        }, "actionOnAppBar"),
        colorScheme: Object.fromEntries(typedEntries(VariantsColors.surface).map(([key, value]) => {
            return [key, {
                base: value,
                title: (VariantsColors.textForeground as any)[key],
                subtitle: cn((VariantsColors.textForeground as any)[key], "opacity-95"),
                actionOnAppBar: cn((VariantsColors.textForeground as any)[key]),
                icon: cn((VariantsColors.iconForeground as any)[key]),
                backAction: cn((VariantsColors.iconForeground as any)[key]),
            }]
        })) as Record<IVariantsColors.ColorName, IAppBarVariantSlot>,
    },
    defaultVariants: {
        titleSize: "lg",
        titleWeight: "medium",
        subtitleSize: "sm",
        subtitleOpacity: 80,
        actionsGapX: 2,
        paddingX: 2
    }
});

export type IAppBarVariant = VariantProps<typeof appBarVariant>;

type IAppBarVariantSlot = {
    base?: string;
    title?: string;
    subtitle?: string;
    icon?: string;
    content?: string;
    actions?: string;
    backAction?: string;
    actionOnAppBar?: string;
    actionOnMenu?: string;
}