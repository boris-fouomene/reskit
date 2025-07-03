import { tv, type VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { IconSizes } from "./variantsFactory/textSizes";
const icon = tv({
    variants: {
        color: VariantsColors.icon,
        size: IconSizes,
    }
});

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;