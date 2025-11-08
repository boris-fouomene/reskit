# Validator - Practical Recipes & Real-World Examples

Collection of ready-to-use validation patterns for common real-world scenarios.

## Table of Contents

1. [User Authentication](#user-authentication)
2. [E-Commerce](#e-commerce)
3. [Content Management](#content-management)
4. [API Validation](#api-validation)
5. [Form Validation](#form-validation)
6. [Business Rules](#business-rules)
7. [Data Migration](#data-migration)
8. [Testing Patterns](#testing-patterns)

---

## User Authentication

### Login Form Validation

```typescript
class LoginForm {
  @IsRequired
  @IsEmail
  @IsMaxLength([255])
  email: string;

  @IsRequired
  @IsMinLength([8])
  @IsMaxLength([128])
  password: string;
}

async function validateLogin(formData: unknown) {
  const result = await Validator.validateTarget(LoginForm, formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.errors.map((e) => ({
        field: e.propertyName,
        message: e.message,
      })),
    };
  }

  // Proceed with authentication
  return { success: true, data: result.data };
}
```

### Registration Form with Async Validation

```typescript
// Register custom rule
Validator.registerRule("UniqueEmail", async ({ value }) => {
  const exists = await database.users.findOne({ email: value });
  return !exists || "Email already registered";
});

const IsUniqueEmail = Validator.createPropertyDecorator(["UniqueEmail"]);

class RegistrationForm {
  @IsRequired
  @IsEmail
  @IsMaxLength([255])
  @IsUniqueEmail // Checks database
  email: string;

  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([50])
  username: string;

  @IsRequired
  @IsMinLength([8])
  @IsMaxLength([128])
  password: string;

  @IsRequired
  @Equals(["password"]) // Must match password
  confirmPassword: string;

  @IsNullable
  @IsUrl
  website?: string;

  @IsNullable
  @IsPhoneNumber
  phoneNumber?: string;
}

async function registerUser(formData: unknown) {
  const result = await Validator.validateTarget(RegistrationForm, formData);

  if (!result.success) {
    // Return validation errors
    const errorsByField = result.errors.reduce(
      (acc, err) => {
        if (!acc[err.propertyName]) acc[err.propertyName] = [];
        acc[err.propertyName].push(err.message);
        return acc;
      },
      {} as Record<string, string[]>
    );

    return { success: false, errors: errorsByField };
  }

  // Create user account
  try {
    const user = await database.users.create(result.data);
    return { success: true, user };
  } catch (error) {
    return { success: false, message: "Failed to create account" };
  }
}
```

### Password Reset Validation

```typescript
Validator.registerRule(
  "StrongPassword",
  ({ value }: IValidatorValidateOptions) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*]/.test(value);

    if (!hasUpperCase) return "Must contain uppercase letter";
    if (!hasLowerCase) return "Must contain lowercase letter";
    if (!hasNumbers) return "Must contain number";
    if (!hasSpecialChar) return "Must contain special character (!@#$%^&*)";

    return true;
  }
);

const IsStrongPassword = Validator.createPropertyDecorator(["StrongPassword"]);

class PasswordResetForm {
  @IsRequired
  currentPassword: string;

  @IsRequired
  @IsMinLength([8])
  @IsMaxLength([128])
  @IsStrongPassword
  newPassword: string;

  @IsRequired
  @Equals(["newPassword"])
  confirmPassword: string;
}
```

---

## E-Commerce

### Product Creation

```typescript
Validator.registerRule("ValidPrice", ({ value, ruleParams }) => {
  const [minPrice] = ruleParams;
  if (value < minPrice) return `Price must be at least $${minPrice}`;
  if (value > 999999.99) return "Price too high";
  return true;
});

class ProductForm {
  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([200])
  name: string;

  @IsRequired
  @IsMinLength([10])
  @IsMaxLength([5000])
  description: string;

  @IsRequired
  @IsNumber
  @ValidPrice([0.01])
  price: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEquals([0])
  stock: number;

  @IsRequired
  @IsEnum(["active", "inactive", "discontinued"])
  status: string;

  @IsNullable
  @IsUrl
  imageUrl?: string;

  @IsNullable
  @IsMinLength([5])
  @IsMaxLength([50])
  sku?: string;
}

async function createProduct(formData: unknown) {
  const result = await Validator.validateTarget(ProductForm, formData);

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      errors: result.errors,
    };
  }

  const product = await database.products.create(result.data);
  return { success: true, product };
}
```

### Shopping Cart Validation

```typescript
Validator.registerRule("ValidQuantity", ({ value }) => {
  if (!Number.isInteger(value)) return "Quantity must be whole number";
  if (value < 1) return "Quantity must be at least 1";
  if (value > 999) return "Quantity cannot exceed 999";
  return true;
});

class CartItem {
  @IsRequired
  @IsNumber
  productId: number;

  @IsRequired
  @ValidQuantity
  quantity: number;

  @IsRequired
  @IsEnum(["standard", "express", "overnight"])
  shippingMethod: string;
}

async function validateCartItems(items: unknown[]) {
  const results = await Promise.all(
    items.map((item, index) => Validator.validateTarget(CartItem, item))
  );

  const failures = results
    .map((r, i) => ({ index: i, result: r }))
    .filter((x) => !x.result.success);

  if (failures.length > 0) {
    return {
      success: false,
      errors: failures.map((f) => ({
        itemIndex: f.index,
        errors: f.result.errors,
      })),
    };
  }

  return { success: true, items: results.map((r) => r.data) };
}
```

---

## Content Management

### Blog Post Creation

```typescript
Validator.registerRule("ValidSlug", ({ value }) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(value) || "Slug must be lowercase with hyphens only";
});

const IsValidSlug = Validator.createPropertyDecorator(["ValidSlug"]);

class BlogPost {
  @IsRequired
  @IsMinLength([5])
  @IsMaxLength([200])
  title: string;

  @IsRequired
  @IsValidSlug
  @IsMaxLength([200])
  slug: string;

  @IsRequired
  @IsMinLength([50])
  @IsMaxLength([5000])
  excerpt: string;

  @IsRequired
  @IsMinLength([200])
  @IsMaxLength([50000])
  content: string;

  @IsRequired
  @IsEnum(["draft", "published", "scheduled", "archived"])
  status: string;

  @IsRequired
  @IsEnum(["technology", "business", "lifestyle", "other"])
  category: string;

  @IsNullable
  @IsUrl
  coverImage?: string;

  @IsNullable
  publishDate?: Date;
}

async function createBlogPost(formData: unknown) {
  const result = await Validator.validateTarget(BlogPost, formData);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Check slug uniqueness
  const exists = await database.posts.findOne({ slug: result.data.slug });
  if (exists) {
    return {
      success: false,
      errors: [
        {
          propertyName: "slug",
          message: "This slug is already in use",
        },
      ],
    };
  }

  const post = await database.posts.create(result.data);
  return { success: true, post };
}
```

### Comment Validation

```typescript
class Comment {
  @IsRequired
  @IsEmail
  @IsMaxLength([255])
  authorEmail: string;

  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([50])
  authorName: string;

  @IsRequired
  @IsMinLength([1])
  @IsMaxLength([5000])
  content: string;

  @IsRequired
  @IsNumber
  postId: number;

  @IsNullable
  @IsUrl
  websiteUrl?: string;
}

async function validateComment(comment: unknown) {
  const result = await Validator.validateTarget(Comment, comment);

  if (!result.success) {
    return { valid: false, errors: result.errors };
  }

  // Additional checks
  const isBanned = await checkSpamFilter(result.data.content);
  if (isBanned) {
    return {
      valid: false,
      reason: "Comment flagged as spam",
    };
  }

  return { valid: true, comment: result.data };
}
```

---

## API Validation

### Request Validation Middleware

```typescript
interface ValidationContext {
  userId?: number;
  userRole?: string;
}

async function validateRequest<T>(
  data: unknown,
  ValidationClass: new () => T,
  context?: ValidationContext
) {
  const result = await Validator.validateTarget<T, ValidationContext>(
    ValidationClass,
    data,
    { context }
  );

  return {
    isValid: result.success,
    data: result.success ? result.data : null,
    errors: !result.success ? result.errors : null,
    duration: result.duration,
  };
}

// Express/Fastify middleware example
async function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validation = await validateRequest(req.body, UserForm, {
    userId: req.user?.id,
    userRole: req.user?.role,
  });

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors,
      duration: validation.duration,
    });
  }

  req.validatedData = validation.data;
  next();
}
```

### Pagination Validation

```typescript
class PaginationParams {
  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEquals([1])
  page: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEquals([1])
  @IsNumberLessThanOrEquals([100])
  limit: number;

  @IsNullable
  @IsEnum(["asc", "desc"])
  sortOrder?: string;

  @IsNullable
  @IsMaxLength([50])
  sortBy?: string;
}

async function getPaginatedResults(query: unknown) {
  const result = await Validator.validateTarget(PaginationParams, query);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  const { page, limit, sortOrder, sortBy } = result.data;

  const items = await database.items
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sortBy || "id"]: sortOrder === "desc" ? -1 : 1 })
    .find();

  return {
    success: true,
    page,
    limit,
    items,
  };
}
```

---

## Form Validation

### Multi-Step Form with Conditional Validation

```typescript
class Step1Form {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsPhoneNumber
  phone: string;
}

class Step2Form {
  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([50])
  firstName: string;

  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([50])
  lastName: string;

  @IsRequired
  @IsNumberGreaterThanOrEquals([18])
  age: number;
}

class Step3Form {
  @IsRequired
  @IsMinLength([10])
  address: string;

  @IsRequired
  @IsMaxLength([10])
  zipCode: string;

  @IsRequired
  country: string;
}

async function validateFormStep(step: number, data: unknown) {
  const validators = {
    1: Step1Form,
    2: Step2Form,
    3: Step3Form,
  };

  const result = await Validator.validateTarget(validators[step], data);

  return {
    stepValid: result.success,
    errors: !result.success ? result.errors : null,
    data: result.success ? result.data : null,
  };
}
```

### Form with Interdependent Fields

```typescript
Validator.registerRule("MatchesField", ({ value, context }) => {
  const { targetField, targetValue } = context;
  return value === targetValue || `Must match ${targetField}`;
});

const MatchesField = Validator.createPropertyDecorator(["MatchesField"]);

interface PasswordContext {
  targetField: string;
  targetValue: string;
}

class ChangePasswordForm {
  @IsRequired
  @IsMinLength([8])
  @IsMaxLength([128])
  newPassword: string;

  @IsRequired
  confirmPassword: string; // Will use MatchesField rule
}

async function validatePasswordChange(
  formData: unknown,
  currentPassword: string
) {
  const validated = formData as any;

  // First validate structure
  const result = await Validator.validateTarget(ChangePasswordForm, formData);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Then validate cross-field
  const passwordsMatch =
    result.data.newPassword === result.data.confirmPassword;
  if (!passwordsMatch) {
    return {
      success: false,
      error: "Passwords do not match",
    };
  }

  return { success: true, data: result.data };
}
```

---

## Business Rules

### Discount Code Validation

```typescript
Validator.registerRule("ValidDiscountCode", async ({ value, context }) => {
  const code = await database.discounts.findOne({ code: value });

  if (!code) return "Discount code not found";
  if (code.expiryDate < new Date()) return "Discount code expired";
  if (code.usageCount >= code.maxUses) return "Discount code limit reached";

  return true;
});

const IsValidDiscountCode = Validator.createPropertyDecorator([
  "ValidDiscountCode",
]);

class CheckoutForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  subtotal: number;

  @IsRequired
  @IsEnum(["credit_card", "paypal", "bank_transfer"])
  paymentMethod: string;

  @IsNullable
  @IsValidDiscountCode
  discountCode?: string;
}

async function processCheckout(cartData: unknown) {
  const result = await Validator.validateTarget(CheckoutForm, cartData);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Calculate total with discount if applicable
  let total = result.data.subtotal;
  if (result.data.discountCode) {
    const discount = await database.discounts.findOne({
      code: result.data.discountCode,
    });
    total = result.data.subtotal * (1 - discount.percentage / 100);
  }

  return { success: true, data: { ...result.data, total } };
}
```

### Business Hours Validation

```typescript
Validator.registerRule("BusinessHours", ({ value }) => {
  const date = new Date(value);
  const hours = date.getHours();
  const day = date.getDay();

  // Closed on Sunday (0) and Saturday (6)
  if (day === 0 || day === 6) return "Service unavailable on weekends";

  // Open 9 AM to 5 PM
  if (hours < 9 || hours >= 17) return "Service only available 9 AM - 5 PM";

  return true;
});

const IsBusinessHours = Validator.createPropertyDecorator(["BusinessHours"]);

class ServiceRequest {
  @IsRequired
  @IsBusinessHours
  requestTime: Date;

  @IsRequired
  @IsEnum(["urgent", "normal", "low"])
  priority: string;
}
```

---

## Data Migration

### CSV Import Validation

```typescript
class CSVRecord {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([1])
  @IsMaxLength([100])
  name: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  age: number;

  @IsRequired
  @IsEnum(["active", "inactive"])
  status: string;
}

async function validateCSVImport(records: unknown[]) {
  const results = await Promise.all(
    records.map((record, index) => Validator.validateTarget(CSVRecord, record))
  );

  const summary = {
    total: records.length,
    valid: 0,
    invalid: 0,
    errors: [] as any[],
  };

  results.forEach((result, index) => {
    if (result.success) {
      summary.valid++;
    } else {
      summary.invalid++;
      summary.errors.push({
        row: index + 2, // +2 for header and 0-indexing
        errors: result.errors,
      });
    }
  });

  if (summary.invalid > 0) {
    return {
      success: false,
      summary,
      message: `${summary.invalid} rows have validation errors`,
    };
  }

  return {
    success: true,
    summary,
    data: results.map((r) => r.data),
  };
}
```

### Data Transformation with Validation

```typescript
async function transformAndValidate(rawData: unknown) {
  // Transform data first
  const transformed = {
    email: rawData.email?.toLowerCase?.().trim(),
    name: rawData.name?.trim(),
    phone: rawData.phone?.replace(/\D/g, ""), // Remove non-digits
    status: rawData.status?.toLowerCase?.() || "active",
  };

  // Then validate
  const result = await Validator.validateTarget(UserForm, transformed);

  return result;
}
```

---

## Testing Patterns

### Validation Test Suite

```typescript
describe("UserForm Validation", () => {
  describe("Email Field", () => {
    it("should accept valid email", async () => {
      const result = await Validator.validate({
        value: "user@example.com",
        rules: ["Email"],
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid email", async () => {
      const result = await Validator.validate({
        value: "invalid-email",
        rules: ["Email"],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Password Field", () => {
    it("should require minimum 8 characters", async () => {
      const result = await Validator.validate({
        value: "short",
        rules: ["MinLength[8]"],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Complete Form", () => {
    it("should validate complete valid form", async () => {
      const result = await Validator.validateTarget(UserForm, {
        email: "user@example.com",
        password: "SecurePass123",
      });

      expect(result.success).toBe(true);
    });

    it("should accumulate multiple errors", async () => {
      const result = await Validator.validateTarget(UserForm, {
        email: "invalid",
        password: "short",
      });

      expect(result.success).toBe(false);
      expect(result.failureCount).toBeGreaterThan(1);
    });
  });
});
```

### Mocking Async Validations

```typescript
describe("UserRegistration with Async Validation", () => {
  beforeEach(() => {
    // Mock database check
    jest.spyOn(database, "users").mockImplementation({
      findOne: jest.fn().mockResolvedValue(null), // User doesn't exist
    });
  });

  it("should allow registration with unique email", async () => {
    const result = await Validator.validateTarget(RegistrationForm, {
      email: "newuser@example.com",
      password: "SecurePass123",
      username: "newuser",
    });

    expect(result.success).toBe(true);
  });

  it("should reject duplicate email", async () => {
    database.users.findOne.mockResolvedValue({ id: 1 });

    const result = await Validator.validateTarget(RegistrationForm, {
      email: "existing@example.com",
      password: "SecurePass123",
      username: "newuser",
    });

    expect(result.success).toBe(false);
  });
});
```

### Performance Testing

```typescript
describe("Validation Performance", () => {
  it("should validate form under 100ms", async () => {
    const result = await Validator.validateTarget(LargeForm, data);

    expect(result.success).toBe(true);
    expect(result.duration).toBeLessThan(100);
  });

  it("should parallel validate all fields", async () => {
    const start = Date.now();
    const result = await Validator.validateTarget(MultiFieldForm, data);
    const elapsed = Date.now() - start;

    // Should be faster than sequential (10 fields * 50ms each)
    expect(elapsed).toBeLessThan(500);
  });
});
```

---

## Quick Reference

### Common Patterns

```typescript
// Simple validation
await Validator.validate({ value, rules: ["Required"] });

// With context
await Validator.validate({ value, rules: ["Custom"], context });

// Class validation
await Validator.validateTarget(FormClass, data);

// Type-safe
if (result.success) {
  /* use result.value */
}

// Error handling
result.errors.forEach((e) => console.error(e.message));

// Custom async rule
async ({ value }) => {
  const check = await database.check(value);
  return check || "Error message";
};
```

---

These recipes provide production-ready patterns for common validation scenarios. Mix and match based on your needs!
