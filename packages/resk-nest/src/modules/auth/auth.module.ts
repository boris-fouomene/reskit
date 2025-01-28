import { Module } from '@nestjs/common';
import { UsersModule } from '../examples/users/users.module';
import { LocalStrategy } from './examples/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../examples/users/users.service';

@Module({
    providers: [UsersService, LocalStrategy],
    imports: [
        UsersModule, PassportModule
    ]
})
export class AuthModule { }
