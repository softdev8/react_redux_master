import styles from './CaptionComponent.module.scss';

import React from 'react';
import { findDOMNode } from 'react-dom';

//------------------------------------------------------------------------------
// CAPTION COMPONENT
//------------------------------------------------------------------------------

import { FormControl } from 'react-bootstrap';

/*
 * Display the caption of the current code content.
 *
 * Available props:
 * caption - the current code content caption
 * readOnly - disables caption editing
 * onCaptionChange(newCaption) - callback when caption is changed
 */
class CaptionComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.readOnly) {
      findDOMNode(this.inputFieldRef).value= this.props.caption ? this.props.caption : null;
    }
  }

  componentDidUpdate() {
    if (!this.props.readOnly) {
      findDOMNode(this.inputFieldRef).value= this.props.caption ? this.props.caption : null;
    }
  }

  handleChange() {
    const value = findDOMNode(this.inputFieldRef).value;
    this.props.onCaptionChange(value);
  }

  render() {

    let child = null;

    if (this.props.readOnly) {
      let caption = this.props.caption ? this.props.caption.trim() : '';
      if (caption.length > 0) {
        child = <div className={styles.caption}>
                  <span className='cmcomp-caption fg-black75'>
                    {this.props.caption}
                  </span>
                </div>
      }
    } else {
      if(this.props.hookOnChangeEvent == true) {
        child = <div className={styles.caption}>
                  <FormControl
                    id='caption-component'
                    style={{textAlign:'center'}}
                    placeholder='Caption Text'
                    ref={(node) => this.inputFieldRef = node}
                    className='cmcomp-caption'
                    onBlur={this.handleChange}
                    onChange={this.handleChange}/>
                </div>
      } else {
        child =  <div className={styles.caption}>
                  <FormControl
                    id='caption-component'
                    style={{textAlign:'center'}}
                    placeholder='Caption Text'
                    ref={(node) => this.inputFieldRef = node}
                    className='cmcomp-caption'
                    onBlur={this.handleChange}/>
                </div>
      }
    }

    return child;
  }
}

module.exports = CaptionComponent;
