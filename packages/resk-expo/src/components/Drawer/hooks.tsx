import { createContext, useContext } from "react";
import { E_DRAWER_EVENTS } from "./utils";
import { IDrawerContext, IDrawerStateOptions } from "./types";


/***
 * Contexte lié au drawer à l'instant t
 */
export const DrawerContext = createContext<IDrawerContext>({} as IDrawerContext);

/***
 * hook permettant de retourner le contexte lié au drawer à un instant t donné
 */
export const useDrawer = () => {
  const context = useContext(DrawerContext) || { drawer: null };
  return context as IDrawerContext;
};


export const useGetDrawerState = (event?: E_DRAWER_EVENTS | E_DRAWER_EVENTS[]): IDrawerStateOptions | null => {
  const { drawer } = useDrawer();
  return drawer?.getStateOptions() || null;
}