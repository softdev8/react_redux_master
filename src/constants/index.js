// Signals that the router's state has changed. It should
// never be called by the application, only as an implementation detail of
// redux-react-router.
export const ROUTER_DID_CHANGE = '@@reduxReactRouter/routerDidChange';

export const HISTORY_API = '@@reduxReactRouter/historyAPI';
export const MATCH = '@@reduxReactRouter/match';
export const REPLACE_ROUTES = '@@reduxReactRouter/replaceRoutes';

export const ROUTER_STATE_SELECTOR = '@@reduxReactRouter/routerStateSelector';

export const DOES_NEED_REFRESH = '@@reduxReactRouter/doesNeedRefresh';

export const SUBSCRIBE_DONT_SHOW_SETTING_NAME = 'Preference.dontShowSubscribe';

export const FILE_SIZES_IN_BYTES = {
    ONE_KB : 1024,
    ONE_MB : 1024 * 1024,
    TEN_MB : 10 * 1024 * 1024,
};

export * as Agreements from './agreements';
export * as ModalTypes from './modalWindowsTypes';
