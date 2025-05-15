import { tv, type VariantProps } from "tailwind-variants";
import iconButton from "./iconButton";
export const avatar = tv({
    extend: iconButton,
    slots: {
        text: "text-sm",
    },
    variants: {
        color: {
            primary: {
                text: "text-primary-foreground dark:text-dark-primary-foreground",
            },
            secondary: {
                text: "text-secondary-foreground dark:text-dark-secondary-foreground",
            },
            accent: {
                text: "text-accent-foreground dark:text-dark-accent-foreground",
            },
            neutral: {
                text: "text-neutral-foreground dark:text-dark-neutral-foreground",
            },
            info: {
                text: "text-info-foreground dark:text-dark-info-foreground",
            },
            success: {
                text: "text-success-foreground dark:text-dark-success-foreground",
            },
            warning: {
                text: "text-warning-foreground dark:text-dark-warning-foreground",
            },
            error: {
                text: "text-error-foreground dark:text-dark-error-foreground",
            },
        },
        textSize: {
            xs: {
                text: "text-xs"
            },
            sm: {
                text: "text-sm"
            },
            md: {
                text: "text-md"
            },
            lg: {
                text: "text-lg"
            },
            xl: {
                text: "text-xl"
            },
            "2xl": {
                text: "text-2xl"
            },
            "3xl": {
                text: "text-3xl"
            },
            "4xl": {
                text: "text-4xl"
            },
            "5xl": {
                text: "text-5xl"
            },
            "6xl": {
                text: "text-6xl"
            },
            "7xl": {
                text: "text-7xl"
            },
            "8xl": {
                text: "text-8xl"
            },
            "9xl": {
                text: "text-9xl"
            },
        }
    }
});
export type IVariantPropsAvatar = VariantProps<typeof avatar>;

export default avatar;