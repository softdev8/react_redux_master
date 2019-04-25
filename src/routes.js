import React from 'react';
import pure from 'react-pure-component';
import {Route} from 'react-router';
import {ReduxRouter} from 'redux-router';
import { Provider } from 'react-redux';
import createStore from './redux/create';
import { createAction } from 'redux-actions';

import isDraftPage from './utils/isDraftPage';
import loadUserInfoOnRequiredPage from './utils/loadUserInfoOnRequiredPage';
import {clear as clearAuthorProfile} from './redux/modules/author/profile';
import { DevTools } from './containers';

const store = createStore(null, window.__data);

import {
  // PageEditor,
  // PageViewer,
  // dashboard_old,
  // ActivationSent,
  VerifyUserPage,
  Payment,
  // NotFound,
  App,
  LandingPage,
  ProfileEditingPage,
  ProfileViewPage,
  AuthorDashboardPage,
  ReaderDashboardPage,
  SignupPage,
  LoginPage,
  Page,
  AuthorPage,
  FAQPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ResendVerificationPage,
  EditCollectionPage,
  ViewCollectionPage,
  SettingsPage,
  EditArticlePage,
  ViewArticlePage,
  ArticlePreviewer,
  EditCollectionArticlePage,
  ViewCollectionArticlesPage,
  NotFoundPage,
  TermsOfServicePage,
  PrivacyPolicyPage,
  TeamPage,
  WorkStats,
  GetHelp,
  GetHelpOffer,
} from './containers';

// const App = pure(({children})=>(<div>{children}</div>));

const LeavePage = () => {
  if(!window.DEBUG){
    store.dispatch(clearAuthorProfile())
    store.dispatch(createAction('LEAVE_PAGE_ROUTE')())
  } else {
    store.dispatch(clearAuthorProfile())
    console.info('state clearing on route dispatch is disabled for article pages');
  }
};

function requireAuth(authRequired, route) {
  if(isDraftPage(route.location)) authRequired = true;

  loadUserInfoOnRequiredPage(store, authRequired);
}

const enterDemo = (route) => {
  store.dispatch(createAction('SET_AJAX_MODE')(false))
  requireAuth(true, route);
};

const leaveDemo = () => {
  store.dispatch(createAction('SET_AJAX_MODE')(true))
  LeavePage();
};

export default class Root extends React.Component {
  render() {
    return (
      <div className='b-root'>
        <Provider store={store} >
            <div>
              <ReduxRouter>
                <Route component={App}>
                  <Route path='/' component={Page} onEnter={requireAuth.bind(null, false)}/>
                  <Route path="/authors" component={AuthorPage}/>
                  <Route name='landing' path='/landing' component={LandingPage} onLeave={LeavePage} onEnter={requireAuth.bind(null, false)}/>
                  <Route path='demo' component={EditArticlePage} onEnter={enterDemo} onLeave={leaveDemo} />
                  <Route path='demo/draft' component={ViewArticlePage}  onEnter={enterDemo} onLeave={leaveDemo}  />
                  <Route path='pageeditor/:page_id' component={EditArticlePage} onEnter={requireAuth.bind(null, true)} onLeave={LeavePage} />
                  <Route path='pageeditor/:collection_id/:page_id' component={EditCollectionArticlePage} onEnter={requireAuth.bind(null, true)} onLeave={LeavePage} />

                  <Route path='collection/page/:user_id/:collection_id' component={ViewCollectionArticlesPage} onEnter={requireAuth.bind(null, false)}>
                    <Route path=':page_id(/draft)' component={ViewArticlePage} onEnter={requireAuth.bind(null, null)} onLeave={LeavePage} />
                    <Route path=':page_id/preview' component={ArticlePreviewer} onLeave={LeavePage}  onEnter={requireAuth.bind(null, null)}/>
                  </Route>

                  <Route path='page/:user_id/:page_id(/draft)' component={ViewArticlePage} onLeave={LeavePage}  onEnter={requireAuth.bind(null, null)}/>

                  <Route path='page/preview/:user_id/:page_id' component={ArticlePreviewer} onLeave={LeavePage}  onEnter={requireAuth.bind(null, null)}/>

                  <Route name='author_dashboard_new_1' path='/teach' component={AuthorDashboardPage} onEnter={requireAuth.bind(null, true)} onLeave={LeavePage}/>
                  <Route name='reader_dashboard_new_2' path='/learn' component={ReaderDashboardPage} onEnter={requireAuth.bind(null, true)} onLeave={LeavePage}/>

                  <Route name='collectioneditor' path='/collectioneditor/:collection_id' component={EditCollectionPage} onEnter={requireAuth.bind(null, true)} onLeave={LeavePage}/>
                  <Route name='collection_pageview' path='/collection/:user_id/:collection_id' component={ViewCollectionPage} onEnter={requireAuth.bind(null, null)} onLeave={LeavePage}/>
                  <Route name='collection_draft_pageview' path='/collection/:user_id/:collection_id/draft' component={ViewCollectionPage} onEnter={requireAuth.bind(null, true)} onLeave={LeavePage}/>
                  <Route name='collection_draft_pageview' path='/collection/:user_id/:collection_id/stats' component={WorkStats} onEnter={requireAuth.bind(null, true)} onLeave={LeavePage}/>

                  <Route name='collection_get_help' path='/collection/:user_id/:collection_id/experthelp' component={GetHelp} onEnter={requireAuth.bind(null, null)} onLeave={LeavePage}/>
                  <Route name='collection_get_help_offer' path='/collection/:user_id/:collection_id/experthelp/:offer_id' component={GetHelpOffer} onEnter={requireAuth.bind(null, null)} onLeave={LeavePage}/>

                  <Route name='settings' path='/settings' component={SettingsPage} onEnter={requireAuth.bind(null, true)}/>

                  <Route name='editProfile' path='/profile/edit' component={ProfileEditingPage} onEnter={requireAuth.bind(null, true)} onLeave={LeavePage}/>
                  <Route name='viewProfile' path='/profile/view(/:author_id)' component={ProfileViewPage} onEnter={requireAuth.bind(null, false)} onLeave={LeavePage}/>

                  <Route name='login' path='/login(/:token)' component={LoginPage} onEnter={requireAuth.bind(null, false)}/>
                  <Route name='signup' path='/signup' component={SignupPage} onEnter={requireAuth.bind(null, false)}/>
                  <Route name='verify-user' path='/verify-user/:token' component={VerifyUserPage} onEnter={requireAuth.bind(null, false)}/>
                  <Route name='forgot-password' path='/forgot-password' component={ForgotPasswordPage} onEnter={requireAuth.bind(null, false)}/>
                  <Route name='reset-password' path='/reset-password/:token' component={ResetPasswordPage} onEnter={requireAuth.bind(null, false)}/>
                  <Route name='resend-verification' path='/resend-verification' component={ResendVerificationPage} onEnter={requireAuth.bind(null, false)}/>
                  <Route name='faq' path='/faq' component={FAQPage}/>
                  <Route name='terms' path='/terms' component={TermsOfServicePage}/>
                  <Route name='privacy' path='/privacy' component={PrivacyPolicyPage}/>
                  <Route name='team' path='/team' component={TeamPage}/>
                  <Route name='payment' path='/payment' component={Payment}/>

                  <Route path="*" component={NotFoundPage}/>
                </Route>
              </ReduxRouter>
              { /* window.DEBUG ? <DevTools/> : null */ }
            </div>
        </Provider>
      </div>
    );
  }
}
