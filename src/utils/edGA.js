const ReactGA = require('react-ga');

const debug = window.DEBUG || false;
const trackingId = debug ? 'UA-68399453-3' : 'UA-68399453-1';

ReactGA.initialize(trackingId, {
  debug
});
const ga = ReactGA.ga;

export const eventCategory = {
  LOGIN          : 'LOGIN',
  SIGNUP         : 'SIGNUP',
  VIEW           : 'VIEW',
};

export const eventAction = {
  LOGIN_INIT_LANDING          : 'LOGIN_INIT_LANDING',
  LOGIN_INIT_AUTHOR_LANDING   : 'LOGIN_INIT_AUTHOR_LANDING',
  LOGIN_SUCCEEDED             : 'LOGIN_SUCCEEDED',
  LOGIN_FAILED                : 'LOGIN_FAILED',
  SIGNUP_INIT_LANDING         : 'SIGNUP_INIT_LANDING',
  SIGNUP_INIT_AUTHOR_LANDING  : 'SIGNUP_INIT_AUTHOR_LANDING',
  SIGNUP_INIT_BUY_WORK        : 'SIGNUP_INIT_BUY_WORK',
  SIGNUP_SUCCEEDED            : 'SIGNUP_SUCCEEDED',
  SIGNUP_FAILED               : 'SIGNUP_FAILED',
  VIEW_AUTHOR_LANDING_COURSES : 'VIEW_AUTHOR_LANDING_COURSES',
  VIEW_AUTHOR_HOWITWORKS      : 'VIEW_AUTHOR_HOWITWORKS',
  VIEW_LANDING_COURSES        : 'VIEW_LANDING_COURSES',
  VIEW_COURSE_PREVIEW         : 'VIEW_COURSE_PREVIEW',
}

export function sendEvent(category, action, label='', value=null) {
  const gaEvent = {
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
  };

  if (label !== '') {
    gaEvent.eventLabel = label;
  }

  if (value !== null) {
    gaEvent.eventValue = value;
  }

  ga('send', gaEvent);
}