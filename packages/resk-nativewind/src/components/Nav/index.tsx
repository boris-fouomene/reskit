import { Button } from "@components/Button";
import { INavItemProps, INavItemsProps, INavLinkComponent, INavLinkProps } from "./types";
import { FC } from "react";
import { defaultStr, isObj } from "@resk/core/utils";
import { Divider } from "@components/Divider";
import { IReactComponent } from "@src/types";
import { Div } from "@html/Div";
import { useRenderNavItems } from "./hooks";
import { renderNavItems } from "./utils";
import { cn } from "@utils/cn";
import Platform from "@platform";
import { normalizeHtmlProps, normalizeNativeProps } from "@html/utils";
import { Expandable } from "@components/Expandable";

export class Nav {
    static readonly linkMetaData = Symbol("link-meta-data");
    static attachLinkComponent<Props extends INavLinkProps = INavLinkProps, State = unknown>(component: INavLinkComponent<Props, State>) {
        if (isValidLinkComponent(component as any)) {
            Reflect.defineMetadata(Nav.linkMetaData, component, Nav);
        }
    }
    static Link(props: INavLinkProps) {
        const component = Reflect.getMetadata(Nav.linkMetaData, Nav);
        const C = isValidLinkComponent(component) ? component : NavDefaultLink;
        return <C {...(Platform.isNative() ? normalizeNativeProps(props) : normalizeHtmlProps(props))} />
    }
    static renderItems({ items, renderItem, renderExpandableItem, ...rest }: INavItemsProps) {
        return renderNavItems({ ...rest, items, renderItem: typeof renderItem === "function" ? renderItem : renderNavItem, renderExpandableItem: typeof renderExpandableItem === "function" ? renderExpandableItem : renderExpandableNavItem });
    };
    static Item<Context = unknown>({ className, linkProps, variant, ...props }: INavItemProps<Context>) {
        return <Nav.Link asChild {...linkProps}>
            <Button
                testID="nav-item"
                role="navigation"
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
        return <Expandable
            testID={testID + "-expandable-item"}
            iconPosition="right"
            {...expandableProps}
            className={cn("w-full", expandableProps?.className)}
            label={<ExpandableItemLabel as={as} {...props} ref={ref} />}
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
(Nav.Item as FC<INavItemProps>).displayName = "Nav.Item";



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
export function AttachLinkComponent<Props extends INavLinkProps = INavLinkProps, State = unknown>() {
    return function (target: INavLinkComponent<Props, State>) {
        Nav.attachLinkComponent(target);
    };
}