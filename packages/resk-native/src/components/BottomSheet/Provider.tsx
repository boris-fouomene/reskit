import BottomSheet from "./BottomSheet";
import { createProvider } from "@utils";
import { IBottomSheetProps, IBottomSheetContext } from "./BottomSheet";
import { PureComponent } from "react";

interface IBottomSheetClasState extends Omit<Partial<IBottomSheetProps>, "visible"> { visible: boolean };

/**
 * A React component that provides a bottom sheet provider.
 * 
 * This component wraps the `BottomSheet` component and provides a way to open and close the bottom sheet programmatically.
 * 
 * @example
 * ```typescript
 * <BottomSheetProvider>
 *   <Button onPress={() => BottomSheetProvider.open({})}>Open Bottom Sheet</Button>
 * </BottomSheetProvider>
 * ```
 */
class BottomSheetClass extends PureComponent<IBottomSheetProps, IBottomSheetClasState> {
    static state: IBottomSheetClasState = {
        visible: false
    }
    open(props?: IBottomSheetProviderProps, callback?: () => {}) {
        this.setState({
            appBarProps:undefined,
            ...Object.assign({}, props), visible: true,
        }, () => {
            typeof callback == "function" && callback();
        });
    }
    close(props?: IBottomSheetProviderProps, callback?: () => {}) {
        this.setState({
            ...Object.assign({}, props), visible: false
        }, () => {
            typeof callback == "function" && callback();
        });
    }
    render() {
        return <BottomSheet {...this.props} {...this.state} onDismiss={() => { this.setState({ visible: false }) }} />
    }
}
/**
 * @interface IBottomSheetProviderProps
 * An interface for the props of the `BottomSheetProvider` component.
 * 
 * @extends Omit<IBottomSheetProps, "visible">
 */
export interface IBottomSheetProviderProps extends Omit<IBottomSheetProps, "visible"> { }

/**
 * A class that provides a way to open and close the bottom sheet programmatically.
 * 
 * @extends createProvider<IBottomSheetProps, BottomSheetClass>
 */
export default class BottomSheetProvider extends createProvider<IBottomSheetProps, BottomSheetClass>(BottomSheetClass, { visible: false }) {
    /**
     * Opens the bottom sheet.
     * 
     * @param props The properties to pass to the bottom sheet.
     * @param innerProviderRef A reference to the inner provider.
     * @param callback A callback function to call after the bottom sheet is opened.
     */
    static open(props: IBottomSheetProviderProps, innerProviderRef?: any, callback?: () => {}) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.open !== "function") return;
        return instance.open(props, callback);
    };
    /**
     * Closes the bottom sheet.
     * 
     * @param props The properties to pass to the bottom sheet.
     * @param innerProviderRef A reference to the inner provider.
     * @param callback A callback function to call after the bottom sheet is closed.
     */
    static close(props?: IBottomSheetProviderProps, innerProviderRef?: any, callback?: () => {}) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.close !== "function") return;
        return instance.close(props, callback);
    }
}