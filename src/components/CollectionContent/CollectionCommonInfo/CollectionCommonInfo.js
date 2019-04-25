import styles from './CollectionCommonInfo.module.scss';

import React, { Component, PropTypes } from 'react';

import { SomethingWithIcon, Icons } from '../../index';
import dateFormatter from '../../../utils/formatDate';

export default class CollectionCommonInfo extends Component {

  static PropTypes = {
    data : PropTypes.object.isRequired,
  };

  render() {

    const { data } = this.props;
    const baseClassName = styles['common-info'];
    const className = `${baseClassName} ${styles[data.type]}`;

    return  (<div className={className}>
              <div className={styles.left}>
                <SomethingWithIcon icon={Icons.docsIcon} text="course:"/>
                <span className={styles.type}>{ data.type }</span>
              </div>

              <div className={styles.right}>
                <span className={styles.date}>{ `Creation date: ${dateFormatter(data.creation_time, 'DD MMMM YYYY')}` }</span>
                <span className={styles.date}>{ `Last modified: ${dateFormatter(data.modified_time, 'DD MMMM YYYY')}` }</span>
              </div>
            </div>);
  }
}
