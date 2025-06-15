import { MenuItem } from './Item';
import { useRenderItems } from './hooks';
import { IMenuContext, IMenuItemContext, IMenuItemProps, IMenuItemsProps } from './types';
import ExpandableMenuItem from './ExpandableItem';
import { useMenu } from './context';
import { Div } from '@html/Div';
import { defaultStr } from '@resk/core/utils';


export function MenuItems<ItemContext = unknown>({ items: customItems, context, testID, ...rest }: IMenuItemsProps<ItemContext>) {
  testID = defaultStr(testID, "resk-menu-item");
  const menu = useMenu() as IMenuContext;
  const items = useRenderItems<IMenuItemContext<ItemContext>>({
    items: (Array.isArray(customItems) ? customItems : []),
    context: Object.assign({}, context, { menu }),
    render: renderItem,
    renderExpandable,
  });
  return <Div testID={testID} {...rest}>
    {items}
  </Div>
};

function renderExpandable<ItemContext = unknown>(props: IMenuItemProps<ItemContext>, index: number) {
  return <ExpandableMenuItem {...props} key={index} />;
}
function renderItem<ItemContext = unknown>(props: IMenuItemProps<ItemContext>, index: number) {
  return <MenuItem {...props as any} key={index} />;
}

export default MenuItems;

MenuItems.displayName = "MenuItems";





