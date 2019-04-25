import React from 'react'
import {findDOMNode} from 'react-dom';
import classnames from 'classnames';

class MenuItem extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      active: (props.alwaysInactive ? false : (props.active || false)),
    };
  }

  componentWillMount() {
    if(this.props.active)
      this.props.parent.activeItem = this;
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.active) {
      this.deactivate();
    } else {
      this.props.parent.activeItem = this;
      this.activate(() => {
        this.focus();
      });
    }
  }

  activate(cb) {
    if(this.props.alwaysInactive) return;
    this.setState({active: true}, cb);
  }

  click() {
    if(this.refs.link) findDOMNode(this.refs.link).click();
  }

  deactivate(cb) {
    if(this.props.alwaysInactive) return;
    this.setState({active: false}, cb);
  }

  focus() {
    if(this.refs.link) findDOMNode(this.refs.link).focus();
  }

  handleClick(e) {
    if(!this.props.direct)
      e.preventDefault();
    e.preventDefault();
    e.stopPropagation();
    if(this.props.disabled)
      return;
    this.props.parent.activateItem(this.props.count, () => {
      this.props.parent.props.onItemSelect(this.props, this.props.parent);
      if(this.props.autoHide) {
        this.props.parent.hide();
      }
      this.activate();
    });
  }

  render() {
    if(this.props.header)
      return <li role='presentation' className='dropdown-header'>{this.props.children}</li>;
    if(this.props.divider)
      return <li role='presentation' className='divider'></li>;

    const classes = classnames({
      active: this.state.active,
      disabled: this.props.disabled,
    });

    if(this.props.noHover) {
      var props = {
        ...this.props,
        ...{
          role: 'presentation',
          className: [this.props.className, classes].join(' '),
        },
      };

      return (
        <li {...props}>
          {this.props.children}
        </li>
      );
    }

    var props = {
      ...this.props,
      ...{
        role: 'presentation',
        className: [this.props.className, classes].join(' '),
      },
    };

    return (
      <li ref='li' {...props}>
        <a ref='link' role='menuitem' tabIndex='-1' href={this.props.href ? this.props.href : null} onClick={this.handleClick} onTouchEnd={this.handleClick}>
          {this.props.children}
        </a>
      </li>
    );
  }
}

MenuItem.defaultProps = {
  autoHide: false,
  alwaysInactive: false,
};

MenuItem.propTypes = {
  focus: React.PropTypes.bool,
  direct: React.PropTypes.bool,
  header: React.PropTypes.bool,
  noHover: React.PropTypes.bool,
  divider: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  autoHide: React.PropTypes.bool,
  alwaysInactive: React.PropTypes.bool,
};

module.exports = MenuItem;
