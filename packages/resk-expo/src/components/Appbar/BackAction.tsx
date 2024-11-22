import { IconButton, IIconButtonProps, FontIcon } from "@components/Icon";
import { forwardRef } from 'react';
import React from "react";
import { View } from "react-native";
import { IBackActionProps } from "./types";

/**
 * A BackAction component that renders a back navigation button using the 
 * IconButton component. This component is designed to provide a consistent 
 * back navigation action in an application, typically used in app bars or 
 * navigation headers.
 *
 * @component BackAction
 * @param {IBackActionProps} props - The properties for configuring the BackAction.
 * @param {React.Ref<View>} ref - A ref for accessing the underlying IconButton component.
 *
 * @returns {JSX.Element} The rendered BackAction component.
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
export const BackAction = forwardRef<View, IBackActionProps>(({ accessibilityLabel = 'Appbar.BackAction', ...rest }: IBackActionProps, ref: React.Ref<View>) => {
  return <IconButton
    accessibilityLabel={accessibilityLabel}
    iconName={FontIcon.BACK}
    {...rest}
    ref={ref}
  />;
});

BackAction.displayName = 'AppBar.BackAction';

