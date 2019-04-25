import styles from './Tabs.module.scss';

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Tab from './Tab';
import TabContent from './TabContent';

class Tabs extends Component {

  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);

    this.state = {
      activeTabIndex : props.activeByDefault || 0,
    };
  }

  toggleTab(nextTabIndex) {
    this.setState({
      activeTabIndex : nextTabIndex,
    });
  }

  renderChildrens() {

    const { children } = this.props;
    const result = {
      tabs    : [],
      content : [],
    };

    if (React.Children.count(children) !== 0) {

      children.forEach((child, i) => {

        if (!child) return;

        if (child.type === Tab) {

          result.tabs.push(React.cloneElement(
            child,
            {
              makeActive : this.toggleTab,
              isActive   : this.state.activeTabIndex === i,
              index      : i,
              key        : i,
            },
          ));

        } else if (child.type === TabContent) {

          result.content.push(React.cloneElement(
            child,
            {
              activeTabIndex : this.state.activeTabIndex,
              key            : i,
            },
          ));

        }

      });

    }

    return result;
  }

  render() {

    const childs = this.renderChildrens();

    const tabsClassName = classnames(styles.tabs, this.props.className);

    return (
      <div className={tabsClassName}>

        <ul className={styles['tabs-list']}>
          { childs.tabs }
        </ul>

        { childs.content }
      </div>
    );
  }
}

Tabs.propTypes = {
  className       : PropTypes.string,
  children        : PropTypes.node,
  activeByDefault : PropTypes.number,
};

export default Tabs;
