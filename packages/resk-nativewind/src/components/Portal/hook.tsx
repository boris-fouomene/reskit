import { isNumber } from "@resk/core/utils";
import { useEffect, useState } from "react";

/**
 * A React hook that manages the mounting and unmounting timing for portal components with animation support.
 * 
 * This hook is designed to solve the common problem of animating portal content (modals, tooltips, dropdowns)
 * where the component needs to remain mounted during exit animations before being removed from the DOM.
 * 
 * The hook provides intelligent timing control:
 * - **Immediate mounting**: When `visible` becomes `true`, returns `true` immediately
 * - **Delayed unmounting**: When `visible` becomes `false`, waits for `unmountDelay` before returning `false`
 * - **Timer management**: Automatically clears pending timers if `visible` changes back to `true`
 * - **Input validation**: Sanitizes the `unmountDelay` parameter to ensure valid behavior
 * 
 * @param params - Configuration object containing visibility state and unmount delay
 * @returns Boolean indicating whether the portal content should be rendered
 * 
 * @example
 * Basic usage in a modal component:
 * ```tsx
 * function Modal({ isOpen, onClose, children }) {
 *   const shouldRender = useShouldRenderPortal({ 
 *     visible: isOpen, 
 *     unmountDelay: 300 
 *   });
 * 
 *   if (!shouldRender) return null;
 * 
 *   return createPortal(
 *     <div className={`modal ${isOpen ? 'modal-enter' : 'modal-exit'}`}>
 *       {children}
 *     </div>,
 *     document.body
 *   );
 * }
 * ```
 * 
 * 
 * @example
 * Advanced usage with dynamic delay:
 * ```tsx
 * function AnimatedTooltip({ show, animationDuration = 200, children }) {
 *   const shouldRender = useShouldRenderPortal({ 
 *     visible: show, 
 *     unmountDelay: animationDuration 
 *   });
 * 
 *   return shouldRender ? createPortal(
 *     <div 
 *       className={`tooltip transition-opacity duration-${animationDuration} ${
 *         show ? 'opacity-100' : 'opacity-0'
 *       }`}
 *     >
 *       {children}
 *     </div>,
 *     document.body
 *   ) : null;
 * }
 * ```
 * 
 * @see {@link https://reactjs.org/docs/portals.html | React Portals Documentation}
 * 
 * @since 1.0.0
 */
export function useShouldRenderPortal({ visible, unmountDelay }: { visible?: boolean, unmountDelay?: number }) {
    const [shouldRender, setShouldRender] = useState(visible);
    unmountDelay = isNumber(unmountDelay) && unmountDelay >= 0 ? unmountDelay : 0;
    useEffect(() => {
        if (visible) {
            if (!shouldRender) {
                setShouldRender(true);
            }
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, unmountDelay);
            return () => clearTimeout(timer);
        }
    }, [visible, unmountDelay]);
    return shouldRender;
}