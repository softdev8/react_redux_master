import React from 'react'

const ColMixin = {
  classes: '',

  propTypes: {
    xs: React.PropTypes.number,
    sm: React.PropTypes.number,
    md: React.PropTypes.number,
    lg: React.PropTypes.number,
    className: React.PropTypes.string,
    collapseTop: React.PropTypes.bool,
    collapseLeft: React.PropTypes.bool,
    collapseRight: React.PropTypes.bool,
    collapseBottom: React.PropTypes.bool,
    clearfix: React.PropTypes.bool,
    hidden: React.PropTypes.string,
    visible: React.PropTypes.string,
    xsOffset: React.PropTypes.number,
    smOffset: React.PropTypes.number,
    mdOffset: React.PropTypes.number,
    lgOffset: React.PropTypes.number,
    xsPush: React.PropTypes.number,
    smPush: React.PropTypes.number,
    mdPush: React.PropTypes.number,
    lgPush: React.PropTypes.number,
    xsPull: React.PropTypes.number,
    smPull: React.PropTypes.number,
    mdPull: React.PropTypes.number,
    lgPull: React.PropTypes.number,
  },

  hyphenate(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },

  camelCase(str) {
    return str.toLowerCase().replace(/-([a-z])/g, function(g) {return g[1].toUpperCase();});
  },

  hyphenateColClass(prop) {
    return `col-${this.hyphenate(prop)} `;
  },

  hyphenateColClassWithValue(prop) {
    return `${this.hyphenateColClass(prop).trim()}-${this.props[prop]} `;
  },

  preRender() {
    var classes = '';
    const sizes = {};
    const collapse = {};
    const gutter = {};
    for(let prop in this.props) {
      switch(prop) {
        case 'xs':
        case 'sm':
        case 'md':
        case 'lg':
          sizes[prop] = 1;
          classes += this.hyphenateColClassWithValue(prop);
          break;
        case 'collapseTop':
        case 'collapseLeft':
        case 'collapseRight':
        case 'collapseBottom':
          collapse[prop] = 1;
          break;
        case 'gutterTop':
        case 'gutterLeft':
        case 'gutterRight':
        case 'gutterBottom':
          gutter[prop] = 1;
          break;
        case 'clearfix':
          classes += 'clearfix ';
          break;
        case 'hidden':
        case 'visible':
          var classes;
          const classeses = this.props[prop].split(',');
          for(let i=0; i < classeses.length; i++) {
            classes += `${prop}-${classeses[i].trim()} `;
          }
          break;
        case 'children':
          // do nothing
          break;
        default:
          if((prop.search('Gutter') !== -1) || (prop.search('Collapse') !== -1)) {
            classes += this.hyphenateColClass(prop);
          } else if((prop.search('Offset') !== -1) || (prop.search('Push') !== -1) || (prop.search('Pull') !== -1)) {
            classes += this.hyphenateColClassWithValue(prop);
          }
          break;
      }
    }

    for(var dir in collapse) {
      dir = this.hyphenate(dir);
      for(var size in sizes)
        classes += this.hyphenateColClass(this.camelCase(`${size}-${dir}`));
    }

    for(var dir in gutter) {
      dir = this.hyphenate(dir);
      for(var size in sizes)
        classes += this.hyphenateColClass(this.camelCase(`${size}-${dir}`));
    }

    this.classes = classes;
  },
};

module.exports = ColMixin;
