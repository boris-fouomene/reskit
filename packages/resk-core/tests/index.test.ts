import { createDecoratorDict, getDecoratorDict } from "../src/decorators";

const MyDecorator = createDecoratorDict('myDictionary');
@MyDecorator("key","value")
@MyDecorator("key2","value2")
@MyDecorator("key3","value3")
 class MyClass {
   myProperty?: string;
 }

 console.log(getDecoratorDict(MyClass, 'myDictionary')); // { myProperty: 'hello',[theKeyOfMyString]:'myString' }