import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceDataService, ResourceDataServiceBase } from '../data-source';
@Global()
@Module({
  providers: [
    ResourceDataServiceBase,
    ResourceService,
  ],
  exports: [ResourceDataServiceBase, ResourceService],
})
export class ResourceModule { }
