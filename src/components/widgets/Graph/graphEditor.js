import styles from './graphEditor.module.scss';

import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';

import React, { Component, PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
import { ImageUploaderSlim, SomethingWithIcon, Icons } from '../../index';
import { FILE_SIZES_IN_BYTES } from '../../../constants';
import EducativeUtil from '../../common/ed_util';

const jQuery = require('jquery');

const cytoscape = require('cytoscape');
window.cytoscape = cytoscape;

const edgehandles = require('cytoscape-edgehandles');
const noderesize = require('./cytoscape-noderesize');

const CaptionComponent = require('../../CaptionComponent/CaptionComponent');
const ColorPicker = require('../../common/colorpicker');
const Button = require('../../common/Button');
const Icon = require('../../common/Icon');

export default class GraphEditorComponent extends Component {

  static PropTypes = {
    mode  : PropTypes.string.isRequired,
    content : PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.addNode = this.addNode.bind(this);
    this.clearAllElementPropertyControls = this.clearAllElementPropertyControls.bind(this);
    this.duplicateNode = this.duplicateNode.bind(this);
    this.handleAddNode = this.handleAddNode.bind(this);
    this.handlebackgroundImageFitMethodChange = this.handlebackgroundImageFitMethodChange.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleDuplicateNode = this.handleDuplicateNode.bind(this);
    this.handleEdgeShapeChange = this.handleEdgeShapeChange.bind(this);
    this.handleEdgeLineStyleChange = this.handleEdgeLineStyleChange.bind(this);
    this.handleElementBackgroundColorChange = this.handleElementBackgroundColorChange.bind(this);
    this.handleElementFontColorChange = this.handleElementFontColorChange.bind(this);
    this.handleElementPositionXChange = this.handleElementPositionXChange.bind(this);
    this.handleElementPositionYChange = this.handleElementPositionYChange.bind(this);
    this.handleFontSizeChange = this.handleFontSizeChange.bind(this);
    this.handleGraphHeightChange = this.handleGraphHeightChange.bind(this);
    this.handleGraphWidthChange = this.handleGraphWidthChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMultiElementSelection = this.handleMultiElementSelection.bind(this);
    this.handleNodeBorderColorChange = this.handleNodeBorderColorChange.bind(this);
    this.handleNodeBorderWidthChange = this.handleNodeBorderWidthChange.bind(this);
    this.handleNodeHeightChange = this.handleNodeHeightChange.bind(this);
    this.handleNodeShapeChange = this.handleNodeShapeChange.bind(this);
    this.handleNodeWidthChange = this.handleNodeWidthChange.bind(this);
    this.handleRemoveElement = this.handleRemoveElement.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
    this.handleSingleElementSelection = this.handleSingleElementSelection.bind(this);
    this.handleTextHorizontalAlignmentChange = this.handleTextHorizontalAlignmentChange.bind(this);
    this.handleTextVerticalAlignmentChange = this.handleTextVerticalAlignmentChange.bind(this);
    this.handleUnselectOfAllElements = this.handleUnselectOfAllElements.bind(this);
    this.handleUpdateElementText = this.handleUpdateElementText.bind(this);
    this.initializeCytoscape = this.initializeCytoscape.bind(this);
    this.initializeCytoscapeEdgeHandles = this.initializeCytoscapeEdgeHandles.bind(this);
    this.initializeCytoscapeNodeResize = this.initializeCytoscapeNodeResize.bind(this);
    this.nodeResizeStart = this.nodeResizeStart.bind(this);
    this.nodeResizeStopped = this.nodeResizeStopped.bind(this);
    this.onGraphElementSelectUnselect = this.onGraphElementSelectUnselect.bind(this);
    this.onGraphNodeDrag = this.onGraphNodeDrag.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.updateLabels = this.updateLabels.bind(this);

    this.state = {
      cy : null,
      num_selected_elements: 0,
      selected_font_color: null,
      selected_element_color: null,
      node_shape: "invalid",
      edge_shape: "invalid",
      edge_lineStyle: "invalid",
      font_size: "invalid",
      node_border_width: "invalid",
      node_border_color: null,
      background_image_fit_method: "invalid",
      text_h_align: "invalid",
      text_v_align: "invalid",
    };
  }

  handleSingleElementSelection(element) {
    findDOMNode(this.elementTextInputRef).value = element.data().label;

    let newState = {};

    if (element.isNode()) {
      let nodePosition = element.position();
      findDOMNode(this.elementPositionXRef).value = nodePosition.x;
      findDOMNode(this.elementPositionYRef).value = nodePosition.y;

      findDOMNode(this.nodeWidthRef).value = element.width();
      findDOMNode(this.nodeHeightRef).value = element.height();

      newState.node_shape = element.data().shape;
      newState.node_border_width = element.data().borderWidth;
      newState.node_border_color = element.data().borderColor;
      newState.text_h_align = element.data().textHAlign;
      newState.text_v_align = element.data().textVAlign;

      if (element.data().backgroundImageFitMethod) {
        newState.background_image_fit_method = element.data().backgroundImageFitMethod;
      } else {
        newState.background_image_fit_method = "invalid";
      }

    } else if (element.isEdge()) {
      newState.edge_shape = this.getEdgeShapeIdentifier(element);
      newState.edge_lineStyle = this.getEdgeLineStyleIdentifier(element);
    }

    newState.num_selected_elements = 1;
    newState.selected_font_color = element.data().fontColor;
    newState.selected_element_color = element.data().backgroundColor;
    newState.font_size = element.data().fontSize;

    this.setState (newState);
  }

  clearAllElementPropertyControls() {
    findDOMNode(this.elementTextInputRef).value = "";

    findDOMNode(this.elementPositionXRef).value = "";
    findDOMNode(this.elementPositionYRef).value = "";

    findDOMNode(this.nodeWidthRef).value = "";
    findDOMNode(this.nodeHeightRef).value = "";
  }

  handleMultiElementSelection(num_selected_elements) {
      this.clearAllElementPropertyControls();

      this.setState({
        num_selected_elements,
        selected_font_color: null,
        selected_element_color: null,
        node_shape: "invalid",
        edge_shape: "invalid",
        edge_lineStyle: "invalid",
        font_size: "invalid",
        text_h_align: "invalid",
        text_v_align: "invalid",
        node_border_width: "invalid",
        node_border_color: null,
        background_image_fit_method: "invalid",
      });
  }

  handleUnselectOfAllElements() {
    this.clearAllElementPropertyControls()

    this.setState({
      num_selected_elements: 0,
      selected_font_color: null,
      selected_element_color: null,
      node_border_width: "invalid",
      node_border_color: null,
      background_image_fit_method: "invalid",
      node_shape: "invalid",
      edge_shape: "invalid",
      edge_lineStyle: "invalid",
      font_size: "invalid",
      text_h_align: "invalid",
      text_v_align: "invalid",
    });
  }

  onGraphElementSelectUnselect(e) {
    let selected_elements = this.state.cy.elements(":selected");

    if (selected_elements.length === 0) {
      this.handleUnselectOfAllElements();
    } else if (selected_elements.length === 1) {
      this.handleSingleElementSelection(selected_elements[0]);
    }
    else {
      this.handleMultiElementSelection(selected_elements.length);
    }
  }

  getEdgeShapeIdentifier(edge) {
    let sourceArrowShape = edge.data().sourceArrowShape;
    let targetArrowShape = edge.data().targetArrowShape;

    if (sourceArrowShape === "none" && targetArrowShape === "triangle") {
      return "sourceNoneTargetArrow";
    } else if (sourceArrowShape === "none" && targetArrowShape === "none") {
      return "sourceNoneTargetNone";
    } else if (sourceArrowShape === "triangle" && targetArrowShape === "none") {
      return "sourceArrowTargetNone";
    } else if (sourceArrowShape === "triangle" && targetArrowShape === "triangle") {
      return "sourceArrowTargetArrow";
    }

    return "invalid";
  }

  getEdgeLineStyleIdentifier(edge) {
    let lineStyle = edge.data().lineStyle;

    if (lineStyle === undefined) {
      return 'solid';
    }

    if (lineStyle === 'solid' ||
        lineStyle === 'dotted' ||
        lineStyle === 'dashed') {
      return lineStyle;
    }

    return 'invalid';
  }

  getEdgeShapesFromIdentifier(identifier) {
    if (identifier === "sourceNoneTargetArrow") {
      return {sourceArrowShape: "none", targetArrowShape: "triangle"};
    } else if (identifier === "sourceNoneTargetNone") {
      return {sourceArrowShape: "none", targetArrowShape: "none"};
    } else if (identifier === "sourceArrowTargetNone") {
      return {sourceArrowShape: "triangle", targetArrowShape: "none"};
    } else if (identifier === "sourceArrowTargetArrow") {
      return {sourceArrowShape: "triangle", targetArrowShape: "triangle"};
    }
  }

  onGraphNodeDrag(e) {
    if (this.state.num_selected_elements === 1) {
      let position = e.cyTarget.position();
      findDOMNode(this.elementPositionXRef).value = position.x;
      findDOMNode(this.elementPositionYRef).value = position.y;
    }
  }

  initializeCytoscape() {
    if (this.state.cy == null) {
      let domNode = this.cytoscape_areaRef;
      cytoscape.registerJquery(jQuery);
      this.state.cy = cytoscape({
        container: domNode,
        style: cytoscape.stylesheet()
          .selector('node')
            .css({
          label: ('data(label)'),
          'text-halign': 'data(textHAlign)',
          'text-valign': 'data(textVAlign)',
          'font-size': 'data(fontSize)',
          width: 'data(width)',
          height: 'data(height)',
          shape: 'data(shape)',
          color: 'data(fontColor)',
          'background-color': 'data(backgroundColor)',
          'background-opacity': 'data(backgroundOpacity)',
          'border-width': 'data(borderWidth)',
          'border-color': 'data(borderColor)',
          'border-opacity': 'data(borderOpacity)',
          'padding-left': 5,
          'padding-right': 5,
          'padding-top': 5,
          'padding-bottom': 5,
          'text-wrap': 'wrap',
          'background-fit': 'contain',
        })
          .selector('node:selected')
            .css({
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.0s',
          'overlay-opacity': 0.3,
          'overlay-padding': 3,
          'overlay-color': '#337ab7',
        })
          .selector('edge')
            .css({
          label: 'data(label)',
          'source-arrow-shape': 'data(sourceArrowShape)',
          'target-arrow-shape': 'data(targetArrowShape)',
          width: 2,
          'line-color': 'data(backgroundColor)',
          'line-style': 'data(lineStyle)',
          'source-arrow-color': 'data(backgroundColor)',
          'target-arrow-color': 'data(backgroundColor)',
          'curve-style': 'bezier',
          color: 'data(fontColor)',
          'text-background-color': "#ffffff",
          'text-background-opacity': 1,
          'font-size': 'data(fontSize)',
          'text-wrap': 'wrap',
        })
          .selector('edge:selected')
            .css({
          width: 3,

          // 'line-color': '#337ab7',
          // 'target-arrow-color': '#337ab7',
          // 'source-arrow-color': '#337ab7',
          'transition-property': 'background-color, line-color, target-arrow-color',

          'transition-duration': '0.0s',
          'overlay-opacity': 0.3,
          'overlay-padding': 4,
          'overlay-color': '#337ab7',
        }),
        zoomingEnabled: false,
        panningEnabled: false,
      });

      this.state.cy.on('select', 'node', this.onGraphElementSelectUnselect);
      this.state.cy.on('drag', 'node', this.onGraphNodeDrag);
      this.state.cy.on('select', 'edge', this.onGraphElementSelectUnselect);

      this.state.cy.on('unselect', 'node', this.onGraphElementSelectUnselect);
      this.state.cy.on('unselect', 'edge', this.onGraphElementSelectUnselect);
    }

    if (this.props.content.graph_json) {
      this.state.cy.json(this.props.content.graph_json);

      let nodes = this.state.cy.nodes();

      if (nodes != null) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];

          if (node.data().backgroundImage) {
            node.css({
              'background-image': node.data().backgroundImage,
              'background-fit': node.data().backgroundImageFitMethod,
            })
          }
        }
      }

      // upgrade edges that don't have a line style.
      let edges = this.state.cy.edges();
      if (edges != null) {
        for (let i = 0; i < edges.length; i++) {
          let edge = edges[i];
          const lineStyle = edge.data().lineStyle || 'solid';

          edge.data('lineStyle', lineStyle);
          edge.css({
            'line-style': lineStyle
          });
        }
      }
    }
  }

  initializeCytoscapeEdgeHandles() {
    const params = {
      // whether to show added edges preview before releasing selection
      preview: true,

      // Controls stack order of edgehandles canvas element by setting it's z-index
      stackOrder: 4,

      // the size of the edge handle put on nodes
      handleSize: 10,

      // the colour of the handle and the line drawn from it
      handleColor: '#337ab7',

      // can be 'ghost' for real edge, 'straight' for a straight line, or 'draw' for a draw-as-you-go line
      handleLineType: 'straight',

      // width of handle line in pixels
      handleLineWidth: 2,

      // selector/filter function for whether edges can be made from a given node
      handleNodes: 'node',

      // time spend over a target node before it is considered a target selection
      hoverDelay: 150,

      // whether cxt events trigger edgehandles (useful on touch)
      cxt: false,

      // whether to start the plugin in the enabled state
      enabled: true,

      // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
      toggleOffOnLeave: true,

      edgeType(sourceNode, targetNode) {
        // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
        // returning null/undefined means an edge can't be added between the two nodes
        return 'flat';
      },

      loopAllowed(node) {
        // for the specified node, return whether edges from itself to itself are allowed
        return true;
      },

      // offset for edgeType: 'node' loops
      nodeLoopOffset: -50,

      nodeParams(sourceNode, targetNode) {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for intermediary node
        return {};
      },

      edgeParams(sourceNode, targetNode, i) {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        // NB: i indicates edge index in case of edgeType: 'node'
        return {
          data: {
            label: "",
            backgroundColor: "#000000",
            sourceArrowShape:"none",
            targetArrowShape: "triangle",
            lineStyle: "solid",
            fontColor: '#000000',
            fontSize: 20,
          },
        };
      },

      start(sourceNode) {
        // fired when edgehandles interaction starts (drag on handle)
      },

      complete(sourceNode, targetNodes, addedEntities) {
        // fired when edgehandles is done and entities are added
      },

      stop(sourceNode) {
        // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
      },
    };

    this.state.cy.edgehandles(params);
  }

  initializeCytoscapeNodeResize() {
    const that = this;

    this.state.cy.noderesize({
      // the colour of the handle and the line drawn from it
      handleColor: '#337ab7',

      // time spend over a target node before it is considered a target selection
      hoverDelay: 0,

      // whether to start the plugin in the enabled state
      enabled: true,

      minNodeWidth: 1,
      minNodeHeight: 1,
      triangleSize: 15,
      lines: 5,
      padding: 5,

      start(sourceNode) {
        // fired when noderesize interaction starts (drag on handle)
        that.nodeResizeStart(sourceNode);
      },

      complete(sourceNode, targetNodes, addedEntities) {
        // fired when noderesize is done and entities are added
      },

      stop(sourceNode) {
        // fired when noderesize interaction is stopped (either complete with added edges or incomplete)
        that.nodeResizeStopped(sourceNode);
      },
    });
  }

  componentDidMount() {
    findDOMNode(this.graphWidthInputRef).value = this.props.content.graph_width;
    findDOMNode(this.graphHeightInputRef).value = this.props.content.graph_height;

    edgehandles(cytoscape, jQuery); // register extension
    noderesize(cytoscape, jQuery); // register extension

    this.initializeCytoscape();
    this.initializeCytoscapeEdgeHandles();
    this.initializeCytoscapeNodeResize();
  }

  componentDidUpdate() {
    findDOMNode(this.graphWidthInputRef).value = this.props.content.graph_width;
    findDOMNode(this.graphHeightInputRef).value = this.props.content.graph_height;

    // NOTE: If you ever find this component to be slow, calling this more
    // selectively *might* be the way to optimize.
    this.state.cy.resize();
    this.state.cy.edgehandles('resize');
    this.state.cy.noderesize('resize');
  }

  saveComponent() {
    if (this.state.cy) {

      let graph_json = null;
      let image_data = null;

      if (this.state.cy.nodes().length > 0) {
        graph_json = this.state.cy.json();
        image_data = this.state.cy.png({
          maxWidth: this.props.content.graph_width,
          maxHeight: this.props.content.graph_height
        });
      }

      this.props.updateContentState({
        graph_json,
        image_data,
      });
    }
  }

  nodeResizeStart(node) {
    // Do nothing here for now
  }

  nodeResizeStopped(node) {
    // We only update the size of the node if the node
    // that is being selected is changed.
    // NodeResize works even if the node being resized is not selected
    // SKIP update to the size fields if any of the following is TRUE.
    // 1. No node is selected
    // 2. A node other than the node being resized is selected
    // 3. Multiple nodes are selected

    let nodes = this.state.cy.nodes(":selected");

    // Ensure that only 1 node is selected
    if (nodes != null && nodes.length === 1) {
      let selected_node = nodes[0];

      // Ensure that the node being resized and node selected are the same
      if (selected_node.data("id") === node.data("id")) {
        findDOMNode(this.nodeWidthRef).value = node.width();
        findDOMNode(this.nodeHeightRef).value = node.height();
      }
    }
  }

  handleCaptionChange(caption) {
    this.props.updateContentState({
      caption,
    });
  }

  handleGraphWidthChange(e) {
    if (!e.target.value) {
      return;
    }

    let width = parseInt(e.target.value);

    if (width <= 64 || width > 1024) {
      return;
    }

    this.props.updateContentState({
      graph_width: width,
    });
  }

  handleGraphHeightChange(e) {
    if (!e.target.value) {
      return;
    }

    let height = parseInt(e.target.value);

    if (height <= 64 || height > 1024) {
      return;
    }

    this.props.updateContentState({
      graph_height: height,
    });
  }

  addNode(value) {
    let node_id = this.props.content.current_id;

    this.state.cy.add({
      group: "nodes",

      data: {
        id: node_id,
        label: "",
        type: 'node',
        shape: 'ellipse',
        fontColor: '#000000',
        backgroundColor: "#bfefff",
        fontSize: 24,
        backgroundOpacity: 1,
        borderWidth: 1.5,
        borderColor: '#000000',
        borderOpacity: 1,
        width: 40,
        height: 40,
        textHAlign: 'center',
        textVAlign: 'center',
      },

      position: {
        x: Math.floor(Math.random() * (this.state.cy.width()/2 - 1 + 1)) + 40,
        y: Math.floor(Math.random() * (this.state.cy.height()/2 - 1 + 1)) + 40,
      },
    });

    if (value) {
      this.updateLabels(this.state.cy.nodes(`#${node_id}`), null, value);
    }

    this.props.updateContentState({
      current_id: node_id + 1,
    });
  }

  duplicateNode(originalNode, current_id) {
    let new_data = EducativeUtil.cloneObject(originalNode.data());
    new_data.id = current_id;

    let cy_node = this.state.cy.add({
      group: "nodes",
      data: new_data,

      position: {
        x: originalNode.position().x + 10,
        y: originalNode.position().y + 10,
      },
    });

    if (cy_node.data().backgroundImage) {
      cy_node.css({
        'background-image': cy_node.data().backgroundImage,
        'background-fit': cy_node.data().backgroundImageFitMethod,
      })
    }
  }

  handleDuplicateNode(e) {
    let nodes = this.state.cy.nodes(":selected");

    if (nodes != null) {
      let current_id = this.props.content.current_id;

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        this.duplicateNode(node, current_id);
        current_id++;
      }

      this.props.updateContentState({
        current_id,
      });
    }
  }

  handleAddNode(e) {
    this.addNode(findDOMNode(this.elementTextInputRef).value);
  }

  handleUpdateElementText(e) {
    if (this.state.num_selected_elements > 0) {
      let value = findDOMNode(this.elementTextInputRef).value;
      let nodes = this.state.cy.nodes(":selected");
      let edges = this.state.cy.edges(":selected");
      this.updateLabels(nodes, edges, value);
    }
  }

  updateLabels(nodes, edges, value) {
    let batchData = { };
    if (nodes != null) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let id = node.data("id");

        node.data({
          label: value,
        });
      }
    }

    if (edges != null) {
      for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let id = edge.data("id");

        batchData[id] = {
          label: value,
        }
      }
    }

    this.state.cy.batchData(batchData);
  }

  handleKeyUp(e) {
    if (e.key != 'Enter') {
      return;
    }

    if(e.target.name === 'elementText') {
      if (this.state.num_selected_elements > 0) {
        this.handleUpdateElementText(e);
      } else {
        this.handleAddNode(e);
      }
    } else if (e.target.name === 'elementX') {
      this.handleElementPositionXChange(e);
    } else if (e.target.name === 'elementY') {
      this.handleElementPositionYChange(e);
    } else if (e.target.name === 'nodeWidth') {
      this.handleNodeWidthChange(e);
    } else if (e.target.name === 'nodeHeight') {
      this.handleNodeHeightChange(e);
    } else if (e.target.name === 'graphWidth') {
      this.handleGraphWidthChange(e);
    } else if (e.target.name === 'graphHeight') {
      this.handleGraphHeightChange(e);
    }
  }

  handleElementFontColorChange(colorValue) {
    if (this.state.num_selected_elements > 0) {
      let batchData = { };

      let elements = this.state.cy.elements(":selected");
      if (elements != null) {
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i];
          let id = element.data("id");

          batchData[id] = {
            fontColor: colorValue,
          }
        }
      }

      this.state.cy.batchData(batchData);

      this.setState({
        selected_font_color: colorValue,
      });
    }
  }

  handleTextHorizontalAlignmentChange(e) {
    if (this.state.num_selected_elements > 0) {
      let batchData = { };

      let nodes = this.state.cy.nodes(":selected");
      if (nodes != null) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let id = node.data("id");

          batchData[id] = {
            textHAlign: e.target.value,
          }
        }
      }

      this.state.cy.batchData(batchData);

      this.setState({
        text_h_align: e.target.value,
      });
    }
  }

  handleTextVerticalAlignmentChange(e) {
    if (this.state.num_selected_elements > 0) {
      let batchData = { };

      let nodes = this.state.cy.nodes(":selected");
      if (nodes != null) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let id = node.data("id");

          batchData[id] = {
            textVAlign: e.target.value,
          }
        }
      }

      this.state.cy.batchData(batchData);

      this.setState({
        text_v_align: e.target.value,
      });
    }
  }


  handleElementBackgroundColorChange(colorValue) {
    let backgroundOpacity = 1;
    let originalColorValue = colorValue;

    if (colorValue === null) {
      colorValue = '#ffffff';
      backgroundOpacity = 0;
    }

    if (this.state.num_selected_elements > 0) {
      let batchData = { };

      let elements = this.state.cy.elements(":selected");
      if (elements != null) {
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i];
          let id = element.data("id");

          batchData[id] = {
            backgroundColor: colorValue,
            backgroundOpacity,
          }
        }
      }

      this.state.cy.batchData(batchData);

      this.setState({
        selected_element_color: originalColorValue,
      });
    }
  }

  handleFontSizeChange(e) {
    if (this.state.num_selected_elements > 0) {
      let batchData = { };

      let elements = this.state.cy.elements(":selected");
      if (elements != null) {
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i];
          let id = element.data("id");

          batchData[id] = {
            fontSize: e.target.value,
          }
        }
      }

      this.state.cy.batchData(batchData);

      this.setState({
        font_size: e.target.value,
      });
    }
  }

  handleNodeBorderWidthChange(e) {
    let nodes = this.state.cy.nodes(":selected");

    if (nodes != null) {
      let batchData = { };

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let id = node.data("id");

        batchData[id] = {
          borderWidth: e.target.value,
        };
      }

      this.state.cy.batchData(batchData);

      this.setState({
        node_border_width: e.target.value,
      });
    }
  }

  handleNodeBorderColorChange(colorValue) {
    let borderOpacity = 1;
    let originalColorValue = colorValue;

    if (colorValue === null) {
      colorValue = '#ffffff';
      borderOpacity = 0;
    }

    let nodes = this.state.cy.nodes(":selected");

    if (nodes != null) {
      let batchData = { };

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let id = node.data("id");

        batchData[id] = {
          borderColor: colorValue,
          borderOpacity,
        };
      }

      this.state.cy.batchData(batchData);

      this.setState({
        node_border_color: originalColorValue,
      });
    }
  }

  handleElementPositionXChange(e) {
    if (!e.target.value) {
      return;
    }

    if (this.state.num_selected_elements > 0) {
      let nodes = this.state.cy.nodes(":selected");

      if (nodes != null) {
        for (let i = 0; i < nodes.length; i++) {
          let element = nodes[i];
          element.position('x', parseInt(e.target.value));
        }
      }
    }
  }

  handleElementPositionYChange(e) {
    if (!e.target.value) {
      return;
    }

    if (this.state.num_selected_elements > 0) {
      let nodes = this.state.cy.nodes(":selected");

      if (nodes != null) {
        for (let i = 0; i < nodes.length; i++) {
          let element = nodes[i];
          element.position('y', parseInt(e.target.value));
        }
      }
    }
  }

  handleNodeWidthChange(e) {
    if (!e.target.value) {
      return;
    }

    let new_width = parseInt(e.target.value);

    if (new_width <= 0) {
      // This will put the correct value back into the width text box
      // if only a single node is selected
      this.onGraphElementSelectUnselect();
      return;
    }

    if (this.state.num_selected_elements > 0) {
      let nodes = this.state.cy.nodes(":selected");

      if (nodes != null) {
        let batchData = { };

        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let id = node.data("id");

          batchData[id] = {
            width: new_width,
          }
        }

        this.state.cy.batchData(batchData);
      }
    }
  }

  updateImage(image) {

    if(!image) {
      return;
    }

    //If image is greater than 1MB then we wont allow it
    if(image.metadata.sizeInBytes > FILE_SIZES_IN_BYTES.ONE_MB) {
      alert('The maximum size supported for image is 1 MB. Please reduce the size of image');
      return;
    }


    let nodes = this.state.cy.nodes(":selected");

    if (nodes != null) {
      let batchData = { };

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let id = node.data("id");

        node.css({
          'background-image': image.thumbnail,
          'background-fit': 'contain',
        })

        batchData[id] = {
          backgroundImage: image.thumbnail,
          backgroundImageFitMethod: 'contain',
        };
      }

      this.state.cy.batchData(batchData);
    }
  }

  handlebackgroundImageFitMethodChange(e) {
    let nodes = this.state.cy.nodes(":selected");

    if (nodes != null) {
      let batchData = { };

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let id = node.data("id");

        node.css({
          'background-fit': e.target.value,
        })

        batchData[id] = {
          backgroundImageFitMethod: e.target.value,
        };
      }

      this.state.cy.batchData(batchData);

      this.setState({
        background_image_fit_method: e.target.value,
      });
    }
  }

  handleRemoveImage(e) {
    let nodes = this.state.cy.nodes(":selected");

    if (nodes != null) {
      let batchData = { };

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let id = node.data("id");

        node.css({
          'background-image': "",
          'background-fit': "",
        });

        node.data({
          backgroundImage: null,
          backgroundImageFitMethod: null,
        });
      }

      this.state.cy.batchData(batchData);

      this.setState({
        background_image_fit_method: "invalid",
      });
    }
  }

  handleNodeHeightChange(e) {
    if (!e.target.value) {
      return;
    }

    let new_height = parseInt(e.target.value);

    if (new_height <= 0) {
      // This will put the correct value back into the height text box
      // if only a single node is selected
      this.onGraphElementSelectUnselect();
      return;
    }

    if (this.state.num_selected_elements > 0) {
      let nodes = this.state.cy.nodes(":selected");

      if (nodes != null) {
        let batchData = { };

        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let id = node.data("id");

          batchData[id] = {
            height: new_height,
          }
        }

        this.state.cy.batchData(batchData);
      }
    }
  }

  handleNodeShapeChange(e) {

    if (this.state.num_selected_elements > 0) {

      let nodes = this.state.cy.nodes(":selected");

      if (nodes != null) {
        let batchData = { };

        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let id = node.data("id");

          batchData[id] = {
            shape: e.target.value,
          }
        }

        this.state.cy.batchData(batchData);

        this.setState({
          node_shape: e.target.value,
        });
      }
    }
  }

  handleEdgeShapeChange(e) {
    let edges = this.state.cy.edges(":selected");
    if (edges != null && edges.length > 0) {
      let shape = this.getEdgeShapesFromIdentifier(e.target.value);
      let batchData = { };

      for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let id = edge.data("id");

        batchData[id] = {
          sourceArrowShape: shape.sourceArrowShape,
          targetArrowShape: shape.targetArrowShape,
        }
      }

      this.state.cy.batchData(batchData);

      this.setState({
        edge_shape: e.target.value,
      });
    }
  }

  handleEdgeLineStyleChange(e) {
    let edges = this.state.cy.edges(":selected");
    if (edges != null && edges.length > 0) {
      let lineStyle = e.target.value;
      let batchData = { };

      for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let id = edge.data("id");

        edge.css({
          'line-style': lineStyle
        });

        batchData[id] = {
          lineStyle: lineStyle,
        }
      }

      this.state.cy.batchData(batchData);

      this.setState({
        edge_lineStyle: lineStyle,
      });
    }
  }

  handleRemoveElement(e) {
    this.state.cy.elements(":selected").remove();
    this.handleUnselectOfAllElements();
  }

  createTooltipObject(tooltip_string) {
    return <Tooltip id={tooltip_string}>{ tooltip_string }</Tooltip>;
  }

  render(){
    const {mode, content} = this.props;

    let captionComponent = null;

    if (this.props.config == null || this.props.config.disableCaption == null || this.props.config.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.props.content.caption}
        readOnly={false}
        onCaptionChange={this.handleCaptionChange}/>;
    }

    const addButton = <OverlayTrigger placement='top' overlay={this.createTooltipObject("Add")}>
                      <Button className={styles['add-edit-button']} sm outlined bsStyle='darkgreen45'
                                    onClick={this.handleAddNode}>
                            <SomethingWithIcon icon={Icons.thinPlus1}/>
                              Add Node
                      </Button>
                    </OverlayTrigger>;

    const editButton = <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) and edge(s) text")}>
                        <Button className={styles['add-edit-button']}  sm outlined bsStyle='darkgreen45'
                                      onClick={this.handleUpdateElementText}>
                            <SomethingWithIcon icon={Icons.thickPencilIcon}/>
                                Edit
                        </Button>
                      </OverlayTrigger>;

    const addOrEditButton = (this.state.num_selected_elements > 0) ? editButton : addButton;

    let children = <div>
                  <div className={`${styles.menu} edcomp-toolbar`}>
                    <div className={styles.row}>
                      <div className={styles['row-title']}>Graph</div>
                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set graph width")}>
                          <label className={`${styles.label} form-label`}>Width
                            <FormControl name="graphWidth" ref={node => this.graphWidthInputRef = node} onBlur={this.handleGraphWidthChange}
                              onKeyUp={this.handleKeyUp} />
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set graph height")}>
                          <label className={`${styles.label} form-label`}>Height
                            <FormControl name="graphHeight" ref={node => this.graphHeightInputRef = node} onBlur={this.handleGraphHeightChange}
                              onKeyUp={this.handleKeyUp} />
                          </label>
                        </OverlayTrigger>
                    </div>
                    <div className={styles.row}>
                      <div className={styles['row-title']}>Element</div>
                        <span style={{lineHeight: '42px'}}>
                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) and edge(s) label")}>
                          <FormControl componentClass='textarea' style={{marginLeft:8 , marginRight:8, width:'200px', display:'inline'}} ref={node => this.elementTextInputRef = node}
                            name='elementText' onKeyUp={this.handleKeyUp}/>
                        </OverlayTrigger>

                        {addOrEditButton}

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set Node's Text Horizontal alignment")}>
                          <label className={`${styles.label} form-label`}>h-align:
                            <FormControl componentClass='select' style={{marginLeft: 5}}
                              value={this.state.text_h_align} onChange={this.handleTextHorizontalAlignmentChange}>
                                <option value="invalid" disabled></option>
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </FormControl>
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set Node's Text Vertical alignment")}>
                          <label className={`${styles.label} form-label`}>v-align:
                            <FormControl componentClass='select' style={{marginLeft: 5}}
                              value={this.state.text_v_align} onChange={this.handleTextVerticalAlignmentChange}>
                                <option value="invalid" disabled></option>
                                <option value="top">Top</option>
                                <option value="center">Center</option>
                                <option value="bottom">Bottom</option>
                            </FormControl>
                          </label>
                        </OverlayTrigger>




                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) and edge(s) font color")}>
                          <ColorPicker className={`${styles.colorpicker}`}
                            onChange={this.handleElementFontColorChange} value={this.state.selected_font_color} >
                            Font
                          </ColorPicker>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) and edge(s) background color")}>
                          <ColorPicker className={`${styles.colorpicker}`}
                            onChange={this.handleElementBackgroundColorChange} value={this.state.selected_element_color} >
                            Background
                          </ColorPicker>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Select node shape")}>
                          <label className={`${styles.label} form-label`}>Node Shape:
                            <FormControl componentClass='select' style={{marginLeft: 5}}
                              value={this.state.node_shape} onChange={this.handleNodeShapeChange}>
                                <option value="invalid" disabled></option>
                                <option value="ellipse">Ellipse</option>
                                <option value="rectangle">Rectangle</option>
                                <option value="roundrectangle">Rounded Rectangle</option>
                                <option value="triangle">Triangle</option>
                                <option value="pentagon">Pentagon</option>
                                <option value="hexagon">Hexagon</option>
                                <option value="heptagon">Heptagon</option>
                                <option value="octagon">Octagon</option>
                                <option value="star">Star</option>
                                <option value="diamond">Diamond</option>
                                <option value="vee">Vee</option>
                                <option value="rhomboid">Rhomboid</option>
                            </FormControl>
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set Node's Border Width")}>
                          <label className={`${styles.label} form-label`}>Border Width:
                            <FormControl componentClass='select' style={{marginLeft: 5}}
                              value={this.state.node_border_width} onChange={this.handleNodeBorderWidthChange}>
                                <option value="invalid" disabled></option>
                                <option value="0">0</option>
                                <option value="0.5">0.5</option>
                                <option value="1.0">1.0</option>
                                <option value="1.5">1.5</option>
                                <option value="2.0">2.0</option>
                                <option value="2.5">2.5</option>
                                <option value="3.0">3.0</option>
                                <option value="3.5">3.5</option>
                                <option value="4.0">4.0</option>
                                <option value="4.5">4.5</option>
                                <option value="5.0">5.0</option>
                                <option value="5.5">5.5</option>
                                <option value="6.0">6.0</option>
                                <option value="6.5">6.5</option>
                                <option value="7.0">7.0</option>
                                <option value="7.5">7.5</option>
                                <option value="8.0">8.0</option>
                            </FormControl>
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) border color")}>
                          <ColorPicker className={`${styles.colorpicker}`}
                            onChange={this.handleNodeBorderColorChange} value={this.state.node_border_color} >
                            Border Color
                          </ColorPicker>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) width")}>
                          <label className={`${styles.label} form-label`}>W
                            <FormControl name='nodeWidth' ref={node => this.nodeWidthRef = node} onKeyUp={this.handleKeyUp}
                              onBlur = {this.handleNodeWidthChange} />
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) height")}>
                          <label className={`${styles.label} form-label`}>H
                            <FormControl name='nodeHeight' ref={node => this.nodeHeightRef = node} onKeyUp={this.handleKeyUp}
                            onBlur = {this.handleNodeHeightChange} />
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) X coordinate")}>
                          <label className={`${styles.label} form-label`}>X
                            <FormControl name='elementX' ref={node => this.elementPositionXRef = node} onKeyUp={this.handleKeyUp}
                              onBlur = {this.handleElementPositionXChange} />
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set node(s) Y coordinate")}>
                          <label className={`${styles.label} form-label`}>Y
                            <FormControl name='elementY' ref={node => this.elementPositionYRef = node} onKeyUp={this.handleKeyUp}
                            onBlur = {this.handleElementPositionYChange} />
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Change font size")}>
                          <label className={`${styles.label} form-label`}>Font Size:
                            <FormControl componentClass='select' style={{marginLeft: 5}}
                              value={this.state.font_size} onChange={this.handleFontSizeChange}>
                                <option value="invalid" disabled></option>
                                <option value="8">8</option>
                                <option value="10">10</option>
                                <option value="12">12</option>
                                <option value="14">14</option>
                                <option value="16">16</option>
                                <option value="18">18</option>
                                <option value="20">20</option>
                                <option value="22">22</option>
                                <option value="24">24</option>
                                <option value="26">26</option>
                                <option value="28">28</option>
                                <option value="30">30</option>
                                <option value="32">32</option>
                                <option value="34">34</option>
                                <option value="36">36</option>
                                <option value="48">48</option>
                                <option value="72">48</option>
                            </FormControl>
                          </label>
                        </OverlayTrigger>

                        <ImageUploaderSlim saveChanges={this.updateImage}/>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Remove Image from the node")}>
                          <Button className='fg-darkgray75 delete-button' ref="removeImageButton" onClick={this.handleRemoveImage}>
                            <Icon glyph='fa fa-close' style={{fontSize:22}}/>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("How to fit image in node")}>
                          <label className={`${styles.label} form-label`}>Image Fit:
                            <FormControl componentClass='select' style={{marginLeft: 5}}
                              value={this.state.background_image_fit_method} onChange={this.handlebackgroundImageFitMethodChange}>
                                <option value="invalid" disabled></option>
                                <option value="none">Original</option>
                                <option value="contain">Contain</option>
                                <option value="cover">Cover</option>
                            </FormControl>
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Select edge shape")}>
                          <label className={`${styles.label} form-label`}>Edge Shape:
                            <FormControl componentClass='select' style={{marginLeft: 5}}
                              value={this.state.edge_shape} onChange={this.handleEdgeShapeChange}>
                                <option value="invalid" disabled></option>
                                <option value="sourceNoneTargetArrow">src None, target Arrow</option>
                                <option value="sourceArrowTargetNone">src Arrow, target None</option>
                                <option value="sourceArrowTargetArrow">src Arrow, target Arrow</option>
                                <option value="sourceNoneTargetNone">src None, target None</option>
                            </FormControl>
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Select edge style")}>
                          <label className={`${styles.label} form-label`}>Edge Style:
                            <FormControl componentClass='select' style={{marginLeft: 5}}
                              value={this.state.edge_lineStyle} onChange={this.handleEdgeLineStyleChange}>
                                <option value="invalid" disabled></option>
                                <option value="solid">solid</option>
                                <option value="dotted">dotted</option>
                                <option value="dashed">dashed</option>
                            </FormControl>
                          </label>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Duplicate selected node(s)")}>
                          <Button className='fg-darkgray75 delete-button' onClick={this.handleDuplicateNode}>
                            <Icon glyph='fa fa-clone' style={{fontSize:22}}/>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Delete selected node(s) and edge(s)")}>
                          <Button className='fg-darkgray75 delete-button' onClick={this.handleRemoveElement}>
                            <Icon glyph='fa fa-trash' style={{fontSize:22}}/>
                          </Button>
                        </OverlayTrigger>
                        </span>
                      </div>
                    </div>
                  <div>
                    <div className={styles.cytoscape_area} style={{width: `${this.props.content.graph_width}px`, height: `${this.props.content.graph_height}px`}} ref={node => this.cytoscape_areaRef = node}></div>
                  </div>
                </div>;

    return <div>
            {children}
            {captionComponent}
           </div>;
  }
}
