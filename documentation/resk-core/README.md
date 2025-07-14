# 🚀 @resk/core Framework Documentation

> **Complete Developer Guide** - Version 1.21.4

## 📖 Overview

**@resk/core** is an innovative TypeScript framework that empowers developers to build applications with a fully decorator-based architecture for efficient resource management. By combining the power of decorators with a resource-oriented design, @resk/core enhances code clarity, modularity, and maintainability.

### 🎯 Core Philosophy

- **Decorator-Driven Architecture**: Leverage TypeScript decorators for clean, declarative code
- **Resource-Oriented Design**: Build applications around well-defined resources
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Observable Patterns**: Built-in reactive programming capabilities
- **Internationalization**: First-class i18n support
- **Platform Agnostic**: Works across web, mobile, and server environments

---

## 🏗️ Architecture Overview

```typescript
import { 
  Resource, Field, Observable, 
  I18n, Logger, Platform, Auth 
} from '@resk/core';

// Resource-based application structure
@Observable()
export class User extends Resource {
  @Field({ type: 'text', required: true })
  username: string;
  
  @Field({ type: 'email', unique: true })
  email: string;
}
```

### 📦 Core Modules

| Module | Description | Key Features |
|--------|-------------|--------------|
| **[Resources](./resources.md)** | Resource management system | Decorators, Fields, Validation |
| **[Observable](./observable.md)** | Reactive programming | Events, Listeners, State Management |
| **[Utilities](./utils.md)** | Helper functions | Numbers, Strings, Objects, Validators |
| **[I18n](./i18n.md)** | Internationalization | Multi-language, Formatting, Locales |
| **[Authentication](./auth.md)** | User management | Sessions, Permissions, Roles |
| **[Platform](./platform.md)** | Environment detection | Web, Mobile, Server detection |
| **[Logger](./logger.md)** | Logging system | Configurable, Level-based logging |
| **[Validator](./validator.md)** | Data validation | Rules, Decorators, Custom validators |
| **[Currency](./currency.md)** | Financial formatting | Multi-currency, Formatting, Conversion |
| **[Input Formatter](./input-formatter.md)** | Input processing | Masks, Validation, Formatting |

---

## 🚀 Quick Start

### Installation

```bash
npm install @resk/core
```

### Basic Usage

```typescript
import { Resource, Field, Logger } from '@resk/core';

// 1. Define a resource
export class Product extends Resource {
  @Field({ type: 'text', required: true })
  name: string;
  
  @Field({ type: 'number', min: 0, format: 'money' })
  price: number;
  
  @Field({ type: 'boolean', default: true })
  available: boolean;
}

// 2. Create and use instances
const product = new Product({
  name: 'MacBook Pro',
  price: 1999.99,
  available: true
});

// 3. Leverage framework features
Logger.info('Product created:', product.name);
```

### Advanced Example

```typescript
import { 
  Resource, Field, Observable, 
  ValidatorIsRequired, ValidatorIsEmail,
  I18n, Auth 
} from '@resk/core';

@Observable()
export class User extends Resource {
  @Field({ type: 'text', label: 'user.fields.firstName' })
  @ValidatorIsRequired()
  firstName: string;
  
  @Field({ type: 'email', unique: true })
  @ValidatorIsRequired()
  @ValidatorIsEmail()
  email: string;
  
  @Field({ type: 'select', options: [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' }
  ]})
  role: 'admin' | 'user' | 'guest';
  
  // Observable method
  onEmailChange = this.observe('email', (newEmail) => {
    Logger.info('Email changed to:', newEmail);
  });
}

// Usage with framework features
const user = new User();
user.email = 'john@example.com'; // Triggers observer
I18n.t('user.welcome', { name: user.firstName }); // i18n
Auth.setUser(user); // Authentication
```

---

## 📋 Module Documentation

### Core Modules

1. **[Resources System](./resources.md)** - Resource management and decorators
2. **[Observable Pattern](./observable.md)** - Reactive programming capabilities  
3. **[Utilities Library](./utils.md)** - Comprehensive helper functions
4. **[Internationalization](./i18n.md)** - Multi-language support
5. **[Authentication](./auth.md)** - User and session management

### Specialized Modules

6. **[Platform Detection](./platform.md)** - Environment and platform utilities
7. **[Logging System](./logger.md)** - Configurable logging framework
8. **[Validation Engine](./validator.md)** - Data validation and rules
9. **[Currency System](./currency.md)** - Financial data handling
10. **[Input Formatting](./input-formatter.md)** - Input processing and masking

---

## 🎯 Use Cases

### 1. **Enterprise Applications**
```typescript
// Complex business resources with validation
export class Invoice extends Resource {
  @Field({ type: 'text', required: true })
  invoiceNumber: string;
  
  @Field({ type: 'number', format: 'formatUSD', min: 0 })
  totalAmount: number;
  
  @Field({ type: 'date', required: true })
  dueDate: Date;
}
```

### 2. **E-commerce Platforms**
```typescript
// Product catalog with rich features
export class Product extends Resource {
  @Field({ type: 'text', maxLength: 100 })
  name: string;
  
  @Field({ type: 'number', format: 'money' })
  price: number;
  
  @Field({ type: 'file', accept: ['image/*'], multiple: true })
  images: string[];
}
```

### 3. **Content Management**
```typescript
// Multi-language content
export class Article extends Resource {
  @Field({ type: 'text', label: 'article.title' })
  title: string;
  
  @Field({ type: 'richText', maxLength: 10000 })
  content: string;
  
  @Field({ type: 'select' })
  status: 'draft' | 'published' | 'archived';
}
```

---

## ⚡ Performance Features

### 1. **Lazy Loading**
```typescript
@Field({ 
  type: 'select',
  lazy: true,
  optionsLoader: async () => fetchFromAPI()
})
category: string;
```

### 2. **Caching**
```typescript
// Automatic caching for expensive operations
I18n.t('key'); // Cached translation
Platform.isWeb(); // Cached platform detection
```

### 3. **Debouncing**
```typescript
@Field({ 
  type: 'text',
  debounce: 300,
  validateOnBlur: true
})
searchQuery: string;
```

---

## 🌐 Platform Support

| Platform | Support | Features |
|----------|---------|----------|
| **Web** | ✅ Full | DOM utilities, Browser APIs |
| **React Native** | ✅ Full | Mobile-specific utilities |
| **Node.js** | ✅ Full | Server-side features |
| **Electron** | ✅ Full | Desktop application support |

---

## 🎨 TypeScript Integration

### Strong Type Safety

```typescript
// Automatic type inference
const user = new User();
user.email = 'test@example.com'; // ✅ Type: string
user.email = 123; // ❌ TypeScript error

// Generic resource types
interface IUserData {
  firstName: string;
  email: string;
}

const user = new User<IUserData>();
```

### Decorator Types

```typescript
// Fully typed decorators
@Field({ 
  type: 'number', // Type-checked
  min: 0,         // Type-checked options
  format: 'money' // Enum values type-checked
})
price: number; // Inferred type
```

---

## 📚 Learning Path

### 1. **Beginner** (Start Here)
- [Quick Start Guide](./quick-start.md)
- [Basic Resources](./resources.md#basic-usage)
- [Simple Fields](./resources.md#field-types)

### 2. **Intermediate**
- [Advanced Fields](./resources.md#advanced-fields)
- [Validation System](./validator.md)
- [Observable Patterns](./observable.md)

### 3. **Advanced**
- [Custom Decorators](./resources.md#custom-decorators)
- [Performance Optimization](./performance.md)
- [Architecture Patterns](./patterns.md)

---

## 🔧 Configuration

### Global Configuration

```typescript
import { configure } from '@resk/core';

configure({
  i18n: {
    defaultLocale: 'en',
    fallbacks: true
  },
  logger: {
    level: 'info'
  },
  currency: {
    default: 'USD'
  }
});
```

### Module-Specific Configuration

```typescript
// I18n configuration
I18n.configure({
  locale: 'fr',
  translations: {
    en: { welcome: 'Welcome' },
    fr: { welcome: 'Bienvenue' }
  }
});

// Logger configuration
Logger.configure({
  level: 'debug',
  format: 'json'
});
```

---

## 🧪 Testing

### Unit Testing Resources

```typescript
import { User } from './user';

describe('User Resource', () => {
  it('should validate email format', async () => {
    const user = new User();
    user.email = 'invalid-email';
    
    const isValid = await user.validate();
    expect(isValid).toBe(false);
  });
  
  it('should trigger observable events', () => {
    const user = new User();
    const spy = jest.fn();
    
    user.observe('email', spy);
    user.email = 'test@example.com';
    
    expect(spy).toHaveBeenCalledWith('test@example.com');
  });
});
```

---

## 🤝 Contributing

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/reskit
cd reskit/packages/resk-core

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### Adding New Features

1. Create feature branch
2. Add comprehensive tests
3. Update documentation
4. Submit pull request

---

## 📞 Support & Resources

- **Documentation**: [Complete API Reference](./api.md)
- **Examples**: [Code Examples Repository](./examples/)
- **Issues**: [GitHub Issues](https://github.com/your-org/reskit/issues)
- **Discussions**: [Community Forum](https://github.com/your-org/reskit/discussions)

---

## 🔄 Migration Guides

- [Migrating from v1.20 to v1.21](./migration/v1.21.md)
- [Breaking Changes](./breaking-changes.md)
- [Upgrade Guide](./upgrade-guide.md)

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

---

*Built with ❤️ for modern TypeScript applications*
