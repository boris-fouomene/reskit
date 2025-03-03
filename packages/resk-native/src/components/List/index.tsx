import { IClassConstructor } from '@resk/core';
import React, { useMemo, useRef } from 'react';
import { FlatListProps,FlatList } from 'react-native';

class ListManager{
    static metaData = Symbol("ListManager");
    static getComponent(){
        const component = Reflect.getMetadata(ListManager.metaData, ListManager);
        if(component){
            return component;
        }
        return FlatList;
    }
}

  
export interface IListProps<ItemType= any> extends FlatListProps<ItemType>{}
export const List = React.forwardRef(function GenericList<ItemType = any>(props: IListProps<ItemType>,ref: React.Ref<FlatList<ItemType>>) {
    const Component = useMemo(()=>{
        return ListManager.getComponent();
    },[]);
    return <Component {...props} ref={ref} />
}) as <ItemType>(
    props: IListProps<ItemType> & { ref?: React.Ref<FlatList<ItemType>> }
  ) => JSX.Element;
(List as any).displayName = "List";


export function AttachListComponent() {
    return function (target: IClassConstructor<FlatListProps<any>>) {
      Reflect.defineMetadata(ListManager.metaData, target, ListManager);
    };
}