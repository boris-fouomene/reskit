// heading.ts
import { tv, type VariantProps } from 'tailwind-variants'
import { VariantsGeneratedColors } from "./generated-variants-colors";

const heading = tv({
    base: '',
    variants: {
        level: {
            h1: 'text-4xl font-bold',
            h2: 'text-3xl font-semibold',
            h3: 'text-2xl font-semibold',
            h4: 'text-xl font-medium',
            h5: 'text-lg font-medium',
            h6: 'text-base font-normal',
        },
        align: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        },
        weight: {
            light: 'font-light',
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
            "400": 'font-400',
            "500": 'font-500',
            "600": 'font-600',
            "700": 'font-700',
        },
        color: VariantsGeneratedColors.heading
    },
    defaultVariants: {},
})

export type IVariantPropsHeading = VariantProps<typeof heading>;

export default heading;