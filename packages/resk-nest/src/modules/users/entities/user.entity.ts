import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ValidatorIsRequired } from '@resk/core';
@Entity({
    name: "customers",
})
export class User {
    @PrimaryGeneratedColumn({
        name: "cust_code",
    })
    @ValidatorIsRequired
    code?: string;
}
