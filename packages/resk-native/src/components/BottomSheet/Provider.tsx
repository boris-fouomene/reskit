import BottomSheet from "./BottomSheet";
import { createProvider } from "@utils";
import { IBottomSheetProps } from "./utils";
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

    /**
     * Opens the bottom sheet.
     * 
     * This method can be used to open the bottom sheet programmatically.
     * It takes an optional `props` argument which can be used to set the props of the bottom sheet.
     * It also takes an optional `callback` argument which is called after the bottom sheet has been opened.
     * @param props - Optional props to set on the bottom sheet.
     * @param callback - Optional callback to be called after the bottom sheet has been opened.
     */
    open(props?: IBottomSheetProviderProps, callback?: () => {}) {
        this.setState({
            appBarProps: undefined,
            ...Object.assign({}, props), visible: true,
        }, () => {
            typeof callback == "function" && callback();
        });
    }


    /**
     * Closes the bottom sheet.
     * 
     * This method can be used to close the bottom sheet programmatically.
     * It takes an optional `props` argument which can be used to set the props of the bottom sheet.
     * It also takes an optional `callback` argument which is called after the bottom sheet has been closed.
     * @param props - Optional props to set on the bottom sheet.
     * @param callback - Optional callback to be called after the bottom sheet has been closed.
     */
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
export default class BottomSheetProvider extends createProvider<IBottomSheetProps, BottomSheetClass, IBottomSheetProviderProps>(BottomSheetClass, { visible: false }) { }