import { tv, type VariantProps } from 'tailwind-variants';
import { VariantsColors } from './colors/generated';

const background = tv({
    variants: {
        background: VariantsColors.background,
    }
})

export default background;

export type IVariantPropsBackground = VariantProps<typeof background>;