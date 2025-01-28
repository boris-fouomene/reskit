import { Module } from '@nestjs/common';
import { UsersModule } from '../examples/typeorm/users/users.module';
import { LocalStrategy } from './examples/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../examples/typeorm/users/users.service';

@Module({
    providers: [
        UsersService,
        LocalStrategy,
    ],
    imports: [
        PassportModule,
        UsersModule, PassportModule
    ],
    exports: [PassportModule, LocalStrategy]
})
export class AuthModule { }
