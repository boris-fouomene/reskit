import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isNonNullString, IResourceName } from '@resk/core';
import { ResourcesManager } from '@resk/core';
import { IResourceData } from '@resk/core';

/**
 * The `ResourceController` class is a NestJS controller that provides CRUD operations for a resource.
 * It extends the `BaseController` class and uses the `ResourceService` to perform the actual operations.
 * The controller is responsible for handling HTTP requests and mapping them to the appropriate service methods.
 *
 * @template DataType - The type of the resource data transfer object (DTO).
 * @template ServiceType - The type of the `ResourceService` implementation.
 */
@Controller()
export class ResourceController<DataType extends IResourceData = any, ServiceType extends ResourceService<DataType> = ResourceService<DataType>> {
  /**
   * Initializes the `ResourceController` instance with the provided `ResourceService`.
   * If the `resourceName` property is not set on the `ResourceService` constructor, it is set to the `resourceName` property of the `ResourceController` instance.
   * This ensures that the `ResourceService` has a valid `resourceName` property, which is used by the controller to manage the resource.
   * 
   * @param resourceService - The `ResourceService` instance to be used by the `ResourceController`.
   */
  constructor(protected readonly resourceService: ServiceType) {
    try {
      if (isNonNullString((resourceService.constructor as any).resourceName)) return;
      ///Set the resource name on the resource service constructor dynamically
      (resourceService.constructor as any).resourceName = this.getResourceName();
    } catch (e) { }
  }
  /**
   * Gets the resource name associated with the `ResourceController` instance.
   * The resource name is typically set on the `ResourceService` constructor, but if it is not set,
   * this method will return the `resourceName` property of the `ResourceController` class.
   * Note, The resource name is set dynamically on the `ResourceService` constructor, from the @Resource decorator. So the resource name could not be available if the resource is not decorated using the @Resource decorator.
   * @returns {IResourceName} The resource name associated with the `ResourceController` instance.
   */
  getResourceName(): IResourceName {
    return (this.constructor as any)["resourceName"] as IResourceName;
  }
  /***
    * Gets the resource associated with the `ResourceController` instance.
    * The resource is typically set on the `ResourceService` constructor, but if it is not set,
  */
  getResource() {
    return ResourcesManager.getResource(this.getResourceName())
  }
  /**
   * Gets the `ResourceService` instance associated with the `ResourceController` instance.
   * @returns {ServiceType} The `ResourceService` instance associated with the `ResourceController` instance.
   */
  getResourceService(): ServiceType {
    return this.resourceService;
  }
  @ApiOperation({ summary: 'Get all resources' })
  @Get()
  async getAll(): Promise<any> {
    return this.getResourceService().find();
  }
  @Get(':id')
  getOne(@Param() params: any) {
    return this.getResourceService().findOne(params.id);
  }
  @Post()
  async create(@Body() createResourceDto: Partial<DataType>) {
    return this.getResourceService().create(createResourceDto);
  }
  @Delete(':id')
  delete(@Param() params: any) {
    return this.getResourceService().delete(params.id);
  }
  @Put(':id')
  update(@Param() params: any, @Body() updateResourceDto: Partial<DataType>) {
    return this.getResourceService().update(params.id, updateResourceDto);
  }
}
