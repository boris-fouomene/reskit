import { ReskNativeEvents } from "./events";
import Platform from "@resk/core/platform";
import { IReactComponent } from "@src/types";
import { IWithHOCOptions } from "@hooks/withHOC";
import { defaultStr, isNonNullString } from "@resk/core";
import { FC, isValidElement, useEffect, useState } from "react";

export { useReskNative } from "./context";

/**
 * A custom hook to determine if the application is ready.
 * 
 * The `useIsAppReady` hook listens for the `appReady` event emitted by `ReskNativeEvents` 
 * and updates its state accordingly. This hook is useful for components that need to 
 * render or perform actions only after the application is fully initialized.
 * 
 * @function useIsAppReady
 * 
 * @param {boolean} [isAppReady] - An optional boolean value to set the initial state of the readiness.
 * 
 * @returns {boolean} - A boolean value indicating whether the application is ready (`true`) or not (`false`).
 * 
 * @example
 * ```tsx
 * import { useIsAppReady } from "./hooks";
 * 
 * const App = () => {
 *   const isReady = useIsAppReady();
 * 
 *   if (!isReady) {
 *     return <LoadingScreen />;
 *   }
 * 
 *   return <MainApp />;
 * };
 * ```
 * 
 * @remarks
 * - The hook initializes the `isReady` state based on whether the platform is client-side.
 * - It subscribes to the `appReady` event using `ReskNativeEvents.events.on` and updates the state when the event is emitted.
 * - The subscription is cleaned up when the component using this hook is unmounted.
 * 
 * @see {@link ReskNativeEvents} for the event management system used in this hook.
 */
export const useIsAppReady = (isAppReady?: boolean) => {
    // Initialize the state to determine if the app is ready
    const [isReady, setIsReady] = useState(typeof isAppReady == "boolean" ? isAppReady : Platform.isClientSide());

    useEffect(() => {
        // Subscribe to the "appReady" event
        const appReady = ReskNativeEvents.events.on("appReady", () => {
            if (!isReady) {
                setIsReady(true); // Update the state when the event is emitted
            }
        });

        // Cleanup the subscription when the component is unmounted
        return () => {
            appReady?.remove();
        };
    }, [isReady]);

    // Return the readiness state
    return isReady;
};

/**
 * A custom hook to determine if the application is mounted.
 * 
 * The `useIsAppMounted` hook listens for the `appMounted` event emitted by `ReskNativeEvents`
 * and updates its state accordingly. This hook is useful for components that need to 
 * perform actions or render content only after the application has been mounted.
 * 
 * @function useIsAppMounted
 * 
 * @returns {boolean} - A boolean value indicating whether the application is mounted (`true`) or not (`false`).
 * 
 * @example
 * ```tsx
 * import { useIsAppMounted } from "./hooks";
 * 
 * const App = () => {
 *   const isMounted = useIsAppMounted();
 * 
 *   if (!isMounted) {
 *     return <LoadingScreen />;
 *   }
 * 
 *   return <MainApp />;
 * };
 * ```
 * 
 * @remarks
 * - The hook initializes the `isAppMounted` state to `false` by default.
 * - It subscribes to the `appMounted` event using `ReskNativeEvents.events.on` and updates the state when the event is emitted.
 * - The subscription is cleaned up when the component using this hook is unmounted.
 * 
 * @see {@link ReskNativeEvents} for the event management system used in this hook.
 */
export function useIsAppMounted() {
    // Initialize the state to determine if the app is mounted
    const [isAppMounted, setIsAppMounted] = useState(false);

    useEffect(() => {
        // Subscribe to the "appMounted" event
        const onAppMounted = ReskNativeEvents.events.on("appMounted", () => {
            setIsAppMounted(true); // Update the state when the event is emitted
        });

        // Cleanup the subscription when the component is unmounted
        return () => {
            onAppMounted?.remove();
        };
    }, []);
    // Return the mounted state
    return isAppMounted;
}

/**
 * A higher-order component (HOC) that ensures the wrapped component is only rendered
 * after the application has been mounted.
 * 
 * The `withAppMounted` HOC uses the `useIsAppMounted` hook to check if the application
 * is mounted. If the application is not mounted, it renders a fallback component or `null`.
 * 
 * @function withAppMounted
 * 
 * @template Props - The props type of the wrapped component.
 * @template State - The state type of the wrapped component.
 * 
 * @param {IReactComponent<Props, State>} Component - The component to wrap.
 * @param {IWithHOCOptions} [options] - Optional configuration for the HOC.
 * @param {ReactNode | (() => ReactNode)} [options.fallback] - A fallback component or function to render
 * while the application is not mounted.
 * @param {string} [options.displayName] - A custom display name for the HOC.
 * 
 * @returns {FC<Props>} - A functional component that wraps the provided component.
 * 
 * @example
 * ```tsx
 * import { withAppMounted } from "./hooks";
 * 
 * const MyComponent = () => <div>App is mounted!</div>;
 * 
 * const MyComponentWithAppMounted = withAppMounted(MyComponent, {
 *   fallback: <div>Loading...</div>,
 * });
 * 
 * export default MyComponentWithAppMounted;
 * ```
 * 
 * @remarks
 * - This HOC is useful for delaying the rendering of components until the application is fully mounted.
 * - The fallback can be a React element or a function that returns a React element.
 * 
 * @see {@link useIsAppMounted} for the hook used to determine the mounted state.
 */
export function withAppMounted<Props = any, State = any>(
    Component: IReactComponent<Props, State>,
    options?: IWithHOCOptions
): FC<Props> {
    const { fallback } = Object.assign({}, options);
    const fn = function (props: Props) {
        const isAppMounted = useIsAppMounted();
        if (!isAppMounted) {
            return typeof fallback === "function" ? fallback() : isValidElement(fallback) ? fallback : null;
        }
        const Component2: any = Component as any;
        return <Component2 {...props} />;
    };
    fn.displayName = defaultStr(
        options?.displayName,
        isNonNullString((Component as FC)?.displayName) && (Component as FC)?.displayName + "_WithAppMounted",
        Component?.constructor?.name || "WithAppMountedComponent"
    );
    return fn;
}

/**
 * A higher-order component (HOC) that ensures the wrapped component is only rendered
 * after the application is ready.
 * 
 * The `withAppReady` HOC uses the `useIsAppReady` hook to check if the application
 * is ready. If the application is not ready, it renders a fallback component or `null`.
 * 
 * @function withAppReady
 * 
 * @template Props - The props type of the wrapped component.
 * @template State - The state type of the wrapped component.
 * 
 * @param {IReactComponent<Props, State>} Component - The component to wrap.
 * @param {IWithHOCOptions} [options] - Optional configuration for the HOC.
 * @param {ReactNode | (() => ReactNode)} [options.fallback] - A fallback component or function to render
 * while the application is not ready.
 * @param {string} [options.displayName] - A custom display name for the HOC.
 * 
 * @returns {FC<Props>} - A functional component that wraps the provided component.
 * 
 * @example
 * ```tsx
 * import { withAppReady } from "./hooks";
 * 
 * const MyComponent = () => <div>App is ready!</div>;
 * 
 * const MyComponentWithAppReady = withAppReady(MyComponent, {
 *   fallback: <div>Initializing...</div>,
 * });
 * 
 * export default MyComponentWithAppReady;
 * ```
 * 
 * @remarks
 * - This HOC is useful for delaying the rendering of components until the application is fully initialized.
 * - The fallback can be a React element or a function that returns a React element.
 * 
 * @see {@link useIsAppReady} for the hook used to determine the readiness state.
 */
export function withAppReady<Props = any, State = any>(
    Component: IReactComponent<Props, State>,
    options?: IWithHOCOptions
): FC<Props> {
    const { fallback } = Object.assign({}, options);
    const fn = function (props: Props) {
        const isAppReady = useIsAppReady();
        if (!isAppReady) {
            return typeof fallback === "function" ? fallback() : isValidElement(fallback) ? fallback : null;
        }
        const Component2: any = Component as any;
        return <Component2 {...props} />;
    };
    fn.displayName = defaultStr(
        options?.displayName,
        isNonNullString((Component as FC)?.displayName) && (Component as FC)?.displayName + "_WithAppReady",
        Component?.constructor?.name || "WithAppReadyComponent"
    );
    return fn;
}