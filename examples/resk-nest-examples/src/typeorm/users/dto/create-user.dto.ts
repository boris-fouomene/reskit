import { ValidatorIsRequired, ValidatorIsEmail } from "@resk/core";

export class CreateUserDto {
    @ValidatorIsRequired
    id?: number;
    @ValidatorIsRequired
    @ValidatorIsEmail
    name?: string;
}
