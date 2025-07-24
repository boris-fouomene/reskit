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




export const useDimensions = (options?: Partial<IUseDimensionsOptons>): IUseDimensionsResult => {
    options = Object.assign({}, options);
    const widthThreshold = isNumber(options.widthThreshold) ? options.widthThreshold : 0;
    const heightThreshold = isNumber(options.heightThreshold) ? options.heightThreshold : 0;
    const debounceTimeout = isNumber(options.debounceTimeout) ? options.debounceTimeout : 0;
    const ignoreKeyboard = options.ignoreKeyboard !== false;
    const w = Dimensions.get("window");
    const s = Dimensions.get("screen");
    const initialized = isNumber(w?.width) && isNumber(w?.height);
    const hydrationStatus = getInitialHydrationStatus();
    const isHydrated = initialized || hydrationStatus;
    const keyboard = useKeyboard();
    const [state, setState] = useStateCallback<{ window: ScaledSize, screen: ScaledSize, isHydrated: boolean }>({
        window: isHydrated ? w : scaleSized,
        screen: isHydrated ? s : scaleSized,
        isHydrated,
    });
    const previousDimensions = useRef(state);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const optionsRef = useRef<Required<Omit<IUseDimensionsOptons, "breakpoints">>>(options as any);
    optionsRef.current = { widthThreshold, heightThreshold, debounceTimeout, ignoreKeyboard };

    const prevWindowRef = useRef(state.window);
    const prevKeyboardVisible = usePrevious(keyboard.isKeyboardVisible);
    prevWindowRef.current = useMemo(() => {
        if ((prevKeyboardVisible !== keyboard.isKeyboardVisible || keyboard.isKeyboardVisible) && ignoreKeyboard || (state.window.width == prevWindowRef.current.width && state.window.height == prevWindowRef.current.height)) return prevWindowRef.current;
        return state.window;
    }, [state.window.width, state.window.height, keyboard.isKeyboardVisible, ignoreKeyboard, prevKeyboardVisible]);

    const { width } = prevWindowRef.current;

    const { isMobile, isTablet, isDesktop } = Breakpoints.getDeviceLayout({ viewportWidth: width });
    useEffect(() => {
        const applyUpdate = (newDimensions: IUseDimensionsResult) => {
            if (exceedsThreshold(newDimensions, previousDimensions.current as any, optionsRef.current.widthThreshold as number, optionsRef.current.heightThreshold as number)) {
                setState(prev => ({
                    ...prev,
                    ...newDimensions,
                }));
                previousDimensions.current = newDimensions;
                return;
            }
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
        if (!state.isHydrated) {
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

const scaleSized = { width: 0, height: 0, fontScale: 1, scale: 1 };

/**
 * Result object returned by {@link useDimensions}, combining responsive device/window dimensions, hydration status, keyboard state, and device type flags.
 *
 * This interface extends {@link IUseKeyboardResult} and provides a comprehensive set of properties for responsive UI logic in React Native apps.
 *
 * @property isMobile - `true` if the device width is less than or equal to the `mobileMaxWidth` breakpoint.
 * @property isTablet - `true` if the device width is greater than `mobileMaxWidth` and less than or equal to `tabletMaxWidth`.
 * @property isDesktop - `true` if the device width is greater than the `tabletMaxWidth` breakpoint.
 * @property isMobileOrTablet - `true` if the device is either mobile or tablet (width ≤ `tabletMaxWidth`).
 * @property window - The current window dimensions as a {@link ScaledSize} object (width, height, scale, fontScale).
 * @property screen - The current screen dimensions as a {@link ScaledSize} object (width, height, scale, fontScale).
 * @property isHydrated - Indicates whether the component has been hydrated (useful for SSR/CSR compatibility).
 *
 * @example
 * ```tsx
 * import { useDimensions } from "@resk/nativewind/utils/dimensions";
 *
 * function DeviceInfo() {
 *   const { window, isMobile, isTablet, isDesktop, isHydrated } = useDimensions();
 *   return (
 *     <View>
 *       <Text>Width: {window.width}</Text>
 *       <Text>Device: {isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}</Text>
 *       <Text>Hydrated: {isHydrated ? "Yes" : "No"}</Text>
 *     </View>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Device type flags are computed from the current window width and the configured breakpoints.
 * - The `window` and `screen` properties provide the latest dimensions for responsive layouts.
 * - The `isHydrated` flag is `false` on first render (SSR) and `true` after hydration (CSR).
 * - All keyboard state properties from {@link IUseKeyboardResult} are included.
 *
 * @see {@link useDimensions}
 * @see {@link IUseKeyboardResult}
 * @see {@link ScaledSize}
 * @see {@link Breakpoints}
 *
 * @public
 */
interface IUseDimensionsResult extends IUseKeyboardResult {
    /**
     * Whether the device is a mobile device.
     *
     * `true` if the device width is less than or equal to the `mobileMaxWidth` breakpoint.
     */
    isMobile: boolean;

    /**
     * Whether the device is a tablet device.
     *
     * `true` if the device width is greater than the `mobileMaxWidth` breakpoint and less than or equal to the `tabletMaxWidth` breakpoint.
     */
    isTablet: boolean;

    /**
     * Whether the device is a desktop device.
     *
     * `true` if the device width is greater than the `tabletMaxWidth` breakpoint.
     */
    isDesktop: boolean;

    /**
     * Whether the device is a mobile or tablet device.
     *
     * `true` if the device width is less than or equal to the `tabletMaxWidth` breakpoint.
     */
    isMobileOrTablet: boolean;

    /**
     * Current window dimensions.
     *
     * Includes width, height, scale, and fontScale.
     */
    window: ScaledSize;

    /**
     * Current screen dimensions.
     *
     * Includes width, height, scale, and fontScale.
     */
    screen: ScaledSize;

    /**
     * Whether the component has been hydrated (for SSR/CSR compatibility).
     *
     * @default false
     */
    isHydrated: boolean;
}
