import { Field } from '@fields';
import { describe, it,expect} from '@jest/globals';

describe('Field Decorator', () => {
  it('should apply the Field decorator with a custom name', () => {
    class TestClass {
      @Field({name: "boris"})
      myProperty?: string;
    }

    const instance = new TestClass();
    // Add assertions here to check if the decorator is applied correctly
    expect(Reflect.getMetadata('fieldName', instance, 'myProperty')).toBe('boris');
  });

  it('should apply the Field decorator without options', () => {
    class TestClass {
      @Field({})
      anotherProperty?: number;
    }

    const instance = new TestClass();
    // Add assertions here to check if the decorator is applied correctly
    expect(Reflect.hasMetadata('field', instance, 'anotherProperty')).toBe(true);
  });
});
