import { Ref } from 'react';
import { PressableProps, View } from 'react-native';
/**
 * Interface representing the props for the `TouchableRipple` component.
 * This interface extends the standard `PressableProps` from React Native,
 * allowing for all standard pressable properties alongside custom props specific 
 * to the ripple effect functionality.
 *
 * @interface ITouchableRippleProps
 * 
 * @extends PressableProps
 * 
 * @property {string} [rippleColor] - Specifies the color of the ripple effect. 
 * If not provided, it defaults to a semi-transparent black color 
 * ('rgba(0, 0, 0, 0.12)'). This property allows for customization 
 * of the ripple effect to match the application's theme.
 * 
 * @example
 * ```tsx
 * <TouchableRipple 
 *   onPress={() => console.log('Pressed!')}
 *   rippleColor="rgba(0, 0, 0, 0.12)"
 *   hoverColor="#ffffff"
 * >
 *   <Text>Click me!</Text>
 * </TouchableRipple>
 * ```
 * 
 * @property {string} [hoverColor] - Defines the background color of the 
 * component when it is hovered over. The default value is 'transparent'.
 * This property can be used to provide visual feedback to the user 
 * when the component is interacted with.
 * 
 * @example
 * ```tsx
 * <TouchableRipple 
 *   onPress={() => {}}
 *   rippleColor="rgba(255, 0, 0, 0.12)"
 *   hoverColor="#f5f5f5"
 *   style={{ borderRadius: 8 }}
 * >
 *   <Text>Styled Button</Text>
 * </TouchableRipple>
 * ```
 * 
 * @example
 * Here’s an example of how to use the `TouchableRipple` component with 
 * both ripple and hover colors customized:
 * 
 * ```tsx
 * const MyButton = () => (
 *   <TouchableRipple 
 *     onPress={() => alert('Button Pressed!')}
 *     rippleColor="rgba(0, 150, 136, 0.6)"
 *     hoverColor="#e0f7fa"
 *     style={{ padding: 10, borderRadius: 5 }}
 *   >
 *     <Text style={{ color: '#00796b' }}>Press Me!</Text>
 *   </TouchableRipple>
 * );
 * ```
 * 
 * @note 
 * The `TouchableRipple` component is designed to provide a visually appealing 
 * interaction experience by implementing a ripple effect. Ensure that the 
 * colors used for `rippleColor` and `hoverColor` maintain good contrast 
 * with the text and background for accessibility purposes.
 */
export interface ITouchableRippleProps extends PressableProps {
    /** Color of the ripple effect. Default is 'rgba(0, 0, 0, 0.12)' */
    rippleColor?: string;

    /** Duration of the ripple effect, in milliseconds */
    rippleDuration?: number;

    /** Background color of the component. Default is 'transparent' */
    hoverColor?: string;
    borderRadius?: number;
    /***
     * Disables the ripple effect.
     */
    disableRipple?: boolean;

    /** Animating the shadow (on pressed/released) or not 
     * Default is false
    */
    shadowEnabled?: boolean;

    /***
     * The opacity of the ripple effect. Default is 0.7
     */
    rippleOpacity?: number;
    
    ref?:Ref<View>
}