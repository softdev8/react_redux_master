import styles from './Logo.module.scss';

import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';

const seologotext = 'educative.io';

export default class Logo extends Component {

  static PropTypes = {
    // small or full
    size : PropTypes.string.isRequired,

    link : PropTypes.string,
    logoLinksToLanding: PropTypes.bool,
  };

  render() {
    const {size = 'full', logoLinksToLanding, link = logoLinksToLanding ? '/':'/learn'} = this.props;
    const fakeClassName = size == 'small' ? `${styles.fake} ${styles.small}` : styles.fake;
    const logoFull  = '/imgs/logo.png';
    const logoSmall = '/imgs/logo-small.png';
    const logo      = size == 'small' ? logoSmall : logoFull;

    return  <Link to={link} className={`b-logo ${styles.logo}`}>

              <img alt={seologotext} title={seologotext} src={logoFull}/>

              <h1 className={styles.title}>{ seologotext }</h1>

              <div className={fakeClassName} style={{backgroundImage: `url(${logo})`}}/>

            </Link>;
  }
}
