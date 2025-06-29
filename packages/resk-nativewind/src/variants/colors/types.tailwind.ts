export interface ITailwindColors {

  /**
 * Cool gray color palette with blue undertones
 * @description A sophisticated gray that works well for modern interfaces
 */
  slate: string;


  /**
 * True gray color palette without color undertones
 * @description A neutral gray that's perfectly balanced
 */
  gray: string;


  /**
 * Cool gray color palette with subtle blue undertones
 * @description A modern gray with slightly cooler tones than neutral
 */
  zinc: string;

  /**
 * True gray color palette without color undertones
 * @description A pure gray that's completely neutral
 */
  neutral: string;

  /**
 * Warm gray color palette with brown undertones
 * @description A natural gray that feels warmer and more organic
 */
  stone: string;


  /**
 * Red color palette
 * @description Classic red for errors, warnings, and emphasis
 */
  red: string;

  /**
 * Orange color palette
 * @description Vibrant orange for warnings and energetic elements
 */
  orange: string;

  /**
* Amber color palette
* @description Warm golden orange for highlights and warnings
*/
  amber: string;


  /**
 * Yellow color palette
 * @description Bright yellow for attention and highlights
 */
  yellow: string;


  /**
 * Lime color palette
 * @description Bright yellow-green for vibrant accents
 */
  lime: string;


  /**
 * Green color palette
 * @description Classic green for success states and nature themes
 */
  green: string;


  /**
 * Emerald color palette
 * @description Rich blue-green for sophisticated success states
 */
  emerald: string;


  /**
 * Teal color palette
 * @description Blue-green for calming and professional interfaces
 */
  teal: string;


  /**
* Cyan color palette
* @description Bright blue-green for modern and tech-focused designs
*/
  cyan: string;


  /**
 * Sky color palette
 * @description Light blue reminiscent of clear skies
 */
  sky: string;


  /**
 * Blue color palette
 * @description Classic blue for primary actions and links
 */
  blue: string;

  /**
 * Indigo color palette
 * @description Deep blue-purple for sophisticated interfaces
 */
  indigo: string;


  /**
 * Violet color palette
 * @description Rich purple for creative and artistic designs
 */
  violet: string;


  /**
 * Purple color palette
 * @description Classic purple for luxury and creativity
 */
  purple: string;


  /**
 * Fuchsia color palette
 * @description Vibrant pink-purple for bold and energetic designs
 */
  fuchsia: string;


  /**
 * Pink color palette
 * @description Soft to vibrant pink for feminine and playful designs
 */
  pink: string;


  /**
 * Rose color palette
 * @description Warm pink with red undertones for romantic themes
 */
  rose: string;

  /**
* Pure black color
* @description Absolute black, inverts to white in darkColor mode
*/
  black: string;


  /**
 * Pure white color
 * @description Absolute white, inverts to black in darkColor mode
 */
  white: string;

  /**
 * Transparent color
 * @description Completely transparent, useful for overlays and hiding elements
 */
  //transparent: string;


  /**
* Current color
* @description Uses the current text color as the background/border color
*/
  current: string;


  /**
 * Inherit color
 * @description Inherits color from parent element
 */
  inherit: string;
}

export interface ITailwindColorsMap extends Record<keyof ITailwindColors, {
  lightColor: string,
  lightForeground: string,
  darkColor: string,
  darkForeground: string,
}> { }