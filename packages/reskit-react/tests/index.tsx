import "reflect-metadata";
import { Resource, Field } from "@resk/core";

@Resource({ name: "users1" })
class User {
    @Field({ type: "string" })
    name?: string;

    @Field({ type: "number" })
    age?: number;

    @Field({ type: "email" })
    email?: string;
}