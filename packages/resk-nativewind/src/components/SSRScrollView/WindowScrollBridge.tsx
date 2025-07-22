'use client';

import { useEffect } from 'react';

/**
 * Props interface for the WindowScrollBridge component.
 * 
 * This component bridges SSRScrollView container scrolling with window scroll events.
 * It finds its parent SSRScrollView by class selector and syncs scroll events.
 * 
 * @public
 * @interface IWindowScrollBridgeProps
 * @since 1.0.0
 */
export interface IWindowScrollBridgeProps {
    /**
     * Callback function that fires on scroll events.
     * 
     * @param scrollTop - The current scroll position
     * @param event - The scroll event object
     */
    onScroll?: (scrollTop: number, event: Event) => void;

    /**
     * Callback function that fires when scrolling reaches the top.
     */
    onScrollToTop?: () => void;

    /**
     * Callback function that fires when scrolling reaches the bottom.
     */
    onScrollToBottom?: () => void;

    /**
     * Threshold in pixels for determining when scroll has reached top/bottom.
     * 
     * @defaultValue 10
     */
    threshold?: number;

    /**
     * Throttle delay in milliseconds for scroll event handling.
     * 
     * @defaultValue 16 (roughly 60fps)
     */
    throttleDelay?: number;

    /**
     * Enable smooth scrolling behavior on the container.
     * 
     * @defaultValue false
     */
    enableSmoothScroll?: boolean;
}

/**
 * Client-side bridge component that connects SSRScrollView to window scroll events.
 * 
 * @remarks
 * This component must be rendered as a child of SSRScrollView. It will automatically
 * find its parent SSRScrollView container using class selectors and bind scroll events
 * to it. This allows the SSRScrollView to trigger window-like scroll events while
 * maintaining cross-platform compatibility.
 * 
 * The component renders nothing (null) and only provides scroll event handling
 * through side effects.
 * 
 * @public
 * @component
 * @since 1.0.0
 * 
 * @param props - Configuration object of type {@link IWindowScrollBridgeProps}
 * @returns null (renders nothing, only provides side effects)
 * 
 * @example Basic Usage
 * ```tsx
 * import { SSRScrollView } from '@resk/nativewind/components';
 * import { WindowScrollBridge } from '@resk/nativewind/components/SSRScrollView';
 * 
 * function MyPage() {
 *   const [scrollTop, setScrollTop] = useState(0);
 *   
 *   return (
 *     <SSRScrollView className="min-h-screen">
 *       <WindowScrollBridge 
 *         onScroll={(scrollTop) => {
 *           setScrollTop(scrollTop);
 *           // Also sync with window object for external libraries
 *           Object.defineProperty(window, 'scrollY', { value: scrollTop });
 *         }}
 *         enableSmoothScroll={true}
 *       />
 *       
 *       <div className="space-y-8">
 *         <p>Scroll position: {scrollTop}px</p>
 *         <section className="h-screen bg-blue-100">Section 1</section>
 *         <section className="h-screen bg-green-100">Section 2</section>
 *       </div>
 *     </SSRScrollView>
 *   );
 * }
 * ```
 */
export const WindowScrollBridge: React.FC<IWindowScrollBridgeProps> = ({
    onScroll,
    onScrollToTop,
    onScrollToBottom,
    threshold = 10,
    throttleDelay = 16,
    enableSmoothScroll = false,
}) => {
    useEffect(() => {
        // Find the parent SSRScrollView container
        const findSSRScrollViewContainer = (): HTMLElement | null => {
            // Look for parent with SSRScrollView class
            let element = document.currentScript?.parentElement;
            if (!element) {
                // Fallback: find by class selector
                const containers = document.querySelectorAll('[class*="ssr-scroll"], [data-component="SSRScrollView"]');
                if (containers.length > 0) {
                    element = containers[0] as HTMLElement;
                }
            }
            // Search up the DOM tree for SSRScrollView container
            while (element) {
                if (
                    element.className?.includes('ssr-scroll') ||
                    element.dataset?.component === 'SSRScrollView' ||
                    element.style?.overflowY === 'auto' ||
                    element.style?.overflowY === 'scroll'
                ) {
                    return element;
                }
                element = element.parentElement;
            }

            // Fallback to body if no container found
            return document.body;
        };

        const container = findSSRScrollViewContainer();
        if (!container) return;

        // Apply smooth scrolling if requested
        if (enableSmoothScroll) {
            container.style.scrollBehavior = 'smooth';
        }

        if (!onScroll && !onScrollToTop && !onScrollToBottom) {
            return; // No handlers provided
        }

        let timeoutId: NodeJS.Timeout | null = null;
        let lastScrollTop = container.scrollTop;

        const handleScroll = (event: Event) => {
            // Throttle the scroll event
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                const currentScrollTop = container.scrollTop;
                const containerHeight = container.clientHeight;
                const contentHeight = container.scrollHeight;

                // Call the general scroll callback
                if (onScroll) {
                    onScroll(currentScrollTop, event);
                }

                // Check if scrolled to top
                if (onScrollToTop && currentScrollTop <= threshold && lastScrollTop > threshold) {
                    onScrollToTop();
                }

                // Check if scrolled to bottom
                if (onScrollToBottom) {
                    const distanceFromBottom = contentHeight - (currentScrollTop + containerHeight);
                    if (distanceFromBottom <= threshold) {
                        onScrollToBottom();
                    }
                }

                lastScrollTop = currentScrollTop;
            }, throttleDelay);
        };
        // Add scroll event listener to the container
        container.addEventListener('scroll', handleScroll, { passive: true });
        // Cleanup
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (enableSmoothScroll) {
                container.style.scrollBehavior = '';
            }
        };
    }, [onScroll, onScrollToTop, onScrollToBottom, threshold, throttleDelay, enableSmoothScroll]);
    // This component renders nothing, it only provides side effects
    return null;
};

WindowScrollBridge.displayName = 'WindowScrollBridge';

export default WindowScrollBridge;
