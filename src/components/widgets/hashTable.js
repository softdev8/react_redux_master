import React from 'react'
import {findDOMNode} from 'react-dom';
import * as widgetUtil from '../helpers/widgetUtil';

const ColorPicker = require('../common/colorpicker');
const CaptionComponent = require('../CaptionComponent/CaptionComponent');
const Button = require('../common/Button');
const Icon = require('../common/Icon');
const EducativeUtil = require('../common/ed_util');
const Vivus = require('vivus');

import {FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';

let selectedHashTable = null;
const node_format_string = '{0}[id="{0}" label="{1}" color="{2}" fillcolor="{3}" style="{4}" shape={5} width={6} penwidth=0.42 height=0.42];';

function SelectedNodeObject(object, parentIndex, nodeIndex) {
  this.object = object;
  this.parentIndex = parentIndex;
  this.nodeIndex = nodeIndex;
}

class EducativeHashTableD3 extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      prevSelectedNodeId: -1,
    };
  }

  componentDidMount() {
    this.createEducativeHashTable();
    this.setClickHandlers();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      prevSelectedNodeId: this.props.selectedNodeId,
    });
  }

  componentDidUpdate() {
    this.createEducativeHashTable();
    this.setClickHandlers();
    this.applySelectedNodeStyle();
  }

  applySelectedNodeStyle() {
    if (this.props.mode != "edit") {
      return;
    }

    const dom = findDOMNode(this);

    // reset styling on previously selected node.
    if (this.state.prevSelectedNodeId != -1 &&
      this.state.prevSelectedNodeId != this.props.selectedNodeId) {
      var prevSelectedNodeId = this.state.prevSelectedNodeId;

      const tempNode = this.findNode(prevSelectedNodeId);
      if (tempNode) {
        const tempNodeRgb = this.hexToRgb(tempNode.fillcolor);
        const rgb_string = "rgb({0}, {1}, {2})".format(tempNodeRgb.r, tempNodeRgb.g, tempNodeRgb.b);

        function resetStyle (node) {
          node.attr("fill", rgb_string);
          node.attr("stroke", "rgb(0, 0, 0)");
          node.attr("stroke-width", "0.5px");
          node.attr("stroke-dasharray", "none");
        }

        var selectedNodeIdValue = `#${prevSelectedNodeId}`;

        var nodeToSelect = $(dom).find(selectedNodeIdValue).find("path");
        resetStyle(nodeToSelect);

        nodeToSelect = $(dom).find(selectedNodeIdValue).find("polygon");
        resetStyle(nodeToSelect);
      }
    }

    // apply styling on selected node
    if (this.props.selectedNodeId != -1) {
      function applyStyle (node) {
        nodeToSelect.attr("stroke", "rgb(0, 0, 0)");
        nodeToSelect.attr("stroke-width", "1.5px");
        nodeToSelect.attr("stroke-dasharray", "5px, 2px");
      }

      var selectedNodeIdValue = `#${this.props.selectedNodeId}`;

      var nodeToSelect = $(dom).find(selectedNodeIdValue).find("path");
      applyStyle(nodeToSelect);

      nodeToSelect = $(dom).find(selectedNodeIdValue).find("polygon");
      applyStyle(nodeToSelect);
    }
  }

  createEducativeHashTable() {
    let svgString;

    if (!this.props.svg_string) {
      const graph_string = this.createGraphvizCodeString();
      svgString = widgetUtil.generateSvgFromGraphviz(graph_string);
    }
    else {
      svgString = this.props.svg_string;
    }

    const dom = findDOMNode(this);
    dom.innerHTML = svgString;
    this.props.onSvgUpdate(svgString);
  }

  createGraphvizCodeString() {
    const nodes = this.props.nodes;
    let graph_string = 'node [fontname = "courier", fontsize=16]; nodesep=0.05; rankdir=LR; bgcolor="transparent";';
    let style = 'filled';
    const maxWidth = this.findMaxLength(nodes);

    for (let i = nodes.length - 1; i >= 0 ; i--) {
      const node = nodes[i];
      style = 'filled';

      const content = EducativeUtil.escapeGraphvizLabels(node.content);
      const nodeContent = content == "" ? " " : content;

      graph_string += node_format_string.format(node.id, nodeContent, "#000000", node.fillcolor, style, "record", maxWidth);
      graph_string += this.getNodeKeyList(node);
    }

    graph_string = `digraph {${graph_string}}`;

    return graph_string;
  }

  findMaxLength(nodes) {
    let max = 1;

    if (nodes) {
      for (let i = 0; i < nodes.length; ++i) {
        const len = nodes[i].content.length;
        if (len > max) {
          max = len;
        }
      }
    }

    // no solid logic for the below formula.
    // hit-n-trial, works for ~100 characters.
    max = 1 + (max / 7.0);
    return max;
  }

  findNode(nodeId) {
    const nodes = this.props.nodes;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id == nodeId) {
        return node;
      }

      for (let j = 0; j < node.keyList.length; ++j) {
        let currNode = node.keyList[j];

        if (currNode.id == nodeId) {
          return currNode;
        }
      }
    }

    return null;
  }

  getNodeKeyList(hashTableNode) {
    let nodes = hashTableNode.keyList;
    if (nodes.length < 1) {
      return "";
    }

    let klString = "";
    let list_node_format_string = '{0}[id="{0}" label="{1}" stroke="{2}" fillcolor="{3}" style="{4}" shape={5} width=0.37 height=0.37, penwidth=0.5];';

    for (let i = 0; i < nodes.length; ++i) {
      let node = nodes[i];

      let nodeContent = EducativeUtil.escapeGraphvizLabels(node.content);
      nodeContent = (nodeContent == "" ? " " : nodeContent);

      klString += list_node_format_string.format(node.id, nodeContent, "#000000", node.fillcolor, "filled", "Mrecord", 0.5);
    }

    const list_edge_format_string = "{0}->{1}[arrowsize=0.8, penwidth=0.6, fillcolor=gray25, stroke=gray25];";
    let prev = null;
    for (let i = 0; i < nodes.length; i++) {
      if (prev != null) {
        klString += list_edge_format_string.format(prev, nodes[i].id);
      }
      prev = nodes[i].id;
    }
    prev = null;

    klString += `${hashTableNode.id} -> ${nodes[0].id} [arrowsize=0.5];`;

    return klString;
  }

  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var hex = hex.replace(shorthandRegex, function (m, r, g, b) {
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

    const onClickNodeCallBack = this.props.onClickNodeCallBack;
    const domElement = d3.select(findDOMNode(this));
    domElement.selectAll("g.node").on('click', function () {
      const id = this.id;
      onClickNodeCallBack(id);
      d3.event.stopPropagation();
    });
  }

  render() {
    // console.log('__SelectedNodeID__', this.props.selectedNodeId);
    return (
      <div width="100%" style={{display:'inline-block'}}></div>
    );
  }
}

class HashTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addKeyValueCallback = this.addKeyValueCallback.bind(this);
    this.addNodeCallback = this.addNodeCallback.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onClickNodeCallBack = this.onClickNodeCallBack.bind(this);
    this.onColorChanged = this.onColorChanged.bind(this);
    this.onSvgUpdate = this.onSvgUpdate.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.removeNodeCallback = this.removeNodeCallback.bind(this);

    this.state = {
      selectedNodeId: -1,
      id: EducativeUtil.getKey(),
    };
  }

  componentDidMount() {
    if(this.props.mode == 'view') {
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
    if(this.props.mode == 'view') {
      this.setupVivusEffect();
    }
    else {
      if(this.state.selectedNodeId != -1){
        this.setNodeValueInInput();
      }
    }
  }

  addKeyValueCallback() {
    let node = this.findHashTableNode(this.state.selectedNodeId);

    if (!node) {
      return;
    }

    let nodeIndex = node.nodeIndex;
    let parentIndex = node.parentIndex;
    const nodes = this.props.content.nodes;
    let parentNode;

    if (parentIndex == -1) {
      parentNode = nodes[nodeIndex];
    }
    else {
      parentNode = nodes[parentIndex];
      nodeIndex = parentIndex;
    }

    let copyFrom = parentNode;
    let currNodeKeyList = parentNode.keyList;
    let length = currNodeKeyList.length;

    if (length > 0) {
      copyFrom = currNodeKeyList[length - 1];
    }

    let newNode = {
      id: `node_${String(EducativeUtil.getKey())}`,
      content: copyFrom.content,
      x: copyFrom.x,
      y: copyFrom.y,
      fillcolor: copyFrom.fillcolor,
      textcolor: copyFrom.textcolor,
      strokecolor: copyFrom.strokecolor,
    };

    this.props.updateContentState({
      nodes: [
        ...nodes.slice(0, nodeIndex),
        {...nodes[nodeIndex], keyList: [...currNodeKeyList, newNode]},
        ...nodes.slice(nodeIndex + 1),
      ],

      svg_string: null,
    });
  }

  addNodeCallback() {
    const nodes = this.props.content.nodes;
    const length = nodes.length;
    let newNode;

    if (length > 0) {
      const lastNode = nodes[length - 1];
      newNode = {
        id: `node_${String(EducativeUtil.getKey())}`,
        content: lastNode.content,
        x: lastNode.x,
        y: lastNode.y,
        fillcolor: lastNode.fillcolor,
        textcolor: lastNode.textcolor,
        strokecolor: lastNode.strokecolor,
        keyList: [],
      };
    }
    else {
      newNode = HashTable.getDefaultNodes()[0];
    }

    this.props.updateContentState({
      nodes: [...nodes, newNode],
      svg_string: null,
    });
  }

  changeDrawEffect() {
    this.props.updateContentState({draw_effect: !this.props.content.draw_effect});
  }

  clearSelection() {
    this.setState({selectedNodeId: -1});
  }

  findHashTableNode(node_id) {
    let nodes = this.props.content.nodes;

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id == node_id) {
        return new SelectedNodeObject(nodes[i], -1, i);
      }

      let keyList = nodes[i].keyList;

      for (let j = 0; j < keyList.length; ++j) {
        if (keyList[j].id == node_id) {
          return new SelectedNodeObject(keyList[j], i, j);
        }
      }
    }

    return null;
  }

  handleCaptionChange(caption) {
    this.props.updateContentState({caption});
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') { // return
      this.updateNodeValue(findDOMNode(this.nodeValueInputRef).value);
      this.clearSelection();
    }
    else if (e.key === 'Escape') {
      this.clearSelection();
    }
  }

  onClickNodeCallBack(node_id) {
    // console.log('____onClicked___', node_id);
    selectedHashTable = this.state.id;
    this.setState({
      selectedNodeId: node_id,
    });

    if (this.nodeValueInputRef) {
      const $input = findDOMNode(this.nodeValueInputRef);

      $input.focus();
      $input.select();
    }
  }

  onColorChanged(newColor) {
    let colorValue = newColor;
    if (colorValue.charAt(0) != '#') {
      colorValue = `#${colorValue}`;
    }

    // length must be >= 2 including #
    if (colorValue.length < 2) {
      return;
    }

    let node = this.findHashTableNode(this.state.selectedNodeId);

    if (!node) {
      return;
    }

    let nodeIndex = node.nodeIndex;
    let parentIndex = node.parentIndex;
    const nodes = this.props.content.nodes;

    if (parentIndex == -1) {
      if (nodes[nodeIndex].fillcolor != colorValue) {
        this.props.updateContentState({
          nodes: [
            ...nodes.slice(0, nodeIndex),
            {...nodes[nodeIndex], fillcolor: colorValue},
            ...nodes.slice(nodeIndex + 1),
          ],

          svg_string: null,
        });
      }
    }
    else {
      let parentNode = nodes[parentIndex];
      let parentNodeKeyList = parentNode.keyList;
      let currNode = parentNodeKeyList[nodeIndex];

      if (currNode.fillcolor != colorValue) {
        this.props.updateContentState({
          nodes: [
            ...nodes.slice(0, parentIndex),
            {
              ...parentNode,

              keyList: [
                ...parentNodeKeyList.slice(0, nodeIndex),
                {...currNode, fillcolor: colorValue},
                ...parentNodeKeyList.slice(nodeIndex + 1),
              ],
            },
            ...nodes.slice(parentIndex + 1),
          ],

          svg_string: null,
        });
      }
    }
  }

  onSvgUpdate(svg_string) {
    this.props.updateContentState({svg_string});
  }

  onValueChange(event) {
    this.updateNodeValue(event.target.value);
  }

  removeNodeCallback() {
    let node = this.findHashTableNode(this.state.selectedNodeId);

    if (!node) {
      return;
    }

    let nodeIndex = node.nodeIndex;
    let parentIndex = node.parentIndex;
    const nodes = this.props.content.nodes;
    let newNodes;

    if (parentIndex == -1) {
      if (nodes.length == 1 &&
          nodes[0].id == this.state.selectedNodeId) {
        newNodes = [];
      }
      else {
        newNodes = [
          ...nodes.slice(0, nodeIndex),
          ...nodes.slice(nodeIndex + 1),
        ];
      }
    }
    else {
      let parentNode = nodes[parentIndex];
      let parentNodeKeyList = parentNode.keyList;

      let newKeyList;

      if (parentNodeKeyList.length == 1 &&
          parentNodeKeyList[0] == this.state.selectedNodeId) {
        newKeyList = [];
      }
      else {
        newKeyList = [
          ...parentNodeKeyList.slice(0, nodeIndex),
          ...parentNodeKeyList.slice(nodeIndex + 1),
        ];
      }

      newNodes = [
        ...nodes.slice(0, parentIndex),
        {...parentNode, keyList: newKeyList},
        ...nodes.slice(parentIndex + 1),
      ];
    }

    this.state.selectedNodeId = -1;

    this.props.updateContentState({
      nodes: newNodes,
      svg_string: null,
    });
  }

  setNodeValueInInput() {
    if(this.nodeValueInputRef) {
      const selNode = this.findHashTableNode(this.state.selectedNodeId);
      if (selNode) {
        findDOMNode(this.nodeValueInputRef).value = selNode.object.content;
      }
    }
  }

  setupVivusEffect() {
    if(this.refs.dsRender && this.props.content.draw_effect){
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
    let node = this.findHashTableNode(this.state.selectedNodeId);

    if (!node) {
      return;
    }

    let nodeIndex = node.nodeIndex;
    let parentIndex = node.parentIndex;
    const nodes = this.props.content.nodes;

    if (parentIndex == -1) {
      if (nodes[nodeIndex].content != val) {
        this.props.updateContentState({
          nodes: [
            ...nodes.slice(0, nodeIndex),
            {...nodes[nodeIndex], content: val},
            ...nodes.slice(nodeIndex + 1),
          ],

          svg_string: null,
        });
      }
    }
    else {
      let parentNode = nodes[parentIndex];
      let parentNodeKeyList = parentNode.keyList;
      let currNode = parentNodeKeyList[nodeIndex];

      if (currNode.content != val) {
        this.props.updateContentState({
          nodes: [
            ...nodes.slice(0, parentIndex),
            {
              ...parentNode,

              keyList: [
                ...parentNodeKeyList.slice(0, nodeIndex),
                {...currNode, content: event.target.value},
                ...parentNodeKeyList.slice(nodeIndex + 1),
              ],
            },
            ...nodes.slice(parentIndex + 1),
          ],

          svg_string: null,
        });
      }
    }
  }

  render() {
    let addNodeBtn = null;
    const drawEffectBtn = null;
    const readOnly = (this.props.mode != 'edit');

    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    if (!readOnly) {
      addNodeBtn =
         <Button style={{marginLeft:5 }} sm outlined ref="addNodeButton" bsStyle='darkgreen45'
                  onClick={this.addNodeCallback}>
            <Icon glyph='fa fa-plus' style={{fontSize:15}}/>
            Append Key
          </Button>;

      let drawBtnClass = '';
      if(this.props.content.draw_effect == true) {
        drawBtnClass = '#2EB398';
      } else {
        drawBtnClass = 'darkgray';
      }
      let tooltip = <Tooltip id={"Enable draw effect"} placement="bottom">Click here to enable/disable draw effect</Tooltip>;
      // drawEffectBtn = <OverlayTrigger placement="bottom" overlay={tooltip}>
      //       <Button className='switch-button' style={{color:drawBtnClass}} onClick={this.changeDrawEffect}><Icon
      //         glyph='fa fa-pencil' style={{fontSize:22}}/></Button>
      //     </OverlayTrigger>
    }

    let nodeEditComponents =
      <div>
        {addNodeBtn}
        {drawEffectBtn}
        <span className='fg-darkgray40' style={{marginLeft:5}}>Click on elements to see options</span>
      </div>;

    let selectedNodeId = -1;

    if (!readOnly && this.state.selectedNodeId != -1 && this.state.id == selectedHashTable) {
      selectedNodeId = this.state.selectedNodeId;

      let selNodefillcolor = '#ffffff';
      let selNode = this.findHashTableNode(selectedNodeId);
      if (selNode) {
        selNodefillcolor = selNode.object.fillcolor;
      }
      else {
        console.log('Warning: Selected Node not found', selectedNodeId);
      }

      nodeEditComponents =
        <div style={{padding:1}}>
        {addNodeBtn}
        {drawEffectBtn}
          <FormControl  type='text' style={{marginLeft:8 , marginRight:8, width:'200px', display:'inline'}} ref={node => this.nodeValueInputRef = node}
                  onBlur={this.onValueChange} onKeyDown={this.handleKeyDown}/>
          <ColorPicker value={selNodefillcolor} onChange={this.onColorChanged}/>
          <Button style={{marginLeft:5 }} sm outlined ref="addKeyValueButton" bsStyle='darkgreen45'
                  onClick={this.addKeyValueCallback}>
            <Icon glyph='fa fa-plus' style={{fontSize:15}}/>
            Append Value
          </Button>
          <Button className='fg-darkgray75 delete-button' ref="removeNodeButton" onClick={this.removeNodeCallback}>
            <Icon glyph='fa fa-trash' style={{fontSize:22}}/>
          </Button>

          <div style={{display:'inline-block',float:'right',marginRight:8,marginTop:5}}>
            <a className='fg-darkgray75' style={{cursor:'pointer'}} onClick={this.clearSelection}>Close</a>
          </div>
        </div>;
    }

    let componentToolbar = null;
    if (!readOnly) {
      componentToolbar = <div className='edcomp-toolbar'> {nodeEditComponents} </div>;
    }

    let captionComponent = null;

    if (this.props.config == null || this.props.config.disableCaption == null || this.props.config.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.props.content.caption}
        readOnly={readOnly}
        onCaptionChange={this.handleCaptionChange}/>;
    }

    let displayHashTable = null;
    if (readOnly && this.props.content.hasOwnProperty('svg_string')) {
      let tempHtml = {__html: this.props.content.svg_string};
      let width = widgetUtil.parseSvgWidth(this.props.content.svg_string);
      let className = this.props.content.draw_effect ? 'ed-ds-render' : 'ed-ds-view';
      displayHashTable = <div ref='dsRender' className={className} dangerouslySetInnerHTML={tempHtml} style={{display:'block', maxWidth:width, margin: widgetUtil.getMargin(compAlign)}}/>

      this.state.selectedNodeId = -1;
    }
    else {
      displayHashTable = <EducativeHashTableD3 nodes={this.props.content.nodes} mode={this.props.mode}
                                       svg_string={this.props.content.svg_string}
                                       version={ this.props.content.version ? this.props.content.version : null}
                                       onClickNodeCallBack={this.onClickNodeCallBack} onSvgUpdate={this.onSvgUpdate}
                                       selectedNodeId={this.state.selectedNodeId}/>
    }

    return (
      <div>
        {componentToolbar}
        <div style={{textAlign:compAlign}}>
          <div style={{display:'block'}}>
            {displayHashTable}
          </div>
        </div>
        {captionComponent}
      </div>
    );
  }
}

HashTable.getComponentDefault = function () {
  const defaultContent = {
    version: '3.0',
    caption: '',
    svg_string: HashTable.getDefaultSvg(),
    draw_effect: false,
    nodes: HashTable.getDefaultNodes(),
  };
  return defaultContent;
};

HashTable.getDefaultNodes = function () {
  // Update svg_string if below nodes are modified.
  return [{
    id: 'node_0',
    content: "Key 1",
    x: "50",
    y: "20",
    fillcolor: "#bfefff",
    textcolor: "white",
    strokecolor: "#FF0000",

    keyList: [{
      id: 'node_0_1',
      content: "Val 1",
      x: "50",
      y: "20",
      fillcolor: "#e6e6e6",
      textcolor: "white",
      strokecolor: "#FF0000",
    }],
  }, {
    id: 'node_1',
    content: "Key 2",
    x: "50",
    y: "20",
    fillcolor: "#bfefff",
    textcolor: "white",
    strokecolor: "#FF0000",

    keyList: [{
      id: 'node_1_1',
      content: "Val 2",
      x: "50",
      y: "20",
      fillcolor: "#e6e6e6",
      textcolor: "white",
      strokecolor: "#FF0000",
    }, {
      id: 'node_1_2',
      content: "Val 3",
      x: "50",
      y: "20",
      fillcolor: "#e6e6e6",
      textcolor: "white",
      strokecolor: "#FF0000",
    }],
  }, {
    id: 'node_2',
    content: "Key 3",
    x: "50",
    y: "20",
    fillcolor: "#bfefff",
    textcolor: "white",
    strokecolor: "#FF0000",
    keyList: [],
  }];
};

HashTable.getDefaultSvg = function() {
  return "<svg width=\"331pt\" height=\"109pt\" viewBox=\"0.00 0.00 330.98 109.00\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"> <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 105)\"> <title>%19<\/title> <!-- node_2 --> <g id=\"node_2\" class=\"node\"><title>node_2<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.42\" points=\"0,-0.5 0,-30.5 123,-30.5 123,-0.5 0,-0.5\"><\/polygon> <text text-anchor=\"middle\" x=\"61.5\" y=\"-11.1\" font-family=\"Courier,monospace\" font-size=\"16.00\">Key 3<\/text> <\/g> <!-- node_1 --> <g id=\"node_1\" class=\"node\"><title>node_1<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.42\" points=\"0,-35.5 0,-65.5 123,-65.5 123,-35.5 0,-35.5\"><\/polygon> <text text-anchor=\"middle\" x=\"61.5\" y=\"-46.1\" font-family=\"Courier,monospace\" font-size=\"16.00\">Key 2<\/text> <\/g> <!-- node_1_1 --> <g id=\"node_1_1\" class=\"node\"><title>node_1_1<\/title> <path fill=\"#e6e6e6\" stroke=\"black\" stroke-width=\"0.5\" d=\"M168.067,-36.9C168.067,-36.9 213.925,-36.9 213.925,-36.9 218.459,-36.9 222.992,-41.4333 222.992,-45.9667 222.992,-45.9667 222.992,-55.0333 222.992,-55.0333 222.992,-59.5667 218.459,-64.1 213.925,-64.1 213.925,-64.1 168.067,-64.1 168.067,-64.1 163.533,-64.1 159,-59.5667 159,-55.0333 159,-55.0333 159,-45.9667 159,-45.9667 159,-41.4333 163.533,-36.9 168.067,-36.9\"><\/path> <text text-anchor=\"middle\" x=\"190.996\" y=\"-45.7\" font-family=\"Courier,monospace\" font-size=\"16.00\">Val 2<\/text> <\/g> <!-- node_1&#45;&gt;node_1_1 --> <g id=\"edge2\" class=\"edge\"><title>node_1-&gt;node_1_1<\/title> <path fill=\"none\" stroke=\"black\" d=\"M123.261,-50.5C133.651,-50.5 144.147,-50.5 153.642,-50.5\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"153.807,-52.2501 158.807,-50.5 153.807,-48.7501 153.807,-52.2501\"><\/polygon> <\/g> <!-- node_1_2 --> <g id=\"node_1_2\" class=\"node\"><title>node_1_2<\/title> <path fill=\"#e6e6e6\" stroke=\"black\" stroke-width=\"0.5\" d=\"M268.059,-36.9C268.059,-36.9 313.917,-36.9 313.917,-36.9 318.451,-36.9 322.984,-41.4333 322.984,-45.9667 322.984,-45.9667 322.984,-55.0333 322.984,-55.0333 322.984,-59.5667 318.451,-64.1 313.917,-64.1 313.917,-64.1 268.059,-64.1 268.059,-64.1 263.525,-64.1 258.992,-59.5667 258.992,-55.0333 258.992,-55.0333 258.992,-45.9667 258.992,-45.9667 258.992,-41.4333 263.525,-36.9 268.059,-36.9\"><\/path> <text text-anchor=\"middle\" x=\"290.988\" y=\"-45.7\" font-family=\"Courier,monospace\" font-size=\"16.00\">Val 3<\/text> <\/g> <!-- node_1_1&#45;&gt;node_1_2 --> <g id=\"edge1\" class=\"edge\"><title>node_1_1-&gt;node_1_2<\/title> <path fill=\"none\" stroke=\"black\" stroke-width=\"0.6\" d=\"M223.001,-50.5C231.759,-50.5 241.407,-50.5 250.588,-50.5\"><\/path> <polygon fill=\"#404040\" stroke=\"black\" stroke-width=\"0.6\" points=\"250.848,-53.3001 258.848,-50.5 250.848,-47.7001 250.848,-53.3001\"><\/polygon> <\/g> <!-- node_0 --> <g id=\"node_0\" class=\"node\"><title>node_0<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.42\" points=\"0,-70.5 0,-100.5 123,-100.5 123,-70.5 0,-70.5\"><\/polygon> <text text-anchor=\"middle\" x=\"61.5\" y=\"-81.1\" font-family=\"Courier,monospace\" font-size=\"16.00\">Key 1<\/text> <\/g> <!-- node_0_1 --> <g id=\"node_0_1\" class=\"node\"><title>node_0_1<\/title> <path fill=\"#e6e6e6\" stroke=\"black\" stroke-width=\"0.5\" d=\"M168.067,-71.9C168.067,-71.9 213.925,-71.9 213.925,-71.9 218.459,-71.9 222.992,-76.4333 222.992,-80.9667 222.992,-80.9667 222.992,-90.0333 222.992,-90.0333 222.992,-94.5667 218.459,-99.1 213.925,-99.1 213.925,-99.1 168.067,-99.1 168.067,-99.1 163.533,-99.1 159,-94.5667 159,-90.0333 159,-90.0333 159,-80.9667 159,-80.9667 159,-76.4333 163.533,-71.9 168.067,-71.9\"><\/path> <text text-anchor=\"middle\" x=\"190.996\" y=\"-80.7\" font-family=\"Courier,monospace\" font-size=\"16.00\">Val 1<\/text> <\/g> <!-- node_0&#45;&gt;node_0_1 --> <g id=\"edge3\" class=\"edge\"><title>node_0-&gt;node_0_1<\/title> <path fill=\"none\" stroke=\"black\" d=\"M123.261,-85.5C133.651,-85.5 144.147,-85.5 153.642,-85.5\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"153.807,-87.2501 158.807,-85.5 153.807,-83.7501 153.807,-87.2501\"><\/polygon> <\/g> <\/g> <\/svg>";
};

module.exports = HashTable;
