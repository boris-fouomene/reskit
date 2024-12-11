import Drawer from "./Drawer";
import { createProvider } from "@utils";
import { IDrawerProps, IDrawerStateOptions } from "./types";


export default class DrawerProvider extends createProvider<IDrawerProps, Drawer>(Drawer, { isProvider: true }) {
    static open(props: IDrawerProps, innerProviderRef?: any, callback?: (options: IDrawerStateOptions) => void) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.open !== "function") return;
        return instance.open(props, callback);
    };
    static close(props?: IDrawerProps, innerProviderRef?: any, callback?: Function) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.close !== "function") return;
        return instance.close(props, callback);
    }
}