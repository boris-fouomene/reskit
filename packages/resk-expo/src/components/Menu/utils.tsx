import { ReactNode } from "react";
import { Divider } from "@components/Divider";
import { IDict } from "@resk/core";
import { IMenuItemProps } from "./types";

const isAllowed = (p: any) => true;


/***
 * permet de render le composant Expandable ou la section
 * @param {
*    item {IMenuItemProps<ItemExtendContext>}, l'item qu'on veut render
*    itemsNodes {ReactNode[]}, les enfants de l'item en cours, rendu avec la méthode renderMenuItem, appliqué à chaque item (IMenuItemProps<ItemExtendContext>) enfant
*    subItems {IMenuItemProps<ItemExtendContext>[]}, les subitems de l'élément parent. il s'agit des subitems, obtenus en faisant la boucle sur la prop items de l'élément qu'on souhaite render
*    index {number}, l'indice de l'éménet dans la liste des items
* }
 */
export const renderExpandableMenuItemOrSection = function <ItemExtendContext = any>({ item, itemsNodes, index, context, render, renderExpandable, level }: { item: IMenuItemProps<ItemExtendContext>, itemsNodes: ReactNode[], index?: number, render: IMenuItemRenderFunc<ItemExtendContext>, renderExpandable: IMenuItemRenderFunc<ItemExtendContext>, level?: number, context?: IDict }) {
  level = typeof level == "number" && level || 0;
  if (!isAllowed(item)) return null;
  const { section, ...rest } = item;
  if (section) {
    return render({ level, ...rest, context: { ...Object.assign({}, rest.context), ...Object.assign({}, context) } } as IMenuItemProps<ItemExtendContext>, index);
  } else {
    return renderExpandable({ level, ...rest as IMenuItemProps<ItemExtendContext>, children: itemsNodes as ReactNode, context: { ...Object.assign({}, rest.context), ...Object.assign({}, context) } }, index);
  }
}

export function renderMenuItem<ItemExtendContext = any>({ item, index, render, renderExpandable, level, context }: { item: IMenuItemProps<ItemExtendContext>, index: number, render: IMenuItemRenderFunc<ItemExtendContext>, renderExpandable: IMenuItemRenderFunc<ItemExtendContext>, level?: number, context?: IDict }): ReactNode {
  level = level || 0;
  if (!item) return null;
  item.level = level;
  if (!isAllowed(item)) return null;
  if (!item.label && !item.icon) {
    if (item.divider === true) {
      const { dividerProps } = item;
      return (<Divider key={index} {...Object.assign({}, dividerProps)} />)
    }
    return null;
  }
  if (Array.isArray(item.items)) {
    const itemsNodes: ReactNode[] = [];
    const subItems: IMenuItemProps<ItemExtendContext>[] = [];
    item.items.map((it, i) => {
      if (!it) return null;
      it.level = level + 1;
      subItems.push(it as IMenuItemProps<ItemExtendContext>);
      itemsNodes.push(renderMenuItem({ level: level + 1, item: it as IMenuItemProps<ItemExtendContext>, context, index: i, render, renderExpandable }));
    });
    if (itemsNodes.length) {
      return renderExpandableMenuItemOrSection({ level, itemsNodes: itemsNodes, index, item, render, renderExpandable, context })
    }
  }
  return render({ ...item, level, context: { ...Object.assign({}, item.context), ...Object.assign({}, context) } }, index);
}

/***
* Le rôle principal de cette fonction est qu'à partir d'une liste d'item étendant l'interface IMenuItemProps, de générer un composant
* dont les items sont générés en arbre en respectant la hierachie. ce composant est par exemple facilement utilisé, pour générer les items
* du composant Drawer en respectant la hierachie entre les composants
* @param {ItemExtendContext[]} items, la liste des items à render
* @param {function} render, la fonction permettant de render un item
* @param renderExpandable, la fonction permettant de render les items de type expandable
* @param {IDict} context,les options supplémentaires à passer aux fonction de callback pour le rendu des props telles que left, right, et autres
* @return {ReactNode[]};
*/
export function renderMenuItems<ItemExtendContext = any>({ items, render, renderExpandable, context }: { items?: (IMenuItemProps<ItemExtendContext> | null | undefined)[], render: IMenuItemRenderFunc<ItemExtendContext>, renderExpandable: IMenuItemRenderFunc<ItemExtendContext>, level?: number, context?: IDict }): ReactNode[] {
  const _items: ReactNode[] = [];
  const level = 0;
  if (Array.isArray(items)) {
    items.map((item, index) => {
      if (!item) return null;
      const r = renderMenuItem({ item, index, render, renderExpandable, level, context });
      if (r) {
        _items.push(r);
      }
    });
  }
  return _items as ReactNode[];
}


type IMenuItemRenderFuncOptions = { level?: number };

type IMenuItemRenderFunc<IExtendContext = any> = (props: IMenuItemProps<IExtendContext>, level?: number, index?: number, options?: IMenuItemRenderFuncOptions) => ReactNode;