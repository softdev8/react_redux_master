import './MulticolorLine.scss';
import React, {Component, PropTypes} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

let contentWidth = 1045;

export default class MulticolorLine extends Component {

  static PropTypes = {
    rightColor : PropTypes.string,
    leftColor  : PropTypes.string,
  };

  render() {
    const {rightColor, leftColor} = this.props;

    const leftStyles  = { backgroundColor : leftColor };
    const rightStyles = { backgroundColor : rightColor };

    return (
      <div className='b-multicolor-line'>
        <div className='b-multicolor-line__left' style={leftStyles}/>
        <div className='b-multicolor-line__content'>
          {this.props.children}
        </div>
        <div className='b-multicolor-line__right' style={rightStyles}/>
      </div>
    );
  }

}