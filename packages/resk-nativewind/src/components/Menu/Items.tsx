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
    {...props}
    className={cn("w-full", props.className)}
    onPress={async (event, context) => {
      if (typeof event?.stopPropagation == "function") {
        event.stopPropagation();
      }
      if (typeof event?.preventDefault == "function") {
        event.preventDefault();
      }
      if (typeof props.onPress == "function" && await props.onPress(event, context) === false) {
        return;
      }
      if (closeOnPress !== false && typeof menu?.close == "function") {
        menu.close();
      }
      return false;
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





