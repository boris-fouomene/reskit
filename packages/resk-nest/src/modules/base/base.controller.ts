import { Controller } from '@nestjs/common';
import { BaseService } from './base.service';

/**
 * A base controller class for NestJS applications.
 *
 * This class serves as a generic base for creating controllers in a NestJS application.
 * It can be extended to create specific controllers with additional functionality.
 *
 * @template ServiceType - The type of service that the controller will use. Defaults to `BaseService`.
 *
 * @example
 * // Example of extending the BaseController to create a specific controller
 * import { Controller } from '@nestjs/common';
 * import { UserService } from './user.service';
 *
 * @Controller('users')
 * export class UserController extends BaseController<UserService> {
 *     constructor(private readonly userService: UserService) {
 *         super();
 *     }
 *
 *     // Additional methods for UserController can be added here
 * }
 */
@Controller()
export class BaseController<ServiceType extends BaseService = BaseService> { }