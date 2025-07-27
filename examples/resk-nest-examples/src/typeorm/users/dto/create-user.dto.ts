import { IsRequired, IsEmail } from "@resk/core/validator";

export class CreateUserDto {
    @IsRequired
    id?: number;
    @IsRequired
    @IsEmail
    name?: string;
}
