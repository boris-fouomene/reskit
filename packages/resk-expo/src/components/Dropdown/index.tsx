import Component from "@utils/Component";
import { IDropdownAction, IDropdownCallbackOptions, IDropdownContext, IDropdownEvent, IDropdownPreparedItem, IDropdownPreparedItems, IDropdownProps, IDropdownState } from "./types";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import stableHash from "stable-hash";
import { defaultStr, i18n, IDict, isEmpty, isNonNullString, isObj } from "@resk/core";
import { getTextContent, isReactNode, ObservableComponent, useForceRender } from "@utils/index";
import { DropdownContext, useDropdown } from "./hooks";
import areEquals from "@utils/areEquals";
import Theme, { useTheme } from "@theme/index";
import { Animated, Pressable, View as RNView, TextInput as RNTextInput, TextInputProps } from "react-native";
import TextInput from "@components/TextInput";
import { Portal } from "@components/Portal";
import { ContentStyle, FlashList } from "@shopify/flash-list";
import { Menu, useMenu } from "@components/Menu";
import { Tooltip } from "@components/Tooltip";
import { TouchableRipple } from "@components/TouchableRipple";
import { StyleSheet } from "react-native";
import View from "@components/View";
import { FontIcon } from "@components/Icon";
import { Icon } from "@components/Icon";
import Label from "@components/Label";
import { IStyle } from "@src/types";
import { useI18n } from "@src/i18n/hooks";
import { AppBar } from "@components/AppBar";
import { Divider } from "@components/Divider";

/**
 * Represents a dropdown component that allows users to select one or more items from a list.
 * 
 * This class extends the `Component` class and implements the `IDropdownContext` interface, 
 * providing methods and state management for dropdown interactions. It manages the visibility, 
 * selection, and filtering of items within the dropdown.
 * 
 * @class Dropdown
 * @template ItemType - The type of the items in the dropdown.
 * @template ValueType - The type of the value associated with the items.
 * 
 * @extends Component<IDropdownProps<ItemType, ValueType>, IDropdownState<ItemType, ValueType>>
 * @implements IDropdownContext<ItemType, ValueType>
 * 
 * @param {IDropdownProps<ItemType, ValueType>} props - The properties for the dropdown component.
 */
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
    getHashKey(value: ValueType): string {
        const { getHashKey } = this.props;
        if (typeof getHashKey === "function") {
            return getHashKey(value);
        }
        return ["number", "string", "boolean"].includes(typeof value) ? String(value) : stableHash(value);
    }
    getItemLabel(options: Omit<IDropdownCallbackOptions<ItemType, ValueType>, 'value'> & { value: ValueType }): ReactNode {
        const { getItemLabel } = this.props;
        options = Object.assign({}, options);
        if (typeof getItemLabel === "function") {
            return getItemLabel(options);
        }
        const { item, index } = options;
        if (item && isObj(item)) {
            const { label } = (item as IDict);
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
    getItemValue(options: Omit<IDropdownCallbackOptions<ItemType, ValueType>, 'value'>): ValueType | undefined {
        options = Object.assign({}, options);
        const { getItemValue } = this.props;
        if (typeof getItemValue === "function") {
            return getItemValue(options);
        }
        const { item, index } = options;
        if (item && isObj(item)) {
            const { value } = (item as IDict);
            if (!isEmpty(value)) {
                return value;
            }
        }
        console.warn("getItemValue is not a function", item, index);
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
            if (isEmpty(value) || !value) {
                console.warn("invalid dropdown value ", value, " for item ", item, index, " with dropdown ", props);
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
        return { visible: !!this.state?.visible, itemsByHashKey, preparedItems, ...this.getSelectedValuesAndHashKey(props?.defaultValue, itemsByHashKey) }
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
                    dropdownContext: this
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
            const triggerCallOptions = { ...preparedItem, dropdownContext: this };
            this.trigger("toggleItem", triggerCallOptions);
            if (newItemStatus) {
                this.trigger("selectItem", triggerCallOptions);
            } else {
                this.trigger("unselectItem", triggerCallOptions);
            }
        });
    }
    open() {
        const { isLoading, readOnly, disabled, multiple } = this.props;
        if (isLoading || readOnly || disabled || this.state.visible) return;
        this.setState({ visible: true }, () => {
            this.trigger("open", this);
            this.trigger("toggleVisibility", this);
        });
    }
    close() {
        if (this.state.visible) {
            this.setState({ visible: false }, () => {
                this.trigger("open", this);
                this.trigger("toggleVisibility", this);
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

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<IDropdownProps<ItemType, ValueType>>, nextContext: any): void {
        const { defaultValue, items } = nextProps;
        if (this.props.items !== items && !areEquals(this.props.items, items)) {
            this.setState(this.prepareState(nextProps));
        } else if (defaultValue !== this.props.defaultValue && !areEquals(this.props.defaultValue, defaultValue)) {
            this.setState({ ...this.getSelectedValuesAndHashKey(defaultValue, this.state.itemsByHashKey) });
        }
    }
    getTestID(): string {
        return defaultStr(this.props.testID, "resk-dropdown");
    }
    get Item() {
        return DropdownItem;
    }
    get Search() {
        return DropdownSearch;
    }
}

function DropdownRenderer<ItemType = any, ValueType = any>({ context }: { context: IDropdownContext<ItemType, ValueType> }) {
    const theme = useTheme();
    const i18n = useI18n();
    let { anchorContainerProps, error, defaultValue, disabled, dropdownActions, readOnly, editable, testID, multiple, value, ...props } = Object.assign({}, context.props);
    const anchorRef = useRef<RNView>(null);
    const isLoading = !!props.isLoading;
    const disabledStyle = isLoading && styles.disabled || null;
    anchorContainerProps = Object.assign({}, anchorContainerProps);
    testID = context.getTestID();
    const [searchText, setSearchText] = useState("");
    const onSearch = (text: string) => {
        text = defaultStr(text);
        if (text.toLowerCase() == searchText.toLowerCase()) {
            return;
        }
        setSearchText(text);
    }
    const { visible, preparedItems } = context.state;
    const selectedItemsByHashKey = context.getSelectedItemsByHashKey();
    const filteredItems = useMemo(() => {
        if (!isNonNullString(searchText)) {
            return preparedItems;
        }
        const filterRegex = new RegExp(searchText.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "gi");
        return preparedItems.filter(({ labelText }) => !!labelText.match(filterRegex));
    }, [preparedItems, searchText]);
    context.searchText = searchText;
    context.onSearch = onSearch;
    context.filteredItems = filteredItems;
    disabled = disabled || isLoading;
    const isEditabled = editable !== false && !disabled && !readOnly;
    const { selectedText: anchorSelectedText, title: anchorTitle } = useMemo(() => {
        let selectedText = "";
        let title = "";
        let counter = 0;
        let nextItemCounter = 0;
        for (let key in selectedItemsByHashKey) {
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
            selectedText += `, [${nextItemCounter.formatNumber()}...]`;
        }
        return { selectedText, title };
    }, [selectedItemsByHashKey]);
    context.anchorSelectedText = anchorSelectedText;
    const actions = useMemo<IDropdownAction[]>(() => {
        const actions: IDropdownAction[] = [];
        if (dropdownActions) {
            const actProps: IDropdownAction[] = typeof dropdownActions === "function" ? dropdownActions(context) : dropdownActions;
            if (Array.isArray(actProps)) {
                actProps.map((act) => {
                    if (!act || !isObj(act)) {
                        return;
                    }
                    actions.push({
                        uppercase: false,
                        ...act,
                        context: {
                            ...Object.assign({}, act.context),
                            dropdownContext: context
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
    }, [dropdownActions, multiple, context?.isOpen(), context, anchorSelectedText]);
    context.dropdownActions = actions;
    const loadingContent = null;///isLoading ? <ProgressBar color={theme.colors.secondary} indeterminate testID={testID + "_DropdownProgressBar"} /> : null;
    return <DropdownContext.Provider value={context}>
        <Menu
            testID={testID + "-dropdown-menu"}
            visible={visible}
            sameWidth
            withScrollView={false}
            onClose={context.close.bind(context)}
            anchor={<View disabled={disabled} ref={anchorRef} testID={`${testID}-dropdown-anchor-container`} {...Object.assign({}, anchorContainerProps)} style={StyleSheet.flatten([anchorContainerProps?.style, disabledStyle]) as IStyle}>
                <TextInput
                    isDropdownAnchor
                    {...props}
                    disabled={disabled}
                    onChange={undefined}
                    testID={testID}
                    defaultValue={anchorSelectedText}
                    onPress={isLoading ? undefined : context.toggle.bind(context)}
                />
                {loadingContent}
            </View>}
            responsive
            children={<DropdownContext.Provider value={context}>
                <View testID={testID + "-dropdown-list-container"} style={[styles.dropdownListContainer, !isEditabled && Theme.styles.disabled]}>
                    <DropdownListItems />
                </View>
            </DropdownContext.Provider>}
        />
    </DropdownContext.Provider>;
}

const DropdownListItems = () => {
    const context = useDropdown();
    const menu = useMenu();
    const testID = defaultStr(context?.getTestID());
    const listProps = Object.assign({}, context?.props?.listProps);
    const filteredItems = Array.isArray(context.filteredItems) ? context.filteredItems : [];
    const isFullScreen = menu?.fullScreen;
    const fullScreenAppBarProps = Object.assign({}, context?.props?.fullScreenAppBarProps);
    const i18n = useI18n();
    let { label } = Object.assign({}, context?.props);
    return <>
        {isFullScreen ? (
            <AppBar
                title={getTextContent(label)}
                elevation={5}
                {...fullScreenAppBarProps}
                style={[styles.appBar, fullScreenAppBarProps?.style]}
                backActionProps={{
                    ...Object.assign({}, fullScreenAppBarProps.backActionProps),
                    onPress: (...args) => {
                        if (typeof fullScreenAppBarProps.backActionProps?.onPress === "function") {
                            fullScreenAppBarProps.backActionProps?.onPress(...args);
                        }
                        if (typeof context?.close === "function") {
                            context.close();
                        }
                    },
                }}
                subtitle={defaultStr(context.anchorSelectedText, i18n.t("components.dropdown.noneSelected"))}
            />
        ) : null}
        <DropdownSearch isFullScreen={isFullScreen} />
        <FlashList<IDropdownPreparedItem>
            testID={testID + "-dropdown-list"}
            estimatedItemSize={100}
            {...listProps}
            style={undefined}
            data={filteredItems}
            keyExtractor={({ hashKey }) => hashKey}
            renderItem={({ item, index }) => {
                return <DropdownItem {...item} index={index} />;
            }}
        />
    </>
}

const DropdownItem = (preparedItem: IDropdownPreparedItem & { index: number }) => {
    const { item, label, value, hashKey, labelText } = preparedItem;
    const forceRender = useForceRender();
    const context = useDropdown();
    const theme = useTheme();
    const selectedItemsByHashKey = context.getSelectedItemsByHashKey();
    const itemsByHashKey = context.itemsByHashKey;
    const labelRef = useRef(null);
    const { multiple, selectedIconName } = context.props;
    const testID = context.getTestID();
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
        if (typeof context?.on !== "function") {
            return;
        }
        const bindedOn = context.on("toggleItem", (options) => {
            if (options?.hashKey === hashKey) {
                forceRender();
            }
        });
        const bindOnSelectAll = context.on("selectAll", (options) => {
            forceRender();
        });
        const bindOnUnselectAll = context.on("unselectAll", (options) => {
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
            as={TouchableRipple}
            onPress={() => {
                context.toggleItem(preparedItem);
            }}
            style={[styles.itemContainer, { borderBottomColor: theme.colors.outline }]}
            testID={testID + "-item-container-" + hashKey}
        >
            <View style={styles.itemContent} testID={testID + "-item-content-" + hashKey}>
                {isSelected ? <FontIcon style={[styles.selectedIcon]} name={isNonNullString(selectedIconName) ? selectedIconName : multiple ? "check" : "radiobox-marked"} size={20} color={theme.colors.primary} /> : null}
                {<Label ref={labelRef} fontSize={15} color={isSelected ? theme.colors.primary : undefined}>{label}</Label>}
            </View>
        </Tooltip>
    );
}

DropdownItem.displayName = "DropdownItem";

const styles = StyleSheet.create({
    appBar: {
        marginBottom: 7,
    },
    selectedIcon: {
        marginRight: 5,
    },
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        flexWrap: "nowrap",
        paddingHorizontal: 10,
    },
    searchDivider: {
        width: "100%",
        marginTop: 5,
        overflow: "hidden",
    },
    disabled: {
        pointerEvents: "none",
        opacity: 0.9,
    },
    loading: {},
    itemContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
    },
    searchInput: {
        width: "100%",
    },
    searchInputContainer: {
        width: "100%",
        paddingHorizontal: 7,
    },
    listContainer: {
        paddingHorizontal: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        width: "100%",
    },
    listContentContainer: {
        flex: 1,
    },
    dropdownListContainer: {
        width: "100%",
        height: "100%",
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    dropdownListContentContainer: {
        width: "100%",
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    list: {
        flex: 1,
    },
});

const DropdownSearch = ({ isFullScreen }: { isFullScreen?: boolean }) => {
    const context = useDropdown();
    const filteredItems = Array.isArray(context.filteredItems) ? context.filteredItems : [];
    const searchText = defaultStr(context.searchText);
    const testID = context?.getTestID();
    const onSearch = typeof context.onSearch == "function" ? context.onSearch : undefined;
    const pItem = context?.getPreparedItems();
    const preparedItems = Array.isArray(pItem) ? pItem : [];
    const { showSearch, error, searchProps } = Object.assign({}, context.props);
    const props = Object.assign({}, searchProps, { error: error || searchProps?.error });
    const visible = context?.isOpen();
    const actions: IDropdownAction[] = Array.isArray(context.dropdownActions) ? context.dropdownActions : [];
    const theme = useTheme();
    if (showSearch === false || showSearch !== true && preparedItems?.length <= 5) {
        return null;
    }
    return (
        <>
            <TextInput
                testID={`${testID}_dropdown-search`}
                autoFocus={visible}
                {...props}
                defaultValue={searchText}
                onChangeText={onSearch}
                style={[styles.searchInput, props.style]}
                containerProps={Object.assign({}, props.containerProps, { style: [styles.searchInputContainer, props.containerProps?.style] })}
                placeholder={i18n.t("components.dropdown.searchPlaceholder", { countStr: filteredItems.length.formatNumber() })}
                right={!actions?.length ? null : (
                    <Menu
                        items={actions}
                        testID={`${testID}-dropdown-menu-actions`}
                        anchor={({ openMenu }) => {
                            return (
                                <Icon.Button
                                    iconName={FontIcon.MORE}
                                    size={24}
                                    onPress={() => openMenu()}
                                />
                            );
                        }}
                    />
                )
                }
            />
            <Divider testID={`${testID}-divider`} style={[styles.searchDivider]} />
        </>
    );
};

export * from "./types";
export { useDropdown } from "./hooks";