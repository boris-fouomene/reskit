
import { defaultStr } from "@resk/core";
import DrawerItem from "./DrawerItem";
import { useDrawer } from "../hooks";
import { IDrawerItemProps } from "../types";
import { ICON_SIZE } from "../utils";
import { ExpandableItem } from "@components/Menu/ExpandableItem";

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
export default function ExpandableDrawerItem({ testID, context, items, dividerProps, divider, expandableProps, ...rest }: IDrawerItemProps) {
    testID = defaultStr(testID, "resk-drawer-expandable-item")
    const { drawer } = useDrawer();
    const minimized = drawer ? drawer.isMinimized() : false;
    expandableProps = Object.assign({}, expandableProps);
    return <ExpandableItem
        {...rest}
        context={Object.assign({}, context, { drawer })}
        expandableProps={{ ...expandableProps, expandedIconProps: { size: minimized ? ICON_SIZE : undefined, ...Object.assign({}, expandableProps?.expandedIconProps) } }}
        as={DrawerItem}
        testID={testID}
    />
}