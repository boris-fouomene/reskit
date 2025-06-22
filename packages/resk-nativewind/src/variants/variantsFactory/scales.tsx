// Scale Transform Classes - Compatible with Web & Native
const scaleVariants = {
    // Micro scales (0-50%)
    'scale-0': 'scale-0',           // transform: scale(0)
    'scale-12': 'scale-12',         // transform: scale(0.125)
    'scale-25': 'scale-25',         // transform: scale(0.25)
    'scale-50': 'scale-50',         // transform: scale(0.5)

    // Standard scales (75-125%)
    'scale-75': 'scale-75',         // transform: scale(0.75)
    'scale-90': 'scale-90',         // transform: scale(0.9)
    'scale-95': 'scale-95',         // transform: scale(0.95)
    'scale-100': 'scale-100',       // transform: scale(1) - default
    'scale-105': 'scale-105',       // transform: scale(1.05)
    'scale-110': 'scale-110',       // transform: scale(1.1)
    'scale-125': 'scale-125',       // transform: scale(1.25)

    // Large scales (150-200%)
    'scale-150': 'scale-150',       // transform: scale(1.5)
    'scale-200': 'scale-200',       // transform: scale(2)
} as const;

// X-axis only scaling
const scaleXVariants = {
    'scale-x-0': 'scale-x-0',
    'scale-x-50': 'scale-x-50',
    'scale-x-75': 'scale-x-75',
    'scale-x-90': 'scale-x-90',
    'scale-x-95': 'scale-x-95',
    'scale-x-100': 'scale-x-100',
    'scale-x-105': 'scale-x-105',
    'scale-x-110': 'scale-x-110',
    'scale-x-125': 'scale-x-125',
    'scale-x-150': 'scale-x-150',
} as const;

// Y-axis only scaling
const scaleYVariants = {
    'scale-y-0': 'scale-y-0',
    'scale-y-50': 'scale-y-50',
    'scale-y-75': 'scale-y-75',
    'scale-y-90': 'scale-y-90',
    'scale-y-95': 'scale-y-95',
    'scale-y-100': 'scale-y-100',
    'scale-y-105': 'scale-y-105',
    'scale-y-110': 'scale-y-110',
    'scale-y-125': 'scale-y-125',
    'scale-y-150': 'scale-y-150',
} as const;

// Combined scale variants object
export const allScaleVariants = {
    ...scaleVariants,
    ...scaleXVariants,
    ...scaleYVariants,
} as const;

export type IVariantFactoryScales = keyof typeof allScaleVariants;


// Animation-friendly scale variants (for transitions)
const animatedScaleVariants = {
    initial: 'scale-95',      // Slightly smaller
    animate: 'scale-100',     // Normal size
    hover: 'scale-105',       // Slightly larger on hover
    pressed: 'scale-95',      // Smaller when pressed
    exit: 'scale-90',         // Scale down on exit
} as const;

// Responsive scale variants (though limited in React Native)
const responsiveScaleExamples = {
    // Note: React Native has limited responsive support compared to web
    mobile: 'scale-90',       // Smaller on mobile
    tablet: 'scale-100',      // Normal on tablet
    desktop: 'scale-110',     // Larger on desktop
} as const;

// Common use cases with recommended scales
const scaleUseCases = {
    // Buttons
    buttonRest: 'scale-100',
    buttonHover: 'scale-105',
    buttonPressed: 'scale-95',

    // Icons
    iconSmall: 'scale-75',
    iconNormal: 'scale-100',
    iconLarge: 'scale-125',

    // Images
    imageThumb: 'scale-90',
    imageFull: 'scale-100',
    imageZoom: 'scale-150',

    // Cards
    cardNormal: 'scale-100',
    cardHover: 'scale-105',
    cardFocused: 'scale-110',

    // Modals/Overlays
    modalEnter: 'scale-95',
    modalVisible: 'scale-100',
    modalExit: 'scale-90',
} as const;