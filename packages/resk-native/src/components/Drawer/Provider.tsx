import Drawer from "./Drawer";
import { createProvider } from "@utils";
import { IDrawerProps, IDrawerCurrentState, IDrawerProviderProps } from "./types";


/**
 * A provider class for managing the state and behavior of a `Drawer` component.
 * Extends a generic provider created using `createProvider`.
 *
 * @template IDrawerProps - The props type for the `Drawer` component.
 * @template Drawer - The `Drawer` component class or type.
 */
export default class DrawerProvider extends createProvider<IDrawerProps, Drawer>(Drawer, { permanent: false, isProvider: true }) {
    /**
     * Opens the `Drawer` component with the specified properties.
     *
     * @param props - The properties to configure the `Drawer` component.
     * @param innerProviderRef - An optional reference to a specific provider instance.
     * @param callback - An optional callback function to execute after the `Drawer` is opened.
     * @returns The result of the `open` method on the `Drawer` instance, if available.
     */
    static open(props: IDrawerProviderProps, innerProviderRef?: any, callback?: (options: IDrawerCurrentState) => void) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.open !== "function") return;
        return instance.open(props, callback);
    };
    /**
     * Closes the `Drawer` component with the specified properties.
     *
     * @param props - Optional properties to configure the closing behavior of the `Drawer`.
     * @param innerProviderRef - An optional reference to a specific provider instance.
     * @param callback - An optional callback function to execute after the `Drawer` is closed.
     * @returns The result of the `close` method on the `Drawer` instance, if available.
     */
    static close(props?: IDrawerProviderProps, innerProviderRef?: any, callback?: Function) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.close !== "function") return;
        return instance.close(props, callback);
    }
}