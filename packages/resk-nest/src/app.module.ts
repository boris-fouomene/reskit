import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@examples/typeorm/users/users.module';
import { CatsModule } from '@examples/mongoose/cats/cats.module';
import { ProtectedModule } from '@examples/protected/protected.module'
import { DatabaseModule } from '@examples/typeorm/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { I18nInterceptor } from '@i18n/i18n.interceptor';
import { I18nModule } from '@i18n/i18n.module';
@Module({
  imports: [
    I18nModule.forRoot({
      locales: ["en", "fr"],
      namespaces: {
        'common': async (locale) => await import(`./locales/common.${locale}.json`),
      }
    }),
    DatabaseModule,
    ProtectedModule,
    UsersModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    }
  ],
})
export class AppModule { }
