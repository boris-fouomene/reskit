# 📖 SESSION 1.2: Complete Field Types Reference - @resk/core

> **Generated from source code analysis** - Based on actual implementation in `/packages/resk-core/src/`

## 🎯 Field Types System Overview

Reskit's field system is built on a flexible, extensible architecture that provides type safety, automatic validation, and rich formatting capabilities. Every field is defined using the `@Field` decorator and automatically inherits powerful features like validation, formatting, internationalization, and UI generation.

### 🏗️ Architecture Foundation

```typescript
// Core field architecture
export interface IFieldBase<FieldType extends IFieldType = IFieldType> {
  type: FieldType;                    // Field type (string, number, etc.)
  name?: string;                      // Field identifier
  label?: string;                     // Display label
  required?: boolean;                 // Validation: required field
  unique?: boolean;                   // Database: unique constraint
  readOnly?: boolean;                 // UI: read-only display
  disabled?: boolean;                 // UI: disabled state
  visible?: boolean;                  // UI: visibility control
  primaryKey?: boolean;               // Database: primary key
  minLength?: number;                 // Validation: minimum length
  maxLength?: number;                 // Validation: maximum length
  length?: number;                    // Validation: exact length
  // ... 20+ additional properties
}
```

---

## 📋 Core Field Types

### 1. **Text Field** (`type: "text"`)

The most basic field type for string inputs.

#### **Configuration Options:**
```typescript
interface ITextFieldOptions extends IFieldBase<"text"> {
  minLength?: number;           // Minimum character length
  maxLength?: number;           // Maximum character length
  length?: number;              // Exact character length
  placeholder?: string;         // Input placeholder text
  multiline?: boolean;          // Multi-line text area
  format?: IInputFormatterValueFormat; // Text formatting
}
```

#### **Usage Examples:**
```typescript
import { Resource, Field } from '@resk/core';

export class User extends Resource {
  // Basic text field
  @Field({ type: 'text', required: true })
  username: string;
  
  // Text with length validation
  @Field({ 
    type: 'text', 
    required: true, 
    minLength: 2, 
    maxLength: 50,
    label: 'First Name'
  })
  firstName: string;
  
  // Multi-line text area
  @Field({ 
    type: 'text', 
    multiline: true, 
    maxLength: 500,
    placeholder: 'Enter your bio...'
  })
  bio: string;
  
  // Text with custom formatting
  @Field({ 
    type: 'text',
    format: (options) => options.value?.toUpperCase()
  })
  countryCode: string;
}
```

#### **Automatic Features:**
- ✅ **Type Inference**: Automatically detects `string` properties
- ✅ **Validation**: Length constraints, required validation
- ✅ **UI Generation**: Text inputs, text areas for multiline
- ✅ **Formatting**: Custom text transformation functions

---

### 2. **Number Field** (`type: "number"`)

Handles numeric inputs with extensive validation and formatting options.

#### **Configuration Options:**
```typescript
interface INumberFieldOptions extends IFieldBase<"number"> {
  min?: number;                 // Minimum value
  max?: number;                 // Maximum value
  step?: number;                // Input step increment
  precision?: number;           // Decimal precision
  format?: "number" | "money" | ICurrencyFormatterKey; // Number formatting
  abreviateNumber?: boolean;    // Abbreviate large numbers (1K, 1M)
}
```

#### **Usage Examples:**
```typescript
export class Product extends Resource {
  // Basic number field
  @Field({ type: 'number', required: true, min: 0 })
  price: number;
  
  // Integer with range
  @Field({ 
    type: 'number', 
    min: 1, 
    max: 100, 
    step: 1,
    label: 'Quantity'
  })
  quantity: number;
  
  // Decimal with precision
  @Field({ 
    type: 'number', 
    min: 0, 
    precision: 2,
    format: 'money'
  })
  totalAmount: number;
  
  // Large numbers with abbreviation
  @Field({ 
    type: 'number',
    abreviateNumber: true,
    format: 'number'
  })
  views: number; // Displays as "1.2K", "5.5M", etc.
  
  // Currency-specific formatting
  @Field({ 
    type: 'number',
    format: 'formatUSD' // Uses currency formatter
  })
  priceUSD: number;
}
```

#### **Built-in Validation:**
- ✅ **Range Validation**: `min`, `max` constraints
- ✅ **Step Validation**: Increment validation
- ✅ **Type Validation**: Ensures numeric input
- ✅ **Precision Validation**: Decimal place limits

---

### 3. **Boolean Field** (`type: "boolean"`)

Handles true/false values with various UI representations.

#### **Configuration Options:**
```typescript
interface IBooleanFieldOptions extends IFieldBase<"boolean"> {
  default?: boolean;            // Default value
  labels?: {                   // Custom labels for true/false
    true: string;
    false: string;
  };
}
```

#### **Usage Examples:**
```typescript
export class User extends Resource {
  // Basic boolean field
  @Field({ type: 'boolean', default: false })
  isActive: boolean;
  
  // Boolean with custom labels
  @Field({ 
    type: 'boolean',
    default: true,
    labels: {
      true: 'Enabled',
      false: 'Disabled'
    }
  })
  emailNotifications: boolean;
  
  // Required boolean (for agreements)
  @Field({ 
    type: 'boolean', 
    required: true,
    label: 'Accept Terms and Conditions'
  })
  acceptTerms: boolean;
}
```

#### **UI Representations:**
- ✅ **Checkbox**: Standard checkbox input
- ✅ **Switch**: Toggle switch component
- ✅ **Radio Buttons**: Yes/No radio options
- ✅ **Custom Labels**: User-defined true/false labels

---

### 4. **Date Field** (`type: "date"`)

Comprehensive date and time handling with formatting and validation.

#### **Configuration Options:**
```typescript
interface IDateFieldOptions extends IFieldBase<"date"> {
  dateFormat?: IMomentFormat;   // Date display format
  minDate?: Date | string;      // Minimum allowed date
  maxDate?: Date | string;      // Maximum allowed date
  includeTime?: boolean;        // Include time component
  timezone?: string;            // Timezone handling
}
```

#### **Usage Examples:**
```typescript
export class Event extends Resource {
  // Basic date field
  @Field({ type: 'date', required: true })
  eventDate: Date;
  
  // Date with time
  @Field({ 
    type: 'date',
    includeTime: true,
    label: 'Event Start Time'
  })
  startDateTime: Date;
  
  // Date with range validation
  @Field({ 
    type: 'date',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 year
    dateFormat: 'DD/MM/YYYY'
  })
  registrationDeadline: Date;
  
  // Auto-populated timestamps
  @Field({ 
    type: 'date',
    readOnly: true,
    default: () => new Date()
  })
  createdAt: Date;
}
```

#### **Format Options:**
- ✅ **Standard Formats**: `DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD`
- ✅ **Time Formats**: `HH:mm`, `HH:mm:ss`, `hh:mm A`
- ✅ **Relative Formats**: "2 days ago", "in 3 hours"
- ✅ **Custom Formats**: Moment.js compatible format strings

---

## 🔧 Advanced Field Types

### 5. **Email Field** (`type: "email"`)

Specialized text field with email validation and formatting.

```typescript
export class Contact extends Resource {
  @Field({ 
    type: 'email', 
    required: true,
    unique: true,
    label: 'Email Address'
  })
  email: string;
  
  // Email with custom validation
  @Field({ 
    type: 'email',
    validate: (value) => {
      // Custom domain validation
      return value.endsWith('@company.com');
    }
  })
  workEmail: string;
}
```

### 6. **Password Field** (`type: "password"`)

Secure password input with strength validation.

```typescript
export class User extends Resource {
  @Field({ 
    type: 'password',
    required: true,
    minLength: 8,
    validate: (value) => {
      // Password strength validation
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value);
    }
  })
  password: string;
}
```

### 7. **Phone Field** (`type: "tel"`)

Phone number input with international formatting.

```typescript
export class Contact extends Resource {
  @Field({ 
    type: 'tel',
    phoneCountryCode: 'US', // Default country code
    format: 'international'
  })
  phoneNumber: string;
}
```

### 8. **URL Field** (`type: "url"`)

URL input with validation and formatting.

```typescript
export class Website extends Resource {
  @Field({ 
    type: 'url',
    required: true,
    validate: (value) => {
      return /^https?:\/\//.test(value); // Require http/https
    }
  })
  websiteUrl: string;
}
```

---

## 🎨 Custom Field Types

### Creating Custom Field Types

Extend the `IFieldMap` interface to add custom field types:

```typescript
// 1. Declare the custom field type
declare module "@resk/core" {
  interface IFieldMap {
    // Color picker field
    color: IFieldBase<"color"> & {
      colorFormat?: 'hex' | 'rgb' | 'hsl';
      palette?: string[];
      allowAlpha?: boolean;
    };
    
    // Rich text editor field
    richText: IFieldBase<"richText"> & {
      toolbar?: string[];
      maxLength?: number;
      allowImages?: boolean;
      allowLinks?: boolean;
    };
    
    // File upload field
    file: IFieldBase<"file"> & {
      accept?: string[];          // Allowed file types
      maxSize?: number;           // Max file size in bytes
      multiple?: boolean;         // Allow multiple files
      uploadPath?: string;        // Upload directory
    };
    
    // Select dropdown field
    select: IFieldBase<"select"> & {
      options: Array<{
        value: any;
        label: string;
        disabled?: boolean;
      }>;
      multiple?: boolean;
      searchable?: boolean;
      clearable?: boolean;
    };
  }
}

// 2. Use the custom field types
export class BlogPost extends Resource {
  @Field({ 
    type: 'richText',
    required: true,
    toolbar: ['bold', 'italic', 'link', 'image'],
    allowImages: true,
    maxLength: 10000
  })
  content: string;
  
  @Field({ 
    type: 'color',
    colorFormat: 'hex',
    palette: ['#FF0000', '#00FF00', '#0000FF'],
    allowAlpha: false
  })
  accentColor: string;
  
  @Field({ 
    type: 'select',
    required: true,
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' }
    ]
  })
  status: 'draft' | 'published' | 'archived';
  
  @Field({ 
    type: 'file',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    uploadPath: '/uploads/blog-images'
  })
  featuredImage: string;
}
```

---

## ✅ Field Validation System

### Built-in Validators

Every field type comes with comprehensive validation decorators:

```typescript
import { 
  ValidatorIsRequired,
  ValidatorHasMinLength,
  ValidatorHasMaxLength,
  ValidatorIsEmail,
  ValidatorIsUrl,
  ValidatorIsNumberGreaterThan,
  ValidatorIsNumberLessThan
} from '@resk/core';

export class Product extends Resource {
  @Field({ type: 'text' })
  @ValidatorIsRequired()
  @ValidatorHasMinLength([3])
  @ValidatorHasMaxLength([50])
  name: string;
  
  @Field({ type: 'number' })
  @ValidatorIsRequired()
  @ValidatorIsNumberGreaterThan([0])
  @ValidatorIsNumberLessThan([10000])
  price: number;
  
  @Field({ type: 'email' })
  @ValidatorIsRequired()
  @ValidatorIsEmail()
  contactEmail: string;
  
  @Field({ type: 'url' })
  @ValidatorIsUrl()
  websiteUrl: string;
}
```

### Custom Validation Functions

```typescript
export class User extends Resource {
  @Field({ 
    type: 'text',
    validate: async (value, context) => {
      // Async validation example
      const isUnique = await checkUsernameUnique(value);
      if (!isUnique) {
        throw new Error('Username already exists');
      }
      return true;
    }
  })
  username: string;
  
  @Field({ 
    type: 'number',
    validate: (value, context) => {
      // Cross-field validation
      if (context.data.userType === 'premium' && value < 100) {
        throw new Error('Premium users must have a value of at least 100');
      }
      return true;
    }
  })
  creditLimit: number;
}
```

---

## 🎭 Field Formatting System

### Input Formatters

Fields support extensive formatting options through the `IInputFormatterOptions` interface:

```typescript
export class Financial extends Resource {
  // Currency formatting
  @Field({ 
    type: 'number',
    format: 'formatUSD', // Predefined currency formatter
    precision: 2
  })
  amount: number;
  
  // Custom number formatting
  @Field({ 
    type: 'number',
    format: (options) => {
      const { value } = options;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(value);
    }
  })
  formattedPrice: number;
  
  // Phone number formatting
  @Field({ 
    type: 'tel',
    phoneCountryCode: 'US',
    format: 'international',
    mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  })
  phoneNumber: string;
  
  // Date formatting
  @Field({ 
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm',
    format: (options) => {
      const { value, dateFormat } = options;
      return moment(value).format(dateFormat);
    }
  })
  appointmentDate: Date;
}
```

### Masked Input Support

```typescript
export class Secure extends Resource {
  // Credit card number with masking
  @Field({ 
    type: 'text',
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    obfuscationCharacter: '*',
    placeholderCharacter: '_'
  })
  creditCardNumber: string;
  
  // Social Security Number with validation
  @Field({ 
    type: 'text',
    mask: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    validate: (value) => value.replace(/-/g, '').length === 9
  })
  ssn: string;
}
```

---

## 🌐 Internationalization (i18n)

### Automatic Label Translation

```typescript
export class User extends Resource {
  @Field({ 
    type: 'text',
    label: 'user.fields.firstName', // i18n key
    required: true
  })
  firstName: string;
  
  // Labels are automatically translated based on current locale
  // EN: "First Name"
  // FR: "Prénom" 
  // ES: "Nombre"
}
```

### Locale-Specific Formatting

```typescript
export class Order extends Resource {
  @Field({ 
    type: 'number',
    format: (options, locale) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: getCurrencyForLocale(locale)
      }).format(options.value);
    }
  })
  totalAmount: number;
  
  @Field({ 
    type: 'date',
    format: (options, locale) => {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(options.value);
    }
  })
  orderDate: Date;
}
```

---

## 🎯 Field Context and Rendering

### Context-Specific Field Behavior

Fields can behave differently in different contexts (create, update, list, filter):

```typescript
export class Product extends Resource {
  @Field({ 
    type: 'text',
    required: true,
    // Context-specific configurations
    create: {
      placeholder: 'Enter product name...',
      maxLength: 100
    },
    update: {
      readOnly: false,
      maxLength: 150
    },
    list: {
      visible: true,
      format: (options) => options.value?.substring(0, 30) + '...'
    },
    filter: {
      searchable: true,
      type: 'text'
    }
  })
  name: string;
  
  @Field({ 
    type: 'number',
    min: 0,
    create: {
      required: true,
      default: 0
    },
    update: {
      required: false
    },
    list: {
      format: 'money'
    },
    filter: {
      type: 'range' // Special filter type for numbers
    }
  })
  price: number;
}
```

---

## 🚀 Real-World Examples

### E-commerce Product Resource

```typescript
export class Product extends Resource {
  @Field({ 
    type: 'text', 
    required: true, 
    maxLength: 100,
    unique: true 
  })
  name: string;
  
  @Field({ 
    type: 'text', 
    maxLength: 500,
    multiline: true 
  })
  description: string;
  
  @Field({ 
    type: 'number', 
    required: true, 
    min: 0,
    format: 'formatUSD' 
  })
  price: number;
  
  @Field({ 
    type: 'select',
    required: true,
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'books', label: 'Books' },
      { value: 'home', label: 'Home & Garden' }
    ]
  })
  category: string;
  
  @Field({ 
    type: 'boolean', 
    default: true 
  })
  inStock: boolean;
  
  @Field({ 
    type: 'file',
    accept: ['image/jpeg', 'image/png'],
    multiple: true,
    maxSize: 2 * 1024 * 1024 // 2MB
  })
  images: string[];
  
  @Field({ 
    type: 'date',
    readOnly: true,
    default: () => new Date()
  })
  createdAt: Date;
}
```

### User Profile Resource

```typescript
export class UserProfile extends Resource {
  @Field({ 
    type: 'text', 
    required: true, 
    minLength: 2, 
    maxLength: 50 
  })
  firstName: string;
  
  @Field({ 
    type: 'text', 
    required: true, 
    minLength: 2, 
    maxLength: 50 
  })
  lastName: string;
  
  @Field({ 
    type: 'email', 
    required: true, 
    unique: true 
  })
  email: string;
  
  @Field({ 
    type: 'tel',
    phoneCountryCode: 'US'
  })
  phoneNumber: string;
  
  @Field({ 
    type: 'date',
    maxDate: new Date() // Cannot be in the future
  })
  dateOfBirth: Date;
  
  @Field({ 
    type: 'select',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ]
  })
  gender: string;
  
  @Field({ 
    type: 'text',
    multiline: true,
    maxLength: 1000,
    placeholder: 'Tell us about yourself...'
  })
  bio: string;
  
  @Field({ 
    type: 'file',
    accept: ['image/jpeg', 'image/png'],
    maxSize: 1024 * 1024 // 1MB
  })
  profilePicture: string;
  
  @Field({ 
    type: 'boolean',
    default: true
  })
  emailNotifications: boolean;
  
  @Field({ 
    type: 'boolean',
    default: false
  })
  smsNotifications: boolean;
}
```

---

## ⚡ Performance Considerations

### Field Optimization

```typescript
// ✅ Good: Efficient field definition
@Field({ 
  type: 'text', 
  required: true,
  maxLength: 100,
  // Pre-computed validation rules
  validate: validateProductName // Reference to pre-defined function
})
productName: string;

// ❌ Avoid: Heavy computation in field definition
@Field({ 
  type: 'text',
  validate: async (value) => {
    // Avoid heavy async operations in field validation
    const result = await heavyDatabaseQuery(value);
    return result.isValid;
  }
})
inefficientField: string;
```

### Lazy Loading for Complex Fields

```typescript
export class Product extends Resource {
  // Basic fields load immediately
  @Field({ type: 'text', required: true })
  name: string;
  
  // Complex fields can be lazy-loaded
  @Field({ 
    type: 'select',
    lazy: true, // Load options on demand
    optionsLoader: async () => {
      return await fetchCategoriesFromAPI();
    }
  })
  category: string;
}
```

---

## 🎯 Best Practices

### 1. **Field Naming**
```typescript
// ✅ Good: Descriptive, consistent naming
@Field({ type: 'text' }) firstName: string;
@Field({ type: 'text' }) lastName: string;
@Field({ type: 'email' }) emailAddress: string;

// ❌ Avoid: Ambiguous or inconsistent naming
@Field({ type: 'text' }) fname: string;
@Field({ type: 'text' }) surname: string;
@Field({ type: 'text' }) mail: string;
```

### 2. **Validation Strategy**
```typescript
// ✅ Good: Combine declarative and functional validation
@Field({ 
  type: 'text',
  required: true,        // Declarative
  minLength: 3,         // Declarative  
  maxLength: 50,        // Declarative
  validate: validateUsername // Functional for complex logic
})
username: string;
```

### 3. **Type Safety**
```typescript
// ✅ Good: Strict typing
@Field({ type: 'select' })
status: 'active' | 'inactive' | 'pending'; // Union type

// ✅ Good: Enum usage
enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive', 
  PENDING = 'pending'
}

@Field({ type: 'select' })
status: ProductStatus;
```

### 4. **Performance Optimization**
```typescript
// ✅ Good: Efficient field configuration
@Field({ 
  type: 'text',
  debounce: 300,        // Debounce validation
  validateOnBlur: true, // Validate only on blur
  lazy: true           // Lazy load expensive operations
})
searchField: string;
```

---

## 🎯 Next Steps

This completes **SESSION 1.2: Complete Field Types Reference**. You now have:

✅ **Complete field types documentation** with all available options  
✅ **Real-world examples** for every field type  
✅ **Custom field type creation** guide  
✅ **Validation system** with built-in and custom validators  
✅ **Formatting and masking** capabilities  
✅ **Internationalization** support  
✅ **Performance optimization** guidelines  
✅ **Best practices** for field design  

**Ready for Session 1.3?** Next we'll cover:
- **Resource Relationships** (@OneToMany, @ManyToOne, etc.)
- **Advanced Resource Patterns** (inheritance, composition)
- **Resource Actions** and lifecycle management
- **Complex resource examples** with relationships

Or would you prefer to jump to a different session? Let me know! 🚀
