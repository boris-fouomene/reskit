import { normalizeGestureEvent } from "./index";
import { GestureResponderEvent, PanResponderGestureState } from "react-native";

/**
 * Helper function to create a cross-platform pan responder
 * This approach ensures events are properly normalized between platforms
 */
/* export function createPanResponder(handlers: {
    onStart?: (event: GestureResponderEvent, gestureState?: PanResponderGestureState) => void;
    onMove?: (event: GestureResponderEvent, gestureState?: PanResponderGestureState) => void;
    onEnd?: (event: GestureResponderEvent, gestureState?: PanResponderGestureState) => void;
}) {
    // For tracking gesture state on web
    let gestureState: PanResponderGestureState = {
        dx: 0,
        dy: 0,
        moveX: 0,
        moveY: 0,
        vx: 0,
        vy: 0,
        x0: 0,
        y0: 0,
        numberActiveTouches: 0,
        _accountsForMovesUpTo: 0,
        stateID: 0
    };
    let startX = 0;
    let startY = 0;
    let lastMoveX = 0;
    let lastMoveY = 0;
    let lastMoveTime = 0;
    let isGestureActive = false;

    // Helper to update gesture state based on mouse/touch events
    function updateGestureState(event: MouseEvent | TouchEvent, isStart: boolean = false) {
        const currentX = 'touches' in event
            ? (event.touches[0] || event.changedTouches[0])?.pageX || 0
            : event.pageX;

        const currentY = 'touches' in event
            ? (event.touches[0] || event.changedTouches[0])?.pageY || 0
            : event.pageY;

        const currentTime = Date.now();

        if (isStart) {
            // Reset state for new gesture
            startX = currentX;
            startY = currentY;
            lastMoveX = currentX;
            lastMoveY = currentY;
            lastMoveTime = currentTime;
            gestureState = {
                dx: 0,
                dy: 0,
                moveX: currentX,
                moveY: currentY,
                vx: 0,
                vy: 0,
                x0: currentX,
                y0: currentY,
                numberActiveTouches: 'touches' in event ? event.touches.length : 1,
                _accountsForMovesUpTo: currentTime,
                stateID: Math.random()
            };
        } else {
            // Calculate velocity (in points per ms)
            const timeDelta = currentTime - lastMoveTime;
            const velocityX = timeDelta > 0 ? (currentX - lastMoveX) / timeDelta : 0;
            const velocityY = timeDelta > 0 ? (currentY - lastMoveY) / timeDelta : 0;

            // Update state
            gestureState = {
                ...gestureState,
                dx: currentX - startX,
                dy: currentY - startY,
                moveX: currentX,
                moveY: currentY,
                vx: velocityX,
                vy: velocityY,
                numberActiveTouches: 'touches' in event ? event.touches.length : 1,
                _accountsForMovesUpTo: currentTime
            };

            // Save last position for next velocity calculation
            lastMoveX = currentX;
            lastMoveY = currentY;
            lastMoveTime = currentTime;
        }

        return gestureState;
    }

    return {
        // For React Native
        panHandlers: {
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                handlers.onStart?.(evt, gestureState);
            },
            onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                handlers.onMove?.(evt, gestureState);
            },
            onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                handlers.onEnd?.(evt, gestureState);
            },
        },

        // For React Web
        webHandlers: {
            onMouseDown: (evt: MouseEvent) => {
                evt.preventDefault();
                isGestureActive = true;
                const state = updateGestureState(evt, true);
                handlers.onStart?.(normalizeGestureEvent(evt), state);

                // Add window listeners for move and up events
                const handleMouseMove = (moveEvt: MouseEvent) => {
                    if (!isGestureActive) return;
                    const state = updateGestureState(moveEvt);
                    handlers.onMove?.(normalizeGestureEvent(moveEvt), state);
                };

                const handleMouseUp = (upEvt: MouseEvent) => {
                    if (!isGestureActive) return;
                    isGestureActive = false;
                    const state = updateGestureState(upEvt);
                    handlers.onEnd?.(normalizeGestureEvent(upEvt), state);

                    // Clean up listeners
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                };

                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
            },

            onTouchStart: (evt: TouchEvent) => {
                isGestureActive = true;
                const state = updateGestureState(evt, true);
                handlers.onStart?.(normalizeGestureEvent(evt), state);

                // Add window listeners for move and end events
                const handleTouchMove = (moveEvt: TouchEvent) => {
                    if (!isGestureActive) return;
                    moveEvt.preventDefault(); // Prevent scrolling
                    const state = updateGestureState(moveEvt);
                    handlers.onMove?.(normalizeGestureEvent(moveEvt), state);
                };

                const handleTouchEnd = (endEvt: TouchEvent) => {
                    if (!isGestureActive) return;
                    isGestureActive = false;
                    const state = updateGestureState(endEvt);
                    handlers.onEnd?.(normalizeGestureEvent(endEvt), state);

                    // Clean up listeners
                    window.removeEventListener('touchmove', handleTouchMove);
                    window.removeEventListener('touchend', handleTouchEnd);
                    window.removeEventListener('touchcancel', handleTouchEnd);
                };

                window.addEventListener('touchmove', handleTouchMove, { passive: false });
                window.addEventListener('touchend', handleTouchEnd);
                window.addEventListener('touchcancel', handleTouchEnd);
            }
        },
    };
} */