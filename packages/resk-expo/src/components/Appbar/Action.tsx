import { StyleSheet } from 'react-native'
import { Button, IButtonProps } from "@components/Button";

/**
 * AppBarAction component that renders a button for the AppBar.
 * 
 * This component utilizes the Button component from the UI library
 * and is styled specifically for use within the AppBar. It allows
 * customization through props, including style and button properties.
 *
 * @param {IAppBarActionProps} props - The properties for configuring the AppBarAction.
 * 
 * @returns {JSX.Element} The rendered AppBarAction component.
 *
 * @example
 * // Example usage of the AppBarAction component
 * const MyAppBar = () => {
 *   return (
 *     <AppBar>
 *       <AppBarAction onPress={() => console.log('Action pressed')} label="Action" />
 *     </AppBar>
 *   );
 * };
 */
const AppBarAction = (props: IAppBarActionProps) => {
  return <Button mode={"contained"} borderRadius={0} {...props} style={[styles.buttonAction, props.style]} />
}

/**
 * @interface IAppBarActionProps
 * Interface for the properties of the AppBarAction component.
 * 
 * This interface extends the IButtonProps to include all 
 * properties available for the Button component, allowing 
 * for customization of the AppBarAction button's behavior 
 * and appearance.
 */
export type IAppBarActionProps = Omit<IButtonProps, "children"> & {
  children?: IButtonProps["children"];
}
export default AppBarAction

const styles = StyleSheet.create({
  buttonAction: {
    marginRight: 5,
  },
});