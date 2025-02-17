import React, { useContext } from "react";
import { IReskExpoContext } from "./types";
/**
 * @group ReskExpoProvider
 * Creates a context for the ReskExpoProvider.
 * This context will hold the current theme and the method to update it.
 * 
 * @type {React.Context<IReskExpoContext>} 
 * 
 * **Example**:
 * ```tsx
 * const contextValue: IReskExpoContext = {
 *   theme: {
 *     primaryColor: '#6200ee',
 *     secondaryColor: '#03dac6',
 *   },
 *   updateTheme: (newTheme) => { },
 * };
 * 
 * <ReskExpoContext.Provider value={contextValue}>
 *   <YourComponent />
 * </ReskExpoContext.Provider>
 * ```
 */
export const ReskExpoContext = React.createContext<IReskExpoContext>({} as IReskExpoContext);

/**
 * @group ReskExpoProvider
 * Custom hook to access the ReskExpoProvider context.
 * This hook allows components to consume the context value easily.
 * 
 * @returns {IReskExpoContext} The current context value, which includes the theme and updateTheme method.
 * 
 * **Example**:
 * ```tsx
 * const YourComponent: React.FC = () => {
 *   const { theme, updateTheme } = useReskExpo();
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
export const useReskExpo = () => {
    return useContext(ReskExpoContext);
};

