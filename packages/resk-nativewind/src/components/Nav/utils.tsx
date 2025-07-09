import { Fragment } from "react";
import { Divider } from "@components/Divider";
import { INavItemProps, INavRenderItemOptions, INavItemsProps } from "./types";
import { IReactNullableElement } from "../../types";
import Auth from "@resk/core/auth";
import { cloneObject, isObj } from "@resk/core/utils";
import { cn } from "@utils/cn";


function renderExpandableMenuItemOrSection<ItemContext = unknown>({ item, itemsNodes, index, context, renderItem, renderExpandableItem, level, itemClassName }: INavRenderItemOptions<ItemContext>) {
  level = typeof level == "number" && level || 0;
  if (item?.perm !== undefined && !Auth.isAllowed(item?.perm)) return null;
  const { section, items, ...rest } = item;
  return (section ? renderItem : renderExpandableItem)?.({ level, items, ...rest, className: cn(itemClassName, rest.className), children: itemsNodes, context }, index);
}


function renderNavItem<ItemContext = unknown>({ item, index, renderItem, renderExpandableItem, itemClassName, level, context }: INavRenderItemOptions<ItemContext>): IReactNullableElement {
  level = typeof level == "number" && level || 0;
  if (!item) return null;
  item.level = level;
  if (item.perm !== undefined && !Auth.isAllowed(item?.perm)) return null;
  if (!item.label && !item.icon && !item.children && item.divider === true) {
    const { dividerClassName } = item;
    return (<Divider key={index} className={dividerClassName} />)
  }
  if (Array.isArray(item.items)) {
    const itemsNodes: IReactNullableElement[] = [];
    item.items.map((it, i) => {
      if (!it) return null;
      it.level = (level as number) + 1;
      itemsNodes.push(renderNavItem({ level: (level as number) + 1, itemClassName, item: it as INavItemProps<ItemContext>, context, index: i, renderItem, renderExpandableItem }));
    });
    if (itemsNodes.length) {
      return renderExpandableMenuItemOrSection?.({ level, itemClassName, itemsNodes: itemsNodes, index, item, renderItem, renderExpandableItem, context }) as any
    }
  }
  return renderItem?.({ ...item, className: cn(itemClassName, item.className), level, context }, index) as any;
}



export function renderNavItems<ItemContext = unknown>({ items, renderItem, itemClassName, renderExpandableItem, context }: INavItemsProps<ItemContext>): IReactNullableElement[] {
  const _items: IReactNullableElement[] = [];
  const level = 0;
  if (Array.isArray(items)) {
    items.map((item, index) => {
      if (!item || !isObj(item)) return null;
      const clonedItem = cloneObject(item);
      clonedItem.level = level;
      const r = renderNavItem({ item: clonedItem, itemClassName, index, renderItem, renderExpandableItem, level, context });
      if (r) {
        _items.push(<Fragment key={index}>{r}</Fragment>);
      }
    });
  }
  return _items;
}

