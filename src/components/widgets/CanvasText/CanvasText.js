import styles from './CanvasText.module.scss';

import React from 'react';
import {findDOMNode} from 'react-dom';
import {Input} from 'react-bootstrap';

import ColorPicker from '../../common/colorpicker';
import CanvasTextToolbar from './CanvasTextToolbar';

class CanvasText extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.clearStyles = this.clearStyles.bind(this);
    this.selectionChanged = this.selectionChanged.bind(this);
    this.setActiveProp = this.setActiveProp.bind(this);
    const {content} = props;

    this.state = {
      canvas              : null,
      fabricObj           : null,
    };
  }

  componentDidMount() {
    if (this.props.mode == 'edit') {
      this.createCanvasAddText();
      this.forceUpdate();
    }
  }

  componentDidUpdate() {
    if (this.props.mode == 'edit') {
      //this.createCanvasAddText();
    }
  }

  clearStyles() {
    /*  //This code only removes the internal styles of text ranges
        this.state.fabricObj.styles = { };
        this.state.canvas.renderAll();
        this.saveUpdates();
    */
    let oldText = this.state.fabricObj.text;
    this.state.fabricObj.remove();
     const styles = {
       fontSize: '16',
       opacity: 1,
       fontFamily: 'helvetica',
     };

    this.state.fabricObj = new fabric.IText(oldText, styles);
    this.setupTextObjectOnCanvas(this.state.fabricObj, this.state.canvas);
    this.saveUpdates();
  }

  createCanvasAddText() {
    if (this.state.canvas === null) {

      const width = 600;
      const height = 400;

      this.state.canvas = new fabric.Canvas(
        findDOMNode(this.refs.canvas),
        {
          width,
          height,
        },
      );

      if(this.props.content.version == '1.0'){
        const styles = {
          fontSize            : this.props.content.fontSize,
          fontStyle           : this.props.content.italic ? 'italic' : '',
          fontFamily          : this.props.content.fontFamily,
          textBackgroundColor : this.props.content.textBackgroundColor,
          fill                : this.props.content.textColor,
          fontWeight          : this.props.content.bold ? 'bold' : 'normal',
        };

        if (this.props.content.linethrough === true) {
          styles['textDecoration'] = 'line-through';
        }

        if (this.props.content.overline === true) {
          styles['textDecoration'] = 'overline';
        }

        if (this.props.content.underline === true) {
          styles['textDecoration'] = 'underline';
        }

        if (this.props.content.strokeWidth != '') {
          styles['strokeWidth'] = this.state.strokeWidth;
        }

        if (this.props.content.strokeColor != '') {
          styles['stroke'] = this.state.strokeColor;
        }

        //create fabric object
        this.state.fabricObj = new fabric.IText(this.props.content.text, styles);
        this.setupTextObjectOnCanvas(this.state.fabricObj, this.state.canvas);
        
      } else if(this.props.content.version == '2.0'){
        let updated_obj = JSON.parse(this.props.content.text_json);
        let self = this;
        fabric.util.enlivenObjects([updated_obj], function(objects) {
          self.state.fabricObj = objects[0];
          self.setupTextObjectOnCanvas(self.state.fabricObj, self.state.canvas);
        });
      }
    }
  }

  getStyle(object, styleName) {
    return (object.getSelectionStyles && object.isEditing) ? object.getSelectionStyles()[styleName]
      : object[styleName];
  }

  getToolbarProps() {
    if(!this.state.fabricObj){
      return {
        mode                : this.props.mode,
        setActiveProp       : this.setActiveProp,
        clearStyles         : this.clearStyles,
        fontFamily          : 'helvetica',
        fontSize            : '16',
        textColor           : null,
        italic              : false,
        bold                : false,
        underline           : false,
        linethrough         : false,
        textBackgroundColor : null,
        textAlign: 'left',
      };
    }

    let obj = (!this.isEmptyObject(this.state.fabricObj.getSelectionStyles()) && this.state.fabricObj.isEditing) ? this.state.fabricObj.getSelectionStyles()
      : this.state.fabricObj;

    return {
      mode                : this.props.mode,
      setActiveProp       : this.setActiveProp,
      clearStyles         : this.clearStyles,
      fontFamily          : obj['fontFamily'],
      fontSize            : obj['fontSize'],
      textColor           : obj['fill'],
      italic              : obj['fontStyle'] === 'italic',
      bold                : obj['fontWeight'] === 'bold',
      underline           : (obj['textDecoration'] || '').indexOf('underline') > -1,
      linethrough         : (obj['textDecoration'] || '').indexOf('line-through') > -1,
      textBackgroundColor : obj['textBackgroundColor'],
      textAlign           : this.state.fabricObj['textAlign'],
    };
  }

  isEmptyObject(obj) {
    for(let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  onTextChange(event) {
    this.setActiveProp('text', event.target.value);
  }

  saveComponent() {
      this.saveUpdates();

      //This is done only when graphviz component is hosted in a canvas view
      if(this.props.contentStateFinalized){
        this.props.contentStateFinalized();
      }
  }

  saveUpdates() {
    this.props.updateContentState({
      version: '2.0',
      text_json: JSON.stringify(this.state.fabricObj),
    });
  }

  selectionChanged() {
    this.forceUpdate();
  }

  setActiveProp(name, value) {
    let obj = this.state.fabricObj || this.state.canvas.getActiveObject();

    if (!obj) return;

    if(name == 'bold'){
      const isBold = this.getStyle(obj, 'fontWeight') === 'bold';
      this.setStyle(obj, 'fontWeight', isBold ? '' : 'bold');
    } else if(name == 'italic'){
      const isItalic = this.getStyle(obj, 'fontStyle') === 'italic';
      this.setStyle(obj, 'fontStyle', isItalic ? '' : 'italic');
    } else if(name == 'textColor'){
      this.setStyle(obj, 'fill', value);
    } else if(name == 'linethrough'){
      const isLinethrough = (this.getStyle(obj, 'textDecoration') || '').indexOf('line-through') > -1;
      this.setStyle(obj, 'textDecoration', isLinethrough ? '' : 'line-through');
    } else if(name == 'underline'){
      const isUnderline = (this.getStyle(obj, 'textDecoration') || '').indexOf('underline') > -1;
      this.setStyle(obj, 'textDecoration', isUnderline ? '' : 'underline');
    } else if(name == 'textAlign'){
      this.setStyle(obj, name, value, true);
    } else {
      this.setStyle(obj, name, value);
    }

    this.state.canvas.renderAll();

    this.saveUpdates();
  }

  setStyle(object, styleName, value, forceOnObject) {
    if (object.setSelectionStyles && object.isEditing && !forceOnObject) {
      const style = { };
      style[styleName] = value;
      object.setSelectionStyles(style);
    }
    else {
      object[styleName] = value;
    }
  }

  setupTextObjectOnCanvas(fabricObj, canvas) {
    fabricObj.on('selection:changed', this.selectionChanged);
    fabricObj.set({left: canvas.width / 4, top: 10});
    canvas.add(fabricObj);
    canvas.setActiveObject(fabricObj);
    fabricObj.enterEditing();
    fabricObj.hiddenTextarea.focus();
    canvas.renderAll();
  }

  render() {
    const toolbarProps = this.getToolbarProps();

    return (
      <div className={styles['text-editor']}>
        <div className={styles.column}>
          <CanvasTextToolbar {...toolbarProps} />
          <div className='canvas-wrapper'>
            <canvas ref='canvas'></canvas>
          </div>
        </div>
      </div>
    );
  }
}

CanvasText.createTextComponent = function (currentCompContent, callback, callbackParam) {
  if(currentCompContent.content.version == '1.0'){
    const styles = {
      fontSize: currentCompContent.content.fontSize,
      opacity: 1,
      fontStyle: currentCompContent.content.italic ? 'italic' : '',
      fontFamily: currentCompContent.content.fontFamily,
      textBackgroundColor: currentCompContent.content.textBackgroundColor,
      fill: currentCompContent.content.textColor,
      fontWeight: currentCompContent.content.bold ? 'bold' : 'normal',
    };

    if (currentCompContent.content.linethrough === true) {
      styles['textDecoration'] = 'line-through';
    }

    if (currentCompContent.content.overline === true) {
      styles['textDecoration'] = 'overline';
    }

    if (currentCompContent.content.underline === true) {
      styles['textDecoration'] = 'underline';
    }

    if (currentCompContent.content.strokeWidth != '') {
      styles['strokeWidth'] = currentCompContent.content.strokeWidth;
    }

    if (currentCompContent.content.strokeColor != '') {
      styles['stroke'] = currentCompContent.content.strokeColor;
    }

    //create fabric text object
    let obj =  new fabric.IText(currentCompContent.content.text, styles);

    if(callbackParam){
      return callback(obj, callbackParam, currentCompContent);
    } else {
      return callback(obj, currentCompContent);
    }
  } else if (currentCompContent.content.version == '2.0'){
    let obj = JSON.parse(currentCompContent.content.text_json);
    fabric.util.enlivenObjects([obj], function(objects) {
      let obj = objects[0];
      if(callbackParam){
        return callback(obj, callbackParam, currentCompContent);
      } else {
        return callback(obj, currentCompContent);
      }
    });
  }
};

CanvasText.getComponentDefault = function () {
  const defaultContent = {
    version         : '2.0',
    text_json       : '{"type":"i-text","originX":"left","originY":"top","left":200,"top":133.33,"width":87.13,"height":20.97,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"lorem ipsum","fontSize":16,"fontWeight":"normal","fontFamily":"helvetica","fontStyle":"","lineHeight":1.16,"textDecoration":"","textAlign":"left","textBackgroundColor":"","styles":{}}',
  };
  return defaultContent;
};

module.exports = CanvasText;
