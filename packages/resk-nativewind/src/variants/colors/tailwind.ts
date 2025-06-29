import { ITailwindColorsMap } from "./types.tailwind";

export const tailwindColors: ITailwindColorsMap = {
    /**
  * Cool gray color palette with blue undertones
  * @description A sophisticated gray that works well for modern interfaces
  */
    slate: {
        lightColor: 'slate-500',
        lightForeground: 'white',
        darkColor: 'slate-400',
        darkForeground: 'slate-900'
    },
    /**
     * True gray color palette without color undertones
     * @description A neutral gray that's perfectly balanced
     */
    gray: {
        lightColor: 'gray-500',
        lightForeground: 'white',
        darkColor: 'gray-400',
        darkForeground: 'gray-900'
    },
    /**
     * Cool gray color palette with subtle blue undertones
     * @description A modern gray with slightly cooler tones than neutral
     */
    zinc: {
        lightColor: 'zinc-500',
        lightForeground: 'white',
        darkColor: 'zinc-400',
        darkForeground: 'zinc-900'
    },
    /**
     * True gray color palette without color undertones
     * @description A pure gray that's completely neutral
     */
    neutral: {
        lightColor: 'neutral-500',
        lightForeground: 'white',
        darkColor: 'neutral-400',
        darkForeground: 'neutral-900'
    },
    /**
     * Warm gray color palette with brown undertones
     * @description A natural gray that feels warmer and more organic
     */
    stone: {
        lightColor: 'stone-500',
        lightForeground: 'white',
        darkColor: 'stone-400',
        darkForeground: 'stone-900'
    },
    /**
     * Red color palette
     * @description Classic red for errors, warnings, and emphasis
     */
    red: {
        lightColor: 'red-500',
        lightForeground: 'white',
        darkColor: 'red-400',
        darkForeground: 'red-900'
    },
    /**
     * Orange color palette
     * @description Vibrant orange for warnings and energetic elements
     */
    orange: {
        lightColor: 'orange-500',
        lightForeground: 'white',
        darkColor: 'orange-400',
        darkForeground: 'orange-900'
    },
    /**
     * Amber color palette
     * @description Warm golden orange for highlights and warnings
     */
    amber: {
        lightColor: 'amber-500',
        lightForeground: 'amber-900',
        darkColor: 'amber-400',
        darkForeground: 'amber-900'
    },
    /**
     * Yellow color palette
     * @description Bright yellow for attention and highlights
     */
    yellow: {
        lightColor: 'yellow-500',
        lightForeground: 'yellow-900',
        darkColor: 'yellow-400',
        darkForeground: 'yellow-900'
    },
    /**
     * Lime color palette
     * @description Bright yellow-green for vibrant accents
     */
    lime: {
        lightColor: 'lime-500',
        lightForeground: 'lime-900',
        darkColor: 'lime-400',
        darkForeground: 'lime-900'
    },
    /**
     * Green color palette
     * @description Classic green for success states and nature themes
     */
    green: {
        lightColor: 'green-500',
        lightForeground: 'white',
        darkColor: 'green-400',
        darkForeground: 'green-900'
    },
    /**
     * Emerald color palette
     * @description Rich blue-green for sophisticated success states
     */
    emerald: {
        lightColor: 'emerald-500',
        lightForeground: 'white',
        darkColor: 'emerald-400',
        darkForeground: 'emerald-900'
    },
    /**
     * Teal color palette
     * @description Blue-green for calming and professional interfaces
     */
    teal: {
        lightColor: 'teal-500',
        lightForeground: 'white',
        darkColor: 'teal-400',
        darkForeground: 'teal-900'
    },
    /**
     * Cyan color palette
     * @description Bright blue-green for modern and tech-focused designs
     */
    cyan: {
        lightColor: 'cyan-500',
        lightForeground: 'cyan-900',
        darkColor: 'cyan-400',
        darkForeground: 'cyan-900'
    },
    /**
     * Sky color palette
     * @description Light blue reminiscent of clear skies
     */
    sky: {
        lightColor: 'sky-500',
        lightForeground: 'white',
        darkColor: 'sky-400',
        darkForeground: 'sky-900'
    },
    /**
     * Blue color palette
     * @description Classic blue for primary actions and links
     */
    blue: {
        lightColor: 'blue-500',
        lightForeground: 'white',
        darkColor: 'blue-400',
        darkForeground: 'blue-900'
    },
    /**
     * Indigo color palette
     * @description Deep blue-purple for sophisticated interfaces
     */
    indigo: {
        lightColor: 'indigo-500',
        lightForeground: 'white',
        darkColor: 'indigo-400',
        darkForeground: 'indigo-900'
    },
    /**
     * Violet color palette
     * @description Rich purple for creative and artistic designs
     */
    violet: {
        lightColor: 'violet-500',
        lightForeground: 'white',
        darkColor: 'violet-400',
        darkForeground: 'violet-900'
    },
    /**
     * Purple color palette
     * @description Classic purple for luxury and creativity
     */
    purple: {
        lightColor: 'purple-500',
        lightForeground: 'white',
        darkColor: 'purple-400',
        darkForeground: 'purple-900'
    },
    /**
     * Fuchsia color palette
     * @description Vibrant pink-purple for bold and energetic designs
     */
    fuchsia: {
        lightColor: 'fuchsia-500',
        lightForeground: 'white',
        darkColor: 'fuchsia-400',
        darkForeground: 'fuchsia-900'
    },
    /**
     * Pink color palette
     * @description Soft to vibrant pink for feminine and playful designs
     */
    pink: {
        lightColor: 'pink-500',
        lightForeground: 'white',
        darkColor: 'pink-400',
        darkForeground: 'pink-900'
    },
    /**
     * Rose color palette
     * @description Warm pink with red undertones for romantic themes
     */
    rose: {
        lightColor: 'rose-500',
        lightForeground: 'white',
        darkColor: 'rose-400',
        darkForeground: 'rose-900'
    },
    /**
     * Pure black color
     * @description Absolute black, inverts to white in darkColor mode
     */
    black: {
        lightColor: 'black',
        lightForeground: 'white',
        darkColor: 'white',
        darkForeground: 'black'
    },
    /**
     * Pure white color
     * @description Absolute white, inverts to black in darkColor mode
     */
    white: {
        lightColor: 'white',
        lightForeground: 'black',
        darkColor: 'black',
        darkForeground: 'white'
    },
    // /**
    //  * Transparent color
    //  * @description Completely transparent, useful for overlays and hiding elements
    //  */
    // transparent: {
    //     lightColor: 'transparent',
    //     lightForeground: 'transparent',
    //     darkColor: 'transparent',
    //     darkForeground: 'transparent'
    // },
    /**
     * Current color
     * @description Uses the current text color as the lightColor/border color
     */
    current: {
        lightColor: 'current',
        lightForeground: 'current',
        darkColor: 'current',
        darkForeground: 'current'
    },
    /**
     * Inherit color
     * @description Inherits color from parent element
     */
    inherit: {
        lightColor: 'inherit',
        lightForeground: 'inherit',
        darkColor: 'inherit',
        darkForeground: 'inherit'
    }
};