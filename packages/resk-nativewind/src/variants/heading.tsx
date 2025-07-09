import { tv, type VariantProps } from 'tailwind-variants'
import { VariantsOptionsFactory } from './variantsFactory';
import { textVariants } from './variantsFactory/text2icons';

export const headingVariant = tv({
    base: '',
    variants: {
        ...VariantsOptionsFactory.createAll(),
        level: {
            h1: 'text-4xl font-bold',
            h2: 'text-3xl font-semibold',
            h3: 'text-2xl font-semibold',
            h4: 'text-xl font-medium',
            h5: 'text-lg font-medium',
            h6: 'text-base font-normal',
        },
        ...textVariants
    },
    defaultVariants: {},
})

export type IHeadingVariant = VariantProps<typeof headingVariant>;