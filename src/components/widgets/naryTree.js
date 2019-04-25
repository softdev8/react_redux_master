import React from 'react'
import {findDOMNode} from 'react-dom';
import * as widgetUtil from '../helpers/widgetUtil';
import {SomethingWithIcon, Icons} from '../index';

const ColorPicker = require('../common/colorpicker');
const CaptionComponent = require('../CaptionComponent/CaptionComponent');
const Button = require('../common/Button');
const EducativeUtil = require('../common/ed_util');
const Vivus = require('vivus');

import {FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';

let selectedTree = null;

function SelectedNodeObject(parent, node, nodeIndex) {
  this.parent = parent;
  this.object = node;
  this.index = nodeIndex;
}

class NaryTreeD3 extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      prevSelectedNodeId: -1,
    };
  }

  componentDidMount() {
    this.createTree();
    this.setClickHandlers();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      prevSelectedNodeId: this.props.selectedNodeId,
    });
  }

  componentDidUpdate() {
    this.createTree();
    this.setClickHandlers();
    this.applySelectedNodeStyle();
  }

  addEdgeString(parent_id, child_id, node_edge_graph) {
    const child_edge_format_string = '{0} -> {1}[arrowsize=0.8];';

    node_edge_graph.edges += child_edge_format_string.format(parent_id, child_id);
  }

  addNodeString(node, node_edge_graph) {
    const node_format_string = '{0}[id="{0}" label="{1}" stroke="{2}" fillcolor="{3}" style="{4}" shape={5} width=0.4 height=0.4, penwidth=0.5];';

    const nodeStyle = "filled";

    let content;
    if (!this.props.version || this.props.version == '1.0') {
      content = node.content;
    }
    else {
      content = EducativeUtil.escapeGraphvizLabels(node.content);
    }

    node_edge_graph.nodes += node_format_string.format(node.id,
      content == "" ? " " : content,
      node.fillcolor,
      node.fillcolor,
      nodeStyle,
      node.shape);
  }

  applySelectedNodeStyle() {
    if (this.props.mode != "edit") {
      return;
    }

    const dom = findDOMNode(this);

    // reset styling on previously selected node.
    if (this.state.prevSelectedNodeId != -1 &&
        this.state.prevSelectedNodeId != this.props.selectedNodeId) {
      const tempNode = this.findNode(this.props.root, this.state.prevSelectedNodeId);
      if (tempNode) {
        const tempNodeRgb = this.hexToRgb(tempNode.object.fillcolor);
        const rgb_string = "rgb({0}, {1}, {2})".format(tempNodeRgb.r,
          tempNodeRgb.g,
          tempNodeRgb.b);

        var selectedNodeIdValue = `#${this.state.prevSelectedNodeId}`;
        var nodeToSelect = $(dom).find(selectedNodeIdValue).find("path");
        nodeToSelect.attr("fill", rgb_string);
        nodeToSelect.attr("stroke", "rgb(0, 0, 0)");
        nodeToSelect.attr("stroke-width", "0.5px");
        nodeToSelect.attr("stroke-dasharray", "none");
      }
    }

    // apply styling on selected node.
    if (this.props.selectedNodeId != -1) {
      var selectedNodeIdValue = `#${this.props.selectedNodeId}`;
      var nodeToSelect = $(dom).find(selectedNodeIdValue).find("path");
      nodeToSelect.attr("stroke", "rgb(0, 0, 0)");
      nodeToSelect.attr("stroke-width", "1.5px");
      nodeToSelect.attr("stroke-dasharray", "5px, 2px");
    }
  }

  buildNodesAndEdges(root_node, node_edge_graph) {

    if (root_node == null) return

    const queue = [];
    queue.push(root_node);

    while (queue.length > 0) {
      const node = queue.shift();

      this.addNodeString(node, node_edge_graph);

      for (let i = 0; i < node.children.length; i++) {
        queue.push(node.children[i]);
        this.addEdgeString(node.id, node.children[i].id, node_edge_graph);
      }
    }
  }

  createGraphvizCodeStringTree(root, selectedNodeId) {

    let graph_string = 'graph[ordering="out"]; node [fontname = "courier", fontsize=16]; overlap = false; splines = true; bgcolor="transparent";';

    const node_edge_graph = {nodes: "", edges: ""};

    this.buildNodesAndEdges(root, node_edge_graph);

    var nodes = node_edge_graph.nodes;
    var edges = node_edge_graph.edges;

    graph_string += nodes;
    graph_string += edges;

    //
    // Create edges
    //

    const child_edge_format_string = '{0} -> {1}[arrowsize=0.8];';
    const invisible_node_format_string = '{0}[label="inv" style="invis" width=0.1 height=0.1 fixedsize="true" fontsize=1];';
    const invisible_edge_format_string = '{0} -> {1}[style="invis"];';

    graph_string = `digraph {${graph_string}}`
    return graph_string;
  }

  createTree() {
    if (this.props.root == null) {
      return;
    }

    let svgString;

    if (!this.props.svg_string) {
      // console.log('________Generating SVG String_______*******_______');
      const graph_string = this.createGraphvizCodeStringTree(this.props.root,
                                                           this.props.selectedNodeId);
      svgString = widgetUtil.generateSvgFromGraphviz(graph_string);
    }
    else {
      // console.log('________Generating SVG String_______SKIPPED_______');
      svgString = this.props.svg_string;
    }

    const dom = findDOMNode(this);
    dom.innerHTML = svgString;
    this.props.onSvgUpdate(svgString);
  }

  findNode(root, nodeId) {
    if (root == null) {
      return null;
    }

    if (root.id == nodeId) {
      return new SelectedNodeObject(null, root, 0);
    }

    // Find object in the subtree.

    const queue = [];
    queue.push(root);

    while (queue.length > 0) {
      const node = queue.shift();

      for (let i = 0; i < node.children.length; i++) {

        const child_node = node.children[i];
        if (child_node.id == nodeId) {
          return new SelectedNodeObject(node, child_node, i);
        }

        queue.push(child_node);
      }
    }

    return null;
  }

  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return (result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null);
  }

  setClickHandlers() {
    if (this.props.mode != 'edit') {
      return;
    }

    const onNodeClickCallback = this.props.onNodeClickCallback;
    const dom = findDOMNode(this);
    const domElement = d3.select(dom);
    domElement.selectAll("g.node").on('click', function () {
      const id = this.id;
      onNodeClickCallback(id)
      d3.event.stopPropagation()
    });
  }

  render() {
    return (
      <div width="100%" style={{display:'inline-block'}}></div>
    );
  }
}

class NaryTree extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addChildNodeButton = this.addChildNodeButton.bind(this);
    this.addNodeBtnLeft = this.addNodeBtnLeft.bind(this);
    this.addNodeBtnRight = this.addNodeBtnRight.bind(this);
    this.changeDrawEffect = this.changeDrawEffect.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onClickRemoveNodeButton = this.onClickRemoveNodeButton.bind(this);
    this.onColorChanged = this.onColorChanged.bind(this);
    this.onNodeClickCallback = this.onNodeClickCallback.bind(this);
    this.onSvgUpdate = this.onSvgUpdate.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    this.state = {
      selectedNodeId: -1,
      selectedNode: null,
      content: EducativeUtil.cloneObject(this.props.content),
      id: EducativeUtil.getKey(),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      content: EducativeUtil.cloneObject(nextProps.content)
    });
  }

  componentDidMount() {
    if(this.props.mode == 'view'){
      this.setupVivusEffect();
    }
    else {
      if(this.state.selectedNodeId != -1){
        this.setNodeValueInInput();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = this.props.content !== nextProps.content ||
                 this.props.mode !== nextProps.mode ||
                 nextState.selectedNodeId != -1 ||
                 nextState.selectedNodeId !== this.state.selectedNodeId ||
                 this.props.pageProperties !== nextProps.pageProperties;
    return result;
  }

  componentDidUpdate() {
    if(this.props.mode == 'view'){
      this.setupVivusEffect();
    }
    else {
      if(this.state.selectedNodeId != -1){
        this.setNodeValueInInput();
      }
    }
  }

  addChildNodeButton() {
    const newNodeId = `node_${String(EducativeUtil.getKey())}`;

    const newNode = {
      content: this.state.selectedNode.object.content,
      fillcolor: this.state.selectedNode.object.fillcolor,
      shape: this.state.selectedNode.object.shape,
      id: 'node_{0}'.format(Date.now() + 1),
      children: [],
    };

    const selNode = this.state.selectedNode.object;

    if (selNode.children.length != 0) {
      return;
    }
    selNode.children = [newNode];

    this.props.updateContentState({
      root: this.state.content.root,
      svg_string: null,
    });
  }

  addNodeBtnLeft() {
    const newNodeId = `node_${String(EducativeUtil.getKey())}`;

    const newNode = {
      content: this.state.selectedNode.object.content,
      fillcolor: this.state.selectedNode.object.fillcolor,
      shape: this.state.selectedNode.object.shape,
      id: 'node_{0}'.format(Date.now() + 1),
      children: [],
    };

    const parent = this.state.selectedNode.parent;
    const selNodeIdx = this.state.selectedNode.index;

    parent.children.splice(selNodeIdx, 0, newNode);

    this.updateSelectedNode();

    this.props.updateContentState({
      root: this.state.content.root,
      svg_string: null,
    });
  }

  addNodeBtnRight() {
    const newNodeId = `node_${String(EducativeUtil.getKey())}`;

    const newNode = {
      content: this.state.selectedNode.object.content,
      fillcolor: this.state.selectedNode.object.fillcolor,
      shape: this.state.selectedNode.object.shape,
      id: 'node_{0}'.format(Date.now() + 1),
      children: [],
    };

    const parent = this.state.selectedNode.parent;
    const selNodeIdx = this.state.selectedNode.index;

    parent.children.splice(selNodeIdx + 1, 0, newNode);

    this.updateSelectedNode();

    this.props.updateContentState({
      root: this.state.content.root,
      svg_string: null,
    });
  }

  changeDrawEffect() {
    this.props.updateContentState({draw_effect : !this.state.content.draw_effect});
  }

  clearSelection() {
    this.setState({
      selectedNodeId: -1,
      selectedNode: null,
    });
  }

  findNode(root, nodeId) {
    if (root == null) {
      return null;
    }

    if (root.id == nodeId) {
      return new SelectedNodeObject(null, root, 0);
    }

    // Find object in the subtree.

    const queue = [];
    queue.push(root);

    while (queue.length > 0) {
      const node = queue.shift();

      for (let i = 0; i < node.children.length; i++) {
        const child_node = node.children[i];

        if (child_node.id == nodeId) {
          return new SelectedNodeObject(node, child_node, i);
        }

        queue.push(child_node);
      }
    }

    return null;
  }

  handleCaptionChange(caption) {
    this.props.updateContentState({caption});
  }

  handleKeyDown(e) {
    if (e.key === 'Enter'){
      this.updateNodeValue(findDOMNode(this.nodeValueInputRef).value);
      this.clearSelection();
    }
    else if(e.key === 'Escape') {
      this.clearSelection();
    } else {
      return;
    }
  }

  onClickRemoveNodeButton() {

    const node = this.findNode(this.state.content.root, this.state.selectedNodeId);

    node.parent.children.splice(node.index, 1);

    selectedTree = null;
    this.state.selectedNode = null;
    this.state.selectedNodeId = -1;

    this.props.updateContentState({
      root: this.state.content.root,
      svg_string: null,
    })

  }

  onColorChanged(colorValue) {

    if (colorValue.charAt(0) != '#') {
      colorValue = `#${colorValue}`;
    }

    // length must be >= 2 including #
    if (colorValue.length < 2) {
      return;
    }

    if (this.state.selectedNode.object.fillcolor != colorValue) {
      this.state.selectedNode.object.fillcolor = colorValue;

      this.props.updateContentState({
        root: this.state.content.root,
        svg_string: null,
      });
    }
  }

  onNodeClickCallback(nodeId) {
    selectedTree = this.state.id;
    const selectedNode = this.findNode(this.state.content.root, nodeId);
    if (selectedNode == null) {
      return;
    }

    this.setState({
      selectedNodeId: nodeId,
      selectedNode,
    });

    if (this.nodeValueInputRef) {
      const $input = findDOMNode(this.nodeValueInputRef);

      $input.focus();
      $input.select();
    }
  }

  onSvgUpdate(svg_string) {
    this.props.updateContentState({svg_string});
  }

  onValueChange(event) {
    this.updateNodeValue(event.target.value);
  }

  setNodeValueInInput() {
    if(this.nodeValueInputRef) {
      findDOMNode(this.nodeValueInputRef).value = this.state.selectedNode.object.content;
    }
  }

  setupVivusEffect() {
    if(this.refs.dsRender && this.state.content.draw_effect){
        new Vivus(
          findDOMNode(this.refs.dsRender).children[0],
          {
            type: 'oneByOne',
            duration: 100,
          },
          function (obj) {
        obj.el.classList.add('ed-ds-render-finished');},
        );
    }
  }

  updateNodeValue(val) {
    if (this.state.selectedNode.object.content != val) {
      this.state.selectedNode.object.content = val;
      this.props.updateContentState({
        root: this.state.content.root,
        svg_string: null,
      });
    }
  }

  updateSelectedNode() {

    const selectedNode = this.findNode(this.state.content.root, this.state.selectedNodeId);
    this.state.selectedNode = selectedNode;
  }

  render() {
    const readOnly = (this.props.mode != 'edit');
    let drawEffectBtn = null;
    let nodeEditComponents = null;

    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    if (!readOnly) {
      let drawBtnClass = '';
      if(this.state.content.draw_effect == true){
        drawBtnClass = '#2EB398';
      } else {
        drawBtnClass = 'darkgray';
      }

      let tooltip = <Tooltip id={"Enable draw effect"} placement="bottom">Click here to enable/disable draw effect</Tooltip>;
      drawEffectBtn = <OverlayTrigger placement="bottom" overlay={tooltip}>
            <Button className='switch-button' style={{color:drawBtnClass}} onClick={this.changeDrawEffect}>
              <SomethingWithIcon icon={Icons.thickPencilIcon}/>
            </Button>
          </OverlayTrigger>;
    }

    let addChildNode = null;
    if (!readOnly && this.state.selectedNodeId != -1 &&
        this.state.id==selectedTree &&
        this.state.selectedNode.object.children.length == 0) {
      addChildNode = <Button className='btn-append-node' style={{marginLeft:5 }} sm outlined ref="addChildNodeButton" bsStyle='darkgreen45'
                             onClick={this.addChildNodeButton}>
        <SomethingWithIcon icon={Icons.thinPlus1}/>
        Child Node
      </Button>;
    }

    if (!readOnly) {
      if (this.state.selectedNodeId != -1 &&
          this.state.id == selectedTree) {
        let addNodeBtnLeft = null;
        let addNodeBtnRight = null;
        let remNodeBtn = null;

        if (this.state.selectedNodeId != this.state.content.root.id) {
          addNodeBtnLeft =
            <Button className='btn-append-node' style={{marginLeft:5 }} sm outlined ref="addNodeButtonLeft" bsStyle='darkgreen45'
                    onClick={this.addNodeBtnLeft}>
              <SomethingWithIcon icon={Icons.thinPlus1}/>
              Left Sibling
            </Button>;

          addNodeBtnRight =
            <Button className='btn-append-node' style={{marginLeft:5 }} sm outlined ref="addNodeButtonRight" bsStyle='darkgreen45'
                    onClick={this.addNodeBtnRight}>
              <SomethingWithIcon icon={Icons.thinPlus1}/>
              Right Sibling
            </Button>;

          remNodeBtn =
            <Button className='fg-darkgray75 delete-button' ref="removeNodeButton" onClick={this.onClickRemoveNodeButton}>
              <SomethingWithIcon icon={Icons.trashIcon}/>
            </Button>;
        }

        this.state.selectedNode = this.findNode(this.state.content.root, this.state.selectedNodeId);

        nodeEditComponents =
          <div style={{padding:1}}>
            {drawEffectBtn}
            {addNodeBtnLeft}
            {addNodeBtnRight}
            {addChildNode}
            <FormControl type='text' style={{marginLeft:8 , marginRight:8, width:'200px', display:'inline'}} ref={node => this.nodeValueInputRef = node}
                   onBlur={this.onValueChange} onKeyDown={this.handleKeyDown}/>
            <ColorPicker value={this.state.selectedNode.object.fillcolor} onChange={this.onColorChanged}/>
            {remNodeBtn}
            <div style={{display:'inline-block',float:'right',marginRight:8,marginTop:5}}>
              <a className='fg-darkgray75'
                 style={{cursor:'pointer'}}
                 onClick={this.clearSelection}>
                 Close
              </a>
            </div>
        </div>;
      }
      else {
        nodeEditComponents = <div>
                                {drawEffectBtn}
                                <span className='fg-darkgray40' style={{marginLeft:5}}>Click on tree nodes to see options</span>
                             </div>;
      }
    }

    let onClickCallback = null;
    let componentToolbar = null;
    if (!readOnly) {
      componentToolbar = <div className='edcomp-toolbar'> {nodeEditComponents} </div>;
      onClickCallback = this.onNodeClickCallback;
    }

    let captionComponent = null;

    if (this.props.disableCaption == null || this.props.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.state.content.caption}
        readOnly={readOnly}
        onCaptionChange={this.handleCaptionChange}/>;
    }

    const tempSelectedId = (this.state.id == selectedTree) ? this.state.selectedNodeId : -1;

    let displayNaryTree = null;
    if (readOnly && this.state.content.hasOwnProperty('svg_string')) {
      let tempHtml = {__html: this.state.content.svg_string};
      let width = widgetUtil.parseSvgWidth(this.state.content.svg_string);
      let className = this.state.content.draw_effect ? 'ed-ds-render' : 'ed-ds-view';
      displayNaryTree = <div ref='dsRender' className={className} dangerouslySetInnerHTML={tempHtml} style={{display:'block', maxWidth:width, margin: widgetUtil.getMargin(compAlign)}}/>

      this.state.selectedNodeId = -1;
    }
    else {
      displayNaryTree =
        <NaryTreeD3 root={this.state.content.root} mode={this.props.mode}
                    svg_string={this.state.content.svg_string}
                    version={ this.state.content.version ? this.state.content.version : null}
                    onNodeClickCallback={onClickCallback} onSvgUpdate={this.onSvgUpdate}
                    selectedNodeId={tempSelectedId}/>;
    }

    return (
      <div>
        {componentToolbar}
        <div style={{textAlign:compAlign}}>
          <div style={{display:'block'}}>
            {displayNaryTree}
          </div>
        </div>
        {captionComponent}
      </div>
    );
  }
}

NaryTree.getDefaultNaryTreeRoot = function () {
  const node_shape = "Mrecord";

  return {
    version: '3.0',
    caption: '',
    svg_string: '<svg width=\"130pt\" height=\"104pt\" viewBox=\"0.00 0.00 130.00 104.00\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"> <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 100)\"> <title>%3<\/title> <!-- node_1 --> <g id=\"node_1\" class=\"node\"><title>node_1<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M56.1667,-66.5C56.1667,-66.5 65.8333,-66.5 65.8333,-66.5 70.6667,-66.5 75.5,-71.3333 75.5,-76.1667 75.5,-76.1667 75.5,-85.8333 75.5,-85.8333 75.5,-90.6667 70.6667,-95.5 65.8333,-95.5 65.8333,-95.5 56.1667,-95.5 56.1667,-95.5 51.3333,-95.5 46.5,-90.6667 46.5,-85.8333 46.5,-85.8333 46.5,-76.1667 46.5,-76.1667 46.5,-71.3333 51.3333,-66.5 56.1667,-66.5\"><\/path> <text text-anchor=\"middle\" x=\"60.7992\" y=\"-76.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">1<\/text> <\/g> <!-- node_2 --> <g id=\"node_2\" class=\"node\"><title>node_2<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M9.16667,-0.5C9.16667,-0.5 18.8333,-0.5 18.8333,-0.5 23.6667,-0.5 28.5,-5.33333 28.5,-10.1667 28.5,-10.1667 28.5,-19.8333 28.5,-19.8333 28.5,-24.6667 23.6667,-29.5 18.8333,-29.5 18.8333,-29.5 9.16667,-29.5 9.16667,-29.5 4.33333,-29.5 -0.5,-24.6667 -0.5,-19.8333 -0.5,-19.8333 -0.5,-10.1667 -0.5,-10.1667 -0.5,-5.33333 4.33333,-0.5 9.16667,-0.5\"><\/path> <text text-anchor=\"middle\" x=\"13.7992\" y=\"-10.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">2<\/text> <\/g> <!-- node_1&#45;&gt;node_2 --> <g id=\"edge1\" class=\"edge\"><title>node_1-&gt;node_2<\/title> <path fill=\"none\" stroke=\"black\" d=\"M51.0325,-66.4272C44.552,-57.6027 35.9886,-45.9419 28.7291,-36.0566\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"30.9453,-34.3439 23.9531,-29.5532 26.4316,-37.6586 30.9453,-34.3439\"><\/polygon> <\/g> <!-- node_3 --> <g id=\"node_3\" class=\"node\"><title>node_3<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M56.1667,-0.5C56.1667,-0.5 65.8333,-0.5 65.8333,-0.5 70.6667,-0.5 75.5,-5.33333 75.5,-10.1667 75.5,-10.1667 75.5,-19.8333 75.5,-19.8333 75.5,-24.6667 70.6667,-29.5 65.8333,-29.5 65.8333,-29.5 56.1667,-29.5 56.1667,-29.5 51.3333,-29.5 46.5,-24.6667 46.5,-19.8333 46.5,-19.8333 46.5,-10.1667 46.5,-10.1667 46.5,-5.33333 51.3333,-0.5 56.1667,-0.5\"><\/path> <text text-anchor=\"middle\" x=\"60.7992\" y=\"-10.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">3<\/text> <\/g> <!-- node_1&#45;&gt;node_3 --> <g id=\"edge2\" class=\"edge\"><title>node_1-&gt;node_3<\/title> <path fill=\"none\" stroke=\"black\" d=\"M61,-66.4272C61,-58.1118 61,-47.278 61,-37.7844\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"63.8001,-37.5532 61,-29.5532 58.2001,-37.5532 63.8001,-37.5532\"><\/polygon> <\/g> <!-- node_4 --> <g id=\"node_4\" class=\"node\"><title>node_4<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M103.167,-0.5C103.167,-0.5 112.833,-0.5 112.833,-0.5 117.667,-0.5 122.5,-5.33333 122.5,-10.1667 122.5,-10.1667 122.5,-19.8333 122.5,-19.8333 122.5,-24.6667 117.667,-29.5 112.833,-29.5 112.833,-29.5 103.167,-29.5 103.167,-29.5 98.3333,-29.5 93.5,-24.6667 93.5,-19.8333 93.5,-19.8333 93.5,-10.1667 93.5,-10.1667 93.5,-5.33333 98.3333,-0.5 103.167,-0.5\"><\/path> <text text-anchor=\"middle\" x=\"107.799\" y=\"-10.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">4<\/text> <\/g> <!-- node_1&#45;&gt;node_4 --> <g id=\"edge3\" class=\"edge\"><title>node_1-&gt;node_4<\/title> <path fill=\"none\" stroke=\"black\" d=\"M70.9675,-66.4272C77.448,-57.6027 86.0114,-45.9419 93.2709,-36.0566\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"95.5684,-37.6586 98.0469,-29.5532 91.0547,-34.3439 95.5684,-37.6586\"><\/polygon> <\/g> <\/g> <\/svg>',
    draw_effect: false,

    // Update svg_string if below nodes are modified.
    root: {
      content: "1",
      fillcolor: "#bfefff",
      shape: node_shape,
      id: 'node_1',

      children: [{
        content: "2",
        fillcolor: "#bfefff",
        shape: node_shape,
        id: 'node_2',
        children: [],
      }, {
        content: "3",
        fillcolor: "#bfefff",
        shape: node_shape,
        id: 'node_3',
        children: [],
      }, {
        content: "4",
        fillcolor: "#bfefff",
        shape: node_shape,
        id: 'node_4',
        children: [],
      }],
    },
  };
};

module.exports = NaryTree;
