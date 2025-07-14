import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from "./variantsFactory";
import { IVariantsColors } from "./colors";
import { typedEntries } from "@resk/core/utils";
import { iconButtonVariants } from "./variantsFactory/iconButtonVariants";

export const iconButtonVariant = tv({
    slots: {
        icon: "",
        container: "",
        text: "",
    },
    variants: {
        ...VariantsOptionsFactory.createAll<{ icon: string, container: string, text: string }>((value, iconName) => {
            return {
                container: value,
                icon: "",
                text: "",
            }
        }),
        ...iconButtonVariants,
    },
    defaultVariants: {
        rounded: "full",
        colorScheme: "surface",
        activeOpacity: 80
    }
});

export type IIconButtonVariant = VariantProps<typeof iconButtonVariant>;
