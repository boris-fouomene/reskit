import { IModalProps } from "@components/Modal/types";
import { IHtmlDivProps } from "@html/types";


/**
 * Represents the properties for the `Portal` component.
 *
 * The `Portal` component allows you to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
 * It is commonly used for modals, tooltips, popovers, and overlays.
 *
 * @example
 * ```tsx
 * <Portal absoluteFill withBackdrop>
 *   <div>Content inside the portal</div>
 * </Portal>
 * ```
 *
 * @remarks
 * - Extends all properties from {@link IHtmlDivProps}.
 * - Useful for rendering UI elements that need to visually break out of their parent container.
 *
 * @see {@link https://react.dev/reference/react-dom/createPortal | React Portals Documentation}
 */
export interface IPortalProps extends IHtmlDivProps {

    /**
     * If `true`, the portal will fill the entire viewport using absolute positioning.
     *
     * This is useful for overlays, modals, or any content that should cover the whole screen.
     *
     * @defaultValue false
     *
     * @example
     * ```tsx
     * <Portal absoluteFill>
     *   <ModalContent />
     * </Portal>
     * ```
     */
    absoluteFill?: boolean;

    /**
     * If `true`, a backdrop will be rendered behind the portal content.
     *
     * The backdrop is typically a semi-transparent overlay that covers the rest of the UI, preventing interaction with underlying elements.
     *
     * @defaultValue false
     *
     * @example
     * ```tsx
     * <Portal withBackdrop>
     *   <Dialog />
     * </Portal>
     * ```
     *
     * @remarks
     * - The appearance and behavior of the backdrop can be customized via CSS or additional props.
     */
    withBackdrop?: boolean;
}