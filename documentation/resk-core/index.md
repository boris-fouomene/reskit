# 📚 Complete @resk/core Documentation Index

> **Comprehensive guide to all @resk/core framework modules and features**

## 🎯 Getting Started

- **[Main README](./README.md)** - Framework overview and quick start
- **[Installation Guide](./installation.md)** - Setup and configuration
- **[Migration Guide](./migration.md)** - Upgrading from previous versions

---

## 🏗️ Core Architecture

### **Resource Management**
- **[Resources System](./resources.md)** - Core resource architecture and decorators
- **[Field Types Reference](./field-types.md)** - Complete field system documentation
- **[Resource Relationships](./relationships.md)** - Entity relationships and associations

### **Reactive Programming**
- **[Observable Pattern](./observable.md)** - Event-driven architecture and reactive state management

---

## 🛠️ Utility Modules

### **Essential Utilities**
- **[Utilities Library](./utils.md)** - Comprehensive helper functions and type utilities
- **[Validation Engine](./validator.md)** - Data validation rules and decorators
- **[Input Formatting](./input-formatter.md)** - Input processing, masking, and formatting

### **Data Management**
- **[Currency System](./currency.md)** - Multi-currency support and financial formatting
- **[Filters & Queries](./filters.md)** - Advanced filtering and query building

---

## 🌐 Application Services

### **Internationalization**
- **[I18n System](./i18n.md)** - Multi-language support with reactive capabilities

### **User Management**
- **[Authentication](./auth.md)** - User authentication, sessions, and permissions

### **System Integration**
- **[Platform Detection](./platform.md)** - Cross-platform environment detection
- **[Logger System](./logger.md)** - Configurable logging framework
- **[HTTP Client](./http-client.md)** - Request handling and API communication
- **[Session Management](./session.md)** - Session storage and state persistence

---

## 📖 Module Documentation

| Module | Description | Key Features |
|--------|-------------|--------------|
| **[@resk/core](./README.md)** | Main framework | Resources, Fields, Decorators |
| **[utils](./utils.md)** | Utility functions | Numbers, Strings, Objects, Types |
| **[observable](./observable.md)** | Reactive system | Events, State, Observers |
| **[i18n](./i18n.md)** | Internationalization | Multi-language, Formatting |
| **[auth](./auth.md)** | Authentication | Users, Sessions, Permissions |
| **[platform](./platform.md)** | Environment detection | Web, Mobile, Desktop, Server |
| **[validator](./validator.md)** | Data validation | Rules, Decorators, Custom validators |
| **[currency](./currency.md)** | Financial data | Multi-currency, Formatting |
| **[logger](./logger.md)** | Logging system | Levels, Formatting, Custom loggers |
| **[inputFormatter](./input-formatter.md)** | Input processing | Masks, Formatting, Validation |
| **[filters](./filters.md)** | Query building | Complex filters, Search |
| **[http-client](./http-client.md)** | HTTP requests | REST APIs, Authentication |
| **[session](./session.md)** | Session management | Storage, Persistence |

---

## 🔧 Configuration Modules

### **Core Configuration**
```typescript
import { configure } from '@resk/core';

configure({
  // Global framework settings
  i18n: {
    defaultLocale: 'en',
    fallbacks: true
  },
  auth: {
    sessionTimeout: 30 * 60 * 1000,
    encryptionKey: 'your-secret-key'
  },
  logger: {
    level: 'info',
    format: 'json'
  },
  currency: {
    default: 'USD'
  }
});
```

### **Module-Specific Configuration**
```typescript
// Individual module configuration
import { I18n, Logger, Auth, Currency } from '@resk/core';

I18n.configure({ locale: 'fr' });
Logger.configure({ level: 'debug' });
Auth.configure({ sessionTimeout: 3600000 });
Currency.configure({ default: 'EUR' });
```

---

## 🚀 Quick Reference

### **Common Imports**
```typescript
// Core framework
import { Resource, Field, Observable } from '@resk/core';

// Utilities
import { 
  isNumber, formatMoney, debounce, 
  DateHelper, JsonHelper 
} from '@resk/core/utils';

// Reactive programming
import { ObservableClass, observableFactory } from '@resk/core/observable';

// Internationalization
import { I18n, Translate } from '@resk/core/i18n';

// Authentication
import { Auth, PermissionManager } from '@resk/core/auth';

// Platform detection
import { Platform, BrowserCapabilities } from '@resk/core/platform';

// Validation
import { 
  ValidatorIsRequired, ValidatorIsEmail,
  ValidatorIsNumber 
} from '@resk/core/validator';

// Currency and formatting
import { Currency, formatCurrency } from '@resk/core/currency';

// Logging
import { Logger } from '@resk/core/logger';
```

### **Essential Patterns**
```typescript
// 1. Resource Definition
@Observable()
export class User extends Resource {
  @Field({ type: 'text', required: true })
  @ValidatorIsRequired()
  name: string;
  
  @Field({ type: 'email', unique: true })
  @ValidatorIsEmail()
  email: string;
}

// 2. Reactive State Management
const user = new User();
user.observe('nameChanged', (newName) => {
  console.log('Name changed:', newName);
});

// 3. Internationalization
@Translate('user.welcome')
welcomeMessage: string;

// 4. Permission Checking
if (PermissionManager.hasPermission('write', 'posts')) {
  // User can write posts
}

// 5. Platform Adaptation
if (Platform.isMobile()) {
  // Mobile-specific logic
} else {
  // Desktop logic
}
```

---

## 📋 Feature Matrix

| Feature | Web | Mobile | Desktop | Server |
|---------|-----|--------|---------|--------|
| **Resources** | ✅ | ✅ | ✅ | ✅ |
| **Observable** | ✅ | ✅ | ✅ | ✅ |
| **Utilities** | ✅ | ✅ | ✅ | ✅ |
| **I18n** | ✅ | ✅ | ✅ | ✅ |
| **Authentication** | ✅ | ✅ | ✅ | ✅ |
| **Platform Detection** | ✅ | ✅ | ✅ | ✅ |
| **Logger** | ✅ | ✅ | ✅ | ✅ |
| **Validation** | ✅ | ✅ | ✅ | ✅ |
| **Currency** | ✅ | ✅ | ✅ | ✅ |
| **DOM Utilities** | ✅ | ❌ | ✅ | ❌ |
| **File System** | ❌ | Limited | ✅ | ✅ |
| **Push Notifications** | Limited | ✅ | ✅ | ❌ |
| **Camera Access** | ✅ | ✅ | ✅ | ❌ |

---

## 🎯 Use Case Examples

### **Enterprise Application**
```typescript
// Complete enterprise setup
import { 
  Resource, Field, Observable, I18n, Auth, 
  Logger, Platform, Currency 
} from '@resk/core';

// Configure for enterprise use
configure({
  i18n: { defaultLocale: 'en', fallbacks: true },
  auth: { sessionTimeout: 8 * 60 * 60 * 1000 }, // 8 hours
  logger: { level: 'info', format: 'json' },
  currency: { default: 'USD' }
});

// Business entity with full features
@Observable()
export class Invoice extends Resource {
  @Field({ type: 'text', required: true, unique: true })
  invoiceNumber: string;
  
  @Field({ type: 'number', format: 'formatUSD', min: 0 })
  amount: number;
  
  @Field({ type: 'date', required: true })
  dueDate: Date;
  
  @Field({ type: 'select', options: [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' }
  ]})
  status: 'draft' | 'sent' | 'paid';
}
```

### **E-commerce Platform**
```typescript
// Product catalog with rich features
@Observable()
export class Product extends Resource {
  @Field({ type: 'text', required: true, maxLength: 100 })
  name: string;
  
  @Field({ type: 'text', multiline: true, maxLength: 1000 })
  description: string;
  
  @Field({ type: 'number', format: 'money', min: 0 })
  price: number;
  
  @Field({ type: 'file', accept: ['image/*'], multiple: true })
  images: string[];
  
  @Field({ type: 'boolean', default: true })
  available: boolean;
}
```

### **Mobile Application**
```typescript
// Mobile-optimized configuration
if (Platform.isMobile()) {
  configure({
    logger: { level: 'warn' }, // Reduce logging on mobile
    auth: { rememberMe: true },
    i18n: { detectLocale: true }
  });
}

// Mobile-specific features
@Observable()
export class MobileUser extends Resource {
  @Field({ type: 'text', required: true })
  username: string;
  
  @Field({ type: 'tel', format: 'international' })
  phoneNumber: string;
  
  @Field({ type: 'boolean', default: true })
  pushNotificationsEnabled: boolean;
}
```

---

## 🔍 API Reference

### **Core Classes**
- `Resource` - Base resource class
- `ObservableClass` - Observable functionality
- `I18n` - Internationalization manager
- `Auth` - Authentication manager
- `Platform` - Platform detection utilities
- `Logger` - Logging system
- `Currency` - Currency management

### **Decorators**
- `@Field()` - Field definition
- `@Observable()` - Observable class
- `@Translate()` - Translation binding
- `@ValidatorIsRequired()` - Required validation
- `@ValidatorIsEmail()` - Email validation

### **Utility Functions**
- Number formatting: `formatMoney()`, `abbreviateNumber()`
- String utilities: `isNonNullString()`, `defaultStr()`
- Date helpers: `DateHelper.format()`, `DateHelper.now()`
- Type checking: `isNumber()`, `isObj()`, `isEmpty()`

---

## 📞 Support & Resources

- **[GitHub Repository](https://github.com/your-org/reskit)**
- **[Issue Tracker](https://github.com/your-org/reskit/issues)**
- **[Discussions](https://github.com/your-org/reskit/discussions)**
- **[Changelog](./CHANGELOG.md)**
- **[Contributing Guide](./CONTRIBUTING.md)**

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

---

*This documentation covers @resk/core v1.21.4. For the latest updates, please check the [GitHub repository](https://github.com/your-org/reskit).*
