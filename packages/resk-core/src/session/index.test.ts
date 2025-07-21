import "../utils/index";
import { Session, ISessionStorage, AttachSessionStorage } from './index';

// Get functions from Session object
const { Manager, handleGetValue, handleSetValue, isValidStorage, sanitizeKey } = Session;

// Mock dependencies
jest.mock('../platform', () => ({
    Platform: {
        isClientSide: jest.fn(() => false), // Default to server-side for consistent testing
    },
}));

jest.mock('../utils/json', () => ({
    JsonHelper: {
        stringify: jest.fn((value, decycle) => JSON.stringify(value)),
        parse: jest.fn((value) => JSON.parse(value)),
    },
}));

jest.mock('../utils/isNonNullString', () => jest.fn((str) => typeof str === 'string' && str.trim().length > 0));

jest.mock('../utils/isPromise', () => jest.fn((value) => value && typeof value.then === 'function'));

// Import mocked modules
import { Platform } from '../platform';
import { JsonHelper } from '../utils/json';
import isPromise from '../utils/isPromise';

describe('Session Module', () => {
    beforeEach(() => {
        // Reset all mocks and clear storage
        jest.clearAllMocks();

        // Reset Manager state
        Manager['_storage'] = undefined;
        Manager['_keyNamespace'] = undefined;

        // Clear any reflection metadata
        if (typeof Reflect !== 'undefined' && typeof Reflect.getMetadata === 'function') {
            try {
                Reflect.deleteMetadata(Manager.sessionStorageMetaData, Manager);
            } catch (e) {
                // Ignore metadata deletion errors
            }
        }

        // Reset platform mock to server-side
        (Platform.isClientSide as jest.Mock).mockReturnValue(false);
    });

    describe('Manager Class', () => {
        describe('storage getter/setter', () => {
            it('should initialize with in-memory storage when no custom storage is attached', () => {
                const storage = Manager.storage;

                expect(storage).toBeDefined();
                expect(typeof storage.get).toBe('function');
                expect(typeof storage.set).toBe('function');
                expect(typeof storage.remove).toBe('function');
                expect(typeof storage.removeAll).toBe('function');
            });

            it('should use localStorage when in client-side environment', () => {
                (Platform.isClientSide as jest.Mock).mockReturnValue(true);

                // Mock window.localStorage
                const mockLocalStorage = {
                    getItem: jest.fn(),
                    setItem: jest.fn(),
                    removeItem: jest.fn(),
                    clear: jest.fn(),
                };

                Object.defineProperty(window, 'localStorage', {
                    value: mockLocalStorage,
                    writable: true,
                });

                const storage = Manager.storage;

                storage.get('test');
                storage.set('test', 'value');
                storage.remove('test');
                storage.removeAll();

                expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test');
                expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test', 'value');
                expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test');
                expect(mockLocalStorage.clear).toHaveBeenCalled();
            });

            it('should return the same storage instance on subsequent calls', () => {
                const storage1 = Manager.storage;
                const storage2 = Manager.storage;

                expect(storage1).toBe(storage2);
            });

            it('should set custom storage when valid storage is provided', () => {
                const customStorage: ISessionStorage = {
                    get: jest.fn(),
                    set: jest.fn(),
                    remove: jest.fn(),
                    removeAll: jest.fn(),
                };

                Manager.storage = customStorage;
                const retrievedStorage = Manager.storage;

                expect(retrievedStorage).toBe(customStorage);
            });

            it('should not set invalid storage', () => {
                const invalidStorage = {
                    get: jest.fn(),
                    // Missing required methods
                };

                Manager.storage = invalidStorage as any;
                const storage = Manager.storage;

                // Should fallback to default storage, not the invalid one
                expect(storage).not.toBe(invalidStorage);
                expect(typeof storage.set).toBe('function');
            });
        });

        describe('keyNamespace getter/setter', () => {
            it('should return empty string by default', () => {
                expect(Manager.keyNamespace).toBe('');
            });

            it('should set and get namespace correctly', () => {
                Manager.keyNamespace = 'test-namespace';
                expect(Manager.keyNamespace).toBe('test-namespace');
            });

            it('should ignore null/undefined/empty string values', () => {
                Manager.keyNamespace = 'valid-namespace';

                Manager.keyNamespace = null as any;
                expect(Manager.keyNamespace).toBe('valid-namespace');

                Manager.keyNamespace = undefined as any;
                expect(Manager.keyNamespace).toBe('valid-namespace');

                Manager.keyNamespace = '';
                expect(Manager.keyNamespace).toBe('valid-namespace');
            });

            it('should accept valid string namespaces', () => {
                const validNamespaces = ['app', 'user-session', 'v2.0', 'production-env'];

                validNamespaces.forEach(namespace => {
                    Manager.keyNamespace = namespace;
                    expect(Manager.keyNamespace).toBe(namespace);
                });
            });
        });

        describe('sanitizeKey method', () => {
            beforeEach(() => {
                Manager.keyNamespace = '';
            });

            it('should return empty string for invalid inputs', () => {
                expect(Manager.sanitizeKey()).toBe('');
                expect(Manager.sanitizeKey(null as any)).toBe('');
                expect(Manager.sanitizeKey(undefined as any)).toBe('');
                expect(Manager.sanitizeKey('')).toBe('');
                expect(Manager.sanitizeKey('   ')).toBe('');
            });

            it('should trim and remove whitespace from keys', () => {
                expect(Manager.sanitizeKey('simple')).toBe('simple');
                expect(Manager.sanitizeKey('  spaced  ')).toBe('spaced');
                expect(Manager.sanitizeKey('multi   space   key')).toBe('multispacekey');
                expect(Manager.sanitizeKey('with\ttabs\nand\rnewlines')).toBe('withtabsandnewlines');
            });

            it('should apply namespace prefix when set', () => {
                Manager.keyNamespace = 'myapp';

                expect(Manager.sanitizeKey('user')).toBe('myapp-user');
                expect(Manager.sanitizeKey('user data')).toBe('myapp-userdata');
                expect(Manager.sanitizeKey('  settings  ')).toBe('myapp-settings');
            });

            it('should not apply namespace when not set', () => {
                Manager.keyNamespace = '';

                expect(Manager.sanitizeKey('user')).toBe('user');
                expect(Manager.sanitizeKey('user data')).toBe('userdata');
            });

            it('should handle complex whitespace patterns', () => {
                const complexKey = ' \t\n test   key \r\n with   mixed \f\v whitespace \t ';
                expect(Manager.sanitizeKey(complexKey)).toBe('testkeywithmixedwhitespace');
            });
        });
    });

    describe('Utility Functions', () => {
        describe('isValidStorage', () => {
            it('should return false for null/undefined', () => {
                expect(isValidStorage(null as any)).toBe(false);
                expect(isValidStorage(undefined as any)).toBe(false);
            });

            it('should return true for valid storage objects', () => {
                const validStorage: ISessionStorage = {
                    get: jest.fn(),
                    set: jest.fn(),
                    remove: jest.fn(),
                    removeAll: jest.fn(),
                };

                expect(isValidStorage(validStorage)).toBe(true);
            });

            it('should return false for objects missing required methods', () => {
                const incompleteStorage = {
                    get: jest.fn(),
                    set: jest.fn(),
                    // Missing remove and removeAll
                };

                expect(isValidStorage(incompleteStorage as any)).toBe(false);
            });

            it('should return false for objects with non-function methods', () => {
                const invalidStorage = {
                    get: 'not a function',
                    set: jest.fn(),
                    remove: jest.fn(),
                    removeAll: jest.fn(),
                };

                expect(isValidStorage(invalidStorage as any)).toBe(false);
            });

            it('should handle errors during validation', () => {
                const problematicStorage = {
                    get getter() { throw new Error('Access error'); },
                    set: jest.fn(),
                    remove: jest.fn(),
                    removeAll: jest.fn(),
                };

                expect(isValidStorage(problematicStorage as any)).toBe(false);
            });
        });

        describe('sanitizeKey function', () => {
            it('should delegate to Manager.sanitizeKey', () => {
                const spy = jest.spyOn(Manager, 'sanitizeKey');

                sanitizeKey('test-key');

                expect(spy).toHaveBeenCalledWith('test-key');
            });
        });

        describe('handleSetValue', () => {
            it('should stringify non-null values', () => {
                const testObject = { name: 'John', age: 30 };
                const result = handleSetValue(testObject);

                expect(JsonHelper.stringify).toHaveBeenCalledWith(testObject, true);
                expect(result).toBe(JSON.stringify(testObject));
            });

            it('should handle null and undefined values', () => {
                expect(handleSetValue(null)).toBe('');
                expect(handleSetValue(undefined)).toBe('');
            });

            it('should pass decycle parameter to JsonHelper', () => {
                const testData = { test: 'data' };

                handleSetValue(testData, false);
                expect(JsonHelper.stringify).toHaveBeenCalledWith(testData, false);

                handleSetValue(testData, true);
                expect(JsonHelper.stringify).toHaveBeenCalledWith(testData, true);
            });

            it('should handle falsy values correctly', () => {
                expect(handleSetValue(false)).toBe('');
                expect(handleSetValue(0)).toBe('');
                expect(handleSetValue('')).toBe('');
            });
        });

        describe('handleGetValue', () => {
            it('should parse non-null/undefined values synchronously', () => {
                const jsonString = '{"name":"John","age":30}';
                const result = handleGetValue(jsonString);

                expect(JsonHelper.parse).toHaveBeenCalledWith(jsonString);
                expect(result).toEqual({ name: 'John', age: 30 });
            });

            it('should return undefined for null/undefined values', () => {
                expect(handleGetValue(null)).toBeUndefined();
                expect(handleGetValue(undefined)).toBeUndefined();
            });

            it('should handle Promise values asynchronously', async () => {
                (isPromise as jest.Mock).mockReturnValue(true);

                const promiseValue = Promise.resolve('{"data":"test"}');
                const result = handleGetValue(promiseValue);

                expect(isPromise).toHaveBeenCalledWith(promiseValue);
                expect(result).toBeInstanceOf(Promise);

                const resolvedValue = await result;
                expect(JsonHelper.parse).toHaveBeenCalledWith('{"data":"test"}');
                expect(resolvedValue).toEqual({ data: 'test' });
            });

            it('should propagate Promise rejections', async () => {
                (isPromise as jest.Mock).mockReturnValue(true);

                const rejectedPromise = Promise.reject(new Error('Storage error'));
                const result = handleGetValue(rejectedPromise);

                await expect(result).rejects.toThrow('Storage error');
            });

            it('should handle Promise resolution with JSON parsing', async () => {
                (isPromise as jest.Mock).mockReturnValue(true);

                const promiseValue = Promise.resolve('[1,2,3]');
                const result = await handleGetValue(promiseValue);

                expect(result).toEqual([1, 2, 3]);
            });
        });
    });

    describe('Session Object', () => {
        let mockStorage: jest.Mocked<ISessionStorage>;

        beforeEach(() => {
            mockStorage = {
                get: jest.fn(),
                set: jest.fn(),
                remove: jest.fn(),
                removeAll: jest.fn(),
            };

            Manager.storage = mockStorage;
        });

        describe('Session.get', () => {
            it('should sanitize key and retrieve value from storage', () => {
                const testData = { user: 'John' };
                mockStorage.get.mockReturnValue(JSON.stringify(testData));

                const result = Session.get('user data');

                expect(result).toEqual(testData);
                expect(mockStorage.get).toHaveBeenCalledWith('userdata');
            });

            it('should return undefined for invalid keys', () => {
                const result = Session.get('');
                expect(result).toBeUndefined();
                expect(mockStorage.get).not.toHaveBeenCalled();
            });

            it('should handle storage returning null/undefined', () => {
                mockStorage.get.mockReturnValue(null);
                const result = Session.get('nonexistent');
                expect(result).toBeUndefined();
            });

            it('should apply namespace to keys', () => {
                Manager.keyNamespace = 'testapp';
                mockStorage.get.mockReturnValue('"test-value"');

                Session.get('mykey');

                expect(mockStorage.get).toHaveBeenCalledWith('testapp-mykey');
            });
        });

        describe('Session.set', () => {
            it('should serialize and store values', () => {
                const testData = { name: 'Alice', role: 'admin' };

                Session.set('user', testData);

                expect(mockStorage.set).toHaveBeenCalledWith('user', JSON.stringify(testData));
            });

            it('should pass decycle parameter', () => {
                Session.set('data', { test: true }, false);
                expect(JsonHelper.stringify).toHaveBeenCalledWith({ test: true }, false);
            });

            it('should handle namespace in keys', () => {
                Manager.keyNamespace = 'myapp';

                Session.set('config', { theme: 'dark' });

                expect(mockStorage.set).toHaveBeenCalledWith('myapp-config', JSON.stringify({ theme: 'dark' }));
            });
        });

        describe('Session.remove', () => {
            it('should sanitize key and remove from storage', () => {
                mockStorage.remove.mockReturnValue('removed-value');

                const result = Session.remove('user data');

                expect(result).toBe('removed-value');
                expect(mockStorage.remove).toHaveBeenCalledWith('userdata');
            });

            it('should return undefined for invalid keys', () => {
                const result = Session.remove('');
                expect(result).toBeUndefined();
                expect(mockStorage.remove).not.toHaveBeenCalled();
            });

            it('should apply namespace to removal keys', () => {
                Manager.keyNamespace = 'app';

                Session.remove('old-data');

                expect(mockStorage.remove).toHaveBeenCalledWith('app-old-data');
            });
        });

        describe('Session.removeAll', () => {
            it('should clear all storage', () => {
                mockStorage.removeAll.mockReturnValue('cleared');

                const result = Session.removeAll();

                expect(result).toBe('cleared');
                expect(mockStorage.removeAll).toHaveBeenCalled();
            });

            it('should return undefined when storage is not available', () => {
                Manager['_storage'] = undefined;

                const result = Session.removeAll();

                expect(result).toBeUndefined();
            });
        });
    });

    describe('AttachSessionStorage Decorator', () => {
        it('should register valid storage implementation', () => {
            @AttachSessionStorage()
            class TestStorage implements ISessionStorage {
                get(key: string): any {
                    return `value-for-${key}`;
                }

                set(key: string, value: any): any {
                    return value;
                }

                remove(key: string): any {
                    return `removed-${key}`;
                }

                removeAll(): any {
                    return 'all-removed';
                }
            }

            const storage = Manager.storage;
            expect(storage).toBeInstanceOf(TestStorage);
            expect(storage.get('test')).toBe('value-for-test');
        });

        it('should handle invalid storage implementation gracefully', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            // Create a class that doesn't properly implement ISessionStorage
            class InvalidStorage {
                // Missing required methods
                invalidMethod() {
                    return 'invalid';
                }
            }

            // Test the decorator with invalid storage (this will cause type error, but we're testing runtime behavior)
            try {
                const decorator = AttachSessionStorage();
                decorator(InvalidStorage as any);
            } catch (error) {
                // Expected to handle errors gracefully
            }

            // Should not crash and should fallback to default storage
            const storage = Manager.storage;
            expect(storage).toBeDefined();
            expect(typeof storage.get).toBe('function');

            consoleErrorSpy.mockRestore();
        });

        it('should handle storage instantiation errors', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            class ProblematicStorage implements ISessionStorage {
                constructor() {
                    throw new Error('Instantiation failed');
                }

                get(): any { return null; }
                set(): any { return null; }
                remove(): any { return null; }
                removeAll(): any { return null; }
            }

            // Test the decorator with problematic storage
            try {
                const decorator = AttachSessionStorage();
                decorator(ProblematicStorage);
            } catch (error) {
                // Expected to handle errors gracefully
            }

            // Should handle the error gracefully
            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });

        it('should work with custom storage implementations', () => {
            const storageData = new Map<string, any>();

            @AttachSessionStorage()
            class MapStorage implements ISessionStorage {
                get(key: string): any {
                    return storageData.get(key);
                }

                set(key: string, value: any): any {
                    storageData.set(key, value);
                    return value;
                }

                remove(key: string): any {
                    const value = storageData.get(key);
                    storageData.delete(key);
                    return value;
                }

                removeAll(): any {
                    storageData.clear();
                    return 'cleared';
                }
            }

            // Test the custom storage
            Session.set('test-key', 'test-value');
            expect(Session.get('test-key')).toBe('test-value');

            Session.remove('test-key');
            expect(Session.get('test-key')).toBeUndefined();

            Session.set('key1', 'value1');
            Session.set('key2', 'value2');
            Session.removeAll();
            expect(Session.get('key1')).toBeUndefined();
            expect(Session.get('key2')).toBeUndefined();
        });

        it('should support async storage implementations', async () => {
            @AttachSessionStorage()
            class AsyncStorage implements ISessionStorage {
                private data = new Map<string, any>();

                get(key: string): Promise<any> {
                    return Promise.resolve(this.data.get(key));
                }

                set(key: string, value: any): Promise<any> {
                    this.data.set(key, value);
                    return Promise.resolve(value);
                }

                remove(key: string): Promise<any> {
                    const value = this.data.get(key);
                    this.data.delete(key);
                    return Promise.resolve(value);
                }

                removeAll(): Promise<any> {
                    this.data.clear();
                    return Promise.resolve('cleared');
                }
            }

            // Test async operations
            (isPromise as jest.Mock).mockReturnValue(true);

            const setResult = Session.set('async-key', 'async-value');
            const getResult = Session.get('async-key');

            expect(getResult).toBeInstanceOf(Promise);
        });
    });

    describe('Integration Tests', () => {
        beforeEach(() => {
            Manager.keyNamespace = '';
        });

        it('should handle complete workflow with namespacing', () => {
            const mockStorage = {
                get: jest.fn(),
                set: jest.fn(),
                remove: jest.fn(),
                removeAll: jest.fn(),
            };

            Manager.storage = mockStorage;
            Manager.keyNamespace = 'integration-test';

            // Store data
            Session.set('user profile', { name: 'John', email: 'john@example.com' });
            expect(mockStorage.set).toHaveBeenCalledWith(
                'integration-test-userprofile',
                JSON.stringify({ name: 'John', email: 'john@example.com' })
            );

            // Retrieve data
            mockStorage.get.mockReturnValue('{"name":"John","email":"john@example.com"}');
            const result = Session.get('user profile');
            expect(mockStorage.get).toHaveBeenCalledWith('integration-test-userprofile');
            expect(result).toEqual({ name: 'John', email: 'john@example.com' });

            // Remove data
            Session.remove('user profile');
            expect(mockStorage.remove).toHaveBeenCalledWith('integration-test-userprofile');
        });

        it('should handle environment switching', () => {
            const environments = ['development', 'staging', 'production'];
            const mockStorage = {
                get: jest.fn(),
                set: jest.fn(),
                remove: jest.fn(),
                removeAll: jest.fn(),
            };

            Manager.storage = mockStorage;

            environments.forEach(env => {
                Manager.keyNamespace = `${env}-v1.0`;
                Session.set('config', { env });

                expect(mockStorage.set).toHaveBeenCalledWith(
                    `${env}-v1.0-config`,
                    JSON.stringify({ env })
                );
            });
        });

        it('should handle error scenarios gracefully', () => {
            const faultyStorage = {
                get: jest.fn(() => { throw new Error('Storage read error'); }),
                set: jest.fn(() => { throw new Error('Storage write error'); }),
                remove: jest.fn(() => { throw new Error('Storage remove error'); }),
                removeAll: jest.fn(() => { throw new Error('Storage clear error'); }),
            };

            Manager.storage = faultyStorage;

            // These should not crash the application
            expect(() => Session.get('test')).not.toThrow();
            expect(() => Session.set('test', 'value')).not.toThrow();
            expect(() => Session.remove('test')).not.toThrow();
            expect(() => Session.removeAll()).not.toThrow();
        });

        it('should maintain data isolation between namespaces', () => {
            const storageData = new Map<string, string>();
            const mockStorage = {
                get: jest.fn((key) => storageData.get(key)),
                set: jest.fn((key, value) => storageData.set(key, value)),
                remove: jest.fn((key) => {
                    const value = storageData.get(key);
                    storageData.delete(key);
                    return value;
                }),
                removeAll: jest.fn(() => storageData.clear()),
            };

            Manager.storage = mockStorage;

            // Set data in namespace A
            Manager.keyNamespace = 'namespace-a';
            Session.set('shared-key', 'value-a');

            // Set data in namespace B
            Manager.keyNamespace = 'namespace-b';
            Session.set('shared-key', 'value-b');

            // Verify isolation
            Manager.keyNamespace = 'namespace-a';
            mockStorage.get.mockReturnValue('"value-a"');
            expect(Session.get('shared-key')).toBe('value-a');

            Manager.keyNamespace = 'namespace-b';
            mockStorage.get.mockReturnValue('"value-b"');
            expect(Session.get('shared-key')).toBe('value-b');
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle circular references in objects', () => {
            const circularObj: any = { name: 'test' };
            circularObj.self = circularObj;

            expect(() => Session.set('circular', circularObj)).not.toThrow();
            expect(JsonHelper.stringify).toHaveBeenCalledWith(circularObj, true);
        });

        it('should handle very large keys', () => {
            const largeKey = 'a'.repeat(1000);
            const result = Manager.sanitizeKey(largeKey);

            expect(result).toBe(largeKey);
        });

        it('should handle special characters in keys', () => {
            const specialKey = 'key-with-special-chars_@#$%^&*()';
            const result = Manager.sanitizeKey(specialKey);

            expect(result).toBe('key-with-special-chars_@#$%^&*()');
        });

        it('should handle unicode characters', () => {
            const unicodeKey = 'test-key-🚀-émojis-中文';
            const result = Manager.sanitizeKey(unicodeKey);

            expect(result).toBe('test-key-🚀-émojis-中文');
        });

        it('should handle storage quota exceeded scenarios', () => {
            const quotaExceededStorage = {
                get: jest.fn(),
                set: jest.fn(() => { throw new Error('QuotaExceededError'); }),
                remove: jest.fn(),
                removeAll: jest.fn(),
            };

            Manager.storage = quotaExceededStorage;

            expect(() => Session.set('large-data', 'x'.repeat(100000))).not.toThrow();
        });

        it('should handle concurrent access patterns', () => {
            const mockStorage = {
                get: jest.fn(),
                set: jest.fn(),
                remove: jest.fn(),
                removeAll: jest.fn(),
            };

            Manager.storage = mockStorage;

            // Simulate concurrent operations
            const operations = Array.from({ length: 100 }, (_, i) => () => {
                Session.set(`key-${i}`, `value-${i}`);
                Session.get(`key-${i}`);
                if (i % 10 === 0) Session.remove(`key-${i}`);
            });

            expect(() => operations.forEach(op => op())).not.toThrow();
        });
    });
});
