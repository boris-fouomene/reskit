import { Fragment } from "react";
import { Divider } from "@components/Divider";
import { IMenuItem, IMenuRenderItemOptions, IMenuRenderItemsOptions } from "./types";
import { IReactNullableElement } from "../../types";
import Auth from "@resk/core/auth";
import { cloneObject, isObj } from "@resk/core/utils";


function renderExpandableMenuItemOrSection<ItemContext = unknown>({ item, itemsNodes, index, context, render, renderExpandable, level }: IMenuRenderItemOptions<ItemContext>) {
  level = typeof level == "number" && level || 0;
  if (item?.perm !== undefined && !Auth.isAllowed(item?.perm)) return null;
  const { section, items, ...rest } = item;
  context = { ...Object.assign({}, rest.context), ...Object.assign({}, context) };
  return (section ? render : renderExpandable)({ level, items, ...rest, children: itemsNodes, context }, index);
}


function renderMenuItem<ItemContext = unknown>({ item, index, render, renderExpandable, level, context }: IMenuRenderItemOptions<ItemContext>): IReactNullableElement {
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
      itemsNodes.push(renderMenuItem({ level: (level as number) + 1, item: it as IMenuItem<ItemContext>, context, index: i, render, renderExpandable }));
    });
    if (itemsNodes.length) {
      return renderExpandableMenuItemOrSection({ level, itemsNodes: itemsNodes, index, item, render, renderExpandable, context })
    }
  }
  return render({ ...item, level, context: { ...Object.assign({}, item.context), ...Object.assign({}, context) } }, index);
}



export function renderMenuItems<ItemContext = unknown>({ items, render, renderExpandable, context }: IMenuRenderItemsOptions<ItemContext>): IReactNullableElement[] {
  const _items: IReactNullableElement[] = [];
  const level = 0;
  if (Array.isArray(items)) {
    items.map((item, index) => {
      if (!item || !isObj(item)) return null;
      const clonedItem = cloneObject(item);
      clonedItem.level = level;
      const r = renderMenuItem({ item: clonedItem, index, render, renderExpandable, level, context });
      if (r) {
        _items.push(<Fragment key={index}>{r}</Fragment>);
      }
    });
  }
  return _items;
}

