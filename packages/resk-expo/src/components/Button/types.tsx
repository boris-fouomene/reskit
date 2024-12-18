import { IActivityIndicatorProps } from "@components/ActivityIndicator";
import { IIconProps, IIconSource } from "@components/Icon";
import { ISurfaceProps } from "@components/Surface";
import { ITooltipBaseProps } from "@components/Tooltip";
import { ITouchableRippleProps } from "@components/TouchableRipple";
import { IThemeColorTokenKey } from "@theme/types";
import { IStyle } from "../../types";
import React from "react";
import { AccessibilityRole, GestureResponderEvent, View } from "react-native";
import { ILabelProps } from "@components/Label";
import { IViewProps } from "@components/View";
import { ILabelOrLeftOrRightProps } from "@hooks/index";
import { IDividerProps } from "@components/Divider";
import { IResourceName, IAuthPerm } from "@resk/core";


/**
 * @interface IButtonMode
 * Represents the mode of a button, which affects its visual style and emphasis.
 * You can change the mode to adjust the button's appearance, making it suitable 
 * for various contexts and importance levels of actions.
 * 
 * - `text`: A flat button without background or outline, ideal for low-priority actions,
 *   particularly when presenting multiple options. It blends well with the UI, making it less 
 *   visually intrusive.
 * 
 * - `outlined`: A button with an outline but no background, typically used for significant 
 *   actions that are not primary. This mode provides a medium level of emphasis and 
 *   distinguishes the button without overwhelming the design.
 * 
 * - `contained`: A button with a solid background color, used for crucial actions that 
 *   require the most visual impact. This mode signifies high emphasis and is often used 
 *   for primary actions that need immediate attention.
 * 
 * @example
 * // Example of using IButtonMode
 * const buttonMode: IButtonMode = 'contained'; // This will create a button with high emphasis
 */
export type IButtonMode = | 'text' | 'outlined' | 'contained';




/**
 * @typedef IButtonProps
 * 
 * Represents the properties for a button component
 * This type extends the properties of TouchableRipple and includes additional
 * customization options for styling, behavior, and accessibility.
 * while allowing for additional custom properties through a generic type parameter.
 * 
 * This type is particularly useful for creating button components that require specific 
 * props beyond the standard button functionalities
 * 
 * @template IButtonExtendContext - A generic type that allows the inclusion of additional context properties
 *               specific to the button's context implementation. This can be any object type, 
 *               allowing for extensibility of the button's functionality.
 * 
 * @property {function(IButtonContext): IButtonExtendContext} [context] - An optional function that allows 
 *               the button to extend its reference context. This function receives the button's context object
 *               and can return a partial set of additional properties that can be merged with the existing props.
 * 
 * @example
 * // Example of using IButtonProps with additional custom properties
 * interface MyCustomButtonContext {
 *     customAction : ()=>{}; // An example of a custom method specific to the context of this button implementation
 * }
 * 
 * const MyButton: React.FC<IButtonProps<MyCustomButtonContext>> = (props) => {
 *     const ref = useRef<IButtonContext<MyCustomButtonContext>>(null);
 *     return (
 *         <Button
 *             {...props}
 *             ref = {ref}
 *             onPress={() => console.log("Button pressed with custom action :", ref.current?.context?.customAction())}
 *         >
 *             {props.label}
 *         </Button>
 *     );
 * };
 */
export type IButtonProps<IButtonExtendContext = any> = ILabelOrLeftOrRightProps<{ context: IButtonContext<IButtonExtendContext>, textColor: string }> & Omit<ITouchableRippleProps, "style" | 'onPress' | "children"> & Omit<ITooltipBaseProps, 'disabled'> & {
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
    children?: React.ReactNode;

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

    /***
     * Props for (the left, icon, and label ) container of the button.
     * This can include styles and other properties for the view.
     */
    leftContentWrapperProps?: IViewProps;

    /***
     * Props for right content container of the button.
     * This can include styles and other properties for the view.
     */
    rightContentWrapperProps?: IViewProps;

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
     * If true, the button will take up the full width of its container.
     * This can be useful for creating buttons that span the entire width of the screen.
     */
    fullWidth?: boolean;

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

    /***
     * if true, the button will have a divider line below it.
     * The divider line is added only when button mode is not outlined.
     */
    divider?: boolean;

    /***
     * Props for the divider line below the button.
     */
    dividerProps?: IDividerProps;

    /***
     * Optional context for the button component.
     */
    context?: IButtonExtendContext;

    onPress?: (event: GestureResponderEvent, context: IButtonContext<IButtonExtendContext>) => any;


    /**
     * The name of the resource associated with the button.
     */
    resourceName?: IResourceName;
    /**
     * The permission associated with the button.
     * This permission is used to determine if the button will be rendered or not.
     * If not provided, the button will be rendered regardless of the user's permissions.
     */
    perm?: IAuthPerm;
}

/**
 * @typedef IButtonContext
 * 
 * Represents the context for a button component, providing methods and properties
 * that enable interaction and state management. This context is useful for managing
 * the button's behavior in a consistent manner across different implementations.
 * 
 * @template IButtonExtendContext - A generic type that allows the inclusion of additional properties
 *               specific to the button context implementation. This can be any type, 
 *               and the context will inherit properties from it.
 * 
 * @property {function(): void} enable - Enables the button, allowing it to respond to user interactions.
 * 
 * @example
 * // Example of enabling a button
 * buttonContext.enable(); // The button is now enabled and can be interacted with.
 * 
 * @property {function(): void} disable - Disables the button, preventing it from responding to user interactions.
 * 
 * @example
 * // Example of disabling a button
 * buttonContext.disable(); // The button is now disabled and cannot be interacted with.
 * 
 * @property {function(): boolean} isEnabled - Returns a boolean indicating whether the button is currently enabled.
 * 
 * @example
 * // Example of checking if the button is enabled
 * const enabled = buttonContext.isEnabled(); // Returns true if the button is enabled, false otherwise.
 * 
 * @property {function(): string} getId - Returns the unique identifier of the button. 
 * This can be useful for tracking or logging purposes.
 * 
 * @example
 * // Example of getting the button's unique identifier
 * const buttonId = buttonContext.getId(); // Retrieves the unique ID of the button.
 * 
 * @property {function(boolean): void} setIsLoading - Sets the loading state of the button. 
 * When loading is true, the button will show a loading indicator.
 * 
 * @param {boolean} isLoading - Sets the loading state of the button. 
 * When true, the button will show a loading indicator; when false, it will return to its normal state.
 * 
 * @example
 * // Example of setting the button to loading state
 * buttonContext.setIsLoading(true); // The button shows a loading indicator.
 * buttonContext.setIsLoading(false); // The button returns to its normal state.
 * 
 * @property {View | null} ref - A reference to the underlying View component that wraps the button. 
 * This can be used for direct manipulation or animations.
 * 
 * @example
 * // Example of using the ref property
 * if (buttonContext.ref) {
 *     // Perform some manipulation or animation on the underlying View component
 *     buttonContext.ref.animate({ opacity: 0.5 }, 300); // Example of animating the button's opacity.
 * }
 * 
 * & IButtonExtendContext - Additional properties specific to the button context implementation.
 * 
 * @example
 * // Example of extending the button context with additional properties
 * interface MyButtonContext extends IButtonContext<{ customData: string }> {
 *     customMethod: () => void; // A custom method specific to MyButtonContext
 * }
 *  * @example
 * // Example usage of IButtonContext in a functional component
 * const MyComponent: React.FC = () => {
 *     const buttonRef = useRef<IButtonContext>(null);
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
export type IButtonContext<IButtonExtendContext = any> = Readonly<{
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
     * represent the unique identifier of the button. This can be useful for tracking, logging, or other purposes.
     */
    id: string;
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
} & IButtonExtendContext>;


/**
 * Type definition for a forwarded reference to a Button component.
 * 
 * This type encapsulates the reference that can be used to access 
 * the underlying Button component's context. It allows for the 
 * extension of button context properties through a generic type 
 * parameter, enabling developers to create more specialized 
 * button contexts as needed.
 * 
 * @template IButtonExtendContext - A generic type parameter that allows 
 * extending the context for the Button component. This enables 
 * customization of the properties passed to the button context.
 * 
 * @typedef {React.ForwardedRef<IButtonContext<IButtonExtendContext>>} IButtonRef
 * 
 * @example
 * // Example usage of IButtonRef in a functional component
 * const MyButton = React.forwardRef<IButtonContext, ButtonProps>((props, ref) => {
 *     return (
 *         <Button ref={ref} {...props}>
 *             Click Me
 *         </Button>
 *     );
 * });
 * 
 * // Using the IButtonRef type to create a reference
 * const buttonRef: IButtonRef = React.createRef();
 * 
 * @remarks
 * Utilizing the IButtonRef type allows for type-safe handling of 
 * button references, making it easier to manage button states 
 * and actions in a React application.
 */
export type IButtonRef<IButtonExtendContext = any> = React.ForwardedRef<IButtonContext<IButtonExtendContext>>;