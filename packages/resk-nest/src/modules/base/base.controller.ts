import { Controller } from '@nestjs/common';
import { BaseService } from './base.service';

@Controller()
export class BaseController<ServiceType extends BaseService = BaseService> { }