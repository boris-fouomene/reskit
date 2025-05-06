import { createContext, useContext, useEffect, useImperativeHandle,Context, useMemo, FC, Ref } from "react";
import { View, StyleSheet, GestureResponderEvent } from "react-native";
import moment, { Moment } from "moment";
import { DateHelper, defaultStr, isEmpty, isNonNullString } from "@resk/core/utils";
import { I18nClass } from "@resk/core/i18n";
import { IMomentFormat } from "@resk/core/types"
import { ICalendarBaseProps, ICalendarDate, CalendarModalContext, ICalendarDayItem, ICalendarDayViewProps, ICalendarDisplayView, ICalendarHourItem, ICalendarModalDayViewProps, ICalendarMonthItem, ICalendarMonthViewProps, ICalendarYearItem, ICalendarYearViewProps, ICalendarContext, ICalendarState, ICalendarItem, ICalendarItemsContainerProps } from "./types";
import { Icon } from "@components/Icon";
import Label from "@components/Label";
import { useI18n } from "@src/i18n/hooks";
import { TouchableRipple } from "@components/TouchableRipple";
import { Colors, useTheme } from "@theme/index";
import { IViewStyle } from "@src/types";
import useStateCallback from "@utils/stateCallback";
import Notify from "@notify";
import { IModalProps, Modal, useModal } from '@components/Modal';
import { useDimensions } from "@dimensions/index";
import { ICON_SIZE, renderCalendar } from "./utils";

export default class Calendar {
    /**
     * The context for the calendar component.
     * 
     * This context provides access to the calendar's state and props.
     */
    static Context: Context<ICalendarContext> = createContext<ICalendarContext>({} as ICalendarContext);
    /**
     * Generates the headers for a week based on the start day.
     * 
     * This method returns an array of 7 strings representing the week headers, e.g., ["Sun", "Mon", ...].
     * 
     * @param {number} [weekStartDay=0] - The day of the week to start on (0 for Sunday, 1 for Monday, etc.).
     * @returns {string[]} - An array of 7 strings representing the week headers.
     * 
     * @example
     * const weekHeaders = Calendar.generateWeekHeaders(1);
     * console.log(weekHeaders); // Output: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
     */
    static generateWeekHeaders(weekStartDay: number = 0): string[] {
        weekStartDay = typeof weekStartDay === 'number' && (weekStartDay >= 0 && weekStartDay <= 6) ? weekStartDay : 0;
        const daysOfWeek = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        return [...daysOfWeek.slice(weekStartDay), ...daysOfWeek.slice(0, weekStartDay)];
    }
    /**
     * Generates a 7x7 matrix of days for a given month.
     * 
     * This method creates a matrix of days, where each day is represented by an object containing its date, value, and other properties.
     * 
     * @param {ICalendarDate} [dateCursor] - The date cursor to use for generating the day view.
     * @param {number} [weekStartDay=0] - The day of the week to start the calendar week (0 = Sunday, 1 = Monday, etc.).
     * @param {ICalendarDate} [minDate] - The minimum date to be displayed in the calendar.
     * @param {ICalendarDate} [maxDate] - The maximum date to be displayed in the calendar.
     * @param {ICalendarDate} [defaultValue] - The default date value to be displayed in the calendar.
     * @returns {ICalendarDayItem[][]} - A 2D array of ICalendarDayItem objects, representing the days in a 7x7 matrix.
     * 
     * @example
     * const dayMatrix = Calendar.generateDayView(new Date('2022-06-01'), 1, new Date('2022-01-01'), new Date('2022-12-31'), new Date('2022-06-15'));
     * console.log(dayMatrix); // Output: A 2D array of ICalendarDayItem objects
     */
    static generateDayView(dateCursor?: ICalendarDate, weekStartDay: number = 0, minDate?: ICalendarDate, maxDate?: ICalendarDate, defaultValue?: ICalendarDate): ICalendarDayItem[][] {
        const momentDateCursor = getMomentDate(dateCursor);
        const startOfMonth = momentDateCursor.startOf('month');
        const endOfMonth = getMomentDate(momentDateCursor).endOf('month');
        const startDayOfWeek = startOfMonth.day();
        const matrixDateCursor = getMomentDate(startOfMonth).subtract((startDayOfWeek - weekStartDay + 7) % 7, 'days');
        const defaultValueMoment = defaultValue ? getMomentDate(defaultValue) : undefined;
        const calendarMatrix: ICalendarDayItem[][] = [];
        const currentDate = matrixDateCursor.clone();
        const momentMaxDate = maxDate ? getMomentDate(maxDate) : undefined;
        const momentMinDate = minDate ? getMomentDate(minDate) : undefined;
        for (let week = 0; week < 6; week++) {
            const weekRow: ICalendarDayItem[] = [];
            for (let day = 0; day < 7; day++) {
                const isCurrentDateValid = !(momentMinDate && momentMinDate.isAfter(currentDate, "day") || momentMaxDate && momentMaxDate.isBefore(currentDate, "day"))
                const isDefaultValue = defaultValueMoment && defaultValueMoment.isSame(currentDate, 'day') || false;
                const inCurrentMonth = currentDate.isSameOrAfter(startOfMonth, 'day') && currentDate.isSameOrBefore(endOfMonth, 'day');
                weekRow.push({
                    day: currentDate.date(),
                    isDefaultValue,
                    value: currentDate.toDate(),
                    isToday: currentDate.isSame(getMomentDate(), "day"),
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
     * Generates a 4x4 matrix of months for a given year.
     * 
     * This method creates a matrix of months, where each month is represented by an object containing its name, short name, index, and disabled status.
     * 
     * @param {ICalendarDate} [minDate] - The minimum date to be displayed in the calendar.
     * @param {ICalendarDate} [maxDate] - The maximum date to be displayed in the calendar.
     * @returns {ICalendarMonthItem[][]} - A 2D array of ICalendarMonthItem objects, representing the months in a 4x4 matrix.
     * 
     * @example
     * const monthMatrix = Calendar.generateMonthView(new Date('2022-01-01'), new Date('2022-12-31'));
     * console.log(monthMatrix); // Output: A 2D array of ICalendarMonthItem objects
     */
    static generateMonthView(minDate?: ICalendarDate, maxDate?: ICalendarDate): ICalendarMonthItem[][] {
        const allMonths = moment.months();//example : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const allMonthsShort = moment.monthsShort();
        const monthMatrix: ICalendarMonthItem[][] = [];
        const rows = Math.ceil(16 / 4); // 4 columns, so calculate rows
        for (let row = 0; row < rows; row++) {
            const monthRow: ICalendarMonthItem[] = [];
            for (let col = 0; col < 4; col++) {
                const monthIndex = row * 4 + col;
                if (monthIndex >= 16) break;
                const nameIndex = monthIndex % 12;
                monthRow.push({
                    monthName: allMonths[nameIndex], // Use modulo for 16 months
                    monthNameShort: allMonthsShort[nameIndex],
                    monthIndex,
                    disabled: row >= 3,
                    month: monthIndex
                });
            }
            monthMatrix.push(monthRow);
        }
        return monthMatrix;
    }
    /***
     * Generate the boundaries for the years in the calendar.
     * @param {ICalendarDate} minDate - The minimum date to be displayed in the calendar.
     * @returns {object} An object containing the start and end years, as well as the start and end dates.
     */
    /**
    * Calculates the boundaries for the years in the calendar.
    * 
    * This method determines the start and end years, as well as the start and end dates,
    * based on the provided minimum date.
    * 
    * @param {ICalendarDate} [minDate] - The minimum date to be displayed in the calendar.
    * @returns {{ start: number, startDate: Date, end: number, endDate: Date }} - An object containing the start and end years, as well as the start and end dates.
    * 
    * @example
    * const boundaries = Calendar.getYearsBoundaries(new Date('2022-01-01'));
    * console.log(boundaries); // Output: { start: 2012, startDate: 2022-01-01T00:00:00.000Z, end: 2027, endDate: 2037-01-01T00:00:00.000Z }
    */
    static getYearsBoundaries(minDate?: ICalendarDate): { start: number, startDate: Date, end: number, endDate: Date } {
        const startYear = getMomentDate(minDate).toDate().getFullYear();
        const start = Math.max(startYear - 10, 0);
        const end = start + 15;
        return {
            start,
            startDate: getMomentDate(minDate).toDate(),
            end,
            endDate: getMomentDate(minDate).add(15, 'year').toDate()
        }
    }
    /**
     * Generates a 4x4 matrix of years for a given date range.
     * 
     * This method creates a matrix of years, where each year is represented by an object containing its value.
     * 
     * @param {ICalendarDate} [minDate] - The minimum date to be displayed in the calendar.
     * @param {ICalendarDate} [maxDate] - The maximum date to be displayed in the calendar.
     * @returns {ICalendarYearItem[][]} - A 2D array of ICalendarYearItem objects, representing the years in a 4x4 matrix.
     * 
     * @example
     * const yearMatrix = Calendar.generateYearView(new Date('2022-01-01'), new Date('2022-12-31'));
     * console.log(yearMatrix); // Output: A 2D array of ICalendarYearItem objects
     */
    static generateYearView(minDate?: ICalendarDate, maxDate?: ICalendarDate): ICalendarYearItem[][] {
        const { start: startYear } = Calendar.getYearsBoundaries(minDate);
        const years: ICalendarYearItem[][] = [];
        const numRows = 4; // Display 4 years per row
        for (let row = 0; row < numRows; row++) {
            const yearRow: ICalendarYearItem[] = [];
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
    /**
     * A container component for calendar items.
     * A container represent a row of items or item headers in the calendar.
     * 
     * This component provides a context for its children, which includes the number of items, screen width, and screen height.
     * 
     * @param {ICalendarItemsContainerProps} props - The props for the ItemsContainer component.
     * @returns {JSX.Element} - The rendered ItemsContainer component.
     */
    static ItemsContainer: FC<ICalendarItemsContainerProps> = ({ children, testID, width: itemsContainerWidth }) => {
        const { itemsContainerProps: cCalendarItemsContainerProps } = useCalendar();
        const itemsContainerProps = Object.assign({}, cCalendarItemsContainerProps);
        testID = defaultStr(testID, "resk-calendar");
        itemsContainerWidth = typeof itemsContainerWidth == "number" && itemsContainerWidth > 10 ? itemsContainerWidth : itemsContainerProps.width;
        const itemsCount = Array.isArray(children) ? children.length : 1;
        const { width: screenWidth, height: screenHeight } = useDimensions();
        const itemsSize = Math.min(screenWidth, typeof itemsContainerWidth == "number" && itemsContainerWidth > 10 ? itemsContainerWidth : 392);
        return <CalendarItemContainerContext.Provider value={{ itemsCount, itemsSize, itemSize: itemsCount > 0 ? itemsSize / itemsCount : 0, screenWidth, screenHeight }}>
            <View testID={testID + "-items-container"} style={[Styles.calendarItemsContainer]}>
                <View testID={testID + "-items-container-content"} style={[Styles.calendarItemContainer, { width: itemsSize }]}>
                    {children}
                </View>
            </View>
        </CalendarItemContainerContext.Provider>
    }
    /**
     * Generates a list of hours for a given date.
     * 
     * This method creates a list of hours, where each hour is represented by an object containing its value, label, and disabled status.
     * 
     * @param {ICalendarDate} [date] - The date to generate hours for.
     * @returns {ICalendarHourItem[]} - A list of ICalendarHourItem objects, representing the hours.
     * 
     * @example
     * const hourView = Calendar.generateHourView(new Date('2022-06-15'));
     * console.log(hourView); // Output: A list of ICalendarHourItem objects
     */
    static generateHourView(date?: ICalendarDate): ICalendarHourItem[] {
        const currentDate = getMomentDate(); // Current time
        const momentDate = getMomentDate(date);
        const isToday = momentDate.isSame(currentDate, 'day');
        const hourView: ICalendarHourItem[] = [];
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
    /**
     * A day view component for the calendar.
     * 
     * This component renders a day view of the calendar, with a grid of days and navigation buttons.
     * 
     * @param {ICalendarDayViewProps} props - The props for the DayView component.
     * @returns {JSX.Element} - The rendered DayView component.
     */
    static DayView(props: ICalendarDayViewProps) {
        return <CalendarWithContext
            displayView="day" {...props}
        >
            <CalendarDayView />
        </CalendarWithContext>
    }

    /**
     * A modal content component for the calendar in a modal.
     * 
     * This component provides a container for the modal content, with access to the modal context.
     * 
     * @param {ICalendarBaseProps} props - The props for the ModalContent component.
     * @returns {JSX.Element} - The rendered ModalContent component.
     */
    static ModalContent: FC<ICalendarBaseProps & { displayView: ICalendarDisplayView }> = ({ children, header, testID, displayView, ...props }) => {
        testID = defaultStr(testID, "resk-calendar-modal");
        const modalContext = useModal();
        const i18n = useI18n();
        const Component = useMemo(() => {
            return displayView == "year" ? Calendar.YearView : displayView == "month" ? Calendar.MonthView : Calendar.DayView;
        }, [displayView])
        return <Component
            {...props}
            onChange={(...args) => {
                const { onChange } = props as any;
                if (typeof onChange == "function") {
                    onChange(...args);
                }
                if (typeof modalContext?.handleDismiss == "function") {
                    modalContext.handleDismiss(undefined as any);
                }
            }}
            header={<View style={[Styles.modalHeaderContainer]} testID={testID + "-modal-header-container"}>
                <View style={[Styles.modalHeader]} testID={testID + "-modal-header"}>
                    {typeof modalContext?.handleDismiss === "function" ? <View testID={testID + "-close-modal-icon"} style={Styles.closeModalIcon}>
                        <Icon.Button
                            size={ICON_SIZE}
                            iconName={"close"}
                            title={i18n.t("components.calendar.closeModal")}
                            onPress={(e) => {
                                if (typeof modalContext?.handleDismiss === "function") {
                                    modalContext.handleDismiss(e);
                                }
                            }}
                        />
                    </View> : null}
                    {header}
                </View>
            </View>}
            testID={testID}
        />
    };
    /**
     * A modal day view component for the calendar.
     * 
     * This component provides a modal window for displaying the day view of the calendar.
     * 
     * @param {ICalendarModalDayViewProps} props - The props for the ModalDayView component.
     * @returns {JSX.Element} - The rendered ModalDayView component.
     */
    static ModalDayView ({ modalProps, testID, ...props }: ICalendarModalDayViewProps){
        testID = defaultStr(testID, "resk-calendar-modal-dayview");
        modalProps = Object.assign({}, modalProps);
        return <Calendar.Modal
            testID={testID + "-modal"}
            responsive
            dismissable={false}
            pureModal
            {...modalProps}
            children={<Calendar.ModalContent
                {...props}
                displayView="day"
            />}
        />
    };
    /**
      * A month view component for the calendar.
      * 
      * This component renders a month view of the calendar, with a grid of months and navigation buttons.
      * 
      * @param {ICalendarMonthViewProps} props - The props for the MonthView component.
      * @returns {JSX.Element} - The rendered MonthView component.
      */
    static MonthView(props: ICalendarMonthViewProps) {
        return <CalendarWithContext
            displayView="month"
            {...props}
        >
            <CalendarMonthView />
        </CalendarWithContext>
    };
    /**
     * A year view component for the calendar.
     * 
     * This component renders a year view of the calendar, with a grid of years and navigation buttons.
     * 
     * @param {ICalendarYearViewProps} props - The props for the YearView component.
     * @returns {JSX.Element} - The rendered YearView component.
     */
    static YearView(props: ICalendarYearViewProps) {
        return <CalendarWithContext
            displayView="year" {...props}
        >
            <CalendarYearView />
        </CalendarWithContext>
    }
    /**
     * A modal component for the calendar.
     * 
     * This component provides a modal window for displaying the calendar.
     * 
     * @param {IModalProps} props - The props for the Modal component.
     * @returns {JSX.Element} - The rendered Modal component.
     */
    static Modal({ onDismiss,ref, ...props }: IModalProps & {ref?: Ref<CalendarModalContext>}) {
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
            onDismiss={(e) => {
                if (typeof onDismiss === "function") {
                    onDismiss(e);
                }
                setVisible(false);
            }}
            visible={visible}
        />
    };
}
Calendar.ModalContent.displayName = "Calendar.ModalContent";
const Styles = StyleSheet.create({
    disabled: {
        opacity: 0.65,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        flexGrow: 1,
    },
    modalHeaderContainer: {
        flexDirection: "column",
        flexGrow: 1,
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    closeModalIcon: {
        marginRight: 5,
    },
    calendarItemsContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        flexGrow: 1,
    },
    calendarItemLabelContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "transparent",
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
        //flexBasis: 0,
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
    calendarItemMarked: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 2,
    }
})

const areEquals = (a: any, b: any, displayView: ICalendarDisplayView) => {
    const isAe = isEmpty(a), isBe = isEmpty(b);
    if (isAe && !isBe) return false;
    if (!isAe && isBe) return false;
    const areYears = moment(a, "day").isSame(moment(b, "day")),
        areMonths = moment(a, "year").isSame(moment(b, "year")),
        areDays = moment(a, "month").isSame(moment(b, "month")),
        areHours = moment(a, "hour").isSame(moment(b, "hour"));
    switch (displayView) {
        case "year":
            return areYears;
        case "month":
            return areMonths && areYears;
        case "day":
            return areDays && areMonths && areYears;
        case "hour":
            return areHours && areDays && areMonths && areYears && areHours;
    }
}

export function useCalendar<T extends ICalendarBaseProps = ICalendarBaseProps>(): ICalendarContext<T> {
    const context = useContext(Calendar.Context);
    return Object.assign({}, context) as ICalendarContext<T>;
}

const getMomentDate = (date?: ICalendarDate | Moment) => {
    return moment(isNonNullString(date) ? DateHelper.parseDate(date) || undefined : date);
}
function CalendarWithContext<T extends ICalendarBaseProps = ICalendarBaseProps>({ children, displayView, ...props }: T & { displayView: ICalendarDisplayView }) {
    const i18n = useI18n();
    const i18nLocale = i18n.getLocale();
    const locale = defaultStr(props?.locale, i18n.getLocale());
    //When dateCursor is provided, use it, otherwise use defaultValue
    const customDateCursor = "dateCursor" in props ? props.dateCursor : props.defaultValue;
    const [state, setState] = useStateCallback<ICalendarState>({
        minDate: props.minDate,
        maxDate: props.maxDate,
        defaultValue: props.defaultValue,
        displayView,
        dateCursor: getMomentDate(customDateCursor),
    });
    useMemo(() => {
        I18nClass.setMomentLocale(locale);
    }, [locale, i18nLocale]);
    const momentMaxDate = useMemo(() => {
        return state?.maxDate ? getMomentDate(state?.maxDate) : undefined;
    }, [state?.maxDate]);
    const momentMinDate = useMemo(() => {
        return state?.minDate ? getMomentDate(state?.minDate) : undefined;
    }, [state?.minDate]);
    const momentDefaultValue = useMemo(() => {
        return state?.defaultValue ? getMomentDate(state?.defaultValue) : undefined;
    }, [state?.defaultValue]);
    const dateFormat = defaultStr(props?.dateFormat, DateHelper.DEFAULT_DATE_FORMAT) as IMomentFormat;
    useEffect(() => {
        const newState = { ...state };
        const minDateE = areEquals(props?.minDate, newState.minDate, state.displayView), maxDateE = areEquals(props?.maxDate, newState.maxDate, state.displayView),
            defaultValueE = areEquals(props?.defaultValue, state.defaultValue, state.displayView), dateCursorE = areEquals(customDateCursor, state.dateCursor, state.displayView);
        const hasUpdate = !minDateE || !maxDateE || !defaultValueE;
        if (!minDateE) {
            newState.minDate = props?.minDate;
        }
        if (!maxDateE) {
            newState.maxDate = props?.maxDate;
        }
        if (!defaultValueE) {
            newState.defaultValue = props?.defaultValue;
        }
        if (!dateCursorE) {
            newState.dateCursor = getMomentDate(customDateCursor);
        }
        if (hasUpdate) {
            setState({ ...state, ...newState });
        }
    }, [props?.minDate, props?.maxDate, customDateCursor]);
    const { dateCursor } = state;
    return <Calendar.Context.Provider key={state.displayView} value={{
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
            const momentDate = getMomentDate(date);
            if (momentMinDate && momentMinDate.isAfter(momentDate, "day")) return false;
            if (momentMaxDate && momentMaxDate.isBefore(momentDate, "day")) return false;
            return true;
        },
        navigateToNext: (event?: GestureResponderEvent) => {
            let newDateCursor = moment(dateCursor.toDate());
            switch (state.displayView) {
                case "year":
                    const { end } = Calendar.getYearsBoundaries(dateCursor.toDate());
                    newDateCursor = moment(dateCursor.toDate()).year(end);
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

const CalendarItemContainerContext = createContext<{
    itemsCount: number;
    screenWidth: number;
    screenHeight: number;
    itemSize: number;
    itemsSize: number,
}>({
    itemsCount: 1,
    screenWidth: 0,
    screenHeight: 0,
    itemSize: 0,
    itemsSize: 0
});

Calendar.ItemsContainer.displayName = "Calendar.ItemsContainer";
interface ICalendarItemProps { item: ICalendarItem, style?: IViewStyle, isCurrent: boolean, onPress: (e: GestureResponderEvent) => void, isDefaultValue?: boolean, disabled: boolean, testID: string, label: string }
const CalendarItem = ({ isCurrent, item, isDefaultValue, disabled, onPress, label, testID, style }: ICalendarItemProps) => {
    const { isItemMarked } = useCalendar();
    const { itemSize } = useCalendarItemsContainer();
    const theme = useTheme();
    const isMarked = typeof isItemMarked == "function" ? isItemMarked(item) : false;
    const selectedBackgroundColor = theme.colors.primary;
    const color = isDefaultValue ? theme.colors.onPrimary : undefined;
    const backgroundColor = isDefaultValue ? selectedBackgroundColor : undefined;
    const borderColor = isDefaultValue || isCurrent ? selectedBackgroundColor : undefined;
    const markedBackgroundColor = isDefaultValue ? Colors.setAlpha(selectedBackgroundColor, 0.4) : theme.colors.primary;
    return (
        <TouchableRipple
            testID={testID}
            disabled={disabled}
            onPress={onPress}
            hoverColor={Colors.setAlpha(selectedBackgroundColor, 0.4)}
            android_ripple={{ foreground: !!backgroundColor, radius: itemSize * 0.5 }}
            style={StyleSheet.flatten([
                Styles.calendarItem,
                backgroundColor && { backgroundColor },
                borderColor && { borderColor, borderWidth: 1 }
            ])}
        >
            <View testID={testID + "-label-container"} style={[Styles.calendarItemLabelContainer]}>
                <Label textBold={isDefaultValue} color={color} disabled={disabled} testID={testID + "-label"}>
                    {label}
                </Label>
                {isMarked ? <View style={[Styles.calendarItemMarked, { backgroundColor: markedBackgroundColor }]} /> : null}
            </View>
        </TouchableRipple>
    );
}
CalendarItem.displayName = "Calendar.Item";

const CalendarDayView: FC = () => {
    const theme = useTheme();
    const { momentMaxDate, itemsContainerProps, testID: customTestID, weekStartDay, header, momentMinDate, isValidItem, i18n, locale, setState, navigateToNext, navigateToPrevious, dateFormat, state, momentDefaultValue, ...props } = useCalendar<ICalendarDayViewProps>();
    const testID = defaultStr(customTestID, "resk-calendar-day-view");
    const itemsContainerTestId = defaultStr(itemsContainerProps?.testID, testID + "-items-container");
    const { displayView, dateCursor } = state;
    const { dayView, dayHeaders } = useMemo(() => {
        return {
            dayView: Calendar.generateDayView(dateCursor.toDate(), weekStartDay, state.minDate, state.maxDate, state.defaultValue),
            dayHeaders: Calendar.generateWeekHeaders(weekStartDay)
        };
    }, [state.minDate, state.defaultValue, state.maxDate, weekStartDay, state.dateCursor, locale]);
    //const toDayStr = getMomentDate().format(dateFormat);
    //const defaultValueStr = momentDefaultValue?.format(dateFormat) || "";
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
                defaultValue={state.defaultValue}
                dateCursor={dateCursor}
                renderNavigationButtons={false}
                key={state.displayView}
                renderToggleDisplayViewButton={false}
                elevation={0}
                onChange={(data) => {
                    const newDateCursor = getMomentDate(dateCursor).month(data.month);
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
                    dateCursor={dateCursor}
                    defaultValue={state.defaultValue}
                    renderNavigationButtons={false}
                    renderToggleDisplayViewButton={false}
                    key={state.displayView}
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
                        <Calendar.ItemsContainer testID={itemsContainerTestId + "-headers"}>
                            {dayHeaders.map((day, index) => {
                                return <View key={index} style={[Styles.calendarItem, Styles.calendarDayHeader]}>
                                    <Label style={Styles.calendarDayHeaderLabel} textBold>{day}</Label>
                                </View>
                            })}
                        </Calendar.ItemsContainer>
                        {dayView.map((week, index) => {
                            const cTestID = `${itemsContainerTestId}-${index}`;
                            return <Calendar.ItemsContainer testID={cTestID} key={index}>
                                {week.map((day, index) => {
                                    return <CalendarItem
                                        item={day}
                                        key={`day-view-${day.day}`}
                                        {...{
                                            isCurrent: day.isToday,
                                            itemsCount: week.length,
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
                            </Calendar.ItemsContainer>;
                        })}
                    </>
            }
        </>
    });
}
CalendarDayView.displayName = "Calendar.DayView";


const CalendarMonthView: FC<ICalendarMonthViewProps> = () => {
    const theme = useTheme();
    const { state, setState, defaultValue, momentDefaultValue, momentMinDate, momentMaxDate, locale, navigateToNext, navigateToPrevious, ...props } = useCalendar<ICalendarMonthViewProps>();
    const { dateCursor } = state;
    const monthView = useMemo(() => {
        return Calendar.generateMonthView(state.minDate, state.maxDate);
    }, [state.minDate, state.maxDate, state.dateCursor, dateCursor, locale]);
    const { displayView } = state;
    const testID = defaultStr(props?.testID, "resk-calendar-month-view");
    const momentDate = getMomentDate();
    const currentMonth = momentDate.month();
    const isCurrentYear = momentDate.year() === dateCursor.year();
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
                dateCursor={dateCursor}
                defaultValue={state.defaultValue}
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
                    return <Calendar.ItemsContainer key={index}>
                        {months.map((data, index) => {
                            return <CalendarItem
                                key={`month-view-${data.month}`}
                                item={data}
                                {...{
                                    itemsCount: months.length,
                                    isCurrent: isCurrentYear && data.month === currentMonth,
                                    isDefaultValue: data.month === momentDefaultValue?.month() && dateCursor.year() === momentDefaultValue?.year(),
                                    disabled: false,
                                    testID: cTestID + "-month-" + index,
                                    label: String(data.monthNameShort),
                                    onPress: () => {
                                        if (typeof props?.onChange === "function") {
                                            props?.onChange(data);
                                        }
                                    },
                                }}
                            />;
                        })}
                    </Calendar.ItemsContainer>;
                })}
            </>}
        </>
    });
}
CalendarMonthView.displayName = "Calendar.MonthView";

const CalendarYearView: FC<ICalendarYearViewProps> = () => {
    const { locale, state, momentDefaultValue, navigateToNext, navigateToPrevious, ...props } = useCalendar<ICalendarYearViewProps>();
    const { dateCursor } = state;
    const yearView = useMemo(() => {
        const { startDate, endDate } = Calendar.getYearsBoundaries(dateCursor.toDate());
        return Calendar.generateYearView(startDate, endDate);
    }, [state?.minDate, state.maxDate, locale, state.dateCursor, state.defaultValue, state.dateCursor?.year(), props]);
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
                return <Calendar.ItemsContainer testID={cTestID} key={index}>
                    {years.map((data, index) => {
                        return <CalendarItem
                            key={`year-view-${data.year}`}
                            item={data}
                            {...{
                                isCurrent: currentYear === data.year,
                                isDefaultValue: data.year === momentDefaultValue?.year(),
                                disabled: false,
                                testID: cTestID + "-year-" + index,
                                label: String(data.year),
                                itemsCount: years.length,
                                onPress: () => {
                                    if (typeof props?.onChange === "function") {
                                        props?.onChange(data);
                                    }
                                },
                            }}
                        />
                    })}
                </Calendar.ItemsContainer>;
            })}
        </>,
    });
}

const useCalendarItemsContainer = () => {
    return useContext(CalendarItemContainerContext);
}

CalendarYearView.displayName = "Calendar.YearView";

(Calendar.Modal as any).displayName = "Calendar.Modal";
(Calendar.ModalDayView as any).displayName = "Calendar.ModalDayView";