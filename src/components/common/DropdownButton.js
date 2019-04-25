import React from 'react'
import {findDOMNode} from 'react-dom';

const Button = require('./Button');

import classnames from 'classnames';

class DropdownButton extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);

    this.state = {
      pressed: false,
    };
  }

  componentDidMount() {
    // TODO fix this
    if (this.props.container.refs[this.props.menu]) {
      this.props.container.refs[this.props.menu].setToggle(this);
    }
  }

  focus() {
    try {
      this.refs.button.focus();
    } catch (e) {
      findDOMNode(this.refs.button).focus();
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const menu = this.props.container.refs[this.props.menu];
    if (this.pressed()) {
      menu.hide();
    } else {
      this.press(function () {
        menu.show();
      });
    }
  }

  handleMouseOut(e) {
    e.preventDefault();
    e.stopPropagation();
    const menu = this.props.container.refs[this.props.menu];
    this.unpress();
    //menu.hide();
  }

  handleMouseOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const menu = this.props.container.refs[this.props.menu];
    this.press();
    menu.show();
  }

  press(cb) {
    $(findDOMNode(this.refs.button)).parents('.dropdown, .b-tab').addClass('open').addClass('active');
    this.setState({
      pressed: true,
    }, cb);
  }

  pressed() {
    return this.state.pressed;
  }

  unpress(cb) {
    const parents = $(findDOMNode(this.refs.button)).parents('.dropdown, .b-tab').removeClass('open');
    if (!parents.find('.active').length) {
      parents.removeClass('active');
    }
    this.setState({
      pressed: false,
    }, cb);
  }

  render() {
    const classes = classnames({
      'dropdown-toggle': true,
      active: this.state.pressed,
    });

    if (this.props.tab || this.props.nav) {
      var props = {
        ...this.props,
        ...{
          href: '#',
          ref: 'button',
          className: [this.props.className, classes].join(' '),
          'data-toggle': 'dropdown',
          onClick: this.handleClick,
          onTouchEnd: this.handleClick,
          onMouseOver: this.props.toggleOnHover ? this.handleMouseOver : null,
          onMouseOut: this.props.toggleOnHover ? this.handleMouseOut : null,
        },
      };

      return (
        <a {...props}>
          {this.props.children}
        </a>
      );
    }

    var props = {
      ...this.props,
      ...{
        ref: 'button',
        type: 'button',
        className: [this.props.className, classes].join(' '),
        'data-toggle': 'dropdown',
        onClick: this.handleClick,
        onTouchEnd: this.handleClick,
        onMouseOver: this.props.toggleOnHover ? this.handleMouseOver : null,
        onMouseOut: this.props.toggleOnHover ? this.handleMouseOut : null,
      },
    };

    return (
      <Button {...props}>
        {this.props.children}
      </Button>
    );
  }
}

DropdownButton.propTypes = {
  menu: React.PropTypes.string.isRequired,
  container: React.PropTypes.object.isRequired,
};

module.exports = DropdownButton;
