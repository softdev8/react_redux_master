export default (transformMethod) => (target) =>{
  // (Using reflect to get all keys including symbols)
  let keys;
  // Use Reflect if exists
  if (typeof Reflect !== 'undefined') {
    keys = Reflect.ownKeys(target.prototype);
  } else {
    keys = Object.getOwnPropertyNames(target.prototype);
    // use symbols if support is provided
    if (typeof Object.getOwnPropertySymbols === 'function') {
      keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
    }
  }

  keys.forEach(key => {
    // Ignore special case target method
    if (key === 'constructor') {
      return;
    }

    let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

    // Only methods need binding
    if (typeof descriptor.value === 'function') {
      Object.defineProperty(target.prototype, key, transformMethod(target, key, descriptor));
    }
  });
  return target;
}