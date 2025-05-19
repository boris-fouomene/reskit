import { defaultNumber } from '@resk/core/utils';
import { MouseEvent, TouchEvent } from 'react';
import { GestureResponderEvent } from 'react-native';
import { UIManager } from "../UIManager";

/**
 * Converts a browser MouseEvent or TouchEvent to a structure compatible with 
 * React Native's GestureResponderEvent, or passes through an existing GestureResponderEvent
 * 
 * @param event - Mouse, Touch, or GestureResponder event from any platform
 * @returns An event object compatible with GestureResponderEvent
 */
export function normalizeGestureEvent(event: MouseEvent<any> | TouchEvent<any>): GestureResponderEvent {
    if (event) {
        UIManager.normalizeRef(event?.target);
        UIManager.normalizeRef(event?.currentTarget);
    }
    // If it's already a GestureResponderEvent, just return it directly
    if ('nativeEvent' in event &&
        event.nativeEvent &&
        typeof event.nativeEvent === 'object' &&
        'touches' in event.nativeEvent && typeof event.stopPropagation == "function" && typeof event.preventDefault == "function") {
        return event as any as GestureResponderEvent;
    }

    // Create a native-like event structure for web events
    const nativeEvent: any = {
        // Default common properties
        changedTouches: [],
        identifier: 0,
        locationX: 0,
        locationY: 0,
        pageX: 0,
        pageY: 0,
        target: 0,
        timestamp: Date.now(),
        touches: [],
    };

    // For handling touch events on web
    if ('touches' in event) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (touch) {
            const rect = (event.currentTarget as Element)?.getBoundingClientRect?.() || { left: 0, top: 0 };
            const locationX = touch.clientX - rect.left;
            const locationY = touch.clientY - rect.top;

            nativeEvent.locationX = locationX;
            nativeEvent.locationY = locationY;
            nativeEvent.pageX = touch.pageX;
            nativeEvent.pageY = touch.pageY;
            nativeEvent.identifier = touch.identifier || 0;

            // Convert TouchList to array format expected by React Native
            nativeEvent.touches = Array.from(event.touches).map((t, index) => ({
                locationX: t.clientX - rect.left,
                locationY: t.clientY - rect.top,
                pageX: t.pageX,
                pageY: t.pageY,
                identifier: t.identifier || index,
                target: event.target,
                timestamp: event.timeStamp || Date.now(),
                force: defaultNumber((t as any).force),
                radiusX: defaultNumber((t as any).radiusX),
                radiusY: defaultNumber((t as any).radiusY),
                rotationAngle: defaultNumber((t as any).rotationAngle),
            }));

            nativeEvent.changedTouches = Array.from(event.changedTouches || []).map((t, index) => ({
                locationX: t.clientX - rect.left,
                locationY: t.clientY - rect.top,
                pageX: t.pageX,
                pageY: t.pageY,
                identifier: t.identifier || index,
                target: event.target,
                timestamp: event.timeStamp || Date.now(),
                force: defaultNumber((t as any).force),
                radiusX: defaultNumber((t as any).radiusX),
                radiusY: defaultNumber((t as any).radiusY),
                rotationAngle: defaultNumber((t as any).rotationAngle),
            }));
        }
    }

    // For handling mouse events on web
    else if ('clientX' in event) {
        const rect = (event.currentTarget as Element)?.getBoundingClientRect?.() || { left: 0, top: 0 };
        const locationX = event.clientX - rect.left;
        const locationY = event.clientY - rect.top;

        nativeEvent.locationX = locationX;
        nativeEvent.locationY = locationY;
        nativeEvent.pageX = event.pageX;
        nativeEvent.pageY = event.pageY;

        // Create a synthetic touch object for mouse events
        const touchObj = {
            locationX,
            locationY,
            pageX: event.pageX,
            pageY: event.pageY,
            identifier: 0,
            target: event.target,
            timestamp: event.timeStamp || Date.now(),
            force: 1,
            radiusX: 1,
            radiusY: 1,
            rotationAngle: 0,
        };

        // For mousedown or touchstart, add to touches array
        // For mousemove/mouseup, only add to changedTouches
        if (event.type === 'mousedown') {
            nativeEvent.touches = [touchObj];
        }

        nativeEvent.changedTouches = [touchObj];
    }

    // Create the normalized event object that mimics GestureResponderEvent
    const normalizedEvent = {
        nativeEvent,
        target: event?.target || null,
        currentTarget: event?.currentTarget || null,
        eventPhase: event?.eventPhase || 0,
        bubbles: event?.bubbles || false,
        cancelable: event?.cancelable || false,
        timeStamp: event?.timeStamp || Date.now(),
        defaultPrevented: event?.defaultPrevented || false,
        isDefaultPrevented: () => event?.defaultPrevented || false,
        isPropagationStopped: () => false,
        persist: () => { },
        preventDefault: () => {
            if (typeof event?.preventDefault === 'function') {
                event.preventDefault();
            }
        },
        stopPropagation: () => {
            if (typeof event?.stopPropagation === 'function') {
                event.stopPropagation();
            }
        },
        type: event?.type || '',
    } as any as GestureResponderEvent;
    return normalizedEvent;
}

