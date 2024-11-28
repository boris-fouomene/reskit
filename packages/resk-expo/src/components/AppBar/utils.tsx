import { renderMenuItems } from "@components/Menu/utils";
import { getDimensions } from "@dimensions";
import { ITheme, IThemeColorSheme, IThemeColorTokenKey } from "@theme/types";
import { IMenuItemRenderFunc, IMenuRenderItemsOptions } from "@components/Menu/types";
import { IAppBarAction, IAppBarContext, IAppBarProps } from "./types";
import Theme, { Colors } from "@theme/index";
import { Dimensions } from "react-native";
import { IDict } from "@resk/core";
import { IReactNullableElement } from "@src/types";



const ACTION_ICON_SIZE = 30;

const TITLE_FONT_SIZE = 16;


/**
 * Calculates the maximum number of actions that can be displayed in the AppBar
 * based on the provided window width. This function helps to ensure that the AppBar
 * remains visually appealing and functional by dynamically adjusting the number of
 * actions based on the available space.
 *
 * @param {number} [windowWidth] - The width of the window. If not provided, the function
 *                                  will use the current window width minus 100 pixels.
 * 
 * @returns {number} The maximum number of actions that can be displayed in the AppBar.
 * 
 * @example
 * const maxActions = getAppBarMaxActions(800); // Returns 2 for a window width of 800
 * const defaultMaxActions = getAppBarMaxActions(); // Returns the max actions based on current window width
 */
const getAppBarMaxActions = (windowWidth?: number): number => {
  let iWidth = typeof windowWidth == "number" && windowWidth > 200 ? windowWidth : Dimensions.get("window").width - 100;
  return iWidth >= 3000 ? 8 : iWidth >= 2500 ? 7 : iWidth >= 2000 ? 6 : iWidth >= 1600 ? 5 : iWidth >= 1300 ? 4 : iWidth >= 800 ? 2 : iWidth >= 600 ? 1 : 0;
};


/**
 * Splits the actions for the AppBar into directly rendered actions and expandable menuItems.
 * This function helps manage how many actions can be displayed based on the available space,
 * and it renders the actions accordingly, either as buttons or as expandable menu items.
 *
 * @template IAppBarActionContext - A generic type parameter that allows extending the context 
 * for AppBar actions, enabling customization of the properties passed to action items.
 *
 * @param {Object} params - The parameters for the function.
 * @param {IAppBarAction<IAppBarActionContext>[]} params.actions - The array of actions to be rendered.
 * @param {IMenuItemRenderFunc<IAppBarActionContext>} params.render - The function used to render an action.
 * @param {string} [params.textColor] - The color for the text elements in the AppBar.
 * @param {string} [params.backgroundColor] - The background color of the AppBar.
 * @param {IMenuItemRenderFunc<IAppBarActionContext>} [params.renderExpandable] - The function used to render expandable actions.
 * @param {number} [params.windowWidth] - The width of the window, used to determine the maximum number of actions.
 * @param {boolean} [params.isAppBarAction] - Indicates if the actions are for the AppBar.
 * @param {number} [params.maxActions] - The maximum number of actions to display.
 * @param {IAppBarActionContext} [params.context] - The context to pass to each action.
 *
 * @returns {{ actions: IReactNullableElement[]; menuItems: IAppBarAction[] }} An object containing the rendered actions and any menuItems.
 *
 * @example
 * const { actions, menuItems } = splitAppBarActions({
 *   actions: myActions,
 *   render: myRenderFunction,
 *   windowWidth: 800,
 *   maxActions: 5,
 * });
 */
export function splitAppBarActions<IAppBarActionContext = any>({
  actions: items,
  renderAction: render,
  //textColor: color,
  //backgroundColor,
  renderExpandableAction: renderExpandable,
  windowWidth,
  isAppBarAction,
  maxActions,
  context,
}: IAppBarProps<IAppBarActionContext> & {
  isAppBarAction?: boolean /*** s'il s'agit des actions qui seront affiché sous l'AppBar */;
}): { actions: IReactNullableElement[]; menuItems: IAppBarAction[] } {
  const { isMobileOrTablet, window } = getDimensions();
  const isMobile = isMobileOrTablet || (typeof windowWidth == "number" && windowWidth < window.width);
  isAppBarAction = isAppBarAction && isMobile ? true : false;
  const menuItems: IAppBarAction[] = [];
  const actionCounter = { current: 0 };
  context = Object.assign({}, context);
  const mAction: number = typeof maxActions === "number" && maxActions ? Math.trunc(maxActions) : getAppBarMaxActions(windowWidth);
  //color = Colors.isValid(color) ? color : Theme.getColor(color as IThemeColorTokenKey);
  //backgroundColor = Colors.isValid(backgroundColor) ? backgroundColor : Theme.getColor(backgroundColor as IThemeColorTokenKey);
  const renderedActions = [];
  const canRenderAction = (level?: number) => {
    if (level) return false;
    return (actionCounter.current <= mAction && mAction > 1) || items?.length === 1 //|| !renderedActions.length;
  };
  const pushAction = (action: IReactNullableElement, item: IAppBarAction<IAppBarActionContext>, level?: number) => {
    if (canRenderAction(level)) {
      renderedActions.push(level);
      return action;
    }
    if (!level) {
      menuItems.push(item);
    }
    return null;
  };
  const _render = function (renderCb: IAppBarProps<IAppBarActionContext>["renderAction"], props: IAppBarAction<IAppBarContext<IAppBarActionContext>>, index: number): IReactNullableElement {
    if (!props?.level && actionCounter.current <= mAction + 1) {
      actionCounter.current++;
    }
    const itx: IAppBarAction<IAppBarActionContext> = props;
    return pushAction(typeof renderCb != "function" ? null : renderCb(itx, index), itx, props.level);
  };
  const actions = renderMenuItems<IAppBarContext<IAppBarActionContext>>({
    context: Object.assign({}, { isAppBar: true }, context),
    items: items,
    render: function (props, index) {
      return _render(render, props, index);
    },
    renderExpandable: function (props, index) {
      return _render(renderExpandable, props, index);
    },
  });
  return {
    actions,
    menuItems,
  };
}
