import { createContext, useContext } from "react";
import { IReskNativeContext } from "./types";
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
export const ReskNativeContext = createContext<IReskNativeContext>({} as IReskNativeContext);


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