"use client";
import { defaultStr, extendObj, isObj } from "@resk/core/utils";
import { ComponentClass, FC, ReactElement, Ref, RefObject, useEffect, useRef, } from "react";



function useCreateProviderRef<T>(cb?: (context: RefObject<T>) => RefObject<T>) {
    const ref = useRef<T>(null);
    useEffect(() => {
        if (typeof cb === 'function') {
            try {
                cb(ref as any);
            } catch (error) {
                console.warn('Provider ref callback error:', error);
            }
        }
    }, []); // Remove dependency on ref.current to avoid unnecessary re-runs
    return ref;
}


/**
 * Creates a provider wrapper that manages component instances and provides open/close functionality.
 * This factory function creates a reusable provider pattern with enhanced error handling optimized for React Native's Hermes engine.
 * 
 * @template ComponentProps - The props interface for the wrapped component
 * @template ComponentInstance - The instance type of the wrapped component (must have open/close methods)
 * @template OpenCallback - The callback function type used when opening the provider
 * @template ProviderOpenProps - The props interface for opening the provider (defaults to ComponentProps)
 * 
 * @param Component - The React component class to wrap with provider functionality
 * @param overrideProps - Optional default props to merge with component props
 * @param openProviderOptionMutator - Optional function to transform options before opening
 * @param componentDisplayName - Optional custom display name for debugging
 * 
 * @returns An object containing the wrapped component and control methods
 * 
 * @example
 * ```tsx
 * // Define your modal component interface
 * interface ModalProps {
 *   title: string;
 *   visible: boolean;
 * }
 * 
 * interface ModalInstance {
 *   open: (options: any) => void;
 *   close: () => void;
 * }
 * 
 * // Create the provider
 * const ModalProvider = createProvider<ModalProps, ModalInstance>(
 *   MyModalComponent,
 *   { visible: false }, // default props
 *   (options) => ({ ...options, animated: true }), // mutator
 *   'CustomModal' // display name
 * );
 * 
 * // Use in your app
 * function App() {
 *   return (
 *     <View>
 *       <ModalProvider.Component title="My Modal" />
 *       <Button onPress={() => ModalProvider.open({ title: "Dynamic Title" })} />
 *     </View>
 *   );
 * }
 * ```
 * 
 * @see {@link useCreateProviderRef} for the underlying ref management hook
 * @since 1.0.0
 */
export function createProvider<ComponentProps = unknown, ComponentInstance = unknown, OpenCallback extends Function = Function, ProviderOpenProps = ComponentProps>(
    Component: ComponentClass<ComponentProps>,
    overrideProps?: ComponentProps,
    openProviderOptionMutator?: (options: ProviderOpenProps) => ProviderOpenProps,
    componentDisplayName?: string
) {
    /**
     * Global reference to the provider instance.
     * Used as fallback when no specific ref is provided.
     * @internal
     */
    let globalProviderRef: RefObject<ComponentInstance> | null = null;

    /**
     * Retrieves the provider component instance with improved error handling for Hermes engine.
     * Supports both direct instances and RefObject instances with comprehensive type checking.
     * 
     * @param innerProviderRef - Optional specific provider reference (instance or RefObject)
     * @returns The component instance if found and valid, null otherwise
     * 
     * @example
     * ```tsx
     * // Get global instance
     * const instance = getProviderInstance();
     * 
     * // Get specific instance from ref
     * const specificInstance = getProviderInstance(myModalRef);
     * 
     * // Check if instance is available
     * if (instance) {
     *   instance.open({ title: "Hello" });
     * }
     * ```
     * 
     * @internal
     */
    function getProviderInstance(innerProviderRef?: ComponentInstance | RefObject<ComponentInstance>): ComponentInstance | null {
        try {
            // Check if it's a direct instance
            if (innerProviderRef && typeof innerProviderRef === 'object' && innerProviderRef !== null) {
                // Check if it's a ref object with current property
                if ('current' in innerProviderRef && innerProviderRef.current) {
                    return innerProviderRef.current as ComponentInstance;
                }
                // Check if it's a direct component instance
                if (typeof (innerProviderRef as any).open === 'function' ||
                    typeof (innerProviderRef as any).close === 'function') {
                    return innerProviderRef as ComponentInstance;
                }
            }

            // Fall back to global ref
            if (globalProviderRef?.current) {
                return globalProviderRef.current as ComponentInstance;
            }
        } catch (error) {
            console.warn('Error getting provider instance:', error);
        }
        return null;
    }




    /**
     * Hermes-optimized wrapper component using function instead of class for better performance.
     * Handles ref management and prop merging automatically.
     * 
     * @param props - Component props including optional ref
     * @returns JSX element with the wrapped component
     * 
     * @example
     * ```tsx
     * // Basic usage
     * <WrappedComponent title="My Modal" />
     * 
     * // With ref
     * const modalRef = useRef();
     * <WrappedComponent ref={modalRef} title="Referenced Modal" />
     * 
     * // Props are automatically merged with overrideProps
     * <WrappedComponent 
     *   title="Custom Title" 
     *   visible={true}
     *   onClose={() => console.log('Closed')} 
     * />
     * ```
     * 
     * @internal
     */
    function WrappedComponent({ ref, ...props }: ComponentProps & { ref?: Ref<ComponentInstance> }) {
        const innerRef = useCreateProviderRef<ComponentInstance>((refObject) => {
            // Only set global ref if no external ref is provided
            if (!ref && !globalProviderRef) {
                globalProviderRef = refObject;
            }
            return refObject;
        });
        const finalProps = {
            ...props,
            ...(overrideProps || {}),
        } as ComponentProps;
        return <Component {...finalProps} ref={(ref || innerRef) as any} />;
    }

    // Set display name for debugging
    WrappedComponent.displayName = defaultStr(componentDisplayName, `Provider(${Component.displayName || Component.name || 'Component'})`);

    /**
     * Provider object containing the wrapped component and control methods.
     * Provides a clean API for managing component instances.
     * 
     * @returns Provider interface with component and control methods
     */
    return {
        Component: WrappedComponent,

        /**
     * Opens the provider component with the specified options and enhanced error handling.
     * Applies override props and option mutations before opening the component.
     * 
     * @param options - Configuration options for opening the provider
     * @param innerProviderRef - Optional specific provider reference to use
     * @param callback - Optional callback function to execute after opening
     * @returns The result of the component's open method, or undefined if failed
     * 
     * @example
     * ```tsx
     * // Basic usage
     * open({ title: "Welcome", message: "Hello World!" });
     * 
     * // With callback
     * open({ title: "Loading" }, undefined, () => {
     *   console.log("Modal opened successfully");
     * });
     * 
     * // With specific ref
     * open({ title: "Specific" }, myModalRef);
     * 
     * // Complex options with mutator
     * open({ 
     *   title: "Complex Modal",
     *   data: { userId: 123 },
     *   animated: true 
     * });
     * ```
     * 
     * @throws Will log error to console if opening fails, but won't throw
     */
        open: function open(options: ProviderOpenProps, innerProviderRef?: any, callback?: OpenCallback) {
            try {
                const instance = getProviderInstance(innerProviderRef);
                if (!instance || typeof (instance as any)?.open !== "function") {
                    console.warn('Provider instance not found or does not have open method');
                    return;
                }

                let finalOptions = options;
                if (isObj(overrideProps)) {
                    finalOptions = isObj(options) ? options : {} as ProviderOpenProps;
                    extendObj(finalOptions, overrideProps);
                }
                if (typeof openProviderOptionMutator === "function") {
                    finalOptions = openProviderOptionMutator((isObj(finalOptions) ? finalOptions : {}) as ProviderOpenProps);
                }
                return (instance as any).open(finalOptions, callback);
            } catch (error) {
                console.error('Error opening provider:', error);
            }
        },
        /**
         * Closes the provider component with enhanced error handling and callback safety.
         * Ensures the callback is executed even if the close operation fails.
         * 
         * @param callback - Optional callback function to execute after closing
         * @param innerProviderRef - Optional specific provider reference to use
         * @returns The result of the component's close method, or undefined if failed
         * 
         * @example
         * ```tsx
         * // Basic close
         * close();
         * 
         * // With callback
         * close(() => {
         *   console.log("Modal closed");
         *   navigation.goBack();
         * });
         * 
         * // Close specific instance
         * close(() => console.log("Closed"), myModalRef);
         * 
         * // Safe close with cleanup
         * close(() => {
         *   setLoading(false);
         *   clearData();
         * });
         * ```
         * 
         * @throws Will log error to console if closing fails, but won't throw
         */
        close: function close(callback?: Function, innerProviderRef?: any) {
            try {
                const instance = getProviderInstance(innerProviderRef);
                if (!instance || typeof (instance as any)?.close !== "function") {
                    console.warn('Provider instance not found or does not have close method');
                    return;
                }
                return (instance as any).close(callback);
            } catch (error) {
                console.error('Error closing provider:', error);
                // Still call callback even if close failed
                if (typeof callback === 'function') {
                    callback();
                }
            }
        },

        /**
         * Gets the current provider instance.
         * @see {@link getProviderInstance}
         */
        getProviderInstance,
    };
}