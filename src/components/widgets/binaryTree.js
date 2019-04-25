import React from 'react'
import {findDOMNode} from 'react-dom';
import * as widgetUtil from '../helpers/widgetUtil';


const ColorPicker = require('../common/colorpicker');
const CaptionComponent = require('../CaptionComponent/CaptionComponent');
const Button = require('../common/Button');
const EducativeUtil = require('../common/ed_util');
const Vivus = require('vivus');

import {FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {SomethingWithIcon, Icons} from '../index';

let selectedBinaryTree = null;

class BinaryTreeD3 extends React.Component {
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

  addEdge(edges, parent_id, left_child_id, right_child_id) {
    edges[parent_id] = [left_child_id, right_child_id]
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
        const tempNodeRgb = this.hexToRgb(tempNode.fillcolor);
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

  buildNodesAndEdges(node, nodes, edges) {
    if (node != null) {
      nodes.push(node);

      const left_edge = node.left_child != null ? node.left_child.id : null;
      const right_edge = node.right_child != null ? node.right_child.id : null;

      this.addEdge(edges, node.id, left_edge, right_edge);

      this.buildNodesAndEdges(node.left_child, nodes, edges);
      this.buildNodesAndEdges(node.right_child, nodes, edges);
    }
  }

  createGraphvizCodeStringTree() {
    const root = this.props.root;
    const nodes = [];
    const edges = {};

    this.buildNodesAndEdges(root, nodes, edges);

    //
    // Create nodes
    //

    let graph_string = 'graph[ordering="out"]; node [fontname = "courier", fontsize=16]; overlap = false; splines = true;  bgcolor="transparent";';
    const node_format_string = '{0}[id="{0}" label="{1}" stroke="{2}" fillcolor="{3}" style="{4}" shape={5} width=0.4 height=0.4, penwidth=0.5];';

    for (let index in nodes) {
      const node = nodes[index];
      const nodeStyle = "filled";
      node.color = node.fillcolor;

      let content;
      if (!this.props.version || this.props.version == '1.0') {
        content = node.content;
      }
      else {
        content = EducativeUtil.escapeGraphvizLabels(node.content);
      }

      graph_string += node_format_string.format(
        node.id,
        content == "" ? " " : content,
        node.color,
        node.fillcolor,
        nodeStyle,
        node.shape);
    }

    //
    // Create edges
    //

    const child_edge_format_string = '{0} -> {1}[arrowsize=0.8, fillcolor=gray25, stroke=gray25];';
    const invisibleNodeFormatString = '{0}[label="", width=.1, style=invis]';
    const invisibleEdgeFormatString = '{0} -> {1} [style=invis]';

    for (let node_id in edges) {

      const children = edges[node_id];
      const left = children[0];
      const right = children[1];

      if (left === null && right === null) {
        continue;
      }

      let balancedLeft = left;
      if (left != null) {
        graph_string += child_edge_format_string.format(node_id, left);
      }
      else {
        // add a hidden left node for balancing
        balancedLeft = `${node_id}invisibleLeft`;
        graph_string += invisibleNodeFormatString.format(balancedLeft);
        graph_string += invisibleEdgeFormatString.format(node_id, balancedLeft);
      }

      // middle invisible node added for a balanced look.
      const balancedMid = `${node_id}_invisNode`;
      graph_string += invisibleNodeFormatString.format(balancedMid);
      graph_string += invisibleEdgeFormatString.format(node_id, balancedMid);

      let balancedRight = right;
      if (right != null) {
        graph_string += child_edge_format_string.format(node_id, right);
      }
      else {
        // add a hidden left node for balancing
        balancedRight = `${node_id}invisibleRight`;
        graph_string += invisibleNodeFormatString.format(balancedRight);
        graph_string += invisibleEdgeFormatString.format(node_id, balancedRight);
      }

      graph_string += '{rank=same {0}{1}{2} [style=invis]}'.format(`${balancedLeft} -> `,
        balancedMid,
        ` -> ${balancedRight}`);
    }

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
      const graph_string = this.createGraphvizCodeStringTree();
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
    if (root != null) {
      if (root.id == nodeId) {
        return root;
      }

      const left = this.findNode(root.left_child, nodeId);
      if (null != left) {
        return left;
      }

      const right = this.findNode(root.right_child, nodeId);
      if (null != right) {
        return right;
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
    if (this.props.mode != "edit") {
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

class BinaryTree extends React.Component {
  constructor(props, context) {
    super(props, context);
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
      if (this.state.selectedNodeId != -1) {
        this.setNodeValueInInput();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result =  this.props.content !== nextProps.content ||
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
      if (this.state.selectedNodeId != -1) {
        this.setNodeValueInInput();
      }
    }
  }

  addNodeBtnLeft() {
    const newNodeId = `node_${String(EducativeUtil.getKey())}`;

    this.state.selectedNode.left_child = {
      left_child: null,
      right_child: null,
      content: this.state.selectedNode.content,
      fillcolor: this.state.selectedNode.fillcolor,
      shape: this.state.selectedNode.shape,
      id: newNodeId,
    };

    this.props.updateContentState({
      root: this.state.content.root,
      svg_string: null,
    });
  }

  addNodeBtnRight() {
    const newNodeId = `node_${String(EducativeUtil.getKey())}`;

    this.state.selectedNode.right_child = {
      left_child: null,
      right_child: null,
      content: this.state.selectedNode.content,
      fillcolor: this.state.selectedNode.fillcolor,
      shape: this.state.selectedNode.shape,
      id: newNodeId,
    };

    this.props.updateContentState({
      root: this.state.content.root,
      svg_string: null,
    });
  }

  changeDrawEffect() {
    this.props.updateContentState({draw_effect:!this.state.content.draw_effect});
  }

  clearSelection() {
    this.setState({
      selectedNodeId: -1,
      selectedNode: null,
    });
  }

  findNode(root, nodeId) {
    if (root != null) {

      if (root.id == nodeId) {
        return root;
      }

      const left = this.findNode(root.left_child, nodeId);
      if (null != left) {
        return left;
      }

      const right = this.findNode(root.right_child, nodeId);
      if (null != right) {
        return right;
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
    this.removeNode(this.state.content.root, this.state.selectedNodeId);
    selectedBinaryTree = null;

    this.state.selectedNode = null;
    this.state.selectedNodeId = -1;

    this.props.updateContentState({
      root: this.state.content.root,
      svg_string: null,
    });
  }

  onColorChanged(colorValue) {

    if (colorValue.charAt(0) != '#') {
      colorValue = `#${colorValue}`;
    }

    if (colorValue.length < 2) {
      return;
    }

    if (this.state.selectedNode.fillcolor != colorValue) {
      this.state.selectedNode.fillcolor = colorValue;

      this.props.updateContentState({
        root: this.state.content.root,
        svg_string: null,
      });
    }
  }

  onNodeClickCallback(nodeId) {
    selectedBinaryTree = this.state.id;
    const selectedNode = this.findNode(this.state.content.root, nodeId);
    if (!selectedNode) {
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

  removeNode(root, nodeId) {
    if (root == null) {
      return;
    }

    if (root.left_child != null && root.left_child.id == nodeId) {
      root.left_child = null;
      return;
    }

    if (root.right_child != null && root.right_child.id == nodeId) {
      root.right_child = null;
      return;
    }

    this.removeNode(root.left_child, nodeId);
    this.removeNode(root.right_child, nodeId);
  }

  setNodeValueInInput() {
    if(this.nodeValueInputRef) {
      findDOMNode(this.nodeValueInputRef).value = this.state.selectedNode.content;
    }
  }

  setupVivusEffect() {
    if(this.refs.dsRender && this.state.content.draw_effect){
        new Vivus(
          findDOMNode(this.refs.dsRender).children[0],
          {
            type: 'oneByOne',
            duration: 200,
          },
          function (obj) {
          obj.el.classList.add('ed-ds-render-finished');},
        );
    }
  }

  updateNodeValue(val) {
    if (this.state.selectedNode.content != val) {
      this.state.selectedNode.content = val;
      this.props.updateContentState({
        root: this.state.content.root,
        svg_string: null,
      });
    }
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

      nodeEditComponents = <div>
        {drawEffectBtn}
        <span className='fg-darkgray40' style={{marginLeft:5}}>Click on tree nodes to see options</span>
      </div>;
    }

    let addNodeBtnLeft = null;
    let addNodeBtnRight = null;
    let remNodeBtn = null;
    if (!readOnly && this.state.selectedNodeId != -1 && this.state.id == selectedBinaryTree) {
      var selectedNodeId = this.state.selectedNodeId;

      if (this.state.selectedNode.left_child == null) {
        addNodeBtnLeft =
          <Button className='btn-append-node' style={{marginLeft:5 }} sm outlined ref="addNodeButtonLeft" bsStyle='darkgreen45'
                  onClick={this.addNodeBtnLeft}>
            <SomethingWithIcon icon={Icons.thinPlus1}/>
            Left
          </Button>;
      }

      if (this.state.selectedNode.right_child == null) {
        addNodeBtnRight =
          <Button className='btn-append-node' style={{marginLeft:5 }} sm outlined ref="addNodeButtonRight" bsStyle='darkgreen45'
                  onClick={this.addNodeBtnRight}>
            <SomethingWithIcon icon={Icons.thinPlus1}/>
            Right
          </Button>;
      }

      if (this.state.selectedNode.id != this.state.content.root.id) {
        remNodeBtn =
          <Button className='fg-darkgray75 delete-button' ref="removeNodeButton" onClick={this.onClickRemoveNodeButton}>
            <SomethingWithIcon icon={Icons.trashIcon}/>
          </Button>;
      } else {
        remNodeBtn = null;
      }

      this.state.selectedNode = this.findNode(this.state.content.root, this.state.selectedNodeId);

      nodeEditComponents =
        <div style={{padding:1, display:'inline'}}>
        {drawEffectBtn}
        {addNodeBtnLeft}
        {addNodeBtnRight}
        <FormControl type='text' style={{marginLeft:8 , marginRight:8, width:'200px', display:'inline'}} ref={node => this.nodeValueInputRef = node}
               onBlur={this.onValueChange} onKeyDown={this.handleKeyDown}/>
        <ColorPicker value={this.state.selectedNode.fillcolor} onChange={this.onColorChanged}/>
        {remNodeBtn}
        <div style={{display:'inline-block',float:'right',marginRight:8,marginTop:5}}><a className='fg-darkgray75'
                                                                                         style={{cursor:'pointer'}}
                                                                                         onClick={this.clearSelection}>Close</a>
        </div>
      </div>;
    }

    let componentToolbar = null;
    if (!readOnly) {
      componentToolbar = <div className='edcomp-toolbar'>
        {nodeEditComponents}
      </div>;
    }

    let captionComponent = null;

    if (this.props.config == null || this.props.config.disableCaption == null || this.props.config.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.state.content.caption}
        readOnly={readOnly}
        onCaptionChange={this.handleCaptionChange}/>;
    }

    const tempSelectedId = (this.state.id == selectedBinaryTree) ? this.state.selectedNodeId : -1;

    let displayBinaryTree = null;

    if (readOnly && this.state.content.hasOwnProperty('svg_string')) {
      let tempHtml = {__html: this.state.content.svg_string};
      let width = widgetUtil.parseSvgWidth(this.state.content.svg_string);
      let className = this.state.content.draw_effect ? 'ed-ds-render' : 'ed-ds-view';
      displayBinaryTree = <div ref='dsRender' className={className} dangerouslySetInnerHTML={tempHtml} style={{display:'block', maxWidth:width, margin: widgetUtil.getMargin(compAlign)}}/>
      this.state.selectedNodeId = -1;
    } else {
      displayBinaryTree = <BinaryTreeD3 root={this.state.content.root} mode={this.props.mode}
                                  svg_string = {this.state.content.svg_string}
                                  version={ this.state.content.version ? this.state.content.version : null}
                                  onNodeClickCallback={this.onNodeClickCallback} onSvgUpdate={this.onSvgUpdate}
                                  selectedNodeId={tempSelectedId}/>;
    }

    return (
      <div>
        {componentToolbar}
        <div style={{textAlign:compAlign}}>
          <div>
            {displayBinaryTree}
          </div>
        </div>
        {captionComponent}
      </div>
    );
  }
}

BinaryTree.getComponentDefault = function () {
  const node_shape = "Mrecord";

  const defaultContent = {
    version: '3.0',
    caption: '',
    svg_string: "<svg width=\"108pt\" height=\"110pt\" viewBox=\"0.00 0.00 108.00 110.00\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"> <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 106)\"> <title>%3<\/title> <!-- node_1 --> <g id=\"node_1\" class=\"node\"><title>node_1<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M45.1667,-72.5C45.1667,-72.5 54.8333,-72.5 54.8333,-72.5 59.6667,-72.5 64.5,-77.3333 64.5,-82.1667 64.5,-82.1667 64.5,-91.8333 64.5,-91.8333 64.5,-96.6667 59.6667,-101.5 54.8333,-101.5 54.8333,-101.5 45.1667,-101.5 45.1667,-101.5 40.3333,-101.5 35.5,-96.6667 35.5,-91.8333 35.5,-91.8333 35.5,-82.1667 35.5,-82.1667 35.5,-77.3333 40.3333,-72.5 45.1667,-72.5\"><\/path> <text text-anchor=\"middle\" x=\"49.7992\" y=\"-82.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">1<\/text> <\/g> <!-- node_2 --> <g id=\"node_2\" class=\"node\"><title>node_2<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M9.16667,-3.5C9.16667,-3.5 18.8333,-3.5 18.8333,-3.5 23.6667,-3.5 28.5,-8.33333 28.5,-13.1667 28.5,-13.1667 28.5,-22.8333 28.5,-22.8333 28.5,-27.6667 23.6667,-32.5 18.8333,-32.5 18.8333,-32.5 9.16667,-32.5 9.16667,-32.5 4.33333,-32.5 -0.5,-27.6667 -0.5,-22.8333 -0.5,-22.8333 -0.5,-13.1667 -0.5,-13.1667 -0.5,-8.33333 4.33333,-3.5 9.16667,-3.5\"><\/path> <text text-anchor=\"middle\" x=\"13.7992\" y=\"-13.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">2<\/text> <\/g> <!-- node_1&#45;&gt;node_2 --> <g id=\"edge1\" class=\"edge\"><title>node_1-&gt;node_2<\/title> <path fill=\"none\" stroke=\"black\" d=\"M42.7149,-72.4416C37.6889,-63.0877 30.9107,-50.4726 25.2018,-39.8479\"><\/path> <polygon fill=\"#404040\" stroke=\"black\" points=\"27.5274,-38.2601 21.2743,-32.5383 22.5944,-40.9107 27.5274,-38.2601\"><\/polygon> <\/g> <!-- node_3 --> <g id=\"node_3\" class=\"node\"><title>node_3<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M81.1667,-3.5C81.1667,-3.5 90.8333,-3.5 90.8333,-3.5 95.6667,-3.5 100.5,-8.33333 100.5,-13.1667 100.5,-13.1667 100.5,-22.8333 100.5,-22.8333 100.5,-27.6667 95.6667,-32.5 90.8333,-32.5 90.8333,-32.5 81.1667,-32.5 81.1667,-32.5 76.3333,-32.5 71.5,-27.6667 71.5,-22.8333 71.5,-22.8333 71.5,-13.1667 71.5,-13.1667 71.5,-8.33333 76.3333,-3.5 81.1667,-3.5\"><\/path> <text text-anchor=\"middle\" x=\"85.7992\" y=\"-13.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">3<\/text> <\/g> <!-- node_1&#45;&gt;node_3 --> <g id=\"edge3\" class=\"edge\"><title>node_1-&gt;node_3<\/title> <path fill=\"none\" stroke=\"black\" d=\"M57.2851,-72.4416C62.3111,-63.0877 69.0893,-50.4726 74.7982,-39.8479\"><\/path> <polygon fill=\"#404040\" stroke=\"black\" points=\"77.4056,-40.9107 78.7257,-32.5383 72.4726,-38.2601 77.4056,-40.9107\"><\/polygon> <\/g> <!-- node_1_invisNode --> <!-- node_1&#45;&gt;node_1_invisNode --> <!-- node_2&#45;&gt;node_1_invisNode --> <!-- node_1_invisNode&#45;&gt;node_3 --> <\/g> <\/svg>",

    // Update svg_string if below nodes are modified.
    draw_effect: false,

    root: {
      content: "1",
      fillcolor: "#bfefff",
      shape: node_shape,
      id: 'node_1',

      left_child: {
        content: "2",
        fillcolor: "#bfefff",
        shape: node_shape,
        id: 'node_2',
        left_child: null,
        right_child: null,
      },

      right_child: {
        content: "3",
        fillcolor: "#bfefff",
        shape: node_shape,
        id: 'node_3',
        left_child: null,
        right_child: null,
      },
    },
  };
  return defaultContent;
};

module.exports = BinaryTree;
