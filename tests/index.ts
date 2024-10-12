import { Resource, ResourcesManager } from '@resources/index';
import { Field } from '../src/fields/index';

@Resource({name:"users",label:"Users"})
export class Test {
    @Field<"select">({name:"boris",label:"First Name",items:[],type:"select"}) // Provide an empty object if you don't have any specific options
    myProperty?: string;
}

console.log(ResourcesManager.getResources()," are resources")