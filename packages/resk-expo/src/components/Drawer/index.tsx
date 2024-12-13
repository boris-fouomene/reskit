import { withHOC, IWithHOCOptions } from "@hooks/withHOC";
import { useDrawer, useDrawerCurrentState } from "./hooks";
import _Drawer from "./Drawer";
import { IDrawerProps } from "./types";
import { IReactComponent } from "@src/types";
import { defaultObj } from "@resk/core";
import DrawerItems from "./DrawerItems";
import Provider from "./Provider";
import DrawerItem from "./DrawerItems/DrawerItem";
import ExpandableDrawerItem from "./DrawerItems/ExpandableItem";



interface IWithDrawerOptions {
  drawerProps?: IDrawerProps;
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
  const { drawerProps } = Object.assign({}, props) as IWithDrawerOptions;
  options.displayName = options.displayName || Component?.displayName || "RN_WithDrawerComponent";
  return withHOC<T>(function (props: T) {
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

