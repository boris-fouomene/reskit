import * as React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { useTheme } from '@theme';
import View, { IViewProps } from '@components/View';

/**
 * The `Divider` component renders a horizontal separation line on the page.
 * It can be customized with styles and can be disabled to alter its appearance.
 *
 * @component Divider
 * 
 * @param {IDividerProps} props - The properties passed to the `Divider` component.
 * 
 * @param {boolean} [props.disabled] - If true, applies a disabled style to the divider.
 * 
 * @param {ViewStyle} [props.style] - Additional styles to customize the divider's appearance.
 * 
 * @param {React.Ref} ref - A ref that can be forwarded to the underlying view.
 * 
 * @example
 * Here’s an example of how to use the `Divider` component:
 *
 * ```tsx
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import Divider from './Divider'; // Adjust the import path as necessary
 * 
 * const MyComponent = () => {
 *   return (
 *     <View>
 *       <Divider style={{ height: 2 }} />
 *       <Divider disabled style={{ height: 1 }} />
 *     </View>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 * 
 * @note 
 * The color of the `Divider` is determined by the theme, specifically using 
 * `theme.colors.outline`. Ensure that the theme provider is correctly set up 
 * in your application for the color to be applied.
 */
const Divider = React.forwardRef(({ disabled, style, ...rest }: IDividerProps, ref: React.ForwardedRef<RNView>) => {
  const theme = useTheme();
  return (
    <View
      {...rest}
      ref={ref}
      style={[
        styles.main,
        { backgroundColor: theme.colors.outline },
        style,
        disabled && theme.styles.disabled,
      ]}
    />
  );
});

/**
 * The `IDividerProps` interface defines the properties for the `Divider` component.
 * It extends the standard properties of the React Native `View` component, allowing 
 * for all typical `View` properties to be utilized, while also adding custom 
 * functionality specific to the `Divider`.
 * 
 * @interface IDividerProps
 * 
 * @extends IViewProps
 * 
 * @property {boolean} [disabled] - Optional. If set to true, applies a disabled 
 * style to the divider, altering its appearance to indicate it is not active.
 * 
 * @example
 * Here’s an example of how to use the `IDividerProps` interface:
 * 
 * ```tsx
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import Divider, { IDividerProps } from './Divider'; // Adjust the import path as necessary
 * 
 * const MyComponent = () => {
 *   const dividerProps: IDividerProps = {
 *     disabled: true,
 *     style: { height: 2 },
 *   };
 * 
 *   return (
 *     <View>
 *       <Divider {...dividerProps} />
 *     </View>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 */
export interface IDividerProps extends IViewProps {
  disabled?: boolean; // Optional property to indicate if the divider is disabled
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  inset: {
    marginLeft: 72,
  },
});

Divider.displayName = "DividerComponent";

export { Divider }