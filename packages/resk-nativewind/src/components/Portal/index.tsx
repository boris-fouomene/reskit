

/**
 * PortalProvider component for React Native Web and SSR/CSR environments.
 *
 * This component is a placeholder provider for portal context. On web, it simply renders its children directly.
 * In a more advanced setup, it could provide context for managing multiple portals, stacking, or SSR hydration.
 *
 * @param props - The provider props.
 * @param props.children - The React children to render inside the provider.
 *
 * @returns The rendered children, unchanged.
 *
 * @example
 * ```tsx
 * import { PortalProvider, Portal } from "@resk/nativewind/components/Portal";
 *
 * // Wrap your app to enable portal support (optional for web)
 * <PortalProvider>
 *   <App />
 * </PortalProvider>
 * ```
 *
 * @remarks
 * - On web, this provider is a no-op and simply returns its children.
 * - For React Native or advanced SSR, you may extend this provider to manage portal roots or stacking.
 * - Use together with the {@link Portal} component to render modals, overlays, or tooltips outside the main DOM hierarchy.
 *
 * @see {@link Portal}
 *
 * @public
 */
export function PortalProvider({ children }: { children?: React.ReactNode }) {
    return children;
}
export { Portal } from "./WebPortal"; 