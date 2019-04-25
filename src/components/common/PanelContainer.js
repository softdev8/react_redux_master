import React from 'react'
import {findDOMNode} from 'react-dom';
const Icon = require('./Icon');
const Button = require('./Button');
const PureMixin = require('react-pure-render/mixin');

import classnames from 'classnames';

const PanelContainer = React.createClass({
  propTypes: {
    bordered: React.PropTypes.bool,
    noControls: React.PropTypes.bool,
    gutterBottom: React.PropTypes.bool,
    collapseBottom: React.PropTypes.bool,
    controlStyles: React.PropTypes.string,
    containerStyles: React.PropTypes.string,
    plain: React.PropTypes.bool,
  },

  mixins: [PureMixin],

  statics: {
    zIndex: 9999999,

    getZIndex() {
      return --PanelContainer.zIndex;
    },
  },

  getInitialState() {
    return {
      removed: false,
      collapseIcon: 'minus',
      collapsed: this.props.collapsed || false,
    };
  },

  collapse(cb) {
    cb = typeof cb === 'function' ? cb : function() {};
    this.setState({
      collapsed: true,
      collapseIcon: 'plus',
    });
    const container = $(findDOMNode(this.refs.container));
    this.height = container.height();
    $(container).css('overflow', 'hidden');
    if(this.props.horizontal)
      $(container).css('display', 'block');
    $(container).animate({
      height: 16,
    }, 250, 'swing', cb);
  },

  expand(cb) {
    cb = typeof cb === 'function' ? cb : function() {};
    this.setState({
      collapsed: false,
      collapseIcon: 'minus',
    });
    const container = $(findDOMNode(this.refs.container));
    $(container).animate({
      height: this.height,
    }, 250, 'swing', () => {
      $(container).css({
        height: '',
        overflow: '',
      });
      if(this.props.horizontal)
        $(container).css('display', 'table');
      cb();
    });
  },

  height: 0,

  remove(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      removed: true,
    });
  },

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if(this.state.collapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  },

  render() {
    let controlClasses = 'rubix-panel-controls';
    let controls = null;
    if(this.props.controlStyles)
      controlClasses += ` ${this.props.controlStyles}`;

    let containerClasses = classnames({
      'rubix-panel-container': true,
      bordered: this.props.bordered,
      noOverflow: this.props.noOverflow,
      'panel-plain': this.props.plain,
      'panel-gutter-bottom': this.props.gutterBottom,
      'panel-collapse-bottom': this.props.collapseBottom,
    });

    if(this.props.containerClasses)
      containerClasses += ` ${this.props.containerClasses}`;

    if(this.props.plain)
      this.props.noControls = true;

    if(!this.props.noControls) {
      controls = (
        <div className={controlClasses}>
          <Button>
            <Icon bundle='fontello' glyph='loop-alt-1'/>
          </Button>
          <Button onClick={this.toggle} onTouchEnd={this.toggle}>
            <Icon bundle='fontello' glyph={this.state.collapseIcon}/>
          </Button>
          <Button onClick={this.remove} onTouchEnd={this.remove}>
            <Icon bundle='fontello' glyph='cancel'/>
          </Button>
        </div>
      );
    }

    if(this.props.customControls) {
      controls = (
        <div className={controlClasses}>
          {this.props.customControls}
        </div>
      );
    }

    if(this.state.removed) return null;

    var props = {
      ...this.props,
      ...{
        className: [this.props.className, `rubix-panel-container-with-controls ${this.state.collapsed ? 'active ': ' '}`].join(' '),

        style: {
          zIndex: PanelContainer.getZIndex(),
        },
      },
    };

    return (
      <div {...props}>
        {controls}
        <div ref='container' style={{overflow:'visible'}} className={containerClasses.trim()}>
          {this.props.children}
        </div>
      </div>
    );
  },
});

module.exports = PanelContainer;
