import { Global, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ResourceService } from './resource.service';
import { ResourceDataServiceBase } from '../data-source';
@Global()
@Module({
  providers: [
    {
      provide: ResourceDataServiceBase,
      useFactory: () => {
        return new ResourceDataServiceBase(null as any);
      },
    },
    Reflector,
    ResourceService,
  ],
  exports: [ResourceDataServiceBase, ResourceService],
})
export class ResourceModule { }
