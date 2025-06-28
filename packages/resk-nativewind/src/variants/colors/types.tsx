import { ITailwindColors } from "./types.tailwind";
/**
 * Represents the color roles available for variant-based styling.
 *
 * This interface defines the standard color names used throughout the design system for consistent theming.
 * Each property corresponds to a semantic color role, and its value is a string representing a color class or value.
 *
 * @property primary - The primary color, typically used for main actions or highlights.
 * @property secondary - The secondary color, used for secondary actions or accents.
 * @property surface - The surface color, used for backgrounds or surfaces.
 * @property info - The informational color, used for info messages or highlights.
 * @property success - The success color, used for positive or successful actions.
 * @property warning - The warning color, used for caution or warning messages.
 * @property error - The error color, used for errors or destructive actions.
 * @property background - The background color, used for backgrounds or surfaces.
 *
 * @example
 * // Example usage in a component or theme definition
 * const myColors: IVariantsColorsMap = {
 *   primary: "bg-blue-600",
 *   secondary: "bg-gray-500",
 *   surface: "bg-white",
 *   info: "bg-cyan-500",
 *   success: "bg-green-500",
 *   warning: "bg-yellow-500",
 *   error: "bg-red-600",
 *   background: "bg-gray-500",
 * };
 *
 * @remarks
 * This interface is intended to be used as a base for color variant mapping in design systems,
 * utility libraries, or component libraries that support theming and variant-based styling.
 */
export interface IVariantsColorsMap extends ITailwindColors {
    /**
     * The primary color, typically used for main actions or highlights.
     */
    primary: string;
    /**
     * The secondary color, used for secondary actions or accents.
     */
    secondary: string;
    /**
     * The surface color, used for backgrounds or surfaces.
     */
    surface: string;
    /**
     * The informational color, used for info messages or highlights.
     */
    info: string;
    /**
     * The success color, used for positive or successful actions.
     */
    success: string;
    /**
     * The warning color, used for caution or warning messages.
     */
    warning: string;
    /**
     * The error color, used for errors or destructive actions.
     */
    error: string;
    /***
     * The background color, used for backgrounds or surfaces.
     */
    background: string;
}

export * from "./types.tailwind";