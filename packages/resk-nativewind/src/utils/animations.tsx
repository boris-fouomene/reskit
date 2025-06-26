"use client";
import { isNumber } from '@resk/core/utils';
import { useState, useEffect } from 'react';

/**
 * Custom React hook to handle animated mounting and unmounting of components.
 *
 * This hook is useful for triggering entrance and exit animations when a component's visibility changes.
 * It manages the rendering state and animation state, allowing you to smoothly animate components in and out of the DOM.
 *
 * @param {Object} params - The parameters object.
 * @param {boolean} params.visible - Controls whether the component should be visible (mounted) or hidden (unmounted).
 * @param {number} [params.duration=0] - The duration (in milliseconds) of the exit animation before the component is unmounted.
 *
 * @returns {Object} An object containing:
 * - `shouldRender` (`boolean`): Indicates if the component should be rendered in the DOM.
 * - `isAnimating` (`boolean`): Indicates if the animation is currently active.
 *
 * @example
 * ```tsx
 * const { shouldRender, isAnimating } = useAnimatedMount({ visible: showModal, duration: 500 });
 *
 * return shouldRender ? (
 *   <div className={isAnimating ? 'fade-in' : 'fade-out'}>
 *     Animated Content
 *   </div>
 * ) : null;
 * ```
 *
 * @remarks
 * - The `shouldRender` flag ensures the component remains in the DOM during exit animations.
 * - The `isAnimating` flag can be used to toggle CSS classes or animation states.
 * - Make sure to match the `duration` prop with your CSS animation duration for seamless transitions.
 *
 * @see {@link https://react.dev/reference/react/useEffect | React useEffect}
 * @see {@link https://react.dev/reference/react/useState | React useState}
 */
export function useAnimatedMount({ visible, duration = 0 }: { visible?: boolean; duration?: number }) {
    visible = !!visible;
    duration = isNumber(duration) && duration > 0 ? duration : 0;
    const [shouldRender, setShouldRender] = useState(visible);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            requestAnimationFrame(() => setIsAnimating(true));
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setShouldRender(false), duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration]);
    return { shouldRender, isAnimating };
};