import FontIcon from "@components/Icon/Font";
import IconButton from "@components/Icon/Button";
import { IBackActionProps } from "./types";
import { useAppBar } from "./hooks";

/**
 * A BackAction component that renders a back navigation button using the 
 * IconButton component. This component is designed to provide a consistent 
 * back navigation action in an application, typically used in app bars or 
 * navigation headers.
 *
 * @component BackAction
 * @param {IBackActionProps} props - The properties for configuring the BackAction.
 *
 * @returns {ReactElement} The rendered BackAction component.
 *
 * @example
 * // Example usage of the BackAction component
 * const App = () => {
 *   return (
 *     <View>
 *       <BackAction onPress={() => console.log('Back pressed')} />
 *     </View>
 *   );
 * };
 */
export function BackAction({ accessibilityLabel = 'Appbar.BackAction', ...rest }: IBackActionProps) {
  const appBarContext = useAppBar();
  return <IconButton
    accessibilityLabel={accessibilityLabel}
    iconName={FontIcon.BACK}
    color={appBarContext.textColor}
    backgroundColor={appBarContext.backgroundColor}
    size={30}
    {...rest}
  />;
};

BackAction.displayName = 'AppBarBackAction';

