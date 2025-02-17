import React, { LegacyRef, useEffect, useRef } from "react";

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
function useCreateProviderRef<T>(cb?: (context: React.RefObject<T>) => React.RefObject<T>) {
    const ref = useRef<T>(null);
    useEffect(() => {
        if (typeof cb === 'function') {
            cb(ref);
        }
    }, [ref.current]);
    return ref;
}

/**
 * A higher-order component (HOC) that creates a provider class for a given React component.
 * 
 * @template ComponentProps - The props type for the wrapped component.
 * @template ComponentInstance - The instance type of the wrapped component.
 * @param Component - The React component class to be wrapped as a provider.
 * @param defaultRenderProps - Optional default props to be passed to the component.
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
export function createProvider<ComponentProps = unknown, ComponentInstance = unknown>(Component: React.ComponentClass<ComponentProps>, defaultRenderProps?: ComponentProps) {
    return class ProviderClass extends Component {
        static _innerClassProviderRef?: React.RefObject<ComponentInstance>;

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
        static Provider = React.forwardRef<ComponentInstance, ComponentProps>(
            (props, ref) => {
                const hasRef = !!ref;
                const innerRef = useCreateProviderRef<ComponentInstance>((ref) => {
                    if (!hasRef || !this._innerClassProviderRef) {
                        this._innerClassProviderRef = ref;
                    }
                    return ref;
                });
                return <Component {...Object.assign({}, defaultRenderProps)} {...props} ref={(ref || innerRef) as unknown as LegacyRef<React.Component<ComponentProps, any, any>>} />;
            }
        );

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
        static getProviderInstance(innerProviderRef?: ComponentInstance | React.RefObject<ComponentInstance>): ComponentInstance | null {
            if (innerProviderRef instanceof Component && innerProviderRef) {
                return innerProviderRef as ComponentInstance;
            }
            try {
                if (innerProviderRef && (innerProviderRef as React.RefObject<ComponentInstance>).current instanceof Component) {
                    return (innerProviderRef as React.RefObject<ComponentInstance>).current as ComponentInstance;
                }
            } catch (e) { }
            if (this._innerClassProviderRef && this._innerClassProviderRef?.current instanceof Component) {
                return this._innerClassProviderRef.current as ComponentInstance;
            }
            return null;
        }
    }
}