import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ResourceModule } from '../resource';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ResourceModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
})
export class UsersModule { }
