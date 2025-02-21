import { IModalProps } from "@components/Modal";
import { ISurfaceProps } from "@components/Surface";
import { IMomentFormat } from "@resk/core"
import { Moment } from "moment";

/**
 * @interface ICalendarDate
 * Type representing a date value, which can be either a Date object or a string.
 * @example
 * const date: ICalendarDate = new Date();
 * const date: ICalendarDate = '2022-01-01';
 */
export type ICalendarDate = Date | string;

export interface CalendarModalContext {
    open: (cb?: () => void) => void;
    close: (cb?: () => void) => void;
}

/**
 * @interface ICalendarBaseProps
 * Interface representing the base properties of a calendar component.
 * @extends ISurfaceProps
 */
export interface ICalendarBaseProps extends ISurfaceProps {
    /**
     * The minimum date that can be selected in the calendar.
     * @default undefined
     * @example
     * const minDate: ICalendarDate = new Date('2022-01-01');
     */
    minDate?: ICalendarDate;

    /**
     * The maximum date that can be selected in the calendar.
     * @default undefined
     * @example
     * const maxDate: ICalendarDate = new Date('2022-12-31');
     */
    maxDate?: ICalendarDate;

    /**
     * The format of the date to be displayed in the calendar.
     * @default DEFAULT_DATE_FORMATS.date
     * @example
     * const dateFormat: IMomentFormat = 'YYYY-MM-DD';
     */
    dateFormat?: IMomentFormat;

    /**
     * The test ID for the calendar component.
     * @default undefined
     * @example
     * const testID: string = 'calendar-test-id';
     */
    testID?: string;

    /**
     * The default date value to be displayed in the calendar.
     * @default undefined
     * @example
     * const defaultValue: ICalendarDate = new Date('2022-06-01');
     */
    defaultValue?: ICalendarDate;

    /**
     * The locale to be used for the calendar.
     * @default undefined
     * @example
     * const locale: string = 'en-US';
     */
    locale?: string;

    /**
     * Whether to render navigation buttons in the calendar.
     * @default true
     * @example
     * const renderNavigationButtons: boolean = false;
     */
    renderNavigationButtons?: boolean;

    /**
     * Whether to render a toggle display view button in the calendar.
     * @default true
     * @example
     * const renderToggleDisplayViewButton: boolean = false;
     */
    renderToggleDisplayViewButton?: boolean;

    /**
     * The header element to be displayed in the calendar.
     * @default undefined
     * @example
     * const header: JSX.Element = <div>Calendar Header</div>;
     */
    header?: JSX.Element;
}
/**
 * Interface representing the properties of a calendar month component.
 * @extends ICalendarBaseProps
 */
export interface ICalendarMonthViewProps extends ICalendarBaseProps {
    /**
     * Callback function to be called when a month is selected.
     * @param data The selected month data.
     * @example
     * const onChange: (data: ICalendarMonth) => void = (data) => {
     *   console.log(data.monthName);
     * };
     */
    onChange?: (data: ICalendarMonth) => void;
}

/**
 * Interface representing the properties of a calendar year component.
 * @extends ICalendarBaseProps
 */
export interface ICalendarYearViewProps extends ICalendarBaseProps {
    /**
     * Callback function to be called when a year is selected.
     * @param data The selected year data.
     * @example
     * const onChange: (data: ICalendarYear) => void = (data) => {
     *   console.log(data.year);
     * };
     */
    onChange?: (data: ICalendarYear) => void;
}

/**
 * Interface representing the properties of a calendar hour component.
 * @extends ICalendarBaseProps
 */
export interface ICalendarHourProps extends ICalendarBaseProps {
    /**
     * Callback function to be called when an hour is selected.
     * @param data The selected hour data.
     * @example
     * const onChange: (data: ICalendarHour) => void = (data) => {
     *   console.log(data.hour);
     * };
     */
    onChange?: (data: ICalendarHour) => void;
}

/**
 * Interface representing the properties of a calendar day component.
 * @extends ICalendarBaseProps
 */
export interface ICalendarDayViewProps extends ICalendarBaseProps {
    /**
     * Callback function to be called when a day is selected.
     * @param data The selected day data.
     * @example
     * const onChange: (data: ICalendarDay) => void = (data) => {
     *   console.log(data.day);
     * };
     */
    onChange?: (data: ICalendarDay) => void;

    /**
     * The day of the week to start the calendar week.
     * @default 0 (Sunday)
     * @example
     * const weekStartDay: number = 1; // Monday
     */
    weekStartDay?: number;
}
/****
    Interface for the calendar modal day view props.
    @extends ICalendarDayViewProps
*/
export interface ICalendarModalDayViewProps extends ICalendarDayViewProps {
    modalProps?: IModalProps;
}

/**
 * Interface representing an hour in the calendar.
 * @interface ICalendarHour
 */
export interface ICalendarHour {
    /**
     * The hour of the day, ranging from 0 (12 AM) to 23 (11 PM).
     * @example
     * const hour: number = 12; // 12 PM
     */
    hour: number;

    /**
     * The label for the hour, formatted as a string (e.g., "12 AM", "1 PM").
     * @example
     * const label: string = "12 PM";
     */
    label: string;

    /**
     * Indicates whether the hour is disabled (i.e., not selectable) or not.
     * @default false
     * @example
     * const disabled: boolean = true; // Hour is disabled
     */
    disabled: boolean;
}

/**
 * @interface ICalendarDay
 * Interface representing a day in the calendar.
 */
export interface ICalendarDay {
    /**
     * The day of the month, ranging from 1 to 31.
     * @example
     * const day: number = 15; // 15th day of the month
     */
    day: number;

    /**
     * The date value of the day.
     * @example
     * const value: Date = new Date('2022-06-15');
     */
    value: Date;

    /**
     * Indicates whether the date is today's date.
     * @default false
     * @example
     * const isToday: boolean = true; // Date is today
     */
    isToday: boolean;

    /**
     * Indicates whether the date is the default value.
     * @default false
     * @example
     * const isDefaultValue: boolean = true; // Date is default value
     */
    isDefaultValue: boolean;

    /**
     * The string representation of the day of the month, formatted as "DD" (e.g., "01", "02", "03", etc.).
     * @example
     * const dayStr: string = "15";
     */
    dayStr: string;

    /**
     * The full date object, represented as a Moment instance.
     * @example
     * const date: Moment = moment('2022-06-15');
     */
    date: Moment;

    /**
     * The short weekday name (e.g., "Mon", "Tue", etc.).
     * @example
     * const shortName: string = "Wed";
     */
    shortName: string;

    /**
     * The full weekday name (e.g., "Monday", "Tuesday", etc.).
     * @example
     * const longName: string = "Wednesday";
     */
    longName: string;

    /**
     * Indicates whether the date is disabled (i.e., not selectable) or not.
     * @default false
     * @example
     * const disabled: boolean = true; // Date is disabled
     */
    disabled?: boolean;

    /**
     * The formatted date string, formatted as "MMMM YYYY" (e.g., "June 2022").
     * @example
     * const monthYear: string = "June 2022";
     */
    monthYear: string;

    /**
     * The formatted date string, formatted as "MM" (e.g., "06").
     * @example
     * const month: string = "06";
     */
    month: string;

    /**
     * The formatted date string, formatted as "YY" (e.g., "22").
     * @example
     * const year: string = "22";
     */
    year: string;

    /**
     * The formatted date string, formatted as "L" (e.g., "06/15/2022").
     * @example
     * const shortDate: string = "06/15/2022";
     */
    shortDate: string;

    /**
     * The formatted date string, formatted as a short date and time (e.g., "06/15/2022 12:00 PM").
     * @example
     * const shortDateTime: string = "06/15/2022 12:00 PM";
     */
    shortDateTime: string;
}

/**
 * @interface ICalendarYear
 * Interface representing a year in the calendar.
 */
export interface ICalendarYear {
    /**
     * The year value, represented as a number.
     * @example
     * const year: number = 2022;
     */
    year: number;

    /**
     * @deprecated This property is no longer used.
     * @hidden
     */
    // dates: Moment
}
/**
 * @interface ICalendarMonth
 * Interface representing a month in the calendar.
 */
export interface ICalendarMonth {
    /**
     * The name of the month, represented as a string (e.g., "January", "February", etc.).
     * @example
     * const monthName: string = "June";
     */
    monthName: string;

    /**
     * The month value, represented as a number (1-12).
     * @example
     * const month: number = 6; // June
     */
    month: number;

    /**
     * Indicates whether the month is disabled (i.e., not selectable) or not.
     * @default false
     * @example
     * const disabled: boolean = true; // Month is disabled
     */
    disabled?: boolean;

    /**
     * The index of the month, represented as a number (0-11).
     * @example
     * const monthIndex: number = 5; // June
     */
    monthIndex: number;
}


/**
 * @interface ICalendarDisplayView
 * Type representing the different display views of the calendar.
 * Available options are "year", "month", "day", and "hour".
 * @example
 * const displayView: ICalendarDisplayView = 'year';
 * const displayView: ICalendarDisplayView = 'month';
 * const displayView: ICalendarDisplayView = 'day';
 * const displayView: ICalendarDisplayView = 'hour';
 */
export type ICalendarDisplayView =
    /**
     * Display the calendar in year view.
     * @example
     * const displayView: ICalendarDisplayView = 'year';
     */
    'year' |
    /**
     * Display the calendar in month view.
     * @example
     * const displayView: ICalendarDisplayView = 'month';
     */
    'month' |
    /**
     * Display the calendar in day view.
     * @example
     * const displayView: ICalendarDisplayView = 'day';
     */
    'day' |
    /**
     * Display the calendar in hour view.
     * @example
     * const displayView: ICalendarDisplayView = 'hour';
     */
    "hour";