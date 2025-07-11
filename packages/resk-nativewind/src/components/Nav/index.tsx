import { Button } from "@components/Button";
import { INavItemProps, INavItemsProps } from "./types";
import { FC } from "react";
import { defaultStr } from "@resk/core/utils";
import { Details } from "@html/Details";
import { Divider } from "@components/Divider";
import { IReactComponent } from "@src/types";
import { Div } from "@html/Div";
import { useRenderNavItems } from "./hooks";
import { renderNavItems } from "./utils";
import { cn } from "@utils/cn";


export class Nav {
    static renderItems({ items, renderItem, renderExpandableItem, ...rest }: INavItemsProps) {
        return renderNavItems({ ...rest, items, renderItem: typeof renderItem === "function" ? renderItem : renderNavItem, renderExpandableItem: typeof renderExpandableItem === "function" ? renderExpandableItem : renderExpandableNavItem });
    };
    static Item<Context = unknown>({ className, ...props }: INavItemProps<Context>) {
        return <Button
            testID="nav-item"
            {...props}
            className={cn(className)}
        />
    }
    static Items<Context = unknown>({ items: customItems, renderItem, renderExpandableItem, testID, ...rest }: INavItemsProps<Context>) {
        testID = defaultStr(testID, "resk-nav-item");
        const items = useRenderNavItems<Context>({
            ...rest,
            items: (Array.isArray(customItems) ? customItems : []),
            renderItem: typeof renderItem === "function" ? renderItem : renderNavItem,
            renderExpandableItem: typeof renderExpandableItem === "function" ? renderExpandableItem : renderExpandableNavItem,
        });
        return <Div testID={testID} {...rest} className={cn("w-full nav-items", rest.className)}>
            {items}
        </Div>
    }
    static ExpandableItem<Context = unknown>({ testID, as, dividerClassName, items, divider, expandableProps, children, ref, ...props }: INavItemProps<Context> & { as?: IReactComponent<INavItemProps<Context>> }) {
        testID = defaultStr(testID, "resk-nav-expandable-item");
        expandableProps = Object.assign({}, expandableProps);
        return <Details
            testID={testID + "-expandable-item"}
            {...expandableProps}
            className={cn("w-full", expandableProps.className)}
            summary={<ExpandableItemLabel as={as} {...props} ref={ref} />}
            children={<>
                {children}
                {divider && <Divider testID={testID + "-divider"} className={dividerClassName} />}
            </>}
        />
    }
}
function renderExpandableNavItem<Context = unknown>({ ...props }: INavItemProps<Context>, index: number) {
    return <Nav.ExpandableItem {...props} key={index} />;
}
function renderNavItem<Context = unknown>(props: INavItemProps<Context>, index: number) {
    return <Nav.Item {...props as any} key={index} />;
}
function ExpandableItemLabel({ as, ...rest }: INavItemProps<any> & { as?: IReactComponent<INavItemProps<any>> }) {
    const Component = as || Nav.Item;
    return <Component
        role="tree"
        {...rest}
    />
};
ExpandableItemLabel.displayName = "Nav.ExpandableItemLabel";


(Nav.Item as FC<INavItemProps>).displayName = "MenuItem";


export * from "./types";
export * from "./hooks";