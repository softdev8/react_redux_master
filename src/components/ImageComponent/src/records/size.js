/* @flow weak */
/*eslint no-new:0*/
/*eslint no-use-before-define:0*/
/*eslint new-cap:0*/

import {Record} from 'immutable'

export const SizeRecord = Record({
  width: undefined,
  height: undefined,
});

export const sizeFct = (obj) => new SizeRecord(obj);
