import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../../examples/users/users.service';
import { AuthStrategy } from '../auth.strategy.service';

@AuthStrategy('local')
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({ usernameField: 'email' }); // Define email as the username field
    }
    async validate(email: string, password: string): Promise<any> {
        console.log(email, " is email ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
        const user = await this.userService.findOne(email);
        console.log(user, " is found service dddddddddddddddddd");
        if (!user) {
            throw new UnauthorizedException(" yes unnnnnnnnnnnnnnnnnnnnnnnnnnnn");
        }
        return user;
    }
}
