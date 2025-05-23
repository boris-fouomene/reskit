"use client";
import { cn } from "@utils/cn";
import { cssInterop } from "nativewind";
import { ActivityIndicator as RNPActivityIndicator } from "react-native";
import { IActivityIndicatorProps } from "./types";
import activityIndicatorVariant from "@variants/activityIndicator";

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
export function ActivityIndicator({ className, variant, style, ...props }: IActivityIndicatorProps) {
  return <RNActivityIndicator className={cn(activityIndicatorVariant(variant), className)} testID="resk-activity-indicator" {...props} />;
}

const RNActivityIndicator = cssInterop(RNPActivityIndicator, {
  className: {
    target: false,
    nativeStyleToProp: {
      borderTopColor: "color",
      width: "size",
      height: "size",
    }
  }
})