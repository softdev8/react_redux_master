import styles from './FooterMenu.module.scss';
import React, { Component, PropTypes } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';

import { Btn } from 'components';

class FooterMenu extends Component {

  render() {

    const { theme } = this.props;
    const baseClassName = styles['footer-menu'];
    const menuClassName = theme ? `${baseClassName} ${styles[theme]}` : baseClassName;
    const supportBtnClassName = styles.support;

    return (
      <Navbar className={menuClassName}>
        <Nav navbar>
          <NavItem href="" className={styles['footer-menu-link']}>
            <Link className="link" to="/">Home</Link>
          </NavItem>
          <NavItem href="" className={styles['footer-menu-link']}>
            <Link className="link" to={'/team'}>Team</Link>
          </NavItem>
          <NavItem href="" className={styles['footer-menu-link']}>
            <Link className="link" to={'/collection/6630002/190001'}>Blog</Link>
          </NavItem>
          <NavItem href="" className={styles['footer-menu-link']}>
            <Link className="link" to={'/collection/page/6630002/170001/220001'}>FAQ</Link>
          </NavItem>
          <NavItem href="/terms" className={styles['footer-menu-link']}>
            <Link className="link" to={'/terms'}>Terms of Service</Link>
          </NavItem>
          <NavItem href="mailto:contact@educative.io" className={styles['footer-menu-link']}>
            Contact Us
          </NavItem>
        </Nav>
        <Nav navbar pullRight>
          <NavItem href="mailto:support@educative.io" className={styles['footer-menu-support']}>
            <Btn medium className={supportBtnClassName} href="mailto:support@educative.io">Support</Btn>
          </NavItem>
        </Nav>
      </Navbar>
    );

  }
}
FooterMenu.propTypes = {
  theme : PropTypes.string
};

export default FooterMenu;
