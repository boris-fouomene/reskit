import { Get, Inject, Injectable } from '@nestjs/common';
import { TypeOrmResourceService } from '@resk/nest';
import { User } from './entities/user.entity';
import { I18nClass, ResourceMetadata } from '@resk/core';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../database.module';
@Injectable()
@ResourceMetadata({
  name: 'users',
  label: 'Users',
  controllerName: 'UsersController',
})
export class UsersService extends TypeOrmResourceService<User, string> {
  constructor(@Inject(DatabaseModule.name) protected dataSource: DataSource, @Inject("I18N") readonly i18n: I18nClass) {
    super(dataSource, User);
  }
  @Get('me')
  getMe() {
    return this.i18n.t('greeting', { name: 'John' });
  }
}