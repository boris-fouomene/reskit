import { IconButton, IIconButtonProps, FontIcon } from "@components/Icon";
import { forwardRef } from 'react';
import React from "react";
import { View } from "react-native";

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
export const BackAction = forwardRef(
  ({ accessibilityLabel = 'Back', ...rest }: IBackActionProps, ref: React.Ref<View>) => {
    return (
      <IconButton
        accessibilityLabel={accessibilityLabel}
        iconName={FontIcon.BACK}
        {...rest}
        ref={ref}
      />
    );
  }
);

BackAction.displayName = 'AppBar.BackAction';

/**
 * Interface representing the properties for the BackAction component.
 * This interface extends the IIconButtonProps interface to inherit all 
 * the properties of the IconButton, allowing for additional customization.
 *
 * @interface IBackActionProps
 * @extends IIconButtonProps
 */
export interface IBackActionProps extends IIconButtonProps { }