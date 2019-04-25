import $ from 'jquery';

export default(params)=>{
  return new Promise((resolve, reject)=>{
    $.ajax({
      ...params,
      success: resolve,
      error: reject,
    })  
  })
}

