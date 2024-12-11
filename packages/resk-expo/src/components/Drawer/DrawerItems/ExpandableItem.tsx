
import { defaultStr } from "@resk/core";
import DrawerItem from "./DrawerItem";
import { useDrawer } from "../hooks";
import { IDrawerItemProps } from "../types";
import { Expandable } from "@components/Expandable";

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
export default function ExpandableDrawerItem({ testID, expandableProps, ...rest }: IDrawerItemProps) {
    testID = defaultStr(testID, "resk-drawer-expandable-item")
    const { drawer } = useDrawer();
    const minimized = drawer ? drawer.isMinimized() : false;
    return <Expandable
        testID={testID + "-expandable"}
        expandedIconProps={{ size: minimized ? 15 : undefined, ...Object.assign({}, expandableProps?.expandedIconProps) }}
        {...Object.assign({}, expandableProps)}
        label={<DrawerItem
            {...rest}
            testID={testID}
        />}
    />
}