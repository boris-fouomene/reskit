
export interface IVariantColor {
    /***The light color variant*/
    lightColor: string,
    /***The light foreground variant*/
    lightForeground: string,
    /***The dark color variant*/
    darkColor: string,
    /**The dark foreground variant*/
    darkForeground: string,
}

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
 * @remarks
 * This interface is intended to be used as a base for color variant mapping in design systems,
 * utility libraries, or component libraries that support theming and variant-based styling.
 */
export interface IVariantsColorsMapBase {
    /**
     * The primary color, typically used for main actions or highlights.
     */
    primary: IVariantColor;
    /**
     * The secondary color, used for secondary actions or accents.
     */
    secondary: IVariantColor;

    /***
     * The background color, used for backgrounds or surfaces.
     */
    background: IVariantColor
    /**
     * The surface color, used for backgrounds or surfaces.
     */
    surface: IVariantColor
    /**
     * The informational color, used for info messages or highlights.
     */
    info: IVariantColor
    /**
     * The success color, used for positive or successful actions.
     */
    success: IVariantColor;
    /**
     * The warning color, used for caution or warning messages.
     */
    warning: IVariantColor;
    /**
     * The error color, used for errors or destructive actions.
     */
    error: IVariantColor;
    /***
     * The default text color, used for text elements.
     */
    text: IVariantColor;

    /**
   * True gray color palette without color undertones
   * @description A pure gray that's completely neutral
   */
    neutral: IVariantColor;
}