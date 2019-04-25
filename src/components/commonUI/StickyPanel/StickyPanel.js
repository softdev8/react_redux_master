require('./StickyPanel.scss');

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
export default class StickyPanel extends Component {

  static PropTypes = {
    fixed: PropTypes.boolean,
  };

  constructor(props, context) {
    super(props, context);

    this.checkTopPosition = this.checkTopPosition.bind(this);

    this.state = {
      isFixed    : this.props.fixed || false,
      rightValue : 0,
    }
  }

  componentDidMount() {
    document.getElementById('app-container').addEventListener('scroll', this.checkTopPosition);
  }

  componentWillUnmount() {
    document.getElementById('app-container').removeEventListener('scroll', this.checkTopPosition);
  }

  render() {
    const {isFixed, rightValue} = this.state;
    const fixedClass = isFixed ? ' fixed' : '';
    const style = { right : rightValue };

    return  <div  className={`b-sticky-panel${fixedClass}`} 
                  style={style}
                  ref='stickypanel'>
              { this.props.children }
            </div>;
  }

  checkTopPosition(e) {
    const node = findDOMNode(this.refs.stickypanel);

    const pageWidth = document.getElementsByClassName('b-page')[0].clientWidth;
    const bodyWidth = document.body.clientWidth;
    let origTopPosition = node.getBoundingClientRect().top;
    let scrollWidth = bodyWidth - pageWidth;

    // BUG (ON DEV) - when component mounted not all style are loaded,
    // so, top position can be wrong somethimes. 
    // TODO -- remove this when all styles will be loaded within single file
    origTopPosition = 60;

    if(e.target.scrollTop >= origTopPosition) {

      this.setState({
        isFixed    : true,
        rightValue : scrollWidth,
      });

    } else {

      this.setState({
        isFixed    : false,
        rightValue : 0,
      });

    }
  }
}