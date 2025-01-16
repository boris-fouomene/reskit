import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
@Global()
@Module({
  providers: [
    ResourceService,
  ],
  exports: [ResourceService],
})
export class ResourceModule { }
