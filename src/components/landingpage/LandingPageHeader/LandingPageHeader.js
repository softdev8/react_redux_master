import styles from './LandingPageHeader.module.scss';

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { ModalTypes } from '../../../constants';
import { showModal } from '../../../actions';
import Logo from '../Logo/Logo';
import { connect } from 'react-redux';
import { eventCategory, eventAction, sendEvent } from '../../../utils/edGA';

@connect()
class LandingPageHeader extends Component {
  constructor(s) {
    super(s);

    this.state = {
      itemTranslate: true,
    };
  }


  // componentDidMount() {
  //   document.getElementById('app-container').addEventListener('scroll', this.handleScroll);
  // }

  // componentWillUnmount() {
  //   document.getElementById('app-container').removeEventListener('scroll', this.handleScroll);
  // }

  // handleScroll = (event) => {

  //   const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  //   const scrollTop = event.srcElement.scrollTop  > h * 0.4;
  //   this.setState({
  //     itemTranslate: scrollTop
  //   });
  // }

  onLoginClicked = (e) => {
    if(e) e.target.blur(); // remove focus from button

    sendEvent(eventCategory.LOGIN,
      this.props.hideAuthor ?
      eventAction.LOGIN_INIT_AUTHOR_LANDING :
      eventAction.LOGIN_INIT_LANDING);

    this.props.dispatch(showModal(ModalTypes.LOGIN));
  }

  onSignupClicked = (e) => {
    if(e) e.target.blur(); // remove focus from button

    sendEvent(eventCategory.SIGNUP,
      this.props.hideAuthor ?
      eventAction.SIGNUP_INIT_AUTHOR_LANDING :
      eventAction.SIGNUP_INIT_LANDING);

    this.props.dispatch(showModal(ModalTypes.SIGNUP));
  }

  render() {
    const headerClassName = classnames(styles.header);
    const primaryBtnClassName = classnames(styles.button, styles.button_primary);

    const cleanBtnClassName = (this.state.itemTranslate) ?
      classnames(styles.button, styles.button_green) : classnames(styles.button, styles.button_clean);
    const authorBtnClassName = (this.state.itemTranslate) ?
      classnames(styles.button, styles.button_green, styles.author_button) : classnames(styles.button, styles.button_clean, styles.author_button);
    const headerstyles = (this.state.itemTranslate) ? { background: '#fbfbf9', borderBottom: '1px solid #eee' } : { background: '#fff' };

    return (
      <header className={headerClassName} style={headerstyles}>
        <div className="pull-left">
          <Logo />
        </div>
        <div className="pull-right">
          <nav className={styles.buttons}>
            {
              !this.props.hideAuthor ?
                <Link role="button"  to={'/authors'} className={authorBtnClassName}>
                  Become An Author
                </Link> :
                null
            }
            <a role="button" className={ cleanBtnClassName } onClick={this.onLoginClicked}>Login</a>
            <a role="button" className={primaryBtnClassName} onClick={this.onSignupClicked}>Register</a>
          </nav>
        </div>
      </header>
    );
  }
}

LandingPageHeader.propTypes = {
  hideAuthor: PropTypes.bool
};

export default LandingPageHeader;
