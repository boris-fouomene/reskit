import { useRef} from "react";
import Platform from "@platform";
import {
    Animated,
    StyleSheet,
    Easing,
} from 'react-native';

const useNativeDriver = Platform.isMobileNative();

export const useAnimations = ({ disableRipple, rippleColor, testID }: { disableRipple?: boolean, rippleColor?: string, testID?: string }) => {
    const rippleOpacity = useRef(new Animated.Value(0.12)).current;
    const scaleValue = useRef(new Animated.Value(0.01)).current;
    const fadeIn = () => {
        if (disableRipple) return;
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 300,
            easing: Easing.bezier(0.0, 0.0, 0.2, 1),
            useNativeDriver,
        }).start();
    };
    const fadeOut = () => {
        if (disableRipple) return;
        Animated.timing(rippleOpacity,{
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver,
        }).start(() => {
            scaleValue.setValue(0.01);
            rippleOpacity.setValue(0.12);
        });
    };
    return {
        fadeIn, fadeOut, rippleContent: disableRipple ? null : <Animated.View
            testID={testID}
            style={[
                StyleSheet.absoluteFillObject,
                styles.ripple,
                { backgroundColor: rippleColor,
                 transform: [{ scale: scaleValue }], 
                 opacity: rippleOpacity },
            ]}
        />
    };
}


const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
