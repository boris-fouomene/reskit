import { i18n } from "@resk/core/i18n";
import { areEquals, DateHelper, defaultNumber, defaultStr, isEmpty, isNonNullString, isObj, uniqid } from "@resk/core/utils";
import { ScrollView, ScrollViewProps, StyleSheet, View } from "react-native";
import { IDict, IFields, IFieldType, IMongoOperatorName, IMongoQuery } from "@resk/core/types";
import { MONGO_OPERATORS } from "@resk/core/filters";
import Component from "@utils/Component";
import { IFilterAction, IFilterActions, IFilterColumnName, IFilterGroupContext, IFilterGroupProps, IFilterGroupState, IFilterGroupStateColumn, IFilterOnChangeOptions, IFilterOperator, IFilterOperators, IFilterProcessedProps, IFilterProps, IFilterRegexAction, IFilterState } from "./types";
import { Drawer } from "@components/Drawer";
import { Form } from "@components/Form";
import Notify from "@notify";
import { IMenuItemBase, IMenuItemProps, Menu } from "@components/Menu";
import InputFormatter from "@resk/core/inputFormatter";
import Theme from "@theme/index";
import getTextContent from "@utils/getTextContent";
import { HStack } from "@components/Stack";
import { ActivityIndicator } from "@components/ActivityIndicator";
import TextInput from "@components/TextInput";
import { getToggleableDefaultValues, IToggleableProps } from "@components/Switch";
import { Fragment, useCallback, useContext, useMemo, useRef, createContext } from "react";
import useStateCallback from "@utils/stateCallback";
import { Auth, IAuthSessionStorage } from "@resk/core";
import FontIcon from "@components/Icon/Font";
import { Label } from "@components/Label";
import { Button } from "@components/Button";


/**
 * The `Filter` class is a React component that provides a flexible and extensible filtering mechanism.
 * It supports various filter types, operators, and actions, allowing users to filter data based on
 * different criteria. The component is designed to handle complex filtering scenarios, including
 * date ranges, regex-based filtering, and logical operators.
 *
 * @template DataType - The type of data being filtered. Defaults to `any`.
 * @template FieldType - The type of field being filtered. Defaults to `IFieldType`.
 *
 * @extends Component<IFilterProps<DataType, FieldType>, IFilterState>
 *
 * @property {string} formName - A unique identifier for the filter form.
 * @property {string} defaultName - A unique default name for the filter.
 * @property {IFilterState} state - The current state of the filter.
 * @property {{ current: typeof Drawer | null }} drawerRef - A reference to the Drawer component.
 *
 * @method getStateProps - Extracts specific properties from the component's props.
 * @param {IFilterProps<DataType, FieldType>} props - The component's props.
 * @returns {Partial<IFilterState>} - The extracted state properties.
 *
 * @method processProps - Processes the component's props to derive the initial state and other properties.
 * @param {IFilterProps<DataType, FieldType>} [props] - The component's props.
 * @returns {IFilterProcessedProps} - The processed properties.
 *
 * @method componentDidUpdate - React lifecycle method that updates the state when props change.
 * @param {Readonly<IFilterProps<DataType, FieldType>>} prevProps - The previous props.
 * @param {any} nextContext - The next context.
 *
 * @method setSelectorField - Sets the active selector field.
 * @param {string} selectorActiveFieldName - The name of the active selector field.
 *
 * @method setOperator - Sets the filter operator.
 * @param {IFilterOperator} operator - The operator to set.
 *
 * @method isToDaysAction - Checks if the given action is a "today" action.
 * @param {IFilterAction} [action] - The action to check.
 * @returns {boolean} - `true` if the action is a "today" action, `false` otherwise.
 *
 * @method isBetweenAction - Checks if the given action is a "between" action.
 * @param {IFilterAction} [action] - The action to check.
 * @returns {boolean} - `true` if the action is a "between" action, `false` otherwise.
 *
 * @method handleModuloAction - Handles the modulo action by invoking the between action selector.
 * @returns {Promise<[number, number]>} - A promise that resolves to an array with the divisor and remainder values.
 *
 * @method setAction - Sets the filter action and handles specific actions like "between" and "modulo".
 * @param {IFilterAction} action - The action to set.
 *
 * @method getType - Gets the type of the filter field.
 * @returns {IFieldType} - The type of the filter field.
 *
 * @method isDateTime - Checks if the filter type is "datetime".
 * @returns {boolean} - `true` if the filter type is "datetime", `false` otherwise.
 *
 * @method isDate - Checks if the filter type is "date".
 * @returns {boolean} - `true` if the filter type is "date", `false` otherwise.
 *
 * @method isTime - Checks if the filter type is "time".
 * @returns {boolean} - `true` if the filter type is "time", `false` otherwise.
 *
 * @method isStartBetweenValueGreterThanEnd - Checks if the start value is greater than the end value.
 * @param {any} start - The start value.
 * @param {any} end - The end value.
 * @returns {boolean} - `true` if the start value is greater than the end value, `false` otherwise.
 *
 * @method handleBetweenActionSelector - Handles the "between" action by opening a drawer for user input.
 * @param {IFilterAction} [action] - The action to handle.
 * @returns {Promise<{ betweenStartValue: any; betweenEndValue: any }>} - A promise that resolves to the start and end values.
 *
 * @method getMenuOperators - Gets the menu items for the filter operators.
 * @returns {IMenuItemBase[]} - An array of menu items for the operators.
 *
 * @method isModuloAction - Checks if the given action is a "modulo" action.
 * @param {IFilterAction} [action] - The action to check.
 * @returns {boolean} - `true` if the action is a "modulo" action, `false` otherwise.
 *
 * @method getModuloText - Gets the text representation of the "modulo" action.
 * @returns {string} - The text representation of the "modulo" action.
 *
 * @method getBetweenText - Gets the text representation of the "between" action.
 * @returns {string} - The text representation of the "between" action.
 *
 * @method hasFilterValue - Checks if the filter has a value.
 * @returns {boolean} - `true` if the filter has a value, `false` otherwise.
 *
 * @method getSelectorFieldsActions - Gets the menu items for the selector fields.
 * @returns {IMenuItemProps[]} - An array of menu items for the selector fields.
 *
 * @method getMenuActions - Gets the menu items for the filter actions.
 * @returns {IMenuItemBase[]} - An array of menu items for the actions.
 *
 * @method clearFilter - Clears the filter value and resets the state.
 *
 * @method getTitleLabelProps - Gets the props for the title label.
 * @returns {object} - The props for the title label.
 *
 * @method render - Renders the filter component.
 * @returns {ReactElement | null} - The rendered component.
 *
 * @method getComponentProps - Gets the component props, including default values and overrides.
 * @param {IFilterProps<DataType, FieldType>} [props] - The component props.
 * @returns {IFilterProps<DataType, FieldType>} - The processed component props.
 *
 * @method getName - Gets the name of the filter.
 * @returns {string} - The name of the filter.
 *
 * @method isNumber - Checks if the filter type is "number".
 * @returns {boolean} - `true` if the filter type is "number", `false` otherwise.
 *
 * @method compareValues - Compares two values for equality.
 * @param {any} value1 - The first value.
 * @param {any} value2 - The second value.
 * @returns {boolean} - `true` if the values are equal, `false` otherwise.
 *
 * @method handleChange - Handles changes to the filter state and triggers the `onChange` callback.
 * @param {IFilterOnChangeOptions<DataType, FieldType> | IFilterState} options - The change options.
 * @param {IFilterState} [newState] - The new state to set.
 *
 * @method translate - Translates a given key using the i18n instance.
 * @param {string} key - The key to translate.
 * @param {object} [options] - Optional translation options.
 * @returns {T} - The translated value.
 *
 * @static
 * @method staticTranslate - Translates a given key using the i18n instance (static version).
 * @param {string} key - The key to translate.
 * @param {object} [options] - Optional translation options.
 * @returns {T} - The translated value.
 *
 * @static
 * @method translateOperator - Translates a MongoDB operator name.
 * @param {IMongoOperatorName | string} operator - The operator name to translate.
 * @returns {string} - The translated operator name.
 *
 * @static
 * @method getOperators - Gets all MongoDB operators and their translated names.
 * @param {(operatorName: IMongoOperatorName, translatedOperatorName: string) => boolean} [filter] - An optional filter function.
 * @returns {Record<IMongoOperatorName, string>} - An object mapping operator names to their translations.
 *
 * @static
 * @method isLogicalOperator - Checks if the given operator is a logical operator.
 * @param {IMongoOperatorName} operator - The operator to check.
 * @returns {boolean} - `true` if the operator is a logical operator, `false` otherwise.
 *
 * @static
 * @method isComparisonOperator - Checks if the given operator is a comparison operator.
 * @param {IMongoOperatorName} operator - The operator to check.
 * @returns {boolean} - `true` if the operator is a comparison operator, `false` otherwise.
 *
 * @static
 * @method isRegexOperator - Checks if the given operator is a regex operator.
 * @param {IMongoOperatorName} operator - The operator to check.
 * @returns {boolean} - `true` if the operator is a regex operator, `false` otherwise.
 *
 * @static
 * @method getI18nTranslationKey - Gets the translation key for a given key in the filter.
 * @param {string} key - The key to get the translation key for.
 * @returns {string} - The translation key.
 *
 * @static
 * @method getDefaultAction - Gets the default action for a given field type.
 * @param {IFieldType} [type] - The field type.
 * @returns {IFilterAction} - The default action.
 *
 * @static
 * @method toMongoRegex - Converts a value to a MongoDB regex string.
 * @param {string} val - The value to convert.
 * @param {IFilterRegexAction} comparator - The regex comparator.
 * @returns {string} - The MongoDB regex string.
 *
 * @static
 * @method escapeRegexChars - Escapes regex characters in a string.
 * @param {string} value - The string to escape.
 * @returns {string} - The escaped string.
 *
 * @static
 * @method isArrayOperator - Checks if the given action is an array operator.
 * @param {IFilterAction} [action] - The action to check.
 * @returns {boolean} - `true` if the action is an array operator, `false` otherwise.
 *
 * @static
 * @method Group - Renders a filter group with a list of filters.
 * @template DataType - The type of data being filtered.
 * @param {IFilterGroupProps<DataType>} props - The filter group props.
 * @returns {ReactElement} - The rendered filter group.
 */
export class Filter<DataType extends object = any, FieldType extends IFieldType = IFieldType> extends Component<IFilterProps<DataType, FieldType>, IFilterState> {
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
        type = (type || "text") as any;
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
            (defaultValue as any) = isNonNullString(defaultValue) ? defaultValue.split(",") : Array.isArray(defaultValue) ? defaultValue : !isEmpty(defaultValue) ? [defaultValue] : undefined;
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
        return { actions, isNumber: isNumberType, selectorFields, hasSelectorFields, selectorActiveFieldName, action: action as IFilterAction, type, ignoreCase: ignoreCase as boolean, canIgnoreCase: isTextFilter && String(type).toLowerCase().includes("text"), operator: operator as IFilterOperator, operators, defaultValue, isFilter: true, isTextFilter };
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
            InputFormatter.formatValue({ ...this.props, type: this.getType(), value: divisor }).formattedValue +
            "=" +
            InputFormatter.formatValue({ ...this.props, type: this.getType(), value: remainder }).formattedValue
        );
    }
    getBetweenText(): string {
        if (!this.isBetweenAction()) return "";
        const { betweenStartValue, betweenEndValue } = this.state;
        return (
            InputFormatter.formatValue({ ...this.props, type: this.getType(), value: betweenStartValue }).formattedValue +
            "=>" +
            InputFormatter.formatValue({ ...this.props, type: this.getType(), value: betweenEndValue }).formattedValue
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
                    x = x + " <" + InputFormatter.formatValue({ ...this.props, type: this.state.type, value: defaultValue }).formattedValue + ">";
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
    static ICON_SIZE = 20;
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
            removable,
            onFilterRemove,
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
        const restProps = {
            debounceTimeout: 1000,
            placeholder: this.translate("search"),
        };
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
                        <View testID={testID + "-filter-container"} style={styles.componentContainer}>
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
                            renderAsBottomSheetInFullScreen
                            anchor={<View>
                                <FontIcon
                                    {...props}
                                    size={Filter.ICON_SIZE}
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
                                            label: `${this.translate("filter")} [${label}]`,
                                            divider: true,
                                            labelProps: {
                                                ...titleLabelProps,
                                                style: [titleLabelProps.style, Theme.styles.pt0, Theme.styles.mt0],
                                            },
                                        },
                                    ]
                                    : []),
                                removable && typeof onFilterRemove == "function" ? {
                                    label: this.translate("removeFilter"),
                                    icon: "filter-remove",
                                    onPress: () => {
                                        onFilterRemove();
                                    },
                                } : undefined,
                                hasFilterVal
                                    ? {
                                        label: this.translate("clearFilter"),
                                        icon: "filter-remove",
                                        onPress: this.clearFilter.bind(this),
                                    }
                                    : undefined,
                                ...this.getSelectorFieldsActions(),
                                canIgnoreCase
                                    ? {
                                        label: this.translate("ignoreCase"),
                                        icon: ignoreCase ? "check" : null,
                                        onPress: () => {
                                            this.handleChange({ ignoreCase: !ignoreCase } as IFilterState);
                                        },
                                        divider: true,
                                    }
                                    : null,
                                {
                                    label: this.translate("operatorsLabel"),
                                    closeOnPress: false,
                                    labelProps: titleLabelProps,
                                    divider: true,
                                },
                                ...this.getMenuOperators(),
                                { divider: true },
                                {
                                    label: this.translate("actionsLabel"),
                                    closeOnPress: false,
                                    labelProps: titleLabelProps,
                                    divider: true,
                                },
                                this.isNumber() && false
                                    ? {
                                        label: this.translate("handleZero"),
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
        if ((isNum && value1 === 0 && canotHandleZero)) {
            value1 = "";
        }
        if ((isNum && value2 === 0 && canotHandleZero)) {
            value2 = "";
        }
        return compareValues(value1, value2);
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
                (nState as any)[i as keyof IFilterState] = optionValue;
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
            return Filter.translateOperator("$regexEquals");
        },
        get $regexcontains() {
            return Filter.translateOperator("$regexContains");
        },
        get $regexnotcontains() {
            return Filter.translateOperator("$regexNotContains");
        },
        get $regexnotequals() {
            return Filter.translateOperator("$regexNotequals");
        },
        get $regexstartswith() {
            return Filter.translateOperator("$regexStartswith");
        },
        get $regexendswith() {
            return Filter.translateOperator("$regexEndswith");
        },
    }
    /**
     * Renders a filter group with a list of filters that can be used to filter data.
     *
     * The component accepts the following props:
     * - `withScrollView`: A boolean indicating whether to render the filters in a scroll view or not.
     * - `disabled`: A boolean indicating whether the filter group is disabled or not.
     * - `style`: An optional style object to style the filter group.
     * - `scrollViewProps`: An optional object with props to pass to the scroll view component.
     * - `defaultValue`: An optional array of filters to use as the default value.
     * - `sessionName`: An optional string to use as the session storage key.
     * - `columns`: An array of filters to render in the filter group.
     * - `testID`: An optional string to use as the test ID for the component.
     *
     * The component renders a list of filters that can be used to filter data. The filters are rendered as a list of `Filter` components.
     * The component also renders a button to add a new filter to the list.
     *
     * If `withScrollView` is true, the filters are rendered in a scroll view.
     * If `disabled` is true, the filter group is disabled and the filters are not rendered.
     *
     * The component uses the `FilterGroupContext` to share the filters and the session storage with its children.
     *
     */
    static Group<DataType extends object = any>({ withScrollView, disabled, style, scrollViewProps, defaultValue, sessionName, columns, testID, ...props }: IFilterGroupProps<DataType>) {
        testID = defaultStr(testID, "resk-filter-group");
        const isDisabled = disabled === true;
        const sessionStorage = useMemo<IAuthSessionStorage | null>(() => {
            if (isNonNullString(sessionName)) {
                return Auth.Session.getStorage(sessionName);
            }
            return null;
        }, [sessionName]);
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
        const getColumn = useCallback((columnName: IFilterColumnName<DataType>) => {
            if (!isNonNullString(columnName)) return null;
            return columnsByNames[columnName] || null;
        }, [columnsByNames]);
        const context = {
            getColumn, sessionStorage, testID, removeFilter: (filterKey: string) => {
                if (!isNonNullString(filterKey) || !sessionStorage) return;
                const sessionData = sessionStorage?.getData();
                if (!isObj(sessionData?.columns)) return;
                delete (sessionData as any).columns[filterKey];
                sessionStorage.set("columns", sessionData.columns);
            }
        };
        const filteredColumns = useMemo(() => {
            const columns = [];
            const sessionData = Object.assign({}, sessionStorage?.getData());
            const filtersFromDefaultValue = {};
            const filtersArrayFromDefaultValue: IFilterGroupState<DataType>["columns"] = [];
            if (Array.isArray(defaultValue)) {
                defaultValue.map((f) => {
                    if (!isNonNullString(f) || !isNonNullString(f.name) || !isNonNullString(f.filterKey)) return;
                    if (typeof f.getFilterValue == "function") {
                        f.value = f.getFilterValue(context);
                    }
                    const f2 = Object.clone(f);
                    delete f2.getFilterValue;
                    (filtersFromDefaultValue as any)[f.filterKey] = f2;
                    filtersArrayFromDefaultValue.push(f2);
                });
            }
            if (isObj(sessionData.columns)) {
                for (let i in sessionData) {
                    const column = sessionData[i];
                    if (!isObj(column) || !isNonNullString(column.name) || !isNonNullString(column.filterKey)) continue;
                    if (filterableColumns.some((col) => col.name === column.name)) {
                        columns.push(column);
                    }
                }
            } else {
                return filtersArrayFromDefaultValue;
            }
            return columns;
        }, [filterableColumns, defaultValue]);
        const [state, setState] = useStateCallback<IFilterGroupState<DataType>>({
            columns: filteredColumns
        });
        const { Wrapper, wrapperProps } = useMemo(() => {
            return {
                Wrapper: withScrollView !== false ? ScrollView : Fragment,
                wrapperProps: withScrollView !== false ? Object.assign({}, { horizontal: true }, scrollViewProps, {
                    style: [styles.filterGroupScrollView, scrollViewProps?.style],
                    contentContainerStyle: [styles.filterGroupContentContainerStyle, scrollViewProps?.contentContainerStyle],
                }) as ScrollViewProps : {}
            }
        }, [withScrollView, scrollViewProps]);
        const filterMenuItems = useMemo(() => {
            return filterableColumns.map(({ label, name, type, defaultValue }) => {
                if (!label) return null;
                return {
                    label,
                    right: <FontIcon name="filter-plus" size={Filter.ICON_SIZE} />,
                    onPress: () => {
                        setState((nState) => {
                            return { ...nState, columns: [...nState.columns, { name, filterKey: uniqid("filter-group-key"), value: defaultValue }] }
                        })
                    }
                }
            })
        }, [filterableColumns]);
        return <View testID={testID} {...props} style={[styles.filterGroup, style, isDisabled && Theme.styles.disabled]}>
            <Wrapper {...wrapperProps}>
                <FilterGroupContext.Provider value={context}>
                    {state.columns.map((col, index) => <FilterGroupItem key={col.filterKey || index} {...col} />)}
                </FilterGroupContext.Provider>
                {!isDisabled ? <Menu
                    items={filterMenuItems}
                    responsive
                    renderAsBottomSheetInFullScreen
                    anchor={<Button icon={"filter-plus"} noPadding>
                        {Filter.staticTranslate("addFilter")}
                    </Button>}
                /> : null}
            </Wrapper>
        </View>
    }
}
const FilterGroupContext = createContext<IFilterGroupContext>({} as any);

const useFilterGroup = () => {
    return useContext(FilterGroupContext);
}
function FilterGroupItem<DataType extends object = any>({ name, filterKey, value, ...rest }: IFilterGroupStateColumn<DataType>) {
    const { getColumn, sessionStorage, testID, removeFilter } = useFilterGroup();
    const key = useRef(defaultStr(filterKey, uniqid("filter-group-item"))).current;
    const col = getColumn?.(name);
    const { data: sessionData, setData: setSessionData } = useMemo<{
        data: IFilterGroupStateColumn<DataType> | null;
        setData: (item: Partial<IFilterGroupStateColumn<DataType>>) => void;
    }>(() => {
        const sessionData = sessionStorage?.get(key);
        if (!isObj(sessionData?.columns) || !sessionStorage) {
            return { data: null, setData: () => { } };
        }
        const cols = sessionData.columns;
        return {
            data: cols[key] || null, setData: (item) => {
                cols[key] = {
                    ...item,
                    name,
                    filterKey: key,
                };
                sessionStorage.set("columns", cols);
            }
        };
    }, [key, name]);
    const defaultValue = useMemo(() => {
        if (!sessionData || !isObj(sessionData)) return value;
        if (!(key in sessionData)) return value;
        return (sessionData as any)[key];
    }, [sessionData, value]);
    if (!col) return null;
    return <View testID={testID + "-group-item-container-" + { name } + "-index"} style={styles.filterGroupItemContainer}>
        <Filter
            removable={true}
            defaultValue={defaultValue}
            onChange={(options) => {
                const { value, action, operator, ignoreCase } = options;
                if (compareValues(value, options.value) && compareValues(action, options.action) && compareValues(operator, options.operator) && compareValues(ignoreCase, options.ignoreCase)) {
                    return;
                }
                setSessionData({
                    value,
                    action,
                    operator,
                    ignoreCase,
                });
                if (typeof col.onChange == "function") {
                    col.onChange(options);
                }
            }}
            onFilterRemove={() => {
                removeFilter(key);
            }}
            {...col}
            {...rest}
            isFilterGroupItem
            key={key} />
    </View>
}
const compareValues = (value1: any, value2: any) => {
    if (isEmpty(value1)) {
        value1 = "";
    }
    if (isEmpty(value2)) {
        value2 = "";
    }
    return areEquals(value1, value2);
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
        paddingVertical: 7,
    },
    filterGroupItemContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginHorizontal: 5,
    }
});