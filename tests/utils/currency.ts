import { describe, expect, it } from 'vitest';
import { formatMoney } from '@utils';

describe('formatMoney', () => {
  it('should format positive numbers correctly', () => {
    expect(formatMoney(1000)).toBe('$1,000.00');
    expect(formatMoney(1234567.89)).toBe('$1,234,567.89');
  });

  it('should format negative numbers correctly', () => {
    expect(formatMoney(-500)).toBe('-$500.00');
    expect(formatMoney(-9876.54)).toBe('-$9,876.54');
  });

  it('should handle zero correctly', () => {
    expect(formatMoney(0)).toBe('$0.00');
  });

  it('should handle decimal numbers with more than 2 decimal places', () => {
    expect(formatMoney(123.4567)).toBe('$123.46');
    expect(formatMoney(0.001)).toBe('$0.00');
  });

  it('should handle very large numbers', () => {
    expect(formatMoney(1000000000)).toBe('$1,000,000,000.00');
  });

  it('should handle very small decimal numbers', () => {
    expect(formatMoney(0.00001)).toBe('$0.00');
  });
});
