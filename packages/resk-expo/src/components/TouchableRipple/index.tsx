import { Component, useMemo } from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeModules,
    Pressable,
    StyleSheet,
} from 'react-native';
import { ITouchableRippleProps } from './types';
import { defaultStr } from '@resk/core';
import { getColors } from './utils';
import Theme, { useTheme } from '@theme/index';
import Platform from '@platform/index';

const isAndroid = Platform.isAndroid();


/** State of the {@link TouchableRipple} */
interface ITouchableRippleState {
    width: number;
    height: number;
    maskBorderRadius: number;
    shadowOffsetY: number;
    ripple: {
        radii: number;
        dia: number;
        offset: {
            top: number;
            left: number;
        };
    };
}


/**
 * A custom `TouchableRipple` component that implements Material Design's ripple effect 
 * without any third-party dependencies. This component enhances user interaction 
 * by providing visual feedback when the user presses and holds the button.
 * 
 * @component
 * 
 * @param {ITouchableRippleProps} props - The properties for the component.
 * 
 * @param {React.ReactNode | ((state: PressableState) => React.ReactNode)} props.children - 
 * The content to be displayed inside the button. Can be a React node or a function 
 * that receives the current state of the button (pressed, hovered) and returns 
 * the content to render.
 * 
 * @param {(event:GestureResponderEvent) => void} [props.onPress] - Callback function that is called when the button is pressed. 
 * This function should contain the logic to be executed upon the press event.
 * 
 * @param {string} [props.rippleColor] - Custom color for the ripple effect. 
 * Defaults to a semi-transparent version of the theme's onSurface color if not provided.
 * 
 * @param {string} [props.hoverColor] - Custom background color when the button is hovered over. 
 * Defaults to a faded version of the ripple color if not specified.
 * 
 * @param {boolean} [props.disabled=false] - If true, disables the button, preventing any interaction.
 * 
 * @param {string} [props.testID] - Optional test ID used for testing purposes, defaults to "resk-touchable-ripple".
 * 
 * @param {React.Ref} ref - A ref that can be used to access the underlying Pressable component.
 * 
 * @returns {JSX.Element} A `Pressable` component with ripple effect and hover functionality.
 * 
 * @example
 * Basic usage of the `TouchableRipple` component:
 * ```tsx
 * <TouchableRipple onPress={() => alert('Button Pressed!')}>
 *   <Text>Press Me!</Text>
 * </TouchableRipple>
 * ```
 * 
 * @example
 * Customizing the ripple and hover colors:
 * ```tsx
 * <TouchableRipple 
 *   onPress={() => console.log('Custom Button Pressed!')}
 *   rippleColor="rgba(0, 150, 136, 0.6)"
 *   hoverColor="#e0f7fa"
 * >
 *   <Text style={{ color: '#00796b' }}>Custom Styled Button</Text>
 * </TouchableRipple>
 * ```
 * 
 * @note 
 * The ripple effect is animated using the `Animated` API from React Native. 
 * The component uses the `Pressable` component to handle touch interactions, 
 * providing built-in support for hover and press states.
 * 
 * @example
 * Using a function as children to customize rendering based on the button state:
 * ```tsx
 * <TouchableRipple 
 *   onPress={(event) => alert('State-based Button Pressed!')}
 * >
 *   {(state) => (
 *     <Text style={{ color: state.pressed ? 'white' : 'black' }}>
 *       {state.pressed ? 'Pressed!' : 'Press Me!'}
 *     </Text>
 *   )}
 * </TouchableRipple>
 * ```
 */
export class TouchableRipple extends Component<ITouchableRippleProps, ITouchableRippleState> {
    /** Default props */
    static defaultProps: ITouchableRippleProps = {
        borderWidth: 0,
        disabled: false,
        maskBorderRadius: 2,
        maskBorderRadiusInPercent: 0,
        maskDuration: 200,
        rippleDuration: 200,
        rippleLocation: 'tapLocation',
        shadowAniEnabled: true,
    };


    private animatedOpacity = new Animated.Value(0);
    private _animatedRippleScale = new Animated.Value(0);
    private _rippleAni?: Animated.CompositeAnimation;
    private _pendingRippleAni?: () => void;

    constructor(props: ITouchableRippleProps) {
        super(props);
        this.state = {
            height: 1,
            width: 1,

            maskBorderRadius: 0,
            ripple: { radii: 0, dia: 0, offset: { top: 0, left: 0 } },
            shadowOffsetY: 1,
        };
    }

    /** Start the ripple effect */
    showRipple() {
        this.animatedOpacity.setValue(1);
        this._animatedRippleScale.setValue(0.3);

        // scaling up the ripple layer
        this._rippleAni = Animated.timing(this._animatedRippleScale, {
            duration: this.props.rippleDuration || 200,
            toValue: 1,
            useNativeDriver: true,
        });

        // enlarge the shadow, if enabled
        if (this.props.shadowAniEnabled) {
            this.setState({ shadowOffsetY: 1.5 });
        }

        this._rippleAni.start(() => {
            this._rippleAni = undefined;

            // if any pending animation, do it
            if (this._pendingRippleAni) {
                this._pendingRippleAni();
            }
        });
    }

    /** Stop the ripple effect */
    hideRipple() {
        this._pendingRippleAni = () => {
            // hide the ripple layer
            Animated.timing(this.animatedOpacity, {
                duration: this.props.maskDuration || 200,
                toValue: 0,
                useNativeDriver: true,
            }).start();

            // scale down the shadow
            if (this.props.shadowAniEnabled) {
                this.setState({ shadowOffsetY: 1 });
            }

            this._pendingRippleAni = undefined;
        };

        if (!this._rippleAni) {
            // previous ripple animation is done, good to go
            this._pendingRippleAni();
        }
    }

    /** {@inheritDoc @types/react#Component.render} */
    render() {
        return <RippleContent
            {...this.props}
            rippleState={this.state}
            onPressOut={this.onPressOut.bind(this)}
            onPressIn={this.onPressIn.bind(this)}
            onLayout={this.onLayout.bind(this)}
            rippleScale={this._animatedRippleScale}
            animatedOpacity={this.animatedOpacity}
        />;
    }

    private onLayout = (evt: LayoutChangeEvent) => {
        this.onLayoutChange(evt.nativeEvent.layout);
        if (typeof this.props.onLayout == "function") this.props.onLayout(evt);
    };
    private isRippleDisabled() {
        return this.props.disableRipple || this.props.disabled;
    }
    private onLayoutChange({ width, height }: LayoutRectangle) {
        if (this.isRippleDisabled()) return;
        if (width === this.state.width && height === this.state.height) {
            return;
        }
        this.setState({
            ...this._calcMaskLayer(width, height),
            height,
            width,
        });
    }

    // update Mask layer's dimension
    private _calcMaskLayer(width: number, height: number): { maskBorderRadius: number } {
        const maskRadiiPercent = this.props.maskBorderRadiusInPercent;
        let maskBorderRadius = this.props.maskBorderRadius || 0;
        if (maskRadiiPercent) {
            // eslint-disable-next-line prettier/prettier
            maskBorderRadius = Math.min(width, height) * maskRadiiPercent / 100;
        }
        return { maskBorderRadius };
    }

    // update TouchableRipple layer's dimension
    private _calcRippleLayer(x0: number, y0: number) {
        const { width, height, maskBorderRadius } = this.state;
        const maskRadiusPercent = this.props.maskBorderRadiusInPercent || 0;
        let radii;
        let hotSpotX = x0;
        let hotSpotY = y0;

        if (this.props.rippleLocation === 'center') {
            hotSpotX = width / 2;
            hotSpotY = height / 2;
        }
        const offsetX = Math.max(hotSpotX, width - hotSpotX);
        const offsetY = Math.max(hotSpotY, height - hotSpotY);

        // FIXME Workaround for Android not respect `overflow`
        // @see https://github.com/facebook/react-native/issues/3198
        if (
            isAndroid &&
            this.props.rippleLocation === 'center' &&
            maskRadiusPercent > 0
        ) {
            // limit ripple to the bounds of mask
            radii = maskBorderRadius;
        } else {
            radii = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        }

        return {
            ripple: {
                dia: radii * 2,
                offset: {
                    left: hotSpotX - radii,
                    top: hotSpotY - radii,
                },
                radii,
            },
        };
    }
    private onPressOut(evt: GestureResponderEvent) {
        if (typeof this.props.onPressOut == "function") this.props.onPressOut(evt);
        if (this.isRippleDisabled()) {
            return;
        }
        this.hideRipple();
    }
    onPressIn(evt: GestureResponderEvent) {
        if (typeof this.props.onPressIn == "function") this.props.onPressIn(evt);
        if (this.isRippleDisabled()) {
            return;
        }
        const { nativeEvent: { pageX, pageY } } = evt;
        this.setState({
            ...this._calcRippleLayer(pageX, pageY),
        }, () => {
            this.showRipple();
        });
    }
}

function RippleContent({ children, disabled, style, onPress,
    rippleColor: customRippleColor,
    hoverColor: customHoverColor,
    disableRipple,
    testID,
    borderless,
    borderRadius,
    rippleDuration,
    rippleSize,
    rippleOpacity,
    shadowAniEnabled,
    rippleState,
    rippleScale,
    borderWidth,
    maskBorderRadius,
    maskDuration,
    animatedOpacity,
    ...props }: ITouchableRippleProps & { rippleState: ITouchableRippleState, rippleScale: Animated.Value, animatedOpacity: Animated.Value }) {
    const theme = useTheme();
    const { rippleColor, hoverColor } = getColors({ rippleColor: customRippleColor, hoverColor: customHoverColor, theme });
    testID = defaultStr(testID, "resk-touchable-ripple");

    borderWidth = typeof borderWidth == "number" && borderWidth || 0;
    rippleDuration = typeof rippleDuration == "number" && rippleDuration > 0 ? rippleDuration : 300;
    rippleOpacity = typeof rippleOpacity == "number" && rippleOpacity >= 0 ? rippleOpacity : 0.3;
    maskDuration = typeof maskDuration == "number" && maskDuration > 0 ? maskDuration : 200;
    shadowAniEnabled = typeof shadowAniEnabled == "boolean" ? shadowAniEnabled : true;
    const shadowStyle = useMemo(() => {
        return shadowAniEnabled !== false ? {
            shadowOffset: {
                height: rippleState.shadowOffsetY,
                width: 0,
            }
        } : undefined;
    }, [shadowAniEnabled]);

    const rippleContent =
        <Animated.View
            testID={testID + "-animated-container"}
            style={{
                height: rippleState.height,
                width: rippleState.width,

                left: -(borderWidth),
                top: -(borderWidth),
                borderRadius: rippleState.maskBorderRadius,
                opacity: animatedOpacity,
                position: 'absolute',
            }}
        >
            <Animated.View
                testID={testID + "-animated-content"}
                style={{
                    height: rippleState.ripple.dia,
                    width: rippleState.ripple.dia,

                    ...rippleState.ripple.offset,
                    backgroundColor: rippleColor,
                    borderRadius: rippleState.ripple.radii,
                    transform: [{ scale: rippleScale }],
                }}
            />
        </Animated.View>;
    return <Pressable
        {...props}
        android_ripple={disableRipple ? undefined : Object.assign({
            color: rippleColor,
            borderless,
            radius: borderRadius,
            duration: rippleDuration,
        }, props.android_ripple)}
        testID={testID}
        style={(state) => {
            const cStyle = typeof style === 'function' ? style(state) : style;
            const isHover = (state as any)?.hovered && !disabled;
            return ([
                styles.container,
                state.pressed && !disabled && rippleColor && { backgroundColor: rippleColor },
                shadowStyle,
                disabled && Theme.styles.disabled,
                typeof borderRadius == "number" && { borderRadius },
                cStyle,
                isHover && hoverColor && { backgroundColor: hoverColor },
            ]);
        }}
    >
        {typeof children === "function" ? (state) => {
            return <>
                {rippleContent}
                {children(state)}
            </>
        } : <>
            {rippleContent}
            {children}
        </>}
    </Pressable>;
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignSelf: "flex-start",
        userSelect: "none",
    },
});

export * from "./utils";
export * from "./types";