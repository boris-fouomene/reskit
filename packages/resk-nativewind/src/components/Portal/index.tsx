"use client";
import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useEffect, useState, useRef, ReactNode, useId, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@utils/cn';
import { styles } from './utils';
import { IPortalProps } from './types';
import { normalizeGestureEvent } from '@html/events';
import allVariants from '@variants/all';
import { StyleSheet } from 'react-native';
import { classes } from '@variants/classes';
import { AccessibilityEscapeManager } from '@html/accessibility';

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
export function Portal({ children,onAccessibilityEscape, style, className, onPress, withBackdrop, visible, absoluteFill, id, testID }: IPortalProps) {
    const [mounted, setMounted] = useState(false);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
    const createdElementRef = useRef<HTMLElement | null>(null);
    const uId = useId();
    const targetId = defaultStr(id, uId);
    const target = `#${targetId}`;
    useEffect(()=>{
        if(typeof onAccessibilityEscape === "function" && targetElement){
            const bindEvent= AccessibilityEscapeManager.getInstance().register(targetElement, onAccessibilityEscape);
            return ()=>{
                bindEvent?.remove();
            }
        }
    },[targetElement,onAccessibilityEscape]);
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
        const hasOnPress = typeof onPress == "function";
        element.className = cn(absoluteFill && classes.absoluteFill, hasOnPress && "pointer-events-auto", "portal", allVariants({ backdrop: withBackdrop }), className);
        element.setAttribute("data-testid", defaultStr(testID, "portal-" + targetId));
        element.style.pointerEvents = "box-only";
        const stylesProp = StyleSheet.flatten([absoluteFill && styles.absoluteFill, style]) as any;
        applyReactStylesToDOM(element, stylesProp);
        if (hasOnPress) {
            element.onclick = function (event) {
                if (event.target !== element && event.currentTarget !== event.target) return
                onPress(normalizeGestureEvent(event as any));
            };
            element.style.cursor = "pointer";
        } else {
            element.style.cursor = "default";
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
    }, [target, targetId, className, absoluteFill, visible, testID, onPress]);
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


type ReactCSSProperties = CSSProperties;

// Type for DOM style properties
type DOMStyleProperties = Partial<CSSStyleDeclaration>;

// Properties that should remain as numbers (px will be added automatically by DOM)
const numericProperties = new Set([
    'zIndex', 'opacity', 'fontWeight', 'lineHeight', 'zoom', 'order',
    'flexGrow', 'flexShrink', 'columnCount', 'fillOpacity', 'strokeOpacity',
    'strokeMiterlimit', 'strokeDasharray', 'strokeDashoffset'
]);

/**
 * Converts React CSS properties to DOM style properties
 * Handles camelCase to kebab-case conversion, vendor prefixes, and value normalization
 */
export function reactCSSToDOM(reactStyles: ReactCSSProperties): DOMStyleProperties {
    const domStyles: DOMStyleProperties = {};

    // Special cases mapping - React prop name to DOM property name
    const specialCases: Record<string, string> = {
        // CSS custom properties (already correct)
        // Vendor prefixes
        WebkitTransform: 'webkitTransform',
        WebkitTransition: 'webkitTransition',
        WebkitAnimation: 'webkitAnimation',
        WebkitFilter: 'webkitFilter',
        WebkitBackdropFilter: 'webkitBackdropFilter',
        WebkitClipPath: 'webkitClipPath',
        WebkitMask: 'webkitMask',
        MozTransform: 'mozTransform',
        MozTransition: 'mozTransition',
        MozAnimation: 'mozAnimation',
        MozFilter: 'mozFilter',
        MsTransform: 'msTransform',
        MsTransition: 'msTransition',
        MsAnimation: 'msAnimation',
        MsFilter: 'msFilter',

        // Special React properties
        cssFloat: 'float',
        cssText: 'cssText',
    };


    // Convert camelCase to kebab-case
    function camelToKebab(str: string): string {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    // Convert React CSS value to DOM CSS value
    function convertValue(key: string, value: any): string {
        if (value === null || value === undefined) {
            return '';
        }

        // Handle CSS custom properties (CSS variables)
        if (key.startsWith('--')) {
            return String(value);
        }

        // Handle numbers
        if (typeof value === 'number') {
            if (value === 0) {
                return '0';
            }

            // Properties that should remain unitless
            if (numericProperties.has(key)) {
                return String(value);
            }

            // Add 'px' unit for other numeric values
            return `${value}px`;
        }

        // Handle strings
        if (typeof value === 'string') {
            return value;
        }

        // Handle arrays (for multiple values like transform)
        if (Array.isArray(value)) {
            return value.join(' ');
        }

        // Fallback: convert to string
        return String(value);
    }

    // Process each style property
    Object.entries(reactStyles).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }
        // Handle CSS custom properties (CSS variables)
        if (key.startsWith('--')) {
            (domStyles as any)[key] = convertValue(key, value);
            return;
        }
        // Check for special cases first
        if (specialCases[key]) {
            const domKey = specialCases[key];
            (domStyles as any)[domKey] = convertValue(key, value);
            return;
        }
        // Handle vendor prefixes (keep camelCase for DOM)
        if (key.startsWith('Webkit') || key.startsWith('Moz') || key.startsWith('Ms') || key.startsWith('O')) {
            (domStyles as any)[key] = convertValue(key, value);
            return;
        }

        // Convert camelCase to DOM property name
        let domKey: string;

        // For most properties, we use camelCase in DOM as well
        // but some need special handling
        if (key === 'cssFloat') {
            domKey = 'float';
        } else {
            domKey = key; // DOM style properties are actually camelCase too
        }

        (domStyles as any)[domKey] = convertValue(key, value);
    });

    return domStyles;
}

/**
 * Applies React CSS properties directly to a DOM element
 * @param element - The DOM element to apply styles to
 * @param styles - React CSS properties object
 */
export function applyReactStylesToDOM(element: HTMLElement, styles: ReactCSSProperties): void {
    const domStyles = reactCSSToDOM(styles);
    Object.entries(domStyles).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            (element.style as any)[key] = value;
        }
    });
}