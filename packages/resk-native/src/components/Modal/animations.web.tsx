import { isNumber } from '@resk/core';
import * as React from 'react';
import { StyleSheet, ViewStyle } from "react-native";

const ANIMATION_DURATION = 300;

export type IAnimationsType = 'none' | 'slide' | 'fade';


export function useGetAnimations(options: { animationType?: IAnimationsType, visible?: boolean, animationDuration?: number }) {
    let { animationType, visible, animationDuration } = Object.assign({}, options);
    animationType = animationType || 'none';
    if (!["none", "slide", "fade"].includes(animationType)) {
        animationType = "none";
    }
    return React.useMemo(() => {
        return [
            createAnimation(animationDuration),
            styles.container,
            visible ? styles.animatedIn : styles.animatedOut,
            createAnimation(animationDuration),
            (animationType === "slide" ? (visible ? styles.slideIn : styles.slideOut)
                : (animationType == "fade" ? (visible ? styles.fadeIn : styles.fadeOut)
                    : (visible ? styles.container : styles.hidden)))
        ]
    }, [animationType, visible]);
}

const createAnimation = (duration?: number) => {
    duration = isNumber(duration) && duration > 0 ? duration : ANIMATION_DURATION;
    return {
        animationDuration: `${duration}ms`,
    } as ViewStyle;
}
const styles = StyleSheet.create({
    container: {
        position: 'fixed' as 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    animatedIn: {
        animationTimingFunction: 'ease-in'
    } as any,
    animatedOut: {
        pointerEvents: 'none',
        animationTimingFunction: 'ease-out'
    } as any,
    fadeIn: {
        opacity: 1,
        animationKeyframes: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
        }
    } as any,
    fadeOut: {
        opacity: 0,
        animationKeyframes: {
            '0%': { opacity: 1 },
            '100%': { opacity: 0 }
        }
    } as any,
    slideIn: {
        transform: 'translateY(0%)',
        animationKeyframes: {
            '0%': { transform: 'translateY(100%)' },
            '100%': { transform: 'translateY(0%)' }
        }
    } as any,
    slideOut: {
        transform: 'translateY(100%)',
        animationKeyframes: {
            '0%': { transform: 'translateY(0%)' },
            '100%': { transform: 'translateY(100%)' }
        }
    } as any,
    hidden: {
        opacity: 0
    }
});