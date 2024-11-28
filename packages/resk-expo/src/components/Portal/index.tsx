import View, { IViewProps } from '@components/View';
import { uniqid } from '@resk/core';
import React, { createContext, useRef, useContext, ReactNode, useEffect } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { getMaxZindex, Platform } from '@resk/core';
import { IReactComponent } from '../../types';

/**
 * @interface IPortalItem
 * Interface defining the structure of a portal item.
 * 
 * @remarks
 * A `IPortalItem` consists of a unique key and the React element to be rendered.
 * These items are used internally in the `PortalProvider` to manage portal entries.
 */
interface IPortalItem<AsProps extends ViewProps = IViewProps> {
    /**
     * Unique key to identify each portal, ensuring that individual portals can be added or removed dynamically.
     */
    key: string;

    /**
     * The React node (element) to be rendered inside the portal.
     * This could be any valid JSX element that should be displayed on top of the regular content.
     */
    element: ReactNode;

    /***
     * The props to be passed to the View component that wraps the portal content.
     */
    props?: IPortalProps<AsProps>;
}


/**
 * @interface IPortalContextProps
 * Interface defining the properties of the portal context.
 * 
 * @remarks
 * These methods (`addPortal`, `removePortal`) are provided to components via React's context API to manage portal operations like adding or removing portals.
 */
export interface IPortalContextProps {
    /**
     * Adds a new portal to the application with a unique key and a component to render.
     * 
     * @param key - A unique string identifier for the portal.
     * @param component - The React element (JSX) that will be rendered within the portal.
     * @param props - The props to be passed to the View component that wraps the portal content.
     * @example
     * ```tsx
     * const { addPortal } = usePortal();
     * addPortal('example-portal', <View><Text>My Portal Content</Text></View>,{testID:"a-test-id"});
     * ```
     */
    addPortal: (key: string, component: ReactNode, props?: IViewProps) => void;

    /**
     * Removes an existing portal from the application, identified by its unique key.
     * 
     * @param key - The unique key of the portal to be removed.
     *
     * @example
     * ```tsx
     * const { removePortal } = usePortal();
     * removePortal('example-portal');
     * ```
     */
    removePortal: (key: string) => void;
}

/**
 * React context used to manage and expose portal operations, like adding or removing portals.
 * 
 * @internal
 * The context will provide portal operations to all components wrapped within `PortalProvider`.
 */
export const PortalContext = createContext<IPortalContextProps | undefined>(undefined);

/**
 * The `PortalProvider` component is responsible for managing and rendering dynamic portals in a React Native app.
 * It maintains a list of portals that can be added or removed on demand without re-rendering previously created portals.
 *
 * @remarks
 * The `PortalProvider` uses a combination of React's context and a ref-based approach to ensure that
 * previously rendered portals remain intact while allowing new portals to be added on top, maintaining the correct order of rendering (using `z-index`).
 * 
 * It should wrap the part of your application where you want to use portals, typically at the root of your component tree.
 *
 * @example
 * ```tsx
 * const App = () => {
 *   return (
 *     <PortalProvider>
 *       <MainAppContent />
 *     </PortalProvider>
 *   );
 * };
 * ```
 */
export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Stores the list of active portals using a ref to avoid unnecessary re-renders.
    const portalRefs = useRef<IPortalItem[]>([]);
    const startIndex = useRef<number>(Math.max(Platform.isWeb() ? getMaxZindex() : 1000, 1000)).current;
    /**
     * Adds a portal with a unique key and a JSX component to be rendered.
     * 
     * @param key - The unique key for identifying the portal.
     * @param component - The React element to render inside the portal.
     * @param props - The props to be passed to the View component that wraps the portal content.
     */
    const addPortal = (key: string, component: ReactNode, props?: IViewProps) => {
        portalRefs.current = [...portalRefs.current, { key, element: component, props }];
        updatePortalLayer();
    };

    /**
     * Removes a portal by its unique key.
     * 
     * @param key - The key identifying the portal to be removed.
     */
    const removePortal = (key: string) => {
        portalRefs.current = portalRefs.current.filter((portal) => portal.key !== key);
        updatePortalLayer();
    };

    /**
     * Triggers an update to re-render the portal container and ensure the top-most portal is displayed correctly.
     */
    const updatePortalLayer = () => {
        forceUpdate();
    };

    /**
     * Reducer function used to force a re-render of the portal container, without affecting the previously rendered portals.
     */
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const testID = "resk-portal";
    return (
        <PortalContext.Provider value={{ addPortal, removePortal }}>
            {children}
            {/* Dynamically render portal elements with a stacking order based on their position in the array */}
            <View testID={`${testID}-container`} style={styles.absoluteFill} pointerEvents="box-none">
                {portalRefs.current.map(({ key, element, props }, index) => (
                    <RenderPortal
                        testID={`${testID}_${index + 1}`}
                        key={key}
                        zIndex={startIndex + index + 1}
                        children={element}
                        {...Object.assign({}, props)}
                    />
                ))}
            </View>
        </PortalContext.Provider>
    );
};

function RenderPortal<AsProps extends ViewProps = IViewProps>({ children, absoluteFill, zIndex, ...props }: IPortalProps<AsProps> & { zIndex: number }) {
    return <View  {...Object.assign({}, props)} style={[{ zIndex }, absoluteFill && styles.absoluteFill, props?.style]}>
        {children}
    </View>
};

/**
 * Custom hook to access the portal context and manage adding or removing portals.
 * 
 * @returns An object containing two methods: `addPortal` and `removePortal`.
 * @throws Will throw an error if the hook is used outside of a `PortalProvider`.
 *
 * @example
 * ```tsx
 * const { addPortal, removePortal } = usePortal();
 * 
 * useEffect(() => {
 *   addPortal('my-unique-portal', <MyCustomComponent />);
 *   return () => removePortal('my-unique-portal');
 * }, []);
 * ```
 */
export const usePortal = (): IPortalContextProps => {
    const context = useContext(PortalContext);
    if (!context) {
        throw new Error('usePortal must be used within a PortalProvider');
    }
    return context;
};

export type IPortalProps<AsProps extends ViewProps = IViewProps> = AsProps & {
    /**
         * Optionally specify the element type to render the Tooltip with.
         * By default, it uses `Pressable`, but can be changed to any custom component.
         * This provides flexibility in rendering, allowing developers to 
         * choose the underlying element based on their needs.
         *
         * @type {IReactComponent}
         * @example
         * // Rendering the Tooltip with a custom component
         * as: CustomTooltipComponent
         */
    as?: IReactComponent<AsProps>;

    /***
     * 
     */
    absoluteFill?: boolean;
}

/**
 * The `Portal` component is used to render content dynamically on top of other components.
 * 
 * @remarks
 * The `Portal` component registers its content with the `PortalProvider`, ensuring that it appears above other content.
 * When the `Portal` component is unmounted, it automatically removes itself from the provider.
 * 
 * Each `Portal` should be given a unique key to ensure correct management by the provider.
 *
 * @param props - The properties passed to the `Portal`, including a unique key and the children to render.
 *
 * @example
 * ```tsx
 * <Portal key="my-portal-key">
 *   <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute' }}>
 *     <Text>This content is rendered in the portal</Text>
 *   </View>
 * </Portal>
 * ```
 */
export function Portal<AsProps extends ViewProps = IViewProps>({ children, ...props }: IPortalProps<AsProps>) {
    const { addPortal, removePortal } = usePortal();
    const key = useRef<string>(uniqid("portal-key")).current;
    useEffect(() => {
        // Register the portal when the component mounts
        addPortal(key, children, props);
        // Cleanup and remove the portal when the component unmounts
        return () => removePortal(key);
    }, [key, children]);
    return null; // Nothing is rendered here; content is managed by the PortalProvider
};


const styles = StyleSheet.create({
    absoluteFill: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
})