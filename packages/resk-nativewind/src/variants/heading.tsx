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
        textSize: VariantsFactory.createTextSize(),
        nativeTextSize: VariantsFactory.createNativeTextSize(),
        weight: VariantsFactory.createTextWeight,

        color: VariantsColors.text,
        hoverColor: VariantsFactory.createHoverTextColor(),
        activeColor: VariantsFactory.createActiveTextColor(),

        size: VariantsFactory.createTextSize(),
        nativeSize: VariantsFactory.createNativeTextSize(),

    },
    defaultVariants: {},
})

export type IVariantPropsHeading = VariantProps<typeof heading>;

export default heading;