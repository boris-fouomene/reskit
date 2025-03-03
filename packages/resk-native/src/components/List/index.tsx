import { IClassConstructor } from '@resk/core';
import React, { useMemo, useRef } from 'react';
import { FlatListProps,FlatList } from 'react-native';

class ListManager{
    static metaData = Symbol("ListManager");
    static getList(){
        const component = Reflect.getMetadata(ListManager.metaData, ListManager);
        if(component){
            return component;
        }
        return FlatList;
    }
}

// Define the component with proper forwardRef typing
function GenericList<ItemType = any>(
    props: IListProps<ItemType>,
    ref: React.ForwardedRef<FlatList<ItemType>>
  ) {
    const Component = useMemo(()=>{
        return ListManager.getList();
    },[]);
    return <Component {...props} ref={ref} />
}
  
export interface IListProps<ItemType= any> extends FlatListProps<ItemType>, React.RefAttributes<FlatList<ItemType>>{
}
export const List = React.forwardRef<FlatList<any>, IListProps>(GenericList) as <ItemType>(props: IListProps<ItemType> & { ref?: React.ForwardedRef<FlatList<ItemType>>}) => ReturnType<typeof GenericList>; 
(List as any).displayName = "List";

export function AttachListComponent() {
    return function (target: IClassConstructor<FlatListProps<any>>) {
      Reflect.defineMetadata(ListManager.metaData, target, ListManager);
    };
}