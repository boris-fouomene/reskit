# Complete Validation Rules Reference

This document provides a comprehensive guide to all 40+ built-in validation rules available in the @resk/core Validator system.

## Table of Contents

1. [Default Rules](#default-rules)
2. [String Rules](#string-rules)
3. [Numeric Rules](#numeric-rules)
4. [Array Rules](#array-rules)
5. [Date Rules](#date-rules)
6. [File Rules](#file-rules)
7. [Format Rules](#format-rules)
8. [Multi-Rule Validators](#multi-rule-validators)
9. [Rule Organization](#rule-organization)

---

## Default Rules

These rules control validation behavior and conditional validation logic.

### Required (IsRequired)

Validates that a value is present and not empty.

**Decorator:**

```typescript
@IsRequired
email: string;
```

**Single Value:**

```typescript
await Validator.validate({
  value: "some value",
  rules: ["Required"],
});
```

**Behavior:**

- Returns `true` if value is not empty/null/undefined
- Returns error message if value is falsy
- Fails on: `""`, `0`, `false`, `null`, `undefined`, `[]`
- Passes on: `"any text"`, `1`, `true`, `[1]`, `{}`

---

### Optional (IsOptional)

Marks a field as sometimes validated - skips validation if value is `undefined`.

**Decorator:**

```typescript
@IsOptional
@IsEmail
website?: string;
```

**Behavior:**

- Skips remaining rules if value is `undefined`
- Still validates if value is `null`, `""`, or `0`
- Allows field to be completely omitted from data object

**Use When:** Field is truly optional in your form/API

---

### Nullable (IsNullable)

Marks a field as nullable - skips validation if value is `null` or `undefined`.

**Decorator:**

```typescript
@IsNullable
@IsNumber
age?: number;
```

**Behavior:**

- Skips remaining rules if value is `null` or `undefined`
- Still validates if value is `""` or `0`
- Allows field to be `null`, `undefined`, or valid value

**Use When:** Field can be explicitly set to `null`

---

### Empty (IsEmpty)

Marks a field as allowing empty strings - skips validation if value is empty string.

**Decorator:**

```typescript
@IsEmpty
@MaxLength([1000])
notes?: string;
```

**Behavior:**

- Skips remaining rules if value is empty string `""`
- Still validates if value is `null`, `undefined`, or whitespace
- Allows field to be empty but validates non-empty values

**Use When:** Field can be blank but should be validated when provided

---

## String Rules

Rules for validating string values and their properties.

### MinLength (IsMinLength or @MinLength)

Validates that a string has at least the specified minimum length.

**Decorator:**

```typescript
@MinLength([3])
username: string;

@MinLength([8])
password: string;
```

**Single Value:**

```typescript
await Validator.validate({
  value: "hello",
  rules: ["MinLength[3]"],
});
```

**Parameters:**

- `minLength: number` - Minimum required length

**Examples:**

```typescript
// ✅ Pass
"hello"; // length 5 >= 3
"12345"; // length 5 >= 3

// ❌ Fail
"ab"; // length 2 < 3
""; // length 0 < 3
```

---

### MaxLength (IsMaxLength or @MaxLength)

Validates that a string does not exceed the specified maximum length.

**Decorator:**

```typescript
@MaxLength([50])
title: string;

@MaxLength([100])
description: string;
```

**Single Value:**

```typescript
await Validator.validate({
  value: "test",
  rules: ["MaxLength[100]"],
});
```

**Parameters:**

- `maxLength: number` - Maximum allowed length

---

### Length

Validates that a string has an exact length or falls within a length range.

**Decorator:**

```typescript
@Validator.buildPropertyDecorator(['Length[5]'])      // Exact length 5
@Validator.buildPropertyDecorator(['Length[3,10]'])   // Between 3-10
value: string;
```

**Parameters:**

- `minLength: number` - Minimum or exact length
- `maxLength?: number` - Maximum length (optional, if not provided uses minLength as exact)

---

### NonNullString (IsNonNullString)

Validates that a value is a non-null, non-empty string (stricter than Required).

**Decorator:**

```typescript
@IsNonNullString
title: string;

@IsNonNullString
content: string;
```

**Behavior:**

- Must be a `string` type
- Must not be empty
- Must not be only whitespace
- Fails on: `null`, `undefined`, `""`, `"   "`, `123`, etc.
- Passes on: `"hello"`, `"0"`, etc.

---

### String (IsString)

Validates that a value is a string type.

**Decorator:**

```typescript
@IsString
name: string;
```

**Behavior:**

- Must be a string (not number, boolean, object, etc.)
- Empty strings `""` are considered valid strings
- Fails on: `123`, `true`, `null`, `undefined`, `{}`

---

## Numeric Rules

Rules for validating numeric values and comparisons.

### Number (IsNumber)

Validates that a value is a number type.

**Decorator:**

```typescript
@IsNumber
age: number;

@IsNumber
price: number;
```

**Behavior:**

- Must be a numeric type
- Fails on: `"123"`, `true`, `null`, `NaN`
- Passes on: `0`, `1`, `-5`, `3.14`, `Infinity`

---

### Integer (IsInteger)

Validates that a value is an integer (whole number with no decimal part).

**Decorator:**

```typescript
@IsInteger
quantity: number;

@IsInteger
age: number;
```

**Behavior:**

- Must be a number
- Must have no decimal part
- Fails on: `3.14`, `1.5`, `"5"`
- Passes on: `0`, `5`, `-100`

---

### NumberGreaterThan (IsNumberGreaterThan)

Validates that a number is greater than a specified value.

**Decorator:**

```typescript
@IsNumberGreaterThan([0])
price: number;

@IsNumberGreaterThan([18])
age: number;
```

**Single Value:**

```typescript
await Validator.validate({
  value: 25,
  rules: ["NumberGreaterThan[18]"],
});
```

**Parameters:**

- `threshold: number` - Minimum exclusive bound

**Examples:**

```typescript
// ✅ Pass: value > threshold
25 > 18;

// ❌ Fail: value <= threshold
18 > 18;
```

---

### NumberGreaterThanOrEqual (IsNumberGreaterThanOrEqual)

Validates that a number is greater than or equal to a specified value.

**Decorator:**

```typescript
@IsNumberGreaterThanOrEqual([0])
discount: number;

@IsNumberGreaterThanOrEqual([1])
quantity: number;
```

**Parameters:**

- `threshold: number` - Minimum inclusive bound

---

### NumberLessThan (IsNumberLessThan)

Validates that a number is less than a specified value.

**Decorator:**

```typescript
@IsNumberLessThan([100])
percentage: number;

@IsNumberLessThan([age])
maxAge: number;
```

**Parameters:**

- `threshold: number` - Maximum exclusive bound

---

### NumberLessThanOrEqual (IsNumberLessThanOrEqual)

Validates that a number is less than or equal to a specified value.

**Decorator:**

```typescript
@IsNumberLessThanOrEqual([100])
percentage: number;

@IsNumberLessThanOrEqual([65])
maxAge: number;
```

**Parameters:**

- `threshold: number` - Maximum inclusive bound

---

### NumberEqual (IsNumberEqual)

Validates that a number equals a specific value.

**Decorator:**

```typescript
@IsNumberEqual([18])
exactAge: number;

@IsNumberEqual([0])
neutralValue: number;
```

**Parameters:**

- `value: number` - Exact value to match

---

### NumberIsDifferentFrom (IsNumberDifferentFrom)

Validates that a number does NOT equal a specific value.

**Decorator:**

```typescript
@IsNumberDifferentFrom([0])
nonZeroValue: number;
```

**Parameters:**

- `value: number` - Value to exclude

---

### NumberBetween (IsNumberBetween)

Validates that a number falls within a specified range (inclusive).

**Decorator:**

```typescript
@IsNumberBetween([0, 100])
percentage: number;

@IsNumberBetween([18, 65])
workingAge: number;
```

**Single Value:**

```typescript
await Validator.validate({
  value: 50,
  rules: ["NumberBetween[0,100]"],
});
```

**Parameters:**

- `min: number` - Minimum value (inclusive)
- `max: number` - Maximum value (inclusive)

**Examples:**

```typescript
// ✅ Pass: min <= value <= max
50 in [0, 100];
0 in [0, 100];
100 in
  [0, 100] -
    // ❌ Fail: value outside range
    1 in
  [0, 100];
101 in [0, 100];
```

---

### EvenNumber (IsEvenNumber)

Validates that a number is even (divisible by 2 with no remainder).

**Decorator:**

```typescript
@IsEvenNumber
evenValue: number;
```

**Behavior:**

- Must be a whole number
- Must be divisible by 2
- Fails on: `1`, `3`, `5`, `2.5`
- Passes on: `0`, `2`, `4`, `-6`

---

### OddNumber (IsOddNumber)

Validates that a number is odd (not divisible by 2).

**Decorator:**

```typescript
@IsOddNumber
oddValue: number;
```

**Behavior:**

- Must be a whole number
- Must NOT be divisible by 2
- Fails on: `0`, `2`, `4`
- Passes on: `1`, `3`, `5`, `-7`

---

### MultipleOf (IsMultipleOf)

Validates that a number is a multiple of a specified value.

**Decorator:**

```typescript
@IsMultipleOf([5])
multiple: number;

@IsMultipleOf([10])
roundNumber: number;
```

**Parameters:**

- `divisor: number` - The divisor to check

**Examples:**

```typescript
// ✅ Pass: number is multiple of divisor
10 % 5 === 0;
30 % 10 === 0;

// ❌ Fail: number is not a multiple
7 % 5 !== 0;
25 % 10 !== 0;
```

---

## Array Rules

Rules for validating arrays and their contents.

### Array (IsArray)

Validates that a value is an array.

**Decorator:**

```typescript
@IsArray
tags: string[];

@IsArray
items: unknown[];
```

**Single Value:**

```typescript
await Validator.validate({
  value: [1, 2, 3],
  rules: ["Array"],
});
```

**Behavior:**

- Must be an actual array `[]`
- Empty arrays `[]` are considered valid
- Fails on: `"string"`, `123`, `null`, `{}`
- Passes on: `[]`, `[1,2,3]`, `[{}]`

---

### ArrayMinLength (IsArrayMinLength)

Validates that an array has at least the specified minimum number of items.

**Decorator:**

```typescript
@ArrayMinLength([1])
tags: string[];

@ArrayMinLength([2])
addresses: Address[];
```

**Parameters:**

- `minLength: number` - Minimum required items

---

### ArrayMaxLength (IsArrayMaxLength)

Validates that an array does not exceed the specified maximum number of items.

**Decorator:**

```typescript
@ArrayMaxLength([5])
tags: string[];

@ArrayMaxLength([10])
images: File[];
```

**Parameters:**

- `maxLength: number` - Maximum allowed items

---

### ArrayLength

Validates that an array has an exact length or falls within a length range.

**Decorator:**

```typescript
@Validator.buildPropertyDecorator(['ArrayLength[3]'])      // Exact 3 items
@Validator.buildPropertyDecorator(['ArrayLength[1,5]'])    // 1-5 items
items: any[];
```

**Parameters:**

- `minLength: number` - Minimum or exact length
- `maxLength?: number` - Maximum length (optional)

---

### ArrayUnique (IsArrayUnique)

Validates that an array contains only unique values (no duplicates).

**Decorator:**

```typescript
@IsArrayUnique
uniqueIds: number[];

@IsArrayUnique
tags: string[];
```

**Behavior:**

- All values must be unique
- Uses strict equality `===` for comparison
- Fails on: `[1, 1, 2]`, `["a", "a"]`
- Passes on: `[1, 2, 3]`, `["a", "b"]`, `[]`

---

### ArrayAllStrings (IsArrayAllStrings)

Validates that an array contains only string values.

**Decorator:**

```typescript
@IsArrayAllStrings
tags: string[];

@IsArrayAllStrings
colors: string[];
```

**Behavior:**

- Every item must be a string
- Empty arrays pass
- Fails on: `[1, "a"]`, `[true]`, `["a", null]`
- Passes on: `[]`, `["a", "b"]`, `[""]`

---

### ArrayAllNumbers (IsArrayAllNumbers)

Validates that an array contains only numeric values.

**Decorator:**

```typescript
@IsArrayAllNumbers
scores: number[];

@IsArrayAllNumbers
values: number[];
```

**Behavior:**

- Every item must be a number
- Fails on: `[1, "2"]`, `[true]`, `[1, null]`
- Passes on: `[]`, `[1, 2]`, `[0, -5, 3.14]`

---

## Date Rules

Rules for validating date values and temporal comparisons.

### Date (IsDate)

Validates that a value is a valid date.

**Decorator:**

```typescript
@IsDate
birthDate: Date;

@IsDate
eventDate: Date;
```

**Behavior:**

- Accepts `Date` objects
- Accepts valid date strings: `"2024-01-15"`, `"2024-01-15T10:30:00Z"`
- Accepts valid timestamps: `1705324200000`
- Fails on: `"invalid-date"`, `"abc"`, invalid timestamp

---

### DateAfter (IsDateAfter)

Validates that a date is after a specified date.

**Decorator:**

```typescript
@IsDateAfter(['2024-01-01'])
startDate: Date;

@IsDateAfter([new Date('2020-01-01')])
workStartDate: Date;
```

**Parameters:**

- `date: string | Date` - The minimum date (exclusive)

**Examples:**

```typescript
// ✅ Pass
new Date("2024-06-15") > new Date("2024-01-01");

// ❌ Fail
new Date("2023-12-31") > new Date("2024-01-01");
```

---

### DateBefore (IsDateBefore)

Validates that a date is before a specified date.

**Decorator:**

```typescript
@IsDateBefore(['2024-12-31'])
endDate: Date;

@IsDateBefore([new Date()])  // Must be in the past
pastDate: Date;
```

**Parameters:**

- `date: string | Date` - The maximum date (exclusive)

---

### DateBetween (IsDateBetween)

Validates that a date falls within a specified range.

**Decorator:**

```typescript
@IsDateBetween(['2024-01-01', '2024-12-31'])
eventDate: Date;

@IsDateBetween([new Date('2020-01-01'), new Date('2025-01-01')])
dateInRange: Date;
```

**Parameters:**

- `startDate: string | Date` - Minimum date (inclusive)
- `endDate: string | Date` - Maximum date (inclusive)

---

### SameDate (IsSameDate)

Validates that a date is the same as a specified date (same day, ignoring time).

**Decorator:**

```typescript
@IsSameDate(['2024-01-15'])
specificDate: Date;
```

**Parameters:**

- `date: string | Date` - The date to match

---

### FutureDate (IsFutureDate)

Validates that a date is in the future (later than current date/time).

**Decorator:**

```typescript
@IsFutureDate
eventDate: Date;

@IsFutureDate
deadline: Date;
```

**Examples:**

```typescript
// ✅ Pass
new Date("2099-12-31"); // Far in the future

// ❌ Fail
new Date("2020-01-01"); // Past date
new Date(); // Current date
```

---

### PastDate (IsPastDate)

Validates that a date is in the past (earlier than current date/time).

**Decorator:**

```typescript
@IsPastDate
birthDate: Date;

@IsPastDate
completedDate: Date;
```

**Examples:**

```typescript
// ✅ Pass
new Date("2020-01-01"); // Past date

// ❌ Fail
new Date("2099-12-31"); // Future date
```

---

## File Rules

Rules for validating file objects and file properties.

### File (IsFile)

Validates that a value is a file object.

**Decorator:**

```typescript
@IsFile
document: File;

@IsFile
avatar: File;
```

**Behavior:**

- Accepts `File` objects (from file inputs)
- Accepts file-like objects with `size`, `type`, `name`, or `mimetype` properties
- Works with: Browser File API, Multer uploads, FormData
- Fails on: `"filename.txt"`, `null`, plain objects without file properties

---

### MaxFileSize (IsMaxFileSize)

Validates that a file does not exceed a specified file size in bytes.

**Decorator:**

```typescript
@IsMaxFileSize([5242880])  // 5 MB in bytes
document: File;

@IsMaxFileSize([1048576])  // 1 MB
avatar: File;
```

**Parameters:**

- `maxSize: number` - Maximum file size in bytes

**Size Conversions:**

- 1 KB = 1024 bytes
- 1 MB = 1024 \* 1024 = 1,048,576 bytes
- 5 MB = 5,242,880 bytes
- 10 MB = 10,485,760 bytes

---

### MinFileSize (IsMinFileSize)

Validates that a file meets a specified minimum file size in bytes.

**Decorator:**

```typescript
@IsMinFileSize([102400])  // Minimum 100 KB
document: File;
```

**Parameters:**

- `minSize: number` - Minimum file size in bytes

---

### FileType (IsFileType)

Validates that a file has one of the specified MIME types.

**Decorator:**

```typescript
@IsFileType(['image/jpeg', 'image/png'])
avatar: File;

@IsFileType(['application/pdf', 'application/msword'])
document: File;
```

**Parameters:**

- `allowedMimeTypes: string[]` - Array of accepted MIME types

**Common MIME Types:**

```
Images:  image/jpeg, image/png, image/gif, image/webp, image/svg+xml
Documents: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
Videos: video/mp4, video/webm, video/quicktime
Audio: audio/mpeg, audio/wav, audio/ogg
Archives: application/zip, application/x-rar-compressed, application/gzip
```

---

### Image (IsImage)

Validates that a file is an image file (common image MIME types).

**Decorator:**

```typescript
@IsImage
profilePicture: File;

@IsImage
productImage: File;
```

**Accepted Types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`

---

### FileExtension (IsFileExtension)

Validates that a file has one of the specified file extensions.

**Decorator:**

```typescript
@IsFileExtension(['jpg', 'jpeg', 'png', 'gif'])
avatar: File;

@IsFileExtension(['pdf', 'doc', 'docx'])
document: File;
```

**Parameters:**

- `allowedExtensions: string[]` - Array of allowed extensions (without dots)

---

## Format Rules

Rules for validating formatted data like emails, URLs, and special formats.

### Email (IsEmail)

Validates that a value is a properly formatted email address.

**Decorator:**

```typescript
@IsRequired
@IsEmail
email: string;

@IsEmail
alternateEmail?: string;
```

**Single Value:**

```typescript
await Validator.validate({
  value: "user@example.com",
  rules: ["Email"],
});
```

**Examples:**

```typescript
// ✅ Pass
"user@example.com";
"john.doe+tag@company.org";
"info@sub.example.co.uk";

// ❌ Fail
"invalid@";
"@example.com";
"user@example";
"user example@com";
```

---

### Url (IsUrl)

Validates that a value is a properly formatted URL.

**Decorator:**

```typescript
@IsUrl
homepage: string;

@IsUrl
apiEndpoint?: string;
```

**Examples:**

```typescript
// ✅ Pass
"https://example.com";
"http://sub.example.com/path/to/resource";
"https://example.com:8080/path?query=value";

// ❌ Fail
"example.com"; // Missing protocol
"ftp://invalid.com"; // Invalid protocol
"http://"; // Missing domain
```

---

### PhoneNumber (IsPhoneNumber)

Validates that a value is a properly formatted phone number.

**Decorator:**

```typescript
@IsPhoneNumber()                    // Default country
@IsPhoneNumber(['US'])              // US phone numbers
@IsPhoneNumber(['FR', 'CA'])        // France and Canada
phone: string;
```

**Parameters:**

- `countryCodes?: ICountryCode[]` - Array of ISO country codes (optional)

**Supported Formats:**

```
International:  +1-234-567-8900
US:             (123) 456-7890, 123-456-7890, 1234567890
Various:        +33 1 42 68 53 00, 0142685300
```

---

### EmailOrPhoneNumber (IsEmailOrPhone)

Validates that a value is either a valid email address OR a valid phone number.

**Decorator:**

```typescript
@IsEmailOrPhone
contact: string;
```

**Examples:**

```typescript
// ✅ Pass
"user@example.com";
"+1-234-567-8900";
"(123) 456-7890";

// ❌ Fail
"invalid-contact";
```

---

### FileName (IsFileName)

Validates that a value is a valid file name format.

**Decorator:**

```typescript
@IsFileName
filename: string;
```

**Behavior:**

- Must be a valid file name (no invalid path characters)
- Must have reasonable length
- Fails on: `/path/to/file.txt` (contains path separators), empty string

---

### UUID (IsUUID)

Validates that a value is a valid UUID (version 1, 3, 4, or 5).

**Decorator:**

```typescript
@IsUUID
id: string;

@IsUUID
correlationId: string;
```

**Examples:**

```typescript
// ✅ Pass
"550e8400-e29b-41d4-a716-446655440000";
"6ba7b810-9dad-11d1-80b4-00c04fd430c8";

// ❌ Fail
"not-a-uuid";
"550e8400-e29b-41d4-a716";
```

---

### JSON (IsJSON)

Validates that a value is valid JSON.

**Decorator:**

```typescript
@IsJSON
metadata: string;
```

**Behavior:**

- Must be a valid JSON string
- Fails on: `"not json"`, `{key: value}` (without quotes), malformed JSON

**Examples:**

```typescript
// ✅ Pass
'{"key": "value"}';
'["item1", "item2"]';
"null";
"true";
"42";

// ❌ Fail
"{key: value}"; // Unquoted keys
"{'key': 'value'}"; // Single quotes
"undefined";
```

---

### Base64 (IsBase64)

Validates that a value is valid Base64 encoded data.

**Decorator:**

```typescript
@IsBase64
encodedData: string;
```

**Examples:**

```typescript
// ✅ Pass
"aGVsbG8gd29ybGQ="; // "hello world"
"SGVsbG8gV29ybGQh"; // "Hello World!"

// ❌ Fail
"not base64!";
"###invalid###";
```

---

### HexColor (IsHexColor)

Validates that a value is a valid hexadecimal color code.

**Decorator:**

```typescript
@IsHexColor
primaryColor: string;

@IsHexColor
backgroundColor: string;
```

**Formats:**

```typescript
// ✅ Pass
"#FF0000"; // 6-digit with hash
"FF0000"; // 6-digit without hash
"#F00"; // 3-digit with hash
"F00"; // 3-digit without hash

// ❌ Fail
"#GGGGGG"; // Invalid hex digits
"#FF"; // Not enough digits
"rgb(255,0,0)"; // Different format
```

---

### CreditCard (IsCreditCard)

Validates that a value is a valid credit card number using Luhn algorithm.

**Decorator:**

```typescript
@IsCreditCard
cardNumber: string;
```

**Behavior:**

- Must pass Luhn checksum validation
- Accepts most credit card formats
- Fails on: invalid checksums, wrong length, non-numeric

**Examples:**

```typescript
// ✅ Pass (test cards)
"4111111111111111"; // Visa test card
"5555555555554444"; // Mastercard test card

// ❌ Fail
"1234567890123456"; // Invalid checksum
"12345"; // Too short
```

---

### IP (IsIP)

Validates that a value is a valid IP address (IPv4 or IPv6).

**Decorator:**

```typescript
@IsIP()                 // Any version
@IsIP(['4'])            // IPv4 only
@IsIP(['6'])            // IPv6 only
@IsIP(['4', '6'])       // Both versions
ipAddress: string;
```

**Parameters:**

- `versions?: ('4' | '6')[]` - IP versions to accept (optional)

**Examples:**

```typescript
// IPv4 Examples
"192.168.1.1";
"8.8.8.8";
"127.0.0.1";

// IPv6 Examples
"2001:0db8:85a3:0000:0000:8a2e:0370:7334";
"::1";
"fe80::1";

// ❌ Fail
"999.999.999.999"; // Out of range
"192.168.1"; // Incomplete
"not-an-ip";
```

---

### MACAddress (IsMACAddress)

Validates that a value is a valid MAC (Media Access Control) address.

**Decorator:**

```typescript
@IsMACAddress
deviceMac: string;
```

**Formats:**

```typescript
// ✅ Pass
"00:1A:2B:3C:4D:5E"; // Colon-separated
"00-1A-2B-3C-4D-5E"; // Hyphen-separated
"001A2B3C4D5E"; // No separator

// ❌ Fail
"00:1A:2B:3C:4D"; // Too few octets
"GG:1A:2B:3C:4D:5E"; // Invalid hex digits
```

---

### Boolean (IsBoolean)

Validates that a value is a boolean type.

**Decorator:**

```typescript
@IsBoolean
isActive: boolean;

@IsBoolean
isVerified: boolean;
```

**Behavior:**

- Must be strictly `true` or `false`
- Fails on: `1`, `0`, `"true"`, `"false"`, `null`
- Passes on: `true`, `false`

---

## Multi-Rule Validators

These validators allow combining multiple validation rules with logical operators.

### OneOf

Validates that a value satisfies at least one of the provided validation rules.

**Decorator:**

```typescript
import { OneOf } from "@resk/core/validator";

class User {
  // Accept either email OR phone number
  @OneOf(["Email", "PhoneNumber"])
  contact: string;

  // Accept UUID OR custom ID format
  @OneOf([
    "UUID",
    ({ value }) => value.startsWith("CUSTOM-") || "Must start with CUSTOM-",
  ])
  identifier: string;
}
```

**Single Value:**

```typescript
await Validator.validate({
  value: "user@example.com",
  rule: OneOf(["Email", "PhoneNumber"]),
});
```

**Behavior:**

- ✅ SUCCESS if ANY rule passes
- ❌ FAILURE if ALL rules fail
- Executes rules in parallel for efficiency
- Returns aggregated errors from all failed rules

**Use Cases:**

- Alternative contact methods (email or phone)
- Multiple ID formats (UUID, custom ID, database ID)
- Flexible input types (string or number for certain fields)
- Optional fields with multiple valid formats

---

### AllOf

Validates that a value satisfies ALL of the provided validation rules.

**Decorator:**

```typescript
import { AllOf } from "@resk/core/validator";

class User {
  // Password must be at least 8 chars AND must be strong
  @AllOf(["MinLength[8]", "StrongPassword"])
  password: string;

  // Must match format AND not contain spaces
  @AllOf(["Email", ({ value }) => !/\s/.test(value)])
  email: string;
}
```

**Single Value:**

```typescript
await Validator.validate({
  value: "password123ABC!",
  rule: AllOf(["MinLength[8]", "StrongPassword"]),
});
```

**Behavior:**

- ✅ SUCCESS if ALL rules pass
- ❌ FAILURE if ANY rule fails
- Executes rules in sequence
- Stops at first failure for efficiency
- Returns error from first failing rule

**Use Cases:**

- Complex password requirements (length + strength + no spaces)
- Email validation + additional format restrictions
- Multi-constraint numeric validations
- Compound business rules

---

### ArrayOf

Validates that all items in an array satisfy the provided validation rules.

**Decorator:**

```typescript
import { ArrayOf } from "@resk/core/validator";

class Form {
  // All emails must be valid
  @ArrayOf(["Email"])
  emails: string[];

  // All items must be between 0-100
  @ArrayOf(["NumberBetween[0,100]"])
  scores: number[];

  // All items must be valid and non-empty
  @ArrayOf(["Required", "Email"])
  recipients: string[];
}
```

**Single Value:**

```typescript
await Validator.validate({
  value: ["user1@example.com", "user2@example.com"],
  rule: ArrayOf(["Email"]),
});
```

**Behavior:**

- ✅ SUCCESS if ALL array items pass rules
- ❌ FAILURE if ANY array item fails rules
- Empty arrays `[]` are considered valid
- Returns errors for failed items with indices

**Use Cases:**

- Email recipient lists
- Numeric score arrays with constraints
- List of valid objects
- Batch validations

---

## Rule Organization

### By Category

| Category    | Rules                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| **Default** | Required, Optional, Nullable, Empty                                                                       |
| **String**  | MinLength, MaxLength, Length, NonNullString, String                                                       |
| **Numeric** | Number, Integer, Between, GreaterThan, LessThan, Equal, Different, Multiple, Even, Odd                    |
| **Array**   | Array, ArrayMinLength, ArrayMaxLength, ArrayLength, ArrayUnique, ArrayAllStrings, ArrayAllNumbers         |
| **Date**    | Date, DateAfter, DateBefore, DateBetween, SameDate, FutureDate, PastDate                                  |
| **File**    | File, MaxFileSize, MinFileSize, FileType, Image, FileExtension                                            |
| **Format**  | Email, URL, PhoneNumber, EmailOrPhone, FileName, UUID, JSON, Base64, HexColor, CreditCard, IP, MACAddress |
| **Boolean** | Boolean                                                                                                   |
| **Multi**   | OneOf, AllOf, ArrayOf                                                                                     |

### By Usage Frequency

1. **Most Common**: Required, MinLength, MaxLength, Email, URL, Number
2. **Very Common**: Optional, Nullable, IsEmail, MaxFileSize, Array
3. **Common**: Integer, DateAfter, PhoneNumber, FileType, UUID
4. **Less Common**: EvenNumber, OddNumber, MultipleOf, IsMACAddress, IsIP
5. **Specialized**: CreditCard, Base64, HexColor, OneOf, AllOf, ArrayOf

---

## Tips & Best Practices

### Chaining Rules

```typescript
class User {
  @IsRequired // First: value must exist
  @IsString // Then: must be string type
  @MinLength([3]) // Then: at least 3 characters
  @MaxLength([50]) // Then: at most 50 characters
  @IsEmail // Finally: must be valid email
  email: string;
}
```

Rules execute in order; first failure stops execution.

### Using Optional/Nullable/Empty Together

```typescript
class Form {
  @IsRequired
  @IsEmail
  requiredEmail: string; // Must have value

  @IsOptional
  @IsEmail
  optionalEmail?: string; // Can be undefined or valid email

  @IsNullable
  @IsNumber
  nullableAge?: number; // Can be null/undefined or valid number

  @IsEmpty
  @MaxLength([500])
  notes?: string; // Can be "" or valid string
}
```

### Mixing Rule Types

```typescript
const rules: IValidatorRules = [
  "Required", // Named rule
  "MinLength[3]", // Parameterized rule
  { MaxLength: [50] }, // Object rule
  ({ value }) => !/\d/.test(value), // Function rule (no numbers)
];
```

### Custom Domain Rules

```typescript
// Register once, use everywhere
Validator.registerRule("ValidUsername", ({ value }) => {
  const isValid = /^[a-zA-Z0-9_]{3,20}$/.test(value);
  return isValid || "Username must be 3-20 alphanumeric characters";
});

class User {
  @Validator.buildPropertyDecorator(["ValidUsername"])
  username: string;
}
```

---

For more information, see [02-DECORATORS.md](02-DECORATORS.md) and [03-ADVANCED_USAGE.md](03-ADVANCED_USAGE.md).
