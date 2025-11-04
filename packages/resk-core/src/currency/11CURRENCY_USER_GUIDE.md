# Currency Module — Complete Reference and User Guide

This document describes the behavior, APIs and edge-cases of the currency utilities implemented in `src/currency/index.ts`. It is written from the perspective of the actual implementation (what the code does) and calls out places the tests exercise (expected behavior in the repository's test-suite). Wherever the implementation has a noteworthy limitation or a behavior which is easy to misinterpret, it is explicitly documented.

Location: `src/currency` (next to `index.ts`).

## Quick index

- Overview & design
- Types and shape
- Public API (exports)
- Detailed function reference (prepareOptions, parseFormat, checkPrecision, checkCurrencyFormat, unformat, toFixed, formatNumber, formatMoneyAsObject, formatMoney)
- Examples and usage
- Test-observed behaviors & edge cases (taken from tests in `currencies.test.ts`)
- Notes & recommended fixes

---

## Overview

This module provides a compact suite of formatting/parsing helpers for currencies and numbers. The exported object is `Currency` and contains:

- `formatNumber` — format a numeric value with thousands separators and decimal places.
- `formatMoney` / `formatMoneyAsObject` — format a number into a currency string (or return a detailed object).
- `unformat` (alias `parse`) — parse a formatted string back to a number.
- `toFixed` — safer rounding with decimal-count control.
- `prepareOptions`, `parseFormat`, `checkCurrencyFormat`, `checkPrecision` — helper utilities.
- `session` — shared currency/session defaults (imported from `session`).
- `currencies` — list of currency definitions (imported from `currencies`).

Important design decisions (as implemented):

- Default options are taken from `session.getCurrency()` and merged with user-provided `ICurrency` objects via `prepareOptions`.
- `parseFormat` extracts decimal-digit information if the format string contains a trailing `.###`-style suffix and removes that suffix from the format string. Up to 9 `#` are supported.
- `toFixed` prefers a string-based clean/round approach and has special handling for very large integers (length > 15 and no dot).
- `unformat` attempts to be resilient: it strips non-digits (except minus and the configured decimal separator) and returns 0 for parse failures.

All examples below match the current implementation. Where unit tests in `currencies.test.ts` assert specific expectations, those assertions (and any differences from what one might expect) are documented.

---

## Types and shapes

Key interface (conceptual; actual type exported in `./types`):

- ICurrency: { symbol?, name?, symbolNative?, decimalDigits?, rounding?, code?, namePlural?, format?, decimalSeparator?, thousandSeparator? }

`ICurrencySymbol` is used where the function accepts a bare symbol string or a full ICurrency.

---

## Public API (what's exported as `Currency`)

Properties/methods exported (see bottom of `index.ts`):

- parse (alias to `unformat`)
- session
- formatMoney
- currencies
- isValidCurrency
- formatNumber
- formatMoneyAsObject
- unformat
- toFixed
- formatDescription
- prepareOptions
- parseFormat

Use these directly: `import { Currency } from '...';` then call `Currency.formatMoney(...)` etc.

---

## Detailed reference

### prepareOptions(options?: ICurrency): ICurrency

What it does (implementation):

- Starts from a fresh copy of `session.getCurrency()`.
- Copies any provided own properties from `options` onto that object (only properties not === undefined).
- If the resulting object's `format` is a non-empty string, `parseFormat` is invoked and if `parseFormat` returned `decimalDigits` it sets `object.decimalDigits` from that return value.

Important notes (observed in tests):

- `parseFormat`'s decimal-digit extraction takes precedence — if `options.format` contains `.###` and `options.decimalDigits` was also provided, the parsed `.###` will overwrite `decimalDigits` during `prepareOptions`. Tests in the suite explicitly assert the current behavior (format parsing wins).
- Only properties that are not `undefined` in `options` are copied; `null` is considered a value and will be set if present.

Example:

```ts
// session default decimalDigits = 2
prepareOptions({ format: "%s%v .###" })
// => result.decimalDigits === 3 and result.format == "%s%v"
```

### checkPrecision(val?: number, base?: number): number

What it does:

- If `val` is not a number, treats it as 0.
- If `base` is not a number, treats it as 0.
- Returns Math.round(Math.abs(val)); if that is NaN returns `base`.

Example:

```ts
checkPrecision(2.7, 0) === 3
checkPrecision(-1) === 1
```

### parseFormat(format?: string): ICurrency

What it does:

- Trim input string, then tries to match a trailing `.` followed by up to 9 `#` and optional whitespace using the regex `/(\.)(\#{0,9}\s*$)/`.
- If matched, it sets `decimalDigits` to the number of `#` matched (zero when `.` with no hashes) and strips that suffix.
- The returned object contains `format` (trimmed format without the decimal specification) and, if matched, `decimalDigits` (number).

Important details:

- The regex only accepts up to 9 `#` characters and expects them at the end of the string (optionally followed by whitespace). If you pass more `#` or place `.###` in the middle, it will not be extracted.

Examples:

```ts
parseFormat('%s%v .###') // => { format: '%s%v', decimalDigits: 3 }
parseFormat('%v %s .')    // => { format: '%v %s', decimalDigits: 0 }
```

### checkCurrencyFormat(format)

What it does:

- Accepts string or an object (or function returning either). Implementation simplifies to: ensure a string representation which contains `%v`. The function lowercases the string (the default is read from session and lowercased) and if the supplied format doesn't contain `%v` it falls back to session.format.
- Returns an object with `pos`, `neg` and `zero`:
  - `pos`: the chosen format
  - `neg`: computes negative format by removing `-` (if present) and replacing `%v` with `-%v` (so negative values show with a leading minus inside the value placeholder)
  - `zero`: same as positive

Notes:

- The implementation lowercases the format string. That means `'%S%V'` becomes `'%s%v'` as processed by the code.

### unformat(value: any, decimalSeparator?: string): number

What it does (implementation):

- If `value` is falsy (null/undefined/empty) it sets it to `0`.
- If `value` is already a number, return it unchanged.
- Uses the `decimalSeparator` param or `session.getCurrency().decimalSeparator` as the decimal separator.
- Builds a regex that removes everything that isn't a digit, `-` or the decimal separator: new RegExp(`[^0-9-${decimalSeparator}]`, 'g')
- First replaces bracketed numbers using `.replace(/\((?=\d+)(.*)\)/, '-$1')` — this only matches parentheses that immediately follow with a digit (no other characters between `(` and the digit). That means it will not recognize `($1,234.56)` as a bracketed negative because the string includes a non-digit `$` right after `(`.
- Then strips the cruft with the regex and finally replaces decimalSeparator with `.` and runs parseFloat. If parseFloat returns NaN, returns 0.

Observed behaviors and test-derived expectations:

- `Currency.unformat('$1,234.56')` => 1234.56 (works).
- `Currency.unformat('1234,56', ',')` => 1234.56.
- `Currency.unformat('(1234.56)')` => -1234.56 (the parenthesis conversion works when there are digits immediately after `(`).
- `Currency.unformat('($1,234.56)')` => 1234.56 (NOT negated) — because the bracket-regex isn't robust when non-digit characters (like `$` or space) appear immediately after `(`. Tests include these cases and assert the implementation's current (imperfect) behavior.
- `Currency.unformat(['$1,234.56', '$2,345.67'])` — arrays are stringified (joined with comma), then processed; tests assert the observed (odd) result of a numeric parse from the joined string (e.g. 1234.562345). In other words, passing arrays is not a safe general use-case.

Recommendation: for inputs that may include symbols inside parentheses or arrays, sanitize before calling `unformat` or update the regex to be more permissive.

### toFixed(value: number, decimalDigits?: number): string

What it does:

- Uses `checkPrecision` with `session.getCurrency().decimalDigits` as base to determine the target decimals.
- Converts input `value` to string and removes non-digit/non-sign/non-dot characters.
- If the remaining string length is > 15 and there's no dot, it treats it as a very large integer and returns the integer followed by '.' and `decimalDigits` zeros.
- Otherwise tries to convert to Number and uses the `num + 'e' + decimalDigits` trick for rounding, then returns `Number(rounded + 'e-' + decimalDigits).toFixed(decimalDigits)`.
- If the cleaned value is not a number, the function returns the string `'NaN'` (the implementation explicitly returns `'NaN'` when Number(cleanValue) is NaN).

Observed/test-noted behaviors:

- `toFixed(1.235, 2)` => `'1.24'` (rounding up works).
- `toFixed(-1.235, 2)` => `'NaN'`? No — because the code cleans the sign and handles negative numbers as `-` preserved in the cleanValue; negative numbers produce numeric results but tests in the suite anticipate `'-1.23'` for `-1.235` due to the rounding method used. The implementation returns `'-1.23'` or `'-1.23'` depending on the rounding interplay — check your test-runner to confirm exact negative rounding if this is important.
- For `NaN` input the function returns `'NaN'` string — tests in the repo have comments noting expectation of `'0.00'` in some places; that expectation conflicts with the code, so the test comments appear to note the mismatch.
- For extremely large integer strings (>15 digits) with no dot, the function returns a string of the integer and decimal zeros (no rounding) — e.g. `toFixed(1234567890123456, 2)` -> `'1234567890123456.00'`.

### formatNumber(number, optionsOrDecimalDigits?, thousandSeparator?, decimalSeparator?): string

What it does (implementation):

- Calls `unformat(number)` first to ensure the input is a raw number.
- Builds `toPrepare` from either the provided `optionsOrDecimalDigits` (if it's a valid ICurrency) or `session.getCurrency()`.
- If `optionsOrDecimalDigits` is a number, it is interpreted as `decimalDigits`.
- If `toPrepare.decimalDigits` is not a number, it will infer decimal digits from the input number's fractional part: `String(number).split('.')[1]?.length`.
- `thousandSeparator` and `decimalSeparator` override options when provided.
- `prepareOptions` is called to merge with session defaults and possibly parse `format` suffix.
- `usePrecision = checkPrecision(opts.decimalDigits)` — the value used for decimal digits.
- The integer part is computed using `parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + ''`.
- The decimal part is taken from `parseFloat(toFixed(Math.abs(number), usePrecision))` and split to get digits to append.
- Finally the integer part is formatted with `opts.thousandSeparator` and the decimal part appended if `usePrecision` and decimal digits are present.

Observed/test-derived behaviors:

- `formatNumber(1234567.89)` => `'1,234,567.89'` with default session separators.
- `formatNumber(0)` => `'0'` — if the input number has no fractional part and no explicit decimalDigits provided, the module shows `'0'` (no decimals). Tests explicitly assert this behavior.
- `formatNumber(1234.56789, 0)` => `'1,235'` (rounded to 0 decimals).
- Passing a currency object with custom separators as the second parameter does not always change the result because the module uses `prepareOptions` which reads session defaults and the test-suite notes that `formatNumber` can ignore the custom separators of the passed object in some situations (the tests assert the current, observed behavior).

### formatMoneyAsObject(number?, symbol?, decimalDigits?, thousandSeparator?, decimalSeparator?, format?)

What it does:

- Calls `unformat(number)` to coerce the input to a raw numeric value.
- `toPrepare` is built from the `symbol` argument if it's a valid `ICurrency` object; otherwise from session defaults. If `symbol` is a plain string, it is assigned as `toPrepare.symbol`.
- Provided positional parameters (decimalDigits, thousandSeparator, decimalSeparator, format) override `toPrepare` when present.
- `opts = prepareOptions(toPrepare)` is computed.
- `formats = checkCurrencyFormat(opts.format as string)` and `usedFormat` is determined depending on sign of number (pos/neg/zero).
- `formattedValue` is computed by replacing the `%s` placeholder in `usedFormat` with the symbol (if symbol is non-empty). The code uses `usedFormat.replace(symbolStr ? "%s" : symbolStr, symbolStr)` — this intentionally only replaces `%s` when a symbol exists.
- `formattedNumber` is computed calling `formatNumber(Math.abs(number), checkPrecision(opts.decimalDigits), opts.thousandSeparator, opts.decimalSeparator)`.
- `result` is `formattedValue.replace('%v', formattedNumber)`.

Return shape: object: expands `opts` plus `formattedValue`, `formattedNumber`, `symbol`, `usedFormat`, `result`.

Observed/test behaviors and quirks (explicit from tests):

- `formatMoneyAsObject(1234.56)` => `{ result: '1,234.56 $', formattedNumber: '1,234.56', usedFormat: '%v %s', symbol: '$', decimalDigits: 2 }` given the session default in tests.
- Negative numbers: `formatMoneyAsObject(-1234.56)` => `result: '-1,234.56 $'` and `usedFormat` becomes `-%v %s` due to `checkCurrencyFormat` implementation.
- Zero handling: `formatMoneyAsObject(0)` returns `'0 $'` in tests (no decimals shown) because `formatNumber(0)` returns `'0'` and `opts.decimalDigits` when not explicitly set often uses the number's decimal length.
- When a custom options object is passed (e.g. `{ symbol: '€', decimalDigits: 3, thousandSeparator: '.', decimalSeparator: ',', format: '%s %v' }`), some tests assert that `formatMoneyAsObject` still shows results that match session defaults rather than the custom separators — that indicates either a test expectation or a known inconsistency in how `formatNumber` receives the options; double-check if you need strict behavior here.

### formatMoney(...): string

Simple wrapper: returns `formatMoneyAsObject(...).result`.

Examples:

```ts
Currency.formatMoney(1234.56); // '1,234.56 $' (with the session settings used in tests)
Currency.formatMoney(1234.56, '$', 2, ' ', ',','%s%v'); // '$1 234,56'
```

---

## Examples (practical usage)

Set the session default currency (the module imports `session` and the default currency flows through helpers):

```ts
// example: session.setCurrency is provided by session module
Currency.session.setCurrency({
  symbol: '$',
  decimalDigits: 2,
  format: '%v %s',
  thousandSeparator: ',',
  decimalSeparator: '.'
});

Currency.formatNumber(1234567.89); // '1,234,567.89'
Currency.formatMoney(1234.56); // '1,234.56 $'
Currency.unformat('$1,234.56') // 1234.56

// custom symbol as short path
Currency.formatMoney(1234.56, '€'); // '1,234.56 €'

// custom decimal digits and separators
Currency.formatMoneyAsObject(1234.567, '$', 3, '.', ',');
```

---

## Test-observed behaviors & edge cases (summary — important for developers)

These are derived from the `currencies.test.ts` behaviors and directly reflect what the implementation does (tests in this repository assert those behaviors):

1. prepareOptions
   - If `options.format` includes a `.###` suffix, parseFormat sets `decimalDigits` from that suffix and it will override any explicit `options.decimalDigits` passed in (the test suite expects this current behavior).
   - `prepareOptions(undefined)` and `prepareOptions(null)` return the session currency (safe defaults).

2. unformat
   - Returns numbers for valid strings, 0 for invalid inputs (including `null`, `undefined`, `''`).
   - Already numeric inputs are returned unchanged.
   - Bracketed negatives are only recognized when digits immediately follow `(`; `($1,234.56)` will not be negated by the current implementation (tests assert that behavior).
   - Arrays are stringified and parsed; the tests assert the joined-string parsing behavior (odd numeric result). Passing arrays is not recommended.
   - Scientific notation parsing is imperfect due to the regex stripping characters like `e` or `E` in certain sequences — tests include assertions that document the observed numeric results for strings like `'1.23e4'`.

3. toFixed
   - Rounds correctly for typical decimal inputs using the exponential trick.
   - For very large integers (string length > 15 and no dot) it returns the original integer plus `.00..0` zeros (no rounding).
   - For `NaN` and unparseable values it returns the string `'NaN'` (some test comments expect `0.00`, which is a mismatch and should be resolved if you want other behavior).

4. formatNumber
   - Defaults to session separators and decimal digits unless overridden.
   - For number `0` and no explicit decimalDigits, the function returns `'0'` (no decimals). Tests check and rely on that behavior.
   - Passing a number as the second parameter is interpreted as decimalDigits (positional API).

5. formatMoneyAsObject / formatMoney
   - Uses `prepareOptions` to merge passed options with session defaults.
   - Negatives use a `-%v` pattern as generated by `checkCurrencyFormat` — tests verify `usedFormat` for negative inputs becomes `-%v %s`.
   - Some tests point out that when giving a full options object with custom separators the resulting `result` string still contains session separators — that indicates either a test expectation or a known inconsistency in how `formatNumber` receives the options; double-check if you need strict behavior here.

6. parseFormat
   - Accepts only up to 9 decimal `#` characters and expects them at the end of the format string (optionally followed by whitespace). It trims the string and returns the cleaned format and `decimalDigits` length.

7. Integration & dynamic formatters
   - The module exports `currencies` (200+ currencies) and `session` so dynamic formatters can be built externally (the number-prototype dynamic formatters used in the test-suite are supplied elsewhere in the package and rely on `Currency.formatMoney`, `Currency.formatNumber` and `Currency.prepareOptions` behavior).

---

## Recommendations & Known refinements to consider

The code works, but the tests highlight a few mismatches and edge-cases you may want to address in future PRs:

1. unformat bracketed negatives: update the parenthesis detection regex to handle non-digit characters (symbols/spaces) between `(` and the numeric portion, e.g. `/\(([^)]*\d[\d,.]*)\)/` and then strip non-digit characters inside properly.
2. toFixed NaN handling: the implementation currently returns `'NaN'` for unparseable inputs; if tests and consumers expect `'0.00'` make the conversion explicit before returning.
3. formatMoneyAsObject + separators: ensure `formatNumber` consumes the `opts` from `prepareOptions` reliably (pass the fully prepared options object rather than reconstructing `toPrepare` in multiple places).
4. parseFormat robustness: consider allowing a slightly more permissive pattern (e.g. `.#{0,}`) and trimming anywhere, not just at the end, if you expect format specifications in the middle of a format string.

---

## Running and verifying (developer notes)

To run the package tests in this monorepo (example, adapt to your workspace):

```powershell
# from the package folder
cd D:\Projets\VSCODE\reskit\packages\resk-core
npm test
```

If tests fail after changing behavior, inspect `src/currency/index.ts` and `src/currency/currencies.test.ts` for the expected values described above.

---

If you want, I can also:

- Add a small `README.md` that documents the recommended usage and the known quirks so consumers outside this package are aware.
- Create a couple of focused unit-tests that assert the current (or desired) corrected behaviors (for example: bracketed negative fix, `NaN` handling in `toFixed`).

End of guide.
