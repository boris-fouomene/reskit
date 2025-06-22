import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";

const iconButton = tv({
    slots: {
        icon: "!text-surface-foreground dark:!text-dark-surface-foreground",
        container: "bg-surface dark:bg-dark-surface",
        text: "text-surface-foreground dark:text-dark-surface-foreground",
    },
    variants: {
        colorScheme: VariantsGeneratedColors.iconButton,
        size: {
            sm: {
                container: "w-8 h-8",
                icon: "!text-sm",
                text: "text-sm"
            },
            md: {
                container: "w-10 h-10",
                icon: "!text-md",
                text: "text-md"
            },
            lg: {
                container: "w-12 h-12",
                icon: "!text-lg",
                text: "text-lg"
            },
            xl: {
                container: "w-14 h-14",
                icon: "!text-xl",
                text: "text-xl"
            },
            "2xl": {
                container: "w-18 h-18",
                icon: "!text-2xl",
                text: "text-2xl"
            },
            "3xl": {
                container: "w-24 h-24",
                icon: "!text-3xl",
                text: "text-3xl"
            },
            "4xl": {
                container: "w-22 h-22",
                icon: "!text-4xl",
                text: "text-4xl"
            },
            "5xl": {
                container: "w-24 h-24",
                icon: "!text-5xl",
                text: "text-5xl"
            },
            "6xl": {
                container: "w-30 h-30",
                icon: "!text-6xl",
                text: "text-6xl"
            },
            "7xl": {
                container: "w-34 h-34",
                icon: "!text-7xl",
                text: "text-7xl"
            },
            "8xl": {
                container: "w-38 h-38",
                icon: "!text-8xl",
                text: "text-8xl"
            },
            "9xl": {
                container: "w-42 h-42",
                icon: "!text-9xl",
                text: "text-9xl"
            }
        },
        rounded: {
            true: {
                container: "rounded-full",
            },
            false: {
                container: "rounded-none",
            }
        }
    },
    defaultVariants: {
        rounded: true,
    }
});

export default iconButton;

export type IVariantPropsIconButton = VariantProps<typeof iconButton>;
