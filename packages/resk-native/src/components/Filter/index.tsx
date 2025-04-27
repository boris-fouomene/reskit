import i18n from "@resk/core/i18n";
import { areEquals, DateHelper, defaultNumber, defaultStr, isEmpty, isNonNullString, isObj, uniqid } from "@resk/core/utils";
import { ScrollView, ScrollViewProps, StyleSheet, View } from "react-native";
import { IDict, IFields, IFieldType, IMongoOperatorName, IMongoQuery } from "@resk/core/types";
import { MONGO_OPERATORS } from "@resk/core/filters";
import Component from "@utils/Component";
import { IFilterAction, IFilterActions, IFilterColumnName, IFilterGroupProps, IFilterGroupState, IFilterOnChangeOptions, IFilterOperator, IFilterOperators, IFilterProcessedProps, IFilterProps, IFilterRegexAction, IFilterState } from "./types";
import { Drawer } from "@components/Drawer";
import { Form } from "@components/Form";
import Notify from "@notify";
import { IMenuItemBase, IMenuItemProps, Menu } from "@components/Menu";
import InputFormatter from "@resk/core/inputFormatter";
import Theme from "@theme/index";
import getTextContent from "@utils/getTextContent";
import { HStack } from "@components/Stack";
import FontIcon from "@components/Icon/Font.server";
import { ActivityIndicator } from "@components/ActivityIndicator";
import TextInput from "@components/TextInput";
import { getToggleableDefaultValues, IToggleableProps } from "@components/Switch";
import { Fragment, useCallback, useContext, useMemo, useRef, createContext } from "react";
import useStateCallback from "@utils/stateCallback";
import { Auth, IAuthSessionStorage } from "@resk/core";


export default class Filter<DataType extends object = any, FieldType extends IFieldType = IFieldType> extends Component<IFilterProps<DataType, FieldType>, IFilterState> {
    readonly formName: string = uniqid("filter-form-named");
    readonly defaultName: string = uniqid("filter-default-name");
    readonly state: IFilterState = {} as IFilterState;
    readonly drawerRef: { current: typeof Drawer | null } = { current: null };
    constructor(props: IFilterProps<DataType, FieldType>) {
        super(props);
        Object.assign(this.state, this.processProps(props));
    }
    getStateProps(props: IFilterProps<DataType, FieldType>) {
        const { type, actions, action, operators } = props;
        return { type, actions, action, operators };
    }
    processProps(props?: IFilterProps<DataType, FieldType>): IFilterProcessedProps {
        let { type, actions: _actions, selectorActiveFieldName, name, operators: _operators, action, ignoreCase, operator, orOperator, andOperator, defaultValue, isFilter = false, ...rest } = isObj(props) && Object.getSize(props, true) ? props : this.props;
        type = type || "text";
        let operators: IFilterOperators = { ...Filter.OPERATORS };
        const arrayOperators: Record<IMongoOperatorName, string> = {} as any;
        const defaultActions: Record<IMongoOperatorName, string> = {} as any;
        const allActions = Filter.getOperators((operator, value) => {
            const isA = Filter.isArrayOperator(operator as any);
            if (isA) {
                arrayOperators[operator] = value;
            }
            if (!Filter.isLogicalOperator(operator) && !isA && !Filter.isRegexOperator(operator) && !["$not", "$options", "$regex", "$size", "$type"].includes(operator)) {
                defaultActions[operator] = value;
            }
            return true;
        });
        let actions: IFilterActions = { ...Filter.BETWEEN_ACTIONS, ...defaultActions };
        if (orOperator === false) {
            delete operators.$or;
        }
        if (andOperator === false) {
            delete operators.$and;
        }
        (ignoreCase as any) = typeof ignoreCase === "boolean" ? ignoreCase : true;
        let isTextFilter = false;
        if (type == "checkbox" || type == "switch") {
            action = action || "$eq";
        }
        if (type.includes("select")) {
            actions = Filter.ARRAY_ACTIONS;
        } else if (Filter.DATE_TYPES.includes(type)) {
            actions = { ...Filter.PERIOD_ACTIONS, ...actions };
            if (actions.$between) {
                delete actions.$between;
            }
        } else {
            if (type !== "number") {
                actions = { ...Filter.BETWEEN_ACTIONS, ...Filter.REGEX_ACTIONS, ...defaultActions };
            }
            isTextFilter = true;
        }
        if (Array.isArray(_actions) && _actions.length) {
            const acts = {} as IFilterActions;
            _actions.map((action: IFilterAction) => {
                if (isNonNullString(action)) {
                    const a = (allActions as any)[action];
                    if (a) {
                        acts[action] = a;
                    }
                }
            });
            if (Object.getSize(acts, true)) {
                actions = acts;
            }
        }
        if (Array.isArray(_operators)) {
            const ops: IFilterOperators = {} as IFilterOperators;
            _operators.map((operator) => {
                if (isNonNullString(operator)) {
                    const o = operators[operator as keyof typeof operators];
                    if (o) {
                        ops[operator as keyof typeof operators] = o;
                    }
                }
            });
            if (Object.getSize(ops, true)) {
                operators = ops;
            }
        }
        if (!isNonNullString(action)) {
            action = Filter.getDefaultAction(type);
        }
        (operator as any) = operator || "$and";
        if (areEquals(actions, Filter.ARRAY_ACTIONS) || type.includes("select")) {
            defaultValue = isNonNullString(defaultValue) ? defaultValue.split(",") : Array.isArray(defaultValue) ? defaultValue : !isEmpty(defaultValue) ? [defaultValue] : undefined;
        }
        let selectorFields: IFields = {};
        let hasSelectorFields = false;
        if (hasSelectorFields) {
            (selectorActiveFieldName as any) = isNonNullString(selectorActiveFieldName) ? selectorActiveFieldName : name;
            if (isNonNullString(selectorActiveFieldName)) {
                (selectorFields as any) = { [selectorActiveFieldName as string]: { ...rest, name }, ...selectorFields };
            }
            hasSelectorFields = !!selectorFields[selectorActiveFieldName as keyof typeof selectorFields];
        }
        const isNumberType = ["number", "decimal"].includes(String(type).toLowerCase().trim());
        if (!isNumberType) {
            delete actions.$mod;
        }
        return { actions, isNumber: isNumberType, selectorFields, hasSelectorFields, selectorActiveFieldName, action: action as IFilterAction, type, ignoreCase: ignoreCase as boolean, canIgnoreCase: isTextFilter && String(type).toLowerCase().includes("text"), operator: operator as IFilterOperator, operators, defaultValue, isFilter, isTextFilter };
    }
    componentDidUpdate(prevProps: Readonly<IFilterProps<DataType, FieldType>>, nextContext: any): void {
        if (areEquals(this.getStateProps(this.props as any), this.getStateProps(prevProps as any)) && this.compareValues(this.props.defaultValue, prevProps.defaultValue)) {
            return;
        }
        this.setState(this.processProps(this.props as any));
    }
    setSelectorField(selectorActiveFieldName: string) {
        this.handleChange({ selectorActiveFieldName } as IFilterState);
    }
    setOperator(operator: IFilterOperator) {
        this.handleChange({ operator } as IFilterState);
    }
    isToDaysAction(action?: IFilterAction): boolean {
        action = action || this.state.action;
        return !!Filter.TODAY_ACTIONS[action as keyof typeof Filter.TODAY_ACTIONS];
    }
    isBetweenAction(action?: IFilterAction): boolean {
        if (this.isToDaysAction(action)) return false;
        action = action || this.state.action;
        return !!(
            Filter.PERIOD_ACTIONS[action as keyof typeof Filter.PERIOD_ACTIONS] ||
            Filter.BETWEEN_ACTIONS[action as keyof typeof Filter.BETWEEN_ACTIONS]
        );
    }
    /**
     * Handles the modulo action by invoking the between action selector for the "$mod" operator.
     *
     * This method returns a promise that resolves to a tuple containing the divisor and remainder
     * for the modulo operation. The values are derived from the results of the between action selector.
     *
     * @returns {Promise<[number, number]>} A promise that resolves to an array with the divisor and
     * remainder values for the modulo operation.
     */
    handleModuloAction(): Promise<[divisor: number, reminder: number]> {
        return this.handleBetweenActionSelector("$mod").then(({ betweenStartValue, betweenEndValue }) => {
            return [betweenStartValue, betweenEndValue]
        });
    }
    setAction(action: IFilterAction) {
        const actionLower = defaultStr(action).toLowerCase();
        if (action === "$mod") {
            return this.handleModuloAction().then(([moduloDivisor, moduloRemainder]) => {
                return this.handleChange({ moduloDivisor, moduloRemainder, action } as IFilterState);
            })
        }
        if (this.isBetweenAction(action)) {
            if (actionLower.startsWith("$") && (actionLower.includes("week") || actionLower.includes("month"))) {
                let diff: { first: Date; last: Date } | undefined = undefined;
                const currentDate = new Date();
                currentDate.setHours(0);
                currentDate.setMinutes(0);
                currentDate.setSeconds(0);
                switch (action) {
                    case "$month":
                        diff = DateHelper.getCurrentMonthDaysRange(currentDate);
                        break;
                    case "$week":
                        diff = DateHelper.getCurrentWeekDaysRange(currentDate);
                        break;
                    case "$prevWeek":
                        diff = DateHelper.getPreviousWeekDaysRange(currentDate);
                        break;
                }
                if (diff) {
                    return this.handleChange({
                        action,
                        betweenStartValue: diff.first,
                        betweenEndValue: diff.last,
                    } as IFilterState);
                }
            }
            if (action === "$thisday") {
                const now = new Date();
                const start = new Date(now);
                start.setHours(0, 0, 0, 0);
                const end = new Date(now);
                end.setHours(23, 59, 59, 999); // almost midnight
                return this.handleChange({
                    action,
                    betweenStartValue: start,
                    betweenEndValue: end,
                } as IFilterState);
            }
            return this.handleBetweenActionSelector().then((data) => {
                this.handleChange({ ...data, action } as IFilterState);
            });
        }
        if (action == "$today") {
            return this.handleChange({
                value: new Date().resetHours().resetMinutes().resetSeconds().toSQLDateTimeFormat(),
                action,
            } as any);
        } else if (action == "$yesterday") {
            return this.handleChange({
                action,
                value: DateHelper.addDays(-1, new Date())
                    .resetHours()
                    .resetMinutes()
                    .resetSeconds()
                    .toSQLDateTimeFormat(),
            } as any);
        }
        this.handleChange({ action } as IFilterState);
    }
    getType(): IFieldType {
        return this.state.type;
    }
    isDateTime(): boolean {
        return defaultStr(this.getType()).toLowerCase().trim() == "datetime";
    }
    isDate(): boolean {
        return defaultStr(this.getType()).toLowerCase().trim() == "date";
    }
    isTime(): boolean {
        return defaultStr(this.getType()).toLowerCase().trim() == "time";
    }
    /***
     * retourne true si la valeeur start est supérieure à la valeur end
     */
    isStartBetweenValueGreterThanEnd(start: any, end: any): boolean {
        if (isNonNullString(start) && isNonNullString(end)) {
            return end.localeCompare(start) > 0;
        }
        return end > start;
    }
    handleBetweenActionSelector(action?: IFilterAction): Promise<{ betweenStartValue: any; betweenEndValue: any }> {
        const { betweenStartValue: start, betweenEndValue: end, moduloDivisor, moduloRemainder } = this.state;
        const isDateTime = this.isDateTime();
        const willHandleDate = this.isDate();
        const type = willHandleDate ? (isDateTime ? "datetime" : "date") : this.getType();
        const format = this.props.format;
        const formName = this.formName;
        let hasResolved = false;
        const isModulo = this.isModuloAction(action);
        return new Promise((resolve, reject) => {
            Form.Drawer.open({
                onDrawerClose: () => {
                    if (!hasResolved) {
                        reject();
                    }
                },
                appBarProps: {
                    title: this.props.label,
                    subtitle: this.translate("setStartAndEndValue"),
                    actions: [
                        {
                            label: this.translate("set"),
                            icon: "check",
                            formName,
                        },
                    ],
                },
                fields: {
                    start: {
                        format,
                        type,
                        label: this.translate(isModulo ? "moduloDivisor" : willHandleDate ? "periodFromDate" : "fromValue"),
                        required: true,
                        defaultValue: start || this.state.defaultValue,
                        responsive: true,
                        isFilter: true,
                    },
                    end: {
                        format,
                        type,
                        label: this.translate(isModulo ? "moduloRemainder" : willHandleDate ? "periodToDate" : "toValue"),
                        defaultValue: end,
                        required: true,
                        responsive: true,
                        isFilter: true,
                    },
                },
                onSubmit: ({ data }) => {
                    if (!this.isStartBetweenValueGreterThanEnd(data.start, data.end)) {
                        Notify.error(this.translate("endValueMustBeGreaterThanStartValue"));
                        return false;
                    }
                    if (isModulo && data.start === 0) {
                        Notify.error("moduloDividerMayNotBeNull");
                        return;
                    }
                    hasResolved = true;
                    Form.Drawer.close(() => {
                        resolve({ betweenStartValue: data.start, betweenEndValue: data.end });
                    }, this.drawerRef);
                }
            }, this.drawerRef);
        });
    }
    getMenuOperators() {
        const { operators, operator } = this.state;
        const result: IMenuItemBase[] = [];
        for (let i in operators) {
            const x = operators[i as IFilterOperator];
            result.push({
                label: x,
                icon: i === operator ? "check" : null,
                onPress: () => {
                    setTimeout(() => {
                        this.setOperator(i as IFilterOperator);
                    }, 300);
                },
            } as IMenuItemBase);
        }
        return result;
    }
    isModuloAction(action?: IFilterAction): boolean {
        return (action || this.state.action) === "$mod" && (this.isNumber() || ["number", "decimal"].includes(this.getType()));
    }
    getModuloText(): string {
        if (!this.isModuloAction()) return "";
        const divisor = defaultNumber(this.state.moduloDivisor);
        const remainder = defaultNumber(this.state.moduloRemainder);
        return (
            "%" +
            InputFormatter.formatValue({ ...this.props, type: this.getType(), value: divisor }) +
            "=" +
            InputFormatter.formatValue({ ...this.props, type: this.getType(), value: remainder })
        );
    }
    getBetweenText(): string {
        if (!this.isBetweenAction()) return "";
        const { betweenStartValue, betweenEndValue } = this.state;
        return (
            InputFormatter.formatValue({ ...this.props, type: this.getType(), value: betweenStartValue }) +
            "=>" +
            InputFormatter.formatValue({ ...this.props, type: this.getType(), value: betweenEndValue })
        );
    }
    hasFilterValue(): boolean {
        const { defaultValue } = this.state;
        if (this.isNumber() && defaultValue === 0 && this.state.handleZero) return true;
        return !isEmpty(defaultValue) || this.isBetweenAction();
    }
    getSelectorFieldsActions() {
        const { selectorActiveFieldName, selectorFields, hasSelectorFields } = this.state;
        if (!hasSelectorFields) return [];
        let activeLabel = "";
        const items: IMenuItemProps[] = [];
        for (let i in selectorFields) {
            const field = selectorFields[i as keyof typeof selectorFields];
            if (field.name === selectorActiveFieldName) {
                activeLabel = field.label;
            }
            let { label, name } = field;
            label = label || name;
            const isActive = this.state.selectorActiveFieldName === name;
            if (isActive) {
                activeLabel = `[${label}]`;
            }
            items.push({
                label,
                icon: isActive ? "check" : undefined,
                onPress: isActive
                    ? undefined
                    : () => {
                        setTimeout(() => {
                            this.setSelectorField(name);
                        }, 300);
                    },
            });
        }
        items.unshift({
            label: this.translate("searchInLabel", { label: defaultStr(activeLabel) }),
            divider: true,
            labelProps: this.getTitleLabelProps(),
        });
        if (items.length > 0) {
            items[items.length - 1].divider = true;
        }
        return items;
    }
    getMenuActions() {
        const result: IMenuItemBase[] = [];
        const { defaultValue, actions, action } = this.state;
        const hasFilterVal = this.hasFilterValue();
        const isBetweenAction = this.isBetweenAction(action);
        for (let i in actions) {
            let x = actions[i as IFilterAction];
            const checked = i === action ? true : false;
            if (checked && hasFilterVal) {
                const betweenText = isBetweenAction ? this.getBetweenText() : "";
                const isModulo = this.isModuloAction();
                if (isModulo) {
                    x = this.getModuloText();
                } else if (betweenText) {
                    x = x + " <" + betweenText + ">";
                } else {
                    x = x + " <" + InputFormatter.formatValue({ ...this.props, type: this.state.type, value: defaultValue }) + ">";
                }
            }
            const disabled = isBetweenAction
                ? this.isBetweenAction(i as IFilterAction)
                    ? false
                    : true
                : false;
            result.push({
                label: String(x),
                icon: checked ? "check" : null,
                disabled,
                onPress: disabled
                    ? undefined
                    : () => {
                        setTimeout(() => {
                            this.setAction(i as IFilterAction);
                        }, 300);
                    },
            });
        }
        return result;
    }
    clearFilter() {
        const prepared = this.processProps({
            ...this.props,
            defaultValue: undefined,
            action: undefined,
        } as any);
        this.handleChange(
            prepared as IFilterState,
            {
                defaultValue: prepared.defaultValue,
                betweenStartValue: undefined,
                betweenEndValue: undefined,
            } as IFilterState
        );
    }
    getTitleLabelProps() {
        return { style: [Theme.styles.fontBold, styles.noVerticalPadding] };
    }
    render() {
        const {
            testID: customTestID,
            label: customLabel,
            isLoading,
            filter,
            visible,
            filterable,
            ...props
        } = this.getComponentProps();
        if (filterable === false) return null;
        const { label: customLabel2, renderLabel, ...componentProps2 } = this.props;
        const { type, isTextFilter, defaultValue, ignoreCase, canIgnoreCase } = this.state;
        const Component = Form.Field.getRegisteredComponent(type) || Form.Field;
        const testID = defaultStr(customTestID, `resk-filter-${this.props?.name || ""}`);
        const hasFilterVal = this.hasFilterValue();
        const anchorProps = Object.assign({}, (this.props as any).anchorProps);
        const titleLabelProps = this.getTitleLabelProps();
        const label = getTextContent(customLabel);
        const restProps = isTextFilter
            ? {
                debounceTimeout: 1000,
                mode: "flat",
                placeholder: "Search...",
                left: <FontIcon name="magnify" size={25} />,
            }
            : { textFieldMode: "flat", mode: "flat" };
        const isBetweenAction = this.isBetweenAction(), isModuloAction = this.isModuloAction();
        return (
            <View style={[styles.container]} testID={testID + "-filter-container"}>
                <HStack style={[styles.contentContainer]} testID={testID + "-filter-content-container"}>
                    <Drawer.Provider ref={this.drawerRef as any} />
                    {isBetweenAction || isModuloAction ? (
                        <View style={styles.componentContainer}>
                            <TextInput
                                variant={"labelEmbeded"}
                                label={this.props.label}
                                defaultValue={isBetweenAction ? this.getBetweenText() : this.getModuloText()}
                                readOnly={true}
                                style={[Theme.styles.bgTransparent]}
                            />
                        </View>
                    ) : (
                        <View style={styles.componentContainer}>
                            <Component
                                variant={"labelEmbeded"}
                                {...componentProps2}
                                label={this.props.label}
                                formName={this.formName}
                                {...restProps}
                                datePickerProps={{ mode: "single" }}
                                affix={false}
                                underlineColor="transparent"
                                name={this.props.name}
                                {...(props as any)}
                                isFilter
                                type={type}
                                style={[Theme.styles.bgTransparent, (props as any).style]}
                                defaultValue={defaultValue || this.props.defaultValue}
                                testID={testID}
                                onChange={this.handleChange.bind(this)}
                            />
                        </View>
                    )}
                    {isLoading ? (<ActivityIndicator size="small" animating />) : (
                        <Menu
                            testID={testID + "-menu"}
                            responsive={true}
                            anchor={<View>
                                <FontIcon
                                    {...props}
                                    size={25}
                                    style={[
                                        Theme.styles.noPadding,
                                        hasFilterVal && { color: Theme.colors.primary },
                                        Theme.styles.mt0,
                                        Theme.styles.mb0,
                                        Theme.styles.ml0,
                                        anchorProps.style,
                                    ]}
                                    name={hasFilterVal ? "filter-menu" : "filter-plus"}
                                />
                            </View>}
                            items={[
                                ...(label
                                    ? [
                                        {
                                            label: `Filtre [${label}]`,
                                            divider: true,
                                            labelProps: {
                                                ...titleLabelProps,
                                                style: [titleLabelProps.style, Theme.styles.pt0, Theme.styles.mt0],
                                            },
                                        },
                                    ]
                                    : []),
                                hasFilterVal
                                    ? {
                                        label: "Clear filter",
                                        icon: "filter-remove",
                                        onPress: this.clearFilter.bind(this),
                                    }
                                    : undefined,
                                ...this.getSelectorFieldsActions(),
                                canIgnoreCase
                                    ? {
                                        label: "Ignor Case",
                                        icon: ignoreCase ? "check" : null,
                                        onPress: () => {
                                            this.handleChange({ ignoreCase: !ignoreCase } as IFilterState);
                                        },
                                        divider: true,
                                    }
                                    : null,
                                {
                                    label: "Opérateurs",
                                    closeOnPress: false,
                                    labelProps: titleLabelProps,
                                    divider: true,
                                },
                                ...this.getMenuOperators(),
                                { divider: true },
                                {
                                    label: "Actions",
                                    closeOnPress: false,
                                    labelProps: titleLabelProps,
                                    divider: true,
                                },
                                this.isNumber() && false
                                    ? {
                                        label: "Traitez la valeur 0",
                                        icon: this.state.handleZero ? "check" : null,
                                        onPress: () => {
                                            this.handleChange({
                                                handleZero: !!!this.state.handleZero,
                                            } as IFilterState);
                                        },
                                    }
                                    : null,
                                ...this.getMenuActions(),
                            ]}
                        />
                    )}
                </HStack>
            </View>
        );
    }
    getComponentProps(props?: IFilterProps<DataType, FieldType>): IFilterProps<DataType, FieldType> {
        const comProps = Object.assign({}, this.props, props);
        if (["checkbox", "switch"].includes(comProps?.type ?? "")) {
            (comProps as any).type = "select";
            const selectValue = this.translate("selectValue");
            const togglableProps = Object.assign({}, comProps, { placeholder: selectValue }) as IToggleableProps;
            const { checkedValue, uncheckedValue } = getToggleableDefaultValues(togglableProps);
            const { checkedLabel, uncheckedLabel } = togglableProps;
            if (!Array.isArray((comProps as any).items) || !(comProps as any).items.length) {
                (comProps as any).items = [
                    { value: checkedValue, label: checkedLabel || i18n.translate("yes") },
                    { value: uncheckedValue, label: uncheckedLabel || i18n.translate("no") },
                ];
            }
            (comProps as any).placeholder = (comProps as any).placeholder || selectValue;
        }
        if ((comProps as any)?.multiple !== false && defaultStr(comProps?.type).toLowerCase().trim().includes("select")) {
            (comProps as any).multiple = true;
        }
        return comProps;
    }
    getName(): string {
        return defaultStr(this.props.name, this.defaultName);
    }
    isNumber() {
        return !!this.state.isNumber;
    }
    compareValues(value1: any, value2: any) {
        const isNum = this.isNumber();
        const canotHandleZero = true || !this.state.handleZero;
        if (isEmpty(value1) || (isNum && value1 === 0 && canotHandleZero)) {
            value1 = "";
        }
        if (isEmpty(value2) || (isNum && value2 === 0 && canotHandleZero)) {
            value2 = "";
        }
        return areEquals(value1, value2);
    }
    handleChange(
        options: IFilterOnChangeOptions<DataType, FieldType> | IFilterState,
        newState?: IFilterState
    ) {
        if (!options) return;
        let isEquals = true;
        const nState: IFilterState = Object.assign({}, newState) as IFilterState;
        if ("value" in options) {
            if (this.compareValues(options.value, this.state.defaultValue)) return;
            nState.defaultValue = options.value;
            isEquals = false;
        }
        [
            "action",
            "operator",
            "ignoreCase",
            "handleZero",
            "betweenStartValue",
            "betweenEndValue",
            "selectorActiveFieldName",
            "moduloDivisor",
            "moduloRemainder",
        ].map((i) => {
            if (i in options) {
                const optionValue = (options as any)[i];
                const stateValue = this.state[i as keyof IFilterState];
                if (isEquals && !this.compareValues(optionValue, stateValue)) {
                    isEquals = false;
                }
                nState[i as keyof IFilterState] = optionValue;
            }
        });
        if (newState) {
            Object.assign(nState, newState);
        } else if (isEquals) return;
        const extraOptions: IDict = {};
        this.setState(nState as IFilterState, () => {
            let {
                action,
                operator,
                defaultValue: value,
                ignoreCase,
                betweenStartValue,
                betweenEndValue,
            } = this.state;
            const defaultValue = value;
            if (this.isNumber() && String(value).trim() === "0") {
                value = undefined;
            }
            if (isNonNullString(action)) {
                if (this.isToDaysAction(action)) {
                    action = "$eq";
                } else if (action.startsWith("$regex")) {
                    const r = action.ltrim("$regex");
                    extraOptions.rawValue = value;
                    const f = Filter.REGEX_EXPRESSIONS[r as keyof typeof Filter.REGEX_EXPRESSIONS];
                    if (f && typeof f.convert === "function") {
                        value = f.convert(value);
                    }
                    if (isNonNullString(value)) {
                        try {
                            extraOptions.action = String(action).toLowerCase().ltrim("$regex");
                            extraOptions.ignoreCase = !!ignoreCase;
                            value = RegExp(value.ltrim("/").rtrim("/")).toString().replace(/\\/g, "\\\\");
                            if (ignoreCase) {
                                extraOptions.$options = "i";
                            }
                            value = {
                                ...extraOptions,
                                $regex: value,
                            };
                        } catch { }
                    }
                    action = "$regex";
                }
                /*         if (action == "$nin" && Array.isArray(value)) {
                  value.push("");
                } */
            }
            const { hasSelectorFields, selectorActiveFieldName, selectorFields } = this.state;
            const sField =
                (hasSelectorFields &&
                    selectorFields[selectorActiveFieldName as keyof typeof selectorFields]) ||
                null;
            const name = defaultStr(
                sField?.databaseName,
                sField?.name,
                this.props.databaseName,
                this.getName()
            );
            const mango: IMongoQuery<Record<typeof name, any>> = {
                [name]: {
                    [action]: value,
                },
            };
            if (this.isModuloAction(action)) {
                mango[name][action] = [this.state.moduloDivisor, this.state.moduloRemainder];
            }
            if (action.startsWith("$regex")) {
                mango[name].$options = this.state.ignoreCase !== false ? "i" : "";
            }
            if (this.isBetweenAction(action)) {
                mango[name] = {
                    $gte: betweenStartValue,
                    $lte: betweenEndValue,
                };
            }
            if (typeof this.props.onChange === "function") {
                const { type, ...nState } = this.state;
                delete options.type;
                return this.props.onChange({
                    name: this.getName(),
                    ...Object.assign({}, options),
                    ...nState,
                    value: defaultValue,
                    mango,
                });
            }
        });
    }
    /**
     * Translates the given key using the i18n default instance, ensuring that the
     * key is prefixed with the filter translation key.
     *
     * @param {string} key - The key to translate.
     * @param {Object} [options] - Optional options to pass to the translation function.
     *
     * @returns {T} - The translated string, or the translated value of type T if the key returns a non-string value.
     * @example
     * // Translate the "selectAll" property.
     * const selectAllLabel = DatagridView.staticTranslate("selectAll"); // "Select all"
     */
    static staticTranslate<T = string>(key: string, options?: Parameters<typeof i18n.translate>[1]): T {
        return i18n.t<T>(this.getI18nTranslationKey(key), options) as T;
    }
    /**
     * Translates the given MongoDB operator name using the i18n default instance.
     *
     * This method ensures that the operator key is prefixed with the "operators"
     * translation key, allowing for consistent translation of MongoDB operator names.
     *
     * @param {IMongoOperatorName} operator - The MongoDB operator name to translate.
     * @returns {string} - The translated operator name.
     */
    static translateOperator(operator: IMongoOperatorName | string) {
        return Filter.staticTranslate<string>(`operators.${defaultStr(operator).trim()}`);
    }

    /**
     * Returns an object mapping all MongoDB operator names to their translated names.
     *
     * This method is useful for generating a list of all MongoDB operators and their
     * translated names. The resulting object can be used to populate a dropdown or
     * other UI element with the list of operators.
     *
     * The translation key for each operator is of the form `components.filter.operators.${operator}`,
     * where `${operator}` is the MongoDB operator name.
     *
     * If a translation is not found for an operator, the operator name is returned as the translated name.
     * @param {(operatorName:IMongoOperatorName,translatedOperatorName:string)=>boolean} filter - An optional filter function to filter the operators.
     *
     * @returns {Record<IMongoOperatorName, string>} - An object mapping each MongoDB operator name to its translated name.
     */
    static getOperators(filter?: (operatorName: IMongoOperatorName, translatedOperatorName: string) => boolean): Record<IMongoOperatorName, string> {
        const r = Object.assign({}, this.staticTranslate<Record<IMongoOperatorName, string>>("operators")) as Record<IMongoOperatorName, string>;
        const r2 = {} as Record<IMongoOperatorName, string>;
        const f = typeof filter == "function" ? filter : () => true;
        MONGO_OPERATORS.ALL.map((operator) => {
            const value = defaultStr(r[operator], operator);
            if (f(operator, value)) {
                r2[operator] = value;
            }
        });
        return r2;
    }

    /**
     * Determines if the given operator is a logical operator.
     * 
     * This method checks if the given operator is in the list of logical operators
     * defined in `MONGO_OPERATORS.LOGICAL`.
     * 
     * @param {IMongoOperatorName} operator - The operator to check.
     * 
     * @returns {boolean} - `true` if the operator is a logical operator, `false` otherwise.
     */
    static isLogicalOperator(operator: IMongoOperatorName) {
        if (!isNonNullString(operator)) return false;
        return MONGO_OPERATORS.LOGICAL.includes(operator as any);
    }
    /**
     * Determines if the given operator is a comparison operator.
     * 
     * This method checks if the given operator is in the list of comparison operators
     * defined in `MONGO_OPERATORS.COMPARAISON`.
     * 
     * @param {IMongoOperatorName} operator - The operator to check.
     * 
     * @returns {boolean} - `true` if the operator is a comparison operator, `false` otherwise.
     */
    static isComparisonOperator(operator: IMongoOperatorName) {
        if (!isNonNullString(operator)) return false;
        return MONGO_OPERATORS.COMPARAISON.includes(operator as any);
    }

    /**
     * Determines if the given operator is a regex operator.
     * 
     * This method checks if the provided operator is a non-null string
     * and starts with the "$regex" prefix, indicating it as a regex operator.
     * 
     * @param {IMongoOperatorName} operator - The operator to check.
     * 
     * @returns {boolean} - `true` if the operator is a regex operator, `false` otherwise.
     */

    static isRegexOperator(operator: IMongoOperatorName) {
        if (!isNonNullString(operator)) return false;
        return operator.startsWith("$regex");
    }
    /**
     * Gets the translation key for a given key in the filter.
     * 
     * The translation key is of the form `components.filter.${key}`.
     * 
     * @param {string} key - The key to get the translation key for.
     * 
     * @returns {string} - The translation key for the given key.
     */
    static getI18nTranslationKey(key: string): string {
        return `components.filter.${defaultStr(key).trim()}`;
    }
    /**
     * Translates the given key using the i18n default instance, ensuring that the
     * key is prefixed with the filter translation key.
     *
     * @param {string} key - The key to translate.
     * @param {Object} [options] - Optional options to pass to the translation function.
     *
     * @returns {T} - The translated string, or the translated value of type T if the key returns a non-string value.
     * @example
     * // Translate the "selectAll" property.
     * const selectAllLabel = this.translate("selectAll"); // "Select all"
     */
    translate<T = string>(key: string, options?: Parameters<typeof i18n.translate>[1]): T {
        return Filter.staticTranslate<T>(key, options);
    }
    static readonly DATE_TYPES: IFieldType[] = ["date", "time", "datetime"];
    static getDefaultAction(type?: IFieldType): IFilterAction {
        const _type = defaultStr(type, "text").toLowerCase();
        if (_type.includes("select")) {
            return "$in";
        }
        if (Filter.DATE_TYPES.includes(type as IFieldType)) return "$eq";
        if (type !== "number") {
            return "$regexcontains";
        }
        return "$eq";
    };

    static toMongoRegex = (val: string, comparator: IFilterRegexAction): string => {
        if (!isNonNullString(val) || !isNonNullString(comparator) || !Filter.REGEX_EXPRESSIONS[comparator]) return "";
        const rOp = Filter.REGEX_EXPRESSIONS[comparator];
        return rOp.left + Filter.escapeRegexChars(val) + rOp.right;
    }
    static readonly REGEX_EXPRESSIONS: Record<IFilterRegexAction, { left: string; right: string; convert: (value: string) => string }> = {
        $regexnotcontains: {
            left: "^((?!(",
            right: ")).)*$",
            convert: (val: string): string => {
                return Filter.toMongoRegex(val, "$regexnotcontains");
            }
        },
        $regexnotequals: {
            left: "^(?!",
            right: "$).*$",
            convert: (val: string): string => {
                return Filter.toMongoRegex(val, "$regexnotequals");
            }
        },
        $regexequals: {
            left: "^",
            right: "$",
            convert: (val: string): string => {
                return Filter.toMongoRegex(val, "$regexequals");
            }
        },
        $regexstartswith: {
            left: "^",
            right: "",
            convert: (val: string): string => {
                return Filter.toMongoRegex(val, "$regexstartswith");
            }
        },
        $regexendswith: {
            left: "",
            right: "$",
            convert: (val: string): string => {
                return Filter.toMongoRegex(val, "$regexendswith");
            }
        },
        $regexcontains: {
            left: ".*",
            right: ".*",
            convert: (val: string): string => {
                return Filter.toMongoRegex(val, "$regexcontains");
            }
        },
    };
    /**
     * Escapes regex characters in a given string.
     *
     * This method takes a given string and escapes all regex special characters
     * by prefixing them with a backslash. If the input value is not a non-null string,
     * an empty string is returned.
     *
     * @param {string} value - The string to escape regex characters in.
     *
     * @returns {string} - The string with all regex special characters escaped.
     */
    static escapeRegexChars(value: string): string {
        if (!isNonNullString(value)) return "";
        ["!", "^", "$", "(", ")", "[", "]", "{", "}", "?", "+", "*", ".", "/", "\\", "|"].map((char) => {
            value = value.replace(char, "\\" + char);
        });
        return value.toString();
    }
    static readonly TODAY_ACTIONS = {
        get $yesterday() {
            return Filter.translateOperator("$yesterday");
        },
        get $today() {
            return Filter.translateOperator("$today");
        },
    };
    static readonly PERIOD_ACTIONS = {
        ...Filter.TODAY_ACTIONS,
        get $prevWeek() {
            return Filter.translateOperator("$prevWeek");
        },
        get $week() {
            return Filter.translateOperator("$week");
        },
        get $month() {
            return Filter.translateOperator("$month");
        },
        get $period() {
            return Filter.translateOperator("$period");
        },
    };
    static readonly OPERATORS: Record<IFilterOperator, string> = {
        get $and() {
            return Filter.translateOperator("$and");
        }, //Array	Matches if all the selectors in the array match.
        get $or() {
            return Filter.translateOperator("$or");
        }, //Array	Matches if any of the selectors in the array match. All selectors must use the same index.
        get $nor() {
            return Filter.translateOperator("$nor");
        }, //Array	Matches if none of the selectors in the array match. All selectors must use the same index.
    };
    static readonly BETWEEN_ACTIONS = {
        get $between() {
            return Filter.translateOperator("$between");
        },
        get $thisday() {
            return Filter.translateOperator("$thisday");
        }
    };
    /**
     * Checks if the given action is an array action.
     *
     * Checks if the given action is an array action by checking if the action is a string and if it is included in the array of array operators.
     *
     * @param {IFilterAction} [action] - The action to check.
     *
     * @returns {boolean} - True if the action is an array action, false otherwise.
     */
    static isArrayOperator(action?: IFilterAction): boolean {
        if (!isNonNullString(action)) return false;
        return MONGO_OPERATORS.ARRAY.includes(action as any);
    }
    static readonly ARRAY_ACTIONS = {
        get $in() {
            return Filter.translateOperator("$in");
        }, //Array of JSON values	The document field must exist in the list provided.
        get $nin() {
            return Filter.translateOperator("$nin");
        }, //Array of JSON values	The document field not must exist in the list provided.
        get $all() {
            return Filter.translateOperator("$all");
        }, //Array	Matches if all the specified values exist in an array field.
        get $elemMatch() {
            return Filter.translateOperator("$elemMatch");
        }, //Selects documents where the array field is an array that contains at least one element matching all the specified query criteria.
    };
    static readonly REGEX_ACTIONS: Record<IFilterRegexAction, string> = {
        get $regexequals() {
            return Filter.translateOperator("regexEquals");
        },
        get $regexcontains() {
            return Filter.translateOperator("regexContains");
        },
        get $regexnotcontains() {
            return Filter.translateOperator("regexNotContains");
        },
        get $regexnotequals() {
            return Filter.translateOperator("regexNotequals");
        },
        get $regexstartswith() {
            return Filter.translateOperator("regexStartswith");
        },
        get $regexendswith() {
            return Filter.translateOperator("regexEndswith");
        },
    }
    static Group<DataType extends object = any>({ withScrollView, style, scrollViewProps, sessionName, columns, testID, ...props }: IFilterGroupProps<DataType>) {
        testID = defaultStr(testID, "resk-filter");
        const sessionStorage = useMemo<IAuthSessionStorage | null>(() => {
            if (isNonNullString(sessionName)) {
                return Auth.Session.getStorage(sessionName);
            }
            return null;
        }, [sessionName]);
        const sessionData = Object.assign({}, sessionStorage?.getData());
        const { filterableColumns, columnsByNames } = useMemo(() => {
            const cols: Array<IFilterProps<DataType>> = [];
            const columnsByNames: Record<string, IFilterProps<DataType>> = {};
            if (Array.isArray(columns)) {
                columns.map((col) => {
                    if (!isObj(col) || col.filterable === false || !isNonNullString(col.name)) return;
                    const newColumn = Object.clone(col);
                    cols.push(newColumn);
                    columnsByNames[col.name] = newColumn;
                })
            }
            return { filterableColumns: cols, columnsByNames };
        }, [columns]);
        const filteredColumns = useMemo(() => {
            const columns = Array.isArray(sessionData.columns) ? sessionData.columns : [];
            return columns.filter((column) => {
                if (!isObj(column) || !isNonNullString(column.name)) return false;
                return filterableColumns.some((col) => {
                    return col.name === column.name;
                })
            })
        }, [filterableColumns, sessionData]);
        const [state, setState] = useStateCallback<IFilterGroupState<DataType>>({
            columns: filteredColumns
        });
        const getColumn = useCallback((columnName: IFilterColumnName<DataType>) => {
            if (!isNonNullString(columnName)) return null;
            return columnsByNames[columnName] || null;
        }, [columnsByNames]);
        const { Wrapper, wrapperProps } = useMemo(() => {
            return {
                Wrapper: withScrollView !== false ? ScrollView : Fragment,
                wrapperProps: withScrollView !== false ? Object.assign({}, { horizontal: true }, scrollViewProps, {
                    style: [styles.filterGroupScrollView, scrollViewProps?.style],
                    contentContainerStyle: [styles.filterGroupContentContainerStyle, scrollViewProps?.contentContainerStyle],
                }) as ScrollViewProps : {}
            }
        }, [withScrollView, scrollViewProps]);
        return <View testID={testID} {...props} style={[styles.filterGroup, style]}>
            <Wrapper {...wrapperProps}>
                <FilterGroupContext.Provider value={{ getColumn, testID }}>
                    {state.columns.map((col, index) => <FilterGroupItem {...col} />)}
                </FilterGroupContext.Provider>
            </Wrapper>
        </View>
    }
}
const FilterGroupContext = createContext<{
    testID: string,
    getColumn: (columnName: IFilterColumnName<any>) => IFilterProps<any> | null;
}>({} as any);

const useFilterGroup = () => {
    return useContext(FilterGroupContext);
}
function FilterGroupItem<DataType extends object = any>({ name, value, key: customKey, ...rest }: IFilterGroupState<DataType>["columns"][number]) {
    const { getColumn, testID } = useFilterGroup();
    const key = useRef(defaultStr(customKey, uniqid("filter-group-item"))).current;
    const col = getColumn(name);
    if (!col) return null;
    return <View testID={testID + "-filter-container-" + { name } + "-index"} style={styles.filterGroupItemContainer}>
        <Filter {...col} {...rest} defaultValue={value} key={key} />
    </View>
}
/**
 * le composant Filter hérite du composant Field de formField en ajoutant des fonctions spécifiques liées au filtrage des données
 */
const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignSelf: "flex-start",
    },
    componentContainer: {
        alignSelf: "flex-start",
    },
    contentContainer: {
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    noVerticalPadding: {
        paddingVertical: 7,
    },
    divider: {
        marginTop: 3,
    },
    filterGroupContentContainerStyle: {
        minWidth: '100%',
    },
    filterGroupScrollView: {
        width: '100%',
    },
    filterGroup: {
        width: "100%",
    },
    filterGroupItemContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginHorizontal: 5,
    }
});