import { tv, type VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./colors/generated";
import { IconSizes } from "./variantsFactory/textSizes";
const icon = tv({
    variants: {
        color: VariantsGeneratedColors.textWithForegroundWithImportant,
        size: IconSizes,
    }
});

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;