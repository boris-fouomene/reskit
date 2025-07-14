# 🧰 Utilities Library - @resk/core/utils

> **Comprehensive collection of helper functions and utilities**

## 📖 Overview

The utilities module provides a comprehensive collection of helper functions that form the foundation of the @resk/core framework. These utilities cover everything from type checking and data manipulation to formatting and validation.

---

## 📋 Available Utilities

### 🔢 **Number Utilities**

#### **Basic Number Operations**
```typescript
import { isNumber, isInteger } from '@resk/core/utils';

// Type checking
isNumber(42);        // true
isNumber('42');      // false
isInteger(42);       // true
isInteger(42.5);     // false
```

#### **Advanced Number Formatting**
```typescript
// Currency formatting
(1234.56).formatMoney();              // "1 234.56 FCFA"
(1234.56).formatMoney('USD');         // "$1,234.56"
(1234.56).formatMoney('EUR', 2);      // "€1,234.56"

// Number formatting with separators
(1234567).formatNumber();             // "1,234,567"
(1234567).formatNumber(2, ' ');       // "1 234 567.00"

// Number abbreviation
(1500).abbreviateNumber();            // "1.5K"
(1500000).abbreviateNumber();         // "1.5M"
(1500000000).abbreviateNumber();      // "1.5B"

// Decimal counting
(123.456).countDecimals();            // 3
(123).countDecimals();                // 0
```

#### **Currency Specific Formatters**
```typescript
// Built-in currency formatters
(100).format('formatUSD');            // "$100.00"
(100).format('formatEUR');            // "€100.00"
(100).format('formatGBP');            // "£100.00"
(100).format('formatCAD');            // "CA$100.00"
(100).format('formatJPY');            // "¥100"
```

---

### 📝 **String Utilities**

#### **String Validation and Checking**
```typescript
import { 
  isNonNullString, 
  defaultStr, 
  isEmpty 
} from '@resk/core/utils';

// String validation
isNonNullString('hello');             // true
isNonNullString('');                  // false
isNonNullString(null);                // false

// Default string values
defaultStr('hello', 'default');       // 'hello'
defaultStr('', 'default');            // 'default'
defaultStr(null, 'default');          // 'default'

// Empty checking
isEmpty('');                          // true
isEmpty('   ');                       // true
isEmpty('hello');                     // false
isEmpty(null);                        // true
isEmpty(undefined);                   // true
```

#### **String Manipulation**
```typescript
// String extensions (added to String prototype)
'hello world'.replaceAll('l', 'x');   // 'hexxo worxd'
'HELLO'.toLowerCase();                // 'hello'
'hello'.toUpperCase();                // 'HELLO'

// String formatting and cleaning
'  hello world  '.trim();             // 'hello world'
```

#### **Email Validation**
```typescript
import { isValidEmail } from '@resk/core/utils';

isValidEmail('user@example.com');     // true
isValidEmail('invalid-email');        // false
isValidEmail('user@domain');          // false
```

---

### 📅 **Date Utilities**

#### **Date Helper Class**
```typescript
import { DateHelper } from '@resk/core/utils/date';

// Current date/time
DateHelper.now();                     // Current Date object
DateHelper.today();                   // Today at 00:00:00
DateHelper.tomorrow();                // Tomorrow at 00:00:00
DateHelper.yesterday();               // Yesterday at 00:00:00

// Date formatting
const date = new Date('2024-01-15');
DateHelper.format(date, 'DD/MM/YYYY'); // '15/01/2024'
DateHelper.format(date, 'MM-DD-YYYY'); // '01-15-2024'
DateHelper.format(date, 'YYYY/MM/DD'); // '2024/01/15'

// Date calculations
DateHelper.addDays(date, 7);          // Date + 7 days
DateHelper.addMonths(date, 2);        // Date + 2 months
DateHelper.addYears(date, 1);         // Date + 1 year

// Date comparisons
DateHelper.isSameDay(date1, date2);   // boolean
DateHelper.isToday(date);             // boolean
DateHelper.isBefore(date1, date2);    // boolean
DateHelper.isAfter(date1, date2);     // boolean

// Date ranges
DateHelper.startOfDay(date);          // Date at 00:00:00
DateHelper.endOfDay(date);            // Date at 23:59:59
DateHelper.startOfWeek(date);         // Monday of the week
DateHelper.endOfWeek(date);           // Sunday of the week
```

#### **Date Formatting Options**
```typescript
// Standard formats
'DD/MM/YYYY'                          // 15/01/2024
'MM/DD/YYYY'                          // 01/15/2024
'YYYY-MM-DD'                          // 2024-01-15
'DD MMM YYYY'                         // 15 Jan 2024
'MMMM DD, YYYY'                       // January 15, 2024

// Time formats
'HH:mm'                               // 14:30
'HH:mm:ss'                            // 14:30:45
'hh:mm A'                             // 02:30 PM

// Combined formats
'DD/MM/YYYY HH:mm'                    // 15/01/2024 14:30
'YYYY-MM-DD HH:mm:ss'                 // 2024-01-15 14:30:45
```

---

### 🗂️ **Object Utilities**

#### **Object Manipulation**
```typescript
import { 
  isObj, 
  extendObj, 
  deepClone 
} from '@resk/core/utils/object';

// Object type checking
isObj({});                            // true
isObj([]);                            // false
isObj(null);                          // false

// Object extension/merging
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
extendObj(obj1, obj2);                // { a: 1, b: 3, c: 4 }

// Deep cloning
const original = { a: { b: { c: 1 } } };
const clone = deepClone(original);
clone.a.b.c = 2;
console.log(original.a.b.c);         // Still 1
```

#### **Object Property Access**
```typescript
// Safe property access
const obj = { user: { profile: { name: 'John' } } };
const name = obj?.user?.profile?.name; // 'John'
const missing = obj?.user?.settings?.theme; // undefined
```

---

### 🔍 **Type Checking Utilities**

#### **Comprehensive Type Checking**
```typescript
import { 
  isPrimitive, 
  isPromise, 
  isRegex, 
  isClass,
  isNullable 
} from '@resk/core/utils';

// Primitive types
isPrimitive('string');                // true
isPrimitive(42);                      // true
isPrimitive(true);                    // true
isPrimitive({});                      // false
isPrimitive([]);                      // false

// Promise detection
isPromise(Promise.resolve());         // true
isPromise(async () => {});            // false (function, not promise)
isPromise('string');                  // false

// Regular expression detection
isRegex(/pattern/);                   // true
isRegex(new RegExp('pattern'));       // true
isRegex('pattern');                   // false

// Class detection
class MyClass {}
isClass(MyClass);                     // true
isClass(function() {});               // false
isClass('string');                    // false

// Nullable checking
isNullable(null);                     // true
isNullable(undefined);                // true
isNullable('');                       // false
isNullable(0);                        // false
```

---

### 📦 **Array Utilities**

#### **Array Helpers**
```typescript
import { defaultArray } from '@resk/core/utils';

// Default array values
defaultArray([1, 2, 3]);              // [1, 2, 3]
defaultArray(null);                   // []
defaultArray(undefined);              // []
defaultArray('not-array');            // []

// Array validation
Array.isArray([1, 2, 3]);            // true
Array.isArray('string');             // false
```

---

### 🎲 **Utility Functions**

#### **Unique ID Generation**
```typescript
import { uniqid } from '@resk/core/utils';

uniqid();                             // 'abc123def456'
uniqid('prefix-');                    // 'prefix-abc123def456'
uniqid('', '-suffix');                // 'abc123def456-suffix'
```

#### **Debouncing**
```typescript
import { debounce } from '@resk/core/utils';

// Create debounced function
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

// Usage
debouncedSearch('hello');             // Will execute after 300ms
debouncedSearch('hello world');       // Previous call cancelled
```

#### **Default Values**
```typescript
import { 
  defaultVal, 
  defaultBool, 
  defaultStr 
} from '@resk/core/utils';

// Generic default values
defaultVal('value', 'default');       // 'value'
defaultVal(null, 'default');          // 'default'
defaultVal(undefined, 'default');     // 'default'

// Boolean defaults
defaultBool(true, false);             // true
defaultBool(null, false);             // false
defaultBool(undefined, true);         // true

// String defaults
defaultStr('hello', 'default');       // 'hello'
defaultStr('', 'default');            // 'default'
defaultStr(null, 'default');          // 'default'
```

---

### 🌐 **URI Utilities**

#### **URL and URI Manipulation**
```typescript
import { UriHelper } from '@resk/core/utils/uri';

// Query string building
UriHelper.buildQuery({
  page: 1,
  size: 10,
  search: 'query'
});                                   // 'page=1&size=10&search=query'

// URL parsing
UriHelper.parseUrl('https://example.com/path?param=value');
// Returns: { protocol: 'https:', host: 'example.com', ... }

// Parameter extraction
UriHelper.getQueryParams('?page=1&size=10');
// Returns: { page: '1', size: '10' }
```

---

### 🖼️ **Image Utilities**

#### **Image Processing**
```typescript
import { ImageHelper } from '@resk/core/utils/image';

// Image validation
ImageHelper.isValidImageUrl('image.jpg');     // true
ImageHelper.isValidImageUrl('document.pdf');  // false

// Image format detection
ImageHelper.getImageFormat('image.jpg');      // 'jpeg'
ImageHelper.getImageFormat('image.png');      // 'png'

// Image size utilities
ImageHelper.calculateAspectRatio(width, height);
ImageHelper.resizeToFit(originalW, originalH, maxW, maxH);
```

---

### 📁 **File Utilities**

#### **File Operations**
```typescript
import { FileHelper } from '@resk/core/utils/file';

// File type detection
FileHelper.getFileExtension('document.pdf');  // 'pdf'
FileHelper.getMimeType('image.jpg');          // 'image/jpeg'

// File size formatting
FileHelper.formatFileSize(1024);              // '1 KB'
FileHelper.formatFileSize(1048576);           // '1 MB'
FileHelper.formatFileSize(1073741824);        // '1 GB'

// File validation
FileHelper.isValidFileType('image.jpg', ['jpg', 'png']);  // true
FileHelper.isValidFileSize(1024, 2048);       // true (1KB < 2KB limit)
```

---

### 🌐 **DOM Utilities** (Web Only)

#### **DOM Manipulation**
```typescript
import { DomHelper } from '@resk/core/utils/dom';

// Element selection
DomHelper.getElementById('myElement');
DomHelper.getElementsByClassName('myClass');
DomHelper.querySelector('.my-selector');

// Element manipulation
DomHelper.addClass(element, 'new-class');
DomHelper.removeClass(element, 'old-class');
DomHelper.toggleClass(element, 'toggle-class');

// Event handling
DomHelper.addEventListener(element, 'click', handler);
DomHelper.removeEventListener(element, 'click', handler);

// Scroll utilities
DomHelper.scrollToTop();
DomHelper.scrollToElement(element);
DomHelper.isElementInViewport(element);
```

---

### 🔄 **Comparison Utilities**

#### **Deep Equality**
```typescript
import { areEquals } from '@resk/core/utils';

// Primitive comparison
areEquals(1, 1);                      // true
areEquals('hello', 'hello');          // true

// Object comparison (deep)
areEquals(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 2 } }
);                                    // true

// Array comparison (deep)
areEquals([1, 2, [3, 4]], [1, 2, [3, 4]]); // true
```

---

### 📊 **Sorting Utilities**

#### **Advanced Sorting**
```typescript
import { SortHelper } from '@resk/core/utils/sort';

const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];

// Sort by property
SortHelper.sortBy(users, 'age');
// Result: [{ name: 'Jane', age: 25 }, ...]

// Multi-property sorting
SortHelper.sortByMultiple(users, ['age', 'name']);

// Custom sorting
SortHelper.sort(users, (a, b) => a.age - b.age);
```

---

### 🔧 **JSON Utilities**

#### **Enhanced JSON Operations**
```typescript
import { JsonHelper } from '@resk/core/utils/json';

// Safe JSON parsing
JsonHelper.parse('{"name": "John"}');         // { name: 'John' }
JsonHelper.parse('invalid json');             // null (no error)

// JSON stringification with options
JsonHelper.stringify({ name: 'John' });       // '{"name":"John"}'
JsonHelper.stringify(obj, null, 2);           // Pretty printed

// JSON validation
JsonHelper.isValidJson('{"name": "John"}');   // true
JsonHelper.isValidJson('invalid');            // false
```

---

### 🧮 **Validation Utilities**

#### **Built-in Validators**
```typescript
import { Validators } from '@resk/core/utils/validators';

// Email validation
Validators.email('user@example.com');         // true
Validators.email('invalid');                  // false

// URL validation
Validators.url('https://example.com');        // true
Validators.url('invalid-url');                // false

// Phone validation
Validators.phone('+1234567890');              // true
Validators.phone('invalid');                  // false

// Custom pattern validation
Validators.pattern('123', /^\d+$/);           // true
Validators.pattern('abc', /^\d+$/);           // false
```

---

## 🚀 Performance Optimizations

### **Caching**
```typescript
// Many utilities implement internal caching
const result1 = expensiveUtility(params);     // Computed
const result2 = expensiveUtility(params);     // Cached result
```

### **Lazy Loading**
```typescript
// Some utilities are lazy-loaded to improve bundle size
import { heavyUtility } from '@resk/core/utils/heavy';
```

### **Tree Shaking**
```typescript
// Import only what you need
import { isNumber, formatMoney } from '@resk/core/utils/numbers';
// Instead of: import * from '@resk/core/utils';
```

---

## 🎯 Real-World Examples

### **Form Validation**
```typescript
import { 
  isValidEmail, 
  isNonNullString, 
  isNumber 
} from '@resk/core/utils';

function validateUser(data: any) {
  const errors: string[] = [];
  
  if (!isNonNullString(data.name)) {
    errors.push('Name is required');
  }
  
  if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!isNumber(data.age) || data.age < 0) {
    errors.push('Age must be a positive number');
  }
  
  return errors;
}
```

### **Data Processing Pipeline**
```typescript
import { 
  defaultArray, 
  SortHelper, 
  DateHelper 
} from '@resk/core/utils';

function processUserData(rawData: any[]) {
  return defaultArray(rawData)
    .filter(user => isValidEmail(user.email))
    .map(user => ({
      ...user,
      formattedDate: DateHelper.format(user.createdAt, 'DD/MM/YYYY'),
      displayName: defaultStr(user.name, 'Anonymous')
    }))
    .sort(SortHelper.sortBy('createdAt'));
}
```

### **Currency Display**
```typescript
import { formatMoney } from '@resk/core/utils/numbers';

function formatPrices(products: any[], currency: string) {
  return products.map(product => ({
    ...product,
    formattedPrice: product.price.formatMoney(currency),
    formattedOriginalPrice: product.originalPrice?.formatMoney(currency)
  }));
}
```

---

## 🎯 Best Practices

### **1. Type Safety**
```typescript
// ✅ Good: Use type guards
if (isNumber(value)) {
  // TypeScript knows value is number here
  const formatted = value.formatMoney();
}

// ❌ Avoid: Casting without validation
const formatted = (value as number).formatMoney();
```

### **2. Performance**
```typescript
// ✅ Good: Import specific utilities
import { isNumber, formatMoney } from '@resk/core/utils/numbers';

// ❌ Avoid: Importing everything
import * as Utils from '@resk/core/utils';
```

### **3. Error Handling**
```typescript
// ✅ Good: Use safe utilities
const parsed = JsonHelper.parse(jsonString); // Returns null on error
if (parsed) {
  // Safe to use parsed object
}

// ❌ Avoid: Unsafe operations
const parsed = JSON.parse(jsonString); // Throws on invalid JSON
```

---

This utilities library provides the foundation for building robust, type-safe applications with @resk/core. Each utility is designed with performance, safety, and developer experience in mind.
