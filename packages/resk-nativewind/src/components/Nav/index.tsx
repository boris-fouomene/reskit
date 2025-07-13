import { Button } from "@components/Button";
import { INavItemProps, INavItemsProps, INavLinkComponent, INavLinkProps } from "./types";
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
    static readonly linkMetaData = Symbol("link-meta-data");
    static attachLinkComponent(component: INavLinkComponent) {
        if (isValidLinkComponent(component)) {
            Reflect.defineMetadata(Nav.linkMetaData, component, Nav);
        }
    }
    static get Link(): INavLinkComponent {
        const component = Reflect.getMetadata(Nav.linkMetaData, Nav);
        if (isValidLinkComponent(component)) {
            return component;
        }
        return NavDefaultLink;
    }
    static renderItems({ items, renderItem, renderExpandableItem, ...rest }: INavItemsProps) {
        return renderNavItems({ ...rest, items, renderItem: typeof renderItem === "function" ? renderItem : renderNavItem, renderExpandableItem: typeof renderExpandableItem === "function" ? renderExpandableItem : renderExpandableNavItem });
    };
    static Item<Context = unknown>({ className, linkProps, variant, ...props }: INavItemProps<Context>) {
        return <Nav.Link testID={"resk-nav-link"} asChild {...linkProps}>
            <Button
                testID="nav-item"
                {...props}
                variant={{ paddingX: 2, ...variant }}
                className={cn(className)}
            />
        </Nav.Link>
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
        return <Details
            testID={testID + "-expandable-item"}
            {...expandableProps}
            className={cn("w-full", expandableProps?.className)}
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

function NavDefaultLink({ children }: INavLinkProps) {
    return <>{children}</>
}
NavDefaultLink.displayName = "Nav.DefaultLink";

ExpandableItemLabel.displayName = "Nav.ExpandableItemLabel";

function isValidLinkComponent(component: INavLinkComponent) {
    return typeof component === "function";
}
(Nav.Item as FC<INavItemProps>).displayName = "MenuItem";



export * from "./types";
export * from "./hooks";



/**
 * A decorator factory function that creates a decorator to attach a navigation link component to the Nav class.
 * 
 * This decorator allows you to register custom link components that will be used by the Nav class
 * for rendering navigation links. The attached component becomes the default link component
 * accessible via `Nav.Link`.
 * 
 * @example
 * ```tsx
 * // Using with a custom Next.js Link component
 * @AttachLinkComponent()
 * function NextLink({ href, children, ...props }: INavLinkProps) {
 *   return (
 *     <Link href={href} {...props}>
 *       {children}
 *     </Link>
 *   );
 * }
 * 
 * // Now Nav.Link will use NextLink component
 * <Nav.Item linkProps={{ href: "/dashboard" }}>
 *   Dashboard
 * </Nav.Item>
 * ```
 * 
 * @example
 * ```tsx
 * // Using with React Router Link
 * @AttachLinkComponent()
 * function RouterLink({ to, children, ...props }: INavLinkProps) {
 *   return (
 *     <Link to={to} {...props}>
 *       {children}
 *     </Link>
 *   );
 * }
 * ```
 * 
 * @returns A decorator function that accepts a navigation link component and registers it with the Nav class
 * 
 * @decorator
 * @see {@link Nav.attachLinkComponent} - The underlying method used to attach the component
 * @see {@link Nav.Link} - The property that returns the attached link component
 * @see {@link INavLinkComponent} - The interface that the target component must implement
 * 
 * @since 1.0.0
 * @public
 */
export function AttachLinkComponent() {
    return function (target: INavLinkComponent) {
        Nav.attachLinkComponent(target);
    };
}