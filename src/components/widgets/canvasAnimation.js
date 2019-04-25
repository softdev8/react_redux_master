import styles from './canvasAnimation.module.scss';

import React from 'react'
import {findDOMNode} from 'react-dom';
import Canvas from "./Canvas/canvas";
import update from 'react-addons-update';

const EducativeUtil = require('../common/ed_util');
const Button = require('../common/Button');
const Icon = require('../common/Icon');
import {SomethingWithIcon, Icons} from '../index';

import {Modal, ModalBody} from '../common/Modal';
const CanvasAnimationViewer = require('./canvasAnimationViewer');

class Thumbnail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onDuplicateClickHandler = this.onDuplicateClickHandler.bind(this);
    this.onRemoveClickHandler = this.onRemoveClickHandler.bind(this);
    this.onSelectClickHandler = this.onSelectClickHandler.bind(this);

    this.state = {
      index: props.index,
      svg: props.svg,
    };
  }

  componentDidMount() {
    this.setSvgCSS();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.svg === nextProps.svg && this.props.selected == nextProps.selected){
      return false;
    }

    return true;
  }

  componentDidUpdate() {
    this.setSvgCSS();
  }

  onDuplicateClickHandler(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.onDuplicate) {
      this.props.onDuplicate(this.state.index);
    }
  }

  onRemoveClickHandler(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.onRemove) {
      this.props.onRemove(this.state.index);
    }
  }

  onSelectClickHandler(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.onSelect) {
      this.props.onSelect(this.state.index);
    }
  }

  setSvgCSS() {
    if(this.props.svg != ''){
      let domNode = findDOMNode(this.refs.canvasAnimationSvgPreview);
      $($(domNode)[0].lastChild).css({width: "100%",height : "100%"});
    }
  }

  render() {
    const svg_style = {
      width: '100px',
      height: '80px',
      position: 'relative',
    };

    let svgHTML = {__html : this.props.svg};
    let icon = <div ref='canvasAnimationSvgPreview' style={svg_style} dangerouslySetInnerHTML={svgHTML} />;

    const selectedStyle = (this.props.selected == true) ? {border: '2px solid #2EB398'} : {};
    return <a className='canvas-animation-thumbnail' data-thumb-index={this.state.index} style={selectedStyle}
              onClick={this.onSelectClickHandler}>
      {icon}
      <div className='text-center' style={{display:'block'}}>
        <h5 className='canvas-animation-thumbnail-text'><span>{this.state.index + 1}</span></h5>
        <Button className='canvas-animation-action-button' onClick={this.onDuplicateClickHandler}>
          <SomethingWithIcon icon={Icons.cloneIcon}/>
        </Button>
        <Button className='canvas-animation-action-button' onClick={this.onRemoveClickHandler}>
          <SomethingWithIcon icon={Icons.closeIcon1}/>
        </Button>
      </div>
    </a>
  }
}

class ThumbnailStrip extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {

    const tabsContainer = $(findDOMNode(this.refs.tabsContainer));
    if (!this.props.readOnly) {
      this.sortable = tabsContainer.sortable({
        axis: 'x',
        items: '.canvas-animation-thumbnail',
        scroll: true,
        scrollSensitivity: 50,
        scrollSpeed: 40,
        tolerance: 'pointer',
        delay: 50,
        placeholder: 'cmcomp-tabs-placeholder',
        start: this.handleDrag,
        stop: this.handleDrop,
      });

      tabsContainer.mousedown(function(){
        document.activeElement.blur();
      });
    }
  }

  handleDrag(event, ui) {
    $(ui.placeholder).width(ui.item.width());
    const key = parseInt(ui.item[0].getAttribute('data-thumb-index'));
    this.handleSelect(key);
  }

  handleDrop(event, ui) {
    const orders = [];
    const tabs = $(findDOMNode(this.refs.tabsContainer)).find('.canvas-animation-thumbnail');
    tabs.each(function (index) {
      orders.push(parseInt(this.getAttribute('data-thumb-index')));
    });
    this.sortable.sortable('cancel');
    this.props.reorderCanvas(orders);
  }

  handleSelect(key) {
    // tab selection issue: when modifying the title of the tab, this method is called
    // with a non valid key, which is weird and causes the current tab to get unselected.
    // workaround: test if the key is valid
    if (typeof key == 'number') {
      this.props.selectCanvas(key);
    }
  }

  render() {
    const thumbnails = this.props.canvasObjects.map((canvas, i) => <Thumbnail key={`th${i}`} index={i} svg={canvas.svg_string} selected={i == this.props.selectedCanvas}
                      onSelect={this.props.selectCanvas} onRemove={this.props.removeCanvas}
                      onDuplicate={this.props.duplicateCanvas}/>);
    return <div className={styles.canvasAnimationThumbnailStrip} ref='tabsContainer' style={{display:'block'}}>
      {thumbnails}
      <a className='canvas-animation-add-thumbnail' onClick={this.props.addCanvas}>
        <SomethingWithIcon icon={Icons.thinPlus}/>
      </a>
      <Button className='cmcomp-tabs-scroll-left educative-codecomponent-scroll-control' ref='tabsScrollLeft'
              onMouseDown={this.scrollLeft} onMouseUp={this.cancelScroll}>
        <Icon glyph='glyphicon glyphicon-chevron-left'/>
      </Button>
      <Button className='cmcomp-tabs-scroll-right educative-codecomponent-scroll-control' ref='tabsScrollRight'
              onMouseDown={this.scrollRight} onMouseUp={this.cancelScroll}>
        <Icon glyph='glyphicon glyphicon-chevron-right'/>
      </Button>
    </div>;
  }
}

class CanvasAnimation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addCanvas = this.addCanvas.bind(this);
    this.changeHeight = this.changeHeight.bind(this);
    this.changeWidth = this.changeWidth.bind(this);
    this.duplicateCanvas = this.duplicateCanvas.bind(this);
    this.removeCanvas = this.removeCanvas.bind(this);
    this.reorderCanvas = this.reorderCanvas.bind(this);
    this.selectCanvas = this.selectCanvas.bind(this);
    this.updateCanvasState = this.updateCanvasState.bind(this);
    let keygen = 0;
    const keys = [];
    props.content.canvasObjects.map(function (obj, i) {
      keys[i] = keygen++;
    });

    this.state = {
      keys,
      bufferedCanvasContent : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.content.keys){
      this.state.keys = nextProps.content.keys;
    }
  }

  addCanvas() {
    const canvasComp = Canvas.getComponentDefault();
    this.addCanvasObject(canvasComp);
  }

  addCanvasBase(canvasComp, duplicateExisting, insertIndex) {
    canvasComp.width = this.props.content.width;
    canvasComp.height = this.props.content.height;
    const canvasObjects =  this.props.content.canvasObjects;
    const newKey = this.generateUniqueKey(this.state.keys);
    const selectedIndex = this.getSelectedCanvasIndex();
    const imUpdate = this.state.bufferedCanvasContent;
    let keys = this.state.keys;

    if(duplicateExisting){

      let newCanvasObjects = [];
      let newKeys = [];
      for(let i=0 ; i < canvasObjects.length; i++){
        //if we have buffered state change report it
        if(imUpdate != null && i == selectedIndex){
          newCanvasObjects.push({
            width: imUpdate.width,
            height: imUpdate.height,
            objectsDict: imUpdate.objectsDict,
            svg_string:imUpdate.svg_string,
            canvasJSON:imUpdate.canvasJSON,
            caption:imUpdate.caption,
            version: imUpdate.version,
          });
        } else {
          newCanvasObjects.push(canvasObjects[i]);
        }

        newKeys.push(keys[i]);

        if(i == insertIndex){
          newCanvasObjects.push(canvasComp);
          newKeys.push(newKey);
        }
      }

      this.props.updateContentState({
        canvasObjects: newCanvasObjects,
        selectedCanvas: insertIndex+1,
        keys: newKeys,
      });
    } else {
      keys[keys.length] = newKey;
      
      if(imUpdate != null){
        //batch two updates i.e. create a new comp and also report the existing buffered state change
        this.props.updateContentState({
          canvasObjects: [
            ...canvasObjects.slice(0, selectedIndex),
            {
              width: imUpdate.width,
              height: imUpdate.height,
              objectsDict: imUpdate.objectsDict,
              svg_string:imUpdate.svg_string,
              canvasJSON:imUpdate.canvasJSON,
              caption:imUpdate.caption,
              version: imUpdate.version,
            },
            ...canvasObjects.slice(selectedIndex + 1),
            canvasComp,
          ],

          selectedCanvas: canvasObjects.length,
          keys: [...keys],
        });
      } else {
          this.props.updateContentState({
            canvasObjects: [
              ...canvasObjects,
              canvasComp,
            ],

            selectedCanvas: canvasObjects.length,
            keys: [...keys],
          });
      }
    }

    this.state.bufferedCanvasContent = null;
  }

  addCanvasObject(canvasComp) {
    this.saveCurrentCanvas();
    
    this.addCanvasBase(canvasComp);
  }

  changeHeight(value) {
    let canvasObjects = this.props.content.canvasObjects;
    canvasObjects.map(function (canvasObject, i) {
      canvasObject.height = value;
    });

    this.props.updateContentState({
      canvasObjects,
      height: value,
    });
  }

  changeWidth(value) {
    let canvasObjects = this.props.content.canvasObjects;
    canvasObjects.map(function (canvasObject, i) {
      canvasObject.width = value;
    });

    this.props.updateContentState({
      canvasObjects,
      width: value,
    });
  }

  duplicateCanvas(index) {
    this.saveCurrentCanvas();

    let canvasComp = this.props.content.canvasObjects[index];
    //In case its current selected state then try to fetch the buffered state
    if(index == this.getSelectedCanvasIndex() && this.state.bufferedCanvasContent != null){
      canvasComp = this.state.bufferedCanvasContent;
    } 
    canvasComp = EducativeUtil.cloneObject(canvasComp);
    this.addCanvasBase(canvasComp, true, index);
  }

  generateUniqueKey(keys) {
    if(!keys || keys.length == 0){
      return 0;
    } else {
      return Math.max(...keys) + 1;
    }
  }

  getSelectedCanvasIndex() {
      const selectedCanvas = this.props.content.selectedCanvas? this.props.content.selectedCanvas : 0;
      return selectedCanvas;
  }

  removeCanvas(index) {

    const selectedCanvas = this.getSelectedCanvasIndex();

    let updatedSelectedIndex = selectedCanvas;
    if (index < selectedCanvas) {
      updatedSelectedIndex = selectedCanvas - 1;
    } else if (index == selectedCanvas) {
      //if its the last element
      if (this.props.content.canvasObjects.length - 1 == selectedCanvas) {
        updatedSelectedIndex = selectedCanvas - 1;
      }
    }

    const keys = update(this.state.keys, {$splice: [[index, 1]]});
    const canvasObjects = this.props.content.canvasObjects;

    this.props.updateContentState({
      canvasObjects: [
        ...canvasObjects.slice(0, index),
        ...canvasObjects.slice(index + 1),
      ],

      keys: [...keys],
      selectedCanvas: updatedSelectedIndex,
    });
  }

  reorderCanvas(updatedOrder) {
    if (updatedOrder.length <= 1) {
      return;
    }

    let selectedCanvas = 0;
    const canvasObjects = [];
    const keys = [];

    for (let i = 0; i < updatedOrder.length; i++) {
      const originalIndex = updatedOrder[i];
      if(this.getSelectedCanvasIndex() == originalIndex){
        selectedCanvas = i;
      }

      canvasObjects.push(this.props.content.canvasObjects[originalIndex]);
      keys.push(this.state.keys[originalIndex]);
    }

    this.props.updateContentState({
      canvasObjects,
      keys,
      selectedCanvas,
    });
  }

  saveComponent() {
    if(this.props.mode == 'edit'){
      this.saveCurrentCanvas();

      const canvasObjects =  this.props.content.canvasObjects;
      const selectedIndex = this.getSelectedCanvasIndex();
      const imUpdate = this.state.bufferedCanvasContent;

      this.props.updateContentState({
        canvasObjects: [
          ...canvasObjects.slice(0, selectedIndex),
          {
            width: imUpdate.width,
            height: imUpdate.height,
            objectsDict: imUpdate.objectsDict,
            svg_string:imUpdate.svg_string,
            canvasJSON:imUpdate.canvasJSON,
            caption:imUpdate.caption,
            version: imUpdate.version,
          },
          ...canvasObjects.slice(selectedIndex + 1),
        ],
      });

      this.state.bufferedCanvasContent = null;
    }
  }

  saveCurrentCanvas() {
    if (this.refs.canvasRef != null && this.refs.canvasRef.saveComponent) {
      this.refs.canvasRef.saveComponent();
    }
  }

  selectCanvas(index) {
    this.saveCurrentCanvas();

    const canvasObjects =  this.props.content.canvasObjects;
    const selectedIndex = this.getSelectedCanvasIndex();
    const imUpdate = this.state.bufferedCanvasContent;

    this.props.updateContentState({
      canvasObjects: [
        ...canvasObjects.slice(0, selectedIndex),
        {
          width: imUpdate.width,
          height: imUpdate.height,
          objectsDict: imUpdate.objectsDict,
          svg_string:imUpdate.svg_string,
          canvasJSON:imUpdate.canvasJSON,
          caption:imUpdate.caption,
          version: imUpdate.version,
        },
        ...canvasObjects.slice(selectedIndex + 1),
      ],

      selectedCanvas: index,
    });

    this.state.bufferedCanvasContent = null;
  }

  updateCanvasState(imUpdate) {
    this.state.bufferedCanvasContent = imUpdate;
  }

  render() {
    const readOnly = (this.props.mode != 'edit');

    if (readOnly) {
      return <CanvasAnimationViewer content={this.props.content} pageProperties={this.props.pageProperties} key='canvasViewer' />;
       
    } else {
      const selectedCanvas = this.getSelectedCanvasIndex();

      let compAlign = 'center';
      if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
        compAlign = this.props.pageProperties.pageAlign;
      }

      const canvasContent = this.props.content.canvasObjects ? this.props.content.canvasObjects[selectedCanvas] : null;
 
      let canvas = null;
      if (canvasContent != null) {
        var key = this.state.keys[selectedCanvas];
        const config = {canvasInAnimation: true};
        const canvasCount = this.props.content.canvasObjects != null ? this.props.content.canvasObjects.length : 0;

        canvas = <Canvas ref='canvasRef' key={key} mode='edit' content={canvasContent}
                         pageProperties={this.props.pageProperties} config={config} onWidthChange={this.changeWidth}
                         onHeightChange={this.changeHeight} updateContentState = {this.updateCanvasState}/>;
      } else {
        canvas =
          <p className='text-center fg-darkgray50'><br/><br/>Click the add icon below to add a canvas<br/><br/></p>;
      }

      return <div style={{display:'block'}}>
        <ThumbnailStrip canvasObjects={this.props.content.canvasObjects} keys={this.state.keys}
                        selectedCanvas={selectedCanvas} reorderCanvas={this.reorderCanvas}
                        selectCanvas={this.selectCanvas} removeCanvas={this.removeCanvas}
                        duplicateCanvas={this.duplicateCanvas} addCanvas={this.addCanvas}/>

        <div style={{display:'block'}}>
          {canvas}
        </div>
      </div>
    }
  }
}

//HACK: This method isn't called for Canvas component to avoid a cyclic dependency of ComponentMeta and Canvas
CanvasAnimation.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    width: 600,
    height: 400,
    canvasObjects: [Canvas.getComponentDefault()],
  };
  return defaultContent;
};

CanvasAnimation.getNewComponentDefault = function () {
  const defaultContent = {
    version: '2.0',
    width: 600,
    height: 400,
    canvasObjects: [Canvas.getComponentDefault()],
    keys: [0],
    selectedCanvas: 0,
  };
  return defaultContent;
};

CanvasAnimation.propTypes = {
  mode: React.PropTypes.oneOf(['view', 'edit']).isRequired,

  content: React.PropTypes.shape({
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    canvasObjects: React.PropTypes.array.isRequired,
  }).isRequired,
};

module.exports = CanvasAnimation;