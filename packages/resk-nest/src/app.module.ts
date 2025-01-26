import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AuthModule } from './src/modules/auth/auth/auth.module';
@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    CustomersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
