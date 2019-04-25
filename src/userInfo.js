import {getInfo} from './actions';
import {serverUrl} from './config-old';

let globalUser = null;

export const getUserInfo = () => {
  if (globalUser != null) {
    return globalUser;
  }

  for (let retryCount = 0; retryCount < 3; ++retryCount) {
    console.log(retryCount)
    $.ajax({
      url: `${serverUrl}/api/user/info`,
      type: 'GET',
      async: false,

      success: (data)=>{
         globalUser = JSON.parse(data);
         console.log(globalUser);
      },

      error: (err)=>{
       console.log(err);
      },
    })  
    
    // if successfully got globalUser then
    // break otherwise retry until max retry count reached.
    if (globalUser != null) {
      break;
    }
  }

  return globalUser;
}


// TODO use this with redux 
// import promiseRetry from 'promise-retry';

// let globalUser = null;
// let pending = false;

// export const getUserInfo = () => {
//   if (globalUser != null || pending) {
//     return globalUser;
//   }

//   try{
//       promiseRetry((retry, number) => {
//         console.log('attempt number', number);
//         pending = true;
//         return getInfo()
//         .catch((err)=>{
//           console.log(err);
//           retry()
//         });
//     })
//     .then((data)=>{
//        pending = false;
//        globalUser = JSON.parse(data);
//     })

//   } catch(e){
//     console.error(e)
//   }

//   return globalUser;
// }

