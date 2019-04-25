String.prototype.format = function () {
	const args = [].slice.call(arguments);
	return this.replace(/(\{\d+\})/g, function (a){
	    return args[+(a.substr(1,a.length-2))||0];
	});
};

export const promiseFunc = (dispatch, func, params)=>
  new Promise((resolve, reject)=>{
    dispatch(func.apply(
      null,
      [
        ...params,
        (error, result)=>{
          if(error){
            return reject(error);
          }
          return resolve(result);
        },
      ],
    ))  
  })