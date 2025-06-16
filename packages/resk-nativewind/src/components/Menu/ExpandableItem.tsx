import { defaultStr } from "@resk/core";
import { MenuItem } from "./Item";
import { IMenuItem, IMenuItemProps } from "./types";
import { Divider } from "@components/Divider";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { IReactComponent } from "@src/types";
import { useMenu } from "./context";
import { Details } from "@html/Details";


export function ExpandableItem<Context = unknown>({ testID, as, dividerClassName, items, divider, expandableProps, children, ref, ...props }: IMenuItem<Context> & { as?: IReactComponent<IMenuItem<Context>> }) {
    testID = defaultStr(testID, "resk-menu-expandable-item");
    expandableProps = Object.assign({}, expandableProps);
    return <Details
        testID={testID + "-expandable-item"}
        {...expandableProps}
        summary={<ExpandableItemLabel as={as} {...props} ref={ref} />}
        children={<>
            {children}
            {divider && <Divider testID={testID + "-divider"} className={dividerClassName} />}
        </>}
    />
};
function ExpandableItemLabel({ as, ...rest }: IMenuItem<any> & { as?: IReactComponent<IMenuItem<any>> }) {
    const Component = useMemo(() => {
        return as || MenuItem;
    }, [as]);
    return <Component
        role="tree"
        {...rest}
    />
};
ExpandableItemLabel.displayName = "Menu.ExpandableItemLabel";
ExpandableItem.displayName = "Menu.ExpandableItem";


function ExpandableMenuItem<Context = unknown>({ testID, context, ...props }: IMenuItemProps<Context>) {
    const menuContext = useMenu();
    return <ExpandableItem
        testID={testID}
        {...props as any}
        context={Object.assign({}, context, menuContext)}
        as={MenuItem}
    />
};


ExpandableMenuItem.displayName = "ExpandableMenuItem";
export default ExpandableMenuItem;

const styles = StyleSheet.create({
    expandable: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        //marginRight: 5,
    },
});

