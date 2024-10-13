import "reflect-metadata";
import { Resource, Field, ResourcesManager} from "@resk/core";

@Resource({name:""})
class User {
    @Field<"select">({anima:"",sddd:""})
    name?: string;

    @Field({ type: "number" })
    age?: number;

    @Field({ type: "email" })
    email?: string;
}
console.log(ResourcesManager.getResource("users")," is reeee")