/* @flow */

import R from 'ramda';
import {Record, List, fromJS} from 'immutable';
import {byClassAndSchema} from '../decorators/postProcessClassMethondsResults';

const schema = {
  children: undefined,
  data: undefined,
  parentHash: undefined,
  hash: undefined,
  creationDate: undefined,
  iteration: undefined,
};

const _SubjectRecord = Record(schema);

@byClassAndSchema(_SubjectRecord, schema)
class SubjectRecord extends _SubjectRecord {
  toggleEdit() {
    return this.update('data', (data)=>data.update('mode', (oldMode)=> oldMode === 'edit' ? 'view' : 'edit'));
  }
  setMode(mode) {
    return this.update('data', (data)=>data.update('mode', ()=> mode));
  }
  getMode() {
    return this.get('data').get('mode');
  }
  addToChildren(hash, index) {
    if(index === -1){
      return this.update('children', (children)=>children.push(hash));
    } else {
      //Increment index since we are adding after the current component
      return this.update('children', (children)=>children.splice(index + 1, 0, hash));
    }
  }
  removeFromChildren(hash) {
    const indexToRemove = this.get('children').indexOf(hash);
    return this.update('children', (children)=>children.remove(indexToRemove));
  }
  moveChild(id, afterId) {
    const children = this.get('children');
    const itemToMoveIndex = children.indexOf(id);
    const afterItemIndex = children.indexOf(afterId);
    return this.update('children', (children)=>children.delete(itemToMoveIndex).splice(afterItemIndex, 0, id));
  }
  updateIteration(){
    return this.update('iteration', (iteration)=>iteration+1);
  }
}

export function subjectFct({parentHash, hash, data}) {
  return new SubjectRecord({children:new List(), creationDate:new Date(), parentHash, hash, data:fromJS(data), iteration:0});
}