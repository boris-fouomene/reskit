import "reflect-metadata";
import { Resource, Field } from "@resk/core";

@Resource({})
class User {
    @Field<"select">({ type: "text",amina:"" })
    name?: string;

    @Field({ type: "number" })
    age?: number;

    @Field({ type: "email" })
    email?: string;
}