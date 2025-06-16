import { MenuItem } from './Item';
import { useRenderMenuItems } from './hooks';
import { IMenuContext, IMenuItemProps, IMenuItemsProps } from './types';
import ExpandableMenuItem from './ExpandableItem';
import { useMenu } from './context';
import { Div } from '@html/Div';
import { defaultStr } from '@resk/core/utils';


export function MenuItems<Context = unknown>({ items: customItems, context, testID, ...rest }: IMenuItemsProps<Context>) {
  testID = defaultStr(testID, "resk-menu-item");
  const menuContext = useMenu() as IMenuContext<Context>;
  const items = useRenderMenuItems<IMenuContext<Context>>({
    items: (Array.isArray(customItems) ? customItems : []),
    context: Object.assign({}, context, menuContext),
    render: renderItem,
    renderExpandable,
  });
  return <Div testID={testID} {...rest}>
    {items}
  </Div>
};

function renderExpandable<Context = unknown>(props: IMenuItemProps<Context>, index: number) {
  return <ExpandableMenuItem {...props} key={index} />;
}
function renderItem<Context = unknown>(props: IMenuItemProps<Context>, index: number) {
  return <MenuItem {...props as any} key={index} />;
}

export default MenuItems;

MenuItems.displayName = "MenuItems";





