import { IMomentDateFormat } from "@resk/core"
import { Moment } from "moment";


export type ICalendarDate = Date | string;


export interface ICalendarBaseProps {
    startDate?: ICalendarDate;
    endDate?: ICalendarDate;
    dateFormat?: IMomentDateFormat,
    testID?: string;
    defaultValue?: ICalendarDate;
    locale?: string;
    renderNavigationButtons?: boolean;
    renderToggleDisplayViewButton?: boolean;
    header?: JSX.Element;
}
export interface ICalendarMonthProps extends ICalendarBaseProps {
    onChange?: (data: ICalendarMonth) => void;
}
export interface ICalendarYearProps extends ICalendarBaseProps {
    onChange?: (data: ICalendarYear) => void;
}
export interface ICalendarHourProps extends ICalendarBaseProps {
    onChange?: (data: ICalendarHour) => void;
}
export interface ICalendarDayProps extends ICalendarBaseProps {
    onChange?: (data: ICalendarDay) => void;
    weekStartDay?: number;
}
// Define hour structure
export interface ICalendarHour {
    hour: number; // Hour of the day (0-23)
    label: string; // Hour label (e.g., "12 AM", "1 PM")
    disabled: boolean; // Indicates if the hour is active or past
}

export interface ICalendarDay {
    day: number; // Day of the month*
    value: Date;
    isToday: boolean; // Indicates if the date is today
    /***
     * the formatted date to format : "DD"
     * The string representation of the day of the month (e.g., "01", "02", "03", etc.)
     */
    dayStr: string,
    date: Moment; // Full date object
    shortName: string; // Short weekday name (e.g., "Mon")
    longName: string; // Full weekday name (e.g., "Monday")
    disabled?: boolean; // Indicates if the date is part of the current month
    /***
     * the formatted date to format : "MMMM YYYY"
     */
    monthYear: string,
    /**
     * the formatted date to format : "MM"
     */
    month: string;
    /**
     * the formatted date to format : "YY"
     */
    year: string;
    /**
     * the formatted date to format : "L"
     */
    shortDate: string;
    shortDateTime: string;
}

export interface ICalendarYear {
    year: number;
    //dates: Moment
};
export interface ICalendarMonth {
    monthName: string,
    month: number,
    disabled?: boolean,
    monthIndex: number,
};


// Define calendar views
export type ICalendarDisplayView = 'year' | 'month' | 'day' | "hour";