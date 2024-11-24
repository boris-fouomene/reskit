"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const currency_1 = __importDefault(require("../../src/currency"));
const { formatNumber, formatMoney } = currency_1.default;
(0, vitest_1.describe)('formatMoney', () => {
    (0, vitest_1.it)('should format positive numbers correctly', () => {
        (0, vitest_1.expect)(formatMoney(1000)).toBe('$1,000.00');
        (0, vitest_1.expect)(formatMoney(1234567.89)).toBe('$1,234,567.89');
    });
    (0, vitest_1.it)('should format negative numbers correctly', () => {
        (0, vitest_1.expect)(formatMoney(-500)).toBe('-$500.00');
        (0, vitest_1.expect)(formatMoney(-9876.54)).toBe('-$9,876.54');
    });
    (0, vitest_1.it)('should handle zero correctly', () => {
        (0, vitest_1.expect)(formatMoney(0)).toBe('$0.00');
    });
    (0, vitest_1.it)('should handle decimal numbers with more than 2 decimal places', () => {
        (0, vitest_1.expect)(formatMoney(123.4567)).toBe('$123.46');
        (0, vitest_1.expect)(formatMoney(0.001)).toBe('$0.00');
    });
    (0, vitest_1.it)('should handle very large numbers', () => {
        (0, vitest_1.expect)(formatMoney(1000000000)).toBe('$1,000,000,000.00');
    });
    (0, vitest_1.it)('should handle very small decimal numbers', () => {
        (0, vitest_1.expect)(formatMoney(0.00001)).toBe('$0.00');
    });
});
