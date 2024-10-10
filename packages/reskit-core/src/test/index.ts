import { Resource, Field } from "..";
import {ResourcesManager,ResourceBase } from '../decorators';


declare module "../types" {
    type IAllResourcesNames = "users";
}

@Resource({name:"users"})
class User extends ResourceBase{
    label?: string | undefined = "My user";
}

const userResource = ResourcesManager.getResource("users");

console.log(userResource?.getFields()," are field and label is ",userResource?.getLabel());