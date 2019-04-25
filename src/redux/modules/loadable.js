export default (resourceName)=>{
  const LOAD = `${resourceName}/LOAD`;
  const LOAD_SUCCESS = `${resourceName}/LOAD_SUCCESS`;
  const LOAD_FAIL = `${resourceName}/LOAD_FAIL`;
  const CLEAR = `${resourceName}/CLEAR`;

  const reducer = (
    state = {loaded: false}, 
    action = {}
  )=> {
    switch (action.type) {
      case LOAD:
        return {
          ...state,
          loading: true,
        };
      case LOAD_SUCCESS:
        return {
          ...state,
          loading: false,
          loaded: true,
          data: action.result,
        };
      case LOAD_FAIL:
        return {
          ...state,
          loading: false,
          loaded: false,
          error: action.error,
        };
      case CLEAR:
        delete state.data;
        delete state.loading;

        return {
          ...state,
          loaded: false,
        };
      default:
        return state;
    }
  }

  const isLoaded = (globalState) => {
    return globalState[resourceName] && globalState[resourceName].loaded;
  }

  const actions =[
        LOAD,
        LOAD_SUCCESS,
        LOAD_FAIL,
  ]

  return {
    isLoaded,
    reducer,
    actions,
    createActions : (postFix)=> [`${LOAD}_${postFix}`, `${LOAD_SUCCESS}_${postFix}`, `${LOAD_FAIL}_${postFix}`],
  }
}


