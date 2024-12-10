import { defaultStr } from "@resk/core";
import DrawerItem from "./DrawerItem";
import { useDrawer } from "../hooks";
import { IDrawerItemProps } from "../types";
import { Expandable } from "@components/Expandable";

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