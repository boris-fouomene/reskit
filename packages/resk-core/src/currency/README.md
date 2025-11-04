# Currency Module User Guide

## Overview

The Currency module provides comprehensive currency formatting, parsing, and manipulation capabilities for JavaScript/TypeScript applications. It supports over 200 currencies with customizable formatting options, number abbreviation, and session-based configuration.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Currency Objects](#currency-objects)
3. [Basic Formatting Functions](#basic-formatting-functions)
4. [Advanced Formatting Functions](#advanced-formatting-functions)
5. [Dynamic Currency Formatters](#dynamic-currency-formatters)
6. [Number Abbreviation](#number-abbreviation)
7. [Session Management](#session-management)
8. [Utility Functions](#utility-functions)
9. [Number Prototype Extensions](#number-prototype-extensions)
10. [Integration Examples](#integration-examples)
11. [Supported Currencies](#supported-currencies)
12. [Edge Cases and Limitations](#edge-cases-and-limitations)

## Core Concepts

### Currency Object Structure

Each currency is represented by an `ICurrency` object with the following properties:

```typescript
interface ICurrency {
  symbol?: string;           // Currency symbol (e.g., "$", "€", "FCFA")
  name?: string;            // Full currency name (e.g., "US Dollar")
  symbolNative?: string;    // Native symbol (e.g., "€" for Euro)
  decimalDigits?: number;   // Number of decimal places (e.g., 2 for USD)
  rounding?: number;        // Rounding precision
  code?: string;            // ISO 4217 code (e.g., "USD", "EUR")
  namePlural?: string;      // Plural form (e.g., "US dollars")
  format?: string;          // Display format pattern (e.g., "%v %s")
  decimalSeparator?: string; // Decimal separator (e.g., ".", ",")
  thousandSeparator?: string; // Thousands separator (e.g., ",", " ")
}
```

### Format Patterns

Format strings use placeholders:
- `%s`: Currency symbol
- `%v`: Formatted value
- `%s%v`: Symbol before value (e.g., "$123.45")
- `%v %s`: Value before symbol (e.g., "123.45 $")
- `.%###`: Decimal places (number of # indicates decimal digits)

## Currency Objects

### Accessing Currency Data

```typescript
import { Currency } from '@resk/core';

// Access all currencies
const allCurrencies = Currency.currencies;

// Access specific currency
const usd = Currency.currencies.USD;
const eur = Currency.currencies.EUR;
const xaf = Currency.currencies.XAF;

// Currency properties
console.log(usd.symbol);        // "$"
console.log(usd.decimalDigits); // 2
console.log(usd.format);        // "%v %s"
console.log(xaf.symbol);        // "FCFA"
```

### Supported Currencies

The module includes over 200 currencies including:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- XAF (Central African CFA Franc)
- JPY (Japanese Yen)
- CHF (Swiss Franc)
- AUD (Australian Dollar)
- And many more...

## Basic Formatting Functions

### formatNumber()

Formats a number with thousands separators and decimal places.

```typescript
import { Currency } from '@resk/core';

// Basic formatting
Currency.formatNumber(1234567.89);        // "1,234,567.89"
Currency.formatNumber(1234.567, 2);       // "1,234.57"

// Custom separators
Currency.formatNumber(1234567.89, 2, " ", ","); // "1 234 567,89"

// Currency object as parameter
const euroOptions = {
  decimalDigits: 2,
  thousandSeparator: ".",
  decimalSeparator: ","
};
Currency.formatNumber(1234567.89, euroOptions); // "1.234.567,89"
```

**Parameters:**
- `number`: The number to format
- `optionsOrDecimalDigits`: Currency options object or decimal digits count
- `thousandSeparator`: Thousands separator (default: ",")
- `decimalSeparator`: Decimal separator (default: ".")

**Returns:** Formatted number string

### formatMoney()

Formats a number as currency with symbol and proper formatting.

```typescript
import { Currency } from '@resk/core';

// Basic currency formatting
Currency.formatMoney(1234.56);           // "1,234.56 $"
Currency.formatMoney(1234.56, "€");      // "1,234.56 €"

// Custom options
Currency.formatMoney(1234.56, "$", 3);   // "1,234.568 $"

// Full parameter control
Currency.formatMoney(1234.56, "$", 2, ",", ".", "%s%v"); // "$1,234.56"

// Currency object
const customCurrency = {
  symbol: "£",
  decimalDigits: 2,
  format: "%s %v"
};
Currency.formatMoney(1234.56, customCurrency); // "£ 1,234.56"
```

**Parameters:**
- `number`: The number to format
- `symbol`: Currency symbol or currency object
- `decimalDigits`: Number of decimal places
- `thousandSeparator`: Thousands separator
- `decimalSeparator`: Decimal separator
- `format`: Format pattern

**Returns:** Formatted currency string

### formatMoneyAsObject()

Returns detailed formatting information as an object.

```typescript
const result = Currency.formatMoneyAsObject(1234.56, "$");

console.log(result.result);           // "1,234.56 $"
console.log(result.formattedValue);   // "%v $"
console.log(result.formattedNumber);  // "1,234.56"
console.log(result.usedFormat);       // "%v %s"
console.log(result.symbol);           // "$"
console.log(result.decimalDigits);    // 2
```

**Returns:** Object with formatting details and currency properties

## Advanced Formatting Functions

### toFixed()

Improved toFixed() that handles floating-point precision issues.

```typescript
Currency.toFixed(1.235, 2);     // "1.24"
Currency.toFixed(1.234, 2);     // "1.23"
Currency.toFixed(-1.235, 2);    // "-1.23"
Currency.toFixed(0, 2);         // "0.00"

// Large numbers
Currency.toFixed(1234567890123456, 2); // Handles large integers
```

### unformat()

Parses formatted currency strings back to numbers.

```typescript
Currency.unformat("$1,234.56");        // 1234.56
Currency.unformat("€1.234,56", ",");   // 1234.56
Currency.unformat("($1,234.56)");      // -1234.56 (bracketed negatives)
Currency.unformat("1 234,56", ",");    // 1234.56

// Arrays (joins and parses)
Currency.unformat(["$1,234.56", "$2,345.67"]); // 1234.562345
```

**Parameters:**
- `value`: String, number, or array to unformat
- `decimalSeparator`: Decimal separator for parsing

**Returns:** Parsed number (NaN becomes 0)

### parseFormat()

Parses format strings to extract decimal digits and format patterns.

```typescript
Currency.parseFormat("%s%v .###");     // { format: "%s%v", decimalDigits: 3 }
Currency.parseFormat("%v %s .");       // { format: "%v %s", decimalDigits: 0 }
Currency.parseFormat("%s %v .#########"); // { format: "%s %v", decimalDigits: 9 }
```

## Dynamic Currency Formatters

### Number Prototype Extensions

Every supported currency gets dynamic formatters on the Number prototype:

```typescript
// Basic currency formatting
(1234.56).formatUSD();     // "$1,234.56"
(1234.56).formatEUR();     // "1,234.56 €"
(1234.56).formatGBP();     // "£1,234.56"
(1234.56).formatCAD();     // "CA$1,234.56"
(1234.56).formatXAF();     // "1,234.56 FCFA"
(1234).formatJPY();        // "¥1,234" (0 decimals)

// Custom decimal digits
(1234.56789).formatUSD(3); // "$1,234.568"

// Custom separators
(1234.56).formatUSD(2, " ", ","); // "$1 234,56"

// Custom format
(1234.56).formatUSD(2, ",", ".", "%s%v"); // "$1,234.56"
```

### Available Formatters

All currencies support the `format{CURRENCY_CODE}` pattern:
- `formatUSD`, `formatEUR`, `formatGBP`, `formatCAD`
- `formatXAF`, `formatJPY`, `formatCHF`, `formatAUD`
- And 200+ more...

### Abbreviation Formatters

Each currency also has abbreviation formatters:

```typescript
// Abbreviated formatting
(1234567).abreviate2FormatUSD();     // "$1.23M"
(1234567).abreviate2FormatEUR();     // "1.23M €"
(124300).abreviate2FormatXAF(2);     // "124.30K FCFA"

// Custom options
(1234567).abreviate2FormatUSD(3, " ", ","); // "$1.235 M"
```

Available: `abreviate2Format{CURRENCY_CODE}` for all currencies.

## Number Abbreviation

### abreviateNumber()

Abbreviates large numbers with suffixes (K, M, B, T).

```typescript
import { abreviateNumber } from '@resk/core';

// Basic abbreviation
abreviateNumber(1500);        // "1.5K"
abreviateNumber(1500000);     // "1.5M"
abreviateNumber(1500000000);  // "1.5B"
abreviateNumber(1500000000000); // "1.5T"

// Custom decimal digits
abreviateNumber(1500, 3);     // "1.500K"
abreviateNumber(1500, 0);     // "1.5K"

// Custom separators
abreviateNumber(1234567, undefined, " "); // "1.23457M"
abreviateNumber(1234.56, undefined, undefined, ","); // "1,23456K"
```

**Parameters:**
- `num`: Number to abbreviate
- `decimalDigits`: Decimal places (auto-calculated if undefined)
- `thousandsSeparator`: Thousands separator
- `decimalSeparator`: Decimal separator

**Returns:** Abbreviated string

### abreviate2FormatMoney()

Combines abbreviation with currency formatting.

```typescript
import { abreviate2FormatMoney } from '@resk/core';

abreviate2FormatMoney(1234567, "$");              // "$1.23M"
abreviate2FormatMoney(1234567, "€", 3);           // "1.235M €"
abreviate2FormatMoney(1234567, "$", 2, " ", ","); // "$1,23M"
```

## Session Management

### Currency Session

Manage global currency settings that persist across the application.

```typescript
import { Currency } from '@resk/core';

// Get current currency
const currentCurrency = Currency.session.getCurrency();

// Set currency by code
Currency.session.setCurrency("EUR");

// Set currency by object
Currency.session.setCurrency({
  code: "USD",
  symbol: "$",
  decimalDigits: 2,
  format: "%s%v"
});

// Set format pattern
Currency.session.setFormat("%s %v");

// Get format pattern
const format = Currency.session.getFormat();
```

### Session Methods

- `getCurrency()`: Get current session currency
- `setCurrency(currency)`: Set session currency
- `getFormat()`: Get current format pattern
- `setFormat(format)`: Set format pattern

## Utility Functions

### prepareOptions()

Merges user options with default currency settings.

```typescript
const options = { format: "$%v", decimalDigits: 3 };
const prepared = Currency.prepareOptions(options);
// Returns merged object with session defaults
```

### checkPrecision()

Normalizes decimal digits to positive integers.

```typescript
Currency.checkPrecision(2.7);    // 3 (rounded)
Currency.checkPrecision(-1);     // 0 (absolute value)
Currency.checkPrecision(NaN, 2); // 2 (fallback)
```

### checkCurrencyFormat()

Validates and normalizes format patterns.

```typescript
Currency.checkCurrencyFormat("%s%v");     // { pos: "%s%v", neg: "-%s%v", zero: "%s%v" }
Currency.checkCurrencyFormat("%v %s");    // { pos: "%v %s", neg: "-%v %s", zero: "%v %s" }
```

### isValidCurrency()

Validates currency objects.

```typescript
Currency.isValidCurrency({ name: "USD", symbol: "$" }); // true
Currency.isValidCurrency({ name: "Invalid" });         // false
Currency.isValidCurrency("string");                    // false
```

## Number Prototype Extensions

### Helper Methods

```typescript
// Count decimal places
(1.5).countDecimals();     // 1
(1.56).countDecimals();    // 2
(1.567).countDecimals();   // 3
(1).countDecimals();       // 0

// Format number
(1234.56).formatNumber();           // "1,234.56"
(1234.56).formatNumber(3);          // "1,234.568"
(1234.56).formatNumber(2, " ", ","); // "1 234,56"

// Format as money
(1234.56).formatMoney();            // "1,234.56 $"
(1234.56).formatMoney("€");         // "1,234.56 €"

// Abbreviate
(1234).abreviate2FormatNumber();    // "1.23K"
(1234567).abreviate2FormatMoney("$"); // "$1.23M"
```

## Integration Examples

### E-commerce Price Display

```typescript
function displayPrice(amount: number, currency: string = 'USD') {
  const formatter = `format${currency}`;
  return (amount as any)[formatter]();
}

// Usage
displayPrice(99.99);       // "$99.99"
displayPrice(99.99, 'EUR'); // "99.99 €"
```

### Financial Dashboard

```typescript
function formatFinancialData(data: { revenue: number, expenses: number }) {
  return {
    revenue: data.revenue.formatUSD(),
    expenses: data.expenses.formatUSD(),
    profit: (data.revenue - data.expenses).formatUSD(),
    revenueAbbrev: data.revenue.abreviate2FormatUSD(),
    expensesAbbrev: data.expenses.abreviate2FormatUSD()
  };
}
```

### Multi-currency Support

```typescript
class CurrencyFormatter {
  constructor(private currencyCode: string) {}

  format(amount: number): string {
    const formatter = `format${this.currencyCode}`;
    return (amount as any)[formatter]();
  }

  abbreviate(amount: number): string {
    const formatter = `abreviate2Format${this.currencyCode}`;
    return (amount as any)[formatter]();
  }
}

const usdFormatter = new CurrencyFormatter('USD');
usdFormatter.format(1234.56);    // "$1,234.56"
usdFormatter.abbreviate(1234567); // "$1.23M"
```

### Form Input Handling

```typescript
function parseCurrencyInput(input: string): number {
  // Remove currency symbols and formatting
  return Currency.unformat(input);
}

function formatCurrencyOutput(amount: number): string {
  return Currency.formatMoney(amount);
}

// Usage in forms
const inputAmount = parseCurrencyInput("$1,234.56");     // 1234.56
const displayAmount = formatCurrencyOutput(1234.56);     // "1,234.56 $"
```

### Internationalization

```typescript
// Set locale-based currency
function setLocaleCurrency(locale: string) {
  const localeCurrencies = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'fr-FR': 'EUR',
    'ja-JP': 'JPY',
    'cm-CM': 'XAF'
  };

  const currencyCode = localeCurrencies[locale] || 'USD';
  Currency.session.setCurrency(currencyCode);
}

// Usage
setLocaleCurrency('fr-FR');  // Sets EUR as default
(1234.56).formatEUR();       // "1,234.56 €"
```

## Supported Currencies

### Major World Currencies

| Code | Name | Symbol | Decimals |
|------|------|--------|----------|
| USD | US Dollar | $ | 2 |
| EUR | Euro | € | 2 |
| GBP | British Pound | £ | 2 |
| CAD | Canadian Dollar | CA$ | 2 |
| AUD | Australian Dollar | AU$ | 2 |
| CHF | Swiss Franc | CHF | 2 |
| JPY | Japanese Yen | ¥ | 0 |

### African Currencies

| Code | Name | Symbol | Decimals |
|------|------|--------|----------|
| XAF | Central African CFA Franc | FCFA | 0 |
| XOF | West African CFA Franc | CFA | 0 |
| ZAR | South African Rand | R | 2 |
| EGP | Egyptian Pound | E£ | 2 |
| NGN | Nigerian Naira | ₦ | 2 |

### Asian Currencies

| Code | Name | Symbol | Decimals |
|------|------|--------|----------|
| CNY | Chinese Yuan | ¥ | 2 |
| INR | Indian Rupee | ₹ | 2 |
| KRW | South Korean Won | ₩ | 0 |
| SGD | Singapore Dollar | S$ | 2 |

## Edge Cases and Limitations

### JavaScript Number Precision

```typescript
// Large numbers lose precision
(123456789012345678901234567890).formatUSD();
// May lose precision due to JavaScript number limitations

// Very small decimals
(0.0000001).formatUSD(); // May round to 0.00
```

### Format Parsing Limitations

```typescript
// Complex format strings may not parse correctly
Currency.parseFormat("%s %v .## extra text");
// May not extract decimal digits correctly
```

### Session vs. Direct Formatting

```typescript
// Session settings may not apply to all formatters
Currency.session.setCurrency('EUR');
(1234.56).formatUSD(); // Still formats as USD, not EUR
// Dynamic formatters use their specific currency, not session
```

### Bracketed Negative Parsing

```typescript
// Bracketed negatives work for simple cases
Currency.unformat("($1,234.56)"); // -1234.56

// But may fail with complex formatting
Currency.unformat("($ 1,234.56)"); // May not negate correctly
```

### Zero Handling

```typescript
// Zero formatting depends on decimal digits setting
Currency.formatMoney(0); // "0 $" (no decimals shown)
Currency.formatMoney(0, "$", 2); // "0.00 $" (decimals shown)
```

### Array Unformatting

```typescript
// Arrays are joined and parsed as single string
Currency.unformat(["$1,234.56", "$2,345.67"]);
// Results in: 1234.562345 (joined then parsed)
```

## Best Practices

### 1. Choose Appropriate Formatters

```typescript
// Use dynamic formatters for user-facing display
(1234.56).formatUSD(); // "$1,234.56"

// Use basic functions for programmatic formatting
Currency.formatMoney(1234.56, "$"); // "1,234.56 $"
```

### 2. Handle User Input Carefully

```typescript
function safeParseAmount(input: string): number {
  const parsed = Currency.unformat(input);
  return isNaN(parsed) ? 0 : parsed;
}
```

### 3. Set Session Currency for Consistency

```typescript
// Set once at app initialization
Currency.session.setCurrency('USD');

// All subsequent formatting will use USD unless overridden
```

### 4. Use Abbreviation for Large Numbers

```typescript
function displayAmount(amount: number): string {
  if (amount >= 1000000) {
    return amount.abreviate2FormatUSD();
  }
  return amount.formatUSD();
}
```

### 5. Validate Currency Objects

```typescript
function isValidCurrencyConfig(config: any): config is ICurrency {
  return Currency.isValidCurrency(config);
}
```

## API Reference

### Main Export: `Currency`

```typescript
const Currency = {
  // Core functions
  formatMoney: (number, symbol?, decimalDigits?, thousandSeparator?, decimalSeparator?, format?) => string
  formatMoneyAsObject: (number, symbol?, decimalDigits?, thousandSeparator?, decimalSeparator?, format?) => object
  formatNumber: (number, optionsOrDecimalDigits?, thousandSeparator?, decimalSeparator?) => string
  unformat: (value, decimalSeparator?) => number
  toFixed: (value, decimalDigits?) => string
  parseFormat: (format?) => ICurrency

  // Data
  currencies: ICurrencies
  session: SessionManager

  // Utilities
  isValidCurrency: (obj) => boolean
  prepareOptions: (options?) => ICurrency
  checkPrecision: (val?, base?) => number
  checkCurrencyFormat: (format) => object
  formatDescription: string
}
```

### Number Prototype Extensions

```typescript
interface Number {
  // Dynamic formatters (200+ currencies)
  formatUSD(decimalDigits?, thousandSeparator?, decimalSeparator?, format?): string
  formatEUR(decimalDigits?, thousandSeparator?, decimalSeparator?, format?): string
  // ... all currencies

  // Dynamic abbreviation formatters
  abreviate2FormatUSD(decimalDigits?, thousandSeparator?, decimalSeparator?, format?): string
  // ... all currencies

  // Helper methods
  countDecimals(): number
  formatNumber(optionsOrDecimalDigits?, thousandSeparator?, decimalSeparator?): string
  formatMoney(symbol?, decimalDigits?, thousandSeparator?, decimalSeparator?, format?): string
  abreviate2FormatNumber(decimalDigits?, thousandSeparator?, decimalSeparator?): string
  abreviate2FormatMoney(symbol?, decimalDigits?, thousandSeparator?, decimalSeparator?, format?): string
}
```

This comprehensive guide covers all features of the Currency module. The module provides robust currency handling with extensive customization options, supporting global applications with multi-currency requirements.