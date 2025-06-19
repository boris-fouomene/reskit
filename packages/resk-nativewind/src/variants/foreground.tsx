import {tv, type VariantProps} from 'tailwind-variants';
import {VariantsGeneratedColors} from './generated-variants-colors';

const foreground = tv({
    variants: {
        color: VariantsGeneratedColors.foreground,
    }
});

export default foreground;

export type IVariantPropsForeground = VariantProps<typeof foreground>;