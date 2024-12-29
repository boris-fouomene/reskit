import Drawer from "./Drawer";
import { createProvider } from "@utils";
import { IDrawerProps, IDrawerCurrentState, IDrawerProviderProps } from "./types";


export default class DrawerProvider extends createProvider<IDrawerProviderProps, Drawer>(Drawer, { permanent: false }) {
    static open(props: IDrawerProviderProps, innerProviderRef?: any, callback?: (options: IDrawerCurrentState) => void) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.open !== "function") return;
        return instance.open(props, callback);
    };
    static close(props?: IDrawerProviderProps, innerProviderRef?: any, callback?: Function) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.close !== "function") return;
        return instance.close(props, callback);
    }
}