import * as React from "react";
import { useMemo } from 'react';
import { FlatListProps, FlatList } from 'react-native';

/**
 * A class that manages the metadata of a list component.
 * 
 * This class provides a way to get the component associated with the list manager.
 * 
 * @example
 * ```typescript
 * const component = ListManager.getComponent();
 * ```
 */
class ListManager {
    /**
    * A symbol that represents the metadata of the list manager.
    * 
    * @static
    */
    static metaData = Symbol("ListManager");
    /**
     * Gets the component associated with the list manager.
     * 
     * @static
     * @returns The component associated with the list manager.
     */
    static getComponent() {
        const component = Reflect.getMetadata(ListManager.metaData, ListManager);
        if (component) {
            return component;
        }
        return FlatList;
    }
}

/**
 * An interface for the props of the `List` component.
 * 
 * @extends FlatListProps
 * @template ItemType The type of the items in the list.
 * @see {@link FlatListProps} for more information on the `FlatListProps` type.
 */
export interface IListProps<ItemType = any> extends Partial<FlatListProps<ItemType>> { }

/**
 * A React component that represents a list.
 * 
 * This component is a wrapper around the `FlatList` component from React Native.
 * It provides a way to customize the component associated with the list.
 * 
 * @template ItemType The type of the items in the list.
 * @param props The props of the list component.
 * @param ref A reference to the list component.
 * @returns The rendered list component.
 */
export const List = React.forwardRef(function GenericList<ItemType = any>(props: IListProps<ItemType>, ref: React.Ref<FlatList<ItemType>>) {
    const Component = useMemo(() => {
        return ListManager.getComponent();
    }, []);
    return <Component nestedScrollEnabled {...props} ref={ref} />
}) as <ItemType>(
    props: IListProps<ItemType> & { ref?: React.Ref<FlatList<ItemType>> }
) => JSX.Element;
(List as any).displayName = "List";


/**
 * A decorator that attaches a list component to the list manager.
 * 
 * This decorator is used to associate a list component with the list manager.
 * 
 * @param target The class constructor of the list component.
 * @returns The decorated class constructor.
 * @example
 * ```typescript
 * class MyList<MyItem> extends FlashList<MyItem> {
 *   render() {
 *     return super(this.props);
 *   }
 * }
 * AttachList()(MyList);
 * ```
 */
export function AttachList() {
    return function (target: React.ComponentClass<FlatListProps<any>>) {
        Reflect.defineMetadata(ListManager.metaData, target, ListManager);
    };
}