// heading.ts
import { tv, type VariantProps } from 'tailwind-variants'
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from './variantsFactory';

const heading = tv({
    base: '',
    variants: {
        ...VariantsFactory.createAll(),
        level: {
            h1: 'text-4xl font-bold',
            h2: 'text-3xl font-semibold',
            h3: 'text-2xl font-semibold',
            h4: 'text-xl font-medium',
            h5: 'text-lg font-medium',
            h6: 'text-base font-normal',
        },
        align: VariantsFactory.createTextAlign,
        textSize: VariantsFactory.createTextSizes(),
        weight: VariantsFactory.createFontWeight,
        color: VariantsColors.text,
    },
    defaultVariants: {},
})

export type IVariantPropsHeading = VariantProps<typeof heading>;

export default heading;