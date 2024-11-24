import { useRef } from "react";
import Platform from "@platform";
import {
    Animated,
    StyleSheet,
    Easing,
} from 'react-native';

const useNativeDriver = Platform.isMobileNative();

export const useAnimations = ({ disableRipple, rippleColor, testID }: { disableRipple?: boolean, rippleColor?: string, testID?: string }) => {
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
        if (disableRipple) return;
        Animated.timing(rippleOpacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver,
        }).start();
    };
    const fadeOut = () => {
        if (disableRipple) return;
        Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver,
        }).start();
    };
    return {
        fadeIn, fadeOut, rippleContent: disableRipple ? null : <Animated.View
            testID={testID}
            style={[
                StyleSheet.absoluteFillObject,
                styles.ripple,
                { backgroundColor: rippleColor, opacity: rippleOpacity },
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