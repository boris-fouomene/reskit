import Drawer from "./Drawer";
import { createProvider } from "@utils";
import { IDrawerProps } from "./types";

class DProvider extends Drawer {
    isProvider() {
        return true;
    }
}

/**
 * A provider class for managing the state and behavior of a `Drawer` component.
 * Extends a generic provider created using `createProvider`.
 *
 * @template IDrawerProps - The props type for the `Drawer` component.
 * @template Drawer - The `Drawer` component class or type.
 */
export default class DrawerProvider extends createProvider<IDrawerProps, DProvider, IDrawerProps>(DProvider, { permanent: false }, (options) => {
    options.permanent = typeof options.permanent === 'boolean' ? options.permanent : false;
    return options;
}) { }