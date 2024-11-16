import { IActivityIndicatorProps } from "@components/ActivityIndicator";
import { IIconProps, IIconSource } from "@components/Icon";
import { ISurfaceProps } from "@components/Surface";
import { ITooltipBaseProps } from "@components/Tooltip";
import { ITouchableRippleProps } from "@components/TouchableRipple";
import { IThemeColorTokenKey } from "@theme/types";
import { IStyle } from "../../types";
import React, { ReactNode, RefObject } from "react";
import { AccessibilityRole, View } from "react-native";
import { ILabelProps } from "@components/Label";
import { IViewProps } from "@components/View";


/**
 * Represents the properties for a base button component.
 * This type extends the properties of TouchableRipple and includes additional
 * customization options for styling, behavior, and accessibility.
 * 
 * @extends ITouchableRippleProps
 * @extends ITooltipBaseProps
 * 
 * @example
 * // Example usage of IButtonBaseProps in a button component
 * const MyButton: React.FC<IButtonBaseProps> = (props) => {
 *     return (
 *         <Button
 *             {...props}
 *             onPress={() => console.log("Button pressed!")}
 *         >
 *             {props.label || props.children}
 *         </Button>
 *     );
 * };
 */
export type IButtonBaseProps = Omit<ITouchableRippleProps, "style" | "children"> & Omit<ITooltipBaseProps, 'disabled'> & {
    /**
     * Optional style for the button component.
     * Can be used to customize the appearance of the button.
     * 
     * @example
     * const buttonStyle: IStyle = { backgroundColor: 'blue', borderRadius: 5 };
     */
    style?: IStyle;

    /**
     * Label text of the button, displayed as the button's content.
     * This is the primary text that users will see and interact with.
     * 
     * @example
     * <Button children="Submit" />
     */
    children: React.ReactNode;


    /**
     * Alias for children, representing the button's label.
     * This can be used interchangeably with the children prop.
     * 
     * @example
     * <Button label="Submit" />
     */
    label?: ReactNode;

    /**
     * Props for the button label.
     * This allows customization of the label's appearance.
     * 
     * @example
     * <Button labelProps={{ style: { fontWeight: 'bold' } }} label="Submit" />
     */
    labelProps?: ILabelProps;

    /**
     * Disables the ripple effect on button press.
     * If set to true, the ripple effect will not be shown when the button is pressed.
     * 
     * @example
     * <Button disableRipple={true} />
     */
    disableRipple?: boolean;

    /**
     * Position of the icon relative to the button label.
     * Can be either 'left' or 'right'.
     * 
     * @example
     * <Button iconPosition="left" icon={<Icon />} label="Submit" />
     */
    iconPosition?: "left" | "right";

    /**
     * Indicates whether the button is in a loading state.
     * When true, the button will be disabled and show a loading indicator.
     * 
     * @example
     * <Button isLoading={true} />
     */
    isLoading?: boolean;

    /**
     * Properties for the loading indicator shown when isLoading is true.
     * This can include size, color, and other customization options.
     * 
     * @example
     * <Button isLoading={true} loadingProps={{ size: 'small', color: 'white' }} />
     */
    loadingProps?: IActivityIndicatorProps;

    /**
     * @see {@link IThemeColorTokenKey} for the available colorsSheme
     * Color scheme token key to apply a theme color to the button.
     * This allows for easy theming and consistency across the application.
     * 
     * @example
     * <Button colorScheme="primary" />
     */
    colorScheme?: IThemeColorTokenKey;

    /**
     * Props for the content of the button.
     * This can include styles and other properties for the view.
     */
    contentProps?: IViewProps;


    /**
     * @see {@link IButtonMode} for the available button modes.
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
         * - `text` - flat button without background or outline, used for the lowest priority actions, especially when presenting multiple options.
         * - `outlined` - button with an outline without background, typically used for important, but not primary action – represents medium emphasis.
         * - `contained` - button with a background color, used for important action, have the most visual impact and high emphasis.  
     * @example
     * <Button mode="contained" label="Click Me" />
     */
    mode?: IButtonMode;

    /**
     * Indicates if the button's color is dark.
     * This affects the text color based on the button mode and theme version.
     * 
     * @example
     * <Button mode="contained" dark={true} />
     */
    dark?: boolean /**
     * Use a compact look for the button, useful for displaying multiple text buttons in a row.
     * This reduces the padding and margin around the button.
     * 
     * @example
     * <Button compact={true} label="Option 1" />
     */
    compact?: boolean;


    /**
     * Custom background color for the button.
     * This overrides the default background color. It allows for specific branding or design requirements.
     * @example
     * <Button backgroundColor="#ff5733" />
     */
    backgroundColor?: string;

    /**
     * Custom text color for the button label.
     * This can be used to ensure contrast against the button's background.
     * 
     * @example
     * <Button textColor="#ffffff" label="White Text" />
     */
    textColor?: string;

    /**
     * Color of the ripple effect when the button is pressed.
     * This can enhance the visual feedback of the button interaction.
     * 
     * @example
     * <Button rippleColor="#0000ff" label="Ripple Effect" />
     */
    rippleColor?: string;

    /**
     * Indicates whether to show a loading indicator on the button.
     * When true, a loading spinner will be displayed instead of the button label.
     * 
     * @example
     * <Button loading={true} />
     */
    loading?: boolean;

    /**
     * Icon to display alongside the button label.
     * This can enhance the button's visual appeal and convey meaning.
     * 
     * @example
     * <Button icon={<Icon name="check" />} label="Confirm" />
     */
    icon?: IIconSource;

    /**
     * Props for the icon displayed on the button.
     * If the icon is a string, these props will be used to render a FontIcon.
     * 
     * @example
     * <Button icon="check" iconProps={{ size: 20, color: 'white' }} label="Confirm" />
     */
    iconProps?: IIconProps;

    /**
     * Indicates whether the button is disabled.
     * A disabled button will not respond to user interactions and will appear greyed out.
     * 
     * @example
     * <Button disabled={true} label="Disabled" />
     */
    disabled?: boolean;

    /**
     * If true, the label text will be uppercased.
     * Note that this won't work if you pass React elements as children.
     * 
     * @example
     * <Button uppercase={true} label="Uppercase" />
     */
    uppercase?: boolean;

    /**
     * Accessibility label for the button.
     * This label is read by screen readers when the user taps the button, improving accessibility.
     * 
     * @example
     * <Button accessibilityLabel="Submit form" label="Submit" />
     */
    accessibilityLabel?: string;

    /**
     * Accessibility hint for the button.
     * This provides additional context to screen reader users about the button's action.
     * 
     * @example
     * <Button accessibilityHint="Submits the form" label="Submit" />
     */
    accessibilityHint?: string;

    /**
     * Accessibility role for the button.
     * The default role is set to "button", but this can be customized if needed.
     * 
     * @example
     * <Button accessibilityRole="button" label="Submit" />
     */
    accessibilityRole?: AccessibilityRole;

    /**
     * Reference for the container that wraps the button.
     * This can be useful for accessing the button's DOM node or for animations.
     * 
     * @example
     * const buttonRef = useRef<View>(null);
     * <Button containerRef={buttonRef} label="Ref Example" />
     */
    containerRef?: React.RefObject<View>;

    /**
     * Additional properties for the surface that contains the button.
     * This allows for further customization of the button's container.
     * 
     * @example
     * <Button containerProps={{ style: { padding: 10 } }} label="Container Props" />
     */
    containerProps?: ISurfaceProps;

    /**
     * The border radius of the button.
     * This property can be used to control the rounded corners of the button.
     */
    borderRadius?: number;
}

/**
 * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline, used for the lowest priority actions, especially when presenting multiple options.
     * - `outlined` - button with an outline without background, typically used for important, but not primary action – represents medium emphasis.
     * - `contained` - button with a background color, used for important action, have the most visual impact and high emphasis.  
 */
export type IButtonMode = | 'text' | 'outlined' | 'contained';


/**
 * @interface IButtonProps
 * @extends IButtonBaseProps
 * Represents the properties for a button component, extending the base button properties
 * while allowing for additional custom properties through a generic type parameter.
 * 
 * This type is useful for creating button components that require specific props
 * beyond the standard button functionalities defined in `IButtonBaseProps`.
 * 
 * @template T - A generic type that allows the inclusion of additional properties
 *               specific to the button implementation. This can be any type, 
 *               and the button will inherit properties from it.
 * 
 * 
 *@property {function(IButtonRef): Partial<T>} [extendRef] - An optional function that allows the button to extend its reference context.
 *               This function receives the button's reference object and can return a partial set of additional properties
 *               that can be merged with the existing props of type T.
 * 
 * @example
 * // Example usage of IButtonProps with additional custom properties
 * interface MyCustomButtonProps {
 *     customProp: string; // An example of a custom property
 * }
 * 
 * const MyButton: React.FC<IButtonProps<MyCustomButtonProps>> = (props) => {
 *     return (
 *         <Button
 *             {...props}
 *             onPress={() => console.log("Custom Button pressed with customProp:", props.customProp)}
 *         >
 *             {props.label || props.children}
 *         </Button>
 *     );
 * };
 * 
 * // Usage of MyButton with custom properties
 * <MyButton customProp="Example Value" label="Click Me" />
 */
export type IButtonProps<T extends object = any> = Omit<T, keyof IButtonBaseProps> & IButtonBaseProps & {
    extendRef?: (context: IButtonRef) => Partial<T>;
};

/**
 * Represents a reference object for the Button component.
 * This reference provides methods to control the button's state and behavior programmatically.
 * 
 * @typedef IButtonRef
 * 
 * @property {function(): void} enable - Enables the button, allowing it to respond to user interactions.
 * 
 * @property {function(): void} disable - Disables the button, preventing it from responding to user interactions.
 * 
 * @property {function(): boolean} isEnabled - Returns a boolean indicating whether the button is currently enabled.
 * 
 * @property {function(): string} getId - Retrieves the unique identifier of the button. This can be useful for tracking or logging purposes.
 * 
 * @property {function(boolean): void} setIsLoading - Sets the loading state of the button. When loading is true, the button will show a loading indicator.
 * 
 * @property {React.RefObject<View>} ref - A reference to the underlying View component that wraps the button. This can be used for direct manipulation or animations.
 * 
 * @example
 * // Example usage of IButtonRef in a functional component
 * const MyComponent: React.FC = () => {
 *     const buttonRef = useRef<IButtonRef>(null);
 *     
 *     const handleEnable = () => {
 *         buttonRef.current?.enable();
 *     };
 *     
 *     const handleDisable = () => {
 *         buttonRef.current?.disable();
 *     };
 *     
 *     const handleLoading = () => {
 *         buttonRef.current?.setIsLoading(true);
 *         // Simulate loading process
 *         setTimeout(() => {
 *             buttonRef.current?.setIsLoading(false);
 *         }, 2000);
 *     };
 *     
 *     return (
 *         <View>
 *             <Button ref={buttonRef} label="Submit" />
 *             <Button onPress={handleEnable} label="Enable Button" />
 *             <Button onPress={handleDisable} label="Disable Button" />
 *             <Button onPress={handleLoading} label="Load" />
 *         </View>
 *     );
 * };
 */
export type IButtonRef<T extends object = any> = Readonly<{
    /*
        Enables the button, allowing it to respond to user interactions.
    */
    enable: () => void;
    /**
     * disable the button, preventing it from responding to user interactions.
     */
    disable: () => void;
    /***
     * Returns a boolean indicating whether the button is currently enabled.
     */
    isEnabled: () => boolean;
    /**
     * 
     * @returns the unique identifier of the button. This can be useful for tracking or logging purposes.
     */
    getId: () => string;
    /**
     * Sets the loading state of the button. When loading is true, the button will show a loading indicator.
     * @param isLoading {boolean} - Sets the loading state of the button. When loading is true, the button will show a loading indicator.
     * @returns 
     */
    setIsLoading: (isLoading: boolean) => void;

    /**
     * A reference to the underlying View component that wraps the button. This can be used for direct manipulation or animations.
     */
    ref: View | null;
} & T>;