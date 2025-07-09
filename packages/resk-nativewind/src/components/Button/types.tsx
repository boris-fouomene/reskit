import { IIconProps, IIconSource } from "@components/Icon/types";
import { ISurfaceProps } from "@components/Surface";
import { GestureResponderEvent, PressableProps, View } from "react-native";
import { IAuthPerm } from "@resk/core/auth";
import { IClassName } from "@src/types";
import { JSX, ReactNode, Ref } from "react";
import { IDict, IResourceName } from '@resk/core/types';
import { buttonVariant, IVariantPropsButton } from "@variants/button";


export type IButtonBaseContext<Context = unknown> = Context & {
    loading: boolean;
    disabled: boolean;
    computedVariant: ReturnType<typeof buttonVariant>;
}
export interface IButtonProps<Context = unknown> extends Omit<ISurfaceProps, "variant" | "onPress"> {
    /***
     * The class name for the label
     */
    labelClassName?: IClassName;

    /**
     * Position of the icon relative to the button label.
     * Can be either 'left' or 'right'.
     * 
     * @example
     * <Button iconPosition="left" icon={<Icon />} label="Submit" />
     */
    iconPosition?: "left" | "right";


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

    /***
     * The class name for the icon displayed on the button
     */
    iconClassName?: IClassName;

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
     * The label of the button
     */
    label?: ReactNode;

    /***
     * The left content of the button
     */
    left?: ReactNode | ((options: IButtonBaseContext<Context>) => ReactNode);

    /***
     * The right content of the button
     */
    right?: ReactNode | ((options: IButtonBaseContext<Context>) => ReactNode);

    /**
     * Disables the ripple effect on button press.
     * If set to true, the ripple effect will not be shown when the button is pressed.
     * 
     * @example
     * <Button disableRipple={true} />
     */
    disableRipple?: boolean;

    /***
     * @platform android
     */
    android_ripple?: PressableProps["android_ripple"];


    /***
     * The variant of the button
     */
    variant?: IVariantPropsButton;

    /***
     * The content of the ripple effect
     */
    rippleContent?: JSX.Element | null;

    /** Duration of the ripple effect, in milliseconds
     * Default value is 500 (ms)
     */
    //rippleDuration?: number;

    /***
     * The opacity of the ripple effect. Default is 0.9
     */
    //rippleOpacity?: number;

    /***
     * Optional context for the button component.
     */
    context?: Context;

    /***
        The callback function to be called when the button is pressed.
    */
    onPress?: (event: GestureResponderEvent, context: IButtonBaseContext<Context>) => any;

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

}

export interface IButtonInteractiveProps<Context = unknown> extends Omit<IButtonProps<IButtonContext<Context>>, "ref"> {
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
     * The réf of the button component.
     */
    ref?: Ref<IButtonContext<Context> & View>;


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
}

export type IButtonContext<Context = unknown> = Readonly<{
    /*
        Enables the button, allowing it to respond to user interactions.
    */
    enable: (callback?: () => void) => void;
    /**
     * disable the button, preventing it from responding to user interactions.
     */
    disable: (callback?: () => void) => void;
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
     * @param callback {(newIsLoading: boolean) => void} - Optional callback function to be called when the loading state changes.
     * @returns 
     */
    setIsLoading: (isLoading: boolean, callback?: (newIsLoading: boolean) => void) => void;

    /***
     * The data associated with the form if the button is representing a form action.
     */
    formData?: IDict;
}> & Omit<IButtonBaseContext<Context>, "context">;
