// heading.ts
import { tv, type VariantProps } from 'tailwind-variants'

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
        },
        weight: {
            light: 'font-light',
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
        },
        color: {
            primary: 'text-primary',
            secondary: 'text-secondary',
            muted: 'text-gray-500 dark:text-gray-400',
            white: 'text-white',
            black: 'text-black',
        },
    },
    defaultVariants: {},
})

export type IVariantPropsHeading = VariantProps<typeof heading>;

export default heading;