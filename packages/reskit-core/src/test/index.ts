import { Resource, Field } from "..";
import {ResourcesManager,ResourceBase } from '../decorators';

declare module ".." {
    interface IAllResourceNamesMap{
        "boris" : any;
    }
}
class MyResource extends ResourceBase{
    getLabel(){
        return "yes this is my name";
    }
}

@Resource({name:"boris"})
class User extends MyResource{
    
}

const userResource = ResourcesManager.getResource("boris");