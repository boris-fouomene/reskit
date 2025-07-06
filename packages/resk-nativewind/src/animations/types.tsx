import { IClassName } from "@src/types";
import { IHtmlDivProps } from "@html/types";
/**
 * @interface AnimatedVisibilityProps
 * @extends IHtmlDivProps
 * Props interface for the AnimatedVisibility component.
 * 
 * This component provides smooth show/hide animations with callbacks
 * that trigger when the animation states complete.
 * 
 * @example
 * ```tsx
 * <AnimatedVisibility
 *   visible={isOpen}
 *   onVisible={() => console.log('Component is now visible')}
 *   onHidden={() => console.log('Component is now hidden')}
 * >
 *   <div>Your content here</div>
 * </AnimatedVisibility>
 * ```
 */
export interface IAnimatedVisibilityProps extends Omit<IHtmlDivProps, "className"> {
    /**
     * Controls the visibility state of the component.
     * When `true`, the component will animate in and become visible.
     * When `false`, the component will animate out and become hidden.
     * 
     * @default false
     */
    visible?: boolean;

    /**
     * Callback function invoked when the component has completed its
     * show animation and is fully visible.
     * 
     * This is called at the end of the entrance animation when `visible` is `true`.
     * 
     * @remarks
     * This callback is useful for:
     * - Focusing elements after they appear
     * - Triggering subsequent animations
     * - Analytics tracking
     * - Updating application state
     */
    onVisible?: () => void;

    /**
     * Callback function invoked when the component has completed its
     * hide animation and is fully hidden.
     * 
     * This is called at the end of the exit animation when `visible` is `false`.
     * 
     * @remarks
     * This callback is useful for:
     * - Cleaning up resources
     * - Removing the component from the DOM
     * - Triggering cleanup operations
     * - Updating application state
     */
    onHidden?: () => void;

    /**
     * Optional CSS class name to apply to the component's root element.
     * 
     * @remarks
     * This allows for custom styling while maintaining the animation behavior.
     */
    className?: IClassName;

    /**
     * Animation duration in milliseconds.
     * 
     * @default 300
     * @remarks
     * Controls how long the show/hide animation takes to complete.
     * Both `onVisible` and `onHidden` callbacks will be triggered after this duration.
     */
    animationDuration?: number;

    /**
     * Animation timing function (easing).
     * 
     * @default "ease-in-out"
     * @remarks
     * Accepts any valid CSS transition timing function value.
     * Common values: "ease", "ease-in", "ease-out", "ease-in-out", "linear"
     */
    animationTimingFunction?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";

    enteringAnimationName?: IAnimatedVisibilityName;
    exitingAnimationName?: IAnimatedVisibilityName;
}

export type IAnimatedVisibilityName = keyof IAnimationsKeyFrames;

export interface IAnimationsKeyFrame {
    [percentage: string]: {
        opacity?: string | number;
        transform?: string;
        [property: string]: any;
    };
};

export interface IAnimationsKeyFrames {
    // Built-in animations
    "fade-in": IAnimationsKeyFrame;
    "fade-out": IAnimationsKeyFrame;

    "slide-in-left": IAnimationsKeyFrame;
    "slide-in-right": IAnimationsKeyFrame;
    "slide-in-top": IAnimationsKeyFrame;
    "slide-in-bottom": IAnimationsKeyFrame;

    "slide-out-left": IAnimationsKeyFrame;
    "slide-out-right": IAnimationsKeyFrame;
    "slide-out-top": IAnimationsKeyFrame;
    "slide-out-bottom": IAnimationsKeyFrame;

    "scale-in": IAnimationsKeyFrame;
    "scale-out": IAnimationsKeyFrame;

    "zoom-in": IAnimationsKeyFrame;
    "zoom-out": IAnimationsKeyFrame;

    "rotate": IAnimationsKeyFrame;
    "rotate-reverse": IAnimationsKeyFrame;

    "flip-horizontal": IAnimationsKeyFrame;
    "flip-vertical": IAnimationsKeyFrame;
}