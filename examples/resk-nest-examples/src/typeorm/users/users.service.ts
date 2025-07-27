import { Get, Inject, Injectable } from '@nestjs/common';
import { TypeOrmResourceService } from '@resk/nest';
import { User } from './entities/user.entity';
import { I18n } from '@resk/core/i18n';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../database.module';
@Injectable()
export class UsersService extends TypeOrmResourceService<User, string> {
  constructor(@Inject(DatabaseModule.name) protected dataSource: DataSource, @Inject("I18N") readonly i18n: I18n) {
    super(dataSource, User);
  }
  @Get('me')
  getMe() {
    return this.i18n.t('greeting', { name: 'John' });
  }
}