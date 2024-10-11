import { Resource,Field } from "../src";
import {ResourcesManager,ResourceBase } from '../src';


@Resource({name:"users"})
class User extends ResourceBase{
    //@Field<"select">({type:"select",items:[]} as IField<"select">)
    test?:string;
    
}

const userResource = ResourcesManager.getResource("users");

console.log(userResource?.getFields()," are field and label is ",userResource?.getLabel());



declare module "../src/types" {
    type IResourcesNamesExtends = "users";
    interface IFieldBaseExtends<DataType="text"> {
        
    }
    interface IFieldMapExtends {
        select : IFieldBase<"select"> & { items : []};
    }
}
