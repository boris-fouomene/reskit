import "reflect-metadata";  
import { Resource, Field, ResourcesManager} from "@resk/core";


//@Resource({name:"users"})
class User {
    @Field<"select">({type:"select",items:[]})
    name?: string;

    @Field({ type: "number" })
    age?: number;

    @Field<{test?:string;label?:number}>({ type: "text", test:" a test",label:12})
    email?: string;
}
console.log(ResourcesManager.getResource("users")," is reeee")