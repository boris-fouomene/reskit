# Real-World Examples

Comprehensive real-world examples demonstrating the Validator system in practical scenarios.

## Table of Contents

1. [User Registration Form](#user-registration-form)
2. [E-Commerce Product Form](#e-commerce-product-form)
3. [Blog Post Creation](#blog-post-creation)
4. [API Request Validation](#api-request-validation)
5. [Multi-Step Form Wizard](#multi-step-form-wizard)
6. [User Profile Management](#user-profile-management)
7. [Payment Processing](#payment-processing)
8. [Content Moderation](#content-moderation)

---

## User Registration Form

Complete user registration with email verification and password requirements.

```typescript
import {
  Validator,
  IsRequired,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
  AllOf,
  OneOf,
  IsNullable,
  IsNumber,
  IsBoolean,
} from "@resk/core/validator";

class UserRegistration {
  // Username: required, unique, alphanumeric
  @IsRequired
  @MinLength([3])
  @MaxLength([30])
  @Validator.buildPropertyDecorator(["UniqueUsername"])
  username: string;

  // Email: required, valid format, unique
  @IsRequired
  @IsEmail
  @Validator.buildPropertyDecorator(["UniqueEmail"])
  email: string;

  // Password: complex requirements
  @AllOf([
    "MinLength[12]",
    ({ value }) => /[A-Z]/.test(value) || "Must contain uppercase",
    ({ value }) => /[a-z]/.test(value) || "Must contain lowercase",
    ({ value }) => /\d/.test(value) || "Must contain digit",
    ({ value }) => /[!@#$%^&*]/.test(value) || "Must contain special character",
  ])
  password: string;

  // Confirm password must match
  @Validator.buildPropertyDecorator(["MatchPassword"])
  confirmPassword: string;

  // Contact: email or phone
  @OneOf(["Email", "PhoneNumber"])
  contact: string;

  // Age: optional but if provided must be 18+
  @IsOptional
  @IsNumber
  @Validator.buildRuleDecorator<[min: number]>(({ value, ruleParams }) => {
    const minAge = ruleParams?.[0] || 18;
    return value >= minAge || `Must be at least ${minAge} years old`;
  })
  age?: number;

  // Terms accepted: required to be true
  @IsRequired
  @IsBoolean
  acceptsTerms: boolean;

  // Newsletter subscription: optional boolean
  @IsOptional
  @IsBoolean
  subscribesNewsletter?: boolean;

  // Referral code: optional, format validation
  @IsOptional
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    if (!value) return true;
    return /^REF-[A-Z0-9]{8}$/.test(value) || "Invalid referral code format";
  })
  referralCode?: string;
}

// Usage
async function registerUser(formData) {
  const result = await Validator.validateTarget(UserRegistration, {
    data: formData,
    errorMessageBuilder: (fieldName, error) => {
      return `${fieldName}: ${error}`;
    },
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.errors.reduce((acc, e) => {
        acc[e.propertyName] = e.message;
        return acc;
      }, {}),
    };
  }

  // Save user
  const user = await saveUser(result.data);
  return { success: true, user };
}

// Example data
const validData = {
  username: "john_doe",
  email: "john@example.com",
  password: "SecurePass123!@",
  confirmPassword: "SecurePass123!@",
  contact: "+1-234-567-8900",
  age: 25,
  acceptsTerms: true,
  subscribesNewsletter: true,
  referralCode: "REF-ABC12345",
};

await registerUser(validData);
```

---

## E-Commerce Product Form

Product management with categories, pricing, and inventory.

```typescript
class Dimensions {
  @IsRequired
  @IsNumber
  width: number;

  @IsRequired
  @IsNumber
  height: number;

  @IsRequired
  @IsNumber
  depth: number;
}

class Pricing {
  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  cost: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  retailPrice: number;

  @IsOptional
  @IsNumber
  @IsNumberGreaterThanOrEqual([0])
  @Validator.buildRuleDecorator<[]>(({ value, data }) => {
    if (!value) return true;
    return (
      value < data?.retailPrice || "Sale price must be less than retail price"
    );
  })
  salePrice?: number;
}

class Inventory {
  @IsRequired
  @IsInteger
  @IsNumberGreaterThanOrEqual([0])
  quantity: number;

  @IsRequired
  @IsInteger
  @IsNumberGreaterThanOrEqual([0])
  reorderLevel: number;

  @IsRequired
  @IsString
  warehouseLocation: string;
}

class Product {
  // SKU: unique identifier
  @IsRequired
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    return /^SKU-[A-Z0-9]{6}$/.test(value) || "Invalid SKU format";
  })
  sku: string;

  // Product details
  @IsRequired
  @MinLength([3])
  @MaxLength([200])
  name: string;

  @IsOptional
  @MaxLength([5000])
  description?: string;

  // Category and subcategory
  @IsRequired
  @OneOf(["Electronics", "Clothing", "Books", "Home", "Sports"])
  category: string;

  @IsOptional
  subcategory?: string;

  // Product attributes
  @IsRequired
  @IsArrayAllStrings
  @ArrayMinLength([1])
  tags: string[];

  @IsOptional
  @IsArray
  @ArrayOf(["IsUUID"])
  relatedProductIds?: string[];

  // Pricing
  @IsRequired
  @ValidateNested([Pricing])
  pricing: Pricing;

  // Dimensions
  @IsOptional
  @ValidateNested([Dimensions])
  dimensions?: Dimensions;

  // Inventory
  @IsRequired
  @ValidateNested([Inventory])
  inventory: Inventory;

  // Images
  @IsRequired
  @IsArray
  @ArrayMinLength([1])
  @ArrayMaxLength([10])
  @ArrayOf(["IsUrl"])
  imageUrls: string[];

  @IsOptional
  @IsUrl
  videoUrl?: string;

  // SEO
  @IsOptional
  @MaxLength([160])
  seoTitle?: string;

  @IsOptional
  @MaxLength([155])
  seoDescription?: string;

  // Status
  @IsRequired
  @OneOf(["draft", "published", "archived"])
  status: string;

  // Moderation
  @IsOptional
  @IsBoolean
  requiresModeration?: boolean;

  @IsOptional
  @IsString
  moderationNotes?: string;
}

// Usage
async function createProduct(productData) {
  const result = await Validator.validateTarget(Product, {
    data: productData,
  });

  if (!result.success) {
    throw new Error(
      `Product validation failed: ${result.errors.map((e) => e.message).join("; ")}`
    );
  }

  return await saveProduct(result.data);
}

// Example data
const validProduct = {
  sku: "SKU-ABC123",
  name: "Premium Wireless Headphones",
  description: "High-quality Bluetooth headphones with noise cancellation",
  category: "Electronics",
  subcategory: "Audio",
  tags: ["wireless", "bluetooth", "headphones", "audio"],
  relatedProductIds: ["00000000-0000-0000-0000-000000000001"],
  pricing: {
    cost: 30,
    retailPrice: 99.99,
    salePrice: 79.99,
  },
  dimensions: {
    width: 20,
    height: 18,
    depth: 8,
  },
  inventory: {
    quantity: 150,
    reorderLevel: 20,
    warehouseLocation: "A1-2-3",
  },
  imageUrls: ["https://example.com/image1.jpg"],
  videoUrl: "https://example.com/product-demo.mp4",
  seoTitle: "Premium Wireless Headphones - Buy Online",
  seoDescription:
    "Shop high-quality wireless headphones with noise cancellation",
  status: "published",
};

await createProduct(validProduct);
```

---

## Blog Post Creation

Blog post with rich content, categorization, and SEO.

```typescript
class Author {
  @IsRequired
  @IsUUID
  id: string;

  @IsRequired
  @IsString
  name: string;

  @IsRequired
  @IsEmail
  email: string;
}

class BlogPost {
  @IsRequired
  @IsUUID
  id: string;

  @IsRequired
  @MinLength([5])
  @MaxLength([200])
  title: string;

  @IsRequired
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    // Generate slug from title
    const slug = value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    return /^[a-z0-9-]+$/.test(slug) || "Invalid slug format";
  })
  slug: string;

  @IsOptional
  @MaxLength([500])
  excerpt?: string;

  @IsRequired
  @Validator.buildRuleDecorator<[minWords: number]>(({ value, ruleParams }) => {
    const minWords = ruleParams?.[0] || 100;
    const wordCount = (value || "").split(/\s+/).length;
    return (
      wordCount >= minWords || `Article must have at least ${minWords} words`
    );
  })
  content: string;

  // Author
  @IsRequired
  @ValidateNested([Author])
  author: Author;

  // Categories and tags
  @IsRequired
  @IsArrayAllStrings
  @ArrayMinLength([1])
  @ArrayMaxLength([5])
  categories: string[];

  @IsOptional
  @IsArray
  @ArrayMaxLength([20])
  @ArrayUnique
  tags?: string[];

  // Featured image
  @IsRequired
  @IsUrl
  featuredImage: string;

  @IsRequired
  @MaxLength([200])
  featuredImageAlt: string;

  // Status and publishing
  @IsRequired
  @OneOf(["draft", "scheduled", "published", "archived"])
  status: string;

  @IsRequired
  @IsDate
  createdAt: Date;

  @IsOptional
  @IsDate
  @Validator.buildRuleDecorator<[]>(({ value, data }) => {
    if (!value) return true;
    if (value <= data?.createdAt) {
      return "Updated date must be after created date";
    }
    return true;
  })
  updatedAt?: Date;

  @IsOptional
  @IsDate
  @Validator.buildRuleDecorator<[]>(({ value, data }) => {
    if (!value) return true;
    if (data?.status !== "scheduled" && value) {
      return "Publish date only valid for scheduled posts";
    }
    return true;
  })
  publishAt?: Date;

  // SEO
  @IsOptional
  @MaxLength([160])
  seoTitle?: string;

  @IsOptional
  @MaxLength([160])
  seoDescription?: string;

  // Comments
  @IsOptional
  @IsBoolean
  allowComments?: boolean;

  @IsOptional
  @IsBoolean
  commentModeration?: boolean;
}

// Usage
async function publishBlogPost(postData) {
  const result = await Validator.validateTarget(BlogPost, {
    data: postData,
  });

  if (!result.success) {
    const errors = result.errors.map((e) => ({
      field: e.propertyName,
      message: e.message,
    }));
    throw { statusCode: 422, errors };
  }

  return await saveBlogPost(result.data);
}

// Example
const validPost = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Advanced Validation Techniques",
  slug: "advanced-validation-techniques",
  excerpt: "Learn advanced validation patterns and best practices",
  content: "Detailed article content with at least 100 words...",
  author: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Jane Doe",
    email: "jane@example.com",
  },
  categories: ["Technology", "Tutorials"],
  tags: ["validation", "typescript", "javascript"],
  featuredImage: "https://example.com/featured.jpg",
  featuredImageAlt: "Validation techniques header image",
  status: "published",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15"),
  seoTitle: "Advanced Validation Techniques - Best Practices",
  seoDescription: "Master advanced validation with our comprehensive guide",
  allowComments: true,
  commentModeration: false,
};

await publishBlogPost(validPost);
```

---

## API Request Validation

Validating API endpoints with complex request bodies.

```typescript
class PaginationQuery {
  @IsOptional
  @IsNumber
  @IsNumberGreaterThanOrEqual([1])
  page?: number = 1;

  @IsOptional
  @IsNumber
  @IsNumberBetween([1, 100])
  limit?: number = 20;

  @IsOptional
  @IsString
  sortBy?: string;

  @IsOptional
  @OneOf(["asc", "desc"])
  sortOrder?: string;
}

class FilterOptions {
  @IsOptional
  @IsString
  search?: string;

  @IsOptional
  @IsArrayAllStrings
  tags?: string[];

  @IsOptional
  @IsDate
  createdAfter?: Date;

  @IsOptional
  @IsDate
  createdBefore?: Date;
}

class SearchUserRequest {
  @IsRequired
  @ValidateNested([PaginationQuery])
  pagination: PaginationQuery;

  @IsOptional
  @ValidateNested([FilterOptions])
  filters?: FilterOptions;
}

// Express route handler
app.post("/api/users/search", async (req, res) => {
  const result = await Validator.validateTarget(SearchUserRequest, {
    data: req.body,
    context: {
      userId: req.user.id,
      permissions: req.user.permissions,
    },
  });

  if (!result.success) {
    return res.status(422).json({
      status: "error",
      message: "Validation failed",
      errors: result.errors.map((e) => ({
        field: e.propertyName,
        message: e.message,
      })),
    });
  }

  try {
    const users = await searchUsers(result.data);
    return res.json({ status: "success", data: users });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// Usage in client
const searchQuery = {
  pagination: { page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" },
  filters: {
    search: "john",
    tags: ["admin", "verified"],
    createdAfter: new Date("2024-01-01"),
  },
};

const response = await fetch("/api/users/search", {
  method: "POST",
  body: JSON.stringify(searchQuery),
});
```

---

## Multi-Step Form Wizard

Form with context-aware validation across steps.

```typescript
// Step 1: Personal Information
class PersonalInfo {
  @IsRequired
  @MinLength([2])
  @MaxLength([50])
  firstName: string;

  @IsRequired
  @MinLength([2])
  @MaxLength([50])
  lastName: string;

  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsPhoneNumber()
  phone: string;

  @IsRequired
  @IsDate
  dateOfBirth: Date;

  @IsRequired
  @OneOf(["M", "F", "Other"])
  gender: string;
}

// Step 2: Address Information
class AddressInfo {
  @IsRequired
  @MinLength([5])
  street: string;

  @IsRequired
  @MinLength([2])
  city: string;

  @IsRequired
  @MinLength([2])
  state: string;

  @IsRequired
  @IsString
  zipCode: string;

  @IsRequired
  @OneOf(["US", "CA", "UK", "AU", "Other"])
  country: string;

  @IsOptional
  @IsString
  apartment?: string;
}

// Step 3: Payment Information
class PaymentInfo {
  @IsRequired
  @IsCreditCard
  cardNumber: string;

  @IsRequired
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    return /^\d{2}\/\d{2}$/.test(value) || "Invalid expiry format (MM/YY)";
  })
  expiryDate: string;

  @IsRequired
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    return /^\d{3,4}$/.test(value) || "Invalid CVV (3-4 digits)";
  })
  cvv: string;

  @IsRequired
  @MinLength([2])
  @MaxLength([100])
  cardholderName: string;

  @IsRequired
  @IsBoolean
  saveCreditCard: boolean;
}

// Multi-step form manager
class MultiStepFormManager {
  private steps = {
    personal: PersonalInfo,
    address: AddressInfo,
    payment: PaymentInfo,
  };

  async validateStep(stepName: string, data: any) {
    const stepClass = this.steps[stepName];
    if (!stepClass) {
      throw new Error(`Invalid step: ${stepName}`);
    }

    const result = await Validator.validateTarget(stepClass, { data });

    return {
      valid: result.success,
      errors: result.success ? [] : result.errors,
      data: result.success ? result.data : null,
    };
  }

  async validateAll(allData: any) {
    const stepResults = {};

    for (const [stepName, stepClass] of Object.entries(this.steps)) {
      const result = await Validator.validateTarget(stepClass, {
        data: allData[stepName],
      });

      stepResults[stepName] = {
        valid: result.success,
        errors: result.success ? [] : result.errors,
      };
    }

    return stepResults;
  }
}

// Usage
const formManager = new MultiStepFormManager();

// Validate each step
const step1 = await formManager.validateStep("personal", {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1-234-567-8900",
  dateOfBirth: new Date("1990-01-15"),
  gender: "M",
});

if (step1.valid) {
  // Proceed to step 2
} else {
  // Show errors and let user correct
  console.error(step1.errors);
}
```

---

## User Profile Management

User profile with flexible optional fields and context-based validation.

```typescript
class UserProfile {
  @IsRequired
  @IsUUID
  userId: string;

  // Basic info
  @IsRequired
  @MinLength([2])
  @MaxLength([50])
  firstName: string;

  @IsRequired
  @MinLength([2])
  @MaxLength([50])
  lastName: string;

  @IsRequired
  @IsEmail
  email: string;

  // Bio and avatar
  @IsOptional
  @MaxLength([500])
  bio?: string;

  @IsOptional
  @IsUrl
  avatar?: string;

  // Contact info
  @IsOptional
  @IsPhoneNumber()
  phone?: string;

  @IsOptional
  @OneOf(["Email", "Phone", "No Contact"])
  preferredContact?: string;

  // Social media
  @IsOptional
  @IsUrl
  website?: string;

  @IsOptional
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    return /^@?[A-Za-z0-9_]{1,15}$/.test(value) || "Invalid Twitter handle";
  })
  twitterHandle?: string;

  @IsOptional
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    return /^[a-zA-Z0-9._-]+$/.test(value) || "Invalid Instagram username";
  })
  instagramHandle?: string;

  // Preferences
  @IsOptional
  @IsBoolean
  emailNotifications?: boolean = true;

  @IsOptional
  @IsBoolean
  smsNotifications?: boolean = false;

  @IsOptional
  @OneOf(["light", "dark", "auto"])
  theme?: string = "auto";

  @IsOptional
  @IsString
  language?: string = "en";

  // Privacy settings
  @IsOptional
  @OneOf(["public", "private", "friends"])
  profileVisibility?: string = "public";

  @IsOptional
  @IsBoolean
  showEmail?: boolean = false;

  @IsOptional
  @IsBoolean
  showPhoneNumber?: boolean = false;

  // Admin-only fields (requires admin context)
  @IsOptional
  @OneOf(["active", "suspended", "banned"])
  @Validator.buildPropertyDecorator(["AdminOnly"])
  status?: string;

  @IsOptional
  @IsString
  @Validator.buildPropertyDecorator(["AdminOnly"])
  suspensionReason?: string;
}

// Usage with context
interface AdminContext {
  userRole: "admin" | "moderator" | "user";
}

async function updateUserProfile(
  userId: string,
  profileData: any,
  context: AdminContext
) {
  // Register admin-only rule
  Validator.registerRule("AdminOnly", ({ context: ctx }) => {
    const adminCtx = ctx as AdminContext;
    return (
      adminCtx?.userRole === "admin" || "Only admins can modify this field"
    );
  });

  const result = await Validator.validateTarget<UserProfile, AdminContext>(
    UserProfile,
    {
      data: { userId, ...profileData },
      context,
    }
  );

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Save updated profile
  await saveUserProfile(result.data);
  return { success: true, data: result.data };
}

// Admin updating profile (can change status)
await updateUserProfile(
  "user-123",
  {
    firstName: "John",
    bio: "Updated bio",
    status: "suspended",
    suspensionReason: "Violated terms of service",
  },
  { userRole: "admin" }
);

// Regular user updating profile (status change fails)
await updateUserProfile(
  "user-456",
  {
    firstName: "Jane",
    bio: "My bio",
    status: "suspended", // ❌ Fails - only admin
  },
  { userRole: "user" }
);
```

---

## Payment Processing

Payment information validation with security checks.

```typescript
class BillingAddress {
  @IsRequired
  @MinLength([5])
  street: string;

  @IsRequired
  city: string;

  @IsRequired
  state: string;

  @IsRequired
  zipCode: string;

  @IsRequired
  country: string;
}

class PaymentRequest {
  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  amount: number;

  @IsRequired
  @OneOf(["USD", "EUR", "GBP", "CAD"])
  currency: string;

  // Card info - only if not using saved card
  @OneOf([
    ({ value, data }) => {
      // Either use saved card ID
      return value?.startsWith("card_") || false;
    },
    ({ value, data }) => {
      // Or provide new card details
      return !!value?.cardNumber || false;
    },
  ])
  cardInfo: string;

  @IsOptional
  @IsCreditCard
  cardNumber?: string;

  @IsOptional
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    if (!value) return true;
    const [month, year] = value.split("/");
    const expiry = new Date(parseInt(`20${year}`), parseInt(month) - 1);
    return expiry > new Date() || "Card expired";
  })
  expiryDate?: string;

  @IsOptional
  @Validator.buildRuleDecorator<[]>(({ value }) => {
    return /^\d{3,4}$/.test(value) || "Invalid CVV";
  })
  cvv?: string;

  // Billing address
  @IsRequired
  @ValidateNested([BillingAddress])
  billingAddress: BillingAddress;

  // Customer info
  @IsRequired
  @IsEmail
  customerEmail: string;

  @IsRequired
  @IsPhoneNumber()
  customerPhone: string;

  // Terms
  @IsRequired
  @IsBoolean
  acceptsTerms: boolean;

  @IsOptional
  @IsBoolean
  saveCard?: boolean = false;

  @IsOptional
  @IsString
  idempotencyKey?: string;
}

// Payment processor
async function processPayment(paymentData) {
  const result = await Validator.validateTarget(PaymentRequest, {
    data: paymentData,
    errorMessageBuilder: (field, error) => {
      // Sanitize error messages for security
      if (field === "cardNumber") {
        return "Invalid card information";
      }
      return `${field}: ${error}`;
    },
  });

  if (!result.success) {
    return {
      success: false,
      message: "Payment validation failed",
      errors: result.errors.map((e) => ({
        field: e.propertyName,
        message: e.message,
      })),
    };
  }

  try {
    // Process payment through payment gateway
    const charge = await paymentGateway.charge({
      amount: Math.round(result.data.amount * 100),
      currency: result.data.currency,
      card: result.data.cardNumber,
      customerId: result.data.customerEmail,
    });

    if (result.data.saveCard) {
      await savePaymentMethod(result.data);
    }

    return {
      success: true,
      transactionId: charge.id,
      message: "Payment processed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Payment processing failed",
      error: error.message,
    };
  }
}

// Usage
const paymentRequest = {
  amount: 99.99,
  currency: "USD",
  cardInfo: "4111111111111111",
  cardNumber: "4111111111111111",
  expiryDate: "12/25",
  cvv: "123",
  billingAddress: {
    street: "123 Main St",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    country: "US",
  },
  customerEmail: "customer@example.com",
  customerPhone: "+1-555-123-4567",
  acceptsTerms: true,
  saveCard: false,
};

await processPayment(paymentRequest);
```

---

## Content Moderation

User-generated content validation with filtering rules.

```typescript
class ModerationConfig {
  @IsOptional
  @IsArray
  @ArrayAllStrings
  bannedWords?: string[];

  @IsOptional
  @IsArray
  @ArrayAllStrings
  autoApprovedDomains?: string[];

  @IsOptional
  @IsNumber
  @IsNumberBetween([0, 100])
  spamScoreThreshold?: number = 80;
}

class UserGeneratedContent {
  @IsRequired
  @IsUUID
  authorId: string;

  @IsRequired
  @MinLength([1])
  @MaxLength([5000])
  content: string;

  @IsOptional
  @IsArray
  @ArrayMaxLength([10])
  @ArrayUnique
  @ArrayOf(["IsUrl"])
  links?: string[];

  @IsOptional
  @IsArray
  @ArrayMaxLength([5])
  @ArrayAllNumbers
  mentions?: number[];

  @IsOptional
  @IsArray
  @ArrayMaxLength([10])
  @ArrayAllStrings
  tags?: string[];

  @IsOptional
  @IsString
  replyingToId?: string;

  @IsOptional
  @IsBoolean
  isSpam?: boolean = false;

  @IsOptional
  @IsString
  moderationStatus?: string;

  @IsOptional
  @IsString
  moderationNotes?: string;
}

// Moderation service
class ContentModerationService {
  async validateAndModerate(content: any, config: ModerationConfig) {
    // First validate structure
    const validationResult = await Validator.validateTarget(
      UserGeneratedContent,
      { data: content }
    );

    if (!validationResult.success) {
      return {
        approved: false,
        reason: "Content structure validation failed",
        errors: validationResult.errors,
      };
    }

    const moderatedContent = { ...validationResult.data };

    // Check for banned words
    if (config.bannedWords) {
      const bannedWordsRegex = new RegExp(config.bannedWords.join("|"), "gi");
      if (bannedWordsRegex.test(content.content)) {
        return {
          approved: false,
          reason: "Content contains prohibited words",
          moderationStatus: "rejected",
        };
      }
    }

    // Check spam score
    const spamScore = await this.calculateSpamScore(content);
    if (spamScore > (config.spamScoreThreshold || 80)) {
      return {
        approved: false,
        reason: "Content flagged as spam",
        spamScore,
        moderationStatus: "pending_review",
      };
    }

    // Check links
    if (content.links?.length > 0) {
      const invalidLinks = content.links.filter((link) => {
        return !config.autoApprovedDomains?.some((domain) =>
          link.includes(domain)
        );
      });

      if (invalidLinks.length > 0) {
        return {
          approved: false,
          reason: "Content contains unapproved links",
          invalidLinks,
          moderationStatus: "pending_review",
        };
      }
    }

    // Content approved
    return {
      approved: true,
      content: moderatedContent,
      moderationStatus: "approved",
    };
  }

  private calculateSpamScore(content: any): number {
    let score = 0;

    // Check for excessive links
    if (content.links?.length > 3) score += 20;

    // Check for uppercase
    const uppercaseRatio =
      (content.content.match(/[A-Z]/g) || []).length / content.content.length;
    if (uppercaseRatio > 0.3) score += 15;

    // Check for repeated characters
    if (/(.)\1{4,}/.test(content.content)) score += 10;

    // Check for suspicious patterns
    if (/(http|https):\/\//.test(content.content)) score += 15;

    return Math.min(score, 100);
  }
}

// Usage
const moderationConfig: ModerationConfig = {
  bannedWords: ["badword1", "badword2"],
  autoApprovedDomains: ["example.com", "trusted-site.com"],
  spamScoreThreshold: 70,
};

const service = new ContentModerationService();

const userContent = {
  authorId: "550e8400-e29b-41d4-a716-446655440000",
  content: "Check this out: https://example.com/article",
  links: ["https://example.com/article"],
  tags: ["technology", "news"],
};

const moderationResult = await service.validateAndModerate(
  userContent,
  moderationConfig
);

if (moderationResult.approved) {
  await saveContent(moderationResult.content);
} else {
  console.log("Content rejected:", moderationResult.reason);
}
```

---

For more patterns and advanced usage, see [03-ADVANCED_USAGE.md](03-ADVANCED_USAGE.md).
