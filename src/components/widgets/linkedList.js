import React from 'react'
import {findDOMNode} from 'react-dom';
import * as widgetUtil from '../helpers/widgetUtil';
import {SomethingWithIcon, Icons} from '../index';

const ColorPicker = require('../common/colorpicker');
const CaptionComponent = require('../CaptionComponent/CaptionComponent');
const Button = require('../common/Button');
const EducativeUtil = require('../common/ed_util');
const Vivus = require('vivus');
const PureMixin = require('react-pure-render/mixin');

import {FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';

let selectedLinkedList = null;

const LinkedListD3 = React.createClass({
  mixins: [PureMixin],

  getInitialState() {
    return {
      prevSelectedNodeId: -1,
    };
  },

  componentDidMount() {
    this.createLinkedList();
    this.setClickHandlers();
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      prevSelectedNodeId: this.props.selectedNodeId,
    });
  },

  componentDidUpdate() {
    this.createLinkedList();
    this.setClickHandlers();
    this.applySelectedNodeStyle();
  },

  applySelectedNodeStyle() {
    if (this.props.mode != "edit") {
      return;
    }

    const dom = findDOMNode(this);

    // reset styling on previously selected node.
    if (this.state.prevSelectedNodeId != -1 &&
        this.state.prevSelectedNodeId != this.props.selectedNodeId) {
      const tempNode = this.findNode(this.state.prevSelectedNodeId);
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
  },

  createGraphvizCodeString() {
    const nodes = this.props.nodes;
    let graph_string = 'rankdir=LR; node [fontname = "courier", fontsize=16]; bgcolor="transparent";';
    let style = 'filled';
    const node_format_string = '{0}[id="{0}" label="{1}" stroke="{2}" fillcolor="{3}" style="{4}" shape={5} width=0.4 height=0.4, penwidth=0.5];';

    let lastNodeKey = null;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      style = 'filled';

      let content;
      if (!this.props.version || this.props.version == '1.0') {
        content = node.content;
      }
      else {
        content = EducativeUtil.escapeGraphvizLabels(node.content);
      }
      const nodeContent = content == "" ? " " : content;

      graph_string += node_format_string.format(node.id, nodeContent, node.fillcolor, node.fillcolor, style, "Mrecord");
      lastNodeKey = node.id;
    }

    const edge_format_string = "{0}->{1}[arrowsize=0.8, penwidth=0.6, fillcolor=gray25, stroke=gray25];";
    let prev = null;
    for (let i = 0; i < nodes.length; i++) {
      if (prev != null) {
        graph_string += edge_format_string.format(prev, nodes[i].id);
      }
      prev = nodes[i].id;
    }

    graph_string = `digraph {${graph_string}}`;
    return graph_string;
  },

  createLinkedList() {
    let svgString;

    if (!this.props.svg_string) {
      // console.log('________Generating SVG String_______*******_______');
      const graph_string = this.createGraphvizCodeString();
      svgString = widgetUtil.generateSvgFromGraphviz(graph_string);
    }
    else {
      svgString = this.props.svg_string;
      // console.log('________Generating SVG String_______SKIPPED_______');
    }

    const dom = findDOMNode(this);
    dom.innerHTML = svgString;
    this.props.onSvgUpdate(svgString);
  },

  findNode(nodeId) {
    const nodes = this.props.nodes;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id == nodeId) {
        return node;
      }
    }

    return null;
  },

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
  },

  setClickHandlers() {
    if (this.props.mode != "edit") {
      return;
    }

    const onClickNodeCallback = this.props.onClickNodeCallback;
    const domElement = d3.select(findDOMNode(this));
    domElement.selectAll("g.node").on('click', function () {
      const id = this.id;
      onClickNodeCallback(id);
      d3.event.stopPropagation();
    });
  },

  render() {
    return (
      <div width="100%" style={{display:'inline-block'}}></div>
    );
  },
});

class LinkedList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addNodeCallback = this.addNodeCallback.bind(this);
    this.changeDrawEffect = this.changeDrawEffect.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onClickNodeCallback = this.onClickNodeCallback.bind(this);
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
    if(this.props.mode == 'view'){
      this.setupVivusEffect();
    } else {
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
    } else {
      if(this.state.selectedNodeId != -1){
        this.setNodeValueInInput();
      }
    }
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
      };
    }
    else {
      newNode = LinkedList.getDefaultNodes()[0];
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

  findNodeIndex(node_id) {
    for (let i = 0; i < this.props.content.nodes.length; i++) {
      if (this.props.content.nodes[i].id == node_id) {
        return i;
      }
    }
    return -1;
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

  onClickNodeCallback(node_id) {
    selectedLinkedList = this.state.id;
    this.setState({selectedNodeId: node_id});

    if (this.nodeValueInputRef) {
      const $input = findDOMNode(this.nodeValueInputRef);

      $input.focus();
      $input.select();
    }
  }

  onColorChanged(colorValue) {
    if (colorValue.charAt(0) != '#') {
      colorValue = `#${colorValue}`;
    }

    // length must be >= 2 including #
    if (colorValue.length < 2) {
      return;
    }

    const selectedNodeIndex = this.findNodeIndex(this.state.selectedNodeId);
    const nodes = this.props.content.nodes;

    if (nodes[selectedNodeIndex].fillcolor != colorValue) {
      this.props.updateContentState({
        nodes: [
          ...nodes.slice(0, selectedNodeIndex),
          {...nodes[selectedNodeIndex], fillcolor: colorValue},
          ...nodes.slice(selectedNodeIndex + 1),
        ],

        svg_string: null,
      });
    }
  }

  onSvgUpdate(svg_string) {
    this.props.updateContentState({svg_string});
  }

  onValueChange(event) {
    this.updateNodeValue(event.target.value);
  }

  removeNodeCallback() {
    const nodeIndex = this.findNodeIndex(this.state.selectedNodeId);
    const nodes = this.props.content.nodes;

    let newNodes;
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

    this.state.selectedNodeId = -1;

    this.props.updateContentState({
      nodes: newNodes,
      svg_string: null,
    });
  }

  setNodeValueInInput() {
    if(this.nodeValueInputRef) {
      const selectedNodeIndex = this.findNodeIndex(this.state.selectedNodeId);
      findDOMNode(this.nodeValueInputRef).value= this.props.content.nodes[selectedNodeIndex].content;
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
    const nodeIndex = this.findNodeIndex(this.state.selectedNodeId);
    const nodes = this.props.content.nodes

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

  render() {
    let addNodeBtn = null;
    let drawEffectBtn = null;
    const readOnly = (this.props.mode != 'edit');

    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    if (!readOnly) {
      addNodeBtn =
         <Button className='btn-append-node' style={{marginLeft:5 }} sm outlined ref="addNodeButtonRight" bsStyle='darkgreen45'
                  onClick={this.addNodeCallback}>
            <SomethingWithIcon icon={Icons.thinPlus1}/>
             Append Node
          </Button>;

      let drawBtnClass = '';
      if(this.props.content.draw_effect == true){
        drawBtnClass = '#2EB398';
      } else {
        drawBtnClass = 'darkgray';
      }
      let tooltip = <Tooltip id={"enable draw effect"} placement="bottom">Click here to enable/disable draw effect</Tooltip>;
      drawEffectBtn = <OverlayTrigger placement="bottom" overlay={tooltip}>
            <Button className='switch-button' style={{color:drawBtnClass}} onClick={this.changeDrawEffect}>
              <SomethingWithIcon icon={Icons.thickPencilIcon}/>
            </Button>

          </OverlayTrigger>;
    }

    let nodeEditComponents =
      <div>
        {addNodeBtn}
        {drawEffectBtn}
        <span className='fg-darkgray40' style={{marginLeft:5}}>Click on linked list nodes to see options</span>
      </div>;

    let selectedNodeId = -1;

    if (!readOnly && this.state.selectedNodeId != -1 && this.state.id == selectedLinkedList) {
      selectedNodeId = this.state.selectedNodeId;
      const selectedNodeIndex = this.findNodeIndex(selectedNodeId);

      nodeEditComponents =
        <div style={{padding:1}}>
          {addNodeBtn}
          {drawEffectBtn}
          <FormControl type='text' style={{marginLeft:8 , marginRight:8, width:'200px', display:'inline'}} ref={node => this.nodeValueInputRef = node}
              onBlur={this.onValueChange} onKeyDown={this.handleKeyDown}/>
          <ColorPicker value={this.props.content.nodes[selectedNodeIndex].fillcolor} onChange={this.onColorChanged}/>
            <Button className='fg-darkgray75 delete-button' ref="removeNodeButton" onClick={this.removeNodeCallback}>
              <SomethingWithIcon icon={Icons.trashIcon}/>
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

    let displayList = null;
    if (readOnly && this.props.content.hasOwnProperty('svg_string')) {
      let tempHtml = {__html: this.props.content.svg_string};
      let width = widgetUtil.parseSvgWidth(this.props.content.svg_string);
      let className = this.props.content.draw_effect ? 'ed-ds-render' : 'ed-ds-view';
      displayList = <div ref='dsRender' className={className} dangerouslySetInnerHTML={tempHtml} style={{display:'block', maxWidth:width, margin: widgetUtil.getMargin(compAlign)}}/>

      this.state.selectedNodeId = -1;
    }
    else {
      displayList = <LinkedListD3 nodes={this.props.content.nodes} mode={this.props.mode}
                                  svg_string={this.props.content.svg_string}
                                  version={ this.props.content.version ? this.props.content.version : null}
                                  onClickNodeCallback={this.onClickNodeCallback} onSvgUpdate={this.onSvgUpdate}
                                  selectedNodeId={selectedNodeId}/>
    }

    return (
      <div>
        {componentToolbar}
        <div style={{textAlign:compAlign}}>
          <div style={{display:'block'}}>
            {displayList}
          </div>
        </div>
        {captionComponent}
      </div>
    );
  }
}

LinkedList.getComponentDefault = function() {
  const defaultContent = {
    version: '3.0',
    caption: '',
    svg_string: LinkedList.getDefaultSvg(),
    draw_effect: false,
    nodes: LinkedList.getDefaultNodes(),
  };
  return defaultContent;
};

LinkedList.getDefaultNodes = function() {
  // Update getDefaultSvg if below nodes are modified.
  return [{
    id: 'node_1',
    content: "1",
    x: "50",
    y: "20",
    fillcolor: "#bfefff",
    textcolor: "white",
    strokecolor: "#FF0000",
  }, {
    id: 'node_2',
    content: "2",
    x: "50",
    y: "20",
    fillcolor: "#bfefff",
    textcolor: "white",
    strokecolor: "#FF0000",
  }, {
    id: 'node_3',
    content: "3",
    x: "50",
    y: "20",
    fillcolor: "#bfefff",
    textcolor: "white",
    strokecolor: "#FF0000",
  }];
};

LinkedList.getDefaultSvg = function() {
  return "<svg width=\"170pt\" height=\"38pt\" viewBox=\"0.00 0.00 170.00 38.00\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"> <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 34)\"> <title>%3<\/title> <!-- node_1 --> <g id=\"node_1\" class=\"node\"><title>node_1<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M10.1667,-0.5C10.1667,-0.5 19.8333,-0.5 19.8333,-0.5 24.6667,-0.5 29.5,-5.33333 29.5,-10.1667 29.5,-10.1667 29.5,-19.8333 29.5,-19.8333 29.5,-24.6667 24.6667,-29.5 19.8333,-29.5 19.8333,-29.5 10.1667,-29.5 10.1667,-29.5 5.33333,-29.5 0.5,-24.6667 0.5,-19.8333 0.5,-19.8333 0.5,-10.1667 0.5,-10.1667 0.5,-5.33333 5.33333,-0.5 10.1667,-0.5\"><\/path> <text text-anchor=\"middle\" x=\"15\" y=\"-10.6\" font-family=\"Courier,monospace\" font-size=\"16.00\">1<\/text> <\/g> <!-- node_2 --> <g id=\"node_2\" class=\"node\"><title>node_2<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M76.1667,-0.5C76.1667,-0.5 85.8333,-0.5 85.8333,-0.5 90.6667,-0.5 95.5,-5.33333 95.5,-10.1667 95.5,-10.1667 95.5,-19.8333 95.5,-19.8333 95.5,-24.6667 90.6667,-29.5 85.8333,-29.5 85.8333,-29.5 76.1667,-29.5 76.1667,-29.5 71.3333,-29.5 66.5,-24.6667 66.5,-19.8333 66.5,-19.8333 66.5,-10.1667 66.5,-10.1667 66.5,-5.33333 71.3333,-0.5 76.1667,-0.5\"><\/path> <text text-anchor=\"middle\" x=\"81\" y=\"-10.6\" font-family=\"Courier,monospace\" font-size=\"16.00\">2<\/text> <\/g> <!-- node_1&#45;&gt;node_2 --> <g id=\"edge1\" class=\"edge\"><title>node_1-&gt;node_2<\/title> <path fill=\"none\" stroke=\"black\" stroke-width=\"0.6\" d=\"M29.5728,-15C37.8882,-15 48.722,-15 58.2156,-15\"><\/path> <polygon fill=\"#404040\" stroke=\"black\" stroke-width=\"0.6\" points=\"58.4468,-17.8001 66.4468,-15 58.4468,-12.2001 58.4468,-17.8001\"><\/polygon> <\/g> <!-- node_3 --> <g id=\"node_3\" class=\"node\"><title>node_3<\/title> <path fill=\"#bfefff\" stroke=\"black\" stroke-width=\"0.5\" d=\"M142.167,-0.5C142.167,-0.5 151.833,-0.5 151.833,-0.5 156.667,-0.5 161.5,-5.33333 161.5,-10.1667 161.5,-10.1667 161.5,-19.8333 161.5,-19.8333 161.5,-24.6667 156.667,-29.5 151.833,-29.5 151.833,-29.5 142.167,-29.5 142.167,-29.5 137.333,-29.5 132.5,-24.6667 132.5,-19.8333 132.5,-19.8333 132.5,-10.1667 132.5,-10.1667 132.5,-5.33333 137.333,-0.5 142.167,-0.5\"><\/path> <text text-anchor=\"middle\" x=\"147\" y=\"-10.6\" font-family=\"Courier,monospace\" font-size=\"16.00\">3<\/text> <\/g> <!-- node_2&#45;&gt;node_3 --> <g id=\"edge2\" class=\"edge\"><title>node_2-&gt;node_3<\/title> <path fill=\"none\" stroke=\"black\" stroke-width=\"0.6\" d=\"M95.5728,-15C103.888,-15 114.722,-15 124.216,-15\"><\/path> <polygon fill=\"#404040\" stroke=\"black\" stroke-width=\"0.6\" points=\"124.447,-17.8001 132.447,-15 124.447,-12.2001 124.447,-17.8001\"><\/polygon> <\/g> <\/g> <\/svg>";
};

module.exports = LinkedList;
