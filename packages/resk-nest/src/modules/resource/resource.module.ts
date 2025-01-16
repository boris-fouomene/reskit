import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceBaseRepository } from '../data-source';
@Global()
@Module({
  providers: [
    ResourceBaseRepository,
    ResourceService,
  ],
  exports: [ResourceBaseRepository, ResourceService],
})
export class ResourceModule { }
