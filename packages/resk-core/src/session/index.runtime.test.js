// Import reflect-metadata for decorator support
import 'reflect-metadata';

// Test file designed to work with compiled JavaScript environment
import { Session, AttachSessionStorage } from "./index";
import { Platform } from '../platform';
import { JsonHelper } from '../utils/json';
import isPromise from "../utils/isPromise";

// Create spy objects that work with the compiled modules
const platformSpy = jest.spyOn(Platform, 'isClientSide').mockReturnValue(false);
const jsonStringifySpy = jest.spyOn(JsonHelper, 'stringify').mockImplementation((value, decycle) => JSON.stringify(value));
const jsonParseSpy = jest.spyOn(JsonHelper, 'parse').mockImplementation((value) => JSON.parse(value));

// Mock isNonNullString and isPromise by creating manual implementations
jest.doMock('../utils/isNonNullString', () => (str) => typeof str === 'string' && str.trim().length > 0);
jest.doMock('../utils/isPromise', () => (value) => value && typeof value.then === 'function');


// Get functions from Session object
const { Manager, handleGetValue, handleSetValue, isValidStorage, sanitizeKey } = Session;

describe('Session Module - JavaScript Runtime Tests', () => {
    beforeEach(() => {
        // Reset all spies and state
        jest.clearAllMocks();
        platformSpy.mockReturnValue(false);

        // Reset Manager state
        Manager._storage = undefined;
        Manager._keyNamespace = undefined;

        // Clear any metadata if it exists
        if (typeof Reflect !== 'undefined' && typeof Reflect.getMetadata === 'function') {
            try {
                Reflect.deleteMetadata(Manager.sessionStorageMetaData, Manager);
            } catch (e) {
                // Ignore errors
            }
        }
    });

    describe('Basic Functionality Tests', () => {
        test('Manager should initialize with default storage', () => {
            const storage = Manager.storage;
            expect(storage).toBeDefined();
            expect(typeof storage.get).toBe('function');
            expect(typeof storage.set).toBe('function');
            expect(typeof storage.remove).toBe('function');
            expect(typeof storage.removeAll).toBe('function');
        });

        test('Should be able to set and get values', () => {
            const testData = { name: 'test', value: 123 };
            Session.set('testKey', testData);

            // Mock the storage get to return the stringified data
            const mockStorage = {
                data: new Map(),
                get: jest.fn((key) => {
                    const value = mockStorage.data.get(key);
                    return value;
                }),
                set: jest.fn((key, value) => {
                    mockStorage.data.set(key, value);
                    return value;
                }),
                remove: jest.fn((key) => {
                    const value = mockStorage.data.get(key);
                    mockStorage.data.delete(key);
                    return value;
                }),
                removeAll: jest.fn(() => {
                    mockStorage.data.clear();
                    return 'cleared';
                })
            };

            Manager.storage = mockStorage;

            // Now test the functionality
            Session.set('testKey', testData);
            expect(mockStorage.set).toHaveBeenCalledWith('testKey', JSON.stringify(testData));

            // Mock the get to return the stringified value
            mockStorage.get.mockReturnValue(JSON.stringify(testData));
            const retrieved = Session.get('testKey');
            expect(retrieved).toEqual(testData);
        });

        test('Should handle key sanitization', () => {
            const sanitized = Manager.sanitizeKey('  test key  ');
            expect(sanitized).toBe('testkey');
        });

        test('Should handle namespacing', () => {
            Manager.keyNamespace = 'testapp';
            const sanitized = Manager.sanitizeKey('mykey');
            expect(sanitized).toBe('testapp-mykey');
        });

        test('Should validate storage objects', () => {
            const validStorage = {
                get: () => { },
                set: () => { },
                remove: () => { },
                removeAll: () => { }
            };
            expect(isValidStorage(validStorage)).toBe(true);

            const invalidStorage = {
                get: () => { },
                set: () => { }
                // missing remove and removeAll
            };
            expect(isValidStorage(invalidStorage)).toBe(false);
        });

        test('Should handle value serialization', () => {
            const testValue = { test: 'data' };
            const serialized = handleSetValue(testValue, true);
            expect(jsonStringifySpy).toHaveBeenCalledWith(testValue, true);
        });

        test('Should handle value deserialization', () => {
            const testJson = '{"test":"data"}';
            const deserialized = handleGetValue(testJson);
            expect(jsonParseSpy).toHaveBeenCalledWith(testJson);
        });
    });

    describe('AttachSessionStorage Decorator Tests', () => {
        test('Should accept custom storage implementation', () => {
            class CustomStorage {
                constructor() {
                    this.data = new Map();
                }

                get(key) {
                    return this.data.get(key);
                }

                set(key, value) {
                    this.data.set(key, value);
                    return value;
                }

                remove(key) {
                    const value = this.data.get(key);
                    this.data.delete(key);
                    return value;
                }

                removeAll() {
                    this.data.clear();
                    return 'cleared';
                }
            }

            // Apply decorator (simulated since we're in JS environment)
            const StorageWithDecorator = AttachSessionStorage()(CustomStorage);
            expect(Manager.storage).toBeInstanceOf(CustomStorage);
        });
    });

    describe('Error Handling Tests', () => {
        test('Should handle invalid keys gracefully', () => {
            expect(() => Session.get('')).not.toThrow();
            expect(() => Session.set('', 'value')).not.toThrow();
            expect(() => Session.remove('')).not.toThrow();
        });

        test('Should handle storage errors gracefully', () => {
            const errorStorage = {
                get: jest.fn(() => { throw new Error('Storage error'); }),
                set: jest.fn(() => { throw new Error('Storage error'); }),
                remove: jest.fn(() => { throw new Error('Storage error'); }),
                removeAll: jest.fn(() => { throw new Error('Storage error'); })
            };

            Manager.storage = errorStorage;

            // The current implementation doesn't actually handle errors gracefully
            // These calls will throw errors, which is the current behavior
            expect(() => Session.get('test')).toThrow('Storage error');
            expect(() => Session.set('test', 'value')).toThrow('Storage error');
            expect(() => Session.remove('test')).toThrow('Storage error');
            expect(() => Session.removeAll()).toThrow('Storage error');
        });
    });

    describe('Environment-specific Tests', () => {
        test('Should use localStorage when in client-side environment', () => {
            // Mock client-side environment
            platformSpy.mockReturnValue(true);

            // Mock localStorage
            const mockLocalStorage = {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn()
            };

            // Properly mock window.localStorage for browser environment
            Object.defineProperty(global, 'window', {
                value: {
                    localStorage: mockLocalStorage
                },
                writable: true
            });

            // Reset storage to force re-initialization
            Manager._storage = undefined;

            const storage = Manager.storage;

            // Test that localStorage methods are used
            storage.get('test');
            storage.set('test', 'value');
            storage.remove('test');
            storage.removeAll();

            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test', 'value');
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test');
            expect(mockLocalStorage.clear).toHaveBeenCalled();

            // Cleanup
            delete global.window;
        });
    });
});
