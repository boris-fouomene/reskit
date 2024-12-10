import { IAppBarProps } from "@components/AppBar";
import { IMenuItemBase, IMenuItems, IMenuItemsProps } from "@components/Menu/types";
import { IViewProps } from "@components/View";
import { IDimensions } from "@dimensions/types";
import { IDict, IObservable } from "@resk/core";
import { ReactNode } from "react";
import { Animated, GestureResponderEvent, PanResponderInstance } from "react-native";

export interface IDrawer extends IObservable {
    _lastOpenValue: any;
    id: string;
    _panResponder: PanResponderInstance;
    _isClosing: boolean;
    _closingAnchorValue: number;
    _navigationViewRef: any;
    _backdropRef: any;
    renderContent(): React.ReactNode;
    getSessionName(): string;
    getSession(key?: string): any;
    setSession(key: string, value?: any): any;
    isMinimizable(): boolean;
    isPermanent(): boolean;
    getStateOptions(drawerState?: IDrawerStateOptions | undefined | null): IDrawerStateOptions;
    canPin(): boolean;
    getProps(): Partial<IDrawerProps & IDrawerState>;
    getTestID(): string;
    isFullScreen(): boolean;
    canToggleFullScren(): boolean;
    toggleFullScreen(): void;
    getProviderAppBarProps(handleDrawerWidth?: boolean): IAppBarProps;
    renderProviderTitle(): React.ReactNode;
    renderProviderChildren(): React.ReactNode;
}



export interface IDrawerStateOptions extends IDict {
    context: IDrawer; //le contexte, le drawer layout même
    eventName?: string; //le nom de l'évènement qui est déclanché au moment de l'exécution de l'option
    id?: string; //represente l'id du drawer layout
    event?: GestureResponderEvent;
    newState?: string;
    minimized?: boolean;
    isPermanent?: boolean;
    isPinned?: boolean; //si le drawer state est épinglé, alias à isPermanant
    isMinimizable?: boolean;
    canPin?: boolean; //si le drawer peut être épinglé
    isTemporary?: boolean; //si le drawer à l'instant t est temporaire
    nativeEvent?: {
        offset?: number;
    };
}
/***
 * l'interface du state du drawer layout
 */
export interface IDrawerState {
    accessibilityViewIsModal: boolean;
    drawerShown: boolean;
    permanent?: boolean;
    minimized?: boolean; //si le drawer est minimisé
    isProvider: boolean;
    providerProps: IDrawerProviderProps;
    openValue: Animated.Value;
    drawerWidth?: number; //la largeur du drawer
    keyboardDismissMode?: "none" | "on-drag";
    onDrawerClose?: (options: IDrawerStateOptions) => any;
    onDrawerOpen?: (options: IDrawerStateOptions) => any;
    onDrawerSlide?: (options: IDrawerStateOptions) => any;
    /*** si le drawer est en plein écran */
    fullScreen?: boolean;
}
/***
 * les différentes positions du drawer layout
 */
export type IDrawerPosition = "left" | "right" | undefined;
/***
 * les props lorsque le composant est de type provider
 */
export interface IDrawerProviderProps extends IDrawerToggleOptions {
    position?: IDrawerPosition;
    minimizable?: boolean; //si le drawer est minimizable
    minimized?: boolean; // si le drawer est minimisé
    sessionName?: string; //le nom de la session à utiliser pour persister l'état du drawer
    testID?: string; //le test id du provider
    children?: any; //la prop enfant
    closeOnOverlayClick?: boolean; // si le drawer sera fermé lorsqu'on clique sur l'espace vide. c'est valable seulement lorsque le drawer est en mode temporaire
    appBarProps?: IAppBarProps | null; //les pross du composant AppBar, utiles pour le rendu du appBar
    permanent?: boolean; //su le provider est permanent
    onDrawerOpen?: (options: IDrawerStateOptions) => any; //lorsque le drawer est open
    onDrawerClose?: (options: IDrawerStateOptions) => any; //lorsque le drawer est closed
    onOverlayClick?: (options: IDrawerStateOptions) => any; //lorsque l'on clique sur l'espace autre que le drawer (overlay)
    drawerWidth?: number; //la largeur du drawer
    resetProvider?: boolean; //si le drawer  doit être réinitialisé
    /****l'on peut directement décider de render l'appBar au composant Drawer provider
      dans ce cas, il suffit de spécifier la props AppBar de type reactNode ou de type fonction qui lorsqu'elle est utilisée, retourne un reactNode
    */
    appBar?: ReactNode | ((options: IDrawerContext & { appBarProps: IAppBarProps }) => ReactNode);
}

/***
 * interface du contexte lié au drawer à l'instant t
 */
export interface IDrawerContext {
    drawer: IDrawer; //le contexte lié au drawer
}


export type IDrawerToggleOptions = Omit<Animated.SpringAnimationConfig, "toValue" | "useNativeDriver"> & {
    callback?: (options: IDrawerStateOptions) => void;
};

/***
 * les props du composant Drawer
 */
export interface IDrawerProps extends IViewProps {
    isProvider?: boolean;
    minimizable?: boolean; //si le drawer est minimizable
    minimized?: boolean; // si le drawer est minimisé
    sessionName?: string; //le nom de la session à utiliser pour persister l'état du drawer
    drawerLockMode?: "unlocked" | "locked-closed" | "locked-open" | undefined;
    position?: IDrawerPosition;
    drawerWidth?: number;
    getStateOptions?(drawerState?: IDrawerStateOptions): IDrawerStateOptions;
    closeOnOverlayClick?: boolean; // si le drawer sera fermé lorsqu'on clique sur l'espace vide. c'est valable seulement lorsque le drawer est en mode temporaire
    keyboardDismissMode?: "none" | "on-drag";
    onDrawerClose?: (options: IDrawerStateOptions) => any;
    onDrawerOpen?: (options: IDrawerStateOptions) => any;
    onOverlayClick?: (options: IDrawerStateOptions) => any; //lorsque l'on clique sur l'espace autre que le drawer (overlay)
    onDrawerSlide?: (options: IDrawerStateOptions) => any;
    onDrawerStateChanged?: (drawerState: IDrawerStateOptions) => any;
    renderNavigationView?: (drawerState?: IDrawerStateOptions) => React.ReactNode;
    statusBarBackgroundColor?: string;
    useNativeAnimations?: boolean;

    gesturesEnabled?: boolean;
    providerProps?: IDrawerProviderProps;
    backgroundColor?: string;
    elevation?: number;
    permanent?: boolean;
    navigationViewRef?: any;
}


export interface IDrawerSession {
    sessionName?: string;
    get name(): string;
    get: (a: string) => any,
    set: (a: string | object, b: any) => any,
};

/***
 * les porps du composant IDrawerItems
 */
export interface IDrawerItemsProps extends IMenuItems<IDrawerContext> {

}


export type IDrawerItemProps = IMenuItemBase<IDrawerContext> & {
    active?: boolean | (() => boolean); //specifie si l'item est actif où pas
    routePath?: string;//le chemin de route vers lequel naviguer lorsqu'on clique sur le drawer; cette route est appelée lorsque la props onPress ne retourne pas false
    routeParams?: IDict; //les paramètres de la route
    isRendable?: boolean;
}