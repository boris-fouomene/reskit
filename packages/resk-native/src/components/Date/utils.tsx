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
    return <Surface elevation={5} {...props} testID={testID} style={[Styles.calendar, { borderRadius }, props.style]}>
        {canDisplayHeader ? <View testID={testID + "-header"} style={Styles.header}>
            {isValidHeader ? <>
                {header}
                <Divider style={Styles.headerDivider} />
            </> : null}
            {<View testID={`${testID}-header-content-container`} style={Styles.headerContentContainer}>
                {isValidElement(displayViewToggleButton) ? displayViewToggleButton : <Button compact
                    testID={testID + "-header-text"}
                    {...Object.assign({}, displayViewToggleButton)}
                    style={[Styles.displayViewToggleButton, (displayViewToggleButton as any)?.style]}
                    containerProps={{ style: Styles.headerButtonContainer }}
                /> as any}
                {renderNavigationButtons !== false ? <View testID={testID + "-header-arrow-container"} style={Styles.headerArrowContainer}>
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
        <SwipeGestureHandler testID={testID + "-wipe-gesture"}
            disabled={!canSwipe}
            vertical={false}
            onSwipe={({ direction, distance }) => {
                const cb = direction == "left" ? navigateToPrevious : direction == "right" ? navigateToNext : undefined;
                if (typeof cb === "function") {
                    cb();
                }
            }}
        >
            <View testID={testID + "-content"} style={Styles.content} >
                {isValidElement(children) ? children : null}
            </View>
        </SwipeGestureHandler>
        {footer ? <View testID={testID + "-footer"} style={Styles.footer}>
            {footer}
        </View> : null}
    </Surface>
}

const Styles = StyleSheet.create({
    headerDivider: {
        width: "100%",
    },
    disabled: {
        opacity: 0.65,
    },
    content: {
        flexDirection: "column",
    },
    header: {
        width: "100%",
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
    },
    headerArrowContainer: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footer: {
        width: "100%",
    },
    calendar: {
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: "center",
        alignSelf: "center",
        padding: 10,
    },
})

export const ICON_SIZE = 24;