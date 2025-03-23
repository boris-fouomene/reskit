import View, { IViewProps } from '@components/View';
import { IObservable, observable, uniqid } from '@resk/core';
import * as React from "react";
import { createContext, useRef, useContext, ReactNode, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, ViewProps } from 'react-native';
import { getMaxZindex, Platform } from '@resk/core';
import { ITouchableProps } from '@src/types';
import { getTouchableProps } from '@utils/hasTouchHandler';
import { useTheme } from '@theme/index';

type IPortalEvent = "add" | "remove";
class EventManager {
    static events: IObservable<IPortalEvent> = observable({});
}

/**
 * @interface IPortalItem
 * Interface defining the structure of a portal item.
 * 
 * @remarks
 * A `IPortalItem` consists of a unique key and the React element to be rendered.
 * These items are used internally in the `PortalProvider` to manage portal entries.
 */
interface IPortalItem {
    /**
     * Unique key to identify each portal, ensuring that individual portals can be added or removed dynamically.
     */
    key: string;

    /**
     * The React node (element) to be rendered inside the portal.
     * This could be any valid JSX element that should be displayed on top of the regular content.
     */
    children: ReactNode;

    /***
     * The props to be passed to the View component that wraps the portal content.
     */
    props?: Omit<IPortalProps, "children">;
}




/**
 * @interface IPortalContext
 * Interface defining the properties of the portal context.
 * 
 * @remarks
 * These methods (`addPortal`, `removePortal`) are provided to components via React's context API to manage portal operations like adding or removing portals.
 */
export interface IPortalContext {
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
    addPortal: (key: string, component: ReactNode, props?: IPortalProps) => void;

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

    /***
     * The list of portals
     */
    portals: IPortalItem[];
}

/**
 * React context used to manage and expose portal operations, like adding or removing portals.
 * 
 * @internal
 * The context will provide portal operations to all components wrapped within `PortalProvider`.
 */
export const PortalContext = createContext<IPortalContext | undefined>(undefined);

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
     * @param children - The React element to render inside the portal.
     * @param props - The props to be passed to the View children that wraps the portal content.
     */
    const addPortal = (key: string, children: ReactNode, props?: IPortalProps) => {
        portalRefs.current = [...portalRefs.current.filter(portal => portal?.key !== key), { key, children, props }];
        updatePortalLayer();
        EventManager.events.trigger("add", key);
    };

    /**
     * Removes a portal by its unique key.
     * 
     * @param key - The key identifying the portal to be removed.
     */
    const removePortal = (key: string) => {
        portalRefs.current = portalRefs.current.filter((portal) => portal.key !== key);
        updatePortalLayer();
        EventManager.events.trigger("remove", key);
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
        <PortalContext.Provider value={{ addPortal, removePortal, portals: portalRefs.current }}>
            {children}
            {/* Dynamically render portal elements with a stacking order based on their position in the array */}
            <View testID={`${testID}-container`} style={styles.absoluteFill} pointerEvents="box-none">
                {portalRefs.current.map(({ key, children, props }, index) => {
                    return (
                        <RenderedPortal
                            testID={`${testID}-${index + 1}`}
                            key={key}
                            zIndex={startIndex + index + 1}
                            children={children}
                            {...Object.assign({}, props)}
                        />
                    );
                })}
            </View>
        </PortalContext.Provider>
    );
};

function RenderedPortal({ children, visible, absoluteFill, backdrop, zIndex, ...props }: IPortalProps & { zIndex: number }) {
    const theme = useTheme();
    if (visible === false) return null;
    const touchableProps = getTouchableProps(props);
    const Component = useMemo(() => {
        return !!touchableProps ? Pressable : View;
    }, [!!touchableProps]);
    return <Component {...Object.assign({}, props)} style={[{ zIndex }, absoluteFill && styles.absoluteFill, backdrop && { backgroundColor: theme.colors.backdrop }, props?.style]}>
        {children || null}
    </Component>
};
RenderedPortal.displayName = "Portal.Rendered";
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
export const usePortal = (): IPortalContext => {
    const context = useContext(PortalContext);
    if (!context) {
        throw new Error('usePortal must be used within a PortalProvider');
    }
    return context;
};

/***
    @interface IPortalProps
    @description
    This interface defines the props that can be passed to the `Portal` component.
    It extends the `IViewProps` interface, allowing for additional props specific to the `Portal` component.
    @extends IViewProps
*/
export interface IPortalProps extends IViewProps, ITouchableProps {
    /***
     * The `absoluteFill` prop determines whether the portal should fill the entire screen.
       It means that the portal view will be styled using `position: absolute` and `top: 0`, `left: 0`, `right: 0`, and `bottom: 0` from react-native StyleSheet.absoluteFill.
     * If set to `true`, the portal will take up the entire screen, which can be useful for mobile
     * or immersive experiences.
     * Default is false.
     */
    absoluteFill?: boolean;

    /***
     * The `visible` prop determines whether the portal is visible or not.
     * If set to `false`, the portal will be hidden, which can be useful for hiding content temporarily.
     * Default is false
     */
    visible?: boolean;

    /***
     * Whether to add a backdrop background to the portal.
     * Default is false.
     * If true, the portal will have a backdrop background.
     */
    backdrop?: boolean;
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
export function Portal({ children, ...props }: IPortalProps) {
    const { addPortal, removePortal } = usePortal();
    const key = useRef<string>(uniqid("portal-key")).current;
    useEffect(() => {
        // Register the portal when the component mounts
        if (props.visible !== false) {
            addPortal(key, children, props);
        }
        return () => {
            removePortal(key);
        }
    }, [key, children, props.absoluteFill, props.visible]);
    useEffect(() => {
        return () => {
            removePortal(key);
        }
    }, [])
    return null; // Nothing is rendered here; content is managed by the PortalProvider
};


const styles = StyleSheet.create({
    absoluteFill: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    hidden: {
        flex: 0,
        zIndex: 0,
        display: 'none',
        opacity: 0,
    }
})