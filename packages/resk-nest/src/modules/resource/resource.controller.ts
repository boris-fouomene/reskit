import { Controller, Delete, Get, Param, Post, Put, UseFilters, UsePipes, ExecutionContext, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { IClassConstructor, IResourceData } from '@resk/core';
import { UseValidatorPipe, ValidatorParam } from './pipes';


/**
 * The `ResourceController` class is a NestJS controller that provides CRUD operations for a resource.
 * It extends the `BaseController` class and uses the `ResourceService` to perform the actual operations.
 * The controller is responsible for handling HTTP requests and mapping them to the appropriate service methods.
 *
 * @template DataType - The type of the resource data transfer object (DTO).
 * @template ServiceType - The type of the `ResourceService` implementation.
 */
@Controller()
//@UseFilters(MainExceptionFilter)
export abstract class ResourceController<DataType extends IResourceData = any, ServiceType extends ResourceService<DataType> = ResourceService<DataType>> {
  /**
   * Initializes the `ResourceController` instance with the provided `ResourceService`.
   * If the `resourceName` property is not set on the `ResourceService` constructor, it is set to the `resourceName` property of the `ResourceController` instance.
   * This ensures that the `ResourceService` has a valid `resourceName` property, which is used by the controller to manage the resource.
   * 
   * @param resourceService - The `ResourceService` instance to be used by the `ResourceController`.
   */
  constructor(protected readonly resourceService: ServiceType) { }
  @Get()
  async getAll(): Promise<any> {
    return this.getResourceService().find();
  }
  @Get(':id')
  async getOne(@Param() params: any) {
    return await this.getResourceService().findOne(params.id);
  }
  @UseValidatorPipe<ResourceController>('getCreateDtoClass')
  @Post()
  async create(@ValidatorParam("body") createResourceDto: Partial<DataType>) {
    return this.getResourceService().create(createResourceDto);
  }
  @Delete(':id')
  delete(@Param() params: any) {
    return this.getResourceService().delete(params.id);
  }
  @UseValidatorPipe<ResourceController>('getUpdateDtoClass')
  @Put(':id')
  update(@Param() params: any, @ValidatorParam("body") updateResourceDto: Partial<DataType>) {
    return this.getResourceService().update(params.id, updateResourceDto);
  }
  /***
   * Retrieve the dto class for create request
   * @returns {T} The dto class for create request
   */
  abstract getCreateDtoClass(): IClassConstructor<Partial<DataType>>;

  /***
   * Retrieve the dto class for update request
   * @returns {T} The dto class for update request
   */
  abstract getUpdateDtoClass(): IClassConstructor<Partial<DataType>>;


  /**
   * Gets the `ResourceService` instance associated with the `ResourceController` instance.
   * @returns {ServiceType} The `ResourceService` instance associated with the `ResourceController` instance.
   */
  getResourceService(): ServiceType {
    return this.resourceService;
  }
}
