import * as React from "react";
import { useContext } from "react";
import { IReskNativeContext } from "./types";
import { ReskNativeEvents } from "./events";
import Platform from "@resk/core/platform";
/**
 * @group ReskNativeProvider
 * Creates a context for the ReskNativeProvider.
 * This context will hold the current theme and the method to update it.
 * 
 * @type {React.Context<IReskNativeContext>} 
 * 
 * **Example**:
 * ```tsx
 * const contextValue: IReskNativeContext = {
 *   theme: {
 *     primaryColor: '#6200ee',
 *     secondaryColor: '#03dac6',
 *   },
 *   updateTheme: (newTheme) => { },
 * };
 * 
 * <ReskNativeContext.Provider value={contextValue}>
 *   <YourComponent />
 * </ReskNativeContext.Provider>
 * ```
 */
export const ReskNativeContext = React.createContext<IReskNativeContext>({} as IReskNativeContext);

/**
 * @group ReskNativeProvider
 * Custom hook to access the ReskNativeProvider context.
 * This hook allows components to consume the context value easily.
 * 
 * @returns {IReskNativeContext} The current context value, which includes the theme and updateTheme method.
 * 
 * **Example**:
 * ```tsx
 * const YourComponent: React.FC = () => {
 *   const { theme, updateTheme } = useReskNative();
 * 
 *   return (
 *     <div style={{ backgroundColor: theme.primaryColor }}>
 *       <h1 style={{ color: theme.secondaryColor }}>Hello, World!</h1>
 *       <button onClick={() => updateTheme({ primaryColor: '#3f51b5', secondaryColor: '#f44336' })}>
 *         Change Theme
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useReskNative = () => {
    const context = useContext(ReskNativeContext);
    return context;
};


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
    const [isReady, setIsReady] = React.useState(typeof isAppReady == "boolean" ? isAppReady : Platform.isClientSide());

    React.useEffect(() => {
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