# 🏗️ @resk/nest Framework Documentation

> **NestJS modules and utilities for rapid API development**

## 📖 Overview

@resk/nest is a comprehensive NestJS extension package that provides pre-built modules, controllers, services, and utilities for rapid API development. It integrates seamlessly with @resk/core and offers powerful abstractions for common backend patterns.

**Version:** 1.11.0  
**Dependencies:** NestJS 11.1.3+, @resk/core 1.21.4+

---

## 🗂️ Available Modules

### **Resource Management**
- [**resource**](./resource.md) - Complete CRUD operations with pagination, validation, and filtering

### **Authentication & Security**  
- [**auth**](./auth.md) - Authentication guards, JWT handling, and security utilities

### **Database Integration**
- [**mongoose**](./mongoose.md) - MongoDB integration with Mongoose ODM
- [**typeorm**](./typeorm.md) - SQL database integration with TypeORM

### **Internationalization**
- [**i18n**](./i18n.md) - Multi-language support and localization

### **Utilities & Helpers**
- [**utils**](./utils.md) - Common utilities and helper functions

---

## 🚀 Quick Start

### **Installation**

```bash
npm install @resk/nest @resk/core @nestjs/common @nestjs/core
```

### **Basic Setup**

```typescript
import { Module } from '@nestjs/common';
import { ResourceModule, AuthModule, I18nModule } from '@resk/nest';

@Module({
  imports: [
    ResourceModule,
    AuthModule.forRoot({
      jwtSecret: process.env.JWT_SECRET,
      expiresIn: '24h',
    }),
    I18nModule.forRoot({
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'fr', 'es'],
    }),
  ],
})
export class AppModule {}
```

### **Simple API Example**

```typescript
import { Controller } from '@nestjs/common';
import { ResourceController, ResourceService } from '@resk/nest';

interface User {
  id: string;
  name: string;
  email: string;
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

---

## 🏛️ Architecture

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

## 🎯 Module Status

| Module | Status | Description |
|--------|--------|-------------|
| [resource](./resource.md) | ✅ **Complete** | CRUD operations, pagination, validation |
| [auth](./auth.md) | ✅ **Complete** | JWT, guards, permissions, security |
| [mongoose](./mongoose.md) | ✅ **Complete** | MongoDB integration with transactions |
| [typeorm](./typeorm.md) | ✅ **Complete** | SQL database integration with transactions |
| [i18n](./i18n.md) | ✅ **Complete** | Internationalization with auto-detection |
| [utils](./utils.md) | ✅ **Complete** | Application setup and Swagger tools |

---

## 🎯 Next Steps

1. **[Resource Module](./resource.md)** - Start with resource management for rapid CRUD development
2. **[Authentication](./auth.md)** - Add security and user management
3. **[Database Integration](./mongoose.md)** - Connect to your preferred database
4. **[Internationalization](./i18n.md)** - Add multi-language support
5. **[Advanced Patterns](./utils.md)** - Explore advanced utilities and patterns

---

The @resk/nest framework provides everything you need to build robust, scalable NestJS applications with minimal boilerplate and maximum productivity!
