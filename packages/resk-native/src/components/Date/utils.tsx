import { Button, IButtonProps } from "@components/Button";
import { defaultStr } from "@resk/core";
import isValidElement from "@utils/isValidElement";
import { GestureResponderEvent, StyleSheet } from "react-native";
import { ICalendarBaseProps } from "./types";
import { Surface } from "@components/Surface";
import View from "@components/View";
import { Divider } from "@components/Divider";
import { SwipeGestureHandler } from "@components/Gesture";
import { Icon } from "@components/Icon";

export function renderCalendar({ testID, children, navigateToNext, borderRadius, navigateToPrevious, renderNavigationButtons, footer, header, displayViewToggleButton, ...props }: ICalendarBaseProps & { testID?: string, renderNavigationButtons?: boolean, displayViewToggleButton?: IButtonProps | JSX.Element | false, children: JSX.Element, footer?: JSX.Element, navigateToNext?: (event?: GestureResponderEvent) => void, navigateToPrevious?: (event?: GestureResponderEvent) => void, header?: JSX.Element, }) {
    testID = defaultStr(testID, "resk-calendar");
    const isValidHeader = isValidElement(header);
    const canDisplayHeader = isValidHeader || renderNavigationButtons !== false || displayViewToggleButton !== false;
    if (typeof displayViewToggleButton === "boolean") {
        displayViewToggleButton = {};
    }
    borderRadius = typeof borderRadius === "number" ? borderRadius : 0;
    const canSwipe = typeof navigateToNext === "function" || typeof navigateToPrevious === "function";
    return <Surface elevation={5} {...props} testID={testID} style={[styles.calendar, { borderRadius }, props.style]}>
        <SwipeGestureHandler testID={testID + "-wipe-gesture"}
            disabled={!canSwipe}
            vertical={false}
            style={[styles.headerOrFooter, styles.swipeContainer]}
            onSwipe={({ direction, distance }) => {
                const cb = direction == "left" ? navigateToPrevious : direction == "right" ? navigateToNext : undefined;
                if (typeof cb === "function") {
                    cb();
                }
            }}
        >
            {canDisplayHeader ? <View testID={testID + "-header"} style={styles.headerOrFooter}>
                {isValidHeader ? <>
                    {header}
                    <Divider style={styles.headerDivider} />
                </> : null}
                {<View testID={`${testID}-header-content-container`} style={styles.headerContentContainer}>
                    {isValidElement(displayViewToggleButton) ? displayViewToggleButton : <Button compact
                        testID={testID + "-header-text"}
                        {...Object.assign({}, displayViewToggleButton)}
                        style={[styles.displayViewToggleButton, (displayViewToggleButton as any)?.style]}
                        containerProps={{ style: styles.headerButtonContainer }}
                    /> as any}
                    {renderNavigationButtons !== false ? <View testID={testID + "-header-arrow-container"} style={styles.headerArrowContainer}>
                        <Icon.Button
                            iconName="chevron-left"
                            size={ICON_SIZE}
                            testID={testID + "-header-arrow-left"}
                            onPress={(event) => {
                                if (typeof navigateToPrevious === "function") {
                                    navigateToPrevious(event);
                                }
                            }}
                        />
                        <Icon.Button
                            iconName="chevron-right"
                            size={ICON_SIZE}
                            testID={testID + "-header-arrow-right"}
                            onPress={(event) => {
                                if (typeof navigateToNext === "function") {
                                    navigateToNext(event);
                                }
                            }}
                        />
                    </View> : null}
                </View>}
            </View> : null}
            <View testID={testID + "-content"} style={[styles.headerOrFooter, styles.content]} >
                {isValidElement(children) ? children : null}
            </View>
            {footer ? <View testID={testID + "-footer"} style={styles.headerOrFooter}>
                {footer}
            </View> : null}
        </SwipeGestureHandler>
    </Surface>
}

const styles = StyleSheet.create({
    headerDivider: {
        width: "100%",
    },
    disabled: {
        opacity: 0.65,
    },
    content: {
        flexGrow: 1,
    },
    headerOrFooter: {
        width: "100%",
        position: "relative",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
    },
    swipeContainer: {
        flex: 1,
        flexGrow: 1,
    },
    displayViewToggleButton: {
    },
    headerButtonContainer: {
        marginHorizontal: 7,
    },
    headerContentContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
        width: "100%",
    },
    headerArrowContainer: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        justifyContent: "space-between",
        alignItems: "center",
    },
    calendar: {
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: "center",
        alignSelf: "center",
        padding: 10,
        flexGrow: 0,
        position: "relative",
    },
})

export const ICON_SIZE = 24;