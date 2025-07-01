"use client";
import { Dimensions, ScaledSize } from 'react-native';
import { Breakpoints } from './utils';
import { isNumber } from '@resk/core/utils';
import { IUseDimensionsOptons } from './types';
import useStateCallback from '@utils/stateCallback';
import { useEffect, useMemo, useRef } from 'react';
import { isObj } from '@resk/core/utils';
import { getInitialHydrationStatus } from '@utils/useHydrationStatus';
import { IUseKeyboardResult, useKeyboard } from '@utils/keyboard';
import usePrevious from '@utils/usePrevious';

const scaleSized = { width: 0, height: 0, fontScale: 1, scale: 1 };
export const useDimensions = (options?: Partial<IUseDimensionsOptons>): IUseDimensionsResult => {
    options = Object.assign({}, options);
    const widthThreshold = isNumber(options.widthThreshold) ? options.widthThreshold : 0;
    const heightThreshold = isNumber(options.heightThreshold) ? options.heightThreshold : 0;
    const debounceTimeout = isNumber(options.debounceTimeout) ? options.debounceTimeout : 0;
    const ignoreKeyboard = options.ignoreKeyboard !== false;
    const isHydrated = getInitialHydrationStatus();
    const keyboard = useKeyboard();
    const [state, setState] = useStateCallback<{ window: ScaledSize, screen: ScaledSize, isHydrated: boolean }>({
        window: isHydrated ? Dimensions.get('window') : scaleSized,
        screen: isHydrated ? Dimensions.get('screen') : scaleSized,
        isHydrated,
    }
    );
    const previousDimensions = useRef(state);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const optionsRef = useRef<Required<Omit<IUseDimensionsOptons, "breakpoints">>>(options as any);
    optionsRef.current = { widthThreshold, heightThreshold, debounceTimeout, ignoreKeyboard };
    const breakpoints = {
        mobileMaxWidth: Breakpoints.mobileMaxWidth,
        tabletMaxWidth: Breakpoints.tabletMaxWidth,
        ...options.breakpoints,
    };
    const prevWindowRef = useRef(state.window);
    const prevKeyboardVisible = usePrevious(keyboard.isKeyboardVisible);
    prevWindowRef.current = useMemo(() => {
        if ((prevKeyboardVisible !== keyboard.isKeyboardVisible || keyboard.isKeyboardVisible) && ignoreKeyboard || (state.window.width == prevWindowRef.current.width && state.window.height == prevWindowRef.current.height)) return prevWindowRef.current;
        return state.window;
    }, [state.window.width, state.window.height, keyboard.isKeyboardVisible, ignoreKeyboard, prevKeyboardVisible]);
    breakpoints.mobileMaxWidth = isNumber(breakpoints.mobileMaxWidth) && breakpoints.mobileMaxWidth > 0 ? breakpoints.mobileMaxWidth : Breakpoints.mobileMaxWidth;
    breakpoints.tabletMaxWidth = isNumber(breakpoints.tabletMaxWidth) && breakpoints.tabletMaxWidth > 0 ? breakpoints.tabletMaxWidth : Breakpoints.tabletMaxWidth;
    const { width } = prevWindowRef.current;
    const isMobile = width <= breakpoints.mobileMaxWidth;
    const isTablet = width > breakpoints.mobileMaxWidth && width <= breakpoints.tabletMaxWidth;
    const isDesktop = width > breakpoints.tabletMaxWidth;
    useEffect(() => {
        const applyUpdate = (newDimensions: IUseDimensionsResult) => {
            if (previousDimensions.current && !exceedsThreshold(newDimensions, previousDimensions.current as any, optionsRef.current.widthThreshold as number, optionsRef.current.heightThreshold as number)) {
                setState(prev => ({
                    ...prev,
                    ...newDimensions,
                }));
                previousDimensions.current = newDimensions;
                return;
            }
            setState(prev => ({ ...prev, ...newDimensions }));
            previousDimensions.current = newDimensions;
        };
        const r = Dimensions.addEventListener('change', function onDimensionChanged(newDimensions) {
            if (isObj(newDimensions) && (newDimensions.window.width !== state.window.width || newDimensions.window.height !== state.window.height)) {
                const debounceTimeout = optionsRef.current.debounceTimeout;
                if (debounceTimeout > 0) {
                    if (debounceTimer.current) {
                        clearTimeout(debounceTimer.current);
                    }
                    debounceTimer.current = setTimeout(() => applyUpdate(newDimensions as any), debounceTimeout);
                } else {
                    applyUpdate(newDimensions as any);
                }
            }
        });
        if (!isHydrated) {
            setState({ ...state, window: Dimensions.get('window'), screen: Dimensions.get('screen'), isHydrated: true })
        }
        return () => {
            r?.remove();
        };
    }, []);
    return {
        ...state,
        window: prevWindowRef.current,
        ...keyboard,
        isMobile,
        isTablet,
        isDesktop,
        isMobileOrTablet: isMobile || isTablet,
    };
};

const exceedsThreshold = (current: IUseDimensionsResult, previous: IUseDimensionsResult, widthThreshold: number, heightThreshold: number): boolean => {
    const widthDiff = Math.abs(current.window.width - previous.window.width);
    const heightDiff = Math.abs(current.window.height - previous.window.height);
    return widthDiff >= widthThreshold || heightDiff >= heightThreshold;
};

interface IUseDimensionsResult extends IUseKeyboardResult {
    /***
     * Whether the device is a mobile device : It's a device with a width less than or equal to the mobileMaxWidth breakpoint.
     */
    isMobile: boolean;
    /***
     * Whether the device is a tablet device : It's a device with a width greater than the mobileMaxWidth breakpoint and less than or equal to the tabletMaxWidth breakpoint.
     */
    isTablet: boolean;

    /***
     * Whether the device is a desktop device : It's a device with a width greater than the tabletMaxWidth breakpoint.
     */
    isDesktop: boolean;

    /***
     * Whether the device is a mobile or tablet device : It's a device with a width less than or equal to the mobileMaxWidth breakpoint or a width greater than the tabletMaxWidth breakpoint.
     */
    isMobileOrTablet: boolean;

    /***
     * Window dimensions
     */
    window: ScaledSize;

    /**
     * Screen dimensions
     */
    screen: ScaledSize;
    /***
     * Whether the component has been hydrated.
     * 
     * @default false
     */
    isHydrated: boolean;
}


