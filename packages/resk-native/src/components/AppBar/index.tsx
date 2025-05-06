import { AppBarContext, useAppBar } from './hooks';
import {
  View,
  StyleSheet,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import Label from '@components/Label';
import { Surface } from '@components/Surface';
import { Colors, IThemeColorsTokenName, useTheme } from '@theme/index';
import { IAppBarProps } from './types';
import { getLabelOrLeftOrRightProps } from '@hooks/label2left2right';
import { useDimensions } from '@dimensions/index';
import { splitAppBarActions } from './utils';
import Action from './Action';
import isValidElement from '@utils/isValidElement';
import { Menu } from '@components/Menu';
import FontIcon from '@components/Icon/Font';
import IconButton from '@components/Icon/Button';
import ExpandableAppBarAction from './ExpandableAction';
import AppBarAction from './Action';
import { BackAction } from "./BackAction";


/**
 * AppBar component that serves as a top navigation bar for the application.
 * 
 * This component provides a customizable AppBar that can display a title,
 * subtitle, actions, and handle back navigation. It is designed to provide 
 * a consistent user interface across the application and adapts to various 
 * screen sizes and themes.
 * 
 * @template AppBarActionContext - A generic type parameter that allows 
 * extending the context for AppBar actions. This enables customization of 
 * the properties passed to action items within the AppBar.
 * 
 * @param {IAppBarProps<AppBarActionContext>} props - The properties for 
 * configuring the AppBar, including title, subtitle, actions, and styles.
 * 
 * underlying View component, allowing parent components to access it.
 * 
 * @returns {JSX.Element} The rendered AppBar component, which includes 
 * title, subtitle, actions, and other customizable elements.
 * 
 * @example
 * // Example usage of the AppBar component
 * const MyScreen = () => {
 *   return (
 *     <AppBar
 *       title="My Application"
 *       subtitle="Welcome to the app"
 *       onBackActionPress={() => console.log('Back pressed')}
 *       actions={[
 *         { label: 'Settings', onPress: () => console.log('Settings pressed') },
 *         { label: 'Profile', onPress: () => console.log('Profile pressed') },
 *       ]}
 *     />
 *   );
 * };
 * 
 * @remarks
 * The AppBar component automatically handles responsiveness and adapts 
 * to different screen sizes. It also integrates with the application's 
 * theme, allowing for consistent styling across the app. The AppBar can 
 * include custom actions and can be extended with additional props as needed.
 */
function AppBar<AppBarActionContext = any>({
  bindResizeEvent, textColor: color, backgroundColor, context, colorScheme: customColorScheme,
  renderAction, renderExpandableAction, maxActions,
  actions: customActions, title, subtitle, titleProps, subtitleProps, windowWidth, onBackActionPress, testID,
  backAction: customBackAction,
  backActionProps,
  children, style, elevation = 4, statusBarHeight,
  left: customLeft,
  right: customRight,
  contentProps,
  ...appBarProps
}: IAppBarProps<AppBarActionContext>) {
  useDimensions(bindResizeEvent !== false); //pour le rendu responsive de l'AppBar
  const theme = useTheme();
  contentProps = Object.assign({}, contentProps);
  testID = testID || 'resk-appbar';
  const colorScheme = theme.getColorScheme(customColorScheme as IThemeColorsTokenName);
  const flattenStyle = (StyleSheet.flatten(style) || {});
  backgroundColor = (Colors.isValid(backgroundColor) ? backgroundColor : theme.getColor(backgroundColor) || colorScheme.backgroundColor || flattenStyle?.backgroundColor) as string;
  color = (Colors.isValid(color) ? color : theme.getColor(color) || colorScheme.color || theme.colors.text) as string;
  const titleTextColor = Colors.isValid(color) ? color : undefined;
  titleProps = Object.assign({}, titleProps);
  subtitleProps = Object.assign({}, subtitleProps);
  subtitle = subtitle === false ? null : subtitle;
  const subtitleColor = titleTextColor ? Colors.setAlpha(titleTextColor, 0.7) : undefined;
  backActionProps = Object.assign({}, { color, backgroundColor }, backActionProps);
  const { onPress } = backActionProps;
  backActionProps.onPress = (e: GestureResponderEvent) => {
    if (onPress) onPress(e);
    if (onBackActionPress) onBackActionPress(e);
  }
  const backAction = typeof customBackAction == "function" ? customBackAction(backActionProps) : customBackAction;
  const appBarContext = Object.assign({}, context, { backgroundColor, isAppBar: true, textColor: color });
  const { actions, menuItems } = splitAppBarActions<AppBarActionContext>({
    ...appBarProps,
    textColor: color,
    backgroundColor,
    actions: customActions,
    isAppBarAction: true,
    maxActions,
    windowWidth,
    context: appBarContext,
    renderAction: function (props, index) {
      if (typeof renderAction === 'function') return renderAction(props, index);
      return <Action {...props} key={index} />;
    },
    renderExpandableAction: function (props, index) {
      if (typeof renderExpandableAction === 'function') return renderExpandableAction(props, index);
      return <ExpandableAppBarAction
        {...props}
        key={index}
      />;
    }
  });
  const containerStyle = {
    paddingTop: typeof statusBarHeight === "number" ? statusBarHeight : 0,
    paddingHorizontal: 7,
  }
  const { left: leftContent, right: rightContent } = getLabelOrLeftOrRightProps({ left: customLeft, right: customRight }, { color, backgroundColor, context })
  return (
    <AppBarContext.Provider value={appBarContext}>
      <Surface
        {...appBarProps}
        testID={testID}
        elevation={typeof elevation == "number" ? elevation : 0}
        style={[
          styles.appbar,
          {
            backgroundColor,
          },
          containerStyle as any,
          style,
        ]}
      >
        {backAction != false ? isValidElement(backAction) ? backAction : <BackAction testID={`${testID}-back-action`} color={color} {...backActionProps} /> : null}
        {isValidElement(leftContent) ? leftContent : null}
        <View testID={`${testID}-content`} {...contentProps} style={[styles.content, contentProps?.style]}>
          <Label
            numberOfLines={1}
            splitText
            testID={`${testID}-title`}
            {...titleProps}
            style={[styles.title, { color },
            titleTextColor ? {
              color: titleTextColor,
            } : undefined,
            titleProps.style
            ]}
          >
            {title}
          </Label>
          {subtitle ? (
            <Label
              numberOfLines={1}
              splitText
              testID={`${testID}-subtitle`}
              {...subtitleProps}
              style={[styles.subtitle, subtitleColor && { color: subtitleColor } || undefined, subtitleProps?.style]}
            >
              {subtitle}
            </Label>
          ) : null}
        </View>
        {isValidElement(children) ? children : null}
        {actions}
        {menuItems.length ? <Menu
          preferedPositionAxis='vertical'
          testID={`${testID}-menu`}
          anchor={({ closeMenu, openMenu }) => {
            return <IconButton
              size={28}
              iconName={FontIcon.MORE}
              color={color}
              style={styles.menuContainer}
              containerProps={{
                style: styles.menuAnchorContainer
              }}
              onPress={() => {
                openMenu();
              }}
            />
          }}
          items={menuItems}
        /> : null}
        {isValidElement(rightContent) ? rightContent : null}
      </Surface>
    </AppBarContext.Provider>
  );
};

const DEFAULT_APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  appbar: {
    height: DEFAULT_APPBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
  },
  action: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backAction: {
    marginLeft: 4,
  },
  menuContainer: {
  },
  menuAnchorContainer: {
    marginHorizontal: 7
  }
});

AppBar.displayName = 'AppBar';



AppBar.displayName = 'AppBar';
AppBar.Action = AppBarAction;
AppBar.Action.displayName = 'AppBar.Action';
AppBar.BackAction = BackAction;
AppBar.BackAction.displayName = 'AppBar.BackAction';
AppBar.ExpandableAction = ExpandableAppBarAction;

export { AppBar };

export * from "./types";
export * from "./utils";
export { useAppBar };
