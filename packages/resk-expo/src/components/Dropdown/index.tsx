import Component from "@utils/Component";
import { IDropdownCallbackOptions, IDropdownContext, IDropdownPreparedItem, IDropdownPreparedItems, IDropdownProps, IDropdownState } from "./types";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import stableHash from "stable-hash";
import { defaultStr, IDict, isEmpty, isNonNullString, isObj } from "@resk/core";
import { getTextContent, isReactNode } from "@utils/index";
import { DropdownContext, useDropdown } from "./hooks";
import areEquals from "@utils/areEquals";
import { useTheme } from "@theme/index";
import { Animated, Pressable, View as RNView } from "react-native";
import TextInput from "@components/TextInput";
import { Portal } from "@components/Portal";
import { FlashList } from "@shopify/flash-list";
import { Menu } from "@components/Menu";
import { Tooltip } from "@components/Tooltip";
import { TouchableRipple } from "@components/TouchableRipple";
import { StyleSheet } from "react-native";
import View from "@components/View";
import { FontIcon } from "@components/Icon";
import Label from "@components/Label";
import { IStyle } from "@src/types";

export class Dropdown<ItemType = any, ValueType = any> extends Component<IDropdownProps<ItemType, ValueType>, IDropdownState<ItemType, ValueType>> implements IDropdownContext<ItemType, ValueType> {
    constructor(props: IDropdownProps<ItemType, ValueType>) {
        super(props);
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
        });
    }
    open() {
        const { isLoading, readOnly, disabled, multiple } = this.props;
        if (isLoading || readOnly || disabled || this.state.visible) return;
        this.setState({ visible: true }, () => { });
    }
    close() {
        if (this.state.visible) {
            this.setState({ visible: false });
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
}

function DropdownRenderer<ItemType = any, ValueType = any>({ context }: { context: IDropdownContext<ItemType, ValueType> }) {
    const theme = useTheme();
    let { anchorContainerProps, defaultValue, testID, multiple, listProps, fullScreenAppBarProps, value, ...props } = Object.assign({}, context.props);
    const anchorRef = useRef<RNView>(null);
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
            selectedText += `, ${nextItemCounter.formatNumber()}...`;
        }
        return { selectedText, title };
    }, [selectedItemsByHashKey]);
    const canHandle = !!context.isOpen();

    const isLoading = !!props.isLoading;
    const disabledStyle = isLoading && styles.disabled || null;
    const loadingContent = null;///isLoading ? <ProgressBar color={theme.colors.secondary} indeterminate testID={testID + "_DropdownProgressBar"} /> : null;
    return <DropdownContext.Provider value={context}>
        <Menu
            visible={visible}
            sameWidth
            withScrollView={false}
            onClose={context.close.bind(context)}
            anchor={<Pressable ref={anchorRef} testID={`${testID}-dropdown-anchor-container`} {...Object.assign({}, anchorContainerProps)} disabled={props.disabled || isLoading} style={StyleSheet.flatten([anchorContainerProps?.style, disabledStyle]) as IStyle} onPress={isLoading ? undefined : context.toggle.bind(context)}>
                <TextInput {...props} onChange={undefined} testID={testID} defaultValue={anchorSelectedText} readOnly={true} />
                {loadingContent}
            </Pressable>}
            responsive
            children={<DropdownContext.Provider value={context}>
                <FlashList<IDropdownPreparedItem>
                    testID={testID + "-dropdown-list"}
                    estimatedItemSize={100}
                    {...listProps}
                    data={filteredItems}
                    keyExtractor={({ hashKey }) => hashKey}
                    renderItem={({ item, index }) => {
                        return <DropdownLabel {...item} index={index} />;
                    }}
                />
            </DropdownContext.Provider>}
        />
    </DropdownContext.Provider>;
}

const DropdownLabel = (preparedItem: IDropdownPreparedItem & { index: number }) => {
    const { item, label, value, hashKey, labelText } = preparedItem;
    const context = useDropdown();
    const theme = useTheme();
    const selectedItemsByHashKey = context.getSelectedItemsByHashKey();
    const itemsByHashKey = context.itemsByHashKey;
    const labelRef = useRef(null);
    const { multiple } = context.props;
    const testID = context.getTestID();
    const isSelected = useMemo(() => {
        return context.isSelectedByHashKey(hashKey);
    }, [selectedItemsByHashKey, hashKey]);
    if (!label) {
        return null;
    }
    useEffect(() => {
        if (!labelText) {
            const text = getTextContent(labelRef?.current);
            if (text) {
                itemsByHashKey[hashKey].labelText = text;
                return;
            }
        }
    }, [label, labelText, itemsByHashKey]);

    return (
        <Tooltip
            title={label}
            as={TouchableRipple}
            onPress={() => {
                context.toggleItem(preparedItem);
            }}
            style={[styles.itemContainer, { borderBottomColor: theme.colors.outline }]}
            testID={testID + "-label-tooltip-" + hashKey}
        >
            <View style={styles.container} testID={testID + "-label-container-" + hashKey}>
                {isSelected ? <FontIcon name={multiple ? "check" : "check-circle"} size={20} color={theme.colors.primary} /> : null}
                {<Label ref={labelRef} fontSize={15} color={isSelected ? theme.colors.primary : undefined}>{label}</Label>}
            </View>
        </Tooltip>
    );
}

DropdownLabel.displayName = "DropdownLabel";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        flexWrap: "nowrap",
        paddingHorizontal: 10,
    },
    disabled: {
        pointerEvents: "none",
        opacity: 0.9,
    },
    filterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    loading: {},
    itemContainer: {
        paddingVertical: 7,
        borderBottomWidth: 1,
        height: "100%",
        justifyContent: "center",
    },
    searchInput: {
        backgroundColor: "transparent",
        paddingVertical: 0,
        maxHeight: 47,
        width: "100%",
    },
    searchInputContent: {
        paddingVertical: 0,
        marginVertical: 0,
        maxHeight: 47,
        width: "100%",
    },
    listContainer: {
        paddingHorizontal: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        width: "100%",
    },
    dropdownContainer: {
        position: "absolute",
        paddingBottom: 10,
    },
    flashListContainer: {
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
    },
    backdropHidden: {
        opacity: 0,
        height: 0,
        width: 0,
    },
    hidden: {
        display: "none",
        opacity: 0,
    }
});

export * from "./types";
export { useDropdown } from "./hooks";