import { useIsAppReady } from "@src/context/hooks";
import { IReactComponent } from "@src/types";
import * as React from "react";
import { ReactNode } from "react";


/**
 * Options for the Higher-Order Component (HOC).
 * @interface IWithHOCOptions
 */
export interface IWithHOCOptions {
    /**
     * The display name of the overridden component.
     */
    displayName?: string;

    /**
     * The fallback element or a function to test the rendering of the fallback.
     * If this function returns null or a React element, then the component is not rendered.
     */
    fallback?: ReactNode | null | ((...args: any[]) => boolean | null);
}


/**
 * Higher-order component (HOC) that wraps a given component with additional functionality.
 *
 * @template T - The type of the component's props.
 * @param {IReactComponent<T>} Component - The component to wrap.
 * @param {IWithHOCOptions} [options={}] - Optional settings for the HOC.
 * @param {string} [options.displayName] - Optional display name for the HOC.
 * @param {ReactNode | (() => ReactNode)} [options.fallback] - Optional fallback content or function to render if provided.
 * @returns {React.ForwardRefExoticComponent<React.PropsWithoutRef<T> & React.RefAttributes<any>>} - The wrapped component with additional functionality.
 */
export function withHOC<T>(Component: IReactComponent<T>, options: IWithHOCOptions = {}) {
    options = Object.assign({}, options);
    const { displayName, fallback } = options;
    const fn = React.forwardRef(function (props: T, ref?): ReactNode {
        props = (props || {}) as T;
        const isAppReady = useIsAppReady();
        if (!isAppReady) {
            if (fallback) {
                if (typeof fallback === "function") {
                    return fallback();
                }
                return React.isValidElement(fallback) ? fallback : null;
            }
            return null;
        }
        return <Component {...props} ref={ref} />;
    } as React.ForwardRefRenderFunction<unknown, React.PropsWithoutRef<T>>);
    if (Component?.displayName) {
        fn.displayName = Component.displayName + "_WithAuth";
    } else if (displayName) {
        fn.displayName = displayName;
    }
    return fn;
}