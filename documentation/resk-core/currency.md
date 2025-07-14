# 💰 Currency System - @resk/core/currency

> **Comprehensive currency formatting, conversion, and management**

## 📖 Overview

The Currency module provides a robust system for handling currency formatting, parsing, and display across different locales and formats. It includes support for decimal precision, thousand separators, currency symbols, and flexible formatting patterns.

---

## 🚀 Quick Start

### **Basic Currency Operations**

```typescript
import { Currency } from '@resk/core/currency';

// Format money with default settings
const formatted = Currency.formatMoney(1234.56);
console.log(formatted); // "$1,234.56"

// Parse formatted currency back to number
const parsed = Currency.parse("$1,234.56");
console.log(parsed); // 1234.56

// Format with custom currency
const euroFormatted = Currency.formatMoney(1234.56, {
  symbol: "€",
  format: "%v %s",
  decimalSeparator: ",",
  thousandSeparator: "."
});
console.log(euroFormatted); // "1.234,56 €"

// Number formatting without currency
const numberFormatted = Currency.formatNumber(1234567.89, 2, ",", ".");
console.log(numberFormatted); // "1,234,567.89"
```

---

## 🏗️ Core Types

### **ICurrency Interface**

```typescript
interface ICurrency {
  // Basic currency information
  symbol?: string;              // Currency symbol (e.g., "$", "€")
  name?: string;                // Full currency name
  symbolNative?: string;        // Native symbol representation
  code?: string;                // ISO currency code (USD, EUR)
  namePlural?: string;          // Plural form of currency name
  
  // Formatting options
  format?: string;              // Display format pattern
  decimalDigits?: number;       // Number of decimal places
  rounding?: number;            // Rounding precision
  decimalSeparator?: string;    // Decimal separator character
  thousandSeparator?: string;   // Thousand separator character
  
  // Regional settings
  locale?: string;              // Locale for formatting
  region?: string;              // Geographic region
}

// Example currency definitions
const USD: ICurrency = {
  symbol: "$",
  name: "United States Dollar",
  symbolNative: "$",
  decimalDigits: 2,
  rounding: 2,
  code: "USD",
  namePlural: "US dollars",
  format: "%s%v",              // $1234.56
  decimalSeparator: ".",
  thousandSeparator: ","
};

const EUR: ICurrency = {
  symbol: "€",
  name: "Euro",
  symbolNative: "€",
  decimalDigits: 2,
  rounding: 2,
  code: "EUR",
  namePlural: "euros",
  format: "%v %s",             // 1234.56 €
  decimalSeparator: ",",
  thousandSeparator: "."
};

const JPY: ICurrency = {
  symbol: "¥",
  name: "Japanese Yen",
  symbolNative: "￥",
  decimalDigits: 0,
  rounding: 0,
  code: "JPY",
  namePlural: "Japanese yen",
  format: "%s%v",              // ¥1235
  decimalSeparator: ".",
  thousandSeparator: ","
};
```

---

## 💰 Currency Formatting

### **formatMoney() Function**

```typescript
/**
 * Format a number as currency with full control over display options
 */
function formatMoney(
  value: number | string,
  options?: ICurrency | string | number
): string;

// Basic usage
Currency.formatMoney(1234.56);                    // "$1,234.56"
Currency.formatMoney(-1234.56);                   // "-$1,234.56"
Currency.formatMoney(0);                          // "$0.00"

// With decimal precision
Currency.formatMoney(1234.5678, 3);               // "$1,234.568"
Currency.formatMoney(1234.5678, 0);               // "$1,235"

// With currency symbol
Currency.formatMoney(1234.56, "€");               // "€1,234.56"
Currency.formatMoney(1234.56, "¥");               // "¥1,235"

// With full options
Currency.formatMoney(1234.56, {
  symbol: "£",
  format: "%s %v",
  decimalDigits: 2,
  decimalSeparator: ".",
  thousandSeparator: ","
});                                                // "£ 1,234.56"

// European formatting
Currency.formatMoney(1234.56, {
  symbol: "€",
  format: "%v %s",
  decimalDigits: 2,
  decimalSeparator: ",",
  thousandSeparator: "."
});                                                // "1.234,56 €"

// Large numbers
Currency.formatMoney(1234567890.123);             // "$1,234,567,890.12"

// Very small numbers
Currency.formatMoney(0.001);                      // "$0.00"
Currency.formatMoney(0.001, 3);                   // "$0.001"
```

### **Format Patterns**

```typescript
/**
 * Format string patterns using %v (value) and %s (symbol)
 */
const formatExamples = {
  // Standard formats
  "%s%v":     "$1,234.56",      // Symbol before value
  "%v %s":    "1,234.56 $",     // Value before symbol with space
  "%s %v":    "$ 1,234.56",     // Symbol before value with space
  "%v%s":     "1,234.56$",      // Value before symbol
  
  // With decimal precision patterns
  "%s%v.##":  "$1,234.56",      // Up to 2 decimal places
  "%s%v.###": "$1,234.567",     // Up to 3 decimal places
  "%s%v.":    "$1,235",         // No decimal places
  
  // Custom symbols
  "%v USD":   "1,234.56 USD",   // Text currency code
  "(%s%v)":   "($1,234.56)",    // Parentheses format
  "%s %v CAD": "$ 1,234.56 CAD" // Symbol and code
};

// Advanced formatting with custom patterns
const customFormat = Currency.formatMoney(1234.567, {
  format: "%s%v.###",
  symbol: "€",
  decimalSeparator: ",",
  thousandSeparator: " "
});
console.log(customFormat); // "€1 234,567"
```

### **formatMoneyAsObject() Function**

```typescript
/**
 * Format currency and return structured object with parts
 */
interface IFormattedMoney {
  formatted: string;      // Complete formatted string
  symbol: string;         // Currency symbol used
  value: string;          // Formatted numeric value
  negative: boolean;      // Whether value is negative
  integer: string;        // Integer part
  decimal: string;        // Decimal part
}

const moneyObj = Currency.formatMoneyAsObject(1234.56, {
  symbol: "$",
  decimalDigits: 2
});

console.log(moneyObj);
/*
{
  formatted: "$1,234.56",
  symbol: "$",
  value: "1,234.56",
  negative: false,
  integer: "1,234",
  decimal: "56"
}
*/

// Negative values
const negativeObj = Currency.formatMoneyAsObject(-1234.56);
console.log(negativeObj);
/*
{
  formatted: "-$1,234.56",
  symbol: "$",
  value: "1,234.56",
  negative: true,
  integer: "1,234",
  decimal: "56"
}
*/

// Use cases for structured formatting
function renderCurrency(amount: number, currency: ICurrency) {
  const parts = Currency.formatMoneyAsObject(amount, currency);
  
  return `
    <span class="currency ${parts.negative ? 'negative' : 'positive'}">
      <span class="symbol">${parts.symbol}</span>
      <span class="integer">${parts.integer}</span>
      <span class="decimal">.${parts.decimal}</span>
    </span>
  `;
}
```

---

## 🔢 Number Formatting

### **formatNumber() Function**

```typescript
/**
 * Format numbers without currency symbols
 */
function formatNumber(
  number: number,
  decimalDigits?: number,
  thousandSeparator?: string,
  decimalSeparator?: string
): string;

// Basic number formatting
Currency.formatNumber(1234567.89);                    // "1,234,567.89"
Currency.formatNumber(1234567.89, 0);                 // "1,234,568"
Currency.formatNumber(1234567.89, 4);                 // "1,234,567.8900"

// Custom separators
Currency.formatNumber(1234567.89, 2, ".", ",");       // "1.234.567,89"
Currency.formatNumber(1234567.89, 2, " ", ",");       // "1 234 567,89"
Currency.formatNumber(1234567.89, 2, "'", ".");       // "1'234'567.89"

// Scientific notation handling
Currency.formatNumber(1.23e6, 2);                     // "1,230,000.00"
Currency.formatNumber(1.23e-3, 6);                    // "0.001230"

// Edge cases
Currency.formatNumber(0);                              // "0"
Currency.formatNumber(NaN);                            // "NaN"
Currency.formatNumber(Infinity);                       // "Infinity"
```

---

## 🔍 Currency Parsing

### **unformat() / parse() Functions**

```typescript
/**
 * Parse formatted currency strings back to numbers
 * Aliases: Currency.unformat() and Currency.parse()
 */
function unformat(value: string | number, decimalSeparator?: string): number;

// Basic parsing
Currency.unformat("$1,234.56");           // 1234.56
Currency.unformat("€1.234,56");           // 1234.56
Currency.unformat("(1,234.56)");          // -1234.56 (brackets indicate negative)
Currency.unformat("-$1,234.56");          // -1234.56

// Different decimal separators
Currency.unformat("1.234,56", ",");       // 1234.56
Currency.unformat("1,234.56", ".");       // 1234.56

// Various formats
Currency.unformat("1234.56 USD");         // 1234.56
Currency.unformat("USD 1,234.56");        // 1234.56
Currency.unformat("¥1,235");              // 1235
Currency.unformat("£ 1,234.56");          // 1234.56

// Arrays of values
const values = ["$100.00", "€200.50", "¥300"];
const parsed = values.map(Currency.unformat);
console.log(parsed); // [100, 200.5, 300]

// Edge cases
Currency.unformat("");                     // 0
Currency.unformat("abc");                  // 0
Currency.unformat("$");                    // 0
Currency.unformat("$0.00");                // 0

// Complex formatting
Currency.unformat("$1,234,567.89");       // 1234567.89
Currency.unformat("(€1.234.567,89)");     // -1234567.89
Currency.unformat("¥ 1,234,567");         // 1234567
```

---

## 🎯 Precision & Rounding

### **toFixed() Function**

```typescript
/**
 * Enhanced toFixed that handles floating-point precision issues
 */
function toFixed(value: number, decimalDigits?: number): string;

// Standard rounding
Currency.toFixed(1.005, 2);                // "1.01" (not "1.00" like native)
Currency.toFixed(0.615, 2);                // "0.62" (not "0.61" like native)
Currency.toFixed(1.235, 2);                // "1.24"

// Large numbers
Currency.toFixed(1234567890123456789, 2);  // "1234567890123456789.00"

// Very small numbers
Currency.toFixed(0.000000123456, 8);       // "0.00000012"

// Edge cases
Currency.toFixed(NaN, 2);                  // "NaN"
Currency.toFixed(Infinity, 2);             // "Infinity"

// Comparison with native toFixed
const value = 0.615;
console.log(value.toFixed(2));             // "0.61" (incorrect)
console.log(Currency.toFixed(value, 2));   // "0.62" (correct)

// Precision control
Currency.toFixed(123.456789, 0);           // "123"
Currency.toFixed(123.456789, 2);           // "123.46"
Currency.toFixed(123.456789, 6);           // "123.456789"
```

---

## 🌍 Session Management

### **Currency Session**

```typescript
// Get current session currency
const currentCurrency = Currency.session.getCurrency();

// Set default currency for session
Currency.session.setCurrency({
  symbol: "€",
  format: "%v %s",
  decimalDigits: 2,
  decimalSeparator: ",",
  thousandSeparator: "."
});

// All subsequent operations use session defaults
Currency.formatMoney(1234.56); // "1.234,56 €"

// Override session defaults temporarily
Currency.formatMoney(1234.56, {
  symbol: "$",
  format: "%s%v"
}); // "$1,234.56"

// Session persists until changed
Currency.formatMoney(9876.54); // "9.876,54 €"
```

---

## 🗂️ Currency Database

### **Built-in Currencies**

```typescript
// Access currency database
const allCurrencies = Currency.currencies;

// Major world currencies
const majorCurrencies = {
  USD: {
    symbol: "$",
    name: "United States Dollar",
    code: "USD",
    decimalDigits: 2,
    format: "%s%v"
  },
  EUR: {
    symbol: "€",
    name: "Euro",
    code: "EUR",
    decimalDigits: 2,
    format: "%v %s"
  },
  GBP: {
    symbol: "£",
    name: "British Pound",
    code: "GBP",
    decimalDigits: 2,
    format: "%s%v"
  },
  JPY: {
    symbol: "¥",
    name: "Japanese Yen",
    code: "JPY",
    decimalDigits: 0,
    format: "%s%v"
  },
  CNY: {
    symbol: "¥",
    name: "Chinese Yuan",
    code: "CNY",
    decimalDigits: 2,
    format: "%s%v"
  }
};

// Find currency by code
function getCurrencyByCode(code: string): ICurrency | undefined {
  return Currency.currencies[code];
}

// Validate currency object
const isValid = Currency.isValidCurrency(someObject);
```

---

## 🎯 Advanced Usage

### **Multi-Currency Formatter**

```typescript
class CurrencyFormatter {
  private defaultOptions: ICurrency;
  
  constructor(defaultCurrency: ICurrency) {
    this.defaultOptions = defaultCurrency;
  }
  
  format(amount: number, currencyCode?: string): string {
    const currency = currencyCode 
      ? Currency.currencies[currencyCode] 
      : this.defaultOptions;
      
    return Currency.formatMoney(amount, currency);
  }
  
  formatRange(min: number, max: number, currencyCode?: string): string {
    const minFormatted = this.format(min, currencyCode);
    const maxFormatted = this.format(max, currencyCode);
    return `${minFormatted} - ${maxFormatted}`;
  }
  
  formatList(amounts: number[], currencyCode?: string): string[] {
    return amounts.map(amount => this.format(amount, currencyCode));
  }
  
  parseAndFormat(input: string, currencyCode?: string): string {
    const parsed = Currency.unformat(input);
    return this.format(parsed, currencyCode);
  }
}

// Usage
const formatter = new CurrencyFormatter(Currency.currencies.USD);

console.log(formatter.format(1234.56));           // "$1,234.56"
console.log(formatter.format(1234.56, "EUR"));    // "1,234.56 €"
console.log(formatter.formatRange(100, 500));     // "$100.00 - $500.00"
```

### **Currency Conversion Display**

```typescript
class CurrencyConverter {
  private rates: { [key: string]: number };
  
  constructor(exchangeRates: { [key: string]: number }) {
    this.rates = exchangeRates;
  }
  
  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = this.rates[fromCurrency] || 1;
    const toRate = this.rates[toCurrency] || 1;
    
    return (amount / fromRate) * toRate;
  }
  
  formatConversion(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): string {
    const convertedAmount = this.convert(amount, fromCurrency, toCurrency);
    
    const fromFormatted = Currency.formatMoney(amount, Currency.currencies[fromCurrency]);
    const toFormatted = Currency.formatMoney(convertedAmount, Currency.currencies[toCurrency]);
    
    return `${fromFormatted} = ${toFormatted}`;
  }
}

// Usage
const converter = new CurrencyConverter({
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110
});

console.log(converter.formatConversion(100, "USD", "EUR"));
// "$100.00 = 85.00 €"
```

### **Responsive Currency Display**

```typescript
class ResponsiveCurrencyDisplay {
  static format(amount: number, options: {
    currency: ICurrency;
    breakpoints?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    compact?: boolean;
  }): string {
    const { currency, compact = false } = options;
    
    if (compact) {
      // Compact formatting for small screens
      if (Math.abs(amount) >= 1000000) {
        return Currency.formatMoney(amount / 1000000, {
          ...currency,
          decimalDigits: 1,
          format: `%s%v M`
        });
      } else if (Math.abs(amount) >= 1000) {
        return Currency.formatMoney(amount / 1000, {
          ...currency,
          decimalDigits: 1,
          format: `%s%v K`
        });
      }
    }
    
    return Currency.formatMoney(amount, currency);
  }
  
  static abbreviate(amount: number, currency: ICurrency): string {
    const absAmount = Math.abs(amount);
    
    if (absAmount >= 1e9) {
      return Currency.formatMoney(amount / 1e9, { ...currency, decimalDigits: 1 }) + 'B';
    } else if (absAmount >= 1e6) {
      return Currency.formatMoney(amount / 1e6, { ...currency, decimalDigits: 1 }) + 'M';
    } else if (absAmount >= 1e3) {
      return Currency.formatMoney(amount / 1e3, { ...currency, decimalDigits: 1 }) + 'K';
    }
    
    return Currency.formatMoney(amount, currency);
  }
}

// Usage
const usd = Currency.currencies.USD;

console.log(ResponsiveCurrencyDisplay.format(1234567, { currency: usd }));
// "$1,234,567.00"

console.log(ResponsiveCurrencyDisplay.format(1234567, { currency: usd, compact: true }));
// "$1.2 M"

console.log(ResponsiveCurrencyDisplay.abbreviate(1234567, usd));
// "$1.2M"
```

---

## 🎯 Best Practices

### **1. Consistent Currency Handling**
```typescript
// ✅ Good: Set session defaults early
Currency.session.setCurrency(Currency.currencies.EUR);

// ✅ Good: Use type-safe currency objects
const displayPrice = (amount: number, currency: ICurrency) => {
  return Currency.formatMoney(amount, currency);
};

// ❌ Avoid: String-based currency handling
const displayPrice = (amount: number, symbol: string) => {
  return `${symbol}${amount}`;
};
```

### **2. Precision Management**
```typescript
// ✅ Good: Use toFixed for accurate rounding
const rounded = Currency.toFixed(0.615, 2); // "0.62"

// ✅ Good: Parse user input before calculations
const userInput = "$1,234.56";
const parsed = Currency.unformat(userInput);
const calculated = parsed * 1.1;
const formatted = Currency.formatMoney(calculated);

// ❌ Avoid: Native toFixed for currency
const rounded = (0.615).toFixed(2); // "0.61" (incorrect)
```

### **3. Internationalization**
```typescript
// ✅ Good: Support multiple locales
const formatForLocale = (amount: number, locale: string) => {
  const currencies = {
    'en-US': Currency.currencies.USD,
    'en-GB': Currency.currencies.GBP,
    'de-DE': Currency.currencies.EUR,
    'ja-JP': Currency.currencies.JPY
  };
  
  return Currency.formatMoney(amount, currencies[locale]);
};

// ✅ Good: Validate currency objects
if (Currency.isValidCurrency(currencyObject)) {
  // Safe to use
}
```

---

The Currency module provides comprehensive, reliable currency formatting and parsing with support for international locales, precision handling, and flexible display options.
