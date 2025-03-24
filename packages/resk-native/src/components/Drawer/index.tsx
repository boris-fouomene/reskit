import { withHOC, IWithHOCOptions } from "@hooks/withHOC";
import { useDrawer, useDrawerCurrentState } from "./hooks";
import _Drawer from "./Drawer";
import { IDrawerProps } from "./types";
import { IReactComponent } from "@src/types";
import { defaultObj, defaultStr } from "@resk/core/utils";
import DrawerItems from "./DrawerItems";
import Provider from "./Provider";
import DrawerItem from "./DrawerItems/DrawerItem";
import ExpandableDrawerItem from "./DrawerItems/ExpandableItem";
import { IReskNativeContextCallback } from "@src/context/types";
import { useReskNative } from "@src/context/hooks";


/**
 * @group DrawerOptions
 * @interface IWithDrawerOptions
 * 
 * An interface that defines options for components that can utilize a drawer navigation system.
 * This interface allows for the specification of drawer properties, which can either be provided directly
 * or through a callback function that receives the context from the `ReskNativeProvider`.
 * 
 * @property {IReskNativeContextCallback<IDrawerProps> | IDrawerProps} [drawerProps] - 
 * An optional property that can either be:
 * - A callback function of type `IReskNativeContextCallback<IDrawerProps>`, which receives the `IReskNativeContext` 
 *   and returns an `IDrawerProps` object. This allows for dynamic configuration of drawer properties based on the context.
 * - An object of type `IDrawerProps`, which directly specifies the properties for the drawer navigation.
 * 
 * @example
 * // Example of using IWithDrawerOptions with a callback function
 * const drawerOptions: IWithDrawerOptions = {
 *   drawerProps: (context) => {
 *     // Accessing theme from the context to customize drawer properties
 *     return {
 *       drawerStyle: { backgroundColor: context.theme.primaryColor },
 *       drawerContentOptions: { activeTintColor: context.theme.secondaryColor },
 *     };
 *   },
 * };
 * 
 * // Example of using IWithDrawerOptions with static drawer properties
 * const staticDrawerOptions: IWithDrawerOptions = {
 *   drawerProps: {
 *     drawerStyle: { backgroundColor: '#ffffff' },
 *     drawerContentOptions: { activeTintColor: '#6200ee' },
 *   },
 * };
 * 
 * @note This interface is particularly useful for components that need to integrate with a drawer navigation system,
 * allowing for both static and dynamic configurations based on the application's context.
 */
interface IWithDrawerOptions {
  drawerProps?: IReskNativeContextCallback<IDrawerProps> | IDrawerProps;
}


/**
 * Higher-order component that wraps a given component with a Drawer component.
 *
 * @template T - The type of the props for the wrapped component.
 * @param {IReactComponent<T>} Component - The component to be wrapped with the Drawer.
 * @param {IWithDrawerOptions} [props] - Optional properties for the Drawer component.
 * @param {IWithHOCOptions} [options] - Optional higher-order component options.
 * @returns {IReactComponent<T>} - The wrapped component with the Drawer.
 */
export function withDrawer<T extends object>(Component: IReactComponent<T>, props?: IWithDrawerOptions, options?: IWithHOCOptions) {
  options = defaultObj(options);
  const { drawerProps: _drawerProps } = Object.assign({}, props) as IWithDrawerOptions;
  options.displayName = defaultStr(options.displayName, (Component as any)?.displayName, "WithDrawerComponent");
  return withHOC<T>(function (props: T) {
    const reskExpoContext = useReskNative();
    const drawerProps = Object.assign({}, (typeof _drawerProps === "function" ? _drawerProps(reskExpoContext) : _drawerProps)) as IDrawerProps;
    return (<Drawer {...Object.assign({}, drawerProps)}>
      <Component {...props} />
    </Drawer>);
  }, options);
}

/**
 * An exported object that combines the `_Drawer` component with additional sub-components.
 * This allows for a more modular and composable API for working with the Drawer.
 *
 * The exported `Drawer` object has the following properties:
 * - `Items`: The `DrawerItems` component for rendering a list of drawer items.
 * - `Provider`: The `Provider` component for wrapping the Drawer and providing context.
 * - `Item`: The `DrawerItem` component for rendering a single drawer item.
 * - `ExpandableItem`: The `ExpandableDrawerItem` component for rendering an expandable drawer item.
 */
type IDrawerExported = typeof _Drawer & {
  Items: typeof DrawerItems;
  Provider: typeof Provider;
  Item: typeof DrawerItem;
  ExpandableItem: typeof ExpandableDrawerItem;
}

const Drawer: IDrawerExported = _Drawer as IDrawerExported;
Drawer.Items = DrawerItems;
Drawer.Provider = Provider;
Drawer.Item = DrawerItem;
Drawer.ExpandableItem = ExpandableDrawerItem;



export { Drawer, useDrawer, useDrawerCurrentState };
export * from "./types";

