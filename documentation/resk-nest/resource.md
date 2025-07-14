# 🔧 Resource Module - @resk/nest/resource

> **Complete CRUD operations with pagination, validation, and filtering**

## 📖 Overview

The Resource module provides a powerful abstraction for building REST APIs with minimal boilerplate. It includes generic controllers, services, validation pipes, and interceptors that handle common CRUD operations, pagination, filtering, and error handling automatically.

---

## 🚀 Quick Start

### **Basic Resource Setup**

```typescript
import { Controller, Injectable } from '@nestjs/common';
import { ResourceController, ResourceService } from '@resk/nest/resource';

// Define your data interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a service extending ResourceService
@Injectable()
export class UserService extends ResourceService<User> {
  constructor() {
    super(); // Initialize with your data source
  }
}

// Create a controller extending ResourceController
@Controller('users')
export class UserController extends ResourceController<User> {
  constructor(private userService: UserService) {
    super(userService);
  }
}

// This automatically provides:
// GET /users (with pagination, filtering, sorting)
// GET /users/:id
// POST /users
// PUT /users/:id
// DELETE /users/:id
```

### **Module Registration**

```typescript
import { Module } from '@nestjs/common';
import { ResourceModule } from '@resk/nest/resource';

@Module({
  imports: [ResourceModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
```

---

## 🏗️ Core Components

### **ResourceController**

```typescript
/**
 * Generic controller providing complete CRUD operations
 */
export class ResourceController<DataType extends IResourceData = any> {
  constructor(protected readonly resourceService: ResourceService<DataType>) {}
  
  // Automatic CRUD endpoints
  @Get()
  async getMany(@ParseRequest("queryOptions") queryOptions: IResourceQueryOptions<DataType>): Promise<any>;
  
  @Get(':id')
  async getOne(@Param() params: any): Promise<DataType>;
  
  @Post()
  @UseValidatorParam('getCreateDtoClass', true)
  async create(@ValidatorParam("body") createDto: Partial<DataType>): Promise<DataType>;
  
  @Put(':id')
  @UseValidatorParam('getUpdateDtoClass', true)
  async update(@Param() params: any, @ValidatorParam("body") updateDto: Partial<DataType>): Promise<DataType>;
  
  @Delete(':id')
  async delete(@Param() params: any): Promise<void>;
  
  // Override these methods for custom DTOs
  getCreateDtoClass(): IClassConstructor<Partial<DataType>>;
  getUpdateDtoClass(): IClassConstructor<Partial<DataType>>;
}
```

### **ResourceService**

```typescript
/**
 * Generic service implementing business logic and data access
 */
@Injectable()
export abstract class ResourceService<
  DataType extends IResourceData = any,
  PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey
> extends Resource<DataType, PrimaryKeyType> 
  implements OnModuleInit, OnModuleDestroy {
  
  // Lifecycle hooks
  onModuleInit(): void;
  onModuleDestroy(): void;
  
  // Inherited from Resource class
  find(options?: IResourceQueryOptions<DataType>): Promise<DataType[]>;
  findAndPaginate(options?: IResourceQueryOptions<DataType>): Promise<IPaginatedResult<DataType>>;
  findOne(id: PrimaryKeyType): Promise<DataType | null>;
  create(data: Partial<DataType>): Promise<DataType>;
  update(id: PrimaryKeyType, data: Partial<DataType>): Promise<DataType>;
  delete(id: PrimaryKeyType): Promise<void>;
}
```

---

## 🎯 Advanced Usage

### **Custom DTOs with Validation**

```typescript
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

// Create DTO classes for validation
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  role?: string = 'user';
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

// Use DTOs in controller
@Controller('users')
export class UserController extends ResourceController<User> {
  constructor(userService: UserService) {
    super(userService);
  }
  
  // Override DTO classes for validation
  getCreateDtoClass(): IClassConstructor<CreateUserDto> {
    return CreateUserDto;
  }
  
  getUpdateDtoClass(): IClassConstructor<UpdateUserDto> {
    return UpdateUserDto;
  }
}
```

### **Custom Business Logic**

```typescript
@Controller('users')
export class UserController extends ResourceController<User> {
  constructor(
    userService: UserService,
    private emailService: EmailService
  ) {
    super(userService);
  }
  
  // Override create method with custom logic
  @Post()
  @UseValidatorParam('getCreateDtoClass', true)
  async create(@ValidatorParam("body") createUserDto: CreateUserDto): Promise<User> {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create user
    const user = await this.getResourceService().create(userData);
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);
    
    // Return user without password
    const { password, ...userResponse } = user;
    return userResponse as User;
  }
  
  // Add custom endpoints
  @Get(':id/profile')
  async getUserProfile(@Param('id') id: string): Promise<UserProfile> {
    const user = await this.getResourceService().findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return this.userService.getFullProfile(id);
  }
  
  @Post(':id/activate')
  async activateUser(@Param('id') id: string): Promise<User> {
    return this.userService.activateUser(id);
  }
}
```

---

## 🔍 Query Options & Filtering

### **Built-in Query Support**

```typescript
// GET /users?page=1&limit=10&sort=name&filter[role]=admin
// Automatically parsed to:
interface IResourceQueryOptions<DataType> {
  page?: number;           // Pagination page number
  limit?: number;          // Items per page
  sort?: string | string[]; // Sort fields
  filter?: Partial<DataType>; // Filter criteria
  search?: string;         // Global search
  fields?: string[];       // Field selection
  populate?: string[];     // Relations to include
}

// Example queries:
// GET /users?page=2&limit=25&sort=-createdAt&filter[role]=admin&search=john
// GET /users?fields=name,email&populate=profile,permissions
// GET /users?filter[createdAt][$gte]=2024-01-01&filter[status]=active
```

### **Advanced Filtering with MongoDB-style Operators**

```typescript
// Using @resk/core/filters integration
import { FilterBuilder } from '@resk/core/filters';

@Injectable()
export class UserService extends ResourceService<User> {
  
  async findActiveUsers(ageRange?: { min: number; max: number }): Promise<User[]> {
    const filterBuilder = new FilterBuilder()
      .equals('status', 'active')
      .exists('email', true);
    
    if (ageRange) {
      filterBuilder.between('age', ageRange.min, ageRange.max);
    }
    
    return this.find({
      filter: filterBuilder.build(),
      sort: 'name'
    });
  }
  
  async searchUsers(query: string): Promise<User[]> {
    const filter = new FilterBuilder()
      .or(
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      )
      .build();
    
    return this.find({ filter });
  }
}
```

---

## 🔧 Validation & Pipes

### **ValidatorParam Decorator**

```typescript
/**
 * Extracts and validates data from request
 */
@ValidatorParam(config: IParseRequestConfig)

// Usage examples:
@Post()
async create(
  @ValidatorParam("body") dto: CreateUserDto,          // Entire request body
  @ValidatorParam("body.profile") profile: UserProfile, // Nested property
  @ValidatorParam("query.type") type: string,          // Query parameter
  @ValidatorParam("params.id") id: string              // Route parameter
) {
  // Validated data is automatically parsed and available
}

// Custom parsing function
@Post()
async customCreate(
  @ValidatorParam((options, context) => {
    const request = context.switchToHttp().getRequest();
    return {
      userData: request.body.user,
      metadata: {
        ip: request.ip,
        userAgent: request.headers['user-agent']
      }
    };
  }) data: { userData: CreateUserDto; metadata: any }
) {
  // Custom parsed data
}
```

### **UseValidatorParam Decorator**

```typescript
/**
 * Configures validation for method parameters
 */
@UseValidatorParam<ControllerClass>('getDtoMethod', validateRequired?: boolean)

// Example:
@Controller('users')
export class UserController extends ResourceController<User> {
  
  @UseValidatorParam<UserController>('getCreateDtoClass', true)
  @Post()
  async create(@ValidatorParam("body") createDto: CreateUserDto) {
    // DTO validation is automatically applied
    return super.create(createDto);
  }
  
  getCreateDtoClass(): IClassConstructor<CreateUserDto> {
    return CreateUserDto;
  }
}
```

### **ParseRequest Decorator**

```typescript
/**
 * Parses request data without validation
 */
@ParseRequest(config: IParseRequestConfig)

// Example:
@Get()
async getMany(
  @ParseRequest("queryOptions") options: IResourceQueryOptions<User>,
  @ParseRequest("headers.authorization") token: string,
  @ParseRequest({ 
    source: "query",
    transform: (data) => ({
      page: parseInt(data.page) || 1,
      limit: Math.min(parseInt(data.limit) || 10, 100)
    })
  }) pagination: { page: number; limit: number }
) {
  // Parsed data without validation
}
```

---

## 📄 Pagination

### **Automatic Pagination**

```typescript
// Request: GET /users?page=2&limit=20
// Response structure:
interface IPaginatedResult<T> {
  data: T[];                    // Array of items
  meta: {
    currentPage: number;        // Current page number
    pageSize: number;           // Items per page
    total: number;              // Total items count
    totalPages: number;         // Total pages count
    hasNextPage: boolean;       // Has next page
    hasPreviousPage: boolean;   // Has previous page
    nextPage: number | null;    // Next page number
    previousPage: number | null; // Previous page number
    lastPage: number;           // Last page number
  };
}

// Example response:
{
  "data": [
    { "id": "21", "name": "User 21", "email": "user21@example.com" },
    { "id": "22", "name": "User 22", "email": "user22@example.com" }
    // ... 18 more items
  ],
  "meta": {
    "currentPage": 2,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": true,
    "nextPage": 3,
    "previousPage": 1,
    "lastPage": 8
  }
}
```

### **Custom Pagination Logic**

```typescript
@Injectable()
export class UserService extends ResourceService<User> {
  
  async getActiveUsersWithPagination(
    page: number = 1, 
    limit: number = 10
  ): Promise<IPaginatedResult<User>> {
    const options: IResourceQueryOptions<User> = {
      page,
      limit,
      filter: { status: 'active' },
      sort: '-createdAt'
    };
    
    return this.findAndPaginate(options);
  }
  
  async getPopularUsers(page: number = 1): Promise<IPaginatedResult<User>> {
    const options: IResourceQueryOptions<User> = {
      page,
      limit: 50,
      sort: ['-popularity', 'name'],
      filter: { 
        verified: true,
        lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    };
    
    return this.findAndPaginate(options);
  }
}
```

---

## 🚨 Exception Handling

### **Built-in Exception Handling**

```typescript
// Automatic error responses for common scenarios
try {
  const user = await userService.findOne('invalid-id');
} catch (error) {
  // Automatically converted to appropriate HTTP exception
  // NotFoundException for missing resources
  // BadRequestException for validation errors
  // InternalServerErrorException for server errors
}

// Error response format:
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/users/invalid-id"
}
```

### **Custom Exception Handling**

```typescript
import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException,
  HttpStatus 
} from '@nestjs/common';

@Catch()
export class CustomResourceExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    
    // Custom error logging
    console.error(`Error ${status}: ${message}`, {
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : undefined
    });
    
    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method
    });
  }
}

// Apply to controller
@Controller('users')
@UseFilters(CustomResourceExceptionFilter)
export class UserController extends ResourceController<User> {
  // Controller implementation
}
```

---

## 🔗 Interceptors

### **Response Transformation Interceptor**

```typescript
import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        timestamp: new Date().toISOString(),
        data,
        meta: {
          version: '1.0.0',
          requestId: context.switchToHttp().getRequest().headers['x-request-id']
        }
      }))
    );
  }
}

// Apply to controller
@Controller('users')
@UseInterceptors(ResponseTransformInterceptor)
export class UserController extends ResourceController<User> {
  // All responses will be wrapped with success metadata
}
```

### **Caching Interceptor**

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, any>();
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = `${request.method}:${request.url}`;
    
    // Return cached response for GET requests
    if (request.method === 'GET' && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    
    return next.handle().pipe(
      tap(response => {
        // Cache GET responses for 5 minutes
        if (request.method === 'GET') {
          this.cache.set(cacheKey, response);
          setTimeout(() => {
            this.cache.delete(cacheKey);
          }, 5 * 60 * 1000);
        }
      })
    );
  }
}
```

---

## 🎯 Real-World Examples

### **Complete User Management System**

```typescript
// user.entity.ts
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// user.dto.ts
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and number'
  })
  password: string;

  @IsOptional()
  @IsIn(['admin', 'user', 'moderator'])
  role?: string = 'user';
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @IsIn(['admin', 'user', 'moderator'])
  role?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: string;
}

// user.service.ts
@Injectable()
export class UserService extends ResourceService<User> {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private emailService: EmailService,
    private loggerService: LoggerService
  ) {
    super();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username }
      ]
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Create user
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const user = await this.userRepository.save(userData);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, {
      firstName: user.firstName,
      username: user.username
    });

    // Log user creation
    this.loggerService.log(`User created: ${user.username} (${user.email})`);

    return user;
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  }> {
    const [total, active, inactive, adminCount, userCount, moderatorCount] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { status: 'active' } }),
      this.userRepository.count({ where: { status: 'inactive' } }),
      this.userRepository.count({ where: { role: 'admin' } }),
      this.userRepository.count({ where: { role: 'user' } }),
      this.userRepository.count({ where: { role: 'moderator' } })
    ]);

    return {
      total,
      active,
      inactive,
      byRole: {
        admin: adminCount,
        user: userCount,
        moderator: moderatorCount
      }
    };
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.firstName ILIKE :query', { query: `%${query}%` })
      .orWhere('user.lastName ILIKE :query', { query: `%${query}%` })
      .orWhere('user.username ILIKE :query', { query: `%${query}%` })
      .orWhere('user.email ILIKE :query', { query: `%${query}%` })
      .orderBy('user.firstName', 'ASC')
      .getMany();
  }
}

// user.controller.ts
@Controller('api/users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class UserController extends ResourceController<User> {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    super(userService);
  }

  getCreateDtoClass(): IClassConstructor<CreateUserDto> {
    return CreateUserDto;
  }

  getUpdateDtoClass(): IClassConstructor<UpdateUserDto> {
    return UpdateUserDto;
  }

  // Override create with custom logic
  @Post()
  @UseValidatorParam<UserController>('getCreateDtoClass', true)
  async create(@ValidatorParam("body") createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.createUser(createUserDto);
    
    // Remove password from response
    const { password, ...userResponse } = user;
    return userResponse as User;
  }

  // Custom endpoints
  @Get('stats')
  @UseGuards(PermissionGuard)
  @Permissions('users.view_stats')
  async getStats() {
    return this.userService.getUserStats();
  }

  @Get('search')
  async searchUsers(@Query('q') query: string) {
    if (!query || query.length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }
    return this.userService.searchUsers(query);
  }

  @Post(':id/activate')
  @UseGuards(PermissionGuard)
  @Permissions('users.activate')
  async activateUser(@Param('id') id: string) {
    return this.userService.update(id, { status: 'active' });
  }

  @Post(':id/suspend')
  @UseGuards(PermissionGuard)
  @Permissions('users.suspend')
  async suspendUser(@Param('id') id: string) {
    return this.userService.update(id, { status: 'suspended' });
  }
}
```

---

## 🎯 Best Practices

### **1. Service Organization**
```typescript
// ✅ Good: Extend ResourceService with specific logic
@Injectable()
export class UserService extends ResourceService<User> {
  // Add domain-specific methods
  async activateUser(id: string): Promise<User> { /* ... */ }
  async deactivateUser(id: string): Promise<User> { /* ... */ }
}

// ❌ Avoid: Bypassing ResourceService abstraction
@Injectable()
export class UserService {
  constructor(private userRepository: Repository<User>) {}
  // Reimplementing CRUD operations
}
```

### **2. Validation Strategy**
```typescript
// ✅ Good: Use DTOs for all input validation
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;
  
  @IsEmail()
  email: string;
}

// ✅ Good: Separate DTOs for different operations
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
}
```

### **3. Error Handling**
```typescript
// ✅ Good: Use appropriate HTTP exceptions
async findUser(id: string): Promise<User> {
  const user = await this.userRepository.findOne(id);
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;
}

// ✅ Good: Validate business rules
async createUser(dto: CreateUserDto): Promise<User> {
  const existingUser = await this.findByEmail(dto.email);
  if (existingUser) {
    throw new ConflictException('Email already in use');
  }
  // Create user
}
```

---

The Resource module provides a complete foundation for building REST APIs with NestJS, handling all the common patterns while remaining flexible for custom business logic.
