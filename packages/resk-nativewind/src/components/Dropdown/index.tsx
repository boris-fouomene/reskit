"use client";
import { ReactElement, ReactNode, useEffect, useMemo, useRef } from "react";
import stableHash from "stable-hash";
import { defaultStr, isEmpty, isNonNullString, isObj, areEquals, stringify, isNumber } from "@resk/core/utils";
import i18n from "@resk/core/i18n";
import { cn, getTextContent, isReactNode, ObservableComponent, useForceRender } from "@utils/index";
import { Dimensions, FlatList, FlatListProps } from 'react-native';
import { IMenuContext, IMenuProps, Menu, useMenu } from "@components/Menu";
import { Tooltip } from "@components/Tooltip";
import { IClassName, IReactNullableElement } from "@src/types";
import { Divider } from "@components/Divider";
import { ProgressBar } from "@components/ProgressBar";
import { ITextInputProps } from "@components/TextInput/types";
import Platform from "@platform";
import FontIcon from "@components/Icon/Font";
import { FONT_ICONS } from '../Icon/Font/icons';
import { Div } from "@html/Div";
import { TextInput } from "@components/TextInput";
import { Text } from "@html/Text";
import { IFontIconName } from "@components/Icon";
import { INavContext } from "@components/Nav";
import dropdownItem, { IVariantPropsDropdownItem } from "@variants/dropdownItem";


export class Dropdown<ItemType = any, ValueType = any> extends ObservableComponent<IDropdownProps<ItemType, ValueType>, IDropdownState<ItemType, ValueType>, IDropdownEvent> implements IDropdownContext<ItemType, ValueType> {
    constructor(props: IDropdownProps<ItemType, ValueType>) {
        super(props);
        this.isSelectedByHashKey = this.isSelectedByHashKey.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.getHashKey = this.getHashKey.bind(this);
        this.getItemLabel = this.getItemLabel.bind(this);
        this.getItemValue = this.getItemValue.bind(this);
        this.getSelectedItemsByHashKey = this.getSelectedItemsByHashKey.bind(this);
        this.state = {
            ...this.prepareState(props),
        };
    }
    private menuContext?: IMenuContext;
    getMenuRef(value: IMenuContext<any>) {
        this.menuContext = value;
    }
    getMenuContext(): IMenuContext<any> | undefined {
        return this.menuContext;
    }
    getHashKey(value: ValueType): string {
        const { getHashKey } = this.props;
        if (typeof getHashKey === "function") {
            return getHashKey(value);
        }
        return ["number", "string", "boolean"].includes(typeof value) ? String(value) : stableHash(value);
    }
    getItemLabel(options: Omit<IDropdownCallOptions<ItemType, ValueType>, 'value'> & { value: ValueType }): ReactNode {
        const { getItemLabel } = this.props;
        options = Object.assign({}, options);
        if (typeof getItemLabel === "function") {
            return getItemLabel(options);
        }
        const { item } = options;
        if (item && isObj<ItemType>(item)) {
            if (isNonNullString(this.props.itemLabelField)) {
                const l = (item as any)[this.props.itemLabelField];
                if (!isEmpty(l)) {
                    return stringify(l, { escapeString: false });
                }
            }
            const { label } = (item as any);
            if (isReactNode(label)) {
                return label;
            }
        }
        if (isReactNode(item as any)) {
            return (item as ReactNode);
        }
        if (["string", "number", "boolean"].includes(typeof item)) {
            if (typeof item == "number") {
                return item.formatNumber();
            }
            return String(item);
        }
        return undefined;
    }
    getItemValue(options: Omit<IDropdownCallOptions<ItemType, ValueType>, 'value'>): ValueType | undefined {
        options = Object.assign({}, options);
        const { getItemValue } = this.props;
        if (typeof getItemValue === "function") {
            return getItemValue(options);
        }
        const { item, index } = options;
        if (item && isObj<ItemType>(item)) {
            if (isNonNullString(this.props.valueField)) {
                const v = (item as any)[this.props.valueField];
                if (!isEmpty(v)) {
                    return v as ValueType;
                }
            }
            const { value } = (item as any);
            if (!isEmpty(value)) {
                return value;
            }
        }
        //Logger.warn("getItemValue is not a function", item, index);
        return undefined;
    }
    filterItem(options: IDropdownPreparedItem<ItemType, ValueType>, index: number): boolean {
        if (typeof this.props.filter == "function") {
            return this.props.filter(options, index);
        }
        return true;
    }
    prepareState(props?: IDropdownProps<ItemType, ValueType>): IDropdownState<ItemType, ValueType> {
        const items: ItemType[] = [];
        const itemsByHashKey: IDropdownPreparedItems<ItemType, ValueType> = {};
        const preparedItems: IDropdownPreparedItem<ItemType, ValueType>[] = [];
        const { items: customItems } = this.props;
        (Array.isArray(customItems) ? customItems : []).map((item, index) => {
            const value = this.getItemValue({ item, index, isDropdown: true });
            if (isEmpty(value) || typeof value === "undefined") {
                //Logger.warn("invalid dropdown value ", value, " for item ", item, index, " with dropdown className ", this.props.className, " test id ", this.props.testID);
                return;
            }
            const hashKey = this.getHashKey(value);
            if (!isNonNullString(hashKey)) {
                return;
            }
            const label = this.getItemLabel({ item, index, value, isDropdown: true });
            const preparedItem = {
                value,
                hashKey,
                item,
                index,
                label,
                labelText: getTextContent(label),
            };
            if (this.filterItem(preparedItem, index)) {
                items.push(item);
                itemsByHashKey[hashKey] = preparedItem;
                preparedItems.push(preparedItem);
            }
        });
        return { visible: !!this.state?.visible, itemsByHashKey, preparedItems, ...this.applySearchFilter(this.state?.searchText, preparedItems), ...this.getSelectedValuesAndHashKey(props?.defaultValue, itemsByHashKey) }
    }
    applySearchFilter(searchText: string, preparedItems?: IDropdownPreparedItem<ItemType, ValueType>[]) {
        searchText = defaultStr(searchText);
        const _preparedItems: IDropdownPreparedItem<ItemType, ValueType>[] = Array.isArray(preparedItems) ? preparedItems : Array.isArray(this.state?.preparedItems) ? this.state.preparedItems : [];
        if (!isNonNullString(searchText)) {
            return { searchText: "", filteredItems: _preparedItems };
        }
        if (searchText.toLowerCase() == String(this.state?.searchText).toLowerCase()) {
            return { searchText, filteredItems: _preparedItems };
        }
        const filterRegex = new RegExp(searchText.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "gi");
        return { searchText, filteredItems: _preparedItems.filter(({ labelText }) => !!labelText.match(filterRegex)) };
    }
    onSearch({ value }: { value: any }) {
        const searchText = defaultStr(value);
        const state = this.applySearchFilter(searchText);
        if (state) {
            this.setState(state as any);
        }
    }
    getSelectedValuesAndHashKey(defaultValue?: ValueType | ValueType[], itemsByHashKey?: IDropdownPreparedItems<ItemType, ValueType>): { selectedValues: ValueType[], selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>> } {
        const { multiple } = this.props;
        const sItemsByKeys: Record<string, IDropdownPreparedItem<ItemType, ValueType>> = {};
        const vals = multiple ? (Array.isArray(defaultValue) ? defaultValue : typeof defaultValue === "string" ? (defaultValue.trim().split(",") as unknown as ValueType[]) : []) : [defaultValue];
        const selectedValues: ValueType[] = [];
        itemsByHashKey = isObj(itemsByHashKey) && itemsByHashKey ? itemsByHashKey : this.state.itemsByHashKey;
        vals.map((value) => {
            const hashKey = this.getHashKey(value as ValueType);
            if (isNonNullString(hashKey) && itemsByHashKey && itemsByHashKey[hashKey]) {
                sItemsByKeys[hashKey] = itemsByHashKey[hashKey];
                selectedValues.push(value as ValueType);
            }
        });
        return { selectedItemsByHashKey: sItemsByKeys, selectedValues };
    };
    isSelectedByHashKey = (hasKey: string) => {
        return !isEmpty(hasKey) && !!this.state.selectedItemsByHashKey[hasKey];
    };
    get itemsByHashKey() {
        return this.state.itemsByHashKey;
    }
    get visible() {
        return this.state.visible;
    }
    getSelectedItemsByHashKey() {
        return this.state.selectedItemsByHashKey;
    }
    isSelected(value: ValueType) {
        return this.isSelectedByHashKey(this.getHashKey(value));
    }
    getPreparedItems(): IDropdownPreparedItem<ItemType, ValueType>[] {
        return Array.isArray(this.state.preparedItems) ? this.state.preparedItems : [];
    }
    callOnChange(preparedItem?: IDropdownPreparedItem<ItemType, ValueType>) {
        const { onChange, multiple } = this.props;
        if (typeof onChange == "function") {
            setTimeout(() => {
                onChange({
                    ...Object.assign({}, preparedItem),
                    value: multiple ? this.state.selectedValues : this.state.selectedValues[0],
                    dropdown: this
                });
            }, 10);
        }
    }
    toggleItem(preparedItem: IDropdownPreparedItem<ItemType, ValueType> & { index: number }) {
        if (!isObj(preparedItem) || !isNonNullString(preparedItem.hashKey)) return;
        const newItemStatus = !this.isSelectedByHashKey(preparedItem.hashKey);
        const newState: IDropdownState<ItemType, ValueType> = {} as IDropdownState<ItemType, ValueType>;
        const { multiple } = this.props;
        if (multiple) {
            newState.selectedValues = newItemStatus ? [...this.state.selectedValues, preparedItem.value] : this.state.selectedValues.filter((v) => this.getHashKey(v) !== preparedItem.hashKey);
            newState.selectedItemsByHashKey = Object.assign({}, this.state.selectedItemsByHashKey);
            if (newItemStatus) {
                newState.selectedItemsByHashKey[preparedItem.hashKey] = preparedItem;
            } else {
                delete newState.selectedItemsByHashKey[preparedItem.hashKey];
            }
        } else {
            newState.selectedValues = newItemStatus ? [preparedItem.value] : [];
            newState.selectedItemsByHashKey = newItemStatus ? { [preparedItem.hashKey]: preparedItem } : {};
            newState.visible = false;
        }
        this.setState(newState, () => {
            this.callOnChange(preparedItem);
            const triggerCallOptions = { ...preparedItem, dropdown: this };
            this.trigger("toggleItem", triggerCallOptions);
            if (newItemStatus) {
                this.trigger("selectItem", triggerCallOptions);
            } else {
                this.trigger("unselectItem", triggerCallOptions);
            }
        });
    }
    open(cb?: Function) {
        const { isLoading, readOnly, disabled } = this.props;
        if (isLoading || readOnly || disabled || this.state.visible) return;
        this?.menuContext?.menu?.measureAnchor(true).then(() => {
            this.setState({ visible: true }, () => {
                this.trigger("open", this);
                this.trigger("toggleVisibility", this);
                if (typeof cb == "function") {
                    cb();
                }
            })
        })
    }
    close(cb?: Function) {
        if (this.state.visible) {
            this.setState({ visible: false }, () => {
                this.trigger("close", this);
                this.trigger("toggleVisibility", this);
                if (typeof cb === "function") {
                    cb();
                }
            });
        }
    }
    selectAll() {
        const itByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>> = {};
        const newValues: ValueType[] = [];
        for (let key in this.state.itemsByHashKey) {
            itByHashKey[key] = this.state.itemsByHashKey[key];
            newValues.push(this.state.itemsByHashKey[key].value);
        }
        const newState = { selectedItemsByHashKey: itByHashKey, selectedValues: newValues };
        this.setState(newState, () => {
            this.callOnChange();
            this.trigger("selectAll", this);
        });
    }

    unselectAll = () => {
        const { multiple } = this.props;
        const nState: Partial<IDropdownState<ItemType, ValueType>> = { selectedItemsByHashKey: {}, selectedValues: [] };
        if (!multiple) {
            nState.visible = false;
        }
        this.setState(nState as IDropdownState<ItemType, ValueType>, () => {
            this.callOnChange();
            this.trigger("unselectAll", this);
        });
    }

    /**
     * toggle the dropdown visibility
     * @returns {void}
     */
    toggle() {
        this.state.visible ? this.close() : this.open();
    }
    isOpen() {
        return this.state.visible;
    }

    render() {
        return <DropdownRenderer<ItemType, ValueType> context={this} />
    }

    componentDidUpdate(prevProps: Readonly<IDropdownProps<ItemType, ValueType>>, nextContext: any): void {
        if (this.props.items !== prevProps.items && !areEquals(this.props.items, prevProps.items)) {
            this.setState(this.prepareState(this.props));
        } else if (prevProps.defaultValue !== this.props.defaultValue && !areEquals(this.props.defaultValue, prevProps.defaultValue)) {
            this.setState({ ...this.getSelectedValuesAndHashKey(this.props.defaultValue, this.state.itemsByHashKey) });
        }
    }
    getTestID(): string {
        return defaultStr(this.props.testID, "resk-dropdown");
    }
    renderItem<ItemType, ValueType>({ item, index }: { item: IDropdownPreparedItem<ItemType, ValueType>, index: number }) {
        return <DropdownItem {...item} index={index} context={this} />;
    };
}

function DropdownRenderer<ItemType = any, ValueType = any>({ context }: { context: IDropdownContext<ItemType, ValueType> }) {
    let { anchorContainerClassName, searchInputProps, menuProps, anchor, error, defaultValue, maxHeight, disabled, dropdownActions, readOnly, editable, testID, multiple, value, ...props } = context.props;
    const { visible } = context.state;
    const isLoading = !!props.isLoading;
    testID = context.getTestID();
    const selectedItemsByHashKey = context.getSelectedItemsByHashKey();
    disabled = disabled || isLoading;
    const { selectedText: anchorSelectedText, selectedItems, selectedValues } = useMemo(() => {
        let selectedText = "";
        let title = "";
        let counter = 0;
        let nextItemCounter = 0;
        const selectedItems: ItemType[] = [], selectedValues: ValueType[] = [];
        for (let key in selectedItemsByHashKey) {
            selectedItems.push(selectedItemsByHashKey[key].item);
            selectedValues.push(selectedItemsByHashKey[key].value);
            const label = context.itemsByHashKey[key]?.labelText;
            if (!isNonNullString(label)) {
                continue;
            }
            const l = (selectedText ? ", " : "") + label;
            title += l;
            if (counter > 1) {
                nextItemCounter++;
                continue;
            }
            selectedText += l;
            counter++;
        }
        if (nextItemCounter) {
            selectedText += `${i18n.t("components.dropdown.andMoreItemSelected", { count: nextItemCounter })}`;
        }
        return { selectedText, title, selectedItems, selectedValues };
    }, [selectedItemsByHashKey]);
    context.anchorSelectedText = anchorSelectedText;
    const actions = useMemo(() => {
        const actions: IDropdownAction[] = [];
        if (dropdownActions) {
            const actProps = (typeof dropdownActions === "function" ? dropdownActions(context) : dropdownActions) as IDropdownAction[];
            if (Array.isArray(actProps)) {
                actProps.map((act) => {
                    if (!act || !isObj(act)) {
                        return;
                    }
                    actions.push({
                        ...act,
                        context: {
                            dropdown: context
                        }
                    });
                });
            }
        }
        if (multiple) {
            return [
                ...actions,
                actions?.length ? { divider: true } : undefined,
                {
                    label: i18n.t("components.dropdown.selectAll"),
                    icon: "checkbox-multiple-marked",
                    onPress: context.selectAll.bind(context),
                },
                {
                    label: i18n.t("components.dropdown.unselectAll"),
                    icon: "checkbox-multiple-blank-outline",
                    onPress: context.unselectAll.bind(context),
                },
            ];
        } else if (anchorSelectedText) {
            return [
                ...actions,
                actions?.length ? { divider: true } : undefined,
                {
                    label: i18n.t("components.dropdown.unselectSingle"),
                    icon: "checkbox-blank-circle-outline",
                    onPress: context.unselectAll.bind(context),
                },
            ];
        }
        return actions;
    }, [dropdownActions, multiple, context.isOpen(), context, anchorSelectedText]);
    context.dropdownActions = actions as any;
    const loadingContent = isLoading ? <ProgressBar indeterminate testID={testID + "dropdown-progressbar"} /> : null;
    const anchorProps: ITextInputProps = {
        ...props,
        containerClassName: cn("mt-0 mb-0", props.containerClassName),
        className: cn("mt-0 mb-0", props?.className),
        onChange: undefined,
        testID,
        isDropdownAnchor: true,
        disabled,
        defaultValue: anchorSelectedText,
        onPress: isLoading ? undefined : context.toggle.bind(context),
    }
    const { height: screenHeight } = Dimensions.get("window");
    const maxDropdownHeight = useMemo(() => {
        return isNumber(maxHeight) && maxHeight > 0 ? maxHeight : Math.max(screenHeight * 0.5, 300);
    }, [maxHeight, screenHeight]);

    const preparedItems = context.getPreparedItems()
    const canRenderSeach = !!!(context.props?.showSearch === false || context.props?.showSearch !== true && preparedItems?.length <= 5)


    return <Menu
        minWidth={180}
        disabled={disabled}
        maxHeight={maxDropdownHeight}
        bottomSheetTitle={context.props?.label}
        bottomSheetTitleDivider={!canRenderSeach}
        testID={testID + "-menu"}
        renderAsBottomSheetInFullScreen
        visible={visible}
        withScrollView={false}
        onRequestClose={() => context.close()}
        sameWidth
        {...Object.assign({}, menuProps)}
        ref={context.getMenuRef.bind(context)}
        anchor={<Div
            disabled={disabled}
            testID={`${testID}-dropdown-anchor-container`}
            className={cn(anchorContainerClassName)}
        >
            {typeof anchor == "function" ? anchor({ ...anchorProps, selectedItems, selectedValues, multiple: !!multiple, isLoading, dropdown: context })
                :
                <TextInput
                    {...anchorProps}
                />}
            {loadingContent}
        </Div>}
    >
        <DropdownMenu
            maxHeight={maxDropdownHeight}
            context={context}
            canRenderSeach={canRenderSeach}
            actions={actions as any}
        />
    </Menu>
}

function DropdownMenu<ItemType = any, ValueType = any>({ maxHeight, actions, canRenderSeach, context }: { maxHeight: number, actions: IDropdownAction[], canRenderSeach: boolean, context: IDropdownContext<ItemType, ValueType> }) {
    const isEditabled = context?.props?.editable !== false && !(context?.props?.disabled) && !(context?.props?.readOnly);
    const { searchInputProps, error } = context.props;
    const listProps = Object.assign({}, context.props.listProps);
    const testID = context?.getTestID();
    const menuContext = useMenu();
    const { menu } = Object.assign({}, menuContext);
    const menuPosition = menu?.position;
    const isTopPosition = menuPosition?.computedPlacement === "top";
    const fullScreen = !!menu?.fullScreen;
    const canReverse = isTopPosition && !fullScreen;
    const preparedItems = context.getPreparedItems();
    const visible = context.isOpen();
    const maxMenuHeight = isNumber(menu?.maxHeight) && menu?.maxHeight > (Math.min(menu.maxHeight, maxHeight)) ? menu.maxHeight : maxHeight;

    const filteredItems = context.state?.filteredItems
    const searchText = defaultStr(context.state?.searchText);
    const searchProps = Object.assign({}, searchInputProps, { error: error || searchInputProps?.error });
    const divider = <Divider testID={`${testID}-divider`} className="w-full" />;
    const searchInput = canRenderSeach ?
        <Div testID={`${testID}-dropdown-search-container`} className={cn("w-full max-w-full overflow-hidden px-[7px]")}>
            {canReverse ? divider : null}
            <TextInput
                testID={`${testID}-dropdown-search`}
                autoFocus={visible && !Platform.isTouchDevice()}
                affix={false}
                debounceTimeout={preparedItems?.length > 500 ? 1500 : preparedItems?.length > 200 ? 1000 : 0}
                {...searchProps}
                containerClassName={(cn("w-full", searchProps.containerClassName))}
                //variant={{ borderWidth: 1, borderColor: "surface", borderStyle: "solid", rounded: "10px", ...searchProps.variant }}
                defaultValue={searchText}
                onChange={({ value }) => {
                    context.onSearch?.({ value })
                }}
                placeholder={i18n.t("components.dropdown.searchPlaceholder", { count: filteredItems?.length })}
                right={!actions?.length ? null : (
                    <Menu
                        items={actions as any}
                        testID={`${testID}-dropdown-menu-actions`}
                        anchor={<FontIcon
                            name={FONT_ICONS.MORE as never}
                            size={24}
                        />}
                    />
                )
                }
            />
            {!canReverse ? divider : null}
        </Div> : null;
    return <Div
        disabled={context?.props?.disabled}
        readOnly={!isEditabled}
        testID={testID + "-dropdown-list-container"}
        className={cn("w-full max-h-full relative flex flex-col", canReverse ? "pt-[10px]" : "pb-[10px]")}
        style={fullScreen ? undefined : { maxHeight: maxMenuHeight }}
    >
        {canReverse ? null : searchInput}
        <FlatList<IDropdownPreparedItem<ItemType, ValueType>>
            testID={testID + "-dropdown-list"}
            scrollEnabled
            style={{ maxHeight: "100%", width: "100%" }}
            {...listProps}
            inverted={canReverse}
            data={context?.state?.filteredItems}
            keyExtractor={({ hashKey }) => hashKey}
            renderItem={context.renderItem.bind(context)}
        />
        {canReverse ? searchInput : null}
    </Div>;
}

const DropdownItem = (preparedItem: IDropdownPreparedItem & { index: number, context: IDropdownContext }) => {
    const { label, hashKey, labelText, context } = preparedItem;
    const forceRender = useForceRender();
    const selectedItemsByHashKey = context.getSelectedItemsByHashKey();
    const itemsByHashKey = context.itemsByHashKey;
    const labelRef = useRef<Text>(null);
    const { multiple, selectedIconName, itemClassName, itemVariant, itemContainerClassName } = context.props;
    const testID = context.getTestID();
    const computedVariant = dropdownItem(itemVariant);
    const isSelected = useMemo(() => {
        return context.isSelectedByHashKey(hashKey);
    }, [selectedItemsByHashKey, hashKey]);
    useEffect(() => {
        if (!labelText) {
            const text = getTextContent(labelRef?.current);
            if (text) {
                itemsByHashKey[hashKey].labelText = text;
                return;
            }
        }
    }, [label, labelText, itemsByHashKey]);
    useEffect(() => {
        if (typeof context.on !== "function") {
            return;
        }
        const bindedOn = context.on("toggleItem", (options: any) => {
            if (options?.hashKey === hashKey) {
                forceRender();
            }
        });
        const bindOnSelectAll = context.on("selectAll", () => {
            forceRender();
        });
        const bindOnUnselectAll = context.on("unselectAll", () => {
            forceRender();
        });
        return () => {
            bindedOn?.remove();
            bindOnSelectAll?.remove();
            bindOnUnselectAll?.remove();
        }
    }, [hashKey, context]);
    if (!label) {
        return null;
    }
    return (
        <Tooltip
            title={label}
            onPress={() => {
                context.toggleItem(preparedItem);
            }}
            className={cn("py-[10px] self-start grow overflow-hidden w-full justify-center", computedVariant.container(), itemContainerClassName)}
            testID={testID + "-item-container-" + hashKey}
        >
            <Div className={cn("px-[10px] flex flex-row items-center justify-start text-left flex-nowrap", computedVariant.base(), itemClassName)} testID={testID + "-item-content-" + hashKey}>
                {isSelected ? <FontIcon className={cn("mr-[5px]", computedVariant.selectedIcon())} name={(isNonNullString(selectedIconName) ? selectedIconName : multiple ? "check" : "radiobox-marked") as never} /> : null}
                {<Text ref={labelRef as any} className={cn(isSelected ? computedVariant.selectedLabel() : computedVariant.label())}>{label}</Text>}
            </Div>
        </Tooltip>
    );
}

DropdownItem.displayName = "DropdownItem";






/****** Dropdown types */



export interface IDropdownContext<ItemType = any, ValueType = any> extends Dropdown<ItemType, ValueType> {
    /***
     * The dropdown actions.
     */
    dropdownActions?: IDropdownAction[];
    /***
     * the corresponding selected text calculated from selected items
     */
    anchorSelectedText?: string;
}

/**
 * Represents the state of a dropdown component.
 * 
 * This interface defines the structure of the state that manages the items, 
 * selection, visibility, and prepared items within a dropdown. It provides 
 * essential information needed to render the dropdown and handle user interactions.
 * 
 * @interface IDropdownState
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @property {Record<string, IDropdownPreparedItem<ItemType, ValueType>>} itemsByHashKey - 
 * A record of prepared items indexed by their unique hash keys. This allows for 
 * efficient access to items within the dropdown.
 * 
 * @property {ValueType[]} selectedValues - An array of values representing the 
 * currently selected items in the dropdown. This can be used to track user 
 * selections and manage the state of the dropdown.
 * 
 * @property {boolean} visible - A boolean flag indicating whether the dropdown 
 * is currently visible. This is useful for controlling the display of the dropdown 
 * based on user interactions.
 * 
 * @property {Record<string, IDropdownPreparedItem<ItemType, ValueType>>} selectedItemsByHashKey - 
 * A record of selected items indexed by their unique hash keys. This allows for 
 * quick access to the selected items and their associated data.
 * 
 * @property {IDropdownPreparedItem<ItemType, ValueType>[]} preparedItems - 
 * An array of prepared items that are ready to be displayed in the dropdown. 
 * This array contains the items that have been processed and formatted for rendering.
 * 
 * @example
 * // Example usage of the IDropdownState interface
 * 
 * const dropdownState: IDropdownState<{ id: number }, string> = {
 *     itemsByHashKey: {
 *         "item-1-hash": {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         },
 *         "item-2-hash": {
 *             value: "item-2",
 *             hashKey: "item-2-hash",
 *             item: { id: 2 },
 *             label: <span>Item 2</span>, // ReactNode
 *             labelText: "Item 2" // Plain text representation
 *         }
 *     },
 *     selectedValues: ["item-1"],
 *     visible: true,
 *     selectedItemsByHashKey: {
 *         "item-1-hash": {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         }
 *     },
 *     preparedItems: [
 *         {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         },
 *         {
 *             value: "item-2",
 *             hashKey: "item-2-hash",
 *             item: { id: 2 },
 *             label: <span>Item 2</span>, // ReactNode
 *             labelText: "Item 2" // Plain text representation
 *         }
 *     ]
 * };
 * 
 * @remarks
 * - This interface is particularly useful for managing the internal state of 
 *   dropdown components, allowing for efficient rendering and interaction.
 * - Ensure that the `itemsByHashKey` and `selectedItemsByHashKey` are kept 
 *   in sync to avoid inconsistencies in the dropdown state.
 */
export interface IDropdownState<ItemType = any, ValueType = any> {
    itemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>>,
    selectedValues: ValueType[]
    visible: boolean;
    selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>>;
    preparedItems: IDropdownPreparedItem<ItemType, ValueType>[];

    /***
     * The search text.
     */
    searchText: string;

    /***
 * The filtered items. based on the search text
 */
    filteredItems?: IDropdownPreparedItem<ItemType, ValueType>[];
};

export interface IDropdownAction extends INavContext<{ dropdown: IDropdownContext }> { }

export type IDropdownComputedAction = (IReactNullableElement | IDropdownAction);

export type IDropdownActions = IDropdownComputedAction[] | ((options: IDropdownContext<any, any>) => IDropdownComputedAction[]);
/**
 * Represents a collection of prepared items in a dropdown component.
 * 
 * This type alias defines a record structure where each key is a unique string 
 * identifier (hash key) for a prepared dropdown item, and the value is the 
 * corresponding prepared item itself. This structure allows for efficient 
 * access and management of dropdown items, facilitating operations such as 
 * selection, filtering, and rendering.
 * 
 * @type IDropdownPreparedItems
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @property {Record<string, IDropdownPreparedItem<ItemType, ValueType>>} - A record 
 * where each key is a unique string (hash key) and each value is an instance of 
 * `IDropdownPreparedItem`, representing a prepared item in the dropdown.
 * 
 * @example
 * // Example usage of the IDropdownPreparedItems type alias
 * 
 * const preparedItems: IDropdownPreparedItems<{ id: number }, string> = {
 *     "item-1-hash": {
 *         value: "item-1",
 *         hashKey: "item-1-hash",
 *         item: { id: 1 },
 *         label: <span>Item 1</span>, // ReactNode
 *         labelText: "Item 1" // Plain text representation
 *     },
 *     "item-2-hash": {
 *         value: "item-2",
 *         hashKey: "item-2-hash",
 *         item: { id: 2 },
 *         label: <span>Item 2</span>, // ReactNode
 *         labelText: "Item 2" // Plain text representation
 *     }
 * };
 * 
 * // Function to get a prepared item by its hash key
 * function getPreparedItemByHashKey(hashKey: string): IDropdownPreparedItem<any, any> | undefined {
 *     return preparedItems[hashKey];
 * }
 * 
 * const item = getPreparedItemByHashKey("item-1-hash");
 * console.log(item); // Output: { value: "item-1", hashKey: "item-1-hash", ... }
 * 
 * @remarks
 * - This type alias is particularly useful in dropdown components where multiple 
 * prepared items need to be stored and accessed efficiently.
 * - Ensure that the keys used in the record are unique to avoid conflicts and 
 * rendering issues.
 */
export type IDropdownPreparedItems<ItemType = any, ValueType = any> = Record<string, IDropdownPreparedItem<ItemType, ValueType>>;

/**
 * Represents the options provided to callback functions when the dropdown value changes.
 * 
 * This interface extends the `Partial<IDropdownPreparedItem<ItemType, ValueType>>` 
 * interface, omitting the `value` property, and includes additional properties 
 * necessary for handling changes in the dropdown selection.
 * 
 * @interface IDropdownOnChangeOptions
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @extends Omit<Partial<IDropdownPreparedItem<ItemType, ValueType>>, 'value'>
 * 
 * @property {ValueType | ValueType[] | undefined} value - The new value(s) selected 
 * from the dropdown. This can be a single value, an array of values (for multi-select), 
 * or `undefined` if no value is selected.
 * 
 * @property {IDropdownContext<ItemType, ValueType>} dropdown - The context of 
 * the dropdown, providing access to methods and state management for the dropdown component.
 * 
 * @example
 * // Example usage of the IDropdownOnChangeOptions interface
 * 
 * const handleDropdownChange = (options: IDropdownOnChangeOptions<{ id: number }, string>) => {
 *     console.log(`New value selected: ${options.value}`);
 *     console.log(`Dropdown context:`, options.dropdown);
 * };
 * 
 * // Simulating a dropdown change event
 * const dropdownChangeOptions: IDropdownOnChangeOptions<{ id: number }, string> = {
 *     value: "item-1",
 *     dropdown: {  }
 * };
 * handleDropdownChange(dropdownChangeOptions);
 * // Output: New value selected: item-1
 * // Output: Dropdown context: {  }
 * 
 * @remarks
 * - This interface is particularly useful for managing the change events in dropdown components, 
 *   allowing for efficient handling of user selections.
 * - Ensure that the `dropdown` is properly passed to access the necessary methods 
 *   and state related to the dropdown.
 */
export interface IDropdownOnChangeOptions<ItemType = any, ValueType = any> extends Omit<Partial<IDropdownPreparedItem<ItemType, ValueType>>, 'value'> {
    value: ValueType | ValueType[] | undefined;
    dropdown: IDropdownContext<ItemType, ValueType>;
};

/**
 * Represents the options provided to callback functions in a dropdown component.
 * 
 * This interface defines the structure of the options that are passed to callback 
 * functions when interacting with items in a dropdown. It provides essential 
 * information about the item being interacted with, including its index and 
 * a flag indicating that the context is within a dropdown.
 * 
 * @interface IDropdownCallOptions
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @property {ItemType} item - The item that is being interacted with. This can be any 
 * type of data structure that contains the information needed for the dropdown item.
 * 
 * @property {number} index - The index of the item within the dropdown list. This 
 * can be useful for identifying the position of the item in the list, especially 
 * when multiple items are present.
 * 
 * @property {boolean} isDropdown - A boolean flag that indicates whether the context 
 * is within a dropdown. This is typically set to `true` and can be used to differentiate 
 * between dropdown interactions and other types of interactions in the application.
 * 
 * @example
 * // Example usage of the IDropdownCallOptions interface
 * 
 * const handleDropdownItemClick = (options: IDropdownCallOptions<{ id: number }, string>) => {
 *     console.log(`Item clicked: ${options.item}, Index: ${options.index}`);
 *     // Perform actions based on the clicked item
 * };
 * 
 * // Simulating a dropdown item click
 * const dropdownItem = { id: 1, name: "Item 1" };
 * handleDropdownItemClick({ item: dropdownItem, index: 0, isDropdown: true });
 * // Output: Item clicked: [object Object], Index: 0
 * 
 * @remarks
 * - This interface is particularly useful in dropdown components where callback 
 * functions need to receive contextual information about the item being interacted with.
 * - Ensure that the `isDropdown` property is consistently set to `true` when using this 
 * interface in dropdown-related callbacks.
 */
export interface IDropdownCallOptions<ItemType = any, ValueType = any> {
    item: ItemType; // The item being interacted with
    index: number; // The index of the item in the dropdown list
    isDropdown: true; // Indicates that the context is within a dropdown
}

export interface IDropdownProps<ItemType = any, ValueType = any> extends Omit<ITextInputProps, "onChange" | "ref" | "multiline"> {
    items?: ItemType[]; // An optional array of items to be displayed in the dropdown
    testID?: string; // An optional test ID for the dropdown
    getItemValue?: (options: IDropdownCallOptions<ItemType, ValueType>) => ValueType | undefined; // Function to get item value
    getItemLabel?: (options: Omit<IDropdownCallOptions<ItemType, ValueType>, 'value'> & { value: ValueType }) => ReactNode; // Function to get item label
    multiple?: boolean; // Flag for multiple selections
    onChange?: (options: IDropdownOnChangeOptions<ItemType, ValueType>) => void; // Callback for value changes
    defaultValue?: ValueType | ValueType[]; // Default value(s) for the dropdown
    getHashKey?: (value: ValueType) => string; // Function to get unique hash key
    filter?: (preparedItem: IDropdownPreparedItem<ItemType, ValueType>, index: number) => boolean; // Function to filter items
    listProps?: FlatListProps<IDropdownPreparedItem<ItemType, ValueType>>; // Props for the item list

    /**
     * Whether the dropdown should display a search input
     */
    showSearch?: boolean;
    /***
     * The props of the search input. It represents the props of the TextInput component used for the search input.
     */
    searchInputProps?: Omit<ITextInputProps, "value" | "defaultValue">; // Props for the search input

    /**** Specifies if the dropdown is responsible for loading items */
    isLoading?: boolean; // Flag for loading state
    isFullScreen?: boolean; // Flag for full screen display

    listContainerClassName?: IClassName;

    listContentContainerClassName?: IClassName;


    /***
        ClassName for the anchor container, The View that wraps the anchor element
    */
    anchorContainerClassName?: IClassName; // Props for the anchor container


    /***
        optional actions for the dropdown
    */
    dropdownActions?: IDropdownActions;

    /***
     * The name of the icon to be used for the selected state of the dropdown items.
     * If not provided, the default icon will be used.
     * by default : it's value is 'check' form multiple selection and 'radiobox-marked' for single selection
     */
    selectedIconName?: IFontIconName;

    /***
     * Props for the menu component that wraps the dropdown.
     * This allows for customization of the menu's appearance and behavior.
     */
    menuProps?: Omit<IMenuProps, "anchor">;

    /***
     * The class name for the Div that render each list item 
     */
    itemClassName?: IClassName;

    /***
        The variants for the item
    */
    itemVariant?: IVariantPropsDropdownItem;

    /***
     * The class name for the item container, The Div that wrap each list item
     */
    itemContainerClassName?: IClassName;

    /***
     * The props for the anchor component.
     * This allows for customization of the anchor's appearance and behavior.
     * By default, it's rendered as a TextInput component.
     */
    anchor?: (options: Omit<ITextInputProps, "onChange"> & {
        dropdown: IDropdownContext<ItemType, ValueType>;
        isLoading: boolean;
        multiple: boolean;
        /***
         * The selected items.
         */
        selectedItems: ItemType[];
        selectedValues: ValueType[];
    }) => ReactElement;

    /***
     * Use When getItemLabel is not specified
     * It represent a key of ItemType to be used as label when ItemType is an object
     * If a string is provided, we will retrieve the value of the field using the string as key
     */
    itemLabelField?: keyof ItemType | string;

    /***
     * Use When getItemValue is not specified
     * It represent the field of the item to be used as value when ItemType is an object
     */
    valueField?: keyof ItemType | string;
};

/**
 * Represents a prepared item in a dropdown component.
 * 
 * This interface defines the structure of an item that has been processed and is ready 
 * to be displayed in a dropdown menu. Each prepared item contains essential information 
 * that allows for efficient rendering and interaction within the dropdown.
 * 
 * @interface IDropdownPreparedItem
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @property {ValueType} value - The value associated with the dropdown item. This is the 
 * value that will be returned when the item is selected.
 * 
 * @property {string} hashKey - A unique key generated for the item, used for efficient 
 * identification and rendering within the dropdown. This key should be unique across 
 * all items in the dropdown.
 * 
 * @property {ItemType} item - The original item data that this prepared item represents. 
 * This can be any type of data structure that contains the information needed for the 
 * dropdown item.
 * 
 * @property {ReactNode} label - The label to be displayed for the dropdown item. This can 
 * be a string, a React component, or any valid React node that represents the visual 
 * representation of the item in the dropdown.
 * 
 * @property {string} labelText - A plain text representation of the label, useful for 
 * accessibility purposes and for situations where a simple text representation is needed.
 * 
 * @example
 * // Example usage of the IDropdownPreparedItem interface
 * 
 * const dropdownItem: IDropdownPreparedItem<{ id: number }, string> = {
 *     value: "item-1",
 *     hashKey: "item-1-hash",
 *     item: { id: 1 },
 *     label: <span>Item 1</span>, // ReactNode
 *     labelText: "Item 1" // Plain text representation
 * };
 * 
 * // Function to render a dropdown item
 * function renderDropdownItem(item: IDropdownPreparedItem<any, any>) {
 *     return (
 *         <div key={item.hashKey}>
 *             {item.label} {}
 *         </div>
 *     );
 * }
 * 
 * @remarks
 * - This interface is particularly useful in dropdown components where items need to be 
 * prepared for display, allowing for efficient rendering and interaction.
 * - Ensure that the `hashKey` is unique for each item to avoid rendering issues.
 * - The `label` can be customized to include icons or other components for enhanced 
 * user experience.
 */
export interface IDropdownPreparedItem<ItemType = any, ValueType = any> {
    value: ValueType; // The value associated with the dropdown item
    hashKey: string; // A unique key for the item
    item: ItemType; // The original item data
    label: ReactNode; // The label to be displayed for the item
    labelText: string; // Plain text representation of the label
};


/**
 * Represents the possible events that can be triggered within a dropdown component.
 * 
 * This type defines a set of string literals that represent various events that can occur
 * during the lifecycle of a dropdown. These events are useful for tracking user interactions
 * and managing the state of the dropdown component.
 * 
 * @type IDropdownEvent
 * 
 * @example
 * // Example usage of the IDropdownEvent type
 * 
 * const handleDropdownEvent = (event: IDropdownEvent) => {
 *     switch (event) {
 *         case "toggleVisibility":
 *             console.log("Dropdown visibility toggled");
 *             break;
 *         case "selectItem":
 *             console.log("Item selected in dropdown");
 *             break;
 *         case "open":
 *             console.log("Dropdown opened");
 *             break;
 *         case "close":
 *             console.log("Dropdown closed");
 *             break;
 *         case "toggleItem":
 *             console.log("Item selection toggled");
 *             break;
 *         case "unselectItem":
 *             console.log("Item unselected");
 *             break;
 *         default:
 *             console.log("Unknown dropdown event");
 *     }
 * };
 * 
 * // Simulating a dropdown event
 * handleDropdownEvent("open"); // Output: "Dropdown opened"
 * 
 * @remarks
 * - This type is particularly useful for event handling in dropdown components, allowing
 *   developers to respond to specific user actions.
 * - Ensure that event handlers are properly implemented to manage the state and behavior
 *   of the dropdown based on these events.
 */
export type IDropdownEvent = "toggleVisibility" | "selectItem" | "open" | "close" | "toggleItem" | "unselectItem" | "selectAll" | "unselectAll";
