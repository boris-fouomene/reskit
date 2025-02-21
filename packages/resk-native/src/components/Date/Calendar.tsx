import React, { createContext, ReactNode, useContext, useEffect, useImperativeHandle, useMemo } from "react";
import { View, StyleSheet, GestureResponderEvent } from "react-native";
import moment from "moment";
import { defaultStr, I18n, IMomentFormat, isEmpty } from "@resk/core";
import { ICalendarBaseProps, ICalendarDate, CalendarModalContext, ICalendarDay, ICalendarDayViewProps, ICalendarDisplayView, ICalendarHour, ICalendarModalDayViewProps, ICalendarMonth, ICalendarMonthViewProps, ICalendarYear, ICalendarYearViewProps, ICalendarContext, ICalendarState } from "./types";
import { Icon } from "@components/Icon";
import Label from "@components/Label";
import { useI18n } from "@src/i18n/hooks";
import { DEFAULT_DATE_FORMATS } from "@resk/core";
import { TouchableRipple } from "@components/TouchableRipple";
import Theme, { Colors, IThemeManager, useTheme } from "@theme/index";
import { IStyle } from "@src/types";
import useStateCallback from "@utils/stateCallback";
import { Notify } from "@notify";
import { IModalProps, Modal, useModal } from '@components/Modal';
import { useDimensions } from "@dimensions/index";
import { renderCalendar } from "./utils";

export default class Calendar {
    static Context: React.Context<ICalendarContext> = createContext<ICalendarContext>({} as ICalendarContext);
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
    static getYearsBoundaries(minDate?: ICalendarDate): { start: number, startDate: Date, end: number, endDate: Date } {
        const startYear = moment(minDate).toDate().getFullYear();
        const start = Math.max(startYear - 10, 0);
        const end = start + 15;
        return {
            start,
            startDate: moment(minDate).toDate(),
            end,
            endDate: moment(minDate).add(15, 'year').toDate()
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
    /***
        Generate a 7x7 matrix of days for a given month.
        @param {ICalendarDayViewProps} props - Props for the CalendarDay component.
        @returns {ReactNode} A Calendar with a 7x7 matrix of days.
    */
    static DayView(props: ICalendarDayViewProps) {
        return <CalendarWithContext displayView="day" {...props}>
            <CalendarDayView />
        </CalendarWithContext>
    }
    static ModalDayView = React.forwardRef(({ modalProps, testID, ...props }: ICalendarModalDayViewProps, ref: React.ForwardedRef<CalendarModalContext>) => {
        testID = defaultStr(testID, "resk-calendar-modal-dayview");
        modalProps = Object.assign({}, modalProps);
        return <Calendar.Modal
            testID={testID + "-modal"}
            responsive
            dismissable={false}
            pureModal
            {...modalProps}
            children={<Calendar.DayView {...props} testID={testID} />}
            ref={ref}
        />
    });
    /***
    * Generate a calendar matrix for a month
    * @param {ICalendarMonthViewProps} props - The props for the calendar month view.
    * @returns {React.ReactNode} - The rendered calendar month view.
    */
    static MonthView(props: ICalendarMonthViewProps) {
        return <CalendarWithContext displayView="month" {...props}>
            <CalendarMonthView />
        </CalendarWithContext>
    };
    /****
        Generate a calendar matrix for a year
        @param {ICalendarYearViewProps} props - The props for the calendar year view.
        @returns {React.ReactNode} - The rendered calendar year view.
    */
    static YearView(props: ICalendarYearViewProps) {
        return <CalendarWithContext displayView="year" {...props}>
            <CalendarYearView />
        </CalendarWithContext>
    }
    static getIconSize(): number {
        return 24;
    }
    static Modal = React.forwardRef(({ children, ...props }: IModalProps, ref: React.Ref<CalendarModalContext>) => {
        const [visible, setVisible] = useStateCallback(false);
        const context = {
            open: (cb?: () => void) => {
                setVisible(true, cb);
            },
            close: (cb?: () => void) => {
                setVisible(false, cb);
            },
        }
        useImperativeHandle(ref, () => context);
        return <Modal
            fullScreen
            dismissable={false}
            {...props}
            visible={visible}
            children={<ModalChildren {...props} children={children as ReactNode} />}
        />
    });
}
const Styles = StyleSheet.create({
    disabled: {
        opacity: 0.65,
    },
    calendarItemsContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    calendarDayHeader: {},
    calendarDayHeaderLabel: {
        fontSize: 15
    },
    calendarItemContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "center",
        flex: 1,
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
        aspectRatio: 1, // Ensures height = width automatically
    },
    calendarYearItem: {

    },
})

const areEquals = (a: any, b: any) => {
    const isAe = isEmpty(a), isBe = isEmpty(b);
    if (isAe && isBe) return true;
    if (isAe && !isBe) return false;
    if (!isAe && isBe) return false;
    return moment(a, "day").isSame(moment(b, "day"));
}

export function useCalendar<T extends ICalendarBaseProps = ICalendarBaseProps>(): ICalendarContext<T> {
    const context = useContext(Calendar.Context);
    return Object.assign({}, context) as ICalendarContext<T>;
}

function CalendarWithContext<T extends ICalendarBaseProps = ICalendarBaseProps>({ children, displayView, ...props }: T & { displayView: ICalendarDisplayView }) {
    const i18n = useI18n();
    const i18nLocale = i18n.getLocale();
    const locale = defaultStr(props?.locale, i18n.getLocale());
    const [state, setState] = useStateCallback<ICalendarState>({
        minDate: props.minDate,
        maxDate: props.maxDate,
        defaultValue: props.defaultValue,
        displayView,
        dateCursor: moment(props.defaultValue),
    });
    useMemo(() => {
        I18n.setMomentLocale(locale);
        //moment.locale(locale, I18n.getMomentLocale(locale));
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
    return <Calendar.Context.Provider value={{
        ...props,
        i18n,
        locale,
        dateFormat,
        momentMinDate,
        momentMaxDate,
        momentDefaultValue,
        dateCursor,
        state,
        setState,
        isValidItem: (date: Date) => {
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
    }}>
        {children}
    </Calendar.Context.Provider>
}
CalendarWithContext.displayName = "Calendar.WithContext";

const CALENDAR_ITEMS_SIZE = 392;
const CalendarItemContainerContext = createContext<{
    itemsCount: number;
    screenWidth: number;
    screenHeight: number;
}>({
    itemsCount: 1,
    screenWidth: 0,
    screenHeight: 0,
});

const CalendarItemContainer = ({ children, testID }: { children: ReactNode, testID: string }) => {
    const itemsCount = Array.isArray(children) ? children.length : 1;
    const { width: screenWidth, height: screenHeight } = useDimensions();
    const itemsSize = Math.min(screenWidth * 90 / 100, CALENDAR_ITEMS_SIZE);
    return <CalendarItemContainerContext.Provider value={{ itemsCount, screenWidth, screenHeight }}>
        <View testID={testID + "-container"} style={[Styles.calendarItemsContainer]}>
            <View testID={testID + "-contentContainer"} style={[Styles.calendarItemContainer, { width: itemsSize }]}>
                {children}
            </View>
        </View>
    </CalendarItemContainerContext.Provider>
}
CalendarItemContainer.displayName = "Calendar.ItemContainer";
interface ICalendarItemProps { style?: IStyle, isCurrent: boolean, onPress: (e: GestureResponderEvent) => void, isDefaultValue?: boolean, disabled: boolean, theme?: IThemeManager, testID: string, label: string }
const CalendarItem = ({ isCurrent, isDefaultValue, theme, disabled, onPress, label, testID, style }: ICalendarItemProps) => {
    theme = (theme || Theme) as IThemeManager;
    const selectedBackgroundColor = theme.colors.primary;
    const color = isDefaultValue ? theme.colors.onPrimary : undefined;
    const backgroundColor = isDefaultValue ? selectedBackgroundColor : undefined;
    const borderColor = isDefaultValue || isCurrent ? selectedBackgroundColor : undefined;
    return (
        <TouchableRipple
            testID={testID}
            disabled={disabled}
            onPress={onPress}
            hoverColor={Colors.setAlpha(selectedBackgroundColor, 0.4)}
            style={[
                Styles.calendarItem,
                color && { color },
                backgroundColor && { backgroundColor },
                borderColor && { borderColor, borderWidth: 1 },
                //{ width: itemSize, height: itemSize, marginHorizontal: itemMargin, marginVertical: itemMargin },
                style,
            ]}
        >
            <Label textBold={isDefaultValue} color={color} disabled={disabled} testID={testID + "-label"}>
                {label}
            </Label>
        </TouchableRipple>
    );
}
CalendarItem.displayName = "Calendar.Item";

const CalendarDayView: React.FC = () => {
    const theme = useTheme();
    const { momentMaxDate, testID: customTestID, weekStartDay, header, momentMinDate, dateCursor, isValidItem, i18n, locale, setState, navigateToNext, navigateToPrevious, dateFormat, state, momentDefaultValue, ...props } = useCalendar<ICalendarDayViewProps>();
    const testID = defaultStr(customTestID, "resk-calendar-day-view");

    const { displayView } = state;
    const { dayView, dayHeaders } = useMemo(() => {
        return {
            dayView: Calendar.generateDayView(dateCursor.toDate(), weekStartDay, state.minDate, state.maxDate, state.defaultValue),
            dayHeaders: Calendar.generateWeekHeaders(weekStartDay)
        };
    }, [state.minDate, state.defaultValue, state.maxDate, weekStartDay, state.dateCursor, dateCursor, locale]);
    const toDayStr = moment().format(dateFormat);
    const defaultValueStr = momentDefaultValue?.format(dateFormat) || "";
    const yearBoundaries = displayView === "year" ? Calendar.getYearsBoundaries(dateCursor.toDate()) : undefined;
    return renderCalendar({
        ...props,
        testID,
        header,
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
            {displayView == "month" ? <Calendar.MonthView
                minDate={momentMinDate?.toDate()}
                maxDate={momentMaxDate?.toDate()}
                defaultValue={dateCursor.toDate()}
                renderNavigationButtons={false}
                renderToggleDisplayViewButton={false}
                elevation={0}
                onChange={(data) => {
                    const newDateCursor = moment(dateCursor).month(data.month);
                    if (!isValidItem(newDateCursor.toDate())) {
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
                : displayView === "year" ? <Calendar.YearView
                    minDate={momentMinDate?.toDate()}
                    maxDate={momentMaxDate?.toDate()}
                    defaultValue={dateCursor.toDate()}
                    renderNavigationButtons={false}
                    renderToggleDisplayViewButton={false}
                    elevation={0}
                    onChange={(data) => {
                        const newDateCursor = dateCursor.year(data.year);
                        if (!isValidItem(newDateCursor.toDate())) {
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
                        <CalendarItemContainer testID={testID + "-headers-label"}>
                            {dayHeaders.map((day, index) => {
                                return <View key={index} style={[Styles.calendarItem, Styles.calendarDayHeader]}>
                                    <Label style={Styles.calendarDayHeaderLabel} textBold>{day}</Label>
                                </View>
                            })}
                        </CalendarItemContainer>
                        {dayView.map((week, index) => {
                            const cTestID = `${testID}-${index}`;
                            return <CalendarItemContainer testID={cTestID} key={index}>
                                {week.map((day, index) => {
                                    //const isDefault = defaultToCheck && (day.day === defaultToCheck.date());
                                    return <CalendarItem
                                        key={day.day}
                                        {...{
                                            isCurrent: day.isToday,
                                            itemsCount: week.length,
                                            theme,
                                            isDefaultValue: day.isDefaultValue,
                                            disabled: !!day.disabled,
                                            testID: cTestID + "-day-" + index,
                                            label: String(day.day),
                                            onPress: () => {
                                                setState({
                                                    ...state,
                                                    defaultValue: day.value,
                                                    displayView: "day",
                                                }, () => {
                                                    if (typeof props.onChange === "function") {
                                                        props.onChange(day);
                                                    }
                                                });
                                            },
                                        }}
                                    />;
                                })}
                            </CalendarItemContainer>;
                        })}
                    </>
            }
        </>
    });
}
CalendarDayView.displayName = "Calendar.DayView";


const CalendarMonthView: React.FC<ICalendarMonthViewProps> = () => {
    const theme = useTheme();
    const { state, setState, defaultValue, momentDefaultValue, momentMinDate, dateCursor, momentMaxDate, locale, navigateToNext, navigateToPrevious, ...props } = useCalendar<ICalendarMonthViewProps>();
    const monthView = useMemo(() => {
        return Calendar.generateMonthView(state.minDate, state.maxDate);
    }, [state.minDate, state.maxDate, state.dateCursor, dateCursor, locale]);
    const { displayView } = state;
    const testID = defaultStr(props?.testID, "resk-calendar-month-view");
    const currentMonth = moment().month();
    const isCurrentYear = moment().year() === dateCursor.year();
    const yearBoundaries = displayView === "year" ? Calendar.getYearsBoundaries(dateCursor.toDate()) : undefined;
    return renderCalendar({
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
            {displayView == "year" ? <Calendar.YearView
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
                    return <CalendarItemContainer testID={cTestID} key={index}>
                        {months.map((data, index) => {
                            return <CalendarItem
                                key={data.month}
                                {...{
                                    itemsCount: months.length,
                                    isCurrent: isCurrentYear && data.month === currentMonth,
                                    //isDefaultValue: data.month === momentDefaultValue?.month() && dateCursor.year() === momentDefaultValue?.year(),
                                    disabled: false,
                                    theme,
                                    testID: cTestID + "-month-" + index,
                                    label: String(data.monthName),
                                    style: [Styles.calendarYearItem, data.disabled && Styles.disabled],
                                    onPress: () => {
                                        if (typeof props?.onChange === "function") {
                                            props?.onChange(data);
                                        }
                                    },
                                }}
                            />;
                        })}
                    </CalendarItemContainer>;
                })}
            </>}
        </>
    });
}
CalendarMonthView.displayName = "Calendar.MonthView";

const CalendarYearView: React.FC<ICalendarYearViewProps> = () => {
    const theme = useTheme();
    const { locale, dateCursor, state, momentDefaultValue, navigateToNext, navigateToPrevious, ...props } = useCalendar<ICalendarYearViewProps>();
    const yearView = useMemo(() => {
        const { startDate, endDate } = Calendar.getYearsBoundaries(dateCursor.toDate());
        const data = Calendar.generateYearView(startDate, endDate);
        return data;
    }, [state?.minDate, state.maxDate, locale, dateCursor]);
    const { start, end } = Calendar.getYearsBoundaries(state.minDate);
    const testID = defaultStr(props?.testID, "resk-calendar-year-view");
    const currentYear = new Date().getFullYear();
    return renderCalendar({
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
                return <CalendarItemContainer testID={cTestID} key={index}>
                    {years.map((data, index) => {
                        return <CalendarItem
                            key={data.year}
                            {...{
                                isCurrent: currentYear === data.year,
                                isDefaultValue: data.year === momentDefaultValue?.year(),
                                disabled: false,
                                theme,
                                testID: cTestID + "-year-" + index,
                                label: String(data.year),
                                itemsCount: years.length,
                                style: Styles.calendarYearItem,
                                onPress: () => {
                                    if (typeof props?.onChange === "function") {
                                        props?.onChange(data);
                                    }
                                },
                            }}
                        />
                    })}
                </CalendarItemContainer>;
            })}
        </>,
    });
}

CalendarYearView.displayName = "Calendar.YearView";

const ModalChildren: React.FC<{ children?: ReactNode }> = ({ children, ...props }) => {
    const modalContext = useModal();
    return <>{children}</>
};
ModalChildren.displayName = "Calendar.ModalChildren";

Calendar.Modal.displayName = "Calendar.Modal";
Calendar.ModalDayView.displayName = "Calendar.ModalDayView";