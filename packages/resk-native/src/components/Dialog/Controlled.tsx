
import { Component, ReactNode } from "react";
import Dialog from "./Dialog";
import { isValidElement } from "@utils";
import { defaultStr, isObj } from "@resk/core/utils";
import { StyleSheet } from "react-native";
import theme from "@theme";
import { ActivityIndicator, IActivityIndicatorProps } from "@components/ActivityIndicator";
import Label from "@components/Label";
import View from "@components/View";
import { IDialogProps } from "./types";

/**
 * A controlled dialog component that manages its visibility and props.
 * 
 * This component allows for programmatic control over the dialog's open/close state,
 * and it can also render a loading indicator (preloader) when necessary.
 * 
 * @extends React.Component
 */
export default class DialogControlled<DialogContextExtended = any> extends Component<IDialogControlledProps<DialogContextExtended>, IDialogControlledState> {
    isDialog: boolean = true;
    isDialogControlled: boolean = true;
    constructor(props: IDialogControlledProps<DialogContextExtended>) {
        super(props);
        this.state = {
            visible: typeof props.visible === "boolean" ? props.visible : false,
            providerProps: props.isPreloader || props.isProvider ? props : {},
            isPreloader: typeof props.isPreloader === 'boolean' ? props.isPreloader : false,
            isProvider: typeof props.isProvider === 'boolean' ? props.isProvider : false,
        };
    }
    /**
     * Toggles the visibility of the dialog.
     * 
     * @param visible - The desired visibility state of the dialog.
     * @param props - Optional properties to update the dialog.
     * @param callback - Optional callback function to execute after the state is updated.
     */
    toggle(visible: boolean, props?: IDialogControlledProps<DialogContextExtended>, callback?: Function) {
        const nState: IDialogControlledState = { visible } as IDialogControlledState;
        if (this.isProvider() && isObj(props) && Object.getSize(props, true)) {
            nState.providerProps = { ...Object.assign({}, props) };
        }
        this.setState(nState, () => {
            if (typeof callback == 'function') {
                callback();
            }
        });
    }
    /**
     * Opens the dialog.
     * 
     * @param props - Optional properties to pass to the dialog.
     * @param callback - Optional callback function to execute after opening the dialog.
     * @returns {DialogControlled}
     */
    open(props?: IDialogControlledProps<DialogContextExtended>, callback?: Function) {
        this.toggle(true, props, callback);
        return this;
    }
    /**
     * Closes the dialog.
     * 
     * @param callback - Optional callback function to execute after closing the dialog.
     * @returns {DialogControlled}
     */
    close(callback?: Function) {
        this.toggle(false, undefined, callback);
        return this;
    }
    /**
     * Checks if the dialog is currently open.
     * 
     * @returns True if the dialog is open, otherwise false.
     */
    isOpen() {
        return this.state.visible;
    }
    /**
     * Checks if the dialog is currently closed.
     * 
     * @returns True if the dialog is closed, otherwise false.
     */
    isClosed() {
        return !this.state.visible;
    }
    static getDerivedStateFromProps(nextProps: Readonly<IDialogControlledProps>) {
        const nState: IDialogControlledState = {} as IDialogControlledState;
        let hasU = false;
        if (typeof nextProps.visible === 'boolean') {
            nState.visible = nextProps.visible;
            hasU = true;
        }
        if (typeof nextProps.isPreloader === 'boolean') {
            nState.isPreloader = nextProps.isPreloader;
        }
        if (typeof nextProps.isProvider === 'boolean') {
            nState.isProvider = nextProps.isProvider;
            hasU = true;
        }
        return hasU ? nState : null;
    }
    /**
     * Checks if the dialog is a preloader.
     * 
     * @returns True if the dialog is a preloader, otherwise false.
     */
    isPreloader() {
        return this.state.isPreloader;
    }
    /**
     * Checks if the dialog is a provider.
     * 
     * @returns True if the dialog is a provider, otherwise false.
     */
    isProvider() {
        return this.state.isProvider;
    }
    /**
    * Gets the properties to be used by the dialog.
    * 
    * @returns The properties for the dialog.
    */
    getProps(): IDialogControlledProps {
        return this.isProvider() ? this.state.providerProps : this.props;
    }
    /**
     * Gets the test identifier for the dialog.
     * 
     * @returns The test ID string for the dialog.
     */
    getTestID(): string {
        return this.isPreloader() ? "resk-dialog-preloader" : this.isProvider() ? "resk-dialog-provider" : "resk-dialog";
    }
    render() {
        const { children, indicatorOnRight, context, indicatorProps, testID: cTestID, onDismiss, ...props } = this.getProps();
        const testID = defaultStr(cTestID, this.getTestID());
        const rProps: IDialogControlledProps = { children };
        if (this.isPreloader()) {
            const content = isValidElement(children) ? children : <Label style={[styles.preloaderText]} numberOfLines={10} testID={testID + "children-label"}>{children as ReactNode || 'Loading...'}</Label>;
            const indicator = <ActivityIndicator size={"large"} color={theme.colors.primary} {...Object.assign({}, indicatorProps)} />;
            Object.assign(rProps, {
                dismissable: false,
                fullScreen: false,
                responsive: false,
                children: <View style={[styles.preloaderContainer]}>
                    {!indicatorOnRight ? indicator : null}
                    {content as ReactNode}
                    {indicatorOnRight ? indicator : null}
                </View>
            });
        }
        return <Dialog<DialogControlled>
            {...rProps}
            {...(props as any)}
            isPreloader={false}
            appBarProps={Object.assign({}, props.appBarProps, {
                context: Object.assign({}, context, props?.appBarProps?.context, { dialogContext: this }),
            }) as any}
            testID={testID}
            context={Object.assign({}, context, { dialogContext: this })}
            visible={this.state.visible}
            onDismiss={(event) => {
                if (typeof onDismiss === 'function' && onDismiss(event) === false) return true;
                this.close();
            }}
        />
    }
}


/**
 * Props for the `DialogControlled` component, extending the base `IDialogProps` interface.
 *
 * @template DialogContextExtended
 *
 * @property {boolean} [isProvider] - Indicates if the dialog is acting as a provider.
 * @property {IActivityIndicatorProps} [indicatorProps] - Props for customizing the activity indicator.
 * @property {boolean} [indicatorOnRight] - Determines if the activity indicator should be displayed on the right side.
 */
export interface IDialogControlledProps<DialogContextExtended = any> extends Omit<IDialogProps<DialogContextExtended>, "context"> {
    isProvider?: boolean;//s'il s'agit d'un provider
    indicatorProps?: IActivityIndicatorProps;

    indicatorOnRight?: boolean;
    context?: DialogContextExtended & { dialogContext: DialogControlled };
}


/**
 * Represents the state of a controlled dialog component.
 * @typedef IDialogControlledState
 */
export interface IDialogControlledState {
    /**
     * Indicates whether the dialog is currently visible.
     */
    visible: boolean;

    /**
     * Specifies if the dialog is acting as a provider.
     */
    isProvider: boolean;

    /**
     * (Optional) Indicates if the dialog is in a preloader state.
     */
    isPreloader?: boolean;

    /**
     * The properties passed to the dialog provider.
     */
    providerProps: IDialogControlledProps;
}

const styles = StyleSheet.create({
    preloaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 5,
        flexWrap: "wrap",
    },
    preloaderText: {
        paddingHorizontal: 5,
        maxWidth: "98%",
    },
});