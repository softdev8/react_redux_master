import stringUtils from './stringUtils'
import { pushState } from 'redux-router';


export function parseError(err) {
  if (err == null) {
    return null;
  }

  if (err.responseJSON && err.responseJSON.errorText != null) {
    return err.responseJSON.errorText;
  }

  if (err.responseJSON != null && err.responseJSON.errors != null) {
    var errorText = '';
    for (let propertyName in err.responseJSON.errors) {
      errorText += `<p>${stringUtils.capitalizeFirstLetter(propertyName)}: ${err.responseJSON.errors[propertyName].toLowerCase()}</p>`;
    }
    return errorText;
  }

  return null;
}

export function checkError(error, dispatch, location, whitelist) {
  //Check Auth Error
  if(error){
    if(error.status === 401 && (whitelist ? whitelist.indexOf(error.status) == -1 : true)){
        
        //indicates a redirection is already in progress
        if(location && location.query.ru){
          return;
        }

        let returnUrl = null;
        if(location){
          //TBD: Handle query params too in this routing
          returnUrl = location.pathname;
          dispatch(pushState({forceTransition:true}, '/login', {ru:returnUrl}));
          return;
        }

        dispatch(pushState({forceTransition:true}, '/login'));
    } else if(error.status === 404 && (whitelist ? whitelist.indexOf(error.status) == -1 : true)){
        dispatch(pushState(null, '/notfound'));
    }
  }
}