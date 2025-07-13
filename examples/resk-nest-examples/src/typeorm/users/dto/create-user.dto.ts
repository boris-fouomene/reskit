import { ValidatorIsRequired, ValidatorIsEmail } from "@resk/core/validator";

export class CreateUserDto {
    @ValidatorIsRequired
    id?: number;
    @ValidatorIsRequired
    @ValidatorIsEmail
    name?: string;
}
