import { ValidatorIsRequired } from "@resk/core";
import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity({
    name: "customers"
})
export class Customer {
    @ValidatorIsRequired
    @PrimaryColumn({
        name: "cust_code"
    })
    code?: string;

    @Column({
        name: "cust_label"
    })
    label?: string;
}
