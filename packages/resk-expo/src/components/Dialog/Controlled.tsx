
import React, { ReactNode } from "react";
import Dialog from "./Dialog";
import { isValidElement } from "@utils";
import { defaultStr, isObj } from "@resk/core";
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
export default class DialogControlled extends React.Component<IDialogControlledProps, IDialogControlledState> {
    isDialog: boolean = true;
    isDialogControlled: boolean = true;
    constructor(props: IDialogControlledProps) {
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
    toggle(visible: boolean, props?: IDialogControlledProps, callback?: Function) {
        const nState: IDialogControlledState = { visible } as IDialogControlledState;
        if (this.isProvider() && isObj(props)) {
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
     */
    open(props?: IDialogControlledProps, callback?: Function) {
        this.toggle(true, props, callback);
    }
    /**
     * Closes the dialog.
     * 
     * @param props - Optional properties to pass to the dialog.
     * @param callback - Optional callback function to execute after closing the dialog.
     */
    close(props?: IDialogControlledProps, callback?: Function) {
        this.toggle(false, props, callback);
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
    UNSAFE_componentWillReceiveProps(nextProps: Readonly<IDialogControlledProps>, nextContext: any): void {
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
        if (hasU) {
            this.setState(nState);
        }
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
        const { children, indicatorOnRight, indicatorProps, testID: cTestID, onDismiss, ...props } = this.getProps();
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
            {...(props)}
            isPreloader={this.isPreloader()}
            testID={testID}
            context={this}
            visible={this.state.visible}
            onDismiss={(event) => {
                if (typeof onDismiss === 'function' && onDismiss(event) === false) return true;
                this.close();
            }}
        />
    }
}


export interface IDialogControlledProps extends IDialogProps<DialogControlled> {
    isProvider?: boolean;//s'il s'agit d'un provider
    /***
    * les props à passer au composant ActivityIndicator de react-native lorsqu'il s'agit d'un preloader
    */
    indicatorProps?: IActivityIndicatorProps;

    /***
     * spécifie si l'activity indicator sera affiché en position droite du contenu du preloader
     */
    indicatorOnRight?: boolean;
}

/***
 * interface représentant l'état du dialog controllé
 */
export interface IDialogControlledState {
    visible: boolean;//si la boite de dialogue est visible
    isProvider: boolean; //s'il s'agit d'un provider
    isPreloader?: boolean; //s'il s'agit d'un preloader
    providerProps: IDialogControlledProps;//les props lorsqu'il s'agit du provider
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