import { Field, getFields } from '@fields';
import { describe, it,expect} from 'vitest';

describe('Field Decorator', () => {
  it('should apply the Field decorator with a custom name', () => {
    class TestClass {
      @Field({name: "boris"})
      test?: string;
    }

    const instance = new TestClass();
    // Add assertions here to check if the decorator is applied correctly
    expect(getFields(new TestClass())).toBe({test:{name:"boris",type:"test"}});
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
