"use client";
import { Menu } from "@components/Menu";
import { IAppBarActionProps, IAppBarActionsProps } from "../types";
import { cn } from "@utils/cn";
import { FONT_ICONS, Icon } from "@components/Icon";

export function AppBarMenu<Context = unknown>({ overflowMenuAccessibilityLabel, actions, context, menuItems, menuProps, testID }: IAppBarActionsProps<Context> & { menuItems: IAppBarActionProps<Context>[] }) {
    const {
        anchorClosedIconName,
        anchorOpenIconName,
        anchorClassName,
        anchorIconVariant,
        anchorIconSize,
        ...restMenuProps
    } = Object.assign({}, menuProps);
    return <Menu
            preferredPositionAxis='vertical'
            testID={`${testID}-menu`}
            anchor={({ menu }) => {
                // Determine which icon to show based on menu state
                // When menu is open: use anchorOpenIconName
                // When menu is closed: use anchorClosedIconName (default state)
                const isMenuOpen = menu?.isOpen?.();
                const iconName = (isMenuOpen ? anchorOpenIconName : anchorClosedIconName)
                    || FONT_ICONS.MORE;

                return <Icon.Button
                    variant={anchorIconVariant}
                    size={anchorIconSize || 28}
                    fontIconName={iconName as any}
                    className={cn("flex-none mx-[7px]", anchorClassName)}
                    accessibilityLabel={overflowMenuAccessibilityLabel}
                    onPress={() => {
                        menu?.open();
                    }}
                />
            }}
            items={menuItems}
            context={context}
            {...restMenuProps}
            containerClassName={cn("appbar-menu-container", restMenuProps.containerClassName)}
            className={cn("appbar-menu", restMenuProps.className)}
        />
}

AppBarMenu.displayName = "AppBar.Menu";