/* @flow weak */

import R from 'ramda'

export const shallowCopyImToObj = (schema, imObj)=>
  R.fromPairs(R.map((key)=>[key, imObj.get(key)])(R.keys(schema)));
