import { IAppBarActionProps, IAppBarActionsProps, IAppBarContext, IAppBarProps, IAppBarResponsiveConfig } from "../types";
import { IReactNullableElement } from "@src/types";
import { renderNavItems } from "@components/Nav/utils";
import { AppBarAction } from "../Action";
import ExpandableAppBarAction from "../ExpandableAction";
import { defaultStr, isNonNullString, isNumber, isObj } from "@resk/core/utils";
import { Nav } from "@components/Nav";
import { useMemo } from "./hook";
import { useSafeId } from "@utils/index";




export function renderActions<Context = unknown>({ context, actionMutator, testID, renderAction, renderExpandableAction, actions: items, viewportWidth, maxVisibleActions, ...props }: IAppBarActionsProps<Context> & {
    actionMutator?: (renderer: Exclude<IAppBarActionsProps<Context>["renderAction"], undefined>, _props: IAppBarActionProps<Context>, index: number, isExpandable: boolean) => IReactNullableElement;

}) {
    renderAction = typeof renderAction === 'function' ? renderAction : renderAppBarAction;
    renderExpandableAction = typeof renderExpandableAction === 'function' ? renderExpandableAction : renderExpandableAppBarAction;
    const mutatedActionMutator = typeof actionMutator === 'function' ? actionMutator : (renderer: Exclude<IAppBarActionsProps<Context>["renderAction"], undefined>, props: IAppBarActionProps<Context>, index: number, isExpandable: boolean) => (renderer as any)(props, index);
    return renderNavItems<IAppBarContext<Context>>({
        ...props,
        context,
        items,
        renderItem: function (props, index) {
            return mutatedActionMutator(renderAction, props, index, false);
        },
        renderExpandableItem: function (props, index) {
            return mutatedActionMutator(renderExpandableAction, props, index, true);
        },
    });
}

function renderAppBarAction<Context = unknown>(props: IAppBarActionProps<Context>, index: number) {
    return <AppBarAction {...props} key={Nav.getItemRenderKey(props, index)} />;
}
function renderExpandableAppBarAction<Context = unknown>(props: IAppBarActionProps<Context>, index: number) {
    return <ExpandableAppBarAction
        {...props}
        key={Nav.getItemRenderKey(props, index)}
    />;
}

export function usePrepareActions<Context = unknown>({ actions: items }: IAppBarActionsProps<Context>) {
    const generatedId = useSafeId();
    return useMemo(() => {
        const menuToActionMap: Record<string, string> = {};
        //const actionsByIds: Record<string, (IAppBarActionProps<Context>)> = {};
        //const menuOnlyToActionMap: Record<string,string> = {};
        /**
         * represents the number of actions that will be rendered only on the menu
         */
        let menuOnlyActionCount = 0;
        /***
         * represents the number of actions that can be rendered on the menu
         */
        let menuRenderableActionCount = 0;
        // Early return if no actions
        if (!Array.isArray(items) || items.length === 0) {
            return {
                actions: [],
                menuItems: [],
                menuToActionMap,
                //actionsByIds,
                //menuOnlyToActionMap,
                menuOnlyActionCount,
                menuRenderableActionCount,
            }
        }
        const actions: (IAppBarActionProps<Context>)[] = [],
            menuItems: (IAppBarActionProps<Context>)[] = [];
        items.map((action, index) => {
            if (!isObj(action) || (action.visibleOnAppBar === false && action.visibleOnMenu === false) && !action.alwaysVisible) return null;
            const act: IAppBarActionProps<Context> = Object.clone(action);
            act.id = defaultStr(act.id, (generatedId + "-action-" + index));
            //actionsByIds[act.id] = act;
            const isRenderableOnAppBar = act.visibleOnAppBar !== false || act.alwaysVisible;
            if (isRenderableOnAppBar) {
                actions.push(act);
            }
            //we only display the action on the menu if it is not always visible
            if (act.visibleOnMenu !== false && !act.alwaysVisible) {
                const menuId = "__am-item-id__" + act.id;
                menuItems.push({
                    ...act,
                    id: menuId,
                });
                menuToActionMap[menuId] = act.id;
                if(!isRenderableOnAppBar) {
                    menuOnlyActionCount++;
                    //menuOnlyToActionMap[menuId] = act.id;
                } else {
                    menuRenderableActionCount++;
                }
            }
        });
        return {
            menuToActionMap,
            actions,
            menuItems: menuItems.sort((a, b) => {
                const aOrder = isNumber(a.onMenuOrder) ? a.onMenuOrder : Number.MAX_SAFE_INTEGER;
                const bOrder = isNumber(b.onMenuOrder) ? b.onMenuOrder : Number.MAX_SAFE_INTEGER;
                return aOrder - bOrder;
            }),
            //actionsByIds,
            //menuOnlyToActionMap,
            menuOnlyActionCount,
            menuRenderableActionCount,
        }
    }, [items, generatedId]);
}
export const APP_BAR_DEFAULT_RESPONSIVE_CONFIG: IAppBarResponsiveConfig = {
    sm: {
        minWidth: 640,
        maxActions: 1
    },
    md: {
        minWidth: 768,
        maxActions: 3,
    },
    lg: {
        minWidth: 1024,
        maxActions: 6
    },
    xl: {
        minWidth: 1280,
        maxActions: 10
    },
    '2xl': {
        minWidth: 1536,
        maxActions: 15
    }
};

const defaultNumber: (a: any, b: any) => number | undefined = (a, b) => isNumber(a) && a > 0 ? a : isNumber(b) && b > 0 ? b : undefined;
export const normalizeConfig = (config: Partial<IAppBarResponsiveConfig>): IAppBarResponsiveConfig => {
    const r: IAppBarResponsiveConfig = Object.clone(APP_BAR_DEFAULT_RESPONSIVE_CONFIG);
    if (!isObj(config)) return r;
    for (const bp in config) {
        const v: IAppBarResponsiveConfig[keyof IAppBarResponsiveConfig] = (config as any)[bp];
        if (!isObj(v)) continue;
        (r as any)[bp] = {
            maxActions: isNumber(v?.maxActions) && v.maxActions > 0 ? v.maxActions : defaultNumber((r as any)[bp]?.maxActions, undefined),
            minWidth: isNumber(v?.minWidth) && v.minWidth > 0 ? v.minWidth : defaultNumber((r as any)[bp]?.minWidth, 0)
        }
    }
    return Object.fromEntries(Object.entries(r).sort(([, a], [, b]) => (b as any).minWidth - (a as any).minWidth));
}

const getDefaultMaxAction = (bp: keyof IAppBarResponsiveConfig) => {
    if (!isNonNullString(bp)) return undefined;
    const v = APP_BAR_DEFAULT_RESPONSIVE_CONFIG[bp];
    return isNumber(v?.maxActions) && v.maxActions > 0 ? v.maxActions : undefined;
}
const getDefaultMinWidth = (bp: keyof IAppBarResponsiveConfig) => {
    if (!isNonNullString(bp)) return undefined;
    const v = APP_BAR_DEFAULT_RESPONSIVE_CONFIG[bp];
    return isNumber(v?.minWidth) && v.minWidth > 0 ? v.minWidth : 0;
}
export const getActiveMaxActions = (config: IAppBarResponsiveConfig, viewportWidth: number, breakpoints: Record<keyof IAppBarResponsiveConfig, number> = {} as any): number => {
    let activeMax = 1;
    breakpoints = isObj(breakpoints) ? breakpoints : {} as any;
    for (const bp in config) {
        let v: IAppBarResponsiveConfig[keyof IAppBarResponsiveConfig] = (config as any)[bp];
        if (!isObj(v) || !v) {
            v = {} as any;
        }
        if (v) {
            v.maxActions = isNumber(v?.maxActions) && v.maxActions > 0 ? v.maxActions : getDefaultMaxAction(bp as any) as any;
            v.minWidth = isNumber(v?.minWidth) && v.minWidth > 0 ? v.minWidth : getDefaultMinWidth(bp as any);
        }
        (config as any)[bp] = v;
        let bpVal = (breakpoints as any)[bp];
        if (!isNumber(bpVal) || bpVal < 0) {
            (breakpoints as any)[bp] = isNumber(v?.maxActions) ? v.maxActions : 0;
            bpVal = (breakpoints as any)[bp];
        }
        if (isNumber(v?.minWidth) && v.minWidth > 0 && isNumber(viewportWidth) && viewportWidth > 0 && viewportWidth >= v.minWidth) {
            activeMax = bpVal || activeMax
        }
    }
    return activeMax;
};
