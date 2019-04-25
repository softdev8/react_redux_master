import R from 'ramda';
import Immutable from 'immutable';

// TODO this could be memoized
export const getRootSubjectChildren = (subjects)=>{
  const rootSubject = subjects.get('0');
  const children = R.map((hash)=>subjects.get(hash))(rootSubject.get('children'));

  const childrenData = R.map((item)=>{
    return item.get('data').update('hash', ()=>item.get('hash')).update('iteration', ()=>item.get('iteration'));
  })(children);

  return childrenData
}