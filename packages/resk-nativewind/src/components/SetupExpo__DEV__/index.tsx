"use client";
import { getGlobal } from "@resk/core/utils";
import { useEffect } from "react";

/**
 * React component to set up the global `__DEV__` flag for Expo and Next.js development environments.
 *
 * This component ensures that the `__DEV__` flag is available globally (on both the global object and `window`)
 * when running in a development environment. It is useful for libraries or apps that need to check if they are
 * running in development mode, especially in Expo, React Native, or Next.js projects.
 *
 * The flag is determined by checking `process.env.NODE_ENV` and `process.env.NEXT_PUBLIC_NODE_ENV`.
 * The setup is performed both on mount (via `useEffect`) and immediately during render to ensure the flag is set
 * as early as possible.
 *
 * @component
 * @returns {null} This component does not render any UI.
 *
 * @example
 * ```tsx
 * // Place this component at the root of your app (layout.tsx) to ensure __DEV__ is set globally   
 * import { SetupExpo__DEV__ } from "@resk/nativewind";
 * 
 * export default function App() {
 *   return (
 *     <>
 *       <SetupExpo__DEV__ />
 *       <YourAppComponents />
 *     </>
 *   );
 * }
 * 
 * // Later in your code, you can check the global __DEV__ flag:
 * if (globalThis.__DEV__) {
 *   console.log("Running in development mode!");
 * }
 * ```
 *
 * @remarks
 * - This component is intended for use in development environments only.
 * - It is safe to include in production, but the `__DEV__` flag will be set to `false`.
 * - Useful for conditional logging, debugging, or enabling development-only features.
 */
export function SetupExpo__DEV__() {
    const setupDev = () => {
        const __DEV__ = (process.env.NODE_ENV === "development") || (process.env.NEXT_PUBLIC_NODE_ENV === "development");
        const globalObj = getGlobal();
        (globalObj as any).__DEV__ = __DEV__;
        if (typeof window !== "undefined") {
            (window as any).__DEV__ = __DEV__;
        }
    }
    useEffect(() => {
        setupDev();
    }, []);
    setupDev();
    return null;
}