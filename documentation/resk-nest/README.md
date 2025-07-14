# 🏗️ @resk/nest Framework Documentation

> **NestJS modules and utilities for rapid API development**

## 📖 Overview

@resk/nest is a comprehensive NestJS extension package that provides pre-built modules, controllers, services, and utilities for rapid API development. It integrates seamlessly with @resk/core and offers powerful abstractions for common backend patterns including resource management, authentication, database integration, and internationalization.

**Version:** 1.11.0  
**Dependencies:** NestJS 11.1.3+, @resk/core 1.21.4+

---

## 🗂️ Available Modules

### **Resource Management**
- [**resource**](./resource.md) - Complete CRUD operations with pagination, validation, and filtering
  - Generic resource controllers and services
  - Built-in validation pipes and interceptors
  - Automatic pagination and query handling
  - Exception handling and error responses

### **Authentication & Security**
- [**auth**](./auth.md) - Authentication guards, JWT handling, and security utilities
  - JWT token management and validation
  - Permission-based access control
  - Password hashing with bcrypt
  - OTP generation and validation
  - Authentication guards and decorators

### **Database Integration**
- [**mongoose**](./mongoose.md) - MongoDB integration with Mongoose ODM
  - Resource services for MongoDB
  - Automatic schema validation
  - Query optimization and aggregation
  - Connection management and configuration

- [**typeorm**](./typeorm.md) - SQL database integration with TypeORM
  - Resource services for SQL databases
  - Entity management and relationships
  - Migration support and schema sync
  - Transaction handling

### **Internationalization**
- [**i18n**](./i18n.md) - Multi-language support and localization
  - Request-based locale detection
  - Translation middleware and interceptors
  - Dynamic content localization
  - Fallback language handling

### **Utilities & Helpers**
- [**utils**](./utils.md) - Common utilities and helper functions
  - Request parsing utilities
  - Response transformation helpers
  - Validation utilities
  - Error handling functions

---

## 🚀 Quick Start

### **Installation**

```bash
npm install @resk/nest @resk/core @nestjs/common @nestjs/core
```

### **Basic Setup**

```typescript
import { Module } from '@nestjs/common';
import { ResourceModule } from '@resk/nest';
import { I18nModule } from '@resk/nest';

@Module({
  imports: [
    // Resource management
    ResourceModule,
    
    // Internationalization
    I18nModule.forRoot({
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'fr', 'es'],
    }),
  ],
})
export class AppModule {}
```

### **Simple Resource Controller**

```typescript
import { Controller } from '@nestjs/common';
import { ResourceController, ResourceService } from '@resk/nest';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

@Controller('users')
export class UsersController extends ResourceController<User> {
  constructor(private userService: ResourceService<User>) {
    super(userService);
  }
}

// Automatically provides:
// GET /users (with pagination, filtering, sorting)
// GET /users/:id
// POST /users
// PUT /users/:id
// DELETE /users/:id
```

### **Database Integration**

```typescript
// MongoDB with Mongoose
import { MongooseResourceService } from '@resk/nest/mongoose';

@Injectable()
export class UserService extends MongooseResourceService<User> {
  constructor(@InjectModel('User') userModel: Model<User>) {
    super(userModel);
  }
}

// SQL with TypeORM
import { TypeOrmResourceService } from '@resk/nest/typeorm';

@Injectable()
export class UserService extends TypeOrmResourceService<User> {
  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    super(userRepository);
  }
}
```

---

## 🎯 Key Features

### **🔄 Resource Management**
- **Generic CRUD Operations**: Pre-built controllers with full CRUD functionality
- **Automatic Pagination**: Built-in pagination with customizable page sizes
- **Advanced Filtering**: Support for complex queries and search operations  
- **Validation Pipeline**: Automatic request validation with custom DTOs
- **Error Handling**: Consistent error responses and exception handling

### **🔐 Authentication & Security**
- **JWT Integration**: Complete JWT token lifecycle management
- **Role-Based Access**: Permission guards and role-based authorization
- **Password Security**: bcrypt integration for secure password hashing
- **OTP Support**: One-time password generation and validation
- **Guard System**: Flexible authentication and authorization guards

### **💾 Database Abstraction**
- **Multi-Database Support**: Works with MongoDB (Mongoose) and SQL databases (TypeORM)
- **Repository Pattern**: Clean separation between data access and business logic
- **Query Optimization**: Automatic query optimization and eager loading
- **Transaction Support**: Built-in transaction handling for complex operations

### **🌍 Internationalization**
- **Auto-Detection**: Automatic locale detection from request headers
- **Dynamic Translation**: Real-time content translation and localization
- **Fallback Support**: Graceful fallback to default language
- **Middleware Integration**: Seamless integration with NestJS middleware pipeline

### **⚡ Performance & Scalability**
- **Caching Support**: Built-in caching mechanisms for improved performance
- **Async Operations**: Full async/await support throughout the framework
- **Memory Efficient**: Optimized for low memory footprint and high throughput
- **Streaming Support**: Support for data streaming and large payload handling

---

## 🏛️ Architecture

### **Modular Design**
```
@resk/nest
├── Resource Management
│   ├── Controllers (HTTP endpoints)
│   ├── Services (Business logic)
│   ├── Pipes (Validation)
│   └── Interceptors (Response transformation)
├── Authentication
│   ├── Guards (Access control)
│   ├── JWT (Token management)
│   └── Security (Password, OTP)
├── Database
│   ├── Mongoose (MongoDB)
│   └── TypeORM (SQL)
├── I18n
│   ├── Middleware (Locale detection)
│   └── Interceptors (Translation)
└── Utilities
    ├── Helpers
    └── Common functions
```

### **Dependency Integration**
```typescript
// Framework dependencies
@nestjs/common     // Core NestJS functionality
@nestjs/core       // NestJS platform core
@nestjs/swagger    // API documentation
@resk/core         // Core utilities and types

// Database dependencies  
mongoose           // MongoDB ODM
typeorm           // SQL ORM

// Security dependencies
bcryptjs          // Password hashing
```

---

## 🎯 Use Cases

### **API Development**
- **REST APIs**: Complete REST API development with minimal boilerplate
- **GraphQL APIs**: Compatible with NestJS GraphQL module
- **Microservices**: Perfect for microservice architecture
- **Enterprise Applications**: Scalable solution for large applications

### **Database Applications**
- **Content Management**: CMS and content-driven applications
- **E-commerce**: Product catalogs, inventory, and order management
- **User Management**: Authentication, profiles, and permission systems
- **Data Analytics**: Data collection, processing, and reporting

### **Multi-tenant Applications**
- **SaaS Platforms**: Software-as-a-Service applications
- **Multi-language Apps**: International applications with localization
- **Enterprise Software**: Complex business applications
- **API Gateways**: Centralized API management and routing

---

## 🔗 Integration Examples

### **Complete Application Setup**

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ResourceModule, I18nModule, AuthModule } from '@resk/nest';
import { MongooseModule } from '@resk/nest/mongoose';

@Module({
  imports: [
    // Database
    MongooseModule.forRoot('mongodb://localhost:27017/myapp'),
    
    // Authentication  
    AuthModule.forRoot({
      jwtSecret: process.env.JWT_SECRET,
      expiresIn: '1d',
    }),
    
    // Internationalization
    I18nModule.forRoot({
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'fr', 'es', 'de'],
      translationPath: './translations',
    }),
    
    // Resource management
    ResourceModule,
  ],
})
export class AppModule {}
```

### **Advanced Controller Example**

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { 
  ResourceController, 
  JwtAuthGuard, 
  PermissionGuard,
  Permissions 
} from '@resk/nest';

@Controller('api/users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController extends ResourceController<User> {
  constructor(userService: UserService) {
    super(userService);
  }
  
  @Permissions('users.create')
  async create(createUserDto: CreateUserDto) {
    return super.create(createUserDto);
  }
  
  @Permissions('users.update')
  async update(id: string, updateUserDto: UpdateUserDto) {
    return super.update(id, updateUserDto);
  }
  
  @Permissions('users.delete')
  async delete(id: string) {
    return super.delete(id);
  }
}
```

---

## 📚 Documentation Structure

Each module documentation includes:
- **Quick Start**: Get started immediately with working examples
- **API Reference**: Complete method and interface documentation
- **Configuration**: Setup and configuration options
- **Examples**: Real-world usage patterns and best practices
- **Integration**: How to integrate with other modules and external services
- **Advanced Usage**: Complex scenarios and customization options

---

## 🎯 Next Steps

1. **[Resource Module](./resource.md)** - Start with resource management for rapid CRUD development
2. **[Authentication](./auth.md)** - Add security and user management
3. **[Database Integration](./mongoose.md)** - Connect to your preferred database
4. **[Internationalization](./i18n.md)** - Add multi-language support
5. **[Advanced Patterns](./utils.md)** - Explore advanced utilities and patterns

---

The @resk/nest framework provides everything you need to build robust, scalable NestJS applications with minimal boilerplate and maximum productivity!
