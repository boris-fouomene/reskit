"use client";
import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useEffect, useState, useRef, ReactNode, useId } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@utils/cn';
import { absoluteClassName } from './utils';
import { IPortalProps } from './types';


/**
 * A component that renders children into a DOM node that is not a descendant of the parent component.
 * It can be used to create a portal to a DOM node outside of the React component tree.
 * @param {{ children: ReactNode, className?: string, visible?: boolean, absoluteFill?: boolean, id?: string, testID?: string }} props
 * @returns {ReactNode}
 * @example
 * import { Portal } from '@resk/components'
 *
 * const MyComponent = () => {
 *   return (
 *     <Portal visible={true} absoluteFill={true}>
 *       <div>My Portal Content</div>
 *     </Portal>
 *   )
 * }
 */
export function Portal({ children, className, visible, absoluteFill, id, testID }: IPortalProps) {
    const [mounted, setMounted] = useState(false);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
    const createdElementRef = useRef<HTMLElement | null>(null);
    const uId = useId();
    const targetId = defaultStr(id, uId);
    const target = `#${targetId}`;
    useEffect(() => {
        // Only run on client side
        setMounted(true);
        if (!visible) {
            if (targetElement) {
                setTargetElement(null);
            }
            return;
        }
        let element: HTMLElement | null = document.querySelector(target) as HTMLElement;
        // Create target if it doesn't exist and createTarget is true
        if (!element) {
            element = document.createElement('div');
            document.body.appendChild(element);
            createdElementRef.current = element;
        }
        element.id = targetId;
        element.style.zIndex = String(Math.max(getMaxZindex(), 1000));
        element.className = cn(absoluteFill && absoluteClassName, className);
        element.setAttribute("data-testid", defaultStr(testID, "portal-" + targetId));
        if (absoluteFill) {
            element.style.position = "fixed";
            element.style.top = "0";
            element.style.left = "0";
            element.style.right = "0";
            element.style.bottom = "0";
            element.style.flex = "1";
        } else {
            element.style.position = "";
            element.style.top = "auto";
            element.style.left = "auto";
            element.style.right = "auto";
            element.style.bottom = "auto";
        }
        setTargetElement(element);

        // Cleanup function
        return () => {
            // Remove created element on unmount
            try {
                if (createdElementRef.current && createdElementRef.current.parentNode) {
                    createdElementRef.current.remove();
                    createdElementRef.current = null;
                }
            } catch (e) {
                console.log(e, " removing portal element")
            }
        };
    }, [target, targetId, className, absoluteFill, visible, testID]);
    // Don't render anything on server side or before mounting
    if (!mounted || !targetElement) {
        return null;
    }
    return createPortal(children, targetElement);
};


/**
 * The PortalProvider component is the base component for rendering Portal components.
 * It wraps the part of your application where you want to use portals, typically at the root of your component tree.
 * @example
 * const App = () => {
 *   return (
 *     <PortalProvider>
 *       <MainAppContent />
 *     </PortalProvider>
 *   );
 * };
 */
export function PortalProvider({ children }: { children?: ReactNode }) {
    return children;
}