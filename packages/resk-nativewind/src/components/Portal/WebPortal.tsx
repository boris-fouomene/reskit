"use client";

import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useEffect, useId, useMemo, useState } from 'react';

import { Div } from '@html/Div';
import { IPortalProps } from './types';
import { StyleSheet } from 'react-native';
import { cn } from '@utils/cn';
import { commonVariant } from '@variants/common';
import { createPortal } from 'react-dom';
import { useAccessibilityEscape } from '@html/accessibility';

/**
 * Web Portal component for rendering children into a React portal with accessibility and z-index management.
 *
 * This component renders its children into a DOM node outside the parent hierarchy, typically used for modals, overlays, or tooltips.
 * It manages z-index stacking, accessibility escape handling, and supports optional backdrop styling.
 *
 * @param props - {@link IPortalProps} All portal configuration options and standard HTML/React props.
 * - `children`: The content to render inside the portal.
 * - `onAccessibilityEscape`: Callback for accessibility escape events (e.g., screen reader "escape" gesture).
 * - `style`: Custom style object for the portal container.
 * - `withBackdrop`: If `true`, applies a backdrop style to the portal.
 * - `id`: Optional DOM id for the portal container.
 * - `className`: Additional class names for styling.
 * - `testID`: Test identifier for testing frameworks.
 * - ...props: Any other props are spread to the portal container.
 *
 * @returns The rendered portal as a React element, or `null` if not in a browser environment.
 *
 * @example
 * ```tsx
 * import { Portal } from "@resk/nativewind/components/Portal";
 *
 * // Basic modal usage
 * <Portal withBackdrop>
 *   <ModalContent />
 * </Portal>
 *
 * // Custom z-index and accessibility escape
 * <Portal
 *   style={{ zIndex: 2000 }}
 *   onAccessibilityEscape={() => setOpen(false)}
 * >
 *   <Dialog />
 * </Portal>
 * ```
 *
 * @remarks
 * - The portal is rendered into `#reskit-app-root` if present, otherwise into `document.body`.
 * - Z-index is automatically managed to ensure the portal appears above other content.
 * - Accessibility escape is handled via {@link useAccessibilityEscape}.
 * - The portal will not render on the server or if `document` is unavailable.
 * - Backdrop styling is controlled by the `withBackdrop` prop and the `commonVariant` utility.
 *
 * @see {@link IPortalProps}
 * @see {@link useAccessibilityEscape}
 * @see {@link createPortal}
 * @see {@link commonVariant}
 *
 * @public
 */
export function Portal({ children, onAccessibilityEscape, style, withBackdrop, id, className, testID, ...props }: IPortalProps) {
    const [shouldRender, setShouldRender] = useState(!!(typeof document !== "undefined" && document));
    const isRendable = shouldRender && typeof document !== "undefined" && document;
    useEffect(() => {
        if (!shouldRender) {
            setShouldRender(true);
        }
    }, []);
    const uId = useId();
    const targetId = defaultStr(id, uId);
    const zIndex = useMemo(() => {
        if(!isRendable) return 0;
        return Math.max(getMaxZindex(), 1000) + 1;
    }, [isRendable]);
    useAccessibilityEscape(targetId, onAccessibilityEscape);
    if (!isRendable) return null;
    testID = defaultStr(testID, "resk-portal");
    return createPortal(<Div
        id={targetId}
        testID={testID}
        {...props}
        style={StyleSheet.flatten([{ zIndex }, style])}
        className={cn("resk-portal", commonVariant({ backdrop: withBackdrop }), className)}
    >
        {children}
    </Div>, document.querySelector("#reskit-app-root") || document.body);
}