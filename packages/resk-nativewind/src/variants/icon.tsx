import { tv, type VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
const icon = tv({
    variants: {
        color: VariantsGeneratedColors.icon,
        size: {
            xs: "!text-xs",
            sm: "!text-sm",
            md: "!text-md",
            lg: "!text-lg",
            xl: "!text-xl",
            "2xl": "!text-2xl",
            "3xl": "!text-3xl",
            "4xl": "!text-4xl",
            "5xl": "!text-5xl",
            "6xl": "!text-6xl",
            "7xl": "!text-7xl",
            "8xl": "!text-8xl",
            "9xl": "!text-9xl",
            "20px": "!text-[20px]",
            "25px": "!text-[25px]",
            "30px": "!text-[30px]",
            "35px": "!text-[35px]",
            "40px": "!text-[40px]",
            "45px": "!text-[45px]",
            "50px": "!text-[50px]",
        }
    }
});

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;