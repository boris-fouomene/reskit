import { tv, type VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { iconSizes } from "./variantsFactory/iconSizes";
const icon = tv({
    variants: {
        color: VariantsGeneratedColors.icon,
        size: iconSizes,
    }
});

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;