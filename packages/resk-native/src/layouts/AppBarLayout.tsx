import { AppBar, IAppBarProps } from "@components/AppBar";
import { DrawerMenuIcon } from "./DrawerMenuIcon";

/**
 * A functional component that renders an AppBar with a customizable layout.
 * 
 * The `AppBarLayout` component serves as a wrapper around the `AppBar` 
 * component, allowing for additional customization and integration of 
 * specific back action elements. This component is particularly useful 
 * in applications where a consistent AppBar layout is required across 
 * different screens or contexts.
 * 
 * ### Props
 * 
 * The component accepts all properties defined in the `IAppBarProps` 
 * interface, which includes various options for customizing the AppBar's 
 * appearance and behavior. The props are spread onto the `AppBar` 
 * component, allowing for flexible usage.
 * 
 * - `appBarProps` (IAppBarProps): The properties to customize the 
 *   AppBar, including title, subtitle, actions, and back action 
 *   properties.
 * 
 * ### Back Action
 * 
 * The `backAction` prop is specifically customized to include a 
 * `DrawerMenuIcon` component. This icon represents a temporary drawer 
 * menu, which can be used to toggle the visibility of a side menu or 
 * navigation drawer.
 * 
 * - `drawerMode` (string): A prop passed to `DrawerMenuIcon` that determine when to render the button 
 * and allows for dynamic icons based on the drawer's state.
 *   specifies the mode of the drawer. In this case, it is set to 
 *   `"temporary"`, indicating that the button is rendered only when the drawer is in temporary mode.
 * 
 * ### Example Usage
 * 
 * Here is an example of how you might use the `AppBarLayout` component 
 * within a screen component:
 * 
 * ```typescript
 * import * as React from 'react';
 * import { AppBarLayout } from './AppBarLayout';
 * 
 * const MyScreen = () => {
 *     return (
 *         <AppBarLayout
 *             title="My Application"
 *             subtitle="Welcome to the app"
 *             onBackActionPress={() => console.log('Back pressed')}
 *             actions={[
 *                 { label: 'Settings', onPress: () => console.log('Settings pressed') },
 *                 { label: 'Profile', onPress: () => console.log('Profile pressed') },
 *             ]}
 *         />
 *     );
 * };
 * ```
 * 
 * In this example, the `AppBarLayout` component is used to create an 
 * AppBar with a title, subtitle, and action buttons. The back action 
 * is handled by the `DrawerMenuIcon`, which allows users to navigate 
 * to open a drawer menu when the back action is triggered and the drawer is in temporary mode.
 * 
 * ### Return Value
 * 
 * The component returns a JSX element representing the configured 
 * AppBar, which includes the specified title, subtitle, actions, and 
 * back action.
 * 
 * @returns {JSX.Element} The rendered AppBar component with the 
 * customized layout.
 */
export default function AppBarLayout({ ...appBarProps }: IAppBarProps) {
  const { iconName, ...backActionLayoutProps } = Object.assign({}, appBarProps?.backActionProps);
  return (
    <AppBar
      backAction={
        <DrawerMenuIcon
          drawerMode="temporary"
          {...backActionLayoutProps}
        />
      }
      {...appBarProps}
    />
  );
}