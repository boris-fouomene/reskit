import View, { IViewProps } from "@components/View";
import React, { forwardRef } from "react";
import { StyleSheet, View as RNView } from "react-native";


/**
 * HStack is a component that arranges its children in a horizontal stack.
 * This component leverages the flexbox layout model to align children side by side.
 * 
 * It inherits all properties from the View component, allowing for extensive customization.
 * 
 * @param {IViewProps} props - The properties for the HStack, including any valid View properties.
 *   - **style**: Optional additional styles to apply to the component.
 *   - **...props**: Any additional props that should be passed to the underlying View.
 * 
 * @param {React.ForwardedRef<RNView>} ref - A forwarded reference to the underlying RNView component.
 * 
 * @returns {JSX.Element} A JSX element representing the HStack, styled as a horizontal stack.
 * 
 * @example
 * ```tsx
 * <HStack style={{ padding: 10 }}>
 *     <View style={{ width: 50, height: 50, backgroundColor: "red" }} />
 *     <View style={{ width: 50, height: 50, backgroundColor: "green" }} />
 *     <View style={{ width: 50, height: 50, backgroundColor: "blue" }} />
 * </HStack>
 * ```
 */
const HStack = forwardRef(({ style, ...props }: IViewProps, ref: React.ForwardedRef<RNView>) => {
    return <View ref={ref} style={[styles.container, style]} {...props} />
});

/**
 * IHStackProps interface defines the properties for the HStack.
 * It extends the IViewProps interface, inheriting all properties from the View component.
 * 
 * @interface IHStackProps
 * @extends IViewProps
 * 
 * @example
 * ```tsx
 * interface CustomHStackProps extends IHStackProps {
 *     additionalProp: string; // Example of extending IHStackProps with a custom property.
 * }
 * ```
 */
export interface IHStackProps extends IViewProps {
    // No additional properties are defined for the HStack, but it can be extended.
}

/**
 * Sets the display name of the HStack to "HStack".
 * This aids in debugging by providing a clear identifier for the component in React DevTools.
 */
HStack.displayName = "HStack";

/**
 * Exports the HStack as the default export of this module.
 * This allows other modules to import and utilize the HStack directly.
 */
export default HStack;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: 5,
        alignItems: "center",
        justifyContent: "flex-start",
    }
})