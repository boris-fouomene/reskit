import React, { isValidElement, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, GestureResponderEvent, Animated, PanResponder } from "react-native";
import moment, { Moment } from "moment/min/moment-with-locales";
import { defaultStr, IMomentFormat, isEmpty } from "@resk/core";
import { ICalendarBaseProps, ICalendarDate, ICalendarDay, ICalendarDayProps, ICalendarDisplayView, ICalendarHour, ICalendarMonth, ICalendarMonthProps, ICalendarYear, ICalendarYearProps } from "./types";
import { Icon, IIconButtonProps } from "@components/Icon";
import Label from "@components/Label";
import { useI18n } from "@src/i18n/hooks";
import { DEFAULT_DATE_FORMATS } from "@resk/core";
import { TouchableRipple } from "@components/TouchableRipple";
import Theme, { Colors, ITheme, IThemeManager, useTheme } from "@theme/index";
import { Button, IButtonProps } from "@components/Button";
import { IStyle } from "@src/types";
import { Surface } from "@components/Surface";
import { Divider } from "@components/Divider";
import useStateCallback from "@utils/stateCallback";
import { SwipeGestureHandler } from "@components/Gesture";
import { Notify } from "@notify";

export default class Calendar {
    static getDefaultDateFormat(dateFormat?: IMomentFormat): IMomentFormat {
        return defaultStr(dateFormat, DEFAULT_DATE_FORMATS.date) as IMomentFormat;
    }
    /**
    * Generate the headers for a week based on the start day.
    * @param weekStartDay - The day of the week to start on (0 for Sunday, 1 for Monday, etc.).
    * @returns An array of 7 strings representing the week headers, e.g., ["Sun", "Mon", ...].
    */
    static generateWeekHeaders(weekStartDay: number = 0): string[] {
        weekStartDay = typeof weekStartDay === 'number' && (weekStartDay >= 0 && weekStartDay <= 6) ? weekStartDay : 0;
        const daysOfWeek = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        return [...daysOfWeek.slice(weekStartDay), ...daysOfWeek.slice(0, weekStartDay)];
    }
    // Generate a calendar matrix for a month
    static generateDayView(dateCursor?: ICalendarDate, weekStartDay: number = 0, minDate?: ICalendarDate, maxDate?: ICalendarDate, defaultValue?: ICalendarDate): ICalendarDay[][] {
        const momentDateCursor = moment(dateCursor);
        const startOfMonth = momentDateCursor.startOf('month');
        const endOfMonth = moment(momentDateCursor).endOf('month');
        const startDayOfWeek = startOfMonth.day();
        const matrixDateCursor = moment(startOfMonth).subtract((startDayOfWeek - weekStartDay + 7) % 7, 'days');
        const defaultValueMoment = defaultValue ? moment(defaultValue) : undefined;
        const calendarMatrix: ICalendarDay[][] = [];
        const currentDate = matrixDateCursor.clone();
        const momentMaxDate = maxDate ? moment(maxDate) : undefined;
        const momentMinDate = minDate ? moment(minDate) : undefined;
        for (let week = 0; week < 6; week++) {
            const weekRow: ICalendarDay[] = [];
            for (let day = 0; day < 7; day++) {
                const isCurrentDateValid = !(momentMinDate && momentMinDate.isAfter(currentDate, "day") || momentMaxDate && momentMaxDate.isBefore(currentDate, "day"))
                const isDefaultValue = defaultValueMoment && defaultValueMoment.isSame(currentDate, 'day') || false;
                const inCurrentMonth = currentDate.isSameOrAfter(startOfMonth, 'day') && currentDate.isSameOrBefore(endOfMonth, 'day');
                weekRow.push({
                    day: currentDate.date(),
                    isDefaultValue,
                    value: currentDate.toDate(),
                    isToday: currentDate.isSame(moment(), "day"),
                    date: currentDate.clone(),
                    dayStr: currentDate.format('DD'),
                    shortName: currentDate.format('ddd'),
                    longName: currentDate.format('dddd'),
                    disabled: !inCurrentMonth || !isCurrentDateValid,
                    //dateStr: currentDate.format(this.props.dateFormat),
                    monthYear: currentDate.format("MMMM YYYY"),
                    month: currentDate.format("MM"),
                    year: currentDate.format("YY"),
                    shortDate: currentDate.format("L"),
                    shortDateTime: currentDate.format()
                });
                currentDate.add(1, 'day');
            }
            calendarMatrix.push(weekRow);
        }
        return calendarMatrix;
    }
    /**
     * Generate a 4x4 matrix of months for a given year.
     * @returns A matrix of months with their statuses.
     */
    static generateMonthView(minDate?: ICalendarDate, maxDate?: ICalendarDate): ICalendarMonth[][] {
        const allMonths = moment.monthsShort();//example : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthMatrix: ICalendarMonth[][] = [];
        const rows = Math.ceil(16 / 4); // 4 columns, so calculate rows
        for (let row = 0; row < rows; row++) {
            const monthRow: ICalendarMonth[] = [];
            for (let col = 0; col < 4; col++) {
                const monthIndex = row * 4 + col;
                if (monthIndex >= 16) break;
                monthRow.push({
                    monthName: allMonths[monthIndex % 12], // Use modulo for 16 months
                    monthIndex,
                    disabled: row >= 3,
                    month: monthIndex
                });
            }
            monthMatrix.push(monthRow);
        }
        return monthMatrix;
    }
    static getYearsBoundaries(minDate?: ICalendarDate): { start: number, end: number } {
        const startYear = moment(minDate).toDate().getFullYear();
        const start = Math.max(startYear - 10, 0);
        return {
            start,
            end: start + 15,
        }
    }

    static generateYearView(minDate?: ICalendarDate, maxDate?: ICalendarDate): ICalendarYear[][] {
        const { start: startYear, end: endYear } = Calendar.getYearsBoundaries(minDate);
        const years: ICalendarYear[][] = [];
        const numRows = 4; // Display 4 years per row
        for (let row = 0; row < numRows; row++) {
            const yearRow: ICalendarYear[] = [];
            for (let col = 0; col < 4; col++) {
                const year = startYear + row * 4 + col;
                yearRow.push({
                    year,
                });
            }
            years.push(yearRow);
        }
        return years;
    }

    // Generate hour view for a specific day
    static generateHourView(date?: ICalendarDate): ICalendarHour[] {
        const currentDate = moment(); // Current time
        const momentDate = moment(date);
        const isToday = momentDate.isSame(currentDate, 'day');
        const hourView: ICalendarHour[] = [];
        for (let i = 0; i < 24; i++) {
            const hourMoment = momentDate.clone().hour(i).minute(0).second(0);
            hourView.push({
                hour: i,
                label: hourMoment.format('h A'), // Format hour (e.g., "12 AM", "1 PM")
                disabled: isToday && hourMoment.isBefore(currentDate),
            });
        }
        return hourView;
    }
    static Day: React.FC<ICalendarDayProps> = ({ weekStartDay, header, ...props }) => {
        const theme = useTheme();
        const testID = defaultStr(props.testID, "resk-calendar-day-view");
        const { momentMaxDate, momentMinDate, dateCursor, isValidSelection, i18n, locale, setState, navigateToNext, navigateToPrevious, dateFormat, state, momentDefaultValue } = useCommon(props, "day");
        const { displayView } = state;
        const { dayView, dayHeaders } = useMemo(() => {
            return {
                dayView: Calendar.generateDayView(dateCursor.toDate(), weekStartDay, state.minDate, state.maxDate, state.defaultValue),
                dayHeaders: Calendar.generateWeekHeaders(weekStartDay)
            };
        }, [state.minDate, state.defaultValue, state.maxDate, weekStartDay, dateCursor]);
        const toDayStr = moment().format(dateFormat);
        const defaultValueStr = momentDefaultValue?.format(dateFormat) || "";
        const yearBoundaries = displayView === "year" ? Calendar.getYearsBoundaries(dateCursor.toDate()) : undefined;
        return Calendar.renderCalendar({
            ...props,
            testID,
            header: <>
                {isValidElement(header) ? header : null}
                <View testID={testID + "-header-title"} style={Styles.dayViewHeader}>
                    <Button compact tooltip={`${i18n.t("dates.today")}: ${toDayStr}`}
                        disabled={!isValidSelection(moment().toDate())}
                        onPress={() => {
                            setState({
                                ...state,
                                dateCursor: moment(),
                            });
                        }}
                    >
                        {toDayStr}
                    </Button>
                    {defaultValueStr ? <Button compact tooltip={`${i18n.t("dates.selectedDate")}: ${defaultValueStr}`}
                        right={<Icon.Font name="material-clear" size={20} color={theme.colors.error}
                            onPress={(e) => {
                                setState({
                                    ...state,
                                    defaultValue: undefined,
                                    dateCursor: moment(),
                                });
                            }}
                        />}
                    >
                        {defaultValueStr}
                    </Button> : null}
                </View>
            </>,
            displayViewToggleButton: props.renderToggleDisplayViewButton === false ? false : {
                label: displayView == "year" ? `${yearBoundaries?.start} - ${yearBoundaries?.end}` : displayView == "month" ? dateCursor.format("YYYY") : dateCursor.format("MMMM YYYY"),
                disabled: displayView === "year",
                onPress: () => {
                    setState({ ...state, displayView: displayView === "month" ? "year" : "month" })
                },
                right: <Icon.Font name="chevron-down" size={20} color={theme.colors.primary} />
            },
            navigateToNext,
            navigateToPrevious,
            children: <>
                {displayView == "month" ? <Calendar.Month
                    minDate={momentMinDate?.toDate()}
                    maxDate={momentMaxDate?.toDate()}
                    defaultValue={dateCursor.toDate()}
                    renderNavigationButtons={false}
                    renderToggleDisplayViewButton={false}
                    elevation={0}
                    onChange={(data) => {
                        const newDateCursor = moment(dateCursor).month(data.month);
                        if (!isValidSelection(newDateCursor.toDate())) {
                            Notify.error(i18n.t("outOfRange", { date: newDateCursor.toDate().toFormat(dateFormat) }));
                            return;
                        }
                        setState({
                            ...state,
                            dateCursor: newDateCursor.clone(),
                            displayView: "day",
                        });
                    }}
                />
                    : displayView === "year" ? <Calendar.Year
                        minDate={momentMinDate?.toDate()}
                        maxDate={momentMaxDate?.toDate()}
                        defaultValue={dateCursor.toDate()}
                        renderNavigationButtons={false}
                        renderToggleDisplayViewButton={false}
                        elevation={0}
                        onChange={(data) => {
                            const newDateCursor = dateCursor.year(data.year);
                            if (!isValidSelection(newDateCursor.toDate())) {
                                Notify.error(i18n.t("outOfRange", { date: newDateCursor.toDate().toFormat(dateFormat) }));
                                return;
                            }
                            setState({
                                ...state,
                                displayView: "month",
                                dateCursor: newDateCursor.clone(),
                            });
                        }}
                    />
                        : <>
                            <View testID={testID + "-headers-label-container"} style={Styles.calendarItemsContainer}>
                                <View testID={testID + "-headers-label"} style={Styles.calendarItemContainer}>
                                    {dayHeaders.map((day, index) => {
                                        return <View key={index} style={[Styles.calendarItem, Styles.calendarDayHeader]}>
                                            <Label style={Styles.calendarDayHeaderLabel} textBold>{day}</Label>
                                        </View>
                                    })}
                                </View>
                            </View>
                            {dayView.map((week, index) => {
                                const cTestID = `${testID}-${index}`;
                                return <View testID={cTestID + "-container"} key={index} style={Styles.calendarItemsContainer}>
                                    <View testID={cTestID} key={index} style={Styles.calendarItemContainer}>
                                        {week.map((day, index) => {
                                            //const isDefault = defaultToCheck && (day.day === defaultToCheck.date());
                                            return this.renderViewItem({
                                                isActive: day.isToday,
                                                theme,
                                                isDefaultValue: day.isDefaultValue,
                                                disabled: !!day.disabled,
                                                testID: cTestID + "-day-" + index,
                                                label: String(day.day),
                                                key: day.day,
                                                onPress: () => {
                                                    if (typeof props.onChange === "function") {
                                                        props.onChange(day);
                                                    }
                                                },
                                            });
                                        })}
                                    </View>
                                </View>;
                            })}
                        </>
                }
            </>
        });
    }
    static Month: React.FC<ICalendarMonthProps> = (props: ICalendarMonthProps) => {
        const theme = useTheme();
        const { state, setState, momentMinDate, dateCursor, momentMaxDate, momentDefaultValue, navigateToNext, navigateToPrevious } = useCommon(props, "month");
        const monthView = useMemo(() => {
            return Calendar.generateMonthView(state.minDate, state.maxDate);
        }, [state.minDate, state.maxDate, state.dateCursor]);
        const { displayView } = state;
        const testID = defaultStr(props?.testID, "resk-calendar-month-view");
        const currentMonth = moment().month();
        const isCurrentYear = moment().year() === dateCursor.year();
        const yearBoundaries = displayView === "year" ? Calendar.getYearsBoundaries(dateCursor.toDate()) : undefined;
        return Calendar.renderCalendar({
            testID,
            navigateToNext,
            navigateToPrevious,
            ...props,
            displayViewToggleButton: props.renderToggleDisplayViewButton === false ? false : {
                label: displayView == "year" ? `${yearBoundaries?.start} - ${yearBoundaries?.end}` : dateCursor.format("YYYY"),
                disabled: displayView === "year",
                onPress: () => {
                    setState({ ...state, displayView: displayView === "month" ? "year" : "month" })
                },
                right: <Icon.Font name="chevron-down" size={20} color={theme.colors.primary} />
            },
            children: <>
                {displayView == "year" ? <Calendar.Year
                    minDate={momentMinDate?.toDate()}
                    maxDate={momentMaxDate?.toDate()}
                    defaultValue={dateCursor.toDate()}
                    renderNavigationButtons={false}
                    renderToggleDisplayViewButton={false}
                    elevation={0}
                    onChange={(data) => {
                        setState({
                            ...state,
                            displayView: "month",
                            dateCursor: dateCursor.year(data.year).clone()
                        });
                    }}
                /> : <>
                    {monthView.map((months, index) => {
                        const cTestID = `${testID}-${index}`;
                        return <View testID={cTestID + "-container"} key={index} style={Styles.calendarItemsContainer}>
                            <View testID={cTestID} key={index} style={Styles.calendarItemContainer}>
                                {months.map((data, index) => {
                                    return this.renderViewItem({
                                        isActive: isCurrentYear && data.month === currentMonth,
                                        disabled: false,
                                        theme,
                                        testID: cTestID + "-month-" + index,
                                        label: String(data.monthName),
                                        size: 80,
                                        margin: 9,
                                        key: data.month,
                                        style: [Styles.calendarYearItem, data.disabled && Styles.disabled],
                                        onPress: () => {
                                            if (typeof props?.onChange === "function") {
                                                props?.onChange(data);
                                            }
                                        },
                                    });
                                })}
                            </View>
                        </View>;
                    })}
                </>}
            </>
        });
    };
    static Year: React.FC<ICalendarYearProps> = (props) => {
        const theme = useTheme();
        const { setState, state, navigateToNext, navigateToPrevious } = useCommon(props, "year");
        const yearView = useMemo(() => {
            return Calendar.generateYearView(state?.minDate, state.maxDate);
        }, [state?.minDate, state.maxDate]);
        const { start, end } = Calendar.getYearsBoundaries(state.minDate);
        const testID = defaultStr(props?.testID, "resk-calendar-year-view");
        const currentYear = new Date().getFullYear();
        return Calendar.renderCalendar({
            testID,
            ...props,
            navigateToNext,
            navigateToPrevious,
            displayViewToggleButton: props.renderToggleDisplayViewButton === false ? false : {
                label: `${start} - ${end}`,
                disabled: true,
            },
            children: <>
                {yearView.map((years, index) => {
                    const cTestID = `${testID}-${index}`;
                    return <View testID={cTestID + "-container"} key={index} style={Styles.calendarItemsContainer}>
                        <View testID={cTestID} key={index} style={Styles.calendarItemContainer}>
                            {years.map((data, index) => {
                                return this.renderViewItem({
                                    isActive: currentYear === data.year,
                                    disabled: false,
                                    theme,
                                    testID: cTestID + "-year-" + index,
                                    label: String(data.year),
                                    key: data.year,
                                    size: 80,
                                    margin: 9,
                                    style: Styles.calendarYearItem,
                                    onPress: () => {
                                        if (typeof props?.onChange === "function") {
                                            props?.onChange(data);
                                        }
                                    },
                                });
                            })}
                        </View>
                    </View>;
                })}
            </>,
        });
    }
    static getIconSize(): number {
        return 24;
    }
    private static renderViewItem({ isActive, isDefaultValue, theme, size, margin, disabled, onPress, label, testID, key, style }: { style?: IStyle, margin?: number, isActive: boolean, onPress: (e: GestureResponderEvent) => void, isDefaultValue?: boolean, disabled: boolean, theme?: IThemeManager, size?: number, testID: string, label: string, key: number | string }) {
        theme = (theme || Theme) as IThemeManager;
        margin = typeof margin === "number" && margin || 8;
        size = typeof size == "number" && size || 40;
        const color = isDefaultValue ? theme.colors.primary : isActive ? theme.colors.onPrimary : undefined;
        const backgroundColor = isDefaultValue ? theme.colors.onPrimary : isActive ? theme.colors.primary : undefined;
        const borderColor = isDefaultValue ? theme.colors.primary : undefined;
        return (
            <TouchableRipple
                testID={testID}
                key={key}
                disabled={disabled}
                onPress={onPress}
                hoverColor={backgroundColor ? Colors.setAlpha(backgroundColor, 0.2) : undefined}
                style={[
                    Styles.calendarItem,
                    color && { color },
                    backgroundColor && { backgroundColor },
                    borderColor && { borderColor, borderWidth: 1 },
                    , { width: size, height: size, marginHorizontal: margin, marginVertical: margin },

                    , style,
                ]}
            >
                <Label textBold={isDefaultValue} color={color} disabled={disabled} testID={testID + "-label"}>
                    {label}
                </Label>
            </TouchableRipple>
        );
    }
    static renderCalendar({ testID, children, navigateToNext, navigateToPrevious, renderNavigationButtons, footer, header, displayViewToggleButton, ...props }: ICalendarBaseProps & { testID?: string, renderNavigationButtons?: boolean, displayViewToggleButton?: IButtonProps | JSX.Element | false, children: JSX.Element, footer?: JSX.Element, navigateToNext?: (event?: GestureResponderEvent) => void, navigateToPrevious?: (event?: GestureResponderEvent) => void, header?: JSX.Element }) {
        testID = defaultStr(testID, "resk-calendar");
        const isValidHeader = isValidElement(header);
        const canDisplayHeader = isValidHeader || renderNavigationButtons !== false || displayViewToggleButton !== false;
        if (typeof displayViewToggleButton === "boolean") {
            displayViewToggleButton = {};
        }
        const canSwipe = typeof navigateToNext === "function" || typeof navigateToPrevious === "function";
        return <Surface elevation={5} {...props} testID={testID} style={[Styles.calendar, props.style]}>
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
                    />}
                    {renderNavigationButtons !== false ? <View testID={testID + "-header-arrow-container"} style={Styles.headerArrowContainer}>
                        <Icon.Button
                            iconName="chevron-left"
                            size={Calendar.getIconSize()}
                            testID={testID + "-header-arrow-left"}
                            onPress={(event) => {
                                if (typeof navigateToPrevious === "function") {
                                    navigateToPrevious(event);
                                }
                            }}
                        />
                        <Icon.Button
                            iconName="chevron-right"
                            size={Calendar.getIconSize()}
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
                style={Styles.swipeGesture}
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
}
const Styles = StyleSheet.create({
    headerDivider: {
        width: "100%",
    },
    swipeGesture: {

    },
    dayViewHeader: {
        width: "100%",
        paddingHorizontal: 7,
        paddingVertical: 7,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    disabled: {
        opacity: 0.65,
    },
    content: {
        flexDirection: "column",
    },
    calendarItemsContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    calendarDayHeader: {},
    calendarDayHeaderLabel: {
        fontSize: 15
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
    },
    headerArrowContainer: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        justifyContent: "space-between",
        alignItems: "center",
    },
    calendarItemContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "center",
    },
    calendarItem: {
        flexBasis: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        alignSelf: "center",
        borderRadius: "50%",
        marginHorizontal: 8,
        marginVertical: 8,
        width: 40,
        height: 40,
    },
    calendarYearItem: {

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
    dateComponentYearText: {
        fontSize: 20
    },
    dateComponentDateView: {
        flex: 1, flexDirection: "row", marginTop: 10
    }
})

const areEquals = (a: any, b: any) => {
    const isAe = isEmpty(a), isBe = isEmpty(b);
    if (isAe && isBe) return true;
    if (isAe && !isBe) return false;
    if (!isAe && isBe) return false;
    return moment(a, "day").isSame(moment(b, "day"));
}
type ICalendarCommonState = {
    minDate?: ICalendarDate, maxDate?: ICalendarDate, defaultValue?: ICalendarDate, displayView?: ICalendarDisplayView
    dateCursor: Moment,
};
function useCommon(props: ICalendarBaseProps, displayView?: ICalendarDisplayView) {
    const i18n = useI18n();
    const i18nLocale = i18n.getLocale();
    const locale = defaultStr(props?.locale, i18n.getLocale());
    const [state, setState] = useStateCallback<ICalendarCommonState>({
        minDate: props.minDate,
        maxDate: props.maxDate,
        defaultValue: props.defaultValue,
        displayView,
        dateCursor: moment(props.defaultValue),
    });
    useMemo(() => {
        if (i18nLocale === locale) return;
        moment.locale(locale);
    }, [locale, i18nLocale]);
    const momentMaxDate = useMemo(() => {
        return state?.maxDate ? moment(state?.maxDate) : undefined;
    }, [state?.maxDate]);
    const momentMinDate = useMemo(() => {
        return state?.minDate ? moment(state?.minDate) : undefined;
    }, [state?.minDate]);
    const momentDefaultValue = useMemo(() => {
        return state?.defaultValue ? moment(state?.defaultValue) : undefined;
    }, [state?.defaultValue]);
    const dateFormat = defaultStr(props?.dateFormat, DEFAULT_DATE_FORMATS.date) as IMomentFormat;
    useEffect(() => {
        const newState = { ...state };
        const hasUpdate = !areEquals(props?.minDate, newState.minDate) || !areEquals(props?.maxDate, newState.maxDate) || (!areEquals(props?.defaultValue, state.defaultValue));
        if (!areEquals(props?.minDate, state.minDate)) {
            newState.minDate = props?.minDate;
        }
        if (!areEquals(props?.maxDate, state.maxDate)) {
            newState.maxDate = props?.maxDate;
        }
        if (!areEquals(props?.defaultValue, state.defaultValue)) {
            newState.defaultValue = props?.defaultValue;
            newState.dateCursor = moment(props?.defaultValue);
        }
        if (hasUpdate) {
            setState(newState);
        }
    }, [props?.minDate, props?.maxDate, props?.defaultValue]);
    const { dateCursor } = state;
    return {
        i18n,
        locale,
        dateFormat,
        momentMinDate,
        momentMaxDate,
        momentDefaultValue,
        dateCursor,
        state,
        setState,
        isValidSelection: (date: Date) => {
            const momentDate = moment(date);
            if (momentMinDate && momentMinDate.isAfter(momentDate, "day")) return false;
            if (momentMaxDate && momentMaxDate.isBefore(momentDate, "day")) return false;
            return true;
        },
        navigateToNext: (event?: GestureResponderEvent) => {
            let newDateCursor = dateCursor;
            switch (state.displayView) {
                case "year":
                    const { end } = Calendar.getYearsBoundaries(dateCursor.toDate());
                    newDateCursor = dateCursor.year(end);
                    break;
                case "month":
                    newDateCursor = dateCursor.add(1, 'year');
                    break;
                default:
                    newDateCursor = dateCursor.add(1, 'month');
                    break;
            }
            setState({
                ...state,
                dateCursor: newDateCursor.clone()
            });
        },
        navigateToPrevious: (event?: GestureResponderEvent) => {
            const newDateCursor = dateCursor.clone();
            switch (state.displayView) {
                case "year":
                    const { start: startBoundary } = Calendar.getYearsBoundaries(dateCursor.toDate());
                    newDateCursor.year(startBoundary);
                    break;
                case "month":
                    newDateCursor.subtract(1, 'year');
                    break;
                default:
                    newDateCursor.subtract(1, 'month');
                    break;
            }
            setState({
                ...state,
                dateCursor: newDateCursor
            });
        }
    }
}
