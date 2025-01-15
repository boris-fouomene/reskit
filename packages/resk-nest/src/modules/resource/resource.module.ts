import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { BaseModule } from '../base/base.module';
@Global()
@Module({
  providers: [
    ResourceService,
  ],
  exports: [ResourceService],
})
export class ResourceModule extends BaseModule { }
