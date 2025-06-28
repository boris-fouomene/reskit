import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { defaultStr, isNumber } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { IVariantPropsProgressBar } from "@variants/progressBar";
import progressBarVariant from "@variants/progressBar";
import { Text } from "@html/Text";
import { ProgressBarIndeterminateFill } from "./Indeterminate";

/**
 * A highly customizable and accessible progress bar component built with React and Tailwind CSS.
 * 
 * This component provides a flexible way to display progress indicators with full control
 * over styling and behavior. It supports custom styling through className props, animations,
 * percentage display, and follows WAI-ARIA accessibility guidelines.
 * 
 * The component consists of two main visual elements:
 * - **Track**: The background container that represents the full progress range
 * - **Fill**: The colored portion that indicates the current progress
 * 
 * @component
 * @since 1.0.0
 * @author Your Name
 * 
 * @param {IProgressBarProps} props - Configuration object for the progress bar
 * @returns {React.ReactElement} A rendered progress bar component with proper ARIA attributes
 * 
 * @example
 * ```tsx
 * // Basic usage - Simple progress bar
 * <ProgressBar value={75} max={100} />
 * 
 * // Custom styling - Colorful gradient progress bar
 * <ProgressBar
 *   value={45}
 *   max={100}
 *   trackClassName="h-3 w-full bg-gray-800 rounded-full shadow-inner"
 *   fillClassName="h-full bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full"
 *   showPercentage={true}
 * />
 * ```
 */
export function ProgressBar({
    value,
    max = 100,
    trackClassName,
    fillClassName,
    showPercentage = false,
    variant,
    testID,
    className,
    indeterminate,
    ...props
}: IProgressBarProps) {
    value = isNumber(value) && value >= 0 ? value : 0;
    max = isNumber(max) && max > 0 && max >= value ? max : 100;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const canShowPercent = indeterminate !== false && showPercentage;
    const computedVariant = progressBarVariant(variant);
    testID = defaultStr(testID, "resk-progress-bar");
    const title = !indeterminate ? `value : ${value.formatNumber()}, max : ${max.formatNumber()},percentage : ${percentage}%` : props.title;
    const Component = indeterminate ? ProgressBarIndeterminateFill : Div;
    fillClassName = cn("progress-bar-fill h-full w-full", computedVariant.fillBar(), fillClassName);
    return <Div title={title} accessibilityRole="progressbar"
        accessibilityValue={indeterminate ? {} : { min: 0, max: 100, now: percentage * 100 }}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value}
        role="progressbar"{...props} className={cn("w-full progress-bar relative", indeterminate && "progressbar-indeterminate", computedVariant.base(), className)}
        testID={testID}
    >
        <Div
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            testID={testID + "-track"}
            className={cn("progress-bar-track w-full overflow-hidden min-h-1", computedVariant.track(), trackClassName)}
        >
            <Component
                role="presentation"
                testID={testID + "-fill"}
                className={fillClassName}
                style={!indeterminate ? { width: `${percentage}%` } : undefined}
            />
        </Div>
        {canShowPercent ? <Text testID={testID + "-percentage-text"} className={cn("progress-bar-percentage-text progress-bar-percentage-container absolute inset-0 ", computedVariant.text())}>{percentage.toFixed(1)}%</Text>
            : null}
    </Div>
};


/**
 * Configuration interface for the ProgressBar component styling and behavior.
 * 
 * This interface defines all the customizable properties that control the appearance
 * and functionality of the progress bar component. It provides flexibility for
 * developers to create various progress bar styles while maintaining consistency.
 * 
 * @interface IProgressBarProps
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * // Basic usage with default styling
 * const basicProps: IProgressBarProps = {
 *   value: 75,
 *   max: 100
 * };
 * 
 * // Advanced usage with custom styling
 * const customProps: IProgressBarProps = {
 *   value: 350,
 *   max: 500,
 *   trackClassName: "h-2 w-full bg-gray-200 rounded-full shadow-inner",
 *   fillClassName: "h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out",
 *   showPercentage: true,
 * };
 * ```
 */
export interface IProgressBarProps extends Omit<IHtmlDivProps, "children"> {
    /***
     * The variant to use for the progress bar.
     * 
     * This prop allows you to customize the appearance of the progress bar based on the
     * variant you choose. It accepts a string value that corresponds to the variant name.
     * 
     * @type {IVariantPropsProgressBar}
     * @memberof IProgressBarProps
     */
    variant?: IVariantPropsProgressBar;
    /**
     * The current progress value.
     * 
     * Represents the current state of progress. This value should be between 0 and the `max` value.
     * The component will automatically calculate the percentage and apply it to the fill element.
     * 
     * @type {number}
     * @memberof IProgressBarProps
     * @since 1.0.0
     * 
     * @example
     * ```typescript
     * // Loading progress
     * <ProgressBar value={45} max={100} />
     * 
     * // File upload progress
     * <ProgressBar value={1024} max={2048} />
     * 
     * // Task completion
     * <ProgressBar value={7} max={10} />
     * ```
     */
    value?: number;

    /**
     * The maximum possible value (100% completion).
     * 
     * Defines the upper limit for the progress calculation. The progress percentage
     * is calculated as `(value / max) * 100`. Must be greater than 0.
     * 
     * @type {number}
     * @default 100
     * @memberof IProgressBarProps
     * @since 1.0.0
     * 
     * @example
     * ```typescript
     * // Percentage-based progress (0-100)
     * <ProgressBar value={75} max={100} />
     * 
     * // File size progress in bytes
     * <ProgressBar value={512000} max={1024000} />
     * 
     * // Step-based progress
     * <ProgressBar value={3} max={5} />
     * ```
     */
    max?: number;

    /**
     * Custom CSS classes for the progress bar track (background container).
     * 
     * This className is applied to the outer container Div that represents the full
     * width background of the progress bar. Use this to customize the track's height,
     * background color, border radius, shadows, and other visual properties.
     * 
     * @type {string}
     * @memberof IProgressBarProps
     * @since 1.0.0
     * 
     * @example
     * ```typescript
     * // Thin progress bar with rounded corners
     * trackClassName="h-1 w-full bg-gray-100 rounded-full"
     * 
     * // Thick progress bar with shadow
     * trackClassName="h-4 w-full bg-gray-300 rounded-lg shadow-inner"
     * 
     * // Custom colored track with gradient
     * trackClassName="h-2 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded"
     * 
     * // Square progress bar for retro design
     * trackClassName="h-3 w-full bg-gray-800 border border-gray-600"
     * ```
     */
    trackClassName?: string;

    /**
     * Custom CSS classes for the progress bar fill (progress indicator).
     * 
     * This className is applied to the inner Div that represents the actual progress.
     * The width is automatically calculated based on the value/max ratio. Use this
     * to customize the fill color, gradients, animations, and visual effects.
     * 
     * @type {string}
     * @memberof IProgressBarProps
     * @since 1.0.0
     * 
     * @example
     * ```typescript
     * // Gradient fill with smooth animation
     * fillClassName="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-in-out rounded"
     * 
     * // Pulsing animation effect
     * fillClassName="h-full bg-purple-500 animate-pulse rounded"
     * 
     * // Striped pattern with animation
     * fillClassName="h-full bg-orange-500 bg-stripes bg-stripes-white animate-stripes rounded"
     * 
     * // Solid color with glow effect
     * fillClassName="h-full bg-red-500 shadow-lg shadow-red-500/50 rounded"
     * ```
     */
    fillClassName?: string;

    /**
     * Whether to display the percentage text overlay.
     * 
     * When enabled, shows the calculated percentage as text overlaid on the progress bar.
     * The percentage is automatically calculated and formatted to one decimal place.
     * 
     * @type {boolean}
     * @default false
     * @memberof IProgressBarProps
     * @since 1.0.0
     * 
     * @example
     * ```typescript
     * // Show percentage for user feedback
     * <ProgressBar value={65} max={100} showPercentage={true} />
     * 
     * // Hide percentage for minimal design
     * <ProgressBar value={65} max={100} showPercentage={false} />
     * ```
     */
    showPercentage?: boolean;


    /**
     * If the progress bar will show indeterminate progress.
     */
    indeterminate?: boolean;
}