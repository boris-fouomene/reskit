import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ValidatorIsRequired } from '@resk/core';
@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn({
        name: "id",
    })
    @ValidatorIsRequired
    id?: number;
}
