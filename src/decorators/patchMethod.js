export default (patchFunction)=>(target, key, descriptor)=>{
  let fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new Error(`decorator can only be applied to methods not: ${typeof fn}`);
  }

  return {
    configurable: true,

    get() {
      let patchedFn = patchFunction(fn);
      Object.defineProperty(
        this,
        key,
        {
          value: patchedFn,
          configurable: true,
          writable: true,
        },
      );
      return patchedFn;
    },
  };
}