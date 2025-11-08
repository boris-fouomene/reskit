# 📚 Validator Documentation Index

Complete documentation suite for the resk-core Validator module.

## 📖 Available Guides

### 1. **README_COMPREHENSIVE.md** - Main User Guide

**Start here!** Comprehensive introduction to the Validator module.

✨ **What's Included:**

- Feature overview and quick start
- Single-value validation complete guide
- Class-based validation with decorators
- Understanding validation results & error handling
- Complete rules reference with examples
- Advanced features (context, async, custom rules)
- Best practices
- Real-world complete examples
- API reference

**Perfect for:** Getting started, learning the basics, understanding core concepts

**Time to read:** 15-20 minutes

---

### 2. **FEATURE_REFERENCE.md** - Complete Feature Encyclopedia

Detailed reference guide for every feature and pattern.

✨ **What's Included:**

- Result types & Either pattern in depth
- Single-value validation all methods
- Class-based validation details
- **All available rules** (40+ rules) with examples
- **Complete decorator reference**
- Error handling patterns (8 different approaches)
- Advanced patterns (10+ advanced techniques)
- FAQ & troubleshooting
- Type safety examples
- Performance considerations

**Perfect for:** Deep dives, looking up specific features, understanding options

**Time to read:** 30-40 minutes (use as reference)

---

### 3. **RECIPES.md** - Real-World Code Examples

Production-ready validation patterns for common scenarios.

✨ **What's Included:**

- User authentication (login, registration, password reset)
- E-commerce (products, shopping cart, checkout)
- Content management (blog posts, comments)
- API validation (middleware, pagination)
- Form validation (multi-step, conditional)
- Business rules (discounts, business hours)
- Data migration (CSV import, transformation)
- Testing patterns & examples
- Quick reference

**Perfect for:** Copy-paste solutions, real-world scenarios, implementation ideas

**Time to read:** 20-30 minutes (browse by use case)

---

## 🎯 Quick Navigation by Use Case

### 🔐 Authentication & Security

- ✅ Login form validation → README_COMPREHENSIVE.md (Quick Start)
- ✅ User registration with async checks → RECIPES.md (User Authentication)
- ✅ Password validation & strength → RECIPES.md (User Authentication)
- ✅ Custom async rules → README_COMPREHENSIVE.md (Custom Rules & Decorators)

### 🛒 E-Commerce

- ✅ Product validation → RECIPES.md (E-Commerce)
- ✅ Inventory management → RECIPES.md (E-Commerce)
- ✅ Shopping cart validation → RECIPES.md (E-Commerce)
- ✅ Discount code validation → RECIPES.md (Business Rules)

### 📝 Forms & Input

- ✅ Simple form validation → README_COMPREHENSIVE.md (Class-Based Validation)
- ✅ Multi-field forms → FEATURE_REFERENCE.md (Error Handling Patterns)
- ✅ Multi-step forms → RECIPES.md (Form Validation)
- ✅ Conditional fields → FEATURE_REFERENCE.md (Advanced Patterns)

### 🌐 APIs & Backends

- ✅ Request validation → RECIPES.md (API Validation)
- ✅ Pagination validation → RECIPES.md (API Validation)
- ✅ Context-aware validation → README_COMPREHENSIVE.md (Advanced Features)
- ✅ Custom middleware → RECIPES.md (API Validation)

### 📊 Data & Reporting

- ✅ CSV import validation → RECIPES.md (Data Migration)
- ✅ Batch processing → RECIPES.md (Data Migration)
- ✅ Data transformation → RECIPES.md (Data Migration)
- ✅ Error accumulation → FEATURE_REFERENCE.md (Error Handling)

### 🧪 Testing

- ✅ Unit testing validation → RECIPES.md (Testing Patterns)
- ✅ Mocking async rules → RECIPES.md (Testing Patterns)
- ✅ Performance testing → RECIPES.md (Testing Patterns)
- ✅ Type safety testing → FEATURE_REFERENCE.md (Type Safety Examples)

---

## 🚀 Getting Started Path

### Path 1: Quick 10-Minute Start

1. Read: **README_COMPREHENSIVE.md** - Quick Start section
2. Copy: Simple example from **RECIPES.md**
3. Run: Test with your data

### Path 2: Complete Understanding

1. Read: **README_COMPREHENSIVE.md** - Full content
2. Skim: **FEATURE_REFERENCE.md** - For specific features
3. Reference: **RECIPES.md** - As needed

### Path 3: Implementation-Driven

1. Find your use case in **RECIPES.md**
2. Copy the example code
3. Reference: **FEATURE_REFERENCE.md** - For customization details
4. Read: **README_COMPREHENSIVE.md** - For advanced features

---

## 📋 Feature Checklist

- ✅ **Single-value validation** - Validate individual values
- ✅ **Class-based validation** - Decorate classes for multi-field validation
- ✅ **Type-safe results** - Either pattern with discriminated unions
- ✅ **Async rules** - Support for database/API validation
- ✅ **Custom rules** - Easy rule registration
- ✅ **Custom decorators** - Create reusable decorators
- ✅ **Context-aware** - Pass context to rules
- ✅ **Error accumulation** - Multiple field errors collected
- ✅ **Internationalization** - Localized error messages
- ✅ **Parallel validation** - Fields validated concurrently
- ✅ **Performance metrics** - Timing information included
- ✅ **40+ built-in rules** - Email, URL, numbers, strings, enums, etc.
- ✅ **Nullable fields** - Handle optional fields elegantly
- ✅ **Type guards** - TypeScript type narrowing support

---

## 🔥 Most Popular Features

### 1. Email Validation

```typescript
@IsRequired
@IsEmail
email: string;
```

📖 See: README_COMPREHENSIVE.md (Quick Start)

### 2. Required Fields

```typescript
@IsRequired
name: string;
```

📖 See: FEATURE_REFERENCE.md (String Rules)

### 3. Length Validation

```typescript
@IsMinLength([8])
@IsMaxLength([50])
password: string;
```

📖 See: FEATURE_REFERENCE.md (String Rules)

### 4. Numeric Ranges

```typescript
@IsNumberGreaterThanOrEquals([18])
age: number;
```

📖 See: FEATURE_REFERENCE.md (Numeric Rules)

### 5. Async Uniqueness Check

```typescript
@IsRequired
@IsUniqueUsername  // Checks database
username: string;
```

📖 See: RECIPES.md (User Authentication)

### 6. Multiple Errors

```typescript
if (!result.success) {
  result.errors.forEach((e) => console.log(e.message));
}
```

📖 See: README_COMPREHENSIVE.md (Validation Results)

### 7. Custom Rules

```typescript
Validator.registerRule("Custom", ({ value }) => {
  return customCheck(value) || "Error";
});
```

📖 See: README_COMPREHENSIVE.md (Custom Rules)

### 8. Optional Fields

```typescript
@IsSometimes
@IsUrl
website?: string;
```

📖 See: FEATURE_REFERENCE.md (Nullable Rules)

---

## 🧩 Rules Quick Reference

### Essential Rules (Start Here)

| Rule      | Usage                 | Docs                 |
| --------- | --------------------- | -------------------- |
| Required  | Check if value exists | FEATURE_REFERENCE.md |
| Email     | Validate email format | FEATURE_REFERENCE.md |
| MinLength | Check minimum length  | FEATURE_REFERENCE.md |
| MaxLength | Check maximum length  | FEATURE_REFERENCE.md |
| Number    | Check if number       | FEATURE_REFERENCE.md |
| IsEnum    | Check if in list      | FEATURE_REFERENCE.md |

### Complete Rule List

See **FEATURE_REFERENCE.md** - All Available Rules section for:

- String rules (8 rules)
- Numeric rules (7 rules)
- Boolean rules (1 rule)
- Enum rules (2 rules)
- Nullable rules (3 rules)
- Contact rules (2 rules)

---

## 💡 Common Questions

**Q: Where do I start?**
A: Read README_COMPREHENSIVE.md Quick Start section (5 min)

**Q: How do I validate a form?**
A: See README_COMPREHENSIVE.md Class-Based Validation section

**Q: How do I add custom validation?**
A: See README_COMPREHENSIVE.md Custom Rules & Decorators section

**Q: How do I handle errors?**
A: See README_COMPREHENSIVE.md Validation Results & Error Handling section

**Q: Show me real examples?**
A: Browse RECIPES.md for your use case

**Q: What about async validation?**
A: See FEATURE_REFERENCE.md Advanced Patterns section 3

**Q: How do I test?**
A: See RECIPES.md Testing Patterns section

**Q: What's the Either pattern?**
A: See FEATURE_REFERENCE.md Result Types & Either Pattern section

---

## 📚 Documentation Statistics

| Document                | Pages    | Sections | Examples | Rules Covered |
| ----------------------- | -------- | -------- | -------- | ------------- |
| README_COMPREHENSIVE.md | ~50      | 13       | 20+      | All           |
| FEATURE_REFERENCE.md    | ~40      | 8        | 50+      | All           |
| RECIPES.md              | ~40      | 8        | 40+      | 30+           |
| **TOTAL**               | **~130** | **29**   | **110+** | **All**       |

---

## 🎓 Learning Levels

### Beginner (0-1 hour)

- [ ] Read: README_COMPREHENSIVE.md Quick Start
- [ ] Read: README_COMPREHENSIVE.md Validation Results
- [ ] Try: One example from RECIPES.md

### Intermediate (1-3 hours)

- [ ] Read: README_COMPREHENSIVE.md Complete
- [ ] Skim: FEATURE_REFERENCE.md
- [ ] Try: 3 examples from RECIPES.md in your domain

### Advanced (3+ hours)

- [ ] Deep dive: FEATURE_REFERENCE.md
- [ ] Study: RECIPES.md all sections
- [ ] Create: Custom rules and decorators
- [ ] Implement: Complex validation scenarios

---

## 🔗 Document Cross-References

**README_COMPREHENSIVE.md** links to:

- FEATURE_REFERENCE.md for detailed specs
- RECIPES.md for real examples
- Test files for implementation patterns

**FEATURE_REFERENCE.md** links to:

- README_COMPREHENSIVE.md for concepts
- RECIPES.md for practical examples
- Test files for edge cases

**RECIPES.md** links to:

- README_COMPREHENSIVE.md for theory
- FEATURE_REFERENCE.md for rule details
- Test suite for validation patterns

---

## 🚀 Your Next Steps

1. **Choose your starting point:**
   - Beginner? → README_COMPREHENSIVE.md
   - Need quick solution? → RECIPES.md
   - Looking for details? → FEATURE_REFERENCE.md

2. **Pick your use case:**
   - Authentication? → RECIPES.md (User Authentication)
   - E-commerce? → RECIPES.md (E-Commerce)
   - General forms? → README_COMPREHENSIVE.md
   - APIs? → RECIPES.md (API Validation)

3. **Implement & experiment:**
   - Start with provided examples
   - Modify for your needs
   - Reference docs as needed
   - Create custom rules

4. **Join the community:**
   - Share your custom rules
   - Report issues on GitHub
   - Contribute examples

---

## 📞 Quick Help

**"I just want to validate a form"**
→ README_COMPREHENSIVE.md (Class-Based Validation)

**"I need to check if an email is unique"**
→ RECIPES.md (User Authentication)

**"How do I handle validation errors?"**
→ FEATURE_REFERENCE.md (Error Handling Patterns)

**"Can I create my own rules?"**
→ README_COMPREHENSIVE.md (Custom Rules & Decorators)

**"Show me a complete example"**
→ RECIPES.md (choose your category)

**"What rules are available?"**
→ FEATURE_REFERENCE.md (All Available Rules)

---

## 📝 File Summary

```
validator/
├── README_COMPREHENSIVE.md    ← START HERE (Main guide)
├── FEATURE_REFERENCE.md       ← Detailed specs (Reference)
├── RECIPES.md                 ← Real examples (Implementation)
├── validator.ts               ← Source code
├── types.ts                   ← Type definitions
├── rules/                     ← Rule implementations
│   ├── string.ts
│   ├── numeric.ts
│   ├── boolean.ts
│   └── enum.ts
├── tests/                     ← Test examples
│   ├── validator.test.ts
│   ├── validator.validate.test.ts
│   └── validator.validateTarget.test.ts
└── INDEX.md                   ← This file
```

---

**Happy validating! 🎉**

Start with README_COMPREHENSIVE.md and enjoy building robust, type-safe validation!
