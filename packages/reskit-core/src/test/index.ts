import { Resource, Field } from "..";
import { getResourceMetaData, getResource } from '../decorators/resources/index';
import { ResourceBase } from '../types/index';

class MyResource extends ResourceBase{
    getLabel(){
        return "yes this is my name";
    }
}

@Resource({name:"boris"})
class User extends MyResource{
    
}

console.log(getResourceMetaData(User));

console.log(getResource<User>("boris")?.getLabel());