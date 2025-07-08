import { createContext, useRef, useContext, ReactNode, useEffect, useReducer, useId, JSX } from 'react';
import { View } from 'react-native';
import { IPortalProps } from './types';
import { defaultStr } from '@resk/core/utils';
import { cn } from '@utils/cn';
import { Div } from '@html/Div';
import allVariants from "@variants/all";

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
     * const { addPortal } = useInternalPortal();
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
     * const { removePortal } = useInternalPortal();
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
const InternalPortalContext = createContext<IPortalContext | undefined>(undefined);

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
    const addPortal = (key: string, children: ReactNode, props?: Omit<IPortalProps, "children">) => {
        portalRefs.current = [...portalRefs.current.filter(portal => portal.key !== key), { key, children, props }];
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
    const [, updatePortalLayer] = useReducer((x) => Object.create(null), Object.create(null));
    const testID = "portal";
    return (
        <InternalPortalContext.Provider value={{ addPortal, removePortal, portals: portalRefs.current }}>
            <View testID={testID + "-container"} style={{ flex: 1 }} pointerEvents="box-none">
                {children}
                {portalRefs.current.map(({ key, children, props }, index) => {
                    return (
                        <PortalItem
                            testID={`${testID}-${index + 1}`}
                            key={key}
                            zIndex={index + 1}
                            children={children}
                            {...props}
                        />
                    );
                })}
            </View>
        </InternalPortalContext.Provider>
    );
};

function PortalItem({ children, style, testID, withBackdrop, zIndex, ...props }: IPortalProps & { zIndex: number }) {
    zIndex = (1000 + zIndex);
    const portalStyle = { zIndex }
    testID = defaultStr(testID, "resk-resk-portal");
    return <Div
        {...props}
        className={cn("resk-portal", allVariants({ backdrop: withBackdrop }), props.className)}
        style={StyleSheet.flatten([portalStyle, style])}
    >
        {children}
    </Div>
};
PortalItem.displayName = "Portal.Item";
/**
 * Custom hook to access the portal context and manage adding or removing portals.
 * 
 * @returns An object containing two methods: `addPortal` and `removePortal`.
 * @throws Will throw an error if the hook is used outside of a `PortalProvider`.
 *
 * @example
 * ```tsx
 * const { addPortal, removePortal } = useInternalPortal();
 * 
 * useEffect(() => {
 *   addPortal('my-unique-portal', <MyCustomComponent />);
 *   return () => removePortal('my-unique-portal');
 * }, []);
 * ```
 */
const useInternalPortal = (): IPortalContext => {
    const context = useContext(InternalPortalContext);
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
    const key = useId();
    const { addPortal, removePortal } = useInternalPortal();
    useEffect(() => {
        if (typeof addPortal === "function") {
            addPortal(key, children, props);
        }
    }, [key, children, props.className, props.withBackdrop]);
    useEffect(() => {
        return () => {
            typeof removePortal === "function" && removePortal(key);
        }
    }, [key])
    return null;
};