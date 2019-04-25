import React from 'react'
import {findDOMNode} from 'react-dom';
import '../../utils';
import * as widgetUtil from '../helpers/widgetUtil';

const ColorPicker = require('../common/colorpicker');
const CaptionComponent = require('../CaptionComponent/CaptionComponent');
const Button = require('../common/Button');
const EducativeUtil = require('../common/ed_util');
const Vivus = require('vivus');
const PureMixin = require('react-pure-render/mixin');

import {FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {SomethingWithIcon, Icons} from '../index';

let selectedArray = null;

const EducativeArray3D = React.createClass({
  mixins: [PureMixin],

  getInitialState() {
    return {
      prevSelectedNodeId: -1,
    };
  },

  componentDidMount() {
    this.createEducativeArray();
    this.setClickHandlers();
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      prevSelectedNodeId: this.props.selectedNodeId,
    });
  },

  componentDidUpdate() {
    this.createEducativeArray();
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
        var nodeToSelect = $(dom).find(selectedNodeIdValue).find("polygon");
        nodeToSelect.attr("fill", rgb_string);
        nodeToSelect.attr("stroke", "rgb(0, 0, 0)");
        nodeToSelect.attr("stroke-width", "0.5px");
        nodeToSelect.attr("stroke-dasharray", "none");
      }
    }

    // apply styling on selected node.
    if (this.props.selectedNodeId != -1) {
      var selectedNodeIdValue = `#${this.props.selectedNodeId}`;
      var nodeToSelect = $(dom).find(selectedNodeIdValue).find("polygon");
      nodeToSelect.attr("stroke", "rgb(0, 0, 0)");
      nodeToSelect.attr("stroke-width", "1.5px");
      nodeToSelect.attr("stroke-dasharray", "5px, 2px");
    }
  },

  createEducativeArray() {
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
  },

  // digraph g{
  //   node[shape="record"];
  //   nodesep=0.0;
  //   a;b;c;e;d;f;
  // }
  createGraphvizCodeString() {
    const nodes = this.props.nodes;
    let graph_string = 'node [fontname = "courier", fontsize=16]; nodesep=0.0;  bgcolor="transparent";';
    let style = 'filled';
    const node_format_string = '{0}[id="{0}" label="{1}" color="{2}" fillcolor="{3}" style="{4}" shape={5} width=0.4 height=0.4, penwidth=0.5];';

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      style = 'filled';
      node.color = "#000000"; // use black as default border till we give an option to modify it.

      let content;
      if (!this.props.version || this.props.version == '1.0') {
        content = node.content;
      }
      else {
        content = EducativeUtil.escapeGraphvizLabels(node.content);
      }
      const nodeContent = content == "" ? " " : content;

      graph_string += node_format_string.format(node.id, nodeContent, node.color, node.fillcolor, style, "record");
    }

    graph_string = `digraph {${graph_string}}`;
    return graph_string;
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

    const onClickNodeCallBack = this.props.onClickNodeCallBack;
    const domElement = d3.select(findDOMNode(this));
    domElement.selectAll("g.node").on('click', function () {
      const id = this.id;
      onClickNodeCallBack(id);
      d3.event.stopPropagation();
    });
  },

  render() {
    return (
      <div width="100%" style={{display:'inline-block'}}></div>
    );
  },
});

class EducativeArray extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addNodeCallback = this.addNodeCallback.bind(this);
    this.changeDrawEffect = this.changeDrawEffect.bind(this);
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
    if(this.props.mode == 'view'){
      this.setupVivusEffect();
    } else {
      if (this.state.selectedNodeId != -1) {
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
      if (this.state.selectedNodeId != -1) {
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
      newNode = EducativeArray.getDefaultNodes()[0];
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
    if (e.key === 'Enter') { // return
      this.updateNodeValue(findDOMNode(this.nodeValueInputRef).value);
      this.clearSelection();
    } else if (e.key === 'Escape') {
      this.clearSelection();
    } else {
      return;
    }
  }

  onClickNodeCallBack(node_id) {
    selectedArray = this.state.id;
    this.setState({selectedNodeId: node_id});

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
      findDOMNode(this.nodeValueInputRef).value = this.props.content.nodes[selectedNodeIndex].content;
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
    const nodes = this.props.content.nodes;

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
    let selectedNodeId = -1;
    let addNodeBtn = null;
    let componentToolbar = null;
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
            Append Element
          </Button>;

      let drawBtnClass = '';
      if(this.props.content.draw_effect == true){
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

    let nodeEditComponents =
      <div>
        {addNodeBtn}
        {drawEffectBtn}
        <span className='fg-darkgray40' style={{marginLeft:5}}>Click on array elements to see options</span>
      </div>;

    if (!readOnly && this.state.selectedNodeId != -1 && this.state.id == selectedArray) {
      selectedNodeId = this.state.selectedNodeId;
      const selectedNodeIndex = this.findNodeIndex(selectedNodeId);

      nodeEditComponents =
        <div style={{padding:1}}>
          {addNodeBtn}
          {drawEffectBtn}
          <FormControl style={{marginLeft:8 , marginRight:8, width:'200px', display:'inline'}} ref={node => this.nodeValueInputRef = node}
              onBlur={this.onValueChange} onKeyDown={this.handleKeyDown}/>
          <ColorPicker value={this.props.content.nodes[selectedNodeIndex].fillcolor} onChange={this.onColorChanged}/>
          <Button className='fg-darkgray75 delete-button' ref="removeNodeButton" onClick={this.removeNodeCallback}>
            <SomethingWithIcon icon={Icons.trashIcon}/>
          </Button>

          <div style={{display:'inline-block',float:'right',marginRight:8,marginTop:5}}><a className='fg-darkgray75'
                                                                                           style={{cursor:'pointer'}}
                                                                                           onClick={this.clearSelection}>Close</a>
          </div>
        </div>;
    }

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

    let displayArray = null;
    if (readOnly && this.props.content.hasOwnProperty('svg_string')) {
      //<img className="figure" src={"data:image/svg+xml," + this.props.content.svg_string}></img>
      ////        <img className="ed-ds-figure" src={"data:image/svg+xml," + encodeURIComponent(this.props.content.svg_string)}></img></div>;

      let tempHtml = {__html: this.props.content.svg_string};
      let width = widgetUtil.parseSvgWidth(this.props.content.svg_string);
      let className = this.props.content.draw_effect ? 'ed-ds-render' : 'ed-ds-view';
      displayArray = <div ref='dsRender' className={className} dangerouslySetInnerHTML={tempHtml} style={{display:'block', maxWidth:width, margin: widgetUtil.getMargin(compAlign)}}/>
      this.state.selectedNodeId = -1;
    }
    else {
      displayArray = <EducativeArray3D nodes={this.props.content.nodes} mode={this.props.mode}
                                       svg_string={this.props.content.svg_string}
                                       version={this.props.content.version ? this.props.content.version : null}
                                       onClickNodeCallBack={this.onClickNodeCallBack} onSvgUpdate={this.onSvgUpdate}
                                       selectedNodeId={selectedNodeId}/>
    }

    return (
      <div>
        {componentToolbar}
        <div style={{textAlign:compAlign}}>
          <div  style={{display:'block'}}>
            {displayArray}
          </div>
        </div>
        {captionComponent}
      </div>
    );
  }
}

EducativeArray.getComponentDefault = function() {
  const defaultContent = {
    version: '3.0',
    caption: '',
    svg_string: EducativeArray.getDefaultSvg(),
    draw_effect: false,

    // NOTE: ALWAYS update svg_string if below nodes are modified.
    nodes: EducativeArray.getDefaultNodes(),
  };
  return defaultContent;
};

EducativeArray.getDefaultNodes = function() {
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

EducativeArray.getDefaultSvg = function() {
  return "<svg width=\"96pt\" height=\"38pt\" viewBox=\"0.00 0.00 96.00 38.00\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"> <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 34)\"> <title>%3<\/title> <!-- node_1 --> <g id=\"node_1\" class=\"node\"><title>node_1<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.5\" points=\"-0.5,-0.5 -0.5,-29.5 28.5,-29.5 28.5,-0.5 -0.5,-0.5\"><\/polygon> <text text-anchor=\"middle\" x=\"13.7992\" y=\"-10.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">1<\/text> <\/g> <!-- node_2 --> <g id=\"node_2\" class=\"node\"><title>node_2<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.5\" points=\"29.5,-0.5 29.5,-29.5 58.5,-29.5 58.5,-0.5 29.5,-0.5\"><\/polygon> <text text-anchor=\"middle\" x=\"43.7992\" y=\"-10.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">2<\/text> <\/g> <!-- node_3 --> <g id=\"node_3\" class=\"node\"><title>node_3<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.5\" points=\"59.5,-0.5 59.5,-29.5 88.5,-29.5 88.5,-0.5 59.5,-0.5\"><\/polygon> <text text-anchor=\"middle\" x=\"73.7992\" y=\"-10.2\" font-family=\"Courier,monospace\" font-size=\"16.00\">3<\/text> <\/g> <\/g> <\/svg>";
};

module.exports = EducativeArray;
