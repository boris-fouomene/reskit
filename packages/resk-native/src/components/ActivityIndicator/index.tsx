import { ActivityIndicator as RNPActivityIndicator, ActivityIndicatorProps } from "react-native";
import { useTheme } from "@theme";

/**
 * A custom `ActivityIndicator` component that wraps the standard 
 * `ActivityIndicator` from React Native. This component integrates 
 * with the application's theme to provide a consistent loading indicator 
 * appearance based on the current theme colors.
 * 
 * @component ActivityIndicator
 * 
 * @param {IActivityIndicatorProps} props - The properties passed to the 
 * `ActivityIndicator` component. This includes all standard 
 * `ActivityIndicatorProps` from React Native, allowing for customization 
 * of the loading indicator's behavior and appearance.
 * 
 * @example
 * Here’s an example of how to use the custom `ActivityIndicator`:
 * 
 * ```tsx
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import ActivityIndicator from './ActivityIndicator'; // Adjust the import path as necessary
 * 
 * const MyComponent = () => {
 *   return (
 *     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
 *       <ActivityIndicator size="large" />
 *     </View>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 * 
 * @note 
 * The `color` of the `ActivityIndicator` is determined by the 
 * application's theme, specifically using `theme.colors.primary`. 
 * Ensure that the theme provider is correctly set up in your application 
 * for the color to be applied.
 */
export function ActivityIndicator(props: IActivityIndicatorProps) {
  const theme = useTheme();
  return <RNPActivityIndicator testID="resk-activity-indicator" color={theme.colors.primary} {...props} />;
}

/**
 * Interface that extends the standard `ActivityIndicatorProps` from 
 * React Native to provide additional type safety and clarity for 
 * the custom `ActivityIndicator` component.
 * 
 * This interface allows developers to use all the properties of 
 * the original `ActivityIndicator` while maintaining the flexibility 
 * to add custom props in the future if needed.
 * 
 * @extends ActivityIndicatorProps
 * 
 * @example
 * Here’s an example of how to use the `IActivityIndicatorProps`:
 * 
 * ```tsx
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import ActivityIndicator, { IActivityIndicatorProps } from './ActivityIndicator'; // Adjust the import path as necessary
 * 
 * const MyComponent = () => {
 *   const indicatorProps: IActivityIndicatorProps = {
 *     size: 'large',
 *     color: 'blue',
 *     animating: true,
 *   };
 * 
 *   return (
 *     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
 *       <ActivityIndicator {...indicatorProps} />
 *     </View>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 */
export interface IActivityIndicatorProps extends ActivityIndicatorProps { }