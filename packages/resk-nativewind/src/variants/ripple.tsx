import { tv, VariantProps } from 'tailwind-variants';
import { VariantsGeneratedColors } from './generated-variants-colors';

const ripple = tv({
    base: 'relative overflow-hidden transition-colors duration-200',
    variants: {
        effect: {
            // Default ripple effect
            default: [
                'before:content-[""]',
                'before:absolute',
                'before:bg-current',
                'before:opacity-20',
                'before:rounded-full',
                'before:scale-0',
                'before:z-0',
                'before:transition-transform',
                'before:duration-500',
                'active:before:scale-[4]',
                'active:before:opacity-0',
            ],

            // Material design inspired ripple effect
            material: [
                'before:content-[""]',
                'before:absolute',
                'before:bg-current',
                'before:opacity-25',
                'before:rounded-full',
                'before:scale-0',
                'before:z-0',
                'before:transition-all',
                'before:duration-700',
                'active:before:scale-[6]',
                'active:before:opacity-0',
            ],

            // Quick ripple effect
            quick: [
                'before:content-[""]',
                'before:absolute',
                'before:bg-current',
                'before:opacity-25',
                'before:rounded-full',
                'before:scale-0',
                'before:z-0',
                'before:transition-all',
                'before:duration-300',
                'active:before:scale-[4]',
                'active:before:opacity-0',
            ],

            // Centered ripple effect
            centered: [
                'before:content-[""]',
                'before:absolute',
                'before:left-1/2',
                'before:top-1/2',
                'before:-translate-x-1/2',
                'before:-translate-y-1/2',
                'before:opacity-20',
                'before:rounded-full',
                'before:scale-0',
                'before:z-0',
                'before:transition-transform',
                'before:duration-500',
                'active:before:scale-[5]',
                'active:before:opacity-0',
            ],

            // Subtle ripple effect
            subtle: [
                'before:content-[""]',
                'before:absolute',
                'before:opacity-10',
                'before:rounded-full',
                'before:scale-0',
                'before:z-0',
                'before:transition-transform',
                'before:duration-400',
                'active:before:scale-[3]',
                'active:before:opacity-0',
            ],

            // Strong ripple effect
            strong: [
                'before:content-[""]',
                'before:absolute',
                'before:opacity-30',
                'before:rounded-full',
                'before:scale-0',
                'before:z-0',
                'before:transition-transform',
                'before:duration-600',
                'active:before:scale-[7]',
                'active:before:opacity-0',
            ],

            // Pulse ripple effect
            pulse: [
                'before:content-[""]',
                'before:absolute',
                'before:opacity-20',
                'before:rounded-full',
                'before:scale-0',
                'before:z-0',
                'before:transition-all',
                'before:duration-1000',
                'active:before:scale-[10]',
                'active:before:opacity-0',
                'before:animate-pulse',
            ],
            // None - disabled ripple effect
            none: '',
        },

        // Color variants for the ripple
        color: {
            ...VariantsGeneratedColors.ripple.color,
        },

        // Opacity variants for the ripple
        opacity: {
            '10': 'before:opacity-10',
            '20': 'before:opacity-20',
            '25': 'before:opacity-25',
            '30': 'before:opacity-30',
            '40': 'before:opacity-40',
            '50': 'before:opacity-50',
        },

        // Speed variants for the ripple
        speed: {
            slow: 'before:duration-700',
            normal: 'before:duration-500',
            fast: 'before:duration-300',
            veryFast: 'before:duration-200',
        },

        // Size variants for the ripple
        size: {
            sm: 'active:before:scale-[2]',
            md: 'active:before:scale-[4]',
            lg: 'active:before:scale-[6]',
            xl: 'active:before:scale-[8]',
            '2xl': 'active:before:scale-[10]',
        },
        // Dark mode specific adjustments
        darkMode: {
            auto: [
                'before:dark:opacity-25',
                'dark:before:duration-600',
            ],
            enhanced: [
                'before:dark:opacity-40',
                'dark:before:duration-700',
            ],
            reduced: [
                'before:dark:opacity-15',
                'dark:before:duration-400',
            ],
        },
    },
    defaultVariants: {
        effect: 'default',
        opacity: '25',
        speed: 'normal',
        size: 'md',
    },

    // Compound variants for frequently used combinations
    compoundVariants: VariantsGeneratedColors.ripple.compoundVariants,
});

export default ripple;

export type IVariantPropsRipple = VariantProps<typeof ripple>;