import { Module } from '@nestjs/common';
import { UsersModule } from './typeorm/users/users.module';
import { CatsModule } from './mongoose/cats/cats.module';
import { DatabaseModule } from './typeorm/database.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { I18nModule, I18nInterceptor, PermissionsGuard } from '@resk/nest';
import "./locales/common.fr.json";
import "./locales/common.en.json";
@Module({
  imports: [
    I18nModule.forRoot({
      locales: ["en", "fr"],
      namespaces: {
        'common': async (locale) => {
          return await import(locale === "en" ? `./locales/common.en.json` : `./locales/common.fr.json`);
        },
      }
    }),
    DatabaseModule,
    UsersModule,
    //CatsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    },
    {
      provide: APP_GUARD, useClass: PermissionsGuard,
    }
  ],
})
export class AppModule { }
