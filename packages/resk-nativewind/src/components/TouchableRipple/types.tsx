import { INativewindBaseProps } from '@src/types';
import { ReactElement } from 'react';
import { PressableProps, View } from 'react-native';

export interface ITouchableRippleProps extends Omit<PressableProps, "children" | "className">, INativewindBaseProps {
    /** Color of the ripple effect. Default is 'rgba(0, 0, 0, 0.12)' */
    rippleColor?: string;

    /** Duration of the ripple effect, in milliseconds */
    rippleDuration?: number;

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

    children?: ReactElement | null | undefined;

    ref?: React.Ref<View>;
}