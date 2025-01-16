import { Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
    name: "customers",
})
export class User {
    @PrimaryGeneratedColumn({
        name: "cust_code",
    })
    code?: string;
}
