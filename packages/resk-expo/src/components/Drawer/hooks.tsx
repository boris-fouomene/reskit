import { createContext, useContext } from "react";
import { IDrawerContext, IDrawerCurrentState, IDrawerEvent } from "./types";



/**
 * Context for the Drawer component.
 * 
 * This context provides the necessary state and functions for managing the Drawer component.
 * 
 * @type {IDrawerContext} The type definition for the Drawer context.
 */
export const DrawerContext = createContext<IDrawerContext>({} as IDrawerContext);


/**
 * Custom hook to access the Drawer context.
 *
 * This hook provides access to the Drawer context, which contains the state and actions
 * related to the Drawer component. If the context is not available, it returns a default
 * context with `drawer` set to `null`.
 *
 * @returns {IDrawerContext} The Drawer context.
 */
export const useDrawer = () => {
  const context = useContext(DrawerContext) || { drawer: null };
  return context as IDrawerContext;
};


/**
 * @function useDrawerCurrentState
 * Custom hook to get the current state options of the drawer.
 *
 * @param {IDrawerEvent | IDrawerEvent[]} [event] - Optional event or array of events to filter the drawer state.
 * @returns {IDrawerCurrentState | null} The current state options of the drawer, or null if not available.
 */
export const useDrawerCurrentState = (event?: IDrawerEvent | IDrawerEvent[]): IDrawerCurrentState | null => {
  const { drawer } = useDrawer();
  return drawer?.getStateOptions() || null;
}