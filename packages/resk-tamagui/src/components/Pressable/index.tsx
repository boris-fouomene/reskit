import { View, ViewProps } from "@tamagui/core";
import React from "react";

/**
 * Defines the properties for the `Pressable` component.
 * 
 * This type extends the default properties of a `View` from Tamagui, allowing you to pass 
 * additional props that are compatible with a standard React Native View.
 * 
 * @typedef IPressableProps
 * @extends {ViewProps}
 */
export type IPressableProps = ViewProps & {
    // Add any additional properties specific to Pressable here
};

/**
 * A functional component that renders a pressable view.
 * The `Pressable` component acts as a wrapper around the `View` component from Tamagui,
 * allowing you to apply additional behavior and styling for press interactions.
 *
 * ### Usage
 * The `Pressable` component accepts all props that a standard `View` does, along with a 
 * `testID` for testing purposes. You can pass any additional props to customize the 
 * component's appearance or behavior.
 * 
 * #### Example:
 * 
 * ```tsx
 * import { Pressable } from './Pressable';
 * 
 * const App = () => {
 *   return (
 *     <Pressable
 *       testID="my-pressable"
 *       style={{ padding: 10, backgroundColor: 'blue' }}
 *       onPress={() => console.log('Pressed!')}
 *     >
 *       <Text style={{ color: 'white' }}>Press Me</Text>
 *     </Pressable>
 *   );
 * };
 * ```
 * 
 * @param props - The properties passed to the `Pressable` component.
 * @param ref - The forwarded ref to the underlying `View` component.
 * @returns A `View` component that serves as a pressable area.
 */
export const Pressable: React.FC<IPressableProps> = React.forwardRef(({ testID, ...props }: IPressableProps, ref: React.Ref<any>) => {
    return <View testID={testID || "RN_Pressable"} {...props} ref={ref} />;
});

// Assign a display name for easier debugging and React DevTools integration.
Pressable.displayName = "Pressable";
