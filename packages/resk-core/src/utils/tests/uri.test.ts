
import { extractQueryString, getQueryParams, removeQueryString, setQueryParams, objectToQueryString, parseURI, isValidUrl } from '../index';

describe('URI Utils', () => {
  describe('extractQueryString', () => {
    it('should return the query string with a leading "?"', () => {
      const url = 'https://example.com/path?a=1&b=2';
      expect(extractQueryString(url)).toBe('?a=1&b=2');
    });

    it('should return the query string without a leading "?"', () => {
      const url = 'https://example.com/path?a=1&b=2';
      expect(extractQueryString(url, false)).toBe('a=1&b=2');
    });

    it('should return an empty string for a URL without a query string', () => {
      const url = 'https://example.com/path';
      expect(extractQueryString(url)).toBe('');
    });
  });

  describe('getQueryParams', () => {
    it('should return query parameters as an object', () => {
      const url = 'https://example.com/path?a=1&b=2&c[]=3&c[]=4';
      expect(getQueryParams(url)).toEqual({ a: '1', b: '2', c: ['3', '4'] });
    });

    it('should return an empty object for a URL without a query string', () => {
      const url = 'https://example.com/path';
      expect(getQueryParams(url)).toEqual({});
    });
  });

  describe('removeQueryString', () => {
    it('should remove the query string from a URL', () => {
      const url = 'https://example.com/path?a=1&b=2#fragment';
      expect(removeQueryString(url)).toBe('https://example.com/path');
    });

    it('should decode the resulting URL if _decodeURIComponent is true', () => {
      const url = 'https://example.com/path%20with%20spaces?a=1&b=2';
      expect(removeQueryString(url, true)).toBe('https://example.com/path with spaces');
    });
  });

  describe('setQueryParams', () => {
    it('should add query parameters to a URL', () => {
      const url = 'https://example.com/path';
      expect(setQueryParams(url, 'a', 1)).toBe('https://example.com/path?a=1');
      expect(setQueryParams(url, { a: 1, b: 2 })).toBe('https://example.com/path?a=1&b=2');
    });

    it('should merge new query parameters with existing ones', () => {
      const url = 'https://example.com/path?a=1';
      expect(setQueryParams(url, 'b', 2)).toBe('https://example.com/path?a=1&b=2');
    });
  });

  describe('objectToQueryString', () => {
    it('should convert an object to a query string', () => {
      const obj = { a: 1, b: 2, c: { d: 3, e: 4 } };
      expect(objectToQueryString(obj)).toBe('a=1&b=2&c[d]=3&c[e]=4');
    });

    it('should encode the values if encodeURI is true', () => {
      const obj = { a: 'hello world', b: 'foo@bar.com' };
      expect(objectToQueryString(obj, true)).toBe('a=hello%20world&b=foo%40bar.com');
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://localhost:3000')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('not-a-valid-url')).toBe(false);
      expect(isValidUrl('http://256.256.256.256')).toBe(true);
    });
  });
});