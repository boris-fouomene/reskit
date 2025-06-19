import { tv, type VariantProps } from 'tailwind-variants';
import { VariantsGeneratedColors } from './generated-variants-colors';

const background = tv({
    variants : {
        background : VariantsGeneratedColors.background, 
    }
})

export default background;

export type IVariantPropsBackground = VariantProps<typeof background>;