import styles from './Header.module.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Btn, SomethingWithIcon, Icons } from '../index';
import { ModalTypes } from '../../constants';
import { showModal } from '../../actions';
import isLocalStorageAvailable from '../../utils/isLocalStorageAvailable';
import { SUBSCRIBE_DONT_SHOW_SETTING_NAME } from '../../constants';

import Logo from './Logo/Logo';
import Profile from './ProfileSmall/ProfileSmall';

const sortLinks = (links) => links.sort((a, b) => a.order - b.order);

let subscribePopUpAlreadyShown = false;

@connect(({ user: { info }, router: { location }, ajaxMode: { enabled } }) => {

  let errorLoadingUserInfo = false;
  errorLoadingUserInfo = info.error ? info.error.status === 401 : false;

  const relevantPages = location.pathname.indexOf('/page/') !== -1 || location.pathname.indexOf('/collection/') !== -1;

  let subscribleDontShowPref = false;
  if (!subscribePopUpAlreadyShown && isLocalStorageAvailable()) {
    subscribleDontShowPref = localStorage.getItem(SUBSCRIBE_DONT_SHOW_SETTING_NAME);
    if (subscribleDontShowPref) {
      // This will short circuit calls to localStorage when the storage value is true
      subscribePopUpAlreadyShown = true;
    }
  }

  return {
    userInfo : info.data,
    isDemo: !enabled,
    showSubscribePopUp: !info.loading  && !info.loaded && errorLoadingUserInfo && relevantPages && !subscribleDontShowPref,
    location
  };
})

export default class Header extends Component {
  static PropTypes = {
    logoSize      : PropTypes.string,
    profile       : PropTypes.object,
    links         : PropTypes.array,
    menuButton    : PropTypes.bool,
    shareButton   : PropTypes.bool,
    toggleSidebar : PropTypes.func,
    logoLinksToLanding : PropTypes.bool,
    isDemo        : PropTypes.bool.isRequired,
    showSubscribePopUp: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    this.openModalWindow = this.openModalWindow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //Disabling Subscribe Pop-up
    /*if (this.props.showSubscribePopUp !== nextProps.showSubscribePopUp && nextProps.showSubscribePopUp && !subscribePopUpAlreadyShown) {
      subscribePopUpAlreadyShown = true;
      setTimeout(() => {
        this.openModalWindow(ModalTypes.SUBSCRIBE);
      }, 2000);
    }*/
  }

  render() {
    const { logoSize, profile, userInfo, menuButton, shareButton, toggleSidebar, logoLinksToLanding, isDemo } = this.props;

    let {links = defaultLinks} = this.props;

    if (isDemo) links = [];

    const linksNodes = sortLinks(links).map(({ url, text }, i) =>
      <Link to={ url }
        title={ text }
        key={ i }
        activeClassName="active"
      >
        { text }
      </Link>
    );

    const menuBtn = menuButton && <Btn default className={styles['menu-button']} onClick={toggleSidebar}>
                                    <SomethingWithIcon icon={Icons.menuIcon}/>
                                  </Btn>;

    const shareBtn = shareButton && <Btn default className={styles['share-button']}>
                                    <SomethingWithIcon icon={Icons.shareIcon}/>
                                  </Btn>;
    const navigation  = userInfo && <nav className={styles.nav}>
                                    { linksNodes }
                                   </nav>;
    let rightNode = null;
    if (userInfo && !isDemo) {
      rightNode = <Profile data={profile}/>;
    } else {
      if (!logoLinksToLanding) {
        rightNode = (<div className={styles.auth}>
                      <Btn default onClick={this.openModalWindow.bind(this, ModalTypes.LOGIN)}>Login</Btn>
                      <Btn secondary onClick={this.openModalWindow.bind(this, ModalTypes.SIGNUP)}>Register</Btn>
                    </div>);
      }
    }

    const baseClassName = styles.header;
    const className     = this.props.className ? `${baseClassName} ${this.props.className}` : baseClassName;

    let leftStyle = { height:'100%' };
    if (!isDemo && (menuBtn || navigation)) {
      leftStyle = {};
    }

    const showLogo = !userInfo || !menuButton;

    return  (<header className={className}>
              <div className={styles.left} style={leftStyle}>
                { menuBtn }
                { showLogo && <Logo size={logoSize} logoLinksToLanding={logoLinksToLanding || isDemo || !userInfo} /> }
                { navigation }
              </div>
              <div className={styles.right}>
                { shareBtn }
                { rightNode }
              </div>
            </header>);
  }

  openModalWindow(type, e) {
    if (e) e.target.blur(); // remove focus from button
    this.props.dispatch(showModal(type, { ru: this.props.location.pathname }));
  }
}

const defaultLinks = [{
  url   : '/learn',
  text  : 'Learn',
  order : 0,
}, {
  url   : '/teach',
  text  : 'Teach',
  order : 1,
}];
