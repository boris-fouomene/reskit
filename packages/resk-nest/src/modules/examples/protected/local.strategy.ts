import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthStrategy } from 'src/modules/auth';
import { AuthService } from './auth/auth.service';

@AuthStrategy('local')
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' }); // Define email as the username field
    }
    async validate(email: string, password: string): Promise<any> {
        return await this.authService.validate({ email, password });
    }
}   