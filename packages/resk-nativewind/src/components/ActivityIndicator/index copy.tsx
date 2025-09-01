import { defaultStr, isNonNullString, isNumber } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { activityIndicatorVariant } from "@variants/activityIndicator";
import { StyleSheet } from "react-native";
import { IActivityIndicatorProps } from "./types";

/**
 * SVG-based ActivityIndicator component that matches React Native ActivityIndicator API.
 *
 * This component provides the same interface as React Native's ActivityIndicator:
 * - `size`: "small" | "large" | number - Controls the size of the spinner
 * - `color`: string - Sets the color of the spinner (takes precedence over className colors)
 * - `animating`: boolean - Controls whether the spinner is animating (default: true)
 * - `hidesWhenStopped`: boolean - Hides the spinner when not animating (default: true)
 * - `style`: ViewStyle - Additional styles to apply
 * - `testID`: string - Test identifier
 *
 * Additional props:
 * - `variant`: IActivityIndicatorVariant - Theme variant for styling and color variants
 * - `className`: string - CSS classes for styling, supports Tailwind color classes:
 *
 * **Color Classes (use these to apply color):**
 * - `text-red-500` - Red color
 * - `text-blue-600` - Blue color
 * - `text-green-400` - Green color
 * - `text-purple-500` - Purple color
 * - `text-gray-600` - Gray color
 * - `text-white` - White color
 * - `text-black` - Black color
 * - `hover:text-purple-500` - Purple on hover
 * - `dark:text-white` - White in dark mode
 * - `focus:text-blue-500` - Blue on focus
 *
 * **Color precedence:**
 * 1. `color` prop (highest priority - inline style)
 * 2. Color variants through `variant` prop (future implementation)
 * 3. `text-*` classes in `className` (e.g., `text-red-500`)
 * 4. Default theme colors (lowest priority)
 *
 * **Examples:**
 * ```tsx
 * // Using color prop (highest priority)
 * <ActivityIndicator color="#ff0000" />
 *
 * // Using Tailwind text classes
 * <ActivityIndicator className="text-red-500" />
 * <ActivityIndicator className="text-blue-600 hover:text-blue-800" />
 *
 * // Color prop overrides Tailwind classes
 * <ActivityIndicator color="#00ff00" className="text-red-500" /> // Will be green
 *
 * // Future: Using color variants
 * <ActivityIndicator variant={{ color: "primary" }} />
 * ```
 *
 * @param props - ActivityIndicator props matching React Native API
 */
export function ActivityIndicator({
  size,
  style,
  variant,
  testID,
  id,
  color,
  className,
  children,
  animating = true,
  hidesWhenStopped = true,
  ...props
}: IActivityIndicatorProps) {
  // Don't render if animating is false and hidesWhenStopped is true
  if (!animating && hidesWhenStopped) {
    return null;
  }

  // Calculate size classes and styles
  const clx = [];
  let svgStyle: any = {};
  let strokeWidthValue = 4;

  if (isNumber(size) && size > 0) {
    // For numeric sizes, set explicit width/height
    svgStyle = { width: size, height: size };
    // Calculate appropriate stroke width based on size
    strokeWidthValue = size >= 30 ? 3 : size >= 20 ? 2.5 : 2;
    if (size >= 40) {
      strokeWidthValue = Math.max(
        size / 12,
        size < 60 ? 3 : size < 80 ? 4 : size < 90 ? 5 : 6
      );
    }
  } else {
    // For predefined sizes, use className approach
    if (size === "large") {
      clx.push("h-16 w-16");
      strokeWidthValue = 6;
    } else {
      // default "small" size
      clx.push("h-5 w-5");
      strokeWidthValue = 3;
    }
  }

  // Handle color styling - color prop takes precedence over className colors
  let colorStyle = {};

  if (isNonNullString(color) && color.trim()) {
    // If color prop is provided, use it as inline style (highest precedence)
    colorStyle = { color: color };
  } else {
    // No color prop, let Tailwind classes handle coloring
  }

  // Combine styles
  const finalStyle = StyleSheet.flatten([svgStyle, colorStyle, style]);

  testID = defaultStr(testID, "resk-activity-indicator");

  return (
    <svg
      role="progressbar"
      aria-busy={animating}
      aria-label="loading"
      aria-valuetext={animating ? "Loading..." : "Stopped"}
      data-testid={testID}
      id={id}
      style={finalStyle}
      className={cn(
        "resk-activity-indicator",
        animating ? "animate-spin" : "",
        clx,
        activityIndicatorVariant(variant),
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={strokeWidthValue}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
