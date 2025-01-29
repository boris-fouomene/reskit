import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../../typeorm/users/users.module';
import { UsersService } from '../../typeorm/users/users.service';

@Module({
    imports: [UsersModule],
    providers: [UsersService, AuthService],
    exports: [AuthService, UsersModule]
})
export class AuthModule { }
