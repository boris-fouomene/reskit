import { Global, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ResourceService } from './resource.service';
import { ResourceDataServiceBase } from '../data-source';
import { I18nModule } from '../i18n';
@Global()
@Module({
  imports: [I18nModule.forRoot({ namespaces: {} })],
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
  exports: [ResourceDataServiceBase, ResourceService, I18nModule],
})
export class ResourceModule { }
