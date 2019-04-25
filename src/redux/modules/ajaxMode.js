import {handleActions} from 'redux-actions'

export default handleActions({
    SET_AJAX_MODE : (state, {payload})=> {
      return {...state, enabled: payload }
    },
  }, 
  {enabled: true}
)