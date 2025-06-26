import { Div } from '@html/Div';
import { createContext, useRef, useContext, ReactNode, useEffect, useReducer, useId, JSX } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { cn } from '@utils/cn';
import { styles } from './utils';
import { IPortalProps } from './types';
import allVariants from "@variants/all";
import { useAnimatedVisibility } from '@utils/animations';

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
     * The props to be passed to the Div component that wraps the portal content.
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
interface IPortalContext {
    /**
     * Adds a new portal to the application with a unique key and a component to render.
     * 
     * @param key - A unique string identifier for the portal.
     * @param component - The React element (JSX) that will be rendered within the portal.
     * @param props - The props to be passed to the Div component that wraps the portal content.
     * @example
     * ```tsx
     * const { addPortal } = usePortal();
     * addPortal('example-portal', <Div><Text>My Portal Content</Text></Div>,{testID:"a-test-id"});
     * ```
     */
    addPortal: (key: string, component: ReactNode, props?: Omit<IPortalProps, "children">) => void;

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
const PortalContext = createContext<IPortalContext | undefined>(undefined);

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
export function PortalProvider({ children }: { children?: ReactNode }): JSX.Element {
    const portalRefs = useRef<IPortalItem[]>([]);
    const startIndex = useRef<number>(1000).current;
    const addPortal = (key: string, children: ReactNode, props?: Omit<IPortalProps, "children">) => {
        portalRefs.current = [...portalRefs.current.filter(portal => portal?.key !== key), { key, children, props }];
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
    const updatePortalLayer = () => {
        forceUpdate();
    };
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const testID = "portal";
    return (
        <PortalContext.Provider value={{ addPortal, removePortal, portals: portalRefs.current }}>
            <View testID={testID + "-container"} style={{ flex: 1 }} pointerEvents="box-none">
                {children}
                {portalRefs.current.map(({ key, children, props }, index) => {
                    return (
                        <RenderedPortal
                            testID={`${testID}-${index + 1}`}
                            key={key}
                            zIndex={startIndex + index + 1}
                            children={children}
                            {...props}
                        />
                    );
                })}
            </View>
        </PortalContext.Provider>
    );
};

function RenderedPortal({ children, className, withBackdrop, animationDuration, onPress, style, visible, absoluteFill, testID, zIndex, ...props }: IPortalProps & { zIndex: number }) {
    const { shouldRender } = useAnimatedVisibility({ visible, duration: animationDuration });
    if (!shouldRender) return null;
    absoluteFill = withBackdrop || absoluteFill;
    const absoluteFillStyle = absoluteFill ? styles.absoluteFill : undefined;
    const handleBackdrop = withBackdrop || absoluteFill;
    const flattenStyle = StyleSheet.flatten([{ zIndex } as ViewStyle, style] as any);
    const backdropClassName = cn(allVariants({ backdrop: withBackdrop }));
    return <Div {...props} onPress={!handleBackdrop ? onPress : undefined} className={cn(!handleBackdrop && backdropClassName, className)} style={Object.assign({}, absoluteFillStyle, flattenStyle)}>
        {handleBackdrop ? <Div testID={testID + "-backdrop"} className={cn("portal-backdrop", backdropClassName)} style={absoluteFillStyle} onPress={onPress} /> : null}
        {children || null}
    </Div>
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
const usePortal = (): IPortalContext => {
    const context = useContext(PortalContext);
    return Object.assign({}, context);
};


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
 *   <Div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute' }}>
 *     <Text>This content is rendered in the portal</Text>
 *   </Div>
 * </Portal>
 * ```
 */
export function Portal({ children, ...props }: IPortalProps) {
    const { addPortal, removePortal } = usePortal();
    const key = useId();
    useEffect(() => {
        if (props.visible !== false && typeof addPortal === "function") {
            addPortal(key, children, props);
        }
        return () => {
            typeof removePortal === "function" && removePortal(key);
        }
    }, [key, children, props.absoluteFill, props.visible]);
    useEffect(() => {
        return () => {
            typeof removePortal === "function" && removePortal(key);
        }
    }, [])
    return null;
};