import { IMenuContext, IMenuItemProps, IMenuItemsProps } from './types';
import { useMenu } from './context';
import { defaultStr } from '@resk/core/utils';
import { Nav } from "@components/Nav";
import { JSX } from 'react';
import { cn } from '@utils/cn';


export default function MenuItems<Context = unknown>({ context, testID, ...rest }: IMenuItemsProps<Context>) {
  testID = defaultStr(testID, "resk-menu-item");
  const menuContext = useMenu() as IMenuContext<Context>;
  return <Nav.Items<IMenuContext<Context>>
    testID={testID}
    {...rest}
    renderItem={renderMenuItem}
    renderExpandableItem={renderExpandableMenuItem}
    context={Object.assign({}, context, menuContext)}
  />
};

function MenuItem<Context = unknown>(props: IMenuItemProps<Context>): JSX.Element {
  const { closeOnPress } = props;
  const { menu } = Object.assign({}, props.context);
  return <Nav.Item
    role='menuitem'
    {...props}
    className={cn(props.className)}
    onPress={async (event, context) => {
      const r = typeof props.onPress === "function" ? await props.onPress(event, context) : undefined;
      if (r === false) {
        return false;
      }
      if (closeOnPress !== false && typeof menu?.close == "function") {
        menu.close();
      }
      return r;
    }}
  />;
}
(MenuItem as any).displayName = "Menu.Item";
function renderMenuItem<Context = unknown>(props: IMenuItemProps<Context>, index: number) {
  return <MenuItem {...props} key={index} />;
}


function renderExpandableMenuItem<Context = unknown>(props: IMenuItemProps<Context>, index: number) {
  return <Nav.ExpandableItem<IMenuContext<Context>> as={MenuItem} {...props} key={index} />;
}

MenuItems.displayName = "MenuItems";





