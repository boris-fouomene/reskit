"use client";
import { useEffect } from "react";
import { IAccessibilityEscapeHandler } from "./types";
import { isNonNullString } from "@resk/core/utils";

/**
 * React hook to handle the "Escape" key for accessibility purposes on a specific DOM element.
 *
 * This hook allows you to register a handler function that will be called when the "Escape" key is pressed,
 * as long as the specified target element exists in the DOM. It is useful for closing modals, dialogs,
 * dropdowns, or any interactive component that should respond to the "Escape" key for accessibility compliance.
 *
 * @param targetSelector - A CSS selector string that identifies the target element to listen for the "Escape" key event.
 * @param handler - A callback function to be executed when the "Escape" key is pressed.
 * @param dependencies - (Optional) An array of dependencies that will trigger the effect to re-run when changed.
 *
 * @remarks
 * - The hook will only attach the event listener if the `targetSelector` is a non-null string and the DOM is available.
 * - The handler will be removed automatically when the component unmounts or dependencies change.
 * - This hook is intended for client-side usage only.
 *
 * @example
 * ```tsx
 * import { useAccessibilityEscape } from "@resk/nativewind/html/accessibility";
 *
 * function Modal({ onClose }) {
 *   useAccessibilityEscape("#modal", onClose, []);
 *   return (
 *     <div id="modal" role="dialog" aria-modal="true">
 *       <p>Press Escape to close this modal.</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using with a dropdown menu
 * useAccessibilityEscape(".dropdown-menu", () => setOpen(false), [open]);
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector | MDN: Document.querySelector}
 * @see {@link https://react.dev/reference/react/useEffect | React: useEffect}
 *
 * @public
 */
export function useAccessibilityEscape(targetSelector: string, handler: IAccessibilityEscapeHandler, ...dependencies: any[]) {
    dependencies = Array.isArray(dependencies) ? dependencies : [];
    useEffect(() => {
        if (!isNonNullString(targetSelector) || typeof document == "undefined" || !document || !document.querySelector) return;
        const element = document.querySelector(targetSelector);
        if (element && typeof handler == "function") {
            const onAccessibilityEscape = (event: KeyboardEvent) => {
                if (String(event.key).toLowerCase() === 'escape') {
                    handler();
                }
            }
            document.addEventListener('keydown', onAccessibilityEscape);
            return () => document.removeEventListener('keydown', onAccessibilityEscape)
        }
    }, [handler, targetSelector, ...dependencies]);
}