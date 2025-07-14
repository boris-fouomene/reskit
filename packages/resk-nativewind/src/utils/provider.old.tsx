"use client";
import { extendObj, isObj } from "@resk/core/utils";
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
 * @param overrideProps - Optional props used to override the default props of the component.
 * @param openProviderOptionMutator - Optional function to mutate the open options before passing them to the provider.
 * 
 * @returns A new provider class that wraps the original component.
 * 
 * @example
 * const MyProvider = createProvider<MyComponentProps, MyComponentInstance>(MyComponent, { defaultProp: 'value' });
 * 
 * // Usage in a component
 * <MyProvider.Component someProp={value} />
 * MyProvider.open({ someProp: 'value' });
 */
export function createProvider<ComponentProps = unknown, ComponentInstance = unknown, ProviderOpenProps = ComponentProps>(Component: ComponentClass<ComponentProps>, overrideProps?: ComponentProps, openProviderOptionMutator?: (options: ProviderOpenProps) => ProviderOpenProps) {
    // Create a provider object with static methods instead of extending Component
    const ProviderClass = {
        _innerClassProviderRef: null as RefObject<ComponentInstance> | null,
        _Component: Component,
        _overrideProps: overrideProps,
        _openProviderOptionMutator: openProviderOptionMutator,

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
        open(options: ProviderOpenProps, innerProviderRef?: any, callback?: Function) {
            const instance = ProviderClass.getProviderInstance(innerProviderRef);
            if (!instance || typeof (instance as any)?.open !== "function") return;

            let finalOptions = options;
            if (isObj(ProviderClass._overrideProps)) {
                finalOptions = isObj(options) ? options : {} as ProviderOpenProps;
                extendObj(finalOptions, ProviderClass._overrideProps);
            }
            if (typeof ProviderClass._openProviderOptionMutator === "function") {
                finalOptions = ProviderClass._openProviderOptionMutator((isObj(finalOptions) ? finalOptions : {}) as ProviderOpenProps);
            }
            return (instance as any).open(finalOptions, callback);
        },

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
         * MyProvider.close(() => {
         *     console.log('Provider closed');
         * });
         */
        close(callback?: Function, innerProviderRef?: any) {
            const instance = ProviderClass.getProviderInstance(innerProviderRef);
            if (!instance || typeof (instance as any)?.close !== "function") return;
            return (instance as any).close(callback);
        },

        /**
         * The React component that wraps the original component with provider functionality.
         * 
         * @param props - The props to pass to the wrapped component.
         * @returns A React element wrapping the original component.
         */
        Component({ ref, ...props }: Omit<ComponentProps, "ref"> & { ref?: Ref<ComponentInstance> }): ReactElement {
            const hasRef = !!ref;
            const innerRef = useCreateProviderRef<ComponentInstance>((refObject) => {
                if (!hasRef || !ProviderClass._innerClassProviderRef) {
                    ProviderClass._innerClassProviderRef = refObject;
                }
                return refObject;
            });

            const finalProps = {
                ...props,
                ...(ProviderClass._overrideProps || {}),
            } as ComponentProps;

            return <Component {...finalProps} ref={(ref || innerRef) as any} />;
        },

        /**
         * Retrieves the instance of the provider component.
         * 
         * @param innerProviderRef - An optional ref or instance of the provider component.
         * 
         * @returns The instance of the provider component if it exists, otherwise null.
         * 
         * @example
         * const instance = MyProvider.getProviderInstance(myRef);
         * if (instance) {
         *     instance.someMethod();
         * }
         */
        getProviderInstance(innerProviderRef?: ComponentInstance | RefObject<ComponentInstance>): ComponentInstance | null {
            // Check if it's a direct instance
            if (innerProviderRef && typeof innerProviderRef === 'object' && innerProviderRef !== null) {
                // Check if it's a ref object with current property
                if ('current' in innerProviderRef && innerProviderRef.current) {
                    return innerProviderRef.current as ComponentInstance;
                }
                // Check if it's a direct component instance
                if (typeof (innerProviderRef as any).render === 'function' ||
                    typeof (innerProviderRef as any).open === 'function' ||
                    typeof (innerProviderRef as any).close === 'function') {
                    return innerProviderRef as ComponentInstance;
                }
            }

            // Fall back to internal ref
            if (ProviderClass._innerClassProviderRef?.current) {
                return ProviderClass._innerClassProviderRef.current as ComponentInstance;
            }

            return null;
        }
    };

    return ProviderClass;
}