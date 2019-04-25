import styles from './animationViewer.module.scss';

import React, { Component, PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
const SVG = require('svg.js');

import { Btn, SomethingWithIcon, Icons } from '../index';

class AnimationViewer extends Component {
  constructor(props, context) {
    super(props, context);

    this.drawCurrentShape = this.drawCurrentShape.bind(this);
    this.initializeSVG = this.initializeSVG.bind(this);
    this.createSVGFromJSON = this.createSVGFromJSON.bind(this);
    this.handleReset = this.handleReset.bind(this);

    this.state = {
      draw_surface: null,
      current_shape: 0,
      reset: false,
      timer: null
    };
  }

  componentDidMount() {
    this.initializeSVG();
  }

  componentWillReceiveProps() {
    /*this.setState({
      reset: true
    });*/
  }

  componentDidUpdate() {
    if (this.state.reset) {
      this.handleReset();
    }
  }

  handleReset() {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }

    this.state.draw_surface.clear();

    this.setState({
      timer: null,
      reset: false,
      current_shape: 0
    }, this.drawCurrentShape);
  }

  initializeSVG() {
    let domNode = findDOMNode(this.refs.svg_render_area);
    this.state.draw_surface = SVG(domNode).spof();
    let draw = this.state.draw_surface;

    // To enable automatic sub-pixel offset correction when the window is resized:
    SVG.on(window, 'resize', function() { draw.spof() })

    domNode.style['max-width'] = this.props.animation.width + 'px';
    domNode.style['max-height'] = this.props.animation.height + 'px';

    this.state.draw_surface.viewbox(0, 0, this.props.animation.width, this.props.animation.height);

    this.drawCurrentShape();
  }

  draw_circle(draw, cjson) {
    let circle = draw.circle(cjson.radius * 2).attr(
      {
        "fill": cjson.fill,
        "fill-opacity": cjson.fill_opacity,
        "stroke": cjson.stroke,
        "stroke-opacity": cjson.stroke_opacity,
        "stroke-width": cjson.stroke_width,
        "cx": cjson.cx,
        "cy": cjson.cy
      });
  }

  draw_rect(draw, rjson) {
    let rect = draw.rect(rjson.width, rjson.height).attr(
      {
        "fill": rjson.fill,
        "fill-opacity": rjson.fill_opacity,
        "stroke": rjson.stroke,
        "stroke-opacity": rjson.stroke_opacity,
        "stroke-width": rjson.stroke_width,
        "x": rjson.x,
        "y": rjson.y
      });
  }

  draw_ellipse(draw, rjson) {
    // Treat rx and ry as width and height
    let ellipse = draw.ellipse(rjson.rx*2, rjson.ry*2).attr(
      {
        "fill": rjson.fill,
        "fill-opacity": rjson.fill_opacity,
        "stroke": rjson.stroke,
        "stroke-opacity": rjson.stroke_opacity,
        "stroke-width": rjson.stroke_width,
        "cx": rjson.cx,
        "cy": rjson.cy
      });
  }

  draw_line(draw, ljson) {
    var line = draw.line(ljson.x1, ljson.y1, ljson.x2, ljson.y2).attr(
      {
        "stroke": ljson.stroke,
        "stroke-opacity": ljson.stroke_opacity,
        "stroke-width": ljson.stroke_width,
        "x": ljson.x,
        "y": ljson.y
      });
  }

  draw_polygon(draw, pjson) {
    draw.polygon(pjson.points).attr(
      {
        "fill": pjson.fill,
        "fill-opacity": pjson.fill_opacity,
        "stroke": pjson.stroke,
        "stroke-opacity": pjson.stroke_opacity,
        "stroke-width": pjson.stroke_width
      });
  }

  print_SVG(draw) {
    console.log(draw.svg());
  }

  createSVGFromJSON(draw, shapes, current_shape, repeat) {
    let i = current_shape;
    for (; i < shapes.length; i++) {
      switch (shapes[i].type) {
        case 'circle':
          this.draw_circle(draw, shapes[i]);
          break;
        case 'rect':
          this.draw_rect(draw, shapes[i]);
          break;
        case 'line':
          this.draw_line(draw, shapes[i]);
          break;
        case 'ellipse':
          this.draw_ellipse(draw, shapes[i]);
          break;
        case 'polygon':
          this.draw_polygon(draw, shapes[i]);
          break;
        case 'printSVG':
          this.print_SVG(draw);
          break;
        case 'wait':
          const interval = shapes[i].interval;
          this.setState({
            current_shape : i + 1
          }, function triggerDrawShape() { this.state.timer = setTimeout( this.drawCurrentShape, interval);});
          return;
        case 'clear':
          draw.clear();
          draw.viewbox(0, 0, this.props.animation.width, this.props.animation.height);
          break;
        default:
          console.error('invalid shape found');
          break;
      }
    }

    if (i === shapes.length) {
      if (repeat) {
        this.setState({
          current_shape : 0
        }, function triggerReset() { this.state.timer = setTimeout(this.handleReset, 1000); });
      }
    }

    // Set the Viewbox
    //
  }


  drawCurrentShape() {
    this.createSVGFromJSON(this.state.draw_surface, this.props.animation.shapes, this.state.current_shape, this.props.animation.repeat);
  }

  render() {
    return (<div className={styles.ed_canvas_draw}>
              <Btn small default link onClick={this.handleReset} style={{ float:'right' }}>
                <SomethingWithIcon icon={Icons.repeatIcon}/>
              </Btn>
              <div ref="svg_render_area"></div>
            </div>);
  }
}

AnimationViewer.propTypes = {
  animation          : PropTypes.object
};

const sample_animation_json = {
  "shapes": [
      {
          "type": "circle",
          "fill": "red",
          "fill_opacity": 1,
          "radius": 50,
          "stroke": "black",
          "stroke_opacity": 1,
          "stroke_width": 1,
          "cx": 200,
          "cy": 50
      },
      {
          "type": "rect",
          "fill": "red",
          "fill_opacity": 1,
          "rx": 20,
          "ry": 20,
          "stroke": "black",
          "stroke_opacity": 1,
          "stroke_width": 3,
          "width": 100,
          "height": 25,
          "x": 50,
          "y": 38
      },
      {
          "type": "wait",
          "interval": 8000
      },
      {
          "type": "line",
          "stroke": "black",
          "stroke_opacity": 1,
          "stroke_width": 3,
          "x1": 10,
          "y1": 10,
          "x2": 30,
          "y2": 60
      },
      {
          "type": "wait",
          "interval": 8000
      },
      {
          "type": "clear"
      },
      {
          "type": "circle",
          "fill": "blue",
          "fill_opacity": 1,
          "radius": 50,
          "stroke": "black",
          "stroke_opacity": 1,
          "stroke_width": 1,
          "cx": 200,
          "cy": 50
      },
      {
          "type": "wait",
          "interval": 25
      },
      {
          "type": "wait",
          "interval": 25
      },
      {
          "type": "line",
          "stroke": "brown",
          "stroke_opacity": 1,
          "stroke_width": 3,
          "x1": 10,
          "y1": 10,
          "x2": 30,
          "y2": 60
      }
  ]
};

export default AnimationViewer;
