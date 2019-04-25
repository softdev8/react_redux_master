import styles from './CanvasTextToolbar.module.scss';

import React, {Component, PropTypes} from 'react';
import {Grid, Col, Row, ButtonGroup, FormControl} from 'react-bootstrap';

import ColorPicker from '../../common/colorpicker';

import {Btn, SomethingWithIcon, Icons} from '../../index';

const CanvasTextFonts = {
  arial         : 'Arial',
  helvetica     : 'Helvetica',
  'myriad pro'    : 'Myriad Pro',
  delicious     : 'Delicious',
  verdana       : 'Verdana',
  georgia       : 'Georgia',
  courier       : 'Courier',
  'comic sans ms' : 'Comic Sans MS',
  impact        : 'Impact',
  monaco        : 'Monaco',
  optima        : 'Optima',
  'hoefler text'  : 'Hoefler Text',
  plaster       : 'Plaster',
  engagement    : 'Engagement',
};

const CanvasFontSizes = {
  10: '10',
  12: '12',
  14: '14',
  16: '16',
  18: '18',
  20: '20',
  22: '22',
  24: '24',
  28: '28',
  36: '36',
  48: '48',
  72: '72',
};

/*
 * Utility method to get the keys of the given object.
 */
const keys = function(obj) {
  const keys = [];
  for (let key in obj) {
    keys.push(key);
  }
  return keys;
};

export default class CanvasTextToolbar extends Component {

  static PropTypes = {
    mode           : PropTypes.string.isRequired,
    fontFamily     : PropTypes.string.isRequired,
    fontSize       : PropTypes.string.isRequired,
    textColor      : PropTypes.string.isRequired,
    italic         : PropTypes.bool.isRequired,
    bold           : PropTypes.bool.isRequired,
    underline           : PropTypes.bool.isRequired,
    linethough          : PropTypes.bool.isRequired,
    textBackgroundColor : PropTypes.string.isRequired,
    setActiveProp       : PropTypes.func.isRequired,
    clearStyles         : PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onFontFamilyChange      = this.onFontFamilyChange.bind(this);
    this.onFontSizeChange        = this.onFontSizeChange.bind(this);
    this.onTextColorChange       = this.onTextColorChange.bind(this);
    this.onBackgroundColorChange = this.onBackgroundColorChange.bind(this);
    this.onFontWeightChange      = this.onFontWeightChange.bind(this);
    this.onFontStyleChange       = this.onFontStyleChange.bind(this);
  }

  onFontFamilyChange(event) {
    this.props.setActiveProp('fontFamily', event.target.value);
  }

  onFontSizeChange(event) {
    this.props.setActiveProp('fontSize', event.target.value);
  }

  onTextColorChange(colorValue) {
    this.props.setActiveProp('textColor', colorValue);
  }

  onBackgroundColorChange(colorValue) {
    this.props.setActiveProp('textBackgroundColor', colorValue);
  }

  onFontWeightChange(event) {
    const newVal = !this.props.bold;

    this.props.setActiveProp('bold', newVal);
  }

  onFontStyleChange(event) {
    const newVal = !this.props.italic;

    this.props.setActiveProp('italic', newVal);
  }

  onTextDecorationChange(value, event) {
    const newVal = value == 'linethrough'? !this.props.linethrough : !this.props.underline;

    this.props.setActiveProp(value, newVal);
  }

  onTextAlignmentChange(value, event) {
    this.props.setActiveProp('textAlign', value);
  }

  render() {

    return <div className={styles.toolbar}>

            <FormControl groupClassName={styles.group}
              className='input-sm fg-black75'
              componentClass='select'
              value={this.props.fontFamily}
              onChange={this.onFontFamilyChange}>
              {
                keys(CanvasTextFonts).map(function (key) {
                  return (
                    <option key={key} value={key}>{CanvasTextFonts[key]}</option>
                  );
                })
              }
            </FormControl>

            <FormControl groupClassName={styles.group}
              className='input-sm fg-black75'
              componentClass='select'
              value={this.props.fontSize}
              onChange={this.onFontSizeChange}>
              {
                keys(CanvasFontSizes).map(function (key) {
                  return (
                    <option key={key} value={key}>{CanvasFontSizes[key]}</option>
                  );
                })
              }
            </FormControl>


            <ColorPicker className={`${styles.colorpicker} ${styles.group} ${styles['text-color']}`}
                         value={this.props.textColor}
                         onChange={this.onTextColorChange}>
              <SomethingWithIcon icon={Icons.fontIcon}/>
            </ColorPicker>

            <ColorPicker className={`${styles.colorpicker} ${styles.group} ${styles['back-color']}`}
                         value={this.props.textBackgroundColor}
                         onChange={this.onBackgroundColorChange}>
              <SomethingWithIcon icon={Icons.fontIcon}/>
            </ColorPicker>

            <Btn default className={`${styles.button} ${styles.group}`} active={this.props.bold} onClick={this.onFontWeightChange}>
              <SomethingWithIcon icon={Icons.boldIcon}/>
            </Btn>

            <Btn default className={`${styles.button} ${styles.group}`} active={this.props.italic} onClick={this.onFontStyleChange}>
              <SomethingWithIcon icon={Icons.italicIcon}/>
            </Btn>

            <div className={styles.group}>
              <Btn default className={styles.button} active={this.props.linethrough} onClick={this.onTextDecorationChange.bind(this, 'linethrough')}>
                <SomethingWithIcon icon={Icons.strikeThroughIcon}/>
              </Btn>

              <Btn default className={styles.button} active={this.props.underline} onClick={this.onTextDecorationChange.bind(this, 'underline')}>
                <SomethingWithIcon icon={Icons.underlineIcon}/>
              </Btn>
            </div>

            <div className={styles.group}>
              <Btn default className={styles.button} active={this.props.textAlign == 'left'} onClick={this.onTextAlignmentChange.bind(this, 'left')}>
                <SomethingWithIcon icon='fa fa-align-left'/>
              </Btn>

              <Btn default className={styles.button} active={this.props.textAlign == 'center'} onClick={this.onTextAlignmentChange.bind(this, 'center')}>
                <SomethingWithIcon icon='fa fa-align-center'/>
              </Btn>

              <Btn default className={styles.button} active={this.props.textAlign == 'right'} onClick={this.onTextAlignmentChange.bind(this, 'right')}>
                <SomethingWithIcon icon='fa fa-align-right'/>
              </Btn>
            </div>

            <div className={styles.group}>
              <Btn default className={styles.button}  onClick={this.props.clearStyles}>
                <SomethingWithIcon icon='fa fa-times'/>
              </Btn>
            </div>

          </div>;
  }
}