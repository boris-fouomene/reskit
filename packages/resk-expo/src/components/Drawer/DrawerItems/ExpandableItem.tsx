
import { defaultStr } from "@resk/core";
import DrawerItem from "./DrawerItem";
import { useDrawer } from "../hooks";
import { IDrawerItemProps } from "../types";
import { Expandable } from "@components/Expandable";
import { ICON_SIZE } from "../utils";
import { Divider } from "@components/Divider";
import { StyleSheet } from "react-native";
import Theme from "@theme/index";

/**
 * A component that renders an expandable drawer item.
 *
 * @param {IDrawerItemProps} props - The properties for the drawer item.
 * @param {string} props.testID - The test ID for the drawer item.
 * @param {object} props.expandableProps - The properties for the expandable component.
 * @param {object} rest - The remaining properties for the drawer item.
 *
 * @returns {JSX.Element} The rendered expandable drawer item.
 */
export default function ExpandableDrawerItem({ testID, items, children, dividerProps, divider, expandableProps, ...rest }: IDrawerItemProps) {
    testID = defaultStr(testID, "resk-drawer-expandable-item")
    const { drawer } = useDrawer();
    const minimized = drawer ? drawer.isMinimized() : false;
    expandableProps = Object.assign({}, expandableProps);
    const containerProps = Object.assign({}, expandableProps.containerProps);
    const expandableLabelProps = Object.assign({}, expandableProps.labelProps);
    return <Expandable
        testID={testID + "-expandable"}
        expandedIconProps={{ size: minimized ? ICON_SIZE : undefined, ...Object.assign({}, expandableProps?.expandedIconProps) }}
        labelProps={{ ...expandableLabelProps, style: [Theme.styles.noMargin, Theme.styles.noPadding, expandableLabelProps.style] }}
        containerProps={{ ...containerProps, style: [styles.expandable, containerProps.style] }}
        {...Object.assign({}, expandableProps)}
        children={<>
            {children}
            {divider && <Divider testID={testID + "-divider"} {...Object.assign({}, dividerProps)} />}
        </>}
        label={<DrawerItem
            {...rest}
            testID={testID}
        />}
    />
}


const styles = StyleSheet.create({
    expandable: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        //marginRight: 5,
        width: "100%",
    },

});