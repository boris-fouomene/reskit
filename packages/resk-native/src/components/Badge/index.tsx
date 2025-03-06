import * as React from 'react';
import {
    Animated,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { IThemeColorsTokenName, useTheme } from "@theme";
import Label, { ILabelProps } from '@components/Label';
import { defaultStr } from '@resk/core';

const defaultSize = 20;

const AnimatedLabel = Animated.createAnimatedComponent(Label);

/**
 * Props for the Badge component.
 * 
 * @extends React.ComponentProps<typeof AnimatedLabel>
 */
export type IBadgeProps = React.ComponentProps<typeof AnimatedLabel> & Omit<ILabelProps, "children"> & {
    /**
     * Whether the badge is visible
     */
    visible?: boolean;
    /**
     * Content of the `Badge`.
     */
    children?: React.ReactNode;
    /**
     * Size of the Badge.
     * 
     * @default 16
     */
    size?: number;

    /***
     * The badge border radius
     */
    borderRadius?: number;


    ref?: React.RefObject<typeof Animated.Text>;

    /**
     * Duration of the animation in milliseconds.
     * 
     * @default 300
     */
    animationDuration?: number;
};


/**
 * Badge component.
 * 
 * Displays a small badge with a given size and content.
 * 
 * @param props Props for the Badge component.
 * @returns JSX.Element
 */
export const Badge = ({
    children,
    size = defaultSize,
    style,
    visible = true,
    animationDuration = 300,
    testID,
    borderRadius,
    colorScheme,
    ...rest
}: IBadgeProps) => {
    testID = defaultStr(testID, "resk-badge");
    animationDuration = typeof animationDuration === 'number' ? animationDuration : 300;
    const theme = useTheme();
    const newColorSheme = colorScheme && theme?.colors?.[colorScheme as keyof typeof theme.colors] ? colorScheme : "error";
    const { backgroundColor, color } = theme.getColorScheme(newColorSheme as IThemeColorsTokenName);
    const { current: opacity } = React.useRef<Animated.Value>(
        new Animated.Value(visible ? 1 : 0)
    );
    const { fontScale } = useWindowDimensions();

    const isFirstRendering = React.useRef<boolean>(true);

    React.useEffect(() => {
        // Do not run animation on very first rendering
        if (isFirstRendering.current) {
            isFirstRendering.current = false;
            return;
        }

        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();
    }, [visible, opacity, animationDuration]);

    borderRadius = typeof borderRadius == "number" ? borderRadius : size / 2;
    return (
        <AnimatedLabel
            numberOfLines={1}
            testID={testID}
            colorScheme={"error"}
            style={[
                {
                    opacity,
                    fontSize: size * 0.5,
                    lineHeight: size / fontScale,
                    height: size,
                    minWidth: size,
                    borderRadius,
                    backgroundColor,
                    color,
                },
                styles.container,
                style,
            ]}
            {...rest}
        >
            {children}
        </AnimatedLabel>
    );
};

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        textAlign: 'center',
        textAlignVertical: 'center',
        overflow: 'hidden',
        paddingHorizontal: 3,
    },
});