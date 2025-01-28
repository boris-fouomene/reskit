import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/examples/typeorm/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatsModule } from './modules/examples/mongoose/cats/cats.module';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
