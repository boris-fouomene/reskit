import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/examples/typeorm/users/users.module';
import { CatsModule } from './modules/examples/mongoose/cats/cats.module';
import { ProtectedModule } from './modules/examples/protected/protected.module'
import { DatabaseModule } from './modules/examples/typeorm/database.module';
@Module({
  imports: [
    DatabaseModule,
    ProtectedModule,
    UsersModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
