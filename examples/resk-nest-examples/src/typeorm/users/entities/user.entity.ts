import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsRequired } from '@resk/core/validator';
@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn({
        name: "id",
    })
    @IsRequired
    id?: number;
}
