import View, { IViewProps } from "@components/View";
import { StyleSheet, View as RNView } from "react-native";

/**
 * VStack is a component that arranges its children in a vertical stack.
 * This component leverages the flexbox layout model to align children one below the other.
 * 
 * It inherits all properties from the View component, allowing for extensive customization.
 * 
 * @param {IVStackProps} props - The properties for the VStack, including any valid View properties.
 *   - **style**: Optional additional styles to apply to the component.
 *   - **...props**: Any additional props that should be passed to the underlying View.
 * 
 * @returns {JSX.Element} A JSX element representing the VStack, styled as a vertical stack.
 * 
 * @example
 * ```tsx
 * <VStack style={{ padding: 10 }}>
 *     <View style={{ width: 50, height: 50, backgroundColor: "red" }} />
 *     <View style={{ width: 50, height: 50, backgroundColor: "green" }} />
 *     <View style={{ width: 50, height: 50, backgroundColor: "blue" }} />
 * </VStack>
 * ```
 */
function VStack({ style, ...props }: IVStackProps){
    return <View ref={ref} style={[styles.container, style]} {...props} />
};

/**
 * IVStackProps interface defines the properties for the VStack.
 * It extends the IViewProps interface, inheriting all properties from the View component.
 * 
 * @interface IVStackProps
 * @extends IViewProps
 * 
 * @example
 * ```tsx
 * interface CustomVStackProps extends IVStackProps {
 *     additionalProp: string; // Example of extending IVStackProps with a custom property.
 * }
 * ```
 */
export interface IVStackProps extends IViewProps {
    // No additional properties are defined for the VStack, but it can be extended.
}

/**
 * Sets the display name of the VStack to "VStack".
 * This aids in debugging by providing a clear identifier for the component in React DevTools.
 */
VStack.displayName = "VStack";

/**
 * Exports the VStack as the default export of this module.
 * This allows other modules to import and utilize the VStack directly.
 */
export default VStack;


const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    }
})