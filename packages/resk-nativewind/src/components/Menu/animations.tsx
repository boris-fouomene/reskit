import { isNumber } from "@resk/core/utils";
import { useCallback, useEffect, useRef } from "react";
import { Animated } from "react-native";
import Platform from "@platform";
import useStateCallback from "@utils/stateCallback";

const useNativeDriver = Platform.canUseNativeDriver();

export const useMenuAnimations = ({ isDesktop, renderedAsBottomSheet, animationDuration, isVisible, windowWidth, windowHeight }: { isDesktop: boolean, renderedAsBottomSheet: boolean, animationDuration?: number, isVisible: boolean, windowWidth: number, windowHeight: number }) => {
    const [shouldRender, setShouldRender] = useStateCallback(isVisible);
    const menuTranslateY = useRef(new Animated.Value(renderedAsBottomSheet ? 0 : windowHeight)).current;
    const menuScale = useRef(new Animated.Value(renderedAsBottomSheet ? 0.8 : 1)).current;
    const menuOpacity = useRef(new Animated.Value(0)).current;
    animationDuration = isNumber(animationDuration) && animationDuration > 0 ? animationDuration : 300;

    const showMenu = useCallback(() => {
        const animations = [
            Animated.timing(menuOpacity, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver,
            }),
        ];

        if (renderedAsBottomSheet) {
            animations.push(
                Animated.spring(menuTranslateY, {
                    toValue: 0,
                    tension: 100,
                    friction: 8,
                    useNativeDriver,
                })
            );
        } else {
            animations.push(
                Animated.spring(menuScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver
                })
            );
        }

        Animated.parallel(animations).start();
    }, [renderedAsBottomSheet, animationDuration, menuTranslateY, menuScale, menuOpacity]);

    const hideMenu = useCallback((callback?: () => void) => {
        const animations = [
            Animated.timing(menuOpacity, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver
            }),
        ];
        if (renderedAsBottomSheet) {
            animations.push(
                Animated.timing(menuTranslateY, {
                    toValue: windowHeight,
                    duration: animationDuration,
                    useNativeDriver
                })
            );
        } else {
            animations.push(
                Animated.timing(menuScale, {
                    toValue: 0.8,
                    duration: animationDuration,
                    useNativeDriver
                })
            );
        }
        Animated.parallel(animations).start(callback);
    }, [renderedAsBottomSheet, animationDuration, windowHeight, menuTranslateY, menuScale, menuOpacity]);

    // Reset animations when desktop/mobile changes
    useEffect(() => {
        if (renderedAsBottomSheet) {
            menuTranslateY.setValue(isVisible ? 0 : windowHeight);
            menuScale.setValue(1);
        } else {
            menuTranslateY.setValue(0);
            menuScale.setValue(isVisible ? 1 : 0.8);
        }
    }, [renderedAsBottomSheet, isVisible, menuTranslateY, menuScale, windowHeight]);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            showMenu();
        } else {
            hideMenu(() => {
                setShouldRender(false);
            });
        }
    }, [isVisible, showMenu, hideMenu]);

    return {
        menuTranslateY,
        menuScale,
        menuOpacity,
        shouldRender,
        showMenu,
        hideMenu,
    };
};