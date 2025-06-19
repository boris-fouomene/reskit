import { tv, type VariantProps } from 'tailwind-variants';
import { VariantsGeneratedColors } from './generated-variants-colors';

const color = tv({
    variants : {
        color : VariantsGeneratedColors.color, 
    }
})

export default color;

export type IVariantPropsColor = VariantProps<typeof color>;