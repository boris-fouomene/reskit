import React from "react";
import Component from "@utils/Component";
import { View, TouchableOpacity, StyleSheet, Image, GestureResponderEvent } from "react-native";
import moment from "moment/min/moment-with-locales";
import { defaultStr, i18n, IMomentDateFormat, isObj } from "@resk/core";
import { ICalendarDate, ICalendarDay, ICalendarHour, ICalendarMonth, ICalendarProps, ICalendarState, ICalendarYear } from "./types";
import { Icon } from "@components/Icon";
import Label from "@components/Label";
import { DEFAULT_DATE_FORMATS } from "@resk/core";
import { Moment } from "moment";
import { TouchableRipple } from "@components/TouchableRipple";
import Theme, { Colors } from "@theme/index";
import { Button } from "@components/Button";
import { IStyle } from "@src/types";


const days = ["lun", "mar", "mer", "jeu", "vend", "sam", "dim"];


export default class Calendar extends Component<ICalendarProps, ICalendarState> {
    static defaultProps: ICalendarProps = {};
    constructor(props: ICalendarProps) {
        super(props);
        this.state = this.prepareState(props);
    }
    getDefaultDateFormat() {
        return defaultStr(this.props.dateFormat, DEFAULT_DATE_FORMATS.date, "D") as IMomentDateFormat;
    }
    UNSAFE_componentWillReceiveProps(nextProps: Readonly<ICalendarProps>, nextContext: any): void {
        if (nextProps.startDate !== this.props.startDate || nextProps.displayView !== this.props.displayView) {
            this.setState(this.prepareState(nextProps));
        }
    }
    prepareState(props?: ICalendarProps): ICalendarState {
        props = isObj(props) ? props : this.props;
        const stateObj = Object.assign({}, this.state);
        const newState: Partial<ICalendarState> = {
            startDate: (props && "startDate" in props) ? moment(props?.startDate) : stateObj.startDate || moment(),
            displayView: (props && "displayView" in props) ? props?.displayView : stateObj.displayView,
        };
        const date = newState.startDate?.toDate();
        switch (newState?.displayView) {
            case "year":
                newState.yearView = Calendar.generateYearView(date);
                break;
            case "month":
                newState.monthView = Calendar.generateMonthView();
                break;
            case "hour":
                newState.hourView = Calendar.generateHourView(date);
                break;
            default:
                newState.displayView = "day";
                newState.dayView = Calendar.generateDayView(date);
        }
        return newState as ICalendarState;
    }

    // Generate a calendar matrix for a month
    static generateDayView(startDate?: ICalendarDate, weekStartDay: number = 0): ICalendarDay[][] {
        const startOfMonth = moment(startDate).startOf('month');
        const endOfMonth = moment(startDate).endOf('month');
        const startDayOfWeek = startOfMonth.day();
        const matrixStartDate = moment(startOfMonth).subtract((startDayOfWeek - weekStartDay + 7) % 7, 'days');

        const calendarMatrix: ICalendarDay[][] = [];
        const currentDate = matrixStartDate.clone();

        for (let week = 0; week < 6; week++) {
            const weekRow: ICalendarDay[] = [];
            for (let day = 0; day < 7; day++) {
                const inCurrentMonth = currentDate.isSameOrAfter(startOfMonth, 'day') && currentDate.isSameOrBefore(endOfMonth, 'day');
                weekRow.push({
                    day: currentDate.date(),
                    value: currentDate.toDate(),
                    isToday: currentDate.isSame(moment(), "day"),
                    date: currentDate.clone(),
                    dayStr: currentDate.format('DD'),
                    shortName: currentDate.format('ddd'),
                    longName: currentDate.format('dddd'),
                    disabled: !inCurrentMonth,
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
    static generateMonthView(): ICalendarMonth[][] {
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
    static getYearsBoundaries(startDate?: ICalendarDate): { start: number, end: number } {
        const startYear = moment(startDate).toDate().getFullYear();
        const start = Math.max(startYear - 10, 0);
        return {
            start,
            end: start + 15,
        }
    }

    static generateYearView(startDate?: ICalendarDate): ICalendarYear[][] {
        const { start: startYear, end: endYear } = Calendar.getYearsBoundaries(startDate);
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
    // Navigation functions
    navigateToMonth(monthOffset: number, stateOptions?: Partial<ICalendarState>): Moment {
        const newStartDate = this.state.startDate.clone().add(monthOffset, 'months');
        this.setState(this.prepareState({ ...Object.assign({}, stateOptions), startDate: newStartDate.toDate() }));
        return this.state.startDate;
    }

    handleOnPressOnMonthView = async (data: ICalendarMonth) => {
        this.setState(this.prepareState({ startDate: this.state.startDate.month(data.month).toDate(), displayView: "day" }));
    };
    handleOnPressOnYearView = async (data: ICalendarYear) => {
        this.setState(this.prepareState({ startDate: this.state.startDate.year(data.year).toDate(), displayView: "month" }));
    };
    handleOnPressOnHourView = async (data: ICalendarHour) => {
        console.log("handleOnPressOnHourView", data);
    };
    handleOnPressOnDayView = async (data: ICalendarDay) => {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(data);
        }
    }

    renderCalendarContent() {
        switch (this.state.displayView) {
            case "year":
                return this.renderYearView();
            case "month":
                return this.renderMonthView();
            case "hour":
                return this.renderHourView();
            default:
                return this.renderDayView();
        }
    }
    renderMonthView() {
        const testID = this.getTestID();
        const currentMonth = this.state.startDate.month();
        const isCurrentYear = this.state.startDate.year() === new Date().getFullYear();
        return this.state.monthView.map((months, index) => {
            const cTestID = `${testID}-${index}`;
            return <View testID={cTestID + "-container"} key={index} style={Styles.calendarItemsContainer}>
                <View testID={cTestID} key={index} style={Styles.calendarItemContainer}>
                    {months.map((data, index) => {
                        return this.renderViewItem({
                            isActive: isCurrentYear && data.month === currentMonth,
                            disabled: false,
                            testID: cTestID + "-month-" + index,
                            label: String(data.monthName),
                            key: data.month,
                            style: [Styles.calendarYearItem, data.disabled && Styles.disabled],
                            onPress: () => this.handleOnPressOnMonthView(data),
                        });
                    })}
                </View>
            </View>;
        });
    }
    renderYearView() {
        const testID = this.getTestID();
        const currentYear = new Date().getFullYear();
        return this.state.yearView.map((years, index) => {
            const cTestID = `${testID}-${index}`;
            return <View testID={cTestID + "-container"} key={index} style={Styles.calendarItemsContainer}>
                <View testID={cTestID} key={index} style={Styles.calendarItemContainer}>
                    {years.map((data, index) => {
                        return this.renderViewItem({
                            isActive: currentYear === data.year,
                            disabled: false,
                            testID: cTestID + "-year-" + index,
                            label: String(data.year),
                            key: data.year,
                            style: Styles.calendarYearItem,
                            onPress: () => this.handleOnPressOnYearView(data),
                        });
                    })}
                </View>
            </View>;
        });
    }
    getTestID(): string {
        return `resk-calendar-${this.state.displayView}`;
    }
    getIconSize(): number {
        return 24;
    }
    renderViewItem({ isActive, disabled, onPress, label, testID, key, style }: { style?: IStyle, isActive: boolean, onPress: (e: GestureResponderEvent) => void, disabled: boolean, testID: string, label: string, key: number | string }) {
        return (
            <TouchableRipple
                testID={testID}
                key={key}
                disabled={disabled}
                onPress={onPress}
                hoverColor={isActive ? Colors.setAlpha(Theme.colors.primary, 0.2) : undefined}
                style={[
                    Styles.calendarItem, isActive && {
                        backgroundColor: Theme.colors.primary
                    }, style
                ]}
            >
                <Label textBold={isActive} color={isActive ? Theme.colors.onPrimary : undefined} disabled={disabled} testID={testID + "-label"}>
                    {label}
                </Label>
            </TouchableRipple>
        );
    }
    renderDayView() {
        const testID = this.getTestID();
        return this.state.dayView.map((week, index) => {
            const cTestID = `${testID}-${index}`;
            return <View testID={cTestID + "-container"} key={index} style={Styles.calendarItemsContainer}>
                <View testID={cTestID} key={index} style={Styles.calendarItemContainer}>
                    {week.map((day, index) => {
                        return this.renderViewItem({
                            isActive: day.isToday,
                            disabled: !!day.disabled,
                            testID: cTestID + "-day-" + index,
                            label: String(day.day),
                            key: day.day,
                            onPress: () => this.handleOnPressOnDayView(day),
                        });
                    })}
                </View>
            </View>;
        });
    }
    renderHourView() {
        return this.state.hourView.map((hour, index) => {
            return null;
        });
    }
    renderHeaderText() {
        const currentDate = this.state.startDate;
        switch (this.state.displayView) {
            case "year":
                const { start, end } = Calendar.getYearsBoundaries(currentDate.toDate());
                return `${start} - ${end}`;
            case "month":
                return currentDate.format("MMMM YYYY");
            case "hour":
                return currentDate.format("DD MMMM YYYY");
            default:
                return currentDate.format("MMMM YYYY");
        }
    }
    handlePressOnHeaderLabel() {
        switch (this.state.displayView) {
            case "year":
                //we change the view to month
                break;
            case "month":
                //we change the view to year
                this.setState(this.prepareState({ displayView: "year" }));
                break;
            case "day":
                //we change the view to month
                //we change the view to year
                this.setState(this.prepareState({ displayView: "month" }));
                break;
            default:
                break;
        }
    }
    navigateToYear(amount: number) {
        this.setState(this.prepareState({ startDate: this.state.startDate.add(amount, "years").toDate() }));
    }
    navigateToNext() {
        switch (this.state.displayView) {
            case "year":
                const { end } = Calendar.getYearsBoundaries(this.state.startDate.toDate());
                this.setState(this.prepareState({ startDate: this.state.startDate.year(end).toDate() }));
                break;
            case "month":
                this.navigateToYear(1);
                break;
            default:
                this.navigateToMonth(1);
        }
    }
    navigateToPrevious() {
        switch (this.state.displayView) {
            case "year":
                const { start, end } = Calendar.getYearsBoundaries(this.state.startDate.toDate());
                this.setState(this.prepareState({ startDate: this.state.startDate.year(start).toDate() }));
                break;
            case "month":
                this.navigateToYear(-1);
                break;
            default:
                this.navigateToMonth(-1);
                break;
        }
    }
    render() {
        const testID = this.getTestID();
        return (
            <View testID={testID} style={Styles.calendar}>
                <View testID={testID + "-header"} style={Styles.header}>
                    <View testID={`${testID}-header-content-container`} style={Styles.headerContentContainer}>
                        <Button compact testID={testID + "-header-text"}
                            onPress={this.handlePressOnHeaderLabel.bind(this)}
                            style={Styles.headerText}
                            containerProps={{ style: Styles.headerTextContainer }}
                            disabled={this.state.displayView === "year"}
                        >
                            {this.renderHeaderText()}
                        </Button>
                        <View testID={testID + "-header-arrow-container"} style={Styles.headerArrowContainer}>
                            <Icon.Button
                                iconName="chevron-left"
                                size={this.getIconSize()}
                                onPress={this.navigateToPrevious.bind(this)}
                                testID={testID + "-header-arrow-left"}
                            />
                            <Icon.Button
                                iconName="chevron-right"
                                size={this.getIconSize()}
                                onPress={this.navigateToNext.bind(this)}
                                testID={testID + "-header-arrow-right"}
                            />
                        </View>
                    </View>
                </View>
                <View testID={testID + "-content"} style={Styles.content}>
                    {this.renderCalendarContent()}
                </View>
                <View testID={testID + "-footer"} style={Styles.footer}>

                </View>
            </View>
        );
    }
}


const Styles = StyleSheet.create({
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
    header: {
        width: "100%",
    },
    headerText: {
    },
    headerTextContainer: {
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
        height: 40,
        width: 40,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    calendarYearItem: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    footer: {
        width: "100%",
    },
    calendar: {
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: "center",
        alignSelf: "center",
    },
    dateComponentYearText: {
        fontSize: 20
    },
    dateComponentDateView: {
        flex: 1, flexDirection: "row", marginTop: 10
    }
})