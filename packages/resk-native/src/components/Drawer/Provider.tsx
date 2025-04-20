import Drawer from "./Drawer";
import { createProvider } from "@utils";
import { IDrawerProps, IDrawerCurrentState } from "./types";

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
export default class DrawerProvider extends createProvider<IDrawerProps, DProvider>(DProvider, { permanent: false }) {
    /**
     * Opens the `Drawer` component with the specified properties.
     *
     * @param props - The properties to configure the `Drawer` component.
     * @param innerProviderRef - An optional reference to a specific provider instance.
     * @param callback - An optional callback function to execute after the `Drawer` is opened.
     * @returns The result of the `open` method on the `Drawer` instance, if available.
     */
    static open(props: IDrawerProps, innerProviderRef?: any, callback?: (options: IDrawerCurrentState) => void) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.open !== "function") return;
        props.permanent = typeof props.permanent === 'boolean' ? props.permanent : false;
        return instance.open(props, callback);
    };
    /**
     * Closes the `Drawer` component with the specified properties.
     *
     * @param innerProviderRef - An optional reference to a specific provider instance.
     * @param callback - An optional callback function to execute after the `Drawer` is closed.
     * @returns The result of the `close` method on the `Drawer` instance, if available.
     */
    static close(innerProviderRef?: any, callback?: Function) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.close !== "function") return;
        return instance.close(callback);
    }
}