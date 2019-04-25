import styles from './canvas.module.scss';

import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Grid, Col, Row} from 'react-bootstrap';
import { DropTarget } from 'react-dnd';
import Immutable from 'immutable';

import CaptionComponent from '../../CaptionComponent/CaptionComponent';
import CanvasComponentView from '../CanvasComponentView/CanvasComponentView';
import EducativeUtil from '../../common/ed_util';
import {Modal} from '../../common/Modal';
import Button from '../../common/Button';
import Icon from '../../common/Icon';
import ModalManager from '../../common/ModalManager';
import Input from '../../common/Input';
import {getComponentMeta} from '../../../component_meta';
import PureComponent from 'react-pure-render/component'
import DumbModal from '../../common/dumbModal';
import CanvasWidgetPanel from './CanvasWidgetPanel';
import CanvasMainMenu from './CanvasMainMenu';
import CanvasText from '../CanvasText/CanvasText';

const canvasTarget = {
  drop() {
    return {};
  },
};

@DropTarget('CANVASCOMP', canvasTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class CanvasComponentInternal extends Component{
  static propTypes: {
    mode: React.PropTypes.object.isRequired,
    content: {
      width: React.PropTypes.number,
      height: React.PropTypes.number,
      objectsDict: React.PropTypes.object.isRequired
    }
  }

  constructor(props, context) {
    super(props, context);

    this.saveComponent  = this.saveComponent.bind(this);

    this.createCanvas = this.createCanvas.bind(this);
    this.switchGridLines = this.switchGridLines.bind(this);
    this.createGridLines = this.createGridLines.bind(this);
    this.removeGridLines = this.removeGridLines.bind(this);
    this.sendGridLinesBack = this.sendGridLinesBack.bind(this);
    this.removeCanvas = this.removeCanvas.bind(this);
    this.loadCanvasFromJSON = this.loadCanvasFromJSON.bind(this);
    this.onSelectionCleared = this.onSelectionCleared.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.onObjectModified = this.onObjectModified.bind(this);
    this.onObjectSelected = this.onObjectSelected.bind(this);
    this.onObjectDoubleClicked = this.onObjectDoubleClicked.bind(this);
    this.cleanupComponents = this.cleanupComponents.bind(this);
    this.removeEdComponentSvg = this.removeEdComponentSvg.bind(this);
    this.addObjectToFabricCanvas = this.addObjectToFabricCanvas.bind(this);
    this.addObjectToFabricCanvasInt = this.addObjectToFabricCanvasInt.bind(this);
    this.updateObjectOnFabricCanvas = this.updateObjectOnFabricCanvas.bind(this);
    this.updateObjectOnFabricCanvasInt = this.updateObjectOnFabricCanvasInt.bind(this);
    this.replicatePreviousObjectAttributes = this.replicatePreviousObjectAttributes.bind(this);
    this.setupFabricObjEventHandlers = this.setupFabricObjEventHandlers.bind(this);
    this.addFabricObjectToState = this.addFabricObjectToState.bind(this);
    this.updateFabricObjectToState = this.updateFabricObjectToState.bind(this);
    this.addComponent = this.addComponent.bind(this);
    this.editToggleComponent = this.editToggleComponent.bind(this);
    this.editComponentCompleteCallback = this.editComponentCompleteCallback.bind(this);
    this.removeComponent = this.removeComponent.bind(this);
    this.onEdCompnentUpdate = this.onEdCompnentUpdate.bind(this);
    this.onEdCompnentCancelUpdate = this.onEdCompnentCancelUpdate.bind(this);
    this.showEditDialog = this.showEditDialog.bind(this);
    this.onWidthChange = this.onWidthChange.bind(this);
    this.onHeightChange = this.onHeightChange.bind(this);
    this.bringToFront = this.bringToFront.bind(this);
    this.sendToBack = this.sendToBack.bind(this);
    this.testSerialization = this.testSerialization.bind(this);
    this.onCaptionChange = this.onCaptionChange.bind(this);
    this.onComponentHeightChange = this.onComponentHeightChange.bind(this);
    this.onComponentWidthChange = this.onComponentWidthChange.bind(this);
    this.onComponentXChange = this.onComponentXChange.bind(this);
    this.onComponentYChange = this.onComponentYChange.bind(this);
    this.onComponentAngleChange = this.onComponentAngleChange.bind(this);
    this.onComponentScaleChange = this.onComponentScaleChange.bind(this);
    this.centerComponent = this.centerComponent.bind(this);
    this.centerComponentHorizontal = this.centerComponentHorizontal.bind(this);
    this.centerComponentVertical = this.centerComponentVertical.bind(this);
    this.setDuplicatedComponentPosition = this.setDuplicatedComponentPosition.bind(this);
    this.duplicateComponent = this.duplicateComponent.bind(this);

    this.state = {
      id: EducativeUtil.getKey(),
      content: this.props.content,
      canvas: null,
      selectedReactComponentToRender: null,
      currentComponentEdContent: null,
      currentComponentEdId: null,
      currentFabricComponent: null,
      componentAction: null,
      objectsDict: this.props.content.objectsDict,
      gridLinesRuler: null,
    };
  }

  saveComponent () {
    if (!this.state.canvas) {
      return;
    }

    this.removeGridLines();

    for (let key in this.state.objectsDict) {
      if (this.state.objectsDict.hasOwnProperty(key)) {
        this.cleanupComponents(this.state.objectsDict[key]);
      }
    }

    // rasterize canvas as svg
    this.state.content.svg_string = this.state.canvas.toSVG({
      viewBox: {
        x: 0,
        y: 0,
        width: this.state.content.width,
        height: this.state.content.height,
      },
    });

    const canvasJson = JSON.stringify(this.state.canvas);

    this.props.updateContentState({
      width: this.state.content.width,
      height: this.state.content.height,
      objectsDict: this.state.objectsDict,
      svg_string:this.state.content.svg_string,
      canvasJSON: canvasJson,
      caption: this.state.content.caption,
      version: this.state.content.version,
    });

    this.createGridLines();
  }

  componentDidMount () {
    this.createCanvas();
  }

  componentDidUpdate () {
    this.createCanvas();
  }

  createCanvas () {
    if (this.state.canvas == null) {

      const addListener = fabric.util.addListener;
      const removeListener = fabric.util.removeListener;

      fabric.CanvasEx = fabric.util.createClass(
        fabric.Canvas,
        /** @lends fabric.Canvas */ {
          tapholdThreshold: 2000,

          _bindEvents() {
              const self = this;

              self.callSuper('_bindEvents');

              self._onDoubleClick = self._onDoubleClick.bind(self);
          },

          _onDoubleClick(e) {
              const self = this;

              const target = self.findTarget(e);
              self.fire(
                'mouse:dblclick',
                {
                  target,
                  e,
                },
              );

              if (target && !self.isDrawingMode) {
                  // To unify the behavior, the object's double click event does not fire on drawing mode.
                  target.fire(
                    'object:dblclick',
                    {
                      e,
                    },
                  );
              }
          },

          _onDoubleTap(e) {
              const self = this;

              const target = self.findTarget(e);
              self.fire(
                'touch:doubletap',
                {
                  target,
                  e,
                },
              );

              if (target && !self.isDrawingMode) {
                  // To unify the behavior, the object's double tap event does not fire on drawing mode.
                  target.fire(
                    'object:doubletap',
                    {
                      e,
                    },
                  );
              }
          },

          _initEventListeners() {
              const self = this;
              self.callSuper('_initEventListeners');

              addListener(self.upperCanvasEl, 'dblclick', self._onDoubleClick);
          },

          removeListeners() {
              const self = this;
              self.callSuper('removeListeners');

              removeListener(self.upperCanvasEl, 'dblclick', self._onDoubleClick);
          },
        },
      );


      var width = this.props.content.width;
      var height = this.props.content.height;

      this.state.canvas = new fabric.CanvasEx(
        findDOMNode(this.refs.scene),
        {
          width,
          height,
        },
      );

      initAligningGuidelines(this.state.canvas);

      this.state.canvas.on('selection:cleared', this.onSelectionCleared);
      //this.state.canvas.on('selection:created', this.onSelectionCreated);
      //this.state.canvas.on('object:moving', this.onObjectMove);
      //this.state.canvas.on('object:scaling', this.onObjectMove);
      //this.state.canvas.on('object:rotating', this.onObjectRotate);
      this.state.canvas.on('mouse:dblclick', this.onObjectDoubleClicked);


      //load canvas from JSON if JSON is non null or non empty
      if (this.props.content.canvasJSON != null && this.props.content.canvasJSON != '') {
        this.loadCanvasFromJSON(this.props.content.canvasJSON);
      }

      this.createGridLines();

    } else {
      this.state.canvas.setWidth(this.props.content.width);
      this.state.canvas.setHeight(this.props.content.height);
    }

  }

  switchGridLines () {
    if (this.state.gridLinesRuler == null) {
      this.createGridLines();
    } else {
      this.removeGridLines();
    }
  }

  createGridLines () {
    if (this.state.gridLinesRuler == null) {
      const gridUnitSize = 20;
      var gridLinesRuler = [];

      for (var i = 0; i < this.state.canvas.height; i += gridUnitSize) {
        var stkWidth = (i % 100 == 0 && i != 0) ? 2 : 1;
        var line = new fabric.Line(
          [0, i, this.state.canvas.width, i],
          {
            stroke: '#F0EDED',
            strokeWidth: stkWidth,
            selectable: false,
          },
        );
        gridLinesRuler.push(line);

        if (i % 100 == 0 && i != 0) {
          const x = new fabric.Text(
            '{0}'.format(i),
            {
              fontFamily: 'Courier New',
              left: 0,
              top: i,
              fontSize: 10,
              fill: '#000000',
              selectable: false,
            },
          );
          gridLinesRuler.push(x);
        }
      }

      for (var i = 0; i < this.state.canvas.width; i += gridUnitSize) {
        var stkWidth = (i % 100 == 0 && i != 0) ? 2 : 1;
        var line = new fabric.Line(
          [i, 0, i, this.state.canvas.height],
          {
            stroke: '#F0EDED',
            strokeWidth: stkWidth,
            selectable: false,
          },
        );
        gridLinesRuler.push(line);

        if (i % 100 == 0 && i != 0) {
          const x = new fabric.Text(
            '{0}'.format(i),
            {
              fontFamily: 'Courier New',
              left: i,
              top: 0,
              fontSize: 10,
              fill: '#000000',
              selectable: false,
            },
          );
          gridLinesRuler.push(x);
        }
      }

      const group = new fabric.Group(gridLinesRuler);
      this.state.canvas.add(group);

      group.set('selectable', false);
      this.state.gridLinesRuler = group;
      this.sendGridLinesBack();
    }
  }

  removeGridLines () {
    if (this.state.gridLinesRuler) {

      const canvas = this.state.canvas;
      canvas.setActiveGroup(this.state.gridLinesRuler);

      if (canvas.getActiveGroup()) {
        canvas.getActiveGroup().forEachObject(
          function (object) {
            canvas.remove(object);
          });

        canvas.remove(canvas.getActiveGroup());

        canvas.discardActiveGroup().renderAll();
      }

      this.state.gridLinesRuler = null;
    }
  }

  sendGridLinesBack () {
    if (this.state.gridLinesRuler) {
      this.state.gridLinesRuler.sendToBack();
    }
  }

  componentWillUnmount(){
    this.removeCanvas();
  }

  removeCanvas () {
    if (this.state.canvas != null) {
      this.state.canvas.clear();
      this.state.canvas = null;
    }
  }

  loadCanvasFromJSON (json) {
    const canvas = this.state.canvas;
    const setupFabricObjEventHandlers = this.setupFabricObjEventHandlers;
    const onObjectSelected = this.onObjectSelected;
    const updateFabricObjectToState = this.updateFabricObjectToState;
    const objectsDict = this.state.objectsDict;

    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function (o, object) {
      //fabric.log(o, object);
      const edID = object.edID;

      setupFabricObjEventHandlers(object,
        function () {
          updateFabricObjectToState(edID, objectsDict[edID].educativeObjContent);
        },
        function () {
          onObjectSelected(object);
        });

    });
  }
  // // This method is called when an object is selected by creating a drawing area. This may be single or multiple objects
  // onSelectionCreated: function(event){
  //     console.log("selection created");
  //     // This is the scenario where multi-selection may happen. We need to make sure that delete and other operations work fine here
  // },
  onSelectionCleared (event) {
    // Update the current component here
    this.clearSelected();
  }

  clearSelected () {
    this.state.selectedReactComponentToRender = null;
    this.state.currentComponentEdContent = null;
    this.state.currentComponentEdId = null;
    this.state.currentFabricComponent = null;
    this.forceUpdate();
  }
  // onObjectMove: function(event) {
  //   var activeObject = event.target;
  //   console.log(activeObject);
  //   console.log(activeObject.get('left'), activeObject.get('top'));
  //   //look up this object in map and set its x and y coordinates
  // },
  // onObjectScale: function(event) {
  //   var activeObject = event.target;
  //   console.log(activeObject.get('scaleX'), activeObject.get('scaleY'));
  //   //look up this object in map and set
  // },
  // onObjectRotate: function(event) {
  //   var activeObject = event.target;
  //   console.log(activeObject.get('angle'));
  //   //look up this object in map and set
  // },
  onObjectModified () {
    this.forceUpdate();
  }

  onObjectSelected (fabricObj) {
    //console.log(fabricObj);
    //console.log(this.state.objectsDict);
    this.state.currentFabricComponent = fabricObj;
    this.state.currentComponentEdId = fabricObj.edID;
    this.state.currentComponentEdContent = this.state.objectsDict[fabricObj.edID].educativeObjContent;
    this.forceUpdate();
    //console.log( "......selected ...... ");
    //console.log(this.state.currentComponentEdContent);
  }

  onObjectDoubleClicked (event) {
    if(event.target == null || event.target.edID == null){
      //Double click on an empty area
      return;
    }
    let fabricObj = event.target;
    this.state.currentFabricComponent = fabricObj;
    this.state.currentComponentEdId = fabricObj.edID;
    this.state.currentComponentEdContent = this.state.objectsDict[fabricObj.edID].educativeObjContent;

    this.editToggleComponent();
  }

  removeEdComponentSvg(component) {
    if(component.type === 'SVG' || component.type == 'CanvasText'
        || component.type=='CanvasImage' || component.type == 'Graph') {
      return;
    }

    component.content.svg_string = null;
  }

  removeEdComponentImageData(component) {
    if(component.type == 'CanvasImage'  || component.type == 'Graph') {
      component.content.image_data = null;
    }
  }

  cleanupComponents(component) {
    //
    // 1. remove fabricObj since it's not needed to recreate canvas. This only applies to
    //    older versions of canvas where we were keeping it in the state.
    //

    if (component.hasOwnProperty("fabricObj")) {
      delete component.fabricObj;
    }

    //
    // 2. remove svg as we don't need to keep duplicate copies in canvas and EdComponent.
    //    EdComponent will generate the svg when mounted in edit mode. Graphviz, however,
    //    still needs refactoring to support this.
    //

    this.removeEdComponentSvg(component.educativeObjContent);

    this.removeEdComponentImageData(component.educativeObjContent);
  }

  addObjectToFabricCanvasInt (fabObj, edObj, setCoords) {
    let canvas = this.state.canvas;
    let setupFabricObjEventHandlers = this.setupFabricObjEventHandlers;
    let addFabricObjectToState = this.addFabricObjectToState;
    let onObjectSelected = this.onObjectSelected;

    if (setCoords) {
      fabObj.set({
        left: canvas.width - fabObj.getWidth() - 10,
        top: 10,
      }).setCoords();
    }

    setupFabricObjEventHandlers(fabObj,
      function () {
        addFabricObjectToState(fabObj, edObj);
      },
      function () {
        onObjectSelected(fabObj);
      }
    );

    canvas.add(fabObj).deactivateAll().renderAll();
  }

  addObjectToFabricCanvas (currentCompContent) {
    if (currentCompContent.type === 'CanvasText') {
      return CanvasText.createTextComponent(
        currentCompContent, this.addObjectToFabricCanvasInt);
      return;
    } else if(currentCompContent.type == 'CanvasImage' || currentCompContent.type == 'Graph') {
      let obj = this.createImageComponent(currentCompContent,
        (obj)=>{
          this.addObjectToFabricCanvasInt(obj, currentCompContent);
          this.removeEdComponentImageData(currentCompContent);
        });
      return;
    }

    let svgContent = currentCompContent.content.svg_string;
    if(currentCompContent.type == 'SVG'){
      svgContent = this.removeInvalidSvgProperties(svgContent);
    }

    let addObjectToFabricCanvasInt = this.addObjectToFabricCanvasInt;
    fabric.loadSVGFromString(svgContent,
      function (objects, options) {
        const obj = fabric.util.groupSVGElements(objects, options);
        addObjectToFabricCanvasInt(obj, currentCompContent);
    });

    this.removeEdComponentSvg(currentCompContent);
  }

  updateObjectOnFabricCanvasInt(newFabricObj, oldFabricObj, edObj) {
    let canvas = this.state.canvas;
    let onObjectSelected = this.onObjectSelected;
    let updateFabricObjectToState = this.updateFabricObjectToState;

    canvas.remove(oldFabricObj);
    this.replicatePreviousObjectAttributes(oldFabricObj, newFabricObj);

    this.setupFabricObjEventHandlers(newFabricObj,
      function () {
        updateFabricObjectToState(newFabricObj.edID, edObj);
      },
      function () {
        onObjectSelected(newFabricObj);
    });

    canvas.add(newFabricObj).renderAll();
  }

  updateObjectOnFabricCanvas (oldFabricObj, currentCompContent) {
    let updateObjectOnFabricCanvasInt = this.updateObjectOnFabricCanvasInt;

    if (currentCompContent.type === 'CanvasText') {
      return CanvasText.createTextComponent(
        currentCompContent, updateObjectOnFabricCanvasInt, oldFabricObj);

    } else if(currentCompContent.type == 'CanvasImage' || currentCompContent.type == 'Graph') {
      let obj = this.createImageComponent(currentCompContent,
        (obj)=>{
          updateObjectOnFabricCanvasInt(obj, oldFabricObj, currentCompContent);
          this.removeEdComponentImageData(currentCompContent);
        });
      return;
    }

    let newSvgContent = currentCompContent.content.svg_string;
    if(currentCompContent.type == 'SVG'){
      newSvgContent = this.removeInvalidSvgProperties(newSvgContent);
    }

    fabric.loadSVGFromString(newSvgContent, function (objects, options) {
      const updatedObj = fabric.util.groupSVGElements(objects, options);
      updateObjectOnFabricCanvasInt(updatedObj, oldFabricObj, currentCompContent);
    });

    this.removeEdComponentSvg(currentCompContent);
  }

  replicatePreviousObjectAttributes (oldObj, newObj) {
    newObj.setAngle(oldObj.getAngle());

    newObj.set({left: oldObj.left, top: oldObj.top})
      .setCoords();

    newObj.setOriginX(oldObj.getOriginX());
    newObj.setOriginY(oldObj.getOriginY());
    newObj.setScaleX(oldObj.getScaleX());
    newObj.setScaleY(oldObj.getScaleY());
    newObj.setFlipX(oldObj.getFlipX());
    newObj.setFlipY(oldObj.getFlipY());
    newObj.edID = oldObj.edID;
  }

  //HACK: We have to remove these incorrect svg properties coming from method-draw lib
  removeInvalidSvgProperties(svgContent){
    let newSvgContent = svgContent.replace(' fill-opacity="null"','');
    newSvgContent = newSvgContent.replace(' stroke-opacity="null"','');
    return newSvgContent;
  }

  createImageComponent(currentCompContent, callback) {
    fabric.Image.fromURL(currentCompContent.content.image_data, callback);
  }

  setupFabricObjEventHandlers (obj, objAddedEventHandler, objSelectedEventHandler) {
    obj.on('selected', objSelectedEventHandler);

    obj.on('added', objAddedEventHandler);

    obj.on('modified', this.onObjectModified);

    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(
          toObject.call(this),
          {
            edID: this.edID,
          },
        );
      };
    })(obj.toObject);
  }

  addFabricObjectToState (obj, currentCompContent) {
    obj.edID = this.state.id;
    this.state.id++;
    this.state.objectsDict[obj.edID] = {educativeObjContent: currentCompContent};
  }

  updateFabricObjectToState (edID, currentCompContent) {
    this.state.objectsDict[edID] = {educativeObjContent: currentCompContent};
  }

  addComponent (componentType) {
    this.state.componentAction = 'add';

    // If its a svg component then directly add w/o showing the modal dialog
    if (componentType.indexOf('svg-') != -1) {
      var defaultComponentContent = EducativeUtil.cloneObject(getComponentMeta(componentType).defaultVal);

      this.state.currentComponentEdContent = defaultComponentContent;
      this.state.selectedReactComponentToRender = null;

      this.forceUpdate();
      this.addComponentCompleteCallback(true);
    }
    else {
      var defaultComponentContent = Immutable.fromJS(getComponentMeta(componentType).defaultVal);

      const config = {disableCaption: true};
      const edComponent = <CanvasComponentView config={config} comp={defaultComponentContent} index='1' key='102'
                                             onEdCompnentUpdate={this.onEdCompnentUpdate} onEdCompnentCancelUpdate={this.onEdCompnentCancelUpdate}/>;
      this.state.currentComponentEdContent = defaultComponentContent;
      this.state.selectedReactComponentToRender = edComponent;

      this.forceUpdate();
      this.showEditDialog();
    }
  }

  addComponentCompleteCallback (completed) {
    if (completed) {
      // add to canvas the svg string from the current component
      const fabricObj = this.addObjectToFabricCanvas(
        this.state.currentComponentEdContent);

      this.clearSelected();

    } else {
      this.setState({selectedReactComponentToRender: null});
    }
  }

  editToggleComponent () {
    if (this.state.currentComponentEdContent == null) {
      return;
    }

    const config = {disableCaption: true};
    if(this.state.currentComponentEdContent.type == 'CanvasImage'){
      //Put back the image data so it can be shown in editor state
      this.state.currentComponentEdContent.content.image_data = this.state.currentFabricComponent.getSrc()
    } else if(this.state.currentComponentEdContent.type == 'CanvasText'){
      this.state.currentComponentEdContent.content.text_json = JSON.stringify(this.state.currentFabricComponent);
    }

    const componentContent = Immutable.fromJS(this.state.currentComponentEdContent);
    const edComponent = <CanvasComponentView key='101' config={config} comp={componentContent}
                                           onEdCompnentUpdate={this.onEdCompnentUpdate} onEdCompnentCancelUpdate={this.onEdCompnentCancelUpdate}/>;

    this.state.selectedReactComponentToRender = edComponent;
    this.state.componentAction = 'edit';
    this.forceUpdate();
    this.showEditDialog();
  }

  editComponentCompleteCallback (completed) {
    if (completed) {
      const fabricObj = this.updateObjectOnFabricCanvas(
                        this.state.currentFabricComponent,
                        this.state.currentComponentEdContent);
    } else {
      this.setState({selectedReactComponentToRender: null});
    }
  }

  removeComponent () {
    const canvas = this.state.canvas;
    const objectsDict = this.state.objectsDict;

    if (canvas.getActiveGroup()) {

      canvas.getActiveGroup().forEachObject(
        function (object) {
          canvas.remove(object);
          delete objectsDict[object.edID];
        });

      canvas.discardActiveGroup().renderAll();
    } else if (canvas.getActiveObject() != null) {
      const object = canvas.getActiveObject();
      canvas.remove(object);
      delete objectsDict[object.edID];
    }
  }

  onEdCompnentUpdate (edComponent) {

    this.state.currentComponentEdContent = edComponent

    if (this.state.componentAction == 'add') {
      this.addComponentCompleteCallback(true);
    } else {
      this.editComponentCompleteCallback(true);
    }
    ModalManager.remove();
  }

  //Ideally this should be done by dumb modal component but since it doesn't pass any props canvas is setting the cancel handler
  onEdCompnentCancelUpdate () {
    ModalManager.remove();
  }

  showEditDialog () {
    ModalManager.create(MyModal, this.state.selectedReactComponentToRender);
  }

  onWidthChange (event) {
    let width = parseInt(event.target.value);

    if (isNaN(width)) {
      width = 0;
    }

    if(this.state.content.width == width){
      return;
    }

    this.state.content.width = width;

    if (this.props.config != null && this.props.config.canvasInAnimation == true) {
      this.props.onWidthChange(width);
    }

    this.forceUpdate();
    this.removeGridLines();
    this.state.canvas.setWidth(width);
    this.createGridLines();
  }

  onHeightChange (event) {
    let height = parseInt(event.target.value);

    if (isNaN(height)) {
      height = 0;
    }

    if (this.state.content.height == height){
      return ;
    }

    this.state.content.height = height;

    if (this.props.config != null && this.props.config.canvasInAnimation == true) {
      this.props.onHeightChange(height);
    }

    this.forceUpdate();
    this.removeGridLines();
    this.state.canvas.setHeight(height);
    this.createGridLines();
  }

  bringToFront () {
    const canvas = this.state.canvas;

    if (canvas.getActiveGroup()) {

      canvas.getActiveGroup().forEachObject(
        function (object) {
          canvas.bringToFront(object);
        });
    } else if (canvas.getActiveObject() != null) {
      const object = canvas.getActiveObject();
      canvas.bringToFront(object);
    }
  }

  sendToBack () {
    const canvas = this.state.canvas;

    if (canvas.getActiveGroup()) {

      canvas.getActiveGroup().forEachObject(
        function (object) {
          canvas.sendToBack(object);
        });
    } else if (canvas.getActiveObject() != null) {
      const object = canvas.getActiveObject();
      canvas.sendToBack(object);
    }

    this.sendGridLinesBack();
  }

  testSerialization () {

    // Test Serialization
    const json = JSON.stringify(this.state.canvas);

    this.state.canvas.clear();

    var canvas = this.state.canvas;
    alert('123');

    // // and load everything from the same json
    // this.state.canvas.loadFromJSON(json, function() {
    //     console.log("called");
    //     //console.log(objects);
    //     // making sure to render canvas at the end
    //     canvas.renderAll();
    // });

    const setupFabricObjEventHandlers = this.setupFabricObjEventHandlers;
    const onObjectSelected = this.onObjectSelected;
    const updateFabricObjectToState = this.updateFabricObjectToState;
    const objectsDict = this.state.objectsDict;

    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function (o, object) {
      //fabric.log(o, object);
      const edID = object.edID;

      setupFabricObjEventHandlers(object,
        function () {
          updateFabricObjectToState(edID, objectsDict[edID].educativeObjContent);
        },
        function () {
          onObjectSelected(object);
        });

    });
  }


  onCaptionChange (caption) {
    this.state.content.caption = caption
  }

  onComponentHeightChange(event){
    if (this.state.currentFabricComponent) {
      let height = parseFloat(event.target.value);
      let originalHeight = this.state.currentFabricComponent.height * this.state.currentFabricComponent.scaleY;

      if(Math.abs(height - originalHeight) < 0.01 ){
        return
      }

      if (isNaN(height)) {
        height = originalHeight;
      }

      this.state.currentFabricComponent.scaleToHeight(height.toFixed(2));
      this.state.currentFabricComponent.setCoords();
    }

    this.forceUpdate();
  }

  onComponentWidthChange (event) {
    if(this.state.currentFabricComponent){
      let width = parseFloat(event.target.value);
      let originalWidth = this.state.currentFabricComponent.width * this.state.currentFabricComponent.scaleX;
      if(Math.abs(width - originalWidth) < 0.01 ){
        return
      }

      if (isNaN(width)) {
        width = originalWidth;
      }

      this.state.currentFabricComponent.scaleToWidth(width.toFixed(2));
      this.state.currentFabricComponent.setCoords();
    }

    this.forceUpdate();
  }

  onComponentXChange (event) {
    if(this.state.currentFabricComponent){

      let x = parseInt(event.target.value);

      if (isNaN(x)) {
        x = parseInt(this.state.currentFabricComponent.left);
      }

      this.state.currentFabricComponent.setLeft(x);
    }

    this.forceUpdate();
  }

  onComponentYChange (event) {
    if(this.state.currentFabricComponent){

      let y = parseInt(event.target.value);

      if (isNaN(y)) {
        y = parseInt(this.state.currentFabricComponent.top);
      }

      this.state.currentFabricComponent.setTop(y);
      this.state.currentFabricComponent.setCoords();
    }

    this.forceUpdate();
  }

  onComponentAngleChange(event){
    if (this.state.currentFabricComponent) {
      let angle = parseInt(event.target.value);

      if (isNaN(angle)) {
        angle = parseInt(this.state.currentFabricComponent.angle);
      }

      this.state.currentFabricComponent.setAngle(angle);
      this.state.currentFabricComponent.setCoords();
    }

    this.forceUpdate();
  }

  onComponentScaleChange(event){
    if(event.target.value == 'NA'){
      return;
    }

    let scale = parseFloat(event.target.value);

    if (isNaN(scale)) {
      scale = 100;
    }

    scale = (scale / 100).toFixed(2);

    if (this.state.currentFabricComponent) {
      this.state.currentFabricComponent.scale(scale);
    }

    this.forceUpdate();
  }

  centerComponent () {
    if (this.state.currentFabricComponent) {
      this.state.currentFabricComponent.center();
      this.state.currentFabricComponent.setCoords();
    }

    this.forceUpdate();
  }

  centerComponentHorizontal () {
    if (this.state.currentFabricComponent) {
      this.state.currentFabricComponent.centerH();
      this.state.currentFabricComponent.setCoords();
    }

    this.forceUpdate();
  }

  centerComponentVertical () {
    if (this.state.currentFabricComponent) {
      this.state.currentFabricComponent.centerV();
      this.state.currentFabricComponent.setCoords();
    }

    this.forceUpdate();
  }

  setDuplicatedComponentPosition(clonedObj) {
    clonedObj.set("top", clonedObj.top + 20)
             .set("left", clonedObj.left + 20)
             .setCoords();
  }

  duplicateComponent() {
    if(this.state.currentFabricComponent) {
      let canvas = this.state.canvas;

      if (canvas.getActiveObject()) {
        const edObjCopy = EducativeUtil.cloneObject(this.state.currentComponentEdContent);
        let addObjectToFabricCanvasInt = this.addObjectToFabricCanvasInt;
        let setDuplicatedComponentPosition = this.setDuplicatedComponentPosition;

        if (edObjCopy.type === 'CanvasText') {
          // WORKAROUND: There is a bug in fabricjs object.clone method for Text object where
          // Callback is not called. We'll use the cloned object returned by the
          // clone() API as a workaround.

          let clonedObj = canvas.getActiveObject().clone();
          setDuplicatedComponentPosition(clonedObj);

          addObjectToFabricCanvasInt(clonedObj, edObjCopy, false);
        }
        else {
          canvas.getActiveObject().clone(function(clonedObj) {

            setDuplicatedComponentPosition(clonedObj);
            addObjectToFabricCanvasInt(clonedObj, edObjCopy, false);
          });
        }
      }

      this.clearSelected();
    }
  }

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    let canvasCaption = "";
    if (this.props.content.caption) {
      canvasCaption = this.props.content.caption;
    }
    const captionComponent = <CaptionComponent caption={canvasCaption} hookOnChangeEvent={true} onCaptionChange={this.onCaptionChange}
                                             readOnly={false}/>;
    const sideBarMaxHeight = this.state.content.height > 400 ? this.state.content.height : 400;

    const mainMenuProps = {
      currentFabricComponent    : this.state.currentFabricComponent,
      onComponentHeightChange   : this.onComponentHeightChange,
      onComponentWidthChange    : this.onComponentWidthChange,
      onComponentXChange        : this.onComponentXChange,
      onComponentYChange        : this.onComponentYChange,
      onComponentAngleChange    : this.onComponentAngleChange,
      onComponentScaleChange    : this.onComponentScaleChange,
      centerComponent           : this.centerComponent,
      centerComponentHorizontal : this.centerComponentHorizontal,
      centerComponentVertical   : this.centerComponentVertical,
      duplicateComponent        : this.duplicateComponent,
      onWidthChange             : this.onWidthChange,
      onHeightChange            : this.onHeightChange,
      bringToFront              : this.bringToFront,
      sendToBack                : this.sendToBack,
      editToggleComponent       : this.editToggleComponent,
      removeComponent           : this.removeComponent,
      switchGridLines           : this.switchGridLines,
      mode                      : this.props.mode,
      canvasWidth               : this.props.content.width,
      canvasHeight              : this.props.content.height,
    }

    return <div className={styles['canvas-widget']}>
      <CanvasMainMenu {...mainMenuProps}/>
      <div className={styles.main} style={{height:sideBarMaxHeight}}>

        <div className={styles.canvas}>
          {connectDropTarget(
          <div key='canvas-wrapper-edit' className={`${styles['canvas-wrapper']}`}>
            <canvas ref='scene'></canvas>
          </div>)
          }
          <div className="svg-edit-dialog" style={{display:'none'}} ref="dialogContainer">
          </div>
        </div>

        <CanvasWidgetPanel addComponent={this.addComponent}/>

      </div>
      <div style={{paddingTop:25, paddingBottom:5}}>
        {captionComponent}
      </div>
    </div>;
  }
}

class MyModal extends PureComponent {
  constructor(){
    super();
    this.open = this.open.bind(this);
  }
  open(){
    this.refs.modalDg.refs.modal.open();
  }
  render(){
    return <DumbModal ref='modalDg' children={this.props.componentToRender} />;
  }
}