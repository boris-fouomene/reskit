# 🔍 Filters & Query System - @resk/core/filters

> **MongoDB-style query building and filtering**

## 📖 Overview

The Filters module provides a comprehensive MongoDB-style query system for building complex filters, searches, and data queries. It supports logical operators, comparison operators, array operations, and advanced filtering patterns.

---

## 🚀 Quick Start

### **Basic Filter Operations**

```typescript
import { MONGO_OPERATORS, FilterBuilder } from '@resk/core/filters';

// Simple equality filter
const basicFilter = {
  name: 'John',
  age: 25
};

// Comparison operators
const rangeFilter = {
  age: { $gte: 18, $lt: 65 },
  salary: { $gt: 50000 }
};

// Array operations
const arrayFilter = {
  tags: { $in: ['javascript', 'typescript'] },
  skills: { $all: ['programming', 'debugging'] }
};

// Logical operators
const complexFilter = {
  $or: [
    { department: 'engineering' },
    { department: 'design' }
  ],
  $and: [
    { active: true },
    { verified: true }
  ]
};
```

---

## 🎭 MongoDB Operators

### **Logical Operators**

```typescript
// Available logical operators
const LOGICAL_OPERATORS = ['$and', '$or', '$nor', '$not'];

interface ILogicalOperators {
  $and: any[];     // Joins query clauses with logical AND
  $or: any[];      // Joins query clauses with logical OR  
  $nor: any[];     // Joins query clauses with logical NOR
  $not: any;       // Inverts the effect of a query expression
}

// Usage examples
const logicalFilters = {
  // AND: All conditions must be true
  $and: [
    { age: { $gte: 18 } },
    { status: 'active' },
    { verified: true }
  ],
  
  // OR: At least one condition must be true
  $or: [
    { department: 'engineering' },
    { department: 'design' },
    { role: 'manager' }
  ],
  
  // NOR: None of the conditions should be true
  $nor: [
    { status: 'inactive' },
    { deleted: true }
  ],
  
  // NOT: Inverts the condition
  status: { $not: { $eq: 'pending' } }
};
```

### **Comparison Operators**

```typescript
// Available comparison operators
const COMPARISON_OPERATORS = [
  '$eq', '$ne', '$gt', '$gte', '$lt', '$lte', 
  '$in', '$nin', '$exists', '$type', '$regex', 
  '$size', '$mod', '$all', '$elemMatch'
];

interface IComparisonOperators {
  $eq: any;        // Equal to
  $ne: any;        // Not equal to
  $gt: any;        // Greater than
  $gte: any;       // Greater than or equal
  $lt: any;        // Less than
  $lte: any;       // Less than or equal
  $in: any[];      // Value in array
  $nin: any[];     // Value not in array
  $exists: boolean; // Field exists
  $type: string;   // Field type check
  $regex: RegExp | string; // Regular expression match
  $size: number;   // Array size
  $mod: [number, number]; // Modulo operation
  $all: any[];     // Array contains all values
  $elemMatch: any; // Array element matches
}

// Usage examples
const comparisonFilters = {
  // Equality
  name: { $eq: 'John' },
  status: { $ne: 'inactive' },
  
  // Range comparisons
  age: { $gte: 18, $lte: 65 },
  salary: { $gt: 50000 },
  score: { $lt: 100 },
  
  // Array membership
  category: { $in: ['electronics', 'books', 'clothing'] },
  tags: { $nin: ['deprecated', 'obsolete'] },
  
  // Existence checks
  email: { $exists: true },
  deletedAt: { $exists: false },
  
  // Type validation
  price: { $type: 'number' },
  description: { $type: 'string' },
  
  // Pattern matching
  email: { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  username: { $regex: '^user_' },
  
  // Array operations
  tags: { $size: 3 },                    // Exactly 3 tags
  permissions: { $all: ['read', 'write'] }, // Has both permissions
  
  // Modulo operations
  id: { $mod: [2, 0] },                  // Even IDs
  
  // Complex array matching
  orders: {
    $elemMatch: {
      status: 'completed',
      amount: { $gt: 100 }
    }
  }
};
```

---

## 🔧 Filter Builder

### **FilterBuilder Class**

```typescript
class FilterBuilder {
  private filter: any = {};
  
  // Equality operations
  equals(field: string, value: any): FilterBuilder {
    this.filter[field] = { $eq: value };
    return this;
  }
  
  notEquals(field: string, value: any): FilterBuilder {
    this.filter[field] = { $ne: value };
    return this;
  }
  
  // Range operations
  greaterThan(field: string, value: any): FilterBuilder {
    this.filter[field] = { ...this.filter[field], $gt: value };
    return this;
  }
  
  greaterThanOrEqual(field: string, value: any): FilterBuilder {
    this.filter[field] = { ...this.filter[field], $gte: value };
    return this;
  }
  
  lessThan(field: string, value: any): FilterBuilder {
    this.filter[field] = { ...this.filter[field], $lt: value };
    return this;
  }
  
  lessThanOrEqual(field: string, value: any): FilterBuilder {
    this.filter[field] = { ...this.filter[field], $lte: value };
    return this;
  }
  
  // Range helper
  between(field: string, min: any, max: any): FilterBuilder {
    this.filter[field] = { $gte: min, $lte: max };
    return this;
  }
  
  // Array operations
  in(field: string, values: any[]): FilterBuilder {
    this.filter[field] = { $in: values };
    return this;
  }
  
  notIn(field: string, values: any[]): FilterBuilder {
    this.filter[field] = { $nin: values };
    return this;
  }
  
  all(field: string, values: any[]): FilterBuilder {
    this.filter[field] = { $all: values };
    return this;
  }
  
  size(field: string, length: number): FilterBuilder {
    this.filter[field] = { $size: length };
    return this;
  }
  
  // Existence operations
  exists(field: string, exists: boolean = true): FilterBuilder {
    this.filter[field] = { $exists: exists };
    return this;
  }
  
  // Type operations
  type(field: string, type: string): FilterBuilder {
    this.filter[field] = { $type: type };
    return this;
  }
  
  // Pattern matching
  regex(field: string, pattern: RegExp | string, options?: string): FilterBuilder {
    this.filter[field] = { $regex: pattern, $options: options };
    return this;
  }
  
  contains(field: string, substring: string, caseSensitive: boolean = false): FilterBuilder {
    const flags = caseSensitive ? '' : 'i';
    const escaped = substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.regex(field, new RegExp(escaped, flags));
  }
  
  startsWith(field: string, prefix: string, caseSensitive: boolean = false): FilterBuilder {
    const flags = caseSensitive ? '' : 'i';
    const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.regex(field, new RegExp(`^${escaped}`, flags));
  }
  
  endsWith(field: string, suffix: string, caseSensitive: boolean = false): FilterBuilder {
    const flags = caseSensitive ? '' : 'i';
    const escaped = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.regex(field, new RegExp(`${escaped}$`, flags));
  }
  
  // Logical operations
  and(...conditions: any[]): FilterBuilder {
    if (this.filter.$and) {
      this.filter.$and.push(...conditions);
    } else {
      this.filter.$and = conditions;
    }
    return this;
  }
  
  or(...conditions: any[]): FilterBuilder {
    if (this.filter.$or) {
      this.filter.$or.push(...conditions);
    } else {
      this.filter.$or = conditions;
    }
    return this;
  }
  
  nor(...conditions: any[]): FilterBuilder {
    if (this.filter.$nor) {
      this.filter.$nor.push(...conditions);
    } else {
      this.filter.$nor = conditions;
    }
    return this;
  }
  
  not(condition: any): FilterBuilder {
    this.filter.$not = condition;
    return this;
  }
  
  // Build final filter
  build(): any {
    return { ...this.filter };
  }
  
  // Reset builder
  reset(): FilterBuilder {
    this.filter = {};
    return this;
  }
  
  // Combine with another filter
  merge(otherFilter: any): FilterBuilder {
    this.filter = { ...this.filter, ...otherFilter };
    return this;
  }
}

// Usage examples
const filter = new FilterBuilder()
  .greaterThanOrEqual('age', 18)
  .lessThan('age', 65)
  .in('department', ['engineering', 'design'])
  .exists('email', true)
  .contains('name', 'john', false)
  .build();

console.log(filter);
/*
{
  age: { $gte: 18, $lt: 65 },
  department: { $in: ['engineering', 'design'] },
  email: { $exists: true },
  name: { $regex: /john/i }
}
*/
```

---

## 🎯 Advanced Filtering Patterns

### **Complex Query Composition**

```typescript
class AdvancedFilterBuilder extends FilterBuilder {
  // Date range filtering
  dateRange(field: string, start: Date, end: Date): FilterBuilder {
    return this.between(field, start, end);
  }
  
  // Date relative filtering
  lastDays(field: string, days: number): FilterBuilder {
    const now = new Date();
    const start = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    return this.greaterThanOrEqual(field, start);
  }
  
  thisWeek(field: string): FilterBuilder {
    const now = new Date();
    const start = new Date(now.setDate(now.getDate() - now.getDay()));
    start.setHours(0, 0, 0, 0);
    return this.greaterThanOrEqual(field, start);
  }
  
  thisMonth(field: string): FilterBuilder {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.greaterThanOrEqual(field, start);
  }
  
  // Text search with multiple fields
  textSearch(query: string, fields: string[], caseSensitive: boolean = false): FilterBuilder {
    const searchConditions = fields.map(field => ({
      [field]: { $regex: query, $options: caseSensitive ? '' : 'i' }
    }));
    
    return this.or(...searchConditions);
  }
  
  // Numeric range with tolerance
  approximately(field: string, value: number, tolerance: number): FilterBuilder {
    const min = value - tolerance;
    const max = value + tolerance;
    return this.between(field, min, max);
  }
  
  // Empty/null checks
  isEmpty(field: string): FilterBuilder {
    return this.or(
      { [field]: { $exists: false } },
      { [field]: null },
      { [field]: '' },
      { [field]: { $size: 0 } }
    );
  }
  
  isNotEmpty(field: string): FilterBuilder {
    return this.and(
      { [field]: { $exists: true } },
      { [field]: { $ne: null } },
      { [field]: { $ne: '' } },
      { [field]: { $not: { $size: 0 } } }
    );
  }
  
  // Conditional filtering
  when(condition: boolean, callback: (builder: FilterBuilder) => FilterBuilder): FilterBuilder {
    if (condition) {
      return callback(this);
    }
    return this;
  }
  
  // Nested object filtering
  nested(path: string, callback: (builder: FilterBuilder) => FilterBuilder): FilterBuilder {
    const nestedBuilder = new FilterBuilder();
    const nestedFilter = callback(nestedBuilder).build();
    
    // Convert nested filter to dot notation
    Object.keys(nestedFilter).forEach(key => {
      this.filter[`${path}.${key}`] = nestedFilter[key];
    });
    
    return this;
  }
}

// Usage examples
const advancedFilter = new AdvancedFilterBuilder()
  .lastDays('createdAt', 30)
  .textSearch('john doe', ['firstName', 'lastName', 'username'])
  .approximately('salary', 75000, 5000)
  .isNotEmpty('email')
  .when(includeInactive, builder => builder.equals('status', 'inactive'))
  .nested('profile', builder => 
    builder
      .exists('avatar', true)
      .greaterThan('completeness', 80)
  )
  .build();
```

### **Dynamic Filter Generation**

```typescript
class DynamicFilterGenerator {
  static fromQueryString(queryString: string): any {
    const params = new URLSearchParams(queryString);
    const filter: any = {};
    
    params.forEach((value, key) => {
      // Handle special operators
      if (key.includes('__')) {
        const [field, operator] = key.split('__');
        
        switch (operator) {
          case 'gt':
            filter[field] = { $gt: this.parseValue(value) };
            break;
          case 'gte':
            filter[field] = { $gte: this.parseValue(value) };
            break;
          case 'lt':
            filter[field] = { $lt: this.parseValue(value) };
            break;
          case 'lte':
            filter[field] = { $lte: this.parseValue(value) };
            break;
          case 'in':
            filter[field] = { $in: value.split(',').map(v => this.parseValue(v)) };
            break;
          case 'nin':
            filter[field] = { $nin: value.split(',').map(v => this.parseValue(v)) };
            break;
          case 'regex':
            filter[field] = { $regex: value, $options: 'i' };
            break;
          case 'exists':
            filter[field] = { $exists: value === 'true' };
            break;
        }
      } else {
        // Simple equality
        filter[key] = this.parseValue(value);
      }
    });
    
    return filter;
  }
  
  static fromFormData(formData: FormData): any {
    const filter: any = {};
    
    formData.forEach((value, key) => {
      if (value && value !== '') {
        filter[key] = this.parseValue(value as string);
      }
    });
    
    return filter;
  }
  
  static fromObject(obj: any, options: {
    ignoreEmpty?: boolean;
    convertDates?: boolean;
    caseSensitiveText?: boolean;
  } = {}): any {
    const filter: any = {};
    
    Object.entries(obj).forEach(([key, value]) => {
      if (options.ignoreEmpty && (value === '' || value == null)) {
        return;
      }
      
      if (typeof value === 'string' && value.includes('*')) {
        // Wildcard search
        const regex = value.replace(/\*/g, '.*');
        filter[key] = { 
          $regex: regex, 
          $options: options.caseSensitiveText ? '' : 'i' 
        };
      } else if (Array.isArray(value)) {
        filter[key] = { $in: value };
      } else if (options.convertDates && this.isDateString(value as string)) {
        filter[key] = new Date(value as string);
      } else {
        filter[key] = value;
      }
    });
    
    return filter;
  }
  
  private static parseValue(value: string): any {
    // Try to parse as number
    if (/^\d+(\.\d+)?$/.test(value)) {
      return parseFloat(value);
    }
    
    // Try to parse as boolean
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Try to parse as date
    if (this.isDateString(value)) {
      return new Date(value);
    }
    
    // Return as string
    return value;
  }
  
  private static isDateString(value: string): boolean {
    return !isNaN(Date.parse(value)) && /\d{4}-\d{2}-\d{2}/.test(value);
  }
}

// Usage examples
const urlFilter = DynamicFilterGenerator.fromQueryString(
  'name=john&age__gte=18&department__in=engineering,design&active=true'
);
// Result: { name: 'john', age: { $gte: 18 }, department: { $in: ['engineering', 'design'] }, active: true }

const formFilter = DynamicFilterGenerator.fromFormData(formData);
const objectFilter = DynamicFilterGenerator.fromObject({
  name: 'john*',
  departments: ['engineering', 'design'],
  createdAt: '2024-01-01'
}, { ignoreEmpty: true, convertDates: true });
```

---

## 🔄 Filter Operations

### **Filter Utilities**

```typescript
class FilterUtils {
  // Combine multiple filters with AND
  static combineWithAnd(...filters: any[]): any {
    const validFilters = filters.filter(f => f && Object.keys(f).length > 0);
    
    if (validFilters.length === 0) return {};
    if (validFilters.length === 1) return validFilters[0];
    
    return { $and: validFilters };
  }
  
  // Combine multiple filters with OR
  static combineWithOr(...filters: any[]): any {
    const validFilters = filters.filter(f => f && Object.keys(f).length > 0);
    
    if (validFilters.length === 0) return {};
    if (validFilters.length === 1) return validFilters[0];
    
    return { $or: validFilters };
  }
  
  // Merge filters (AND logic)
  static merge(...filters: any[]): any {
    return filters.reduce((merged, filter) => {
      if (!filter || Object.keys(filter).length === 0) return merged;
      
      return { ...merged, ...filter };
    }, {});
  }
  
  // Negate a filter
  static negate(filter: any): any {
    return { $not: filter };
  }
  
  // Check if filter is empty
  static isEmpty(filter: any): boolean {
    return !filter || Object.keys(filter).length === 0;
  }
  
  // Get all field names used in filter
  static getFieldNames(filter: any, prefix: string = ''): string[] {
    const fields: string[] = [];
    
    Object.keys(filter).forEach(key => {
      if (key.startsWith('$')) {
        // Logical operator
        if (Array.isArray(filter[key])) {
          filter[key].forEach((subFilter: any) => {
            fields.push(...this.getFieldNames(subFilter, prefix));
          });
        } else {
          fields.push(...this.getFieldNames(filter[key], prefix));
        }
      } else {
        // Field name
        const fieldName = prefix ? `${prefix}.${key}` : key;
        fields.push(fieldName);
      }
    });
    
    return [...new Set(fields)];
  }
  
  // Validate filter syntax
  static validate(filter: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      this.validateObject(filter, '', errors);
    } catch (error) {
      errors.push(`Invalid filter structure: ${error.message}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  private static validateObject(obj: any, path: string, errors: string[]): void {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (key.startsWith('$')) {
        // Validate operator
        if (!MONGO_OPERATORS.ALL.includes(key as any)) {
          errors.push(`Unknown operator: ${key} at ${currentPath}`);
        }
        
        // Validate operator value
        if (MONGO_OPERATORS.LOGICAL.includes(key as any)) {
          if (!Array.isArray(obj[key])) {
            errors.push(`Logical operator ${key} must have array value at ${currentPath}`);
          }
        }
      } else {
        // Validate field value
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          this.validateObject(value, currentPath, errors);
        }
      }
    });
  }
  
  // Convert filter to human-readable description
  static describe(filter: any): string {
    return this.describeObject(filter);
  }
  
  private static describeObject(obj: any): string {
    if (!obj || typeof obj !== 'object') return String(obj);
    
    const descriptions: string[] = [];
    
    Object.keys(obj).forEach(key => {
      if (key === '$and') {
        const subDescriptions = obj[key].map((sub: any) => this.describeObject(sub));
        descriptions.push(`(${subDescriptions.join(' AND ')})`);
      } else if (key === '$or') {
        const subDescriptions = obj[key].map((sub: any) => this.describeObject(sub));
        descriptions.push(`(${subDescriptions.join(' OR ')})`);
      } else if (key === '$not') {
        descriptions.push(`NOT (${this.describeObject(obj[key])})`);
      } else if (key.startsWith('$')) {
        // Operator
        descriptions.push(`${key} ${JSON.stringify(obj[key])}`);
      } else {
        // Field
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          descriptions.push(`${key} ${this.describeObject(value)}`);
        } else {
          descriptions.push(`${key} = ${JSON.stringify(value)}`);
        }
      }
    });
    
    return descriptions.join(' AND ');
  }
}

// Usage examples
const filter1 = { department: 'engineering', active: true };
const filter2 = { age: { $gte: 18 } };
const combined = FilterUtils.combineWithAnd(filter1, filter2);

const validation = FilterUtils.validate(combined);
console.log(validation); // { valid: true, errors: [] }

const description = FilterUtils.describe(combined);
console.log(description); // "department = 'engineering' AND active = true AND age $gte 18"
```

---

## 🎯 Real-World Examples

### **E-commerce Product Filtering**

```typescript
class ProductFilter {
  private builder = new AdvancedFilterBuilder();
  
  byCategory(categories: string[]): ProductFilter {
    if (categories.length) {
      this.builder.in('category', categories);
    }
    return this;
  }
  
  byPriceRange(min?: number, max?: number): ProductFilter {
    if (min !== undefined) this.builder.greaterThanOrEqual('price', min);
    if (max !== undefined) this.builder.lessThanOrEqual('price', max);
    return this;
  }
  
  byRating(minRating: number): ProductFilter {
    this.builder.greaterThanOrEqual('rating', minRating);
    return this;
  }
  
  inStock(inStockOnly: boolean = true): ProductFilter {
    if (inStockOnly) {
      this.builder.greaterThan('stock', 0);
    }
    return this;
  }
  
  byBrand(brands: string[]): ProductFilter {
    if (brands.length) {
      this.builder.in('brand', brands);
    }
    return this;
  }
  
  onSale(saleOnly: boolean = true): ProductFilter {
    if (saleOnly) {
      this.builder.exists('salePrice', true)
                  .greaterThan('salePrice', 0);
    }
    return this;
  }
  
  searchText(query: string): ProductFilter {
    if (query.trim()) {
      this.builder.textSearch(query, ['name', 'description', 'tags']);
    }
    return this;
  }
  
  newArrivals(days: number = 30): ProductFilter {
    this.builder.lastDays('createdAt', days);
    return this;
  }
  
  build(): any {
    return this.builder.build();
  }
}

// Usage
const productFilter = new ProductFilter()
  .byCategory(['electronics', 'computers'])
  .byPriceRange(100, 2000)
  .byRating(4.0)
  .inStock(true)
  .searchText('laptop gaming')
  .build();
```

### **User Management Filtering**

```typescript
class UserFilter {
  private builder = new AdvancedFilterBuilder();
  
  byRole(roles: string[]): UserFilter {
    if (roles.length) {
      this.builder.in('role', roles);
    }
    return this;
  }
  
  active(activeOnly: boolean = true): UserFilter {
    this.builder.equals('active', activeOnly);
    return this;
  }
  
  verified(verifiedOnly: boolean = true): UserFilter {
    this.builder.equals('verified', verifiedOnly);
    return this;
  }
  
  registeredAfter(date: Date): UserFilter {
    this.builder.greaterThanOrEqual('registeredAt', date);
    return this;
  }
  
  lastLoginWithin(days: number): UserFilter {
    this.builder.lastDays('lastLoginAt', days);
    return this;
  }
  
  hasPermissions(permissions: string[]): UserFilter {
    this.builder.all('permissions', permissions);
    return this;
  }
  
  byDepartment(departments: string[]): UserFilter {
    if (departments.length) {
      this.builder.in('department', departments);
    }
    return this;
  }
  
  search(query: string): UserFilter {
    if (query.trim()) {
      this.builder.textSearch(query, ['firstName', 'lastName', 'email', 'username']);
    }
    return this;
  }
  
  build(): any {
    return this.builder.build();
  }
}

// Usage
const userFilter = new UserFilter()
  .byRole(['admin', 'moderator'])
  .active(true)
  .verified(true)
  .lastLoginWithin(7)
  .search('john')
  .build();
```

---

## 🎯 Best Practices

### **1. Filter Composition**
```typescript
// ✅ Good: Use FilterBuilder for complex queries
const filter = new FilterBuilder()
  .greaterThan('age', 18)
  .in('department', ['eng', 'design'])
  .exists('email', true)
  .build();

// ❌ Avoid: Manual object construction for complex filters
const filter = {
  age: { $gt: 18 },
  department: { $in: ['eng', 'design'] },
  email: { $exists: true }
};
```

### **2. Performance Optimization**
```typescript
// ✅ Good: Use indexed fields for filtering
const filter = new FilterBuilder()
  .equals('userId', id)           // Indexed field first
  .greaterThan('createdAt', date) // Then other conditions
  .build();

// ✅ Good: Validate filters before use
const validation = FilterUtils.validate(filter);
if (!validation.valid) {
  throw new Error(`Invalid filter: ${validation.errors.join(', ')}`);
}
```

### **3. User Input Handling**
```typescript
// ✅ Good: Sanitize and validate user input
const userFilter = DynamicFilterGenerator.fromObject(userInput, {
  ignoreEmpty: true,
  convertDates: true
});

const validation = FilterUtils.validate(userFilter);
if (validation.valid) {
  // Use filter
} else {
  // Handle validation errors
}
```

---

The Filters module provides a comprehensive MongoDB-style query system for building complex, type-safe filters with excellent performance and developer experience.
