import { Resource, Field } from "../src";
import { getResourceMetaData } from '../src/decorators/resources/index';

@Resource({})
class User{

}

console.log(getResourceMetaData(User));