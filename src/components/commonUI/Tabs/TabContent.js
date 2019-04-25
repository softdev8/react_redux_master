import styles from './TabContent.module.scss';

import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

export default class TabContent extends Component {

  static PropTypes = {
    children       : PropTypes.any.isRequired,
    forTab         : PropTypes.number.isRequired,

    /* next props injected by Tabs component */
    activeTabIndex : PropTypes.number.isRequired,
  };

  render() {

    const {children, activeTabIndex, forTab} = this.props;

    const contentClassName = classnames(
      styles['tab-content'],
      {
        active : activeTabIndex == forTab,
      },
      this.props.className,
    );

    return <div className={contentClassName}>
            { children }
           </div>
  }
}