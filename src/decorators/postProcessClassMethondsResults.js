import transfromAllClassMethods from './transfromAllClassMethods'
import patchMethod from './transfromAllClassMethods'
import {shallowCopyImToObj} from '../records/utils';

const postProcessFunctionResultHook = (postFunc) => ()=>{
  const result = functionToPatch.apply(null, this.arguments);
  return postFunc(result);
}

export const byFunc = (postFunc) => transfromAllClassMethods(patchMethod((functionToPatch)=>
  postProcessFunctionResultHook(postFunc)
))

export const byClassAndSchema = (clazz, schema) => byFunc((obj)=> new clazz(shallowCopyImToObj(schema, obj)));
