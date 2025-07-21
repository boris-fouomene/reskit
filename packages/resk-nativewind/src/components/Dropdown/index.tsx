"use client";
import { memo, ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import stableHash from "stable-hash";
import { defaultStr, isEmpty, isNonNullString, isObj, areEquals, stringify, isNumber } from "@resk/core/utils";
import { i18n } from "@resk/core/i18n";
import { cn, getTextContent, isReactNode, ObservableComponent } from "@utils/index";
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
import { Icon, IFontIconName } from "@components/Icon";
import { INavItemProps, INavItems } from "@components/Nav";
import { dropdownItemVariant, IDropdownItemVariant } from "@variants/dropdownItem";
import { IIconVariant } from "@variants/icon";
import { IProgressBarVariant } from "@variants/progressBar";


export class Dropdown<ItemType = unknown, ValueType = unknown, AllowMultiple extends boolean = boolean> extends ObservableComponent<IDropdownProps<ItemType, ValueType, AllowMultiple>, IDropdownState<ItemType, ValueType>, IDropdownEvent> {
    constructor(props: IDropdownProps<ItemType, ValueType, AllowMultiple>) {
        super(props);
        this.isSelectedByHashKey = this.isSelectedByHashKey.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.getHashKey = this.getHashKey.bind(this);
        this.getItemLabel = this.getItemLabel.bind(this);
        this.getItemValue = this.getItemValue.bind(this);
        this.getItemText = this.getItemText.bind(this);
        this.getSelectedItemsByHashKey = this.getSelectedItemsByHashKey.bind(this);
        this.state = {
            ...this.prepareState(props),
        };
    }
    private menuContext?: IMenuContext;
    anchorSelectedText?: string;
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
    getItemText(options: Omit<IDropdownCallOptions<ItemType, ValueType>, 'value'> & { value: ValueType, computedLabel: ReactNode }): string {
        const { getItemText } = this.props;
        options = Object.assign({}, options);
        if (typeof getItemText === "function") {
            return getItemText(options);
        }
        return getTextContent(options.computedLabel);
    }
    getCallOptions(options?: Partial<IDropdownCallOptions<ItemType, ValueType>>): IDropdownCallOptions<ItemType, ValueType> {
        return Object.assign({}, options, { dropdown: this, isDropdown: true }) as IDropdownCallOptions<ItemType, ValueType>;
    }
    getItemLabel(options: IDropdownCallOptions<ItemType, ValueType>): ReactNode {
        const { getItemLabel } = this.props;
        const opts = this.getCallOptions(options);
        if (typeof getItemLabel === "function") {
            return getItemLabel(opts);
        }
        const { item } = opts;
        if (item && isObj<ItemType>(item)) {
            if (isNonNullString(this.props.itemLabelField)) {
                const l = (item)[this.props.itemLabelField];
                if (!isEmpty(l)) {
                    return stringify(l, { escapeString: false });
                }
            }
            const { label } = (item);
            if (isReactNode(label)) {
                return label;
            }
        }
        if (isReactNode(item)) {
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
        const opts = this.getCallOptions(options);
        const { getItemValue } = this.props;
        if (typeof getItemValue === "function") {
            return getItemValue(opts);
        }
        const { item, index } = opts;
        if (item && isObj<ItemType>(item)) {
            if (isNonNullString(this.props.itemValueField)) {
                const v = (item)[this.props.itemValueField];
                if (!isEmpty(v)) {
                    return v as ValueType;
                }
            }
            const { value } = (item);
            if (!isEmpty(value)) {
                return value;
            }
        }
        //Logger.warn("getItemValue is not a function", item, index);
        return undefined;
    }
    filterItem(options: IDropdownPreparedItem<ItemType, ValueType>, index: number): boolean {
        if (typeof this.props.filterItem == "function") {
            return this.props.filterItem(options, index);
        }
        return true;
    }
    prepareState(props?: IDropdownProps<ItemType, ValueType, AllowMultiple>): IDropdownState<ItemType, ValueType> {
        const items: ItemType[] = [];
        const itemsByHashKey: IDropdownPreparedItems<ItemType, ValueType> = {};
        const preparedItems: IDropdownPreparedItem<ItemType, ValueType>[] = [];
        const { items: customItems } = this.props;
        (Array.isArray(customItems) ? customItems : []).map((item, index) => {
            const options = this.getCallOptions({ item, index });
            const value = this.getItemValue(options);
            if (isEmpty(value) || typeof value === "undefined") {
                //Logger.warn("invalid dropdown value ", value, " for item ", item, index, " with dropdown className ", this.props.className, " test id ", this.props.testID);
                return;
            }
            const hashKey = this.getHashKey(value);
            if (!isNonNullString(hashKey)) {
                return;
            }
            const label = this.getItemLabel({ ...options, value });
            const preparedItem = {
                value,
                hashKey,
                item,
                index,
                label,
                labelText: this.getItemText({ ...options, value, computedLabel: label }),
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
            this.setState(state);
        }
    }
    getSelectedValuesAndHashKey(defaultValue?: ValueType | ValueType[], itemsByHashKey?: IDropdownPreparedItems<ItemType, ValueType>): { selectedValues: ValueType[], selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>> } {
        const { allowMultiple } = this.props;
        const sItemsByKeys: Record<string, IDropdownPreparedItem<ItemType, ValueType>> = {};
        const vals = allowMultiple ? (Array.isArray(defaultValue) ? defaultValue : typeof defaultValue === "string" ? (defaultValue.trim().split(",") as unknown as ValueType[]) : []) : [defaultValue];
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
        const { onChange, allowMultiple } = this.props;
        if (typeof onChange == "function") {
            setTimeout(() => {
                onChange({
                    ...Object.assign({}, preparedItem),
                    value: (allowMultiple ? this.state.selectedValues : this.state.selectedValues[0]) as any,
                    dropdown: this
                });
            }, 10);
        }
    }
    toggleItem(preparedItem: IDropdownPreparedItem<ItemType, ValueType> & { index: number }) {
        if (!isObj(preparedItem) || !isNonNullString(preparedItem.hashKey)) return;
        const newItemStatus = !this.isSelectedByHashKey(preparedItem.hashKey);
        const newState: IDropdownState<ItemType, ValueType> = {} as IDropdownState<ItemType, ValueType>;
        const { allowMultiple } = this.props;
        if (allowMultiple) {
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
        this.setState({ visible: true }, () => {
            this.trigger("open", this);
            this.trigger("toggleVisibility", this);
            if (typeof cb == "function") {
                cb();
            }
        });
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
    getSearchText() {
        return this.state.searchText;
    }
    unselectAll = () => {
        const { allowMultiple, required } = this.props;
        if (required) {
            return;
        }
        const nState: Partial<IDropdownState<ItemType, ValueType>> = { selectedItemsByHashKey: {}, selectedValues: [] };
        if (!allowMultiple) {
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
        return <DropdownRenderer<ItemType, ValueType, AllowMultiple> context={this} />
    }

    componentDidUpdate(prevProps: Readonly<IDropdownProps<ItemType, ValueType, AllowMultiple>>, nextContext: any): void {
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
        return <DropdownItem {...item} index={index} context={this as any} />;
    };
}

function DropdownRenderer<ItemType = unknown, ValueType = unknown, AllowMultiple extends boolean = boolean>({ context }: { context: Dropdown<ItemType, ValueType, AllowMultiple> }) {
    let { anchorContainerClassName, loadingBarVariant, searchInputProps, menuProps, anchor, error, defaultValue, maxHeight, disabled, dropdownActions, readOnly, editable, testID, allowMultiple, value, showAnchorChevron, ...props } = context.props;
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
        const actions: IDropdownAction<ItemType, ValueType, AllowMultiple>[] = [];
        if (dropdownActions) {
            const actProps = (typeof dropdownActions === "function" ? dropdownActions(context) : dropdownActions);
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
        if (allowMultiple) {
            if (actions.length) {
                actions.push({ divider: true })
            }
            actions.push({
                label: i18n.t("components.dropdown.selectAll"),
                icon: "checkbox-multiple-marked" as never,
                onPress: context.selectAll.bind(context),
            });
            if (!context.props?.required) {
                actions.push({
                    label: i18n.t("components.dropdown.unselectAll"),
                    icon: "checkbox-multiple-blank-outline" as never,
                    onPress: context.unselectAll.bind(context),
                });
            }
        } else if (anchorSelectedText) {
            if (actions.length) {
                actions.push({ divider: true });
            }
            if (!context.props?.required) {
                actions.push({
                    label: i18n.t("components.dropdown.unselectSingle"),
                    icon: "checkbox-blank-circle-outline" as never,
                    onPress: context.unselectAll.bind(context),
                })
            }
        }
        if (isNonNullString(context?.getSearchText?.())) {
            actions.push({
                label: i18n.t("components.dropdown.clearSearchText"),
                icon: "close" as never,
                onPress: () => {
                    context?.onSearch?.({ value: "" })
                },
            })
        }
        return actions;
    }, [dropdownActions, allowMultiple, context.isOpen(), context, anchorSelectedText]);
    const anchorProps: ITextInputProps = {
        numberOfLines: 1,
        ...props,
        containerClassName: cn("mt-0 mb-0", props.containerClassName),
        className: cn("mt-0 mb-0", props?.className),
        onChange: undefined,
        testID,
        isDropdownAnchor: true,
        disabled,
        defaultValue: anchorSelectedText,
        onPress: isLoading ? undefined : context.toggle.bind(context),
    };
    const { height: screenHeight } = Dimensions.get("window");
    const maxDropdownHeight = useMemo(() => {
        return isNumber(maxHeight) && maxHeight > 0 ? maxHeight : Math.max(screenHeight * 0.5, 300);
    }, [maxHeight, screenHeight]);

    const preparedItems = context.getPreparedItems()
    const canRenderSeach = !!!(context.props?.showSearch === false || context.props?.showSearch !== true && preparedItems?.length <= 5)


    return <Menu
        minWidth={200}
        disabled={disabled}
        maxHeight={maxDropdownHeight}
        bottomSheetTitle={context.props?.label}
        displayBottomSheetTitleDivider={!canRenderSeach}
        testID={testID + "-menu"}
        renderAsBottomSheetInFullScreen
        visible={visible}
        onRequestClose={() => context?.close?.()}
        onRequestOpen={() => context?.open?.()}
        sameWidth
        {...Object.assign({}, menuProps)}
        withScrollView={false}
        ref={context.getMenuRef.bind(context)}
        anchor={<Div
            disabled={disabled}
            testID={`${testID}-dropdown-anchor-container`}
            className={cn(anchorContainerClassName)}
        >
            <Tooltip title={anchorSelectedText} disabled={disabled} onPress={editable !== false ? () => context.open?.() : undefined}>
                <>
                    {typeof anchor == "function"
                        ? anchor({ ...anchorProps, selectedItems, selectedValues, allowMultiple: !!allowMultiple, isLoading, dropdown: context })
                        : anchor ||
                        <TextInput
                            {...anchorProps}
                            right={showAnchorChevron !== false ? (options) => {
                                const { computedVariant } = options;
                                const r = typeof anchorProps.right === "function" ? anchorProps.right(options) : anchorProps.right;
                                return <>
                                    <FontIcon
                                        name={"chevron-down" as never}
                                        className={cn("resk-dropdown-anchor-cheveron", computedVariant.icon())}
                                        size={20}
                                    />
                                    {r ?? null}
                                </>
                            } : anchorProps.right}
                        />}
                    {isLoading ? <ProgressBar variant={loadingBarVariant} indeterminate testID={testID + "dropdown-progressbar"} /> : null}
                </>
            </Tooltip>
        </Div>}
    >
        <DropdownMenu<ItemType, ValueType, AllowMultiple>
            maxHeight={maxDropdownHeight}
            context={context}
            canRenderSeach={canRenderSeach}
            actions={actions}
        />
    </Menu>
}

function DropdownMenu<ItemType = unknown, ValueType = unknown, AllowMultiple extends boolean = boolean>({ maxHeight, actions, canRenderSeach, context }: { maxHeight: number, actions: IDropdownAction<ItemType, ValueType, AllowMultiple>[], canRenderSeach: boolean, context: Dropdown<ItemType, ValueType, AllowMultiple> }) {
    const isEditabled = context?.props?.editable !== false && !(context?.props?.disabled) && !(context?.props?.readOnly);
    const { searchInputProps, error, actionsMenuClassName, actionsIconName, actionsIconVariant } = context.props;
    const listProps = Object.assign({}, context.props.listProps);
    const testID = context?.getTestID();
    const menuContext = useMenu();
    const { menu } = Object.assign({}, menuContext);
    const menuPosition = menu?.position;
    const isTopPosition = menuPosition?.yPlacement === "top";
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
        <Div testID={`${testID}-dropdown-search-container`} className={cn("w-full px-[7px] max-w-full")}>
            {canReverse ? divider : null}
            <TextInput
                testID={`${testID}-dropdown-search`}
                autoFocus={visible && !Platform.isTouchDevice()}
                affix={false}
                debounceTimeout={preparedItems?.length > 500 ? 1000 : preparedItems?.length > 200 ? 100 : 0}
                {...searchProps}
                left={(options) => {
                    const { computedVariant } = options;
                    const left = typeof searchProps.left === "function" ? searchProps.left(options) : searchProps.left;
                    return <>
                        {left ?? null}
                        <FontIcon
                            name={"chevron-down" as never}
                            className={cn("resk-dropdown-anchor-cheveron", computedVariant.icon())}
                            size={20}
                        />
                    </>
                }}
                containerClassName={(cn("w-full", searchProps.containerClassName))}
                //variant={{ borderWidth: 1, borderColor: "surface", borderStyle: "solid", rounded: "10px", ...searchProps.variant }}
                defaultValue={searchText}
                onChange={({ value }) => {
                    context.onSearch?.({ value })
                }}
                placeholder={i18n.t("components.dropdown.searchPlaceholder", { count: filteredItems?.length })}
                right={!actions?.length ? null : (
                    <Menu
                        items={actions}
                        testID={`${testID}-dropdown-menu-actions`}
                        minWidth={150}
                        preferedPositionAxis="vertical"
                        anchor={<FontIcon
                            name={actionsIconName || FONT_ICONS.MORE as never}
                            className={actionsMenuClassName}
                            variant={{ size: "25px", ...actionsIconVariant }}
                        />}
                    />
                )
                }
            />
            {!canReverse ? divider : null}
        </Div> : null;
    return <Div
        disabled={context?.props?.disabled}
        testID={testID + "-dropdown-list-container"}
        className={cn("w-full max-h-full relative flex flex-col web:bg-inherit", canReverse ? "pt-[10px]" : "pb-[10px]")}
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

const DropdownItem = memo(function DropdownItem(preparedItem: IDropdownPreparedItem & { index: number, context: Dropdown }): IReactNullableElement {
    const { label, hashKey, labelText, context } = preparedItem;
    const [state, dispatch] = useState(Object.create(null));
    const forceRender = useCallback(() => {
        dispatch(Object.create(null));
    }, []);
    const selectedItemsByHashKey = context.getSelectedItemsByHashKey();
    const { allowMultiple, selectedIconName, itemClassName, itemVariant, itemContainerClassName } = context.props;
    const testID = context.getTestID();
    const computedVariant = dropdownItemVariant(itemVariant);
    const isSelected = useMemo(() => {
        return context.isSelectedByHashKey(hashKey);
    }, [selectedItemsByHashKey, hashKey, state]);
    const bindEventRefs = useRef<({ remove?: Function })[]>([]);
    const clearEvents = () => {
        bindEventRefs.current.map((ob) => {
            ob?.remove?.();
        });
    }
    useEffect(() => {
        clearEvents();
        if (typeof context.on !== "function") {
            return;
        }
        bindEventRefs.current = [
            context.on("toggleItem", (options: any) => {
                if (options?.hashKey === hashKey) {
                    forceRender();
                }
            }),
            context.on("selectAll", forceRender),
            context.on("unselectAll", forceRender),
        ];
        return () => {
            clearEvents();
        }
    }, [hashKey, context]);
    useEffect(() => {
        return () => {
            clearEvents();
        }
    }, [])
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
                {isSelected ? <FontIcon className={cn("mr-[5px]", computedVariant.selectedIcon())} name={(isNonNullString(selectedIconName) ? selectedIconName : allowMultiple ? "check" : "radiobox-marked") as never} /> : null}
                {<Text className={cn(isSelected ? computedVariant.selectedLabel() : computedVariant.label())}>{label}</Text>}
            </Div>
        </Tooltip>
    );
});


DropdownItem.displayName = "Dropdown.Item";




export interface IDropdownState<ItemType = unknown, ValueType = unknown> {
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

export interface IDropdownAction<ItemType = unknown, ValueType = unknown, AllowMultiple extends boolean = boolean> extends INavItemProps<{ dropdown: Dropdown<ItemType, ValueType, AllowMultiple> }> { }

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
export type IDropdownPreparedItems<ItemType = unknown, ValueType = unknown> = Record<string, IDropdownPreparedItem<ItemType, ValueType>>;


export interface IDropdownOnChangeOptions<ItemType = unknown, ValueType = unknown, AllowMultiple extends boolean = boolean> extends Omit<Partial<IDropdownPreparedItem<ItemType, ValueType>>, 'value'> {
    value: IDropdownItemValue<ValueType, AllowMultiple>;
    dropdown: Dropdown<ItemType, ValueType, AllowMultiple>;
};

export type IDropdownItemValue<ValueType = unknown, AllowMultiple extends boolean = boolean> = AllowMultiple extends true ? ValueType[] : ValueType;

export interface IDropdownCallOptions<ItemType = unknown, ValueType = unknown, AllowMultiple extends boolean = boolean> {
    item: ItemType; // The item being interacted with
    index: number; // The index of the item in the dropdown list
    isDropdown: true; // Indicates that the context is within a dropdown
    dropdown: Dropdown<ItemType, ValueType, AllowMultiple>;
    value: ValueType;
}

/**
 * Configuration interface for the Dropdown component, providing comprehensive customization options
 * for rendering, behavior, styling, and interaction patterns.
 * 
 * This interface extends the base TextInput properties while excluding conflicting props like 
 * `onChange`, `type`, `ref`, and `multiline` to provide a specialized dropdown experience.
 * 
 * @interface IDropdownProps
 * @template ItemType - The type of items stored in the dropdown (e.g., objects, strings, numbers)
 * @template ValueType - The type of values extracted from items for selection tracking
 * @template AllowMultiple - Boolean flag that determines if multiple selection is enabled
 * 
 * @extends {Omit<ITextInputProps, "onChange" | "type" | "ref" | "multiline">}
 * 
 * @example
 * ```tsx
 * // Basic string dropdown (single selection)
 * <Dropdown<string, string, false>
 *   items={['Option 1', 'Option 2', 'Option 3']}
 *   allowMultiple={false}
 *   defaultValue="Option 1"  // Single string value
 *   onChange={({ value }) => console.log(value)} // value is string
 * />
 * 
 * // Multi-selection dropdown
 * <Dropdown<string, string, true>
 *   items={['Apple', 'Banana', 'Cherry']}
 *   allowMultiple={true}
 *   defaultValue={['Apple', 'Banana']}  // Array of strings
 *   onChange={({ value }) => console.log(value)} // value is string[]
 * />
 * 
 * // Object-based dropdown with conditional types
 * interface User { id: number; name: string; email: string; }
 * 
 * <Dropdown<User, number, true>
 *   items={users}
 *   allowMultiple={true}
 *   defaultValue={[1, 3, 5]}  // Array of numbers (user IDs)
 *   getItemValue={({ item }) => item.id}
 *   getItemLabel={({ item }) => (
 *     <View>
 *       <Text>{item.name}</Text>
 *       <Text style={{fontSize: 12}}>{item.email}</Text>
 *     </View>
 *   )}
 *   onChange={({ value, selectedItems }) => {
 *     console.log('Selected IDs:', value); // value is number[]
 *     console.log('Selected Users:', selectedItems); // selectedItems is User[]
 *   }}
 * />
 * ```
 * 
 * @since 1.0.0
 * @author Resk Framework Team
 * @see {@link Dropdown} Main dropdown component class
 * @see {@link IDropdownState} Dropdown state interface
 */
export interface IDropdownProps<ItemType = unknown, ValueType = unknown, AllowMultiple extends boolean = boolean> extends Omit<ITextInputProps, "onChange" | "type" | "ref" | "multiline"> {

    /**
     * Collection of items to be displayed in the dropdown menu.
     * 
     * This array represents the data source for the dropdown. Items can be of any type,
     * from simple primitives (strings, numbers) to complex objects. The dropdown will
     * process these items using the provided accessor functions or fallback to default
     * item processing logic.
     * 
     * @type {ItemType[]}
     * @optional
     * @default []
     * 
     * @example
     * ```tsx
     * // Simple string array
     * items={['Apple', 'Banana', 'Cherry']}
     * 
     * // Complex object array
     * items={[
     *   { id: 1, name: 'John Doe', role: 'Admin' },
     *   { id: 2, name: 'Jane Smith', role: 'User' },
     *   { id: 3, name: 'Bob Johnson', role: 'Moderator' }
     * ]}
     * 
     * // Mixed type array
     * items={[
     *   'Simple String',
     *   { id: 1, label: 'Complex Object' },
     *   42,
     *   true
     * ]}
     * ```
     */
    items?: ItemType[];

    /**
     * Extracts the unique value from each dropdown item for selection tracking and identification.
     * 
     * This function is called for each item to determine its selectable value. The returned
     * value is used for tracking selections, generating hash keys, and managing the dropdown's
     * internal state. If not provided, the dropdown will attempt to extract values using
     * the `itemValueField` property or fallback to default extraction logic.
     * 
     * @param {Omit<IDropdownCallOptions<ItemType, ValueType>, 'value'>} options - Item processing context
     * @param {ItemType} options.item - The current item being processed
     * @param {number} options.index - The index of the item in the items array
     * @param {Dropdown<ItemType,ValueType,AllowMultiple>} options.dropdown - Dropdown context instance
     * @param {boolean} options.isDropdown - Always true, indicates dropdown context
     * 
     * @returns {ValueType | undefined} The extracted value or undefined if extraction fails
     * 
     * @example
     * ```tsx
     * // Extract ID from user objects
     * getItemValue={({ item }) => item.id}
     * 
     * // Extract nested property
     * getItemValue={({ item }) => item.profile?.userId}
     * 
     * // Complex value extraction with validation
     * getItemValue={({ item, index }) => {
     *   if (typeof item === 'string') return item;
     *   if (item?.id) return item.id;
     *   return `item-${index}`; // Fallback
     * }}
     * 
     * // Return the item itself as value
     * getItemValue={({ item }) => item}
     * ```
     */
    getItemValue?: (options: Omit<IDropdownCallOptions<ItemType, ValueType>, 'value'>) => ValueType | undefined;

    /**
     * Generates the visual representation (label) for each dropdown item.
     * 
     * This function controls how each item appears in the dropdown list. It can return
     * simple text strings or complex React components with custom styling, icons, and
     * interactive elements. The returned ReactNode will be rendered as the item's visual
     * representation in the dropdown menu.
     * 
     * @param {IDropdownCallOptions<ItemType, ValueType>} options - Item rendering context
     * @param {ItemType} options.item - The current item being rendered
     * @param {number} options.index - The index of the item in the items array
     * @param {ValueType} options.value - The extracted value for this item
     * @param {Dropdown<ItemType,ValueType,AllowMultiple>} options.dropdown - Dropdown context instance
     * 
     * @returns {ReactNode} The visual representation of the item
     * 
     * @example
     * ```tsx
     * // Simple text label
     * getItemLabel={({ item }) => item.name}
     * 
     * // Rich component with icon and description
     * getItemLabel={({ item, value }) => (
     *   <View style={{flexDirection: 'row', alignItems: 'center'}}>
     *     <Icon name={item.icon} size={20} />
     *     <View style={{marginLeft: 10}}>
     *       <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
     *       <Text style={{fontSize: 12, color: 'gray'}}>{item.description}</Text>
     *     </View>
     *     {item.isNew && <Badge text="NEW" />}
     *   </View>
     * )}
     * 
     * // Conditional rendering based on item type
     * getItemLabel={({ item, index }) => {
     *   if (typeof item === 'string') return item;
     *   if (item.type === 'header') return <Text style={{fontWeight: 'bold'}}>{item.title}</Text>;
     *   return `Item ${index + 1}`;
     * }}
     * ```
     */
    getItemLabel?: (options: IDropdownCallOptions<ItemType, ValueType>) => ReactNode;

    /**
     * Converts the item's visual label to plain text for accessibility and anchor display.
     * 
     * This function extracts plain text representation from the item's label, which is used
     * for displaying selected items in the dropdown anchor, accessibility features, and
     * search functionality. It receives both the item context and the computed label from
     * `getItemLabel` to generate appropriate text.
     * 
     * @param {IDropdownCallOptions<ItemType, ValueType> & { computedLabel: ReactNode }} options - Text extraction context
     * @param {ItemType} options.item - The current item being processed
     * @param {number} options.index - The index of the item in the items array
     * @param {ValueType} options.value - The extracted value for this item
     * @param {ReactNode} options.computedLabel - The visual label generated by getItemLabel
     * @param {Dropdown<ItemType,ValueType,AllowMultiple>} options.dropdown - Dropdown context instance
     * 
     * @returns {string} Plain text representation of the item
     * 
     * @example
     * ```tsx
     * // Extract text from complex label
     * getItemText={({ item, computedLabel }) => {
     *   // If label is a simple string, return it
     *   if (typeof computedLabel === 'string') return computedLabel;
     *   // For complex objects, return the name property
     *   return item.name || item.title || 'Unknown Item';
     * }}
     * 
     * // Generate descriptive text
     * getItemText={({ item, value }) => {
     *   return `${item.name} (ID: ${value})`;
     * }}
     * 
     * // Custom text formatting
     * getItemText={({ item, index }) => {
     *   return `${index + 1}. ${item.title.toUpperCase()}`;
     * }}
     * ```
     */
    getItemText?: (options: IDropdownCallOptions<ItemType, ValueType> & { computedLabel: ReactNode }) => string;

    /**
     * Enables multiple item selection within the dropdown.
     * 
     * When enabled, users can select multiple items simultaneously. The dropdown will
     * display checkboxes for each item and maintain an array of selected values.
     * The selection behavior, icons, and interaction patterns automatically adapt
     * to support multi-selection mode.
     * 
     * **Type Safety:** This property affects the type of `defaultValue` and `onChange` callback:
     * - When `true`: `defaultValue` expects `ValueType[]`, `onChange` receives `ValueType[]`
     * - When `false`: `defaultValue` expects `ValueType`, `onChange` receives `ValueType`
     * 
     * @type {AllowMultiple}
     * @optional
     * @default false
     * 
     * @example
     * ```tsx
     * // Enable multi-selection (type-safe)
     * <Dropdown<Fruit, string, true>
     *   items={fruits}
     *   allowMultiple={true}
     *   defaultValue={['apple', 'banana']} // Must be array
     *   onChange={({ value, selectedItems }) => {
     *     console.log('Selected values:', value); // value is string[]
     *     console.log('Selected items:', selectedItems); // Array of items
     *   }}
     * />
     * 
     * // Single selection (type-safe)
     * <Dropdown<Country, string, false>
     *   items={countries}
     *   allowMultiple={false}
     *   defaultValue="USA" // Must be single value
     *   onChange={({ value, item }) => {
     *     console.log('Selected value:', value); // value is string
     *     console.log('Selected item:', item); // Single item
     *   }}
     * />
     * ```
     */
    allowMultiple?: AllowMultiple | undefined;

    /**
     * Callback function triggered when the dropdown selection changes.
     * 
     * This function is invoked whenever users select or deselect items. It provides
     * comprehensive information about the new selection state, including selected
     * values, items, and the dropdown context for advanced manipulation.
     * 
     * **Type Safety:** The callback parameters are conditionally typed based on `AllowMultiple`:
     * - Single selection (`AllowMultiple = false`): `value` is `ValueType`
     * - Multiple selection (`AllowMultiple = true`): `value` is `ValueType[]`
     * 
     * @param {IDropdownOnChangeOptions<ItemType, ValueType, AllowMultiple>} options - Change event context
     * @param {IDropdownItemValue<ValueType,AllowMultiple>} options.value - Selected value(s) with conditional typing
     * @param {ItemType[]} options.selectedItems - Array of selected items
     * @param {Dropdown<ItemType,ValueType,AllowMultiple>} options.dropdown - Dropdown context
     * 
     * @returns {void}
     * 
     * @example
     * ```tsx
     * // Single selection - type-safe value handling
     * <Dropdown<User, string, false>
     *   items={users}
     *   allowMultiple={false}
     *   onChange={({ value, selectedItems }) => {
     *     console.log('Selected user ID:', value); // value is string
     *     console.log('Selected user:', selectedItems[0]); // Single user object
     *     setSelectedUserId(value); // Type-safe assignment
     *   }}
     * />
     * 
     * // Multiple selection - type-safe array handling
     * <Dropdown<Category, number, true>
     *   items={categories}
     *   allowMultiple={true}
     *   onChange={({ value, selectedItems }) => {
     *     console.log('Selected category IDs:', value); // value is number[]
     *     console.log('Selected categories:', selectedItems); // Array of category objects
     *     
     *     if (value.length > 5) {
     *       alert('Maximum 5 categories allowed');
     *       return;
     *     }
     *     
     *     setSelectedCategoryIds(value); // Type-safe array assignment
     *   }}
     * />
     * 
     * // Advanced change handler with validation
     * onChange={({ value, selectedItems, dropdown }) => {
     *   // Validation logic
     *   if (selectedItems.length > 5) {
     *     alert('Maximum 5 items allowed');
     *     return;
     *   }
     *   
     *   // Update state
     *   setSelection(value);
     *   
     *   // Close dropdown for single selection
     *   if (!dropdown.props.allowMultiple) {
     *     dropdown.close();
     *   }
     * }}
     * 
     * // Async operation trigger
     * onChange={async ({ value, selectedItems }) => {
     *   setLoading(true);
     *   try {
     *     await updateUserPreferences(value);
     *     showSuccess('Preferences updated');
     *   } catch (error) {
     *     showError('Failed to update preferences');
     *   } finally {
     *     setLoading(false);
     *   }
     * }}
     * ```
     */
    onChange?: (options: IDropdownOnChangeOptions<ItemType, ValueType, AllowMultiple>) => void;

    /**
     * Preselected value(s) when the dropdown is first rendered.
     * 
     * The initial selection state of the dropdown. The type of this property
     * is automatically inferred based on the `allowMultiple` setting:
     * - Single selection: accepts a single value of type `ValueType`
     * - Multiple selection: accepts an array of values of type `ValueType[]`
     * 
     * **Type Safety:** The type is conditionally determined by the `AllowMultiple` generic:
     * - `AllowMultiple extends true` → expects `ValueType[]`
     * - `AllowMultiple extends false` → expects `ValueType`
     * 
     * @type {IDropdownItemValue<ValueType, AllowMultiple>}
     * @optional
     * 
     * @example
     * ```tsx
     * // Single selection - expects single value
     * <Dropdown<User, string, false>
     *   items={users}
     *   allowMultiple={false}
     *   defaultValue="john-doe" // Type: string
     *   labelKey="name"
     *   valueKey="id"
     * />
     * 
     * // Multiple selection - expects array
     * <Dropdown<Category, number, true>
     *   items={categories}
     *   allowMultiple={true}
     *   defaultValue={[1, 3, 5]} // Type: number[]
     *   labelKey="title"
     *   valueKey="categoryId"
     * />
     * 
     * // Dynamic based on user preference
     * <Dropdown<Product, string, typeof multiMode>
     *   items={products}
     *   allowMultiple={multiMode}
     *   defaultValue={multiMode ? ['prod1', 'prod2'] : 'prod1'}
     *   labelKey="name"
     *   valueKey="sku"
     * />
     * ```
     */
    defaultValue?: IDropdownItemValue<ValueType, AllowMultiple>;

    /**
     * Generates unique hash keys for efficient item identification and rendering.
     * 
     * This function creates stable, unique identifiers for each item value, which
     * are used internally for selection tracking, React key props, and performance
     * optimization. If not provided, the dropdown will generate hash keys using
     * a default algorithm based on the item values.
     * 
     * @param {ValueType} value - The item value to generate a hash key for
     * 
     * @returns {string} A unique string identifier for the value
     * 
     * @example
     * ```tsx
     * // Simple string-based hash
     * getHashKey={(value) => `item-${value}`}
     * 
     * // Complex object hash
     * getHashKey={(value) => `${value.category}-${value.id}`}
     * 
     * // UUID-based hash for uniqueness
     * getHashKey={(value) => `${value}-${uuidv4()}`}
     * 
     * // Hash based on multiple properties
     * getHashKey={(value) => {
     *   if (typeof value === 'object') {
     *     return `${value.type}-${value.id}-${value.version}`;
     *   }
     *   return String(value);
     * }}
     * ```
     */
    getHashKey?: (value: ValueType) => string;

    /**
     * Filters items to control which ones are displayed in the dropdown.
     * 
     * This function is called for each prepared item to determine whether it should
     * be included in the dropdown list. It's useful for implementing custom filtering
     * logic, hiding certain items based on user permissions, or creating dynamic
     * item lists based on application state.
     * 
     * @param {IDropdownPreparedItem<ItemType, ValueType>} preparedItem - The processed item with metadata
     * @param {number} index - The index of the item in the original items array
     * 
     * @returns {boolean} True to include the item, false to exclude it
     * 
     * @example
     * ```tsx
     * // Filter based on user permissions
     * filterItem={(preparedItem, index) => {
     *   return user.permissions.includes(preparedItem.item.requiredPermission);
     * }}
     * 
     * // Hide items based on search criteria
     * filterItem={(preparedItem) => {
     *   return preparedItem.item.category === selectedCategory;
     * }}
     * 
     * // Limit number of visible items
     * filterItem={(preparedItem, index) => index < maxVisibleItems}
     * 
     * // Complex filtering with multiple conditions
     * filterItem={(preparedItem, index) => {
     *   const item = preparedItem.item;
     *   return item.isActive && 
     *          item.level >= minLevel && 
     *          !hiddenIds.includes(preparedItem.value);
     * }}
     * ```
     */
    filterItem?: (preparedItem: IDropdownPreparedItem<ItemType, ValueType>, index: number) => boolean;

    /**
     * Additional properties for the underlying FlatList component used to render dropdown items.
     * 
     * These props are passed directly to the React Native FlatList that renders the dropdown
     * items, allowing for advanced customization of scrolling behavior, performance optimization,
     * and list-specific styling. Common use cases include custom scroll indicators, snap behavior,
     * and performance tuning for large datasets.
     * 
     * @type {FlatListProps<IDropdownPreparedItem<ItemType, ValueType>>}
     * @optional
     * 
     * @example
     * ```tsx
     * // Performance optimization for large lists
     * listProps={{
     *   initialNumToRender: 10,
     *   maxToRenderPerBatch: 5,
     *   windowSize: 10,
     *   removeClippedSubviews: true,
     *   getItemLayout: (data, index) => ({
     *     length: 50,
     *     offset: 50 * index,
     *     index,
     *   })
     * }}
     * 
     * // Custom scroll behavior
     * listProps={{
     *   showsVerticalScrollIndicator: false,
     *   bounces: false,
     *   decelerationRate: 'fast',
     *   snapToInterval: 50,
     *   snapToAlignment: 'start'
     * }}
     * 
     * // Pull-to-refresh functionality
     * listProps={{
     *   refreshing: isRefreshing,
     *   onRefresh: handleRefresh,
     *   refreshControl: <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
     * }}
     * ```
     */
    listProps?: FlatListProps<IDropdownPreparedItem<ItemType, ValueType>>;

    /**
     * Controls the visibility of the search input field within the dropdown.
     * 
     * When enabled, a search input appears at the top of the dropdown menu, allowing
     * users to filter items by typing. The search functionality automatically filters
     * items based on their text representation. The search input is automatically
     * shown for dropdowns with more than 5 items unless explicitly configured.
     * 
     * @type {boolean}
     * @optional
     * @default Auto-determined based on item count (true if > 5 items)
     * 
     * @example
     * ```tsx
     * // Always show search
     * showSearch={true}
     * 
     * // Never show search
     * showSearch={false}
     * 
     * // Auto-show based on item count (default behavior)
     * // showSearch prop omitted
     * ```
     */
    showSearch?: boolean;

    /**
     * Configuration properties for the search input field within the dropdown.
     * 
     * These properties customize the appearance and behavior of the search input,
     * including placeholder text, styling, icons, and input validation. All standard
     * TextInput properties are supported except for `value` and `defaultValue`,
     * which are managed internally by the dropdown.
     * 
     * @type {Omit<ITextInputProps, "value" | "defaultValue">}
     * @optional
     * 
     * @example
     * ```tsx
     * searchInputProps={{
     *   placeholder: "Search countries...",
     *   left: <Icon name="search" size={20} />,
     *   containerClassName: "border-2 border-blue-500",
     *   debounceTimeout: 300,
     *   autoCapitalize: "none",
     *   clearButtonMode: "while-editing"
     * }}
     * 
     * // Advanced search with custom styling
     * searchInputProps={{
     *   placeholder: "Type to filter...",
     *   variant: {
     *     backgroundColor: "rgba(0,0,0,0.05)",
     *     borderRadius: 12,
     *     paddingHorizontal: 16
     *   },
     *   left: ({ computedVariant }) => (
     *     <Icon 
     *       name="search" 
     *       className={computedVariant.icon()} 
     *       size={18} 
     *     />
     *   )
     * }}
     * ```
     */
    searchInputProps?: Omit<ITextInputProps, "value" | "defaultValue">;

    /**
     * Indicates whether the dropdown is in a loading state.
     * 
     * When true, the dropdown displays a loading indicator and disables user
     * interaction. This is typically used when fetching data asynchronously
     * or performing operations that require user to wait. The loading state
     * automatically disables the dropdown anchor and shows a progress bar.
     * 
     * @type {boolean}
     * @optional
     * @default false
     * 
     * @example
     * ```tsx
     * const [isLoading, setIsLoading] = useState(false);
     * 
     * // Loading during data fetch
     * <Dropdown
     *   items={items}
     *   isLoading={isLoading}
     *   onChange={async ({ value }) => {
     *     setIsLoading(true);
     *     try {
     *       await saveSelection(value);
     *     } finally {
     *       setIsLoading(false);
     *     }
     *   }}
     * />
     * ```
     */
    isLoading?: boolean;

    /**
     * Forces the dropdown to render in full-screen mode on mobile devices.
     * 
     * When enabled, the dropdown menu will take up the entire screen on mobile
     * devices, providing a better user experience for touch navigation. This
     * is particularly useful for dropdowns with many items or when the dropdown
     * contains complex item layouts that benefit from additional screen space.
     * 
     * @type {boolean}
     * @optional
     * @default false
     * 
     * @example
     * ```tsx
     * // Force full-screen on mobile
     * <Dropdown
     *   items={countries}
     *   isFullScreen={true}
     *   showSearch={true}
     * />
     * ```
     */
    isFullScreen?: boolean;

    /**
     * CSS class name for styling the dropdown list container.
     * 
     * This class is applied to the main container that wraps the dropdown list,
     * allowing for custom styling of the overall list appearance, background,
     * borders, and layout properties.
     * 
     * @type {IClassName}
     * @optional
     * 
     * @example
     * ```tsx
     * listContainerClassName="bg-white shadow-lg rounded-lg border border-gray-200"
     * ```
     */
    listContainerClassName?: IClassName;

    /**
     * CSS class name for styling the content container within the dropdown list.
     * 
     * This class is applied to the inner content container of the dropdown list,
     * providing fine-grained control over the content area styling, padding,
     * and spacing between list items.
     * 
     * @type {IClassName}
     * @optional
     * 
     * @example
     * ```tsx
     * listContentContainerClassName="p-2 space-y-1"
     * ```
     */
    listContentContainerClassName?: IClassName;

    /**
     * CSS class name for styling the anchor container element.
     * 
     * This class is applied to the container View that wraps the dropdown anchor
     * element (typically a TextInput), allowing for custom styling of the trigger
     * area, including margins, padding, borders, and positioning.
     * 
     * @type {IClassName}
     * @optional
     * 
     * @example
     * ```tsx
     * anchorContainerClassName="mb-4 shadow-sm"
     * ```
     */
    anchorContainerClassName?: IClassName;

    /**
     * Collection of action items displayed in the dropdown's action menu.
     * 
     * These actions appear as menu items that users can trigger to perform
     * operations on the dropdown or its data. Actions can be provided as a
     * static array or a function that receives the dropdown context and returns
     * an array. Common actions include "Select All", "Clear Selection", "Refresh", etc.
     * 
     * @type {INavItems<IDropdownAction<ItemType, ValueType, AllowMultiple>> | ((options: Dropdown<ItemType,ValueType,AllowMultiple>) => INavItems<IDropdownAction<ItemType, ValueType,AllowMultiple>>)}
     * @optional
     * 
     * @example
     * ```tsx
     * // Static actions
     * dropdownActions={[
     *   {
     *     label: 'Select All',
     *     icon: 'check-all',
     *     onPress: ({ dropdown }) => dropdown.selectAll()
     *   },
     *   {
     *     label: 'Clear Selection',
     *     icon: 'close',
     *     onPress: ({ dropdown }) => dropdown.unselectAll()
     *   },
     *   { divider: true },
     *   {
     *     label: 'Refresh Data',
     *     icon: 'refresh',
     *     onPress: () => refreshData()
     *   }
     * ]}
     * 
     * // Dynamic actions based on context
     * dropdownActions={(context) => {
     *   const actions = [];
     *   
     *   if (context.allowMultiple) {
     *     actions.push({
     *       label: 'Select All',
     *       onPress: ({ dropdown }) => dropdown.selectAll()
     *     });
     *   }
     *   
     *   if (context.getSelectedItemsByHashKey().length > 0) {
     *     actions.push({
     *       label: 'Clear',
     *       onPress: ({ dropdown }) => dropdown.unselectAll()
     *     });
     *   }
     *   
     *   return actions;
     * }}
     * ```
     */
    dropdownActions?: INavItems<IDropdownAction<ItemType, ValueType, AllowMultiple>> | ((options: Dropdown<ItemType, ValueType, AllowMultiple>) => INavItems<IDropdownAction<ItemType, ValueType, AllowMultiple>>);

    /**
     * Visual styling variant for the dropdown actions menu icon.
     * 
     * This variant controls the appearance of the icon that triggers the actions
     * menu, including size, color, styling effects, and hover states. The variant
     * system provides consistent theming across the application.
     * 
     * @type {IIconVariant}
     * @optional
     * 
     * @example
     * ```tsx
     * actionsIconVariant={{
     *   size: "24px",
     *   color: "primary",
     *   hover: { color: "primary-dark" }
     * }}
     * ```
     */
    actionsIconVariant?: IIconVariant;

    /**
     * Name of the icon displayed for the dropdown actions menu trigger.
     * 
     * This specifies which icon from the icon font library should be used
     * for the actions menu button. If not provided, defaults to a standard
     * "more" or "options" icon (typically three dots or lines).
     * 
     * @type {IFontIconName}
     * @optional
     * @default "more" (three dots icon)
     * 
     * @example
     * ```tsx
     * actionsIconName="menu"
     * actionsIconName="more-vertical"
     * actionsIconName="settings"
     * ```
     */
    actionsIconName?: IFontIconName;

    /**
     * CSS class name for styling the dropdown actions menu icon.
     * 
     * This class is applied specifically to the actions menu icon, allowing
     * for custom styling such as colors, sizing, spacing, and visual effects
     * independent of the overall icon variant system.
     * 
     * @type {IClassName}
     * @optional
     * 
     * @example
     * ```tsx
     * actionsMenuClassName="text-gray-500 hover:text-gray-700 ml-2"
     * ```
     */
    actionsMenuClassName?: IClassName;

    /**
     * Name of the icon displayed next to selected dropdown items.
     * 
     * This icon appears next to items that are currently selected, providing
     * visual feedback about the selection state. If not specified, the dropdown
     * uses default icons: "check" for multiple selection mode and "radiobox-marked"
     * for single selection mode.
     * 
     * @type {IFontIconName}
     * @optional
     * @default "check" for multiple selection, "radiobox-marked" for single selection
     * 
     * @example
     * ```tsx
     * // Custom checkmark
     * selectedIconName="check-circle"
     * 
     * // Star for favorites
     * selectedIconName="star"
     * 
     * // Custom selection indicator
     * selectedIconName="arrow-right"
     * ```
     */
    selectedIconName?: IFontIconName;

    /**
     * Configuration properties for the Menu component that wraps the dropdown.
     * 
     * These properties allow comprehensive customization of the dropdown menu's
     * behavior, positioning, animations, and appearance. The Menu component handles
     * the dropdown's popup behavior, positioning logic, and overlay management.
     * All standard Menu properties are supported except for `anchor`, which is
     * managed internally by the dropdown.
     * 
     * @type {Omit<IMenuProps, "anchor">}
     * @optional
     * 
     * @example
     * ```tsx
     * menuProps={{
     *   placement: "bottom-start",
     *   offset: 8,
     *   flip: true,
     *   autoUpdate: true,
     *   matchWidth: true,
     *   closeOnScroll: true,
     *   animationDuration: 200,
     *   className: "shadow-xl border border-gray-200"
     * }}
     * 
     * // Advanced menu configuration
     * menuProps={{
     *   strategy: "fixed",
     *   boundary: document.body,
     *   rootBoundary: "viewport",
     *   padding: 8,
     *   fallbackPlacements: ["top", "bottom", "left", "right"],
     *   onPositioned: (data) => console.log('Menu positioned:', data)
     * }}
     * ```
     */
    menuProps?: Omit<IMenuProps, "anchor">;

    /**
     * CSS class name for styling individual dropdown list items.
     * 
     * This class is applied to the content container of each dropdown item,
     * controlling the appearance of the item's text, layout, spacing, and
     * interactive states. It affects the direct content area of each item
     * but not the outer container or selection indicators.
     * 
     * @type {IClassName}
     * @optional
     * 
     * @example
     * ```tsx
     * itemClassName="px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
     * 
     * // With conditional styling
     * itemClassName={cn(
     *   "px-3 py-2 rounded-md transition-colors",
     *   isCompact ? "text-xs" : "text-sm",
     *   darkMode ? "text-white" : "text-gray-900"
     * )}
     * ```
     */
    itemClassName?: IClassName;

    /**
     * Visual styling variant configuration for dropdown items.
     * 
     * This variant object controls the comprehensive appearance of dropdown items,
     * including colors, typography, spacing, borders, and state-based styling
     * (hover, selected, disabled). The variant system ensures consistent theming
     * and provides predefined style combinations.
     * 
     * @type {IDropdownItemVariant}
     * @optional
     * 
     * @example
     * ```tsx
     * itemVariant={{
     *   size: "medium",
     *   color: "primary",
     *   rounded: "md",
     *   selected: {
     *     backgroundColor: "primary-50",
     *     color: "primary-700",
     *     fontWeight: "semibold"
     *   },
     *   hover: {
     *     backgroundColor: "gray-100"
     *   }
     * }}
     * 
     * // Compact variant for dense lists
     * itemVariant={{
     *   size: "small",
     *   padding: "xs",
     *   fontSize: "sm"
     * }}
     * ```
     */
    itemVariant?: IDropdownItemVariant;

    /**
     * CSS class name for styling the container wrapper of each dropdown item.
     * 
     * This class is applied to the outer container (Tooltip component) that wraps
     * each dropdown item, providing control over the item's overall layout,
     * spacing, positioning, and container-level styling. This is distinct from
     * `itemClassName` which styles the inner content area.
     * 
     * @type {IClassName}
     * @optional
     * 
     * @example
     * ```tsx
     * itemContainerClassName="border-b border-gray-100 last:border-b-0"
     * 
     * // With responsive design
     * itemContainerClassName="mb-1 md:mb-0 md:border-r md:border-b-0"
     * ```
     */
    itemContainerClassName?: IClassName;

    /**
     * Custom anchor component for the dropdown trigger element.
     * 
     * This property allows complete customization of the element that users interact
     * with to open the dropdown. It can be either a function that receives comprehensive
     * anchor properties and returns a custom ReactElement, or a direct ReactElement
     * for static custom anchors.
     * 
     * When using the function approach (recommended), you receive:
     * - All TextInput properties (except onChange)
     * - Dropdown context for accessing methods and state
     * - Current loading state and selection information
     * - Selected items and values for dynamic rendering
     * 
     * @type {((options: AnchorFunctionOptions) => ReactElement) | ReactElement}
     * @optional
     * @default TextInput with chevron icon
     * 
     * @example
     * ```tsx
     * // Custom button anchor
     * anchor={({ selectedItems, dropdown, isLoading }) => (
     *   <TouchableOpacity 
     *     onPress={() => dropdown.toggle()}
     *     disabled={isLoading}
     *     style={styles.customAnchor}
     *   >
     *     <Text>{selectedItems.length} items selected</Text>
     *     <Icon name="chevron-down" />
     *   </TouchableOpacity>
     * )}
     * 
     * // Rich anchor with avatars
     * anchor={({ selectedItems, dropdown, allowMultiple }) => (
     *   <View style={styles.richAnchor}>
     *     <View style={styles.avatarContainer}>
     *       {selectedItems.slice(0, 3).map(item => (
     *         <Avatar key={item.id} source={{ uri: item.avatar }} />
     *       ))}
     *       {selectedItems.length > 3 && (
     *         <Text>+{selectedItems.length - 3}</Text>
     *       )}
     *     </View>
     *     <Text>
     *       {selectedItems.length === 0 ? 'Select users' : 
     *        selectedItems.length === 1 ? selectedItems[0].name :
     *        `${selectedItems.length} users selected`}
     *     </Text>
     *   </View>
     * )}
     * 
     * // Static element anchor
     * anchor={<Button title="Open Dropdown" onPress={() => {}} />}
     * ```
     */
    anchor?:
    | ((options: Omit<ITextInputProps, "onChange"> & {
        /** The dropdown context providing access to methods and state */
        dropdown: Dropdown<ItemType, ValueType, AllowMultiple>;
        /** Current loading state of the dropdown */
        isLoading: boolean;
        /** Whether multiple selection is enabled */
        allowMultiple: boolean;
        /** Array of currently selected items */
        selectedItems: ItemType[];
        /** Array of currently selected values */
        selectedValues: ValueType[];
    }) => ReactElement)
    | ReactElement;

    /**
     * Field name or key path for extracting labels from object-type items.
     * 
     * When `getItemLabel` is not provided and items are objects, this property
     * specifies which field should be used as the display label. It can be a
     * direct property name or a key path for nested properties. This provides
     * a declarative way to specify label extraction without writing a custom function.
     * 
     * @type {keyof ItemType | string}
     * @optional
     * 
     * @example
     * ```tsx
     * // Direct property access
     * itemLabelField="name"  // item.name
     * itemLabelField="title" // item.title
     * 
     * // For nested properties (using string key path)
     * itemLabelField="profile.displayName"  // item.profile.displayName
     * itemLabelField="user.fullName"        // item.user.fullName
     * 
     * // Example with typed interface
     * interface User {
     *   id: number;
     *   name: string;
     *   email: string;
     * }
     * 
     * <Dropdown<User, number>
     *   items={users}
     *   itemLabelField="name"  // TypeScript will validate this exists
     *   itemValueField="id"
     * />
     * ```
     */
    itemLabelField?: keyof ItemType | string;

    /**
     * Field name or key path for extracting values from object-type items.
     * 
     * When `getItemValue` is not provided and items are objects, this property
     * specifies which field should be used as the item's value for selection
     * tracking. Similar to `itemLabelField`, it supports both direct property
     * access and nested key paths, providing a declarative approach to value extraction.
     * 
     * @type {keyof ItemType | string}
     * @optional
     * 
     * @example
     * ```tsx
     * // Direct property access
     * itemValueField="id"     // item.id
     * itemValueField="code"   // item.code
     * 
     * // For nested properties
     * itemValueField="data.uniqueId"    // item.data.uniqueId
     * itemValueField="meta.identifier"  // item.meta.identifier
     * 
     * // Complex example with country selection
     * interface Country {
     *   code: string;
     *   name: string;
     *   flag: string;
     * }
     * 
     * <Dropdown<Country, string>
     *   items={countries}
     *   itemValueField="code"    // Use country code as value
     *   itemLabelField="name"    // Display country name
     * />
     * ```
     */
    itemValueField?: keyof ItemType | string;

    /**
     * Visual styling variant for the loading progress bar displayed during loading states.
     * 
     * This variant controls the appearance of the progress bar that appears when
     * `isLoading` is true, including colors, size, animation style, and positioning.
     * The progress bar provides visual feedback to users during async operations.
     * 
     * @type {IProgressBarVariant}
     * @optional
     * 
     * @example
     * ```tsx
     * loadingBarVariant={{
     *   color: "primary",
     *   size: "small",
     *   style: "indeterminate",
     *   position: "bottom"
     * }}
     * 
     * // Custom loading bar styling
     * loadingBarVariant={{
     *   backgroundColor: "transparent",
     *   progressColor: "blue-500",
     *   height: 2,
     *   borderRadius: 1
     * }}
     * ```
     */
    loadingBarVariant?: IProgressBarVariant;

    /**
     * Controls the visibility of the chevron-down icon in the dropdown anchor.
     * 
     * The chevron icon serves as a visual indicator that the element is a dropdown
     * and can be clicked to reveal additional options. This follows standard UI
     * conventions and improves user experience and accessibility. When set to false,
     * the icon is hidden, which can be useful for custom anchors or minimalist designs.
     * 
     * **Note:** This only affects the default TextInput anchor. Custom anchor components
     * are responsible for their own icon management.
     * 
     * @type {boolean}
     * @optional
     * @default true
     * 
     * @example
     * ```tsx
     * // Show chevron (default behavior)
     * <Dropdown items={items} />
     * <Dropdown items={items} showAnchorChevron={true} />
     * 
     * // Hide chevron for cleaner appearance
     * <Dropdown items={items} showAnchorChevron={false} />
     * 
     * // Hide chevron when using custom anchor
     * <Dropdown 
     *   items={items}
     *   showAnchorChevron={false}
     *   anchor={<CustomButton />}
     * />
     * 
     * // Conditional chevron based on state
     * <Dropdown 
     *   items={items}
     *   showAnchorChevron={!isCustomMode}
     * />
     * ```
     */
    showAnchorChevron?: boolean;
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
export interface IDropdownPreparedItem<ItemType = unknown, ValueType = unknown> {
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

function Test() {
    return <Dropdown<{ a: number, b: number }, number>
        itemLabelField="a"
        allowMultiple={true}
        items={[{
            a: 1,
            b: 2
        }]}
        onChange={({ value }) => {
            console.log(value, " i value ")
        }}
    />
}