# Complete Decorators Reference

This document provides a comprehensive guide to all available decorators in the @resk/core Validator system.

## Table of Contents

1. [What are Decorators?](#what-are-decorators)
2. [Default Decorators](#default-decorators)
3. [String Decorators](#string-decorators)
4. [Numeric Decorators](#numeric-decorators)
5. [Array Decorators](#array-decorators)
6. [Date Decorators](#date-decorators)
7. [File Decorators](#file-decorators)
8. [Format Decorators](#format-decorators)
9. [Multi-Rule Decorators](#multi-rule-decorators)
10. [Decorator Patterns](#decorator-patterns)

---

## What are Decorators?

Decorators are TypeScript/JavaScript functions that modify class properties to apply validation rules. They make your code more readable and maintainable by declaring validation rules declaratively.

### How They Work

```typescript
class MyClass {
  @IsEmail // Decorator 1
  @IsRequired // Decorator 2
  @MaxLength([50]) // Decorator with parameters
  email: string;
}
```

When you call `Validator.validateTarget(MyClass, data)`, the validator:

1. Reads all decorators applied to properties
2. Executes validation rules in decorator order
3. Collects any validation errors
4. Returns the result

### Decorator Order Matters

```typescript
class User {
  // ✅ Good: Required first, then format
  @IsRequired
  @IsEmail
  email: string;

  // ❌ Bad: Format first, then required
  @IsEmail
  @IsRequired
  email: string;

  // ❌ Wrong: Password without type check
  @MinLength([8]) // What type is this?
  password: string;
}
```

**Best Practice:** Place `@IsRequired` or `@IsOptional` first to establish conditional behavior, then place format/type validators.

---

## Default Decorators

### @IsRequired

Makes a field required - validation fails if the field is empty, null, or undefined.

```typescript
class User {
  @IsRequired
  email: string;

  @IsRequired
  name: string;

  @IsRequired
  password: string;
}

// Valid data
await Validator.validateTarget(User, {
  data: {
    email: "user@example.com",
    name: "John",
    password: "secret123",
  },
});

// Invalid - email is empty
await Validator.validateTarget(User, {
  data: {
    email: "", // ❌ Empty string
    name: "John",
    password: "secret123",
  },
});

// Invalid - name is missing
await Validator.validateTarget(User, {
  data: {
    email: "user@example.com",
    // name missing            ❌ Undefined
    password: "secret123",
  },
});
```

---

### @IsOptional

Marks a field as optional - validation is skipped if value is `undefined`, but required if provided.

```typescript
class UserProfile {
  @IsRequired
  @IsEmail
  email: string;

  @IsOptional
  @IsUrl
  website?: string;

  @IsOptional
  @IsNumber
  age?: number;
}

// All valid
await Validator.validateTarget(UserProfile, {
  data: {
    email: "user@example.com",
    website: "https://example.com",
    age: 30,
  },
});

// Also valid - optional fields can be omitted
await Validator.validateTarget(UserProfile, {
  data: {
    email: "user@example.com",
    // website and age omitted - no error
  },
});

// Invalid - website must be URL if provided
await Validator.validateTarget(UserProfile, {
  data: {
    email: "user@example.com",
    website: "not-a-url", // ❌ Provided but invalid
  },
});
```

**Key Difference from @IsNullable:**

- `@IsOptional`: Only skips on `undefined`
- `@IsNullable`: Skips on both `null` and `undefined`

---

### @IsNullable

Marks a field as nullable - validation is skipped if value is `null` or `undefined`, but validated if provided.

```typescript
class Form {
  @IsRequired
  name: string;

  @IsNullable
  @IsNumber
  age?: number;

  @IsNullable
  @IsDate
  birthDate?: Date;
}

// Valid - nullable fields can be null
await Validator.validateTarget(Form, {
  data: {
    name: "John",
    age: null, // ✅ Null is allowed
    birthDate: null, // ✅ Null is allowed
  },
});

// Valid - nullable fields can be undefined
await Validator.validateTarget(Form, {
  data: {
    name: "John",
    // age and birthDate undefined - no error
  },
});

// Invalid - value provided must be valid
await Validator.validateTarget(Form, {
  data: {
    name: "John",
    age: "thirty", // ❌ Must be number or null
  },
});
```

---

### @IsEmpty

Marks a field as allowing empty strings - validation is skipped if value is empty string, but validated if provided.

```typescript
class Article {
  @IsRequired
  title: string;

  @IsEmpty
  @MaxLength([5000])
  content?: string;

  @IsEmpty
  @MaxLength([200])
  excerpt?: string;
}

// Valid - empty fields can be empty strings
await Validator.validateTarget(Article, {
  data: {
    title: "My Article",
    content: "", // ✅ Empty string is allowed
    excerpt: "", // ✅ Empty string is allowed
  },
});

// Also valid - content can have value
await Validator.validateTarget(Article, {
  data: {
    title: "My Article",
    content: "Long content here...",
    excerpt: "Summary",
  },
});

// Invalid - content too long
await Validator.validateTarget(Article, {
  data: {
    title: "My Article",
    content: "A".repeat(6000), // ❌ Exceeds MaxLength[5000]
  },
});
```

---

## String Decorators

### @IsString

Validates that the field value is a string type.

```typescript
class StringData {
  @IsString
  name: string;

  @IsString
  description: string;
}

// Valid
await Validator.validateTarget(StringData, {
  data: {
    name: "John",
    description: "A valid string",
  },
});

// Invalid - number provided
await Validator.validateTarget(StringData, {
  data: {
    name: 123, // ❌ Number, not string
    description: "OK",
  },
});
```

---

### @IsNonNullString

Validates that the field is a non-null, non-empty string (stricter than @IsRequired).

```typescript
class StrictStringData {
  @IsNonNullString
  title: string;

  @IsNonNullString
  content: string;
}

// Valid - only non-empty strings
await Validator.validateTarget(StrictStringData, {
  data: {
    title: "My Title",
    content: "Content here",
  },
});

// Invalid - empty string
await Validator.validateTarget(StrictStringData, {
  data: {
    title: "", // ❌ Empty string
    content: "OK",
  },
});

// Invalid - null
await Validator.validateTarget(StrictStringData, {
  data: {
    title: null, // ❌ Null
    content: "OK",
  },
});
```

---

### @MinLength([minLength])

Validates that the string has at least the specified length.

```typescript
class UserProfile {
  @IsRequired
  @MinLength([3])
  username: string;

  @IsRequired
  @MinLength([8])
  password: string;

  @IsOptional
  @MinLength([10])
  bio?: string;
}

// Valid
await Validator.validateTarget(UserProfile, {
  data: {
    username: "john_doe", // length 8 >= 3 ✅
    password: "SecurePass123", // length 13 >= 8 ✅
    bio: "This is my bio", // length 12 >= 10 ✅
  },
});

// Invalid - username too short
await Validator.validateTarget(UserProfile, {
  data: {
    username: "ab", // ❌ length 2 < 3
    password: "SecurePass123",
  },
});
```

---

### @MaxLength([maxLength])

Validates that the string does not exceed the specified length.

```typescript
class BlogPost {
  @IsRequired
  @MaxLength([100])
  title: string;

  @IsRequired
  @MaxLength([5000])
  content: string;

  @IsOptional
  @MaxLength([200])
  excerpt?: string;
}

// Valid
await Validator.validateTarget(BlogPost, {
  data: {
    title: "My Blog Post", // length 12 <= 100 ✅
    content: "Article content...", // length < 5000 ✅
  },
});

// Invalid - content too long
await Validator.validateTarget(BlogPost, {
  data: {
    title: "My Blog Post",
    content: "A".repeat(5001), // ❌ length 5001 > 5000
  },
});
```

---

### @MinLength([min]) & @MaxLength([max])

Combining minimum and maximum length constraints.

```typescript
class PasswordPolicy {
  @IsRequired
  @MinLength([8]) // At least 8 characters
  @MaxLength([128]) // At most 128 characters
  password: string;

  @IsRequired
  @MinLength([2])
  @MaxLength([50])
  firstName: string;
}

// Valid
await Validator.validateTarget(PasswordPolicy, {
  data: {
    password: "SecurePassword123", // 8 <= length 19 <= 128 ✅
    firstName: "John", // 2 <= length 4 <= 50 ✅
  },
});

// Invalid - password too short
await Validator.validateTarget(PasswordPolicy, {
  data: {
    password: "Pass1", // ❌ length 5 < 8
    firstName: "John",
  },
});
```

---

## Numeric Decorators

### @IsNumber

Validates that the field value is a number type.

```typescript
class Product {
  @IsRequired
  @IsNumber
  price: number;

  @IsRequired
  @IsNumber
  quantity: number;

  @IsOptional
  @IsNumber
  discount?: number;
}

// Valid
await Validator.validateTarget(Product, {
  data: {
    price: 29.99,
    quantity: 5,
    discount: 10,
  },
});

// Invalid - string number
await Validator.validateTarget(Product, {
  data: {
    price: "29.99", // ❌ String, not number
    quantity: 5,
  },
});
```

---

### @IsInteger

Validates that the field is a whole number (no decimal part).

```typescript
class Inventory {
  @IsRequired
  @IsInteger
  quantity: number;

  @IsRequired
  @IsInteger
  warehouseId: number;
}

// Valid
await Validator.validateTarget(Inventory, {
  data: {
    quantity: 100, // ✅ Whole number
    warehouseId: 5, // ✅ Whole number
  },
});

// Invalid - decimal number
await Validator.validateTarget(Inventory, {
  data: {
    quantity: 100.5, // ❌ Has decimal part
    warehouseId: 5,
  },
});
```

---

### @IsNumberGreaterThan([threshold])

Validates that the number is greater than a specified value.

```typescript
class Discount {
  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  percentage: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([18])
  minimumAge: number;
}

// Valid
await Validator.validateTarget(Discount, {
  data: {
    percentage: 25, // ✅ 25 > 0
    minimumAge: 21, // ✅ 21 > 18
  },
});

// Invalid - at minimum
await Validator.validateTarget(Discount, {
  data: {
    percentage: 0, // ❌ 0 is NOT > 0 (must be exclusive)
    minimumAge: 21,
  },
});
```

---

### @IsNumberGreaterThanOrEqual([threshold])

Validates that the number is >= the specified value.

```typescript
class Pricing {
  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEqual([0])
  basePrice: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEqual([1])
  minimumQuantity: number;
}

// Valid
await Validator.validateTarget(Pricing, {
  data: {
    basePrice: 0, // ✅ 0 >= 0 (inclusive)
    minimumQuantity: 1, // ✅ 1 >= 1
  },
});
```

---

### @IsNumberLessThan([threshold])

Validates that the number is less than a specified value.

```typescript
class Percentage {
  @IsRequired
  @IsNumber
  @IsNumberLessThan([100])
  discount: number;
}

// Valid
await Validator.validateTarget(Percentage, {
  data: {
    discount: 50, // ✅ 50 < 100
  },
});

// Invalid - at limit
await Validator.validateTarget(Percentage, {
  data: {
    discount: 100, // ❌ 100 is NOT < 100
  },
});
```

---

### @IsNumberLessThanOrEqual([threshold])

Validates that the number is <= the specified value.

```typescript
class Percentage {
  @IsRequired
  @IsNumber
  @IsNumberLessThanOrEqual([100])
  discount: number;
}

// Valid
await Validator.validateTarget(Percentage, {
  data: {
    discount: 100, // ✅ 100 <= 100 (inclusive)
  },
});
```

---

### @IsNumberEqual([value])

Validates that the number equals a specific value.

```typescript
class ExactValue {
  @IsRequired
  @IsNumber
  @IsNumberEqual([18])
  votingAge: number;
}

// Valid
await Validator.validateTarget(ExactValue, {
  data: {
    votingAge: 18, // ✅ Equals 18
  },
});

// Invalid - different value
await Validator.validateTarget(ExactValue, {
  data: {
    votingAge: 21, // ❌ Not equal to 18
  },
});
```

---

### @IsNumberDifferentFrom([value])

Validates that the number does NOT equal a specific value.

```typescript
class NotZero {
  @IsRequired
  @IsNumber
  @IsNumberDifferentFrom([0])
  value: number;
}

// Valid
await Validator.validateTarget(NotZero, {
  data: {
    value: 5, // ✅ Not equal to 0
  },
});

// Invalid - equals forbidden value
await Validator.validateTarget(NotZero, {
  data: {
    value: 0, // ❌ Equals 0 (not allowed)
  },
});
```

---

### @IsNumberBetween([min, max])

Validates that the number falls within a range (inclusive).

```typescript
class RangeValue {
  @IsRequired
  @IsNumber
  @IsNumberBetween([0, 100])
  percentage: number;

  @IsRequired
  @IsNumber
  @IsNumberBetween([18, 65])
  workingAge: number;
}

// Valid
await Validator.validateTarget(RangeValue, {
  data: {
    percentage: 50, // ✅ 0 <= 50 <= 100
    workingAge: 30, // ✅ 18 <= 30 <= 65
  },
});

// Valid - at boundaries
await Validator.validateTarget(RangeValue, {
  data: {
    percentage: 0, // ✅ Inclusive on both ends
    workingAge: 65,
  },
});

// Invalid - outside range
await Validator.validateTarget(RangeValue, {
  data: {
    percentage: 150, // ❌ 150 > 100
    workingAge: 30,
  },
});
```

---

### @IsEvenNumber

Validates that the number is even (divisible by 2).

```typescript
class EvenNumbers {
  @IsRequired
  @IsEvenNumber
  evenValue: number;
}

// Valid
await Validator.validateTarget(EvenNumbers, {
  data: {
    evenValue: 4, // ✅ 4 % 2 === 0
  },
});

// Invalid - odd number
await Validator.validateTarget(EvenNumbers, {
  data: {
    evenValue: 3, // ❌ 3 % 2 !== 0
  },
});
```

---

### @IsOddNumber

Validates that the number is odd (not divisible by 2).

```typescript
class OddNumbers {
  @IsRequired
  @IsOddNumber
  oddValue: number;
}

// Valid
await Validator.validateTarget(OddNumbers, {
  data: {
    oddValue: 5, // ✅ 5 % 2 !== 0
  },
});

// Invalid - even number
await Validator.validateTarget(OddNumbers, {
  data: {
    oddValue: 4, // ❌ 4 % 2 === 0
  },
});
```

---

### @IsMultipleOf([divisor])

Validates that the number is a multiple of a specified value.

```typescript
class Multiples {
  @IsRequired
  @IsMultipleOf([5])
  multipleOfFive: number;

  @IsRequired
  @IsMultipleOf([10])
  multipleOfTen: number;
}

// Valid
await Validator.validateTarget(Multiples, {
  data: {
    multipleOfFive: 25, // ✅ 25 % 5 === 0
    multipleOfTen: 100, // ✅ 100 % 10 === 0
  },
});

// Invalid - not a multiple
await Validator.validateTarget(Multiples, {
  data: {
    multipleOfFive: 27, // ❌ 27 % 5 !== 0
    multipleOfTen: 100,
  },
});
```

---

## Array Decorators

### @IsArray

Validates that the field value is an array.

```typescript
class ArrayData {
  @IsRequired
  @IsArray
  tags: string[];

  @IsRequired
  @IsArray
  ids: number[];
}

// Valid
await Validator.validateTarget(ArrayData, {
  data: {
    tags: ["javascript", "typescript"],
    ids: [1, 2, 3],
  },
});

// Valid - empty arrays are valid
await Validator.validateTarget(ArrayData, {
  data: {
    tags: [],
    ids: [],
  },
});

// Invalid - not an array
await Validator.validateTarget(ArrayData, {
  data: {
    tags: "javascript", // ❌ String, not array
    ids: [1, 2, 3],
  },
});
```

---

### @IsArrayMinLength([minLength])

Validates that an array has at least the specified number of items.

```typescript
class MinItems {
  @IsRequired
  @IsArrayMinLength([1])
  tags: string[];

  @IsRequired
  @IsArrayMinLength([2])
  recipients: string[];
}

// Valid
await Validator.validateTarget(MinItems, {
  data: {
    tags: ["one"], // length 1 >= 1 ✅
    recipients: ["user1@ex.com", "user2@ex.com"], // length 2 >= 2 ✅
  },
});

// Invalid - too few items
await Validator.validateTarget(MinItems, {
  data: {
    tags: [], // ❌ length 0 < 1
    recipients: ["user@ex.com"], // ❌ length 1 < 2
  },
});
```

---

### @IsArrayMaxLength([maxLength])

Validates that an array does not exceed the specified number of items.

```typescript
class MaxItems {
  @IsRequired
  @IsArrayMaxLength([5])
  tags: string[];

  @IsRequired
  @IsArrayMaxLength([10])
  items: any[];
}

// Valid
await Validator.validateTarget(MaxItems, {
  data: {
    tags: ["a", "b", "c"], // length 3 <= 5 ✅
    items: [1, 2, 3, 4, 5], // length 5 <= 10 ✅
  },
});

// Invalid - too many items
await Validator.validateTarget(MaxItems, {
  data: {
    tags: ["a", "b", "c", "d", "e", "f"], // ❌ length 6 > 5
    items: [1, 2, 3, 4, 5],
  },
});
```

---

### @IsArrayUnique

Validates that an array contains only unique values (no duplicates).

```typescript
class UniqueItems {
  @IsRequired
  @IsArrayUnique
  tags: string[];

  @IsRequired
  @IsArrayUnique
  ids: number[];
}

// Valid
await Validator.validateTarget(UniqueItems, {
  data: {
    tags: ["javascript", "typescript", "python"], // ✅ All unique
    ids: [1, 2, 3, 4, 5], // ✅ All unique
  },
});

// Invalid - duplicates
await Validator.validateTarget(UniqueItems, {
  data: {
    tags: ["javascript", "javascript"], // ❌ 'javascript' appears twice
    ids: [1, 2, 3, 2], // ❌ 2 appears twice
  },
});
```

---

### @IsArrayAllStrings

Validates that all array items are strings.

```typescript
class StringArray {
  @IsRequired
  @IsArrayAllStrings
  tags: string[];

  @IsRequired
  @IsArrayAllStrings
  colors: string[];
}

// Valid
await Validator.validateTarget(StringArray, {
  data: {
    tags: ["javascript", "typescript"],
    colors: ["red", "blue", "green"],
  },
});

// Invalid - mixed types
await Validator.validateTarget(StringArray, {
  data: {
    tags: ["javascript", 123], // ❌ 123 is not a string
    colors: ["red", "blue"],
  },
});
```

---

### @IsArrayAllNumbers

Validates that all array items are numbers.

```typescript
class NumberArray {
  @IsRequired
  @IsArrayAllNumbers
  scores: number[];

  @IsRequired
  @IsArrayAllNumbers
  temperatures: number[];
}

// Valid
await Validator.validateTarget(NumberArray, {
  data: {
    scores: [95, 87, 92],
    temperatures: [20, 25.5, 18],
  },
});

// Invalid - mixed types
await Validator.validateTarget(NumberArray, {
  data: {
    scores: [95, 87, "92"], // ❌ '92' is not a number
    temperatures: [20, 25.5],
  },
});
```

---

## Date Decorators

### @IsDate

Validates that the field is a valid date.

```typescript
class Dates {
  @IsRequired
  @IsDate
  birthDate: Date;

  @IsRequired
  @IsDate
  eventDate: Date;
}

// Valid
await Validator.validateTarget(Dates, {
  data: {
    birthDate: new Date("2000-01-15"),
    eventDate: new Date("2024-06-20"),
  },
});

// Also valid - accepts date strings
await Validator.validateTarget(Dates, {
  data: {
    birthDate: "2000-01-15",
    eventDate: "2024-06-20T10:30:00Z",
  },
});
```

---

### @IsDateAfter([date])

Validates that a date is after a specified date.

```typescript
class EventDates {
  @IsRequired
  @IsDateAfter(["2024-01-01"])
  startDate: Date;

  @IsRequired
  @IsDateAfter([new Date("2024-06-01")])
  eventDate: Date;
}

// Valid
await Validator.validateTarget(EventDates, {
  data: {
    startDate: new Date("2024-06-15"), // ✅ After 2024-01-01
    eventDate: new Date("2024-12-31"), // ✅ After 2024-06-01
  },
});

// Invalid - not after specified date
await Validator.validateTarget(EventDates, {
  data: {
    startDate: new Date("2023-12-31"), // ❌ Not after 2024-01-01
    eventDate: new Date("2024-12-31"),
  },
});
```

---

### @IsDateBefore([date])

Validates that a date is before a specified date.

```typescript
class Deadlines {
  @IsRequired
  @IsDateBefore(["2024-12-31"])
  submitDate: Date;

  @IsRequired
  @IsDateBefore([new Date()]) // Before today
  pastDate: Date;
}

// Valid
await Validator.validateTarget(Deadlines, {
  data: {
    submitDate: new Date("2024-06-15"), // ✅ Before 2024-12-31
    pastDate: new Date("2024-01-01"), // ✅ Before today
  },
});

// Invalid - not before specified date
await Validator.validateTarget(Deadlines, {
  data: {
    submitDate: new Date("2025-01-01"), // ❌ Not before 2024-12-31
    pastDate: new Date("2099-01-01"),
  },
});
```

---

### @IsDateBetween([startDate, endDate])

Validates that a date falls within a range.

```typescript
class EventValidation {
  @IsRequired
  @IsDateBetween(["2024-01-01", "2024-12-31"])
  eventDate: Date;
}

// Valid
await Validator.validateTarget(EventValidation, {
  data: {
    eventDate: new Date("2024-06-15"), // ✅ Between dates
  },
});

// Invalid - outside range
await Validator.validateTarget(EventValidation, {
  data: {
    eventDate: new Date("2025-01-01"), // ❌ After 2024-12-31
  },
});
```

---

### @IsFutureDate

Validates that a date is in the future.

```typescript
class FutureDates {
  @IsRequired
  @IsFutureDate
  eventDate: Date;

  @IsRequired
  @IsFutureDate
  deadline: Date;
}

// Valid
await Validator.validateTarget(FutureDates, {
  data: {
    eventDate: new Date("2099-12-31"), // ✅ Far in future
    deadline: new Date("2025-12-31"), // ✅ In future
  },
});

// Invalid - past dates
await Validator.validateTarget(FutureDates, {
  data: {
    eventDate: new Date("2020-01-01"), // ❌ Past date
    deadline: new Date(),
  },
});
```

---

### @IsPastDate

Validates that a date is in the past.

```typescript
class PastDates {
  @IsRequired
  @IsPastDate
  birthDate: Date;

  @IsRequired
  @IsPastDate
  completedDate: Date;
}

// Valid
await Validator.validateTarget(PastDates, {
  data: {
    birthDate: new Date("2000-01-15"), // ✅ Past date
    completedDate: new Date("2023-12-31"), // ✅ Past date
  },
});

// Invalid - future dates
await Validator.validateTarget(PastDates, {
  data: {
    birthDate: new Date("2099-12-31"), // ❌ Future date
    completedDate: new Date(),
  },
});
```

---

## File Decorators

### @IsFile

Validates that the field is a file object.

```typescript
class FileUpload {
  @IsRequired
  @IsFile
  document: File;

  @IsRequired
  @IsFile
  avatar: File;
}

// Valid
await Validator.validateTarget(FileUpload, {
  data: {
    document: new File(['content'], 'doc.pdf', { type: 'application/pdf' }),
    avatar: new File(['...'], 'avatar.jpg', { type: 'image/jpeg' })
  }
});

// Invalid - string filename
await Validator.validateTarget(FileUpload, {
  data: {
    document: 'document.pdf',  // ❌ String, not File
    avatar: new File([...])
  }
});
```

---

### @IsMaxFileSize([sizeInBytes])

Validates that a file does not exceed the specified size in bytes.

```typescript
class DocumentUpload {
  @IsRequired
  @IsFile
  @IsMaxFileSize([5242880])  // 5 MB
  document: File;

  @IsRequired
  @IsFile
  @IsMaxFileSize([1048576])  // 1 MB
  avatar: File;
}

// Valid
await Validator.validateTarget(DocumentUpload, {
  data: {
    document: new File(['small content'], 'doc.pdf', { type: 'application/pdf' }),
    avatar: new File(['img'], 'avatar.jpg', { type: 'image/jpeg' })
  }
});

// Invalid - file too large
await Validator.validateTarget(DocumentUpload, {
  data: {
    document: new File([new Array(6000000).fill('a')], 'large.pdf'),  // ❌ > 5 MB
    avatar: new File([...])
  }
});
```

---

### @IsMinFileSize([sizeInBytes])

Validates that a file meets a minimum size requirement.

```typescript
class VideoUpload {
  @IsRequired
  @IsFile
  @IsMinFileSize([102400]) // Minimum 100 KB
  video: File;
}

// Valid
await Validator.validateTarget(VideoUpload, {
  data: {
    video: new File([new Array(200000).fill("a")], "video.mp4"), // ✅ > 100 KB
  },
});
```

---

### @IsFileType([mimeTypes])

Validates that a file has one of the allowed MIME types.

```typescript
class MultiFileUpload {
  @IsRequired
  @IsFile
  @IsFileType(['image/jpeg', 'image/png'])
  avatar: File;

  @IsRequired
  @IsFile
  @IsFileType(['application/pdf', 'application/msword'])
  document: File;
}

// Valid
await Validator.validateTarget(MultiFileUpload, {
  data: {
    avatar: new File([...], 'avatar.jpg', { type: 'image/jpeg' }),      // ✅ JPEG
    document: new File([...], 'doc.pdf', { type: 'application/pdf' })   // ✅ PDF
  }
});

// Invalid - wrong MIME type
await Validator.validateTarget(MultiFileUpload, {
  data: {
    avatar: new File([...], 'avatar.gif', { type: 'image/gif' }),       // ❌ GIF not allowed
    document: new File([...])
  }
});
```

---

### @IsImage

Validates that a file is an image (common image MIME types).

```typescript
class ImageUpload {
  @IsRequired
  @IsFile
  @IsImage
  profilePicture: File;

  @IsOptional
  @IsFile
  @IsImage
  thumbnail?: File;
}

// Valid
await Validator.validateTarget(ImageUpload, {
  data: {
    profilePicture: new File([...], 'pic.jpg', { type: 'image/jpeg' }),
    thumbnail: new File([...], 'thumb.png', { type: 'image/png' })
  }
});

// Invalid - not an image
await Validator.validateTarget(ImageUpload, {
  data: {
    profilePicture: new File([...], 'doc.pdf', { type: 'application/pdf' }),  // ❌ Not image
    thumbnail: undefined
  }
});
```

---

### @IsFileExtension([extensions])

Validates that a file has one of the allowed file extensions.

```typescript
class ExtensionUpload {
  @IsRequired
  @IsFile
  @IsFileExtension(['jpg', 'jpeg', 'png'])
  avatar: File;

  @IsRequired
  @IsFile
  @IsFileExtension(['pdf', 'doc', 'docx'])
  document: File;
}

// Valid
await Validator.validateTarget(ExtensionUpload, {
  data: {
    avatar: new File([...], 'avatar.jpg'),     // ✅ .jpg extension
    document: new File([...], 'doc.pdf')       // ✅ .pdf extension
  }
});

// Invalid - wrong extension
await Validator.validateTarget(ExtensionUpload, {
  data: {
    avatar: new File([...], 'avatar.gif'),     // ❌ .gif not allowed
    document: new File([...])
  }
});
```

---

## Format Decorators

### @IsEmail

Validates that the field is a valid email address.

```typescript
class ContactForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsOptional
  @IsEmail
  alternateEmail?: string;
}

// Valid
await Validator.validateTarget(ContactForm, {
  data: {
    email: "user@example.com",
    alternateEmail: "user2@company.org",
  },
});

// Invalid - malformed email
await Validator.validateTarget(ContactForm, {
  data: {
    email: "invalid@", // ❌ Incomplete
    alternateEmail: "",
  },
});
```

---

### @IsUrl

Validates that the field is a valid URL.

```typescript
class WebsiteInfo {
  @IsRequired
  @IsUrl
  homepage: string;

  @IsRequired
  @IsUrl
  apiEndpoint: string;

  @IsOptional
  @IsUrl
  docsUrl?: string;
}

// Valid
await Validator.validateTarget(WebsiteInfo, {
  data: {
    homepage: "https://example.com",
    apiEndpoint: "https://api.example.com/v1",
    docsUrl: "https://docs.example.com",
  },
});

// Invalid - missing protocol
await Validator.validateTarget(WebsiteInfo, {
  data: {
    homepage: "example.com", // ❌ Missing https://
    apiEndpoint: "https://api.example.com",
  },
});
```

---

### @IsPhoneNumber([countryCodes])

Validates that the field is a valid phone number.

```typescript
class PhoneContact {
  @IsRequired
  @IsPhoneNumber() // Any country
  mainPhone: string;

  @IsRequired
  @IsPhoneNumber(["US", "CA"]) // US or Canada only
  northAmericaPhone: string;

  @IsOptional
  @IsPhoneNumber(["FR"]) // France only
  frenchPhone?: string;
}

// Valid
await Validator.validateTarget(PhoneContact, {
  data: {
    mainPhone: "+33 1 42 68 53 00", // ✅ France
    northAmericaPhone: "(123) 456-7890", // ✅ US format
    frenchPhone: "01 42 68 53 00", // ✅ France
  },
});

// Invalid - wrong country
await Validator.validateTarget(PhoneContact, {
  data: {
    mainPhone: "+33 1 42 68 53 00",
    northAmericaPhone: "+33 1 42 68 53 00", // ❌ France number, US/CA required
    frenchPhone: "+1 234 567 8900",
  },
});
```

---

### @IsEmailOrPhone

Validates that the field is either a valid email or a valid phone number.

```typescript
class FlexibleContact {
  @IsRequired
  @IsEmailOrPhone
  contact: string;
}

// Valid
await Validator.validateTarget(FlexibleContact, {
  data: {
    contact: "user@example.com", // ✅ Email
  },
});

// Also valid
await Validator.validateTarget(FlexibleContact, {
  data: {
    contact: "+1 234 567 8900", // ✅ Phone
  },
});

// Invalid - neither email nor phone
await Validator.validateTarget(FlexibleContact, {
  data: {
    contact: "invalid-contact", // ❌ Not email or phone
  },
});
```

---

### @IsFileName

Validates that the field is a valid file name.

```typescript
class FileReference {
  @IsRequired
  @IsFileName
  filename: string;
}

// Valid
await Validator.validateTarget(FileReference, {
  data: {
    filename: "document.pdf", // ✅ Valid filename
  },
});

// Invalid - contains path separators
await Validator.validateTarget(FileReference, {
  data: {
    filename: "/path/to/file.pdf", // ❌ Contains path
  },
});
```

---

### @IsUUID

Validates that the field is a valid UUID.

```typescript
class EntityWithId {
  @IsRequired
  @IsUUID
  id: string;

  @IsRequired
  @IsUUID
  correlationId: string;
}

// Valid
await Validator.validateTarget(EntityWithId, {
  data: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    correlationId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  },
});

// Invalid - malformed UUID
await Validator.validateTarget(EntityWithId, {
  data: {
    id: "not-a-uuid", // ❌ Invalid format
    correlationId: "550e8400-e29b-41d4-a716", // ❌ Too short
  },
});
```

---

### @IsJSON

Validates that the field is valid JSON.

```typescript
class MetadataField {
  @IsRequired
  @IsJSON
  metadata: string;
}

// Valid
await Validator.validateTarget(MetadataField, {
  data: {
    metadata: '{"key": "value", "count": 42}', // ✅ Valid JSON
  },
});

// Invalid - malformed JSON
await Validator.validateTarget(MetadataField, {
  data: {
    metadata: "{key: value}", // ❌ Unquoted keys
  },
});
```

---

### @IsBase64

Validates that the field is valid Base64 encoded data.

```typescript
class EncodedData {
  @IsRequired
  @IsBase64
  encodedContent: string;
}

// Valid
await Validator.validateTarget(EncodedData, {
  data: {
    encodedContent: "aGVsbG8gd29ybGQ=", // ✅ "hello world" in Base64
  },
});

// Invalid - not Base64
await Validator.validateTarget(EncodedData, {
  data: {
    encodedContent: "not-base64!", // ❌ Invalid Base64
  },
});
```

---

### @IsHexColor

Validates that the field is a valid hexadecimal color code.

```typescript
class ColorScheme {
  @IsRequired
  @IsHexColor
  primaryColor: string;

  @IsRequired
  @IsHexColor
  secondaryColor: string;
}

// Valid
await Validator.validateTarget(ColorScheme, {
  data: {
    primaryColor: "#FF0000", // ✅ 6-digit with #
    secondaryColor: "#00FF00", // ✅ Red and green
  },
});

// Also valid
await Validator.validateTarget(ColorScheme, {
  data: {
    primaryColor: "FF0000", // ✅ 6-digit without #
    secondaryColor: "F0F", // ✅ 3-digit short form
  },
});

// Invalid - not valid hex
await Validator.validateTarget(ColorScheme, {
  data: {
    primaryColor: "#GGGGGG", // ❌ G is not valid hex
    secondaryColor: "#FF", // ❌ Too few digits
  },
});
```

---

### @IsCreditCard

Validates that the field is a valid credit card number (Luhn algorithm).

```typescript
class PaymentInfo {
  @IsRequired
  @IsCreditCard
  cardNumber: string;
}

// Valid (test cards)
await Validator.validateTarget(PaymentInfo, {
  data: {
    cardNumber: "4111111111111111", // ✅ Visa test card
  },
});

// Invalid - bad checksum
await Validator.validateTarget(PaymentInfo, {
  data: {
    cardNumber: "1234567890123456", // ❌ Invalid checksum
  },
});
```

---

### @IsIP([versions])

Validates that the field is a valid IP address.

```typescript
class NetworkAddress {
  @IsRequired
  @IsIP() // Any IP version
  ipAddress: string;

  @IsRequired
  @IsIP(["4"]) // IPv4 only
  ipv4: string;

  @IsOptional
  @IsIP(["6"]) // IPv6 only
  ipv6?: string;
}

// Valid
await Validator.validateTarget(NetworkAddress, {
  data: {
    ipAddress: "192.168.1.1",
    ipv4: "8.8.8.8",
    ipv6: "2001:0db8:85a3::8a2e:0370:7334",
  },
});

// Invalid - wrong version
await Validator.validateTarget(NetworkAddress, {
  data: {
    ipAddress: "192.168.1.1",
    ipv4: "2001::1", // ❌ IPv6, but IPv4 required
    ipv6: "192.168.1.1",
  },
});
```

---

### @IsMACAddress

Validates that the field is a valid MAC address.

```typescript
class DeviceInfo {
  @IsRequired
  @IsMACAddress
  macAddress: string;
}

// Valid
await Validator.validateTarget(DeviceInfo, {
  data: {
    macAddress: "00:1A:2B:3C:4D:5E", // ✅ Colon-separated
  },
});

// Also valid
await Validator.validateTarget(DeviceInfo, {
  data: {
    macAddress: "00-1A-2B-3C-4D-5E", // ✅ Hyphen-separated
  },
});

// Invalid - bad format
await Validator.validateTarget(DeviceInfo, {
  data: {
    macAddress: "00:1A:2B:3C:4D", // ❌ Too few octets
  },
});
```

---

### @IsBoolean

Validates that the field is a boolean type.

```typescript
class Preferences {
  @IsRequired
  @IsBoolean
  newsletter: boolean;

  @IsRequired
  @IsBoolean
  notifications: boolean;
}

// Valid
await Validator.validateTarget(Preferences, {
  data: {
    newsletter: true,
    notifications: false,
  },
});

// Invalid - truthy not boolean
await Validator.validateTarget(Preferences, {
  data: {
    newsletter: 1, // ❌ Number, not boolean
    notifications: "yes", // ❌ String, not boolean
  },
});
```

---

## Multi-Rule Decorators

### @OneOf([rules])

Validates that the field satisfies at least one of the provided rules.

```typescript
import { OneOf } from "@resk/core/validator";

class ContactInfo {
  // Accept email OR phone OR custom ID
  @OneOf(["Email", "PhoneNumber", "UUID"])
  contact: string;

  // Accept email OR phone
  @OneOf([
    "Email",
    ({ value }) => /^\+?[\d\s\-\(\)]+$/.test(value) || "Invalid format",
  ])
  primaryContact: string;
}

// Valid - email
await Validator.validateTarget(ContactInfo, {
  data: {
    contact: "user@example.com",
  },
});

// Valid - phone
await Validator.validateTarget(ContactInfo, {
  data: {
    contact: "+1-234-567-8900",
  },
});

// Invalid - none match
await Validator.validateTarget(ContactInfo, {
  data: {
    contact: "invalid-input", // ❌ Not email, phone, or UUID
  },
});
```

---

### @AllOf([rules])

Validates that the field satisfies ALL of the provided rules.

```typescript
import { AllOf } from "@resk/core/validator";

class StrongPassword {
  // Password must be at least 8 chars AND not contain spaces
  @AllOf([
    "MinLength[8]",
    ({ value }) => !/\s/.test(value) || "Cannot contain spaces",
  ])
  password: string;

  // Must be email AND not @admin.com
  @AllOf([
    "Email",
    ({ value }) => !value.endsWith("@admin.com") || "Admin emails not allowed",
  ])
  email: string;
}

// Valid
await Validator.validateTarget(StrongPassword, {
  data: {
    password: "SecurePass123",
    email: "user@example.com",
  },
});

// Invalid - password too short
await Validator.validateTarget(StrongPassword, {
  data: {
    password: "Short1", // ❌ Less than 8 chars
    email: "user@example.com",
  },
});
```

---

### @ArrayOf([rules])

Validates that all items in an array satisfy the provided rules.

```typescript
import { ArrayOf } from "@resk/core/validator";

class EmailList {
  // All items must be valid emails
  @ArrayOf(["Email"])
  recipients: string[];

  // All items must be positive integers
  @ArrayOf(["IsInteger", "NumberGreaterThan[0]"])
  positiveIds: number[];
}

// Valid
await Validator.validateTarget(EmailList, {
  data: {
    recipients: ["user1@example.com", "user2@example.com"],
    positiveIds: [1, 2, 3, 4],
  },
});

// Invalid - invalid email in list
await Validator.validateTarget(EmailList, {
  data: {
    recipients: ["user@example.com", "invalid@"], // ❌ Second item invalid
    positiveIds: [1, 2, 3, 4],
  },
});
```

---

## Decorator Patterns

### Pattern 1: Basic Required Fields

```typescript
class BasicForm {
  @IsRequired
  @IsString
  name: string;

  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @MinLength([8])
  password: string;
}
```

### Pattern 2: Optional with Format Validation

```typescript
class FlexibleForm {
  @IsRequired
  @IsString
  name: string;

  @IsOptional // Can be omitted
  @IsEmail // But if provided, must be email
  email?: string;

  @IsNullable // Can be null or undefined
  @IsNumber
  age?: number;
}
```

### Pattern 3: Complex Constraints

```typescript
class ComplexForm {
  @IsRequired
  @MinLength([3])
  @MaxLength([50])
  @IsNonNullString
  username: string;

  @IsRequired
  @MinLength([8])
  @MaxLength([128])
  @AllOf(["MinLength[8]", "IsNonNullString"])
  password: string;

  @IsOptional
  @IsEmail
  email?: string;
}
```

### Pattern 4: Arrays with Validation

```typescript
class ArrayForm {
  @IsRequired
  @IsArray
  @IsArrayMinLength([1])
  @IsArrayMaxLength([10])
  @IsArrayUnique
  tags: string[];

  @IsRequired
  @IsArray
  @IsArrayAllNumbers
  @ArrayOf(["NumberBetween[0,100]"])
  scores: number[];
}
```

### Pattern 5: Nested Objects

```typescript
class Address {
  @IsRequired
  @IsString
  street: string;

  @IsRequired
  @IsString
  city: string;
}

class User {
  @IsRequired
  @IsString
  name: string;

  @ValidateNested([Address])
  address: Address;
}
```

### Pattern 6: Multi-Option Fields

```typescript
class FlexibleInput {
  // Accept email OR phone
  @OneOf(["Email", "PhoneNumber"])
  contact: string;

  // Either UUID or custom ID format
  @OneOf(["UUID", ({ value }) => value.startsWith("CUSTOM-")])
  identifier: string;
}
```

---

For more examples and advanced usage, see [03-ADVANCED_USAGE.md](03-ADVANCED_USAGE.md) and [05-EXAMPLES.md](05-EXAMPLES.md).
