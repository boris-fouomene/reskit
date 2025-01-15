import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';

@Global()
@Module({
    exports: [BaseService],
    providers: [BaseService],
    controllers: [BaseController],
})
export class BaseModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        /*consumer
          .apply(LoggerMiddleware)
          .forRoutes('cats')*/;
    }
}
