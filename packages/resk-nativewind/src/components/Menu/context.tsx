"use client";
import { createContext, useContext } from 'react';
import { IMenuContext } from './types';

/**
 * MenuContext provides a context for managing the state and behavior of a menu component.
 * 
 * This context allows components to access the current visibility state of the menu, 
 * as well as methods to open and close the menu. It can be used in conjunction with 
 * the IMenuContext interface to ensure type safety and clarity in the context's structure.
 * 
 * The context is initialized with a default value of null, indicating that it should 
 * be provided by a higher-level component (such as a MenuProvider) that manages the 
 * actual state and logic for the menu.
 * 
 * @constant MenuContext
 * @type {React.Context<IMenuContext | null>}
 * 
 * @example
 * // Example of providing the MenuContext in a parent component
 * const MenuProvider: React.FC = ({ children }) => {
 *     const [visible, setVisible] = useState(false);
 *     
 *     const openMenu = (event?: GestureResponderEvent, callback?: Function) => {
 *         setVisible(true);
 *         if (callback) callback();
 *     };
 *     
 *     const closeMenu = (event?: GestureResponderEvent, callback?: Function) => {
 *         setVisible(false);
 *         if (callback) callback();
 *     };
 *     
 *     const isOpen = () => visible;
 *     
 *     const value: IMenuContext = {
 *         visible,
 *         isOpen,
 *         openMenu,
 *         closeMenu,
 *     };
 *     
 *     return (
 *         <MenuContext.Provider value={value}>
 *             {children}
 *         </MenuContext.Provider>
 *     );
 * };
 * 
 * // Example of using the MenuContext in a child component
 * const MyMenuComponent: React.FC = () => {
 *     const menuContext = useContext(MenuContext);
 *     
 *     const handleOpen = () => {
 *         menuContext?.openMenu();
 *     };
 *     
 *     const handleClose = () => {
 *         menuContext?.closeMenu();
 *     };
 *     
 *     return (
 *         <View>
 *             <Button title="Open Menu" onPress={handleOpen} />
 *             {menuContext?.visible && (
 *                 <View>
 *                     <Text>Menu Item 1</Text>
 *                     <Text onPress={handleClose}>Close Menu</Text>
 *                 </View>
 *             )}
 *         </View>
 *     );
 * };
 */
export const MenuContext = createContext<IMenuContext | null>(null);


/**
 * Custom hook to access the MenuContext.
 * 
 * This hook provides an easy way for components to access the menu context, 
 * including the current visibility state and methods to open and close the menu. 
 * If the context is not available (e.g., if the component is used outside of 
 * a MenuProvider), it returns a default object with no-op functions for 
 * opening and closing the menu.
 * 
 * @returns {IMenuContext} The current menu context, which includes methods 
 *          for opening and closing the menu, and the visibility state.
 * 
 * @example
 * // Example of using the useMenu hook in a component
 * const MyMenuComponent: React.FC = () => {
 *     const { menu } = useMenu();
 *     return (
 *         <View>
 *             <Button title="Open Menu" onPress={openMenu} />
 *             {visible && (
 *                 <View>
 *                     <Text>Menu Item 1</Text>
 *                     <Text onPress={menu.close}>Close Menu</Text>
 *                 </View>
 *             )}
 *         </View>
 *     );
 * };
 */
export const useMenu = (): IMenuContext | undefined => {
    const context = useContext(MenuContext);
    return context as IMenuContext;
};