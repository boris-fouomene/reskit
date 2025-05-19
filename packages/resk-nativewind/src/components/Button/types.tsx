import { IIconProps, IIconSource } from "@components/Icon/types";
import { ISurfaceProps } from "@components/Surface";
import { GestureResponderEvent, PressableProps, View } from "react-native";
import { IAuthPerm } from "@resk/core/auth";
import { IClassName } from "@src/types";
import { ReactNode, Ref } from "react";
import { IDict, IResourceName } from '@resk/core/types';
import { IVariantPropsButton } from "@variants/button";

export interface IButtonProps<IButtonExtendContext = any> extends Omit<ISurfaceProps, "onPress" | "variant"> {
    /***
     * The class name for the label
     */
    labelClassName?: IClassName;

    /**
     * Disables the ripple effect on button press.
     * If set to true, the ripple effect will not be shown when the button is pressed.
     * 
     * @example
     * <Button disableRipple={true} />
     */
    disableRipple?: boolean;

    /** Duration of the ripple effect, in milliseconds
     * Default value is 500 (ms)
     */
    rippleDuration?: number;

    /***
     * The opacity of the ripple effect. Default is 0.9
     */
    rippleOpacity?: number;

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

    /***
     * The class name for the activity indicator of the button. It's used when the button is in a loading state.
     */
    activityIndicatorClassName?: IClassName;

    /***
     * The class name for the content of the button.
     */
    contentClassName?: IClassName;

    /***
     * class name for (the left, icon, and label ) container of the button.
     */
    leftContainerClassName?: IClassName;

    /***
     * right container class name for the button.
     */
    rightContainerClassName?: IClassName;
    /**
     * Color of the ripple effect when the button is pressed.
     * This can enhance the visual feedback of the button interaction.
     * 
     * @example
     * <Button rippleColor="#0000ff" label="Ripple Effect" />
     */
    rippleColor?: string | null;

    /***
     * The class name for the ripple effect.
     */
    rippleClassName?: IClassName;

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

    /***
     * The class name for the container of the button.
     */
    containerClassName?: IClassName;

    /***
     * if true, the button will have a divider line below it.
     * The divider line is added only when button mode is not outlined.
     */
    divider?: boolean;

    /***
     * The class name for the divider line below the button.
     */
    dividerClassName?: IClassName;

    /***
     * Optional context for the button component.
     */
    context?: IButtonExtendContext;

    onPress?: (event: GestureResponderEvent, context: IButtonContext<IButtonExtendContext>) => any;

    /***
     * If true, the button will be expandable.
     * This can be used to create buttons that can be expanded or collapsed.
     */
    isExpandable?: boolean;

    /***
     * The name of the form associated with the button in case of button representing a form action.
     * when this property is set, the button listens dynamically to the state of the form and is activated or deactivated according to the validated state or name of the form. 
     */
    formName?: string;

    /***
     * If true, the button will submit the form when pressed in case the formName is set.
     * This can be useful for creating buttons that submit the form when pressed if the form is valid.
     */
    submitFormOnPress?: boolean;

    /***
     * The permission associated with the button. This permission is used to determine if the button will be rendered or not.
     * If not provided, the button will be rendered regardless of the user's permissions.
     */
    perm?: IAuthPerm;

    /***
     * The name of the resource associated with the button.
     * When this name is provided, button can be used as an actions for a form with that resource.
     */
    resourceName?: IResourceName;

    /***
     * The réf of the button component.
     */
    ref?: Ref<IButtonContext<IButtonExtendContext> & View>;

    /***
     * The label of the button
     */
    label?: ReactNode;

    /***
     * The left content of the button
     */
    left?: ReactNode;

    /***
     * The right content of the button
     */
    right?: ReactNode;

    android_ripple?: PressableProps["android_ripple"];

    variant?: IVariantPropsButton;
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

    /***
     * The data associated with the form if the button is representing a form action.
     */
    formData?: IDict;
} & IButtonExtendContext>;
