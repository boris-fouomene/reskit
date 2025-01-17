import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ResourceModule } from '../resource';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataServiceManager } from '../data-source';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ResourceModule,
  ],
  controllers: [UsersController],
  providers: [
    ...DataServiceManager.get().createProviders(User),
    UsersService,
  ],
})
export class UsersModule { }
