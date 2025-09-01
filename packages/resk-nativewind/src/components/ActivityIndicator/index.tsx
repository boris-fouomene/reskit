import { cn } from "@utils/cn";
import { activityIndicatorVariant } from "@variants/activityIndicator";
import { CSSProperties } from "react";
import { IActivityIndicatorProps } from "./types";

/**
 * A custom SVG-based ActivityIndicator component for web that matches
 * React Native's ActivityIndicator interface. Provides smooth animations
 * and supports theming through variants and direct props.
 *
 * Size behavior:
 * - Direct props: size="small" | "large" | number (explicit sizing)
 * - Tailwind/CSS classes: w-4 h-4, w-8 h-8, etc. (when size prop not provided)
 * - No default size - relies entirely on CSS when size prop is undefined
 *
 * Color behavior:
 * - Direct props: color="#ff0000" (applies to spinner color)
 * - Tailwind classes: text-blue-500 OR bg-blue-500 (both apply to spinner, not container background)
 * - No default color - uses currentColor when color prop is undefined
 * - bg-* classes are automatically converted to spinner color, NOT container background
 *
 * @component ActivityIndicator
 *
 * @param {IActivityIndicatorProps} props - The properties for the ActivityIndicator
 *
 * @example
 * ```tsx
 * // Basic usage (size controlled by CSS/Tailwind)
 * <ActivityIndicator className="w-6 h-6 text-blue-500" />
 *
 * // With bg- class (applies to spinner, not container background)
 * <ActivityIndicator className="w-8 h-8 bg-red-500" />
 *
 * // With explicit size and color (spinner color, not background)
 * <ActivityIndicator size="large" color="#ff0000" />
 *
 * // Mixed approach - explicit size with Tailwind color
 * <ActivityIndicator size={24} className="bg-green-500" />
 *
 * // Size from CSS, no defaults applied
 * <ActivityIndicator className="w-12 h-12 text-purple-600" />
 * ```
 */
export function ActivityIndicator({
  size,
  style,
  variant,
  testID = "resk-activity-indicator",
  id,
  color,
  className,
  children,
  animating = true,
  hidesWhenStopped = true,
  // Filter out React Native specific props that aren't compatible with HTML
  hitSlop,
  needsOffscreenAlphaCompositing,
  onLayout,
  onTouchCancel,
  onTouchEnd,
  onTouchMove,
  onTouchStart,
  accessible,
  accessibilityActions,
  accessibilityElementsHidden,
  accessibilityHint,
  accessibilityIgnoresInvertColors,
  accessibilityLabel,
  accessibilityLanguage,
  accessibilityLabelledBy,
  accessibilityLiveRegion,
  accessibilityRole,
  accessibilityState,
  accessibilityValue,
  accessibilityViewIsModal,
  importantForAccessibility,
  nativeID,
  pointerEvents,
  removeClippedSubviews,
  renderToHardwareTextureAndroid,
  shouldRasterizeIOS,
  collapsable,
  needsOffscreenAlphaCompositing: _needsOffscreenAlphaCompositing,
  ...props
}: IActivityIndicatorProps) {
  // Don't render if not animating and should hide when stopped
  if (!animating && hidesWhenStopped) {
    return null;
  }

  // Parse size only if explicitly provided
  const getSizeValue = (
    sizeInput: string | number | undefined
  ): number | undefined => {
    if (sizeInput === undefined) return undefined; // Let CSS/Tailwind handle it
    if (typeof sizeInput === "number") return sizeInput;

    switch (sizeInput) {
      case "small":
        return 16;
      case "large":
        return 36;
      default:
        return undefined; // Fallback to CSS
    }
  };

  const sizeValue = getSizeValue(size);

  // Check if size is controlled by Tailwind classes
  const hasTailwindSize = className && /(?:w-\d+|h-\d+)/.test(className);

  // Determine sizing approach - NO DEFAULT SIZE
  const useCSSSize = !sizeValue;

  // Calculate dimensions based on whether we have explicit size or CSS sizing
  const viewBoxSize = useCSSSize ? 24 : sizeValue; // Standard viewBox for CSS sizing
  const strokeWidth = sizeValue ? Math.max(2, sizeValue / 8) : 2;
  const radius = useCSSSize ? 10 : (sizeValue - strokeWidth) / 2; // Standard radius for CSS sizing
  const circumference = 2 * Math.PI * radius;

  // Separate container classes from color classes
  const extractClasses = (className: string | undefined) => {
    if (!className) return { containerClasses: "", colorClasses: "" };

    const classes = className.split(/\s+/);
    const containerClasses: string[] = [];
    const colorClasses: string[] = [];

    classes.forEach((cls) => {
      // Background colors should be extracted for spinner color
      if (cls.startsWith("bg-")) {
        colorClasses.push(cls);
      }
      // Text colors should be extracted for spinner color
      else if (cls.startsWith("text-")) {
        colorClasses.push(cls);
      }
      // Everything else goes to container
      else {
        containerClasses.push(cls);
      }
    });

    return {
      containerClasses: containerClasses.join(" "),
      colorClasses: colorClasses.join(" "),
    };
  };

  const { containerClasses, colorClasses } = extractClasses(className);

  // Create the base className with variants - NO DEFAULT SIZE, NO COLOR BACKGROUNDS
  const baseClassName = cn(
    "resk-activity-indicator",
    "inline-block",
    // If not animating, add opacity reduction
    !animating && "opacity-50",
    // DO NOT add any default size classes
    activityIndicatorVariant(variant),
    containerClasses // Only non-color classes
  );

  // Determine stroke color (no default, let CSS handle it)
  const getStrokeColor = (): string | undefined => {
    // Direct color prop takes precedence
    if (color) {
      if (typeof color === "string") return color;
      return String(color);
    }

    // Don't try to extract colors here - let CSS handle it
    return undefined;
  };

  const strokeColor = getStrokeColor();

  // Convert React Native style to CSS style (SSR-safe)
  const getContainerStyle = (): CSSProperties => {
    if (!style) return {};

    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean)) as CSSProperties;
    }

    return (style || {}) as CSSProperties;
  };

  const containerStyle = getContainerStyle();

  // SVG style - only include explicit size if provided
  const svgStyle: CSSProperties = useCSSSize
    ? {} // Let CSS control size
    : {
        width: sizeValue,
        height: sizeValue,
      };

  // Extract web-compatible props (SSR-safe)
  const getWebCompatibleProps = () => {
    const {
      // Remove React Native specific props
      hitSlop: _hitSlop,
      needsOffscreenAlphaCompositing: _needsOffscreenAlphaCompositing1,
      onLayout: _onLayout,
      onTouchCancel: _onTouchCancel,
      onTouchEnd: _onTouchEnd,
      onTouchMove: _onTouchMove,
      onTouchStart: _onTouchStart,
      onTouchCancelCapture: _onTouchCancelCapture,
      onTouchEndCapture: _onTouchEndCapture,
      onTouchMoveCapture: _onTouchMoveCapture,
      onTouchStartCapture: _onTouchStartCapture,
      accessible: _accessible,
      accessibilityActions: _accessibilityActions,
      accessibilityElementsHidden: _accessibilityElementsHidden,
      accessibilityHint: _accessibilityHint,
      accessibilityIgnoresInvertColors: _accessibilityIgnoresInvertColors,
      accessibilityLabel: _accessibilityLabel,
      accessibilityLanguage: _accessibilityLanguage,
      accessibilityLabelledBy: _accessibilityLabelledBy,
      accessibilityLiveRegion: _accessibilityLiveRegion,
      accessibilityRole: _accessibilityRole,
      accessibilityState: _accessibilityState,
      accessibilityValue: _accessibilityValue,
      accessibilityViewIsModal: _accessibilityViewIsModal,
      importantForAccessibility: _importantForAccessibility,
      nativeID: _nativeID,
      pointerEvents: _pointerEvents,
      removeClippedSubviews: _removeClippedSubviews,
      renderToHardwareTextureAndroid: _renderToHardwareTextureAndroid,
      shouldRasterizeIOS: _shouldRasterizeIOS,
      collapsable: _collapsable,
      collapsableChildren: _collapsableChildren,
      cssInterop: _cssInterop,
      focusable: _focusable,
      onGestureHandlerEvent: _onGestureHandlerEvent,
      onGestureHandlerStateChange: _onGestureHandlerStateChange,
      experimental_layoutConformance: _experimental_layoutConformance,
      ...webProps
    } = props as any;

    return webProps;
  };

  const webCompatibleProps = getWebCompatibleProps();

  return (
    <div
      id={id}
      className={baseClassName}
      style={containerStyle}
      data-testid={testID}
      role="progressbar"
      aria-label="Loading"
      aria-valuetext={animating ? "Loading..." : "Loading stopped"}
      {...webCompatibleProps}
    >
      <svg
        className={cn(
          // Base animation classes
          animating && "animate-spin",
          // Size classes if using CSS sizing
          useCSSSize && "w-full h-full",
          // Ensure proper display
          "block"
        )}
        style={svgStyle}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        fill="none"
      >
        {/* Background circle (optional subtle track) */}
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />

        {/* Animated progress circle - color applies here, not to background */}
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          stroke={strokeColor || "currentColor"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75} // Show 25% of circle
          className={cn(
            // Smooth transitions
            "transition-all duration-200 ease-in-out",
            // Convert bg- classes to text- classes for stroke color inheritance
            colorClasses?.replace(/bg-/g, "text-")
          )}
          style={{
            transformOrigin: "center",
          }}
        />
      </svg>

      {children}
    </div>
  );
}
