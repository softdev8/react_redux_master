import styles from './Tab.module.scss';

import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

export default class Tab extends Component {

  static PropTypes = {
    title      : PropTypes.string.isRequired,

    /* next props injected by Tabs component */
    index      : PropTypes.number.isRequired,

    makeActive : PropTypes.func.isRequired,
    isActive   : PropTypes.bool,
  };

  render() {

    const {isActive = false, index, makeActive, title} = this.props;

    const tabClassName = classnames(
      styles.tab,
      this.props.className,
      {
        active : isActive,
      },
    );

    return <li className={tabClassName} onClick={ () => makeActive(index) }>

            <div className={styles.inn}>
              { title }
            </div>

           </li>;
  }
}