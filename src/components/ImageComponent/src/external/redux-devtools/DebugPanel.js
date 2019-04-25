import React, { PropTypes } from 'react';
import View from 'react-flexbox';
import pure from 'react-pure-component';

const getOrientation = (isRow)=>
  ({row: isRow, column: !isRow});

const getOrientationAndItemOrientation = (isRowColumn)=>
  ({orientation:getOrientation(isRowColumn), itemOrientation:getOrientation(!isRowColumn)});

export const DirectionPanel = (isRowColumn)=>pure(({leftPanel, content, rightPanel})=> {
  const {orientation, itemOrientation} = getOrientationAndItemOrientation(isRowColumn);

  return <View {...itemOrientation}>
    {leftPanel ? <View auto {...itemOrientation}>{leftPanel}</View> : null}
    <View {...itemOrientation}>{content}</View>
    {rightPanel ? <View {...itemOrientation}>{rightPanel}</View> : null}
  </View>
});

export class DebugPanel {
  static propTypes = {
    left: PropTypes.bool,
    right: PropTypes.bool,
    bottom: PropTypes.bool,
    top: PropTypes.bool,
  };

  render() {
    if (process.env.NODE_ENV === 'production') {
      return null;
    }

    let { left, right, bottom, top } = this.props;
    if (typeof left === 'undefined' && typeof right === 'undefined') {
      right = true;
    }
    if (typeof top === 'undefined' && typeof bottom === 'undefined') {
      bottom = true;
    }

    return (
      <div style={{
        position: 'fixed',
        zIndex: 999,
        fontSize: 17,
        opacity: 0.92,
        background: 'black',
        color: 'white',
        padding: '1em',
        left: left ? 0 : undefined,
        right: right ? 0 : undefined,
        top: top ? 0 : undefined,
        bottom: bottom ? 0 : undefined,
        maxHeight: (bottom && top) ? '100%' : '20%',
        maxWidth: (left && right) ? '100%' : '20%',
        wordWrap: 'break-word',
      }}>
        {this.props.children}
      </div>
    );
  }
}
