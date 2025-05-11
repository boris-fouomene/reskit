"use client";
import { isObj } from "@resk/core";
import { ComponentClass, ReactElement, Ref, RefObject, useEffect, useRef } from "react";

/**
 * A custom React hook that creates a reference for a provider component.
 * 
 * @template T - The type of the context that the ref will hold.
 * @param cb - An optional callback function that receives the created ref.
 * This callback can be used to perform actions with the ref after it has been created.
 * 
 * @returns A React ref object that can be attached to a component.
 * 
 * @example
 * const myRef = useCreateProviderRef<MyComponentType>((ref) => {
 *     console.log('Provider ref created:', ref);
 *     return ref;
 * });
 */
function useCreateProviderRef<T>(cb?: (context: RefObject<T>) => RefObject<T>) {
    const ref = useRef<T>(null);
    useEffect(() => {
        if (typeof cb === 'function') {
            cb(ref as any);
        }
    }, [ref.current]);
    return ref;
}

/**
 * A higher-order component (HOC) that creates a provider class for a given React component.
 * 
 * @template ComponentProps - The props type for the wrapped component.
 * @template ComponentInstance - The instance type of the wrapped component.
 * @template ProviderOpenProps - The type of the props passed to the open method of the provider.
 * @param Component - The React component class to be wrapped as a provider.
 * @param defaultRenderProps - Optional default props to be passed to the component.
 * @param openProviderOptionMutator - Optional function to mutate the open options before passing them to the provider.
 * 
 * @returns A new provider class that extends the original component.
 * 
 * @example
 * const MyProvider = createProvider<MyComponentProps, MyComponentInstance>(MyComponent, { defaultProp: 'value' });
 * 
 * // Usage in a component
 * <MyProvider someProp={value} />
 * MyProvider.getProviderInstance(myRef)?.someMethod();
 */
export function createProvider<ComponentProps = unknown, ComponentInstance = unknown, ProviderOpenProps = ComponentProps>(Component: ComponentClass<ComponentProps>, defaultRenderProps?: ComponentProps, openProviderOptionMutator?: (options: ProviderOpenProps) => ProviderOpenProps) {
    return class ProviderClass extends Component {
        static _innerClassProviderRef?: RefObject<ComponentInstance>;

        /**
         * Opens the provider component with the specified properties and optional callback.
         * 
         * This static method retrieves the instance of the provider component and calls its open method.
         * It allows for customization of the provider component through the provided properties.
         * 
         * @param options - The properties to customize the provider component.
         * @param innerProviderRef - An optional reference to access the instance of the provider component.
         * @param callback - An optional callback function that is called after opening the provider component.
         * 
         * @returns The result of the open method on the provider component, or undefined if the instance is not valid.
         * 
         * @example
         * MyProvider.open({ someProp: 'value' }, myRef, () => {
         *     console.log('Provider opened');
         * });
         */
        static open(options: ProviderOpenProps, innerProviderRef?: any, callback?: Function) {
            const instance = this.getProviderInstance(innerProviderRef);
            if (!instance || typeof (instance as any)?.open !== "function") return;
            if (typeof openProviderOptionMutator === "function") {
                options = openProviderOptionMutator((isObj(options) ? options : {}) as ProviderOpenProps);
            }
            return (instance as any).open(options, callback);
        };

        /**
         * Closes the provider component with the specified properties and optional callback.
         * 
         * This static method retrieves the instance of the provider component and calls its close method.
         * It allows for any necessary cleanup to be performed on the provider component.
         * 
         * @param callback - An optional callback function that is called after closing the provider component.
         * @param innerProviderRef - An optional reference to access the instance of the provider component.
         * 
         * @returns The result of the close method on the provider component, or undefined if the instance is not valid.
         * 
         * @example
         * MyProvider.close(myRef, () => {
         *     console.log('Provider closed');
         * });
         */
        static close(callback?: Function, innerProviderRef?: any) {
            const instance = this.getProviderInstance(innerProviderRef);
            if (!instance || typeof (instance as any)?.close !== "function") return;
            return (instance as any).close(callback);
        }
        /**
         * A forward ref component that allows access to the provider's instance.
         * 
         * @param props - The props passed to the wrapped component.
         * @param ref - A ref that can be used to access the component instance.
         * 
         * @returns A React element with the passed props and ref.
         * 
         * @example
         * <this.Provider ref={myRef} someProp={value} />
         */
        static Provider(props?: ComponentProps, ref?: Ref<ComponentInstance>): ReactElement {
            const hasRef = !!ref;
            const innerRef = useCreateProviderRef<ComponentInstance>((ref) => {
                if (!hasRef || !this._innerClassProviderRef) {
                    this._innerClassProviderRef = ref;
                }
                return ref;
            });
            return <Component {...Object.assign({}, defaultRenderProps)} {...props} ref={(ref || innerRef) as any} />;
        };

        /**
         * Retrieves the instance of the provider component.
         * 
         * @param innerProviderRef - An optional ref or instance of the provider component.
         * 
         * @returns The instance of the provider component if it exists, otherwise null.
         * 
         * @example
         * const instance = this.getProviderInstance(myRef);
         * if (instance) {
         *     instance.someMethod();
         * }
         */
        static getProviderInstance(innerProviderRef?: ComponentInstance | RefObject<ComponentInstance>): ComponentInstance | null {
            if (innerProviderRef instanceof Component && innerProviderRef) {
                return innerProviderRef as ComponentInstance;
            }
            try {
                if (innerProviderRef && (innerProviderRef as RefObject<ComponentInstance>).current instanceof Component) {
                    return (innerProviderRef as RefObject<ComponentInstance>).current as ComponentInstance;
                }
            } catch (e) { }
            if (this._innerClassProviderRef && this._innerClassProviderRef?.current instanceof Component) {
                return this._innerClassProviderRef.current as ComponentInstance;
            }
            return null;
        }
    }
}