import { StyleSheet } from 'react-native'
import { Button} from "@components/Button";
import { useAppBar } from './hooks';
import { IAppBarAction } from './types';
import { useTheme } from '@theme/index';


/**
 * AppBarAction component that renders a button specifically designed for use within an AppBar.
 * 
 * This component leverages the Button component from the UI library and is styled to fit seamlessly 
 * into the AppBar layout. It allows for customization through various props, enabling developers 
 * to tailor the button's appearance and behavior according to their application's needs.
 * 
 * @param {IAppBarAction<IAppBarActionContext>} props - The properties for configuring the AppBarAction.
 * accessing the underlying Button component. This allows parent components to interact with the 
 * button, such as focusing or measuring its dimensions.
 * 
 * @returns {JSX.Element} The rendered AppBarAction component, which is a button styled for the AppBar.
 * 
 * @example
 * // Example usage of the AppBarAction component within an AppBar
 * const MyAppBar = () => {
 *   return (
 *     <AppBar>
 *       <AppBarAction 
 *         onPress={() => console.log('Action pressed')} 
 *         label="Action" 
 *         style={{ marginRight: 10 }} 
 *       />
 *     </AppBar>
 *   );
 * };
 * 
 * @remarks
 * The AppBarAction component automatically inherits the text color and background color from 
 * the AppBar context, ensuring consistent styling across the application. It is designed to 
 * work well with the AppBar's layout and can be easily integrated with other AppBar components.
 */
function AppBarAction<IAppBarActionContext = any>({ colorScheme, containerProps, ...props }: IAppBarAction<IAppBarActionContext>) {
  const appBarContext = useAppBar();
  const colorSchemeColor = useTheme().getColorScheme(colorScheme);
  containerProps = Object.assign({}, containerProps);
  return <Button
    textColor={colorSchemeColor.color || appBarContext.textColor || props.context?.textColor}
    borderRadius={props.level ? 0 : undefined}
    backgroundColor={colorSchemeColor.backgroundColor || appBarContext.backgroundColor || props.context?.backgroundColor}
    containerProps={{
      ...containerProps,
      style: [containerProps?.style, styles.buttonContainer]
    }}
    {...props}
  />
};
AppBarAction.displayName = 'AppBarAction';

export default AppBarAction

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 7,
    paddingVertical: 0,
    width: undefined,
  },
});
