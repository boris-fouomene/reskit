import React, { FC } from "react";
import { StyleSheet } from "react-native";
import View from "@components/View";
import TabItems from "./TabItems";
import TabItem from "./TabItem";
import TabContent from "./TabContent";
import Session from "@session";
import isValidElement from "@utils/isValidElement";
import { isNonNullString, defaultStr, isObj, IDict, ResourcesManager, Auth } from "@resk/core";
import { isNumber } from "lodash";
import Theme, { Colors, useTheme } from "@theme/index";
import { ITabItemProps, ITabProps } from "./types";
import TabContext from "./context";


export * from "./types";

let SessionObj: IDict = {};


/**
 * Sets the active index for a specific session in the session storage.
 * 
 * This function updates the active tab index for a given session name.
 * It retrieves the current session data, modifies the active index,
 * and saves it back to the session storage.
 * 
 * @param {number} activeIndex - The index of the active tab to set.
 * @param {string} [sessionName] - The name of the session to update. 
 * If not provided or invalid, the function will not perform any action.
 * 
 * @example
 * // Setting the active index to 1 for the session named 'userTabs'
 * setSessionActiveIndex(1, 'userTabs');
 */
const setSessionActiveIndex = (activeIndex: number, sessionName?: string) => {
    if (!isNonNullString(sessionName)) return;
    SessionObj = Object.assign({}, Session.get("tabs"));
    SessionObj.activeTabs = Object.assign({}, SessionObj.actives)
    SessionObj.activeTabs[sessionName as string] = activeIndex;
    Session.set('tabs', SessionObj);
}
/**
 * Retrieves the active index for a specific session from the session storage.
 * 
 * This function checks the session storage for the active tab index
 * associated with a given session name. If the session name is invalid
 * or not found, it defaults to returning 0. Additionally, it considers
 * the `activeIndex` prop passed to the component.
 * 
 * @param {ITabProps} props - The properties object that includes the session name and active index.
 * 
 * @returns {number} Returns the active index of the tab. If no valid session is found,
 * it returns 0. If the provided `activeIndex` prop is valid, it takes precedence.
 * 
 * @example
 * // Getting the active index for the session named 'userTabs'
 * const activeIndex = getSessionActiveIndex({ sessionName: 'userTabs', activeIndex: 1 });
 * console.log(activeIndex); // Outputs the active index or 0 if not found
 */
const getSessionActiveIndex = (props: ITabProps) => {
    const { sessionName } = props;
    if (!isNonNullString(sessionName)) return 0;
    SessionObj = Object.assign({}, Session.get("tabs"));
    SessionObj.activeTabs = Object.assign({}, SessionObj.activeTabs)
    let activeIndex = typeof SessionObj.activeTabs[sessionName as string] == "number" ? SessionObj.activeTabs[sessionName as string] : 0
    if (isNumber(props.activeIndex)) {
        activeIndex = props.activeIndex;
    }
    if (activeIndex > 0 && Array.isArray(props.children) && props.children.length) {
        return activeIndex <= props.children.length - 1 ? activeIndex : 0;
    }
    return activeIndex;
}

/**
 * Tab component that manages the display of multiple tab items and their associated content.
 * 
 * The `Tab` component provides a tabbed interface where users can switch between different
 * content sections by clicking on the corresponding tab items. It also handles session
 * management for active tabs, allowing the active state to persist across sessions.
 * 
 * @param {ITabProps} props - The properties for the Tab component.
 * @param {number} [props.activeIndex] - The index of the currently active tab. If not provided,
 * it defaults to the session value.
 * @param {object} [props.tabContentProps] - Additional properties to pass to the TabContent component.
 * @param {string} [props.testID] - An optional test ID for testing purposes.
 * @param {string} [props.sessionName] - A name for the session storage to maintain active tab state.
 * @param {React.ReactNode} [props.children] - The tab items and their associated content.
 * @param {function} [props.onChange] - Callback function to be called when the active tab changes.
 * @param {object} [props.tabItemProps] - Additional properties to pass to each TabItem component.
 * @param {object} [props.tabItemsProps] - Additional properties to pass to the TabItems component.
 * @param {boolean} [props.disabled] - Indicates whether the tab component is disabled.
 * 
 * @returns {JSX.Element} Returns a JSX element representing the Tab component with tab items and content.
 * 
 * @example
 * // Example usage of the Tab component
 * import {Tab} from "@resk/expo"
 * const MyTabs = () => (
 *   <Tab sessionName="userTabs" onChange={({ index }) => console.log(`Active Tab Index: ${index}`)}>
 *     <Tab.Item label="Home" tabKey="home">
 *       <View>Home Content</View>
 *     </Tab.Item>
 *     <Tab.Item label="Profile" tabKey="profile">
 *       <View>Profile Content</View>
 *     </Tab.Item>
 *     <Tab.Item label="Settings" tabKey="settings">
 *       <View>Settings Content</View>
 *     </Tab.Item>
 *   </Tab>
 * );
 */
const Tab = (props: ITabProps) => {
    let { activeIndex: customActiveIndex, tabContentProps, testID, sessionName, style: customStyle, children, onChange, tabItemProps, tabItemsProps: customTabItemsProps, disabled, ...rest } = props;
    let activeIndex = getSessionActiveIndex(props);
    rest = Object.assign({}, rest);
    const { colorScheme, ...tabItemsProps } = Object.assign({}, customTabItemsProps);
    tabItemProps = Object.assign({}, tabItemProps);
    const style = StyleSheet.flatten([customStyle]);
    const theme = useTheme();
    const tabsItemsStyle = Object.assign({}, StyleSheet.flatten(tabItemsProps.style));

    const tabItemsColorScheme = theme.getColorScheme(colorScheme);
    const tabItemsBackgroundColor = Colors.isValid(tabItemsColorScheme.backgroundColor) ? tabItemsColorScheme.backgroundColor : Colors.isValid(tabsItemsStyle.backgroundColor) ? tabsItemsStyle.backgroundColor : undefined;
    const tabItemsTextColor = Colors.isValid(tabItemsColorScheme.color) ? tabItemsColorScheme.color : Colors.isValid(tabsItemsStyle.backgroundColor) ? Colors.setAlpha(tabsItemsStyle.backgroundColor as string, 0.6) : undefined;

    const defaultActiveTabItemTextColor = tabItemsTextColor || (theme.dark ? theme.colors.onSurface : theme.colors.onPrimary);
    const backgroundColor = tabItemsBackgroundColor || (theme.dark ? theme.colors.surface : theme.colors.primary);
    const defaultTextColor = Colors.setAlpha(defaultActiveTabItemTextColor, 0.6);
    tabsItemsStyle.backgroundColor = backgroundColor;
    const indicatorStyle: IDict = Object.assign({}, StyleSheet.flatten(tabItemsProps.indicatorProps?.style));
    indicatorStyle.backgroundColor = Colors.isValid(indicatorStyle.backgroundColor) ? indicatorStyle.backgroundColor : defaultActiveTabItemTextColor;

    tabContentProps = Object.assign({}, tabContentProps);
    const [index, setIndex] = React.useState(getSessionActiveIndex(props));
    const setActiveIndex = ({ index: nIndex }: { index: number }) => {
        setIndex(nIndex);
        setSessionActiveIndex(nIndex, sessionName);
        if (nIndex === index) return;
        if (onChange) {
            onChange({ index: nIndex, sessionName, setActiveIndex: (index) => { setActiveIndex({ index }) } });
        }
    }
    React.useEffect(() => {
        activeIndex = getSessionActiveIndex(props);
        if (activeIndex !== index) {
            setActiveIndex(activeIndex);
        }
    }, [children, activeIndex]);
    testID = defaultStr(testID, "resk-tab");
    const { tabs, contents } = React.useMemo(() => {
        const tabs: React.ReactNode[] = [], contents: React.ReactNode[] = [];
        React.Children.map(children, (child, index) => {
            if (!isObj(child)) return null;
            const _child: React.ReactElement = child as React.ReactElement;
            const { label, tabItemKey, perm, children: childChildren, ...rest } = (isObj(_child.props) ? _child.props : child) as ITabItemProps;
            if (!isValidElement(label, true) || (perm !== undefined && !Auth.isAllowed(perm))) {
                return null;
            }
            const key = String((typeof tabItemKey == 'string' && tabItemKey ? tabItemKey : typeof label == 'string' && label ? label : index)) + index;
            tabs.push(<TabItem
                key={key}
                {...tabItemProps}
                {...rest}
                label={label}
                style={[tabItemProps?.style, rest.style]}
                testID={defaultStr(testID, tabItemProps?.testID) + "-tab-item-" + index}
            />);
            contents.push(<React.Fragment key={key}>
                {childChildren}
            </React.Fragment>)
        })
        return { tabs, contents }
    }, [children, theme]);
    if (!tabs.length) return null;
    return <TabContext.Provider value={{ ...props, setActiveIndex, defaultTextColor, defaultActiveTabItemTextColor, activeIndex: index }}>
        <View {...rest} testID={testID} style={[styles.container, style, disabled && Theme.styles.disabled]}>
            <TabItems testID={testID + "-tab-items"} {...tabItemsProps} style={tabsItemsStyle} indicatorProps={Object.assign({}, tabItemsProps.indicatorProps, { style: indicatorStyle })}>
                {tabs}
            </TabItems>
            <TabContent testID={testID + "-tab-content"}
                {...tabContentProps} disabled={tabContentProps.disabled || disabled} activeIndex={index} style={[styles.container, tabContentProps.style]}>
                {contents}
            </TabContent>
        </View>
    </TabContext.Provider>
}



export { Tab }

/**
 * Represents an individual tab item within a Tab component.
 * 
 * The `TItem` component is designed to display a single tab's content or label.
 * It accepts properties defined in the `ITabItemProps` interface, allowing for
 * customization of the tab's appearance and behavior.
 *
 * @component
 * @param {ITabItemProps} props - The properties for the tab item.
 * 
 * @example
 * // Example usage of the TItem component
 * const MyTabItem = () => (
 *   <TItem title="Home" icon="home-icon" />
 * );
 * 
 * @returns {JSX.Element | null} Returns a JSX element representing the tab item, or null if not rendered.
 * 
 * @remarks
 * This component currently returns null. To make it functional, implement the rendering logic
 * within the component based on the provided props.
 */
const TItem: FC<ITabItemProps> = (props: ITabItemProps) => null;
TItem.displayName = "TabItem";

/**
 * The Tab component serves as a container for multiple tab items.
 * 
 * This component manages the overall structure and behavior of the tab interface,
 * allowing users to switch between different content sections based on the active tab.
 * 
 * The `Item` property of the `Tab` component allows users to define individual tab items
 * using the `TItem` component.
 * 
 * @example
 * // Example usage of the Tab component with the TItem
 * const MyTabs = () => (
 *   <Tab>
 *     <Tab.Item label="Home" icon="home-icon" />
 *     <Tab.Item label="Profile" icon="user-icon" />
 *     <Tab.Item label="Settings" icon="settings-icon" />
 *   </Tab>
 * );
 */
Tab.Item = TItem;


const styles = StyleSheet.create({
    container: {
        minHeight: 150,
        flex: 1,
    },
    disabled: {
        pointerEvents: "none",
    }
})

Tab.displayName = "Tab";

export * from "./TabContent";
export * from "./TabItems";
export * from "./TabItem";