import { createContext } from "react";
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