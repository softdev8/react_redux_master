import styles from './FooterMenu.module.scss';
import React, {Component, PropTypes} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {Link} from 'react-router';

import {Btn} from '../';

export default class FooterMenu extends Component {

  static PropTypes = {
    theme : PropTypes.string,
  };

  render() {
    const {theme} = this.props;
    const baseClassName = styles['footer-menu'];
    const menuClassName = theme ? `${baseClassName} ${styles[theme]}` : baseClassName;
    const supportBtnClassName = theme === 'landing' ? 'b-btn_orange-border' : styles.support;

    return (
      <nav className={`${menuClassName} navbar navbar-default`}>
        <div className="container txt_center">
          <ul className="nav navbar-nav fr_responsive">
            <li><Link className='link' to='/learn'>Home</Link></li>
            <li><Link className='link' to='/learn'>Featured</Link></li>
            <li><Link className='link' to='/team'>Team</Link> </li>
            <li><Link className='link' to='/collection/6630002/190001'>Blog</Link></li>
            <li><Link className='link' to='/collection/page/6630002/170001/220001'>FAQ</Link></li>
            <li><Link className='link' to='/terms'>Terms of Service</Link></li>
            <li><a href="mailto:contact@educative.io">Contact Us</a></li>
          </ul>
          <ul className="nav navbar-right navbar-nav">
            <li className={styles['footer-menu-support']}>
              <a href="mailto:support@educative.io">
                <Btn medium className={supportBtnClassName}>Support</Btn>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
