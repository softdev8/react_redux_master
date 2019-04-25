import styles from './Logo.module.scss';

import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';

const seologotext = 'educative.io';

class Logo extends Component {

  render() {

    const logoFull = '/imgs/logo.png';

    return (
      <Link to={'/'} className={styles.logo}>

        <img alt={seologotext} title={seologotext} src={logoFull}/>

        <h1 className={styles.title}>{ seologotext }</h1>

        <div className={styles.fake} style={{ backgroundImage: `url(${logoFull})` }}/>

      </Link>
    );
  }
}

Logo.propTypes = {};

export default Logo;
