import { IClassName } from "@src/types";
import { cn } from "./cn";

/**
 * Represents categorized text styling classes extracted from NativeWind/Tailwind CSS
 * @interface ITextClassesClasses
 */
interface ITextClassesClasses {
  /** Font weight classes (e.g., font-bold, font-light) */
  weight: string[];
  /** Font size classes (e.g., text-lg, text-2xl) */
  size: string[];
  /** Font family classes (e.g., font-sans, font-serif) */
  family: string[];
  /** Text color classes (e.g., text-blue-500, text-red-200) */
  color: string[];
  /** Text decoration classes (e.g., underline, line-through) */
  decoration: string[];
  /** Text transform classes (e.g., uppercase, capitalize) */
  transform: string[];
  /** Text alignment classes (e.g., text-center, text-left) */
  align: string[];
  /** Line height classes (e.g., leading-tight, leading-loose) */
  leading: string[];
  /** Letter spacing classes (e.g., tracking-wide, tracking-tight) */
  tracking: string[];
  /** Text opacity classes (e.g., text-opacity-50, text-opacity-75) */
  opacity: string[];
}

/**
 * Extracts and categorizes NativeWind/Tailwind CSS text styling classes from a given class string.
 * 
 * This function parses a space-separated string of CSS classes and filters out only the text-related
 * styling classes, organizing them into logical categories for easier manipulation and analysis.
 * Non-text classes (like background, padding, margin, etc.) are ignored.
 *
 * @param className - A class to extract text classes from
 * @returns An object containing arrays of text styling classes organized by category
 *
 * @example
 * Basic usage with mixed classes:
 * ```typescript
 * const classes = "text-lg font-bold text-blue-500 bg-red-200 p-4 uppercase";
 * const result = extractTextClasses(classes);
 * console.log(result);
 * // Output: {
 * //   weight: ['font-bold'],
 * //   size: ['text-lg'],
 * //   family: [],
 * //   color: ['text-blue-500'],
 * //   decoration: [],
 * //   transform: ['uppercase'],
 * //   align: [],
 * //   leading: [],
 * //   tracking: [],
 * //   opacity: []
 * // }
 * ```
 *
 * @example
 * Multiple text styles in same category:
 * ```typescript
 * const classes = "text-sm text-lg font-light font-bold text-red-500 text-blue-300";
 * const result = extractTextClasses(classes);
 * console.log(result.weight); // ['font-light', 'font-bold']
 * console.log(result.size);   // ['text-sm', 'text-lg']
 * console.log(result.color);  // ['text-red-500', 'text-blue-300']
 * ```
 *
 * @example
 * Comprehensive text styling:
 * ```typescript
 * const classes = "font-serif text-2xl font-semibold text-gray-800 underline uppercase text-center leading-relaxed tracking-wide text-opacity-90";
 * const result = extractTextClasses(classes);
 * console.log(result);
 * // Output: {
 * //   weight: ['font-semibold'],
 * //   size: ['text-2xl'],
 * //   family: ['font-serif'],
 * //   color: ['text-gray-800'],
 * //   decoration: ['underline'],
 * //   transform: ['uppercase'],
 * //   align: ['text-center'],
 * //   leading: ['leading-relaxed'],
 * //   tracking: ['tracking-wide'],
 * //   opacity: ['text-opacity-90']
 * // }
 * ```
 *
 * @example
 * Edge cases:
 * ```typescript
 * // Empty string
 * extractTextClasses(""); // Returns empty arrays for all categories
 * 
 * // Only non-text classes
 * extractTextClasses("bg-blue-500 p-4 m-2 rounded-lg"); // Returns empty arrays
 * 
 * // Invalid input
 * extractTextClasses(null); // Returns empty arrays for all categories
 * ```
 */
export function extractTextClassesByCategory(className: IClassName): ITextClassesClasses {
  className = cn(className)
  if (!className || typeof className !== 'string') {
    return {
      weight: [],
      size: [],
      family: [],
      color: [],
      decoration: [],
      transform: [],
      align: [],
      leading: [],
      tracking: [],
      opacity: []
    };
  }

  const classes = className.split(/\s+/).filter(cls => cls.length > 0);

  const textStyles: ITextClassesClasses = {
    weight: [],
    size: [],
    family: [],
    color: [],
    decoration: [],
    transform: [],
    align: [],
    leading: [],
    tracking: [],
    opacity: []
  };
  // Categorize each class
  classes.forEach(cls => {
    for (const [category, pattern] of Object.entries(textPatterns)) {
      if (pattern.test(cls)) {
        textStyles[category as keyof ITextClassesClasses].push(cls);
        break;
      }
    }
  });
  return textStyles;
}

/**
 * Extracts text-related NativeWind/Tailwind CSS classes from a given class string.
 * 
 * This function parses a space-separated string of CSS classes and filters out only the text-related
 * styling classes, returning them as a single space-separated string. Non-text classes 
 * (like background, padding, margin, borders, etc.) are ignored.
 *
 * @param className - The class to extract text classes from
 * @returns A string containing only text-related classes, space-separated
 *
 * @example
 * Basic usage with mixed classes:
 * ```typescript
 * const classes = "text-lg font-bold text-blue-500 bg-red-200 p-4 uppercase";
 * const result = extractTextStyles(classes);
 * console.log(result); // "text-lg font-bold text-blue-500 uppercase"
 * ```
 *
 * @example
 * Complex styling with various text properties:
 * ```typescript
 * const classes = "font-serif text-2xl font-semibold text-gray-800 underline uppercase text-center leading-relaxed tracking-wide text-opacity-90 bg-white p-6 rounded-lg shadow-md";
 * const result = extractTextStyles(classes);
 * console.log(result); 
 * // Output: "font-serif text-2xl font-semibold text-gray-800 underline uppercase text-center leading-relaxed tracking-wide text-opacity-90"
 * ```
 *
 * @example
 * Only non-text classes:
 * ```typescript
 * const classes = "bg-blue-500 p-4 m-2 rounded-lg border shadow-lg";
 * const result = extractTextStyles(classes);
 * console.log(result); // "" (empty string)
 * ```
 *
 * @example
 * Edge cases:
 * ```typescript
 * // Empty string
 * extractTextStyles(""); // ""
 * 
 * // Only whitespace
 * extractTextStyles("   "); // ""
 * 
 * // Invalid input
 * extractTextStyles(null); // ""
 * ```
 *
 * @example
 * Real-world React Native usage:
 * ```typescript
 * const CardComponent = ({ className, title }: { className: string, title: string }) => {
 *   const textClasses = extractTextStyles(className);
 *   
 *   return (
 *     <View className={className}>
 *       <Text className={textClasses}>
 *         {title}
 *       </Text>
 *     </View>
 *   );
 * };
 * 
 * // Usage
 * <CardComponent 
 *   className="bg-white p-4 rounded-lg shadow text-xl font-bold text-gray-900 text-center" 
 *   title="Card Title" 
 * />
 * // The Text component will only get: "text-xl font-bold text-gray-900 text-center"
 * ```
 */
export function extractTextClasses(className: IClassName): string {
  className = cn(className)
  if (!className || typeof className !== 'string') {
    return '';
  }
  const textClasses: string[] = [];
  const classes = className.split(/\s+/).filter(cls => {
    if (!cls.length) return false;
    if (cls.startsWith("font-") || cls.startsWith("text-") || cls.includes("antialiased") || cls.includes("italic")) {
      textClasses.push(cls);
      return false;
    }
    return true;
  });
  // Filter classes that match text patterns
  classes.forEach(cls => {
    if (textPatternsArray.some(pattern => pattern.test(cls))) {
      textClasses.push(cls);
    }
  });
  return textClasses.join(' ');
}


export const textPatterns = {
  // Font weight
  weight: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  // Font size
  size: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
  // Font family
  family: /^font-(sans|serif|mono)$/,
  color: /^text-(inherit|current|transparent|black|white|slate-\d+|gray-\d+|zinc-\d+|neutral-\d+|stone-\d+|red-\d+|orange-\d+|amber-\d+|yellow-\d+|lime-\d+|green-\d+|emerald-\d+|teal-\d+|cyan-\d+|sky-\d+|blue-\d+|indigo-\d+|violet-\d+|purple-\d+|fuchsia-\d+|pink-\d+|rose-\d+)$/,
  decoration: /^(underline|overline|line-through|no-underline)$/,
  transform: /^(uppercase|lowercase|capitalize|normal-case)$/,
  align: /^text-(left|center|right|justify|start|end)$/,
  leading: /^leading-(none|tight|snug|normal|relaxed|loose|\d+)$/,
  tracking: /^tracking-(tighter|tight|normal|wide|wider|widest)$/,
  opacity: /^text-opacity-(\d+)$/
}

const textPatternsArray = Object.values(textPatterns);