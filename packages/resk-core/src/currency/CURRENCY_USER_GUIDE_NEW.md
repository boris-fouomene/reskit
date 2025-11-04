# Currency Module User Guide

## Overview

The Currency module provides a comprehensive set of utilities for formatting, parsing, and managing currency values. It is designed to handle various currencies, formats, and edge cases, ensuring accurate and locale-aware financial computations.

## Features

- **Currency Formatting**: Convert numbers into formatted currency strings.
- **Parsing**: Convert formatted currency strings back into raw numbers.
- **Customizable Options**: Support for custom symbols, decimal places, separators, and formats.
- **Session Management**: Maintain default currency settings across operations.
- **Edge Case Handling**: Robust handling of invalid inputs, large numbers, and special cases.

## API Reference

### `prepareOptions`

Merges user-provided options with default currency settings.

**Parameters:**

- `options` (optional): An object containing currency settings to override defaults.

**Returns:**

- A merged currency settings object.

**Example:**

```typescript
const options = prepareOptions({ symbol: "€", decimalDigits: 2 });
console.log(options);
```

### `checkPrecision`

Normalizes the value of `decimalDigits` to ensure it is a positive integer.

**Parameters:**

- `val`: The value to normalize.
- `base`: The default value if `val` is invalid.

**Returns:**

- A positive integer representing the number of decimal places.

**Example:**

```typescript
const precision = checkPrecision(-3, 2);
console.log(precision); // Output: 2
```

### `parseFormat`

Parses a format string and extracts the number of decimal places and format structure.

**Parameters:**

- `format`: A string defining the currency format.

**Returns:**

- An object containing the parsed format and decimal digits.

**Example:**

```typescript
const format = parseFormat("%s%v .###");
console.log(format);
```

### `checkCurrencyFormat`

Generates positive, negative, and zero formats based on the provided format string.

**Parameters:**

- `format`: A string or object defining the currency format.

**Returns:**

- An object with `pos`, `neg`, and `zero` formats.

**Example:**

```typescript
const formats = checkCurrencyFormat("%s%v");
console.log(formats);
```

### `unformat`

Converts a formatted currency string into a raw number.

**Parameters:**

- `value`: The formatted currency string.
- `decimalSeparator` (optional): The decimal separator to use.

**Returns:**

- A number representing the raw value.

**Example:**

```typescript
const value = unformat("$1,234.56");
console.log(value); // Output: 1234.56
```

### `toFixed`

Rounds a number to the specified number of decimal places.

**Parameters:**

- `value`: The number to round.
- `decimalDigits` (optional): The number of decimal places.

**Returns:**

- A string representing the rounded number.

**Example:**

```typescript
const rounded = toFixed(0.615, 2);
console.log(rounded); // Output: "0.62"
```

### `formatNumber`

Formats a number with thousands separators and custom decimal places.

**Parameters:**

- `number`: The number to format.
- `optionsOrDecimalDigits`: Options object or number of decimal places.
- `thousandSeparator` (optional): The thousand separator.
- `decimalSeparator` (optional): The decimal separator.

**Returns:**

- A formatted number string.

**Example:**

```typescript
const formatted = formatNumber(1234567.89, 2, ",", ".");
console.log(formatted); // Output: "1,234,567.89"
```

### `formatMoneyAsObject`

Formats a number into a detailed currency object.

**Parameters:**

- `number`: The number to format.
- `symbol`: The currency symbol or options object.
- `decimalDigits`: The number of decimal places.
- `thousandSeparator`: The thousand separator.
- `decimalSeparator`: The decimal separator.
- `format`: The format string.

**Returns:**

- An object containing detailed formatting information.

**Example:**

```typescript
const money = formatMoneyAsObject(1234.56, "$", 2, ",", ".");
console.log(money);
```

### `formatMoney`

Formats a number into a currency string.

**Parameters:**

- `number`: The number to format.
- `symbol`: The currency symbol or options object.
- `decimalDigits`: The number of decimal places.
- `thousandSeparator`: The thousand separator.
- `decimalSeparator`: The decimal separator.
- `format`: The format string.

**Returns:**

- A formatted currency string.

**Example:**

```typescript
const money = formatMoney(1234.56, "$", 2, ",", ".");
console.log(money); // Output: "$1,234.56"
```

### `formatDescription`

A string describing the format for displaying numeric values.

**Example:**

```typescript
console.log(formatDescription);
```

### `session`

Manages the default currency settings for the module.

**Example:**

```typescript
Currency.session.setCurrency({ symbol: "€", decimalDigits: 2 });
const current = Currency.session.getCurrency();
console.log(current);
```

### `currencies`

Provides a list of supported currencies.

**Example:**

```typescript
console.log(Currency.currencies);
```

## Edge Cases

- **Bracketed Negatives**: Ensure proper handling of values like `($1,234.56)`.
- **Large Numbers**: Handles integers larger than 15 digits.
- **Invalid Inputs**: Returns `0` for `NaN` or invalid inputs.
- **Custom Separators**: Supports different thousand and decimal separators.

## Recommendations

- Improve handling of scientific notation.
- Enhance support for locale-specific formats.
- Add more robust error handling for invalid inputs.

## Testing

Run the following command to execute the test suite:

```bash
npm test
```

## Conclusion

The Currency module is a powerful and flexible tool for managing currency values in JavaScript/TypeScript applications. By leveraging its comprehensive API and robust handling of edge cases, developers can ensure accurate and user-friendly financial computations.
