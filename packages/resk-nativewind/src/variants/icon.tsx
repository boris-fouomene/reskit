import { tv, type VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";
const icon = tv({
    variants: {
        color: VariantsGeneratedColors.color2foregroundWithImportant,
        size: VariantsFactory.createIconSizes(),
    }
});

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;