import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@examples/typeorm/users/users.module';
import { CatsModule } from '@examples/mongoose/cats/cats.module';
import { ProtectedModule } from '@examples/protected/protected.module'
import { DatabaseModule } from '@examples/typeorm/database.module';
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
