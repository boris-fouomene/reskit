import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../../typeorm/users/users.service";

@Injectable()
export class AuthService {
    constructor(readonly userService: UsersService) { }
    async validate(payload: any) {
        const user = await this.userService.findOne(payload.email);
        if (!user) {
            throw new UnauthorizedException("User not found with email " + payload.email);
        }
        return user;
    }
}