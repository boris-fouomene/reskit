import { IModalProps } from "@components/Modal";
import { ISurfaceProps } from "@components/Surface";
import { IMomentFormat } from "@resk/core/types";
import { I18nClass } from "@resk/core/i18n";
import useStateCallback from "@utils/stateCallback";
import { Moment } from "moment";
import { ReactNode } from "react";
import { GestureResponderEvent } from "react-native";

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


    /***
     * A function to determine if an item of the calendar is marked.
     * @param {(ICalendarItem)} item - The item to check.
     * @returns {boolean} - A boolean indicating whether the day is marked.
     */
    isItemMarked?: (item: (ICalendarItem)) => boolean;

    /***
     * The properties for the items container.
     * Each items container represents a row of items or item headers in the calendar.
     * @default undefined
     */
    itemsContainerProps?: Omit<ICalendarItemsContainerProps, "children">;

    /**
     * The current date cursor used for navigating the calendar. This value determines:
     * - The currently displayed month in day view
     * - The year range shown in year view (±5 years from cursor)
     * - The highlighted month/year in their respective views
     * 
     * The cursor acts independently from the selected date, allowing users to browse
     * through different time periods without changing their selection.
     * 
     * @type {moment.Moment} - Can be provided as:
     * - moment.js object
     * 
     * @default moment() // Current date
     */
    dateCursor?: Moment;

    /***
     * The border radius of the surface containing the calendar.
     * @default 0
     */
    borderRadius?: number;
}
/***
 * Interface representing the properties of the calendar items container.
 * An items container represents a row of items or item headers in the calendar.
 * 
 */
export interface ICalendarItemsContainerProps {
    /***
     * Represents the width of the items container.
     * @default 392
     * The item container width is calculated dynamically based on the screen width, and represent the minimum between the provided width and 90% of the screen width.
     */
    width?: number;

    /***
     * The children of the items container.
     * @default []
     * Each child represents an item in the calendar or an item header.
     */
    children: ReactNode[];

    /***
     * The test ID for the items container.
     * Note: The test ID is suffixed with "-items-container" and "-items-container-content" to ensure uniqueness.
     * @default undefined
     */
    testID?: string;
}
/***
 * Type representing an item of the calendar.
 * @typedef {(ICalendarDayItem | ICalendarMonthItem | ICalendarYearItem | ICalendarHourItem)} ICalendarItem
 * 
 * @property {ICalendarDayItem | ICalendarMonthItem | ICalendarYearItem | ICalendarHourItem} displayView - The current display view of the calendar.
   @see {@link ICalendarDayItem}, for more information about the day item.
   @see {@link ICalendarMonthItem}, for more information about the month item.
   @see {@link ICalendarYearItem}, for more information about the year item.
   @see {@link ICalendarHourItem}, for more information about the hour item.
 */
export type ICalendarItem = (ICalendarDayItem | ICalendarMonthItem | ICalendarYearItem | ICalendarHourItem);
/**
 * Interface representing the properties of a calendar month component.
 * @extends ICalendarBaseProps
 */
export interface ICalendarMonthViewProps extends ICalendarBaseProps {
    /**
     * Callback function to be called when a month is selected.
     * @param data The selected month data.
     * @example
     * const onChange: (data: ICalendarMonthItem) => void = (data) => {
     *   console.log(data.monthName);
     * };
     */
    onChange?: (data: ICalendarMonthItem) => void;
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
     * const onChange: (data: ICalendarYearItem) => void = (data) => {
     *   console.log(data.year);
     * };
     */
    onChange?: (data: ICalendarYearItem) => void;
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
     * const onChange: (data: ICalendarHourItem) => void = (data) => {
     *   console.log(data.hour);
     * };
     */
    onChange?: (data: ICalendarHourItem) => void;
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
     * const onChange: (data: ICalendarDayItem) => void = (data) => {
     *   console.log(data.day);
     * };
     */
    onChange?: (data: ICalendarDayItem) => void;

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
 * @interface ICalendarHourItem
 */
export interface ICalendarHourItem {
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
 * @interface ICalendarDayItem
 * Interface representing a day in the calendar.
 */
export interface ICalendarDayItem {
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
 * @interface ICalendarYearItem
 * Interface representing a year in the calendar.
 */
export interface ICalendarYearItem {
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
 * @interface ICalendarMonthItem
 * Interface representing a month in the calendar.
 */
export interface ICalendarMonthItem {
    /**
     * The name of the month, represented as a string (e.g., "January", "February", etc.).
     * @example
     * const monthName: string = "June";
     */
    monthName: string;

    /***
     * The short name of the month, represented as a string (e.g., "Jan", "Feb", etc.).
     * @example
     * const monthNameShort: string = "Jun";
     */
    monthNameShort: string;

    /**
     * The month value, represented as a number in the range 0 to 11, where 0 corresponds to January and 11 to December. 
     * @example
     * const month: number = 5; // June
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


/****
 * Interface for the calendar context
 * @interface ICalendarContext
 * Type representing the context for the calendar component.
 * @extends ICalendarBaseProps
 */
export type ICalendarContext<T extends ICalendarBaseProps = ICalendarBaseProps> = T & {
    /***
     * The i18n instance for the calendar.
     */
    i18n: I18nClass;

    /***
     * The moment instance corresponding to the minDate prop.
     */
    momentMinDate?: Moment;
    /***
     * The moment instance corresponding to the maxDate prop.
     */
    momentMaxDate?: Moment;
    /***
     * The moment instance corresponding to the defaultValue prop.
     */
    momentDefaultValue?: Moment;

    /***
     * The current state of the calendar.
     */
    state: ICalendarState;

    /***
     * A function to update the calendar state.
     */
    setState: ReturnType<typeof useStateCallback<ICalendarState>>[1];

    /***
     * A function to check if the current date, is valid or not.
     * @param date - The date to be checked.
     * @returns A boolean indicating whether the date is valid or not.
     */
    isValidItem: (date: Date) => boolean;
    navigateToNext: (event?: GestureResponderEvent) => void;
    navigateToPrevious: (event?: GestureResponderEvent) => void;
}

/***
 * Interface representing the state of the calendar.
 * @interface ICalendarState
 */
export interface ICalendarState {
    /***
     * The minimum date that can be selected in the calendar.
     * @default undefined
     * @example
     * const minDate: ICalendarDate = new Date('2022-01-01');
     */
    minDate?: ICalendarDate,
    /***
     * The maximum date that can be selected in the calendar.
     * @default undefined
     * @example
     * const maxDate: ICalendarDate = new Date('2022-12-31');
     */
    maxDate?: ICalendarDate,
    /***
     * The default date value to be displayed in the calendar.
     * @default undefined
     */
    defaultValue?: ICalendarDate,
    /***
     * The current display view of the calendar.
     * @default "day"
     */
    displayView: ICalendarDisplayView;

    /**
     * The current date cursor used for navigating the calendar. This value determines:
     * - The currently displayed month in day view
     * - The year range shown in year view (±5 years from cursor)
     * - The highlighted month/year in their respective views
     * 
     * The cursor acts independently from the selected date, allowing users to browse
     * through different time periods without changing their selection.
     * 
     * @type {moment.Moment} - Can be provided as:
     * - moment.js object
     * 
     * @default moment() // Current date
     * 
     * When dateCursor is provided (either as a moment.js object or as undefined), it will be used, otherwise the defaultValue will be used.
     */
    dateCursor: Moment,
};