import 'reflect-metadata';
import { Field, getFields, fieldsMetaData } from './index';

declare module "../types" {
    export interface IFieldBase {
        label?: string;
    }
}
describe('Field Decorator and getFields Function', () => {
    // Test class with decorated properties
    class TestClass {
        @Field({ type: 'text', label: 'Username' })
        username?: string;

        @Field({ type: 'number', label: 'Age' })
        age?: number;

        @Field({ type: 'boolean', label: 'Is Active' })
        isActive?: boolean;

        @Field({ type: 'date', label: 'Created At' })
        createdAt?: Date;

        @Field({ type: 'text', label: 'Description' })
        description?: string;
    }

    // Test 1: Verify that the Field decorator attaches metadata correctly
    it('should attach metadata to class properties', () => {
        const metadata = getFields(TestClass);

        expect(metadata).toBeDefined();
        expect(metadata.username).toEqual({
            name: 'username',
            type: 'text',
            label: 'Username',
        });
        expect(metadata.age).toEqual({
            name: 'age',
            type: 'number',
            label: 'Age',
        });
        expect(metadata.isActive).toEqual({
            name: 'isActive',
            type: 'boolean',
            label: 'Is Active',
        });
        expect(metadata.createdAt).toEqual({
            name: 'createdAt',
            type: 'date',
            label: 'Created At',
        });
        expect(metadata.description).toEqual({
            name: 'description',
            type: 'text',
            label: 'Description',
        });
    });

    // Test 2: Verify that getFields retrieves the correct metadata
    it('should retrieve metadata using getFields', () => {
        const fields = getFields(TestClass);

        expect(fields).toBeDefined();
        expect(fields.username).toEqual({
            name: 'username',
            type: 'text',
            label: 'Username',
        });
        expect(fields.age).toEqual({
            name: 'age',
            type: 'number',
            label: 'Age',
        });
        expect(fields.isActive).toEqual({
            name: 'isActive',
            type: 'boolean',
            label: 'Is Active',
        });
        expect(fields.createdAt).toEqual({
            name: 'createdAt',
            type: 'date',
            label: 'Created At',
        });
        expect(fields.description).toEqual({
            name: 'description',
            type: 'text',
            label: 'Description',
        });
    });

    // Test 3: Verify that the default type is assigned if not specified
    it('should assign a default type if none is specified', () => {
        class DefaultTypeClass {
            @Field({ type: "text", label: 'Default Type Field' })
            defaultField?: string;
        }

        const metadata = getFields(DefaultTypeClass);

        expect(metadata).toBeDefined();
        expect(metadata.defaultField).toEqual({
            name: 'defaultField',
            type: 'text', // Default type for string
            label: 'Default Type Field',
        });
    });

    // Test 4: Verify that getFields returns an empty object if no metadata exists
    it('should return an empty object if no metadata exists', () => {
        class NoMetadataClass {
            noMetadataField?: string;
        }
        const fields = getFields(NoMetadataClass);
        expect(fields).toEqual({});
    });
});