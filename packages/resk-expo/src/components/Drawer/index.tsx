import { withHOC, IWithHOCOptions } from "@hooks/withHOC";
import { useDrawer, useGetDrawerState } from "./hooks";
import Drawer from "./Drawer";
import { IDrawerProps } from "./types";
import { IReactComponent } from "@src/types";
import { defaultObj } from "@resk/core";

export * from "./types";

export { Drawer };

/****
 * interface des props du HOC withDrawer
 */
export interface IWithDrawerOptions {
  /***
   * Il s'agit des props à passer au composant Drawer
   */
  drawerProps?: IDrawerProps;
}


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

export { useDrawer, useGetDrawerState };