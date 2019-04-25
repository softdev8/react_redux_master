// checks if target within provider parent
// @parent - DOMNode
// @target - DOMNode
// 
// return boolean
export default function(parent, target) {
  let result = false;

  (function goUp(nextTarget) {
    if(nextTarget == parent) {
      result = true; 
      return;
    } else if(nextTarget.parentElement) goUp(nextTarget.parentElement);
      else return;
  })(target);

  return result;
}