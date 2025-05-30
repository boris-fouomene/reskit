import { IHtmlDivProps } from "@html/types";
import { KeyboardAvoidingViewProps } from "react-native";

/**
 * Props for the KeyboardAvoidingView component.
 *
 * @extends IHtmlDivProps
 *
 * @property behavior - Determines the behavior of the KeyboardAvoidingView when the keyboard appears. Can be 'height', 'position', or 'padding'.
 * @property contentContainerStyle - The style applied to the content container (View) when the behavior is set to 'position'.
 * @property keyboardVerticalOffset - The distance between the top of the user screen and the React Native view. Useful for adjusting the view in certain use cases.
 * @property enabled - Enables or disables the KeyboardAvoidingView. Defaults to true.
 */
export interface IKeyboardAvoidingViewProps extends IHtmlDivProps {
    behavior?: 'height' | 'position' | 'padding' | undefined;

    /**
     * The style of the content container(View) when behavior is 'position'.
     */
    contentContainerStyle?: KeyboardAvoidingViewProps['contentContainerStyle'];

    /**
     * This is the distance between the top of the user screen and the react native view,
     * may be non-zero in some use cases.
     */
    keyboardVerticalOffset?: KeyboardAvoidingViewProps['keyboardVerticalOffset'];

    /**
     * Enables or disables the KeyboardAvoidingView.
     *
     * Default is true
     */
    enabled?: KeyboardAvoidingViewProps['enabled'];
}