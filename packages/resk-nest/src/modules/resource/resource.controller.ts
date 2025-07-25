import { Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { IResourceData, IResourceQueryOptions, ResourcePaginationHelper } from '@resk/core/resources';
import { ParseRequest, UseValidatorParam, ValidatorParam } from './pipes';
import { IClassConstructor, } from "@resk/core/types";

class EmptyDtoClass { }

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
export class ResourceController<DataType extends IResourceData = any, ServiceType extends ResourceService<DataType> = ResourceService<DataType>> {
  /**
   * Initializes the `ResourceController` instance with the provided `ResourceService`.
   * If the `resourceName` property is not set on the `ResourceService` constructor, it is set to the `resourceName` property of the `ResourceController` instance.
   * This ensures that the `ResourceService` has a valid `resourceName` property, which is used by the controller to manage the resource.
   * 
   * @param resourceService - The `ResourceService` instance to be used by the `ResourceController`.
   */
  constructor(protected readonly resourceService: ServiceType) { }

  /***
   * Retrieves a list of resources based on the provided parameters.
   * This method retrieves a list of resources from the resource service and returns the result.
   * If the 'paginate' parameter is present, it retrieves a paginated result.
   * If the 'count' parameter is present, it retrieves the count of resources.
   * @param params - The parameters to be used for retrieving the resources.
   * @returns A promise that resolves to the list of resources.
   * @example
   * // Example usage of getMany method
   * const resources = await getMany({ paginate: true });
   * console.log(resources);
   * // Output:
   * // {
   * //   data: [
   * //     { id: 1, name: 'John Doe' },
   * //     { id: 2, name: 'Jane Smith' }
   * //   ],
   * //   meta: {
   * //     currentPage: 1,
   * //     pageSize: 10,
   * //     total: 2,
   * //     totalPages: 1,
   * //     hasNextPage: false,
   * //     hasPreviousPage: false,
   * //     nextPage: 2,
   * //     previousPage: 1,
   * //     lastPage: 1
   * //   }
   * // } 
   */
  @Get()
  async getMany(@ParseRequest("queryOptions") queryOptions: IResourceQueryOptions<DataType>): Promise<any> {
    const paginate = ResourcePaginationHelper.canPaginateResult(queryOptions);
    if (paginate) {
      return this.getResourceService().findAndPaginate(queryOptions);
    }
    return this.getResourceService().find(queryOptions);
  }
  @Get(':id')
  async getOne(@Param() params: any) {
    return await this.getResourceService().findOne(params.id);
  }
  @UseValidatorParam<ResourceController>('getCreateDtoClass', true)
  @Post()
  async create(@ValidatorParam("body") createResourceDto: Partial<DataType>) {
    return this.getResourceService().create(createResourceDto);
  }
  @Delete(':id')
  delete(@Param() params: any) {
    return this.getResourceService().delete(params.id);
  }
  @UseValidatorParam<ResourceController>('getUpdateDtoClass', true)
  @Put(':id')
  update(@Param() params: any, @ValidatorParam("body") updateResourceDto: Partial<DataType>) {
    return this.getResourceService().update(params.id, updateResourceDto);
  }
  /***
   * Retrieve the dto class for create request
   * @returns {T} The dto class for create request
   */
  getCreateDtoClass(): IClassConstructor<Partial<DataType>> {
    return EmptyDtoClass;
  }

  /***
   * Retrieve the dto class for update request
   * @returns {T} The dto class for update request
   */
  getUpdateDtoClass(): IClassConstructor<Partial<DataType>> {
    return EmptyDtoClass;
  }

  /**
   * Gets the `ResourceService` instance associated with the `ResourceController` instance.
   * @returns {ServiceType} The `ResourceService` instance associated with the `ResourceController` instance.
   */
  getResourceService(): ServiceType {
    return this.resourceService;
  }
}
