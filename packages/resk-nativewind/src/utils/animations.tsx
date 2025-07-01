"use client";
import { isNumber } from '@resk/core/utils';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import useStateCallback from './stateCallback';
import { Platform } from '..';
import { isNextJs } from '@platform/isNext';

/**
 * A React hook that manages component mounting and unmounting with delayed unmount support.
 * 
 * This hook is particularly useful for components that need exit animations. It keeps the component
 * mounted in the DOM for a specified duration after `visible` becomes false, allowing CSS transitions
 * or animations to complete before the component is removed.
 * 
 * @param params - Configuration object for the hook
 * @returns Object containing render and animation state
 * 
 * @example
 * Basic usage with CSS transitions:
 * ```tsx
 * function AnimatedModal({ isOpen }: { isOpen: boolean }) {
 *   const { shouldRender, isAnimating } = useDelayedUnmount({
 *     visible: isOpen,
 *     duration: 300 // 300ms for exit animation
 *   });
 * 
 *   if (!shouldRender) return null;
 * 
 *   return (
 *     <div className={`modal ${isAnimating ? 'modal-enter' : 'modal-exit'}`}>
 *       Modal content
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * With CSS classes for enter/exit states:
 * ```tsx
 * function FadeInOut({ show, children }: { show: boolean; children: React.ReactNode }) {
 *   const { shouldRender, isAnimating } = useDelayedUnmount({
 *     visible: show,
 *     duration: 250
 *   });
 * 
 *   if (!shouldRender) return null;
 * 
 *   return (
 *     <div 
 *       className={`transition-opacity duration-250 ${
 *         isAnimating ? 'opacity-100' : 'opacity-0'
 *       }`}
 *     >
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * Without delay (immediate unmount):
 * ```tsx
 * function SimpleToggle({ visible }: { visible: boolean }) {
 *   const { shouldRender, isAnimating } = useDelayedUnmount({ visible });
 *   
 *   // shouldRender and isAnimating will have the same value when duration is 0
 *   return shouldRender ? <div>Content</div> : null;
 * }
 * ```
 * 
 * @remarks
 * **Behavior:**
 * - When `visible` changes from `false` to `true`: `shouldRender` becomes `true` immediately, 
 *   then `isAnimating` becomes `true` on the next frame
 * - When `visible` changes from `true` to `false`: `isAnimating` becomes `false` immediately, 
 *   then `shouldRender` becomes `false` after the specified duration
 * - The hook automatically cleans up timers when the component unmounts or when `visible` changes
 * 
 * **Animation Timing:**
 * - Use `shouldRender` to control whether the component exists in the DOM
 * - Use `isAnimating` to control CSS classes, styles, or animation states
 * - The `duration` should match your CSS transition/animation duration
 * 
 * @since 1.0.0
 */
export function useAnimatedVisibility({ visible, duration = 0 }: { visible?: boolean; duration?: number }): IUseAnimatedVisibilityResult {
    visible = !!visible;
    duration = isNumber(duration) && duration > 0 ? duration : 0;
    const [shouldRender, setShouldRender] = useStateCallback(visible && !isNextJs());
    const [isAnimating, setIsAnimating] = useStateCallback(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Clear any existing timeout
    const cleanTimeoutRef = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }
    useEffect(() => {
        cleanTimeoutRef();
        if (visible) {
            // First render the component
            setShouldRender(true, () => {
                // Use RAF + timeout for more reliable animation triggering
                requestAnimationFrame(() => {
                    timeoutRef.current = setTimeout(() => {
                        setIsAnimating(true);
                    }, 16); // One frame delay (≈16ms at 60fps)
                })
            });
        } else {
            // Start exit animation immediately
            setIsAnimating(false);
            // Remove from DOM after animation completes
            timeoutRef.current = setTimeout(() => {
                setShouldRender(false);
            }, duration);
        }
        return cleanTimeoutRef;
    }, [visible, duration, setShouldRender, setIsAnimating]);

    // Cleanup on unmount
    useEffect(() => {
        if (visible && !shouldRender) {
            setShouldRender(true);
        }
        return cleanTimeoutRef;
    }, []);
    return { shouldRender, isAnimating };
};

/**
 * The result object returned by {@link useAnimatedVisibility}, describing the current render and animation state.
 *
 * @property shouldRender - Whether the component should be rendered in the DOM. Use this to conditionally mount/unmount your component.
 * @property isAnimating - Whether the component is currently in its "enter" (visible) animation state. Use this to control CSS classes or animation logic.
 *
 * @example
 * // Basic usage with a modal and CSS transitions
 * function AnimatedModal({ isOpen }: { isOpen: boolean }) {
 *   const { shouldRender, isAnimating } = useAnimatedVisibility({
 *     visible: isOpen,
 *     duration: 300 // ms
 *   });
 *   if (!shouldRender) return null;
 *   return (
 *     <div className={isAnimating ? "modal-enter" : "modal-exit"}>
 *       Modal content
 *     </div>
 *   );
 * }
 *
 * @example
 * // Fade in/out a component with Tailwind classes
 * function FadeInOut({ show, children }: { show: boolean; children: React.ReactNode }) {
 *   const { shouldRender, isAnimating } = useAnimatedVisibility({
 *     visible: show,
 *     duration: 250
 *   });
 *   if (!shouldRender) return null;
 *   return (
 *     <div className={`transition-opacity duration-250 ${isAnimating ? "opacity-100" : "opacity-0"}`}>
 *       {children}
 *     </div>
 *   );
 * }
 *
 * @see useAnimatedVisibility
 * @since 1.0.0
 */
export interface IUseAnimatedVisibilityResult {
    /** Whether the component should be rendered. */
    shouldRender: boolean;
    /** Whether the component is currently animating. */
    isAnimating: boolean;
}