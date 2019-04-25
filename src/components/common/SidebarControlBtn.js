import React from 'react'

import Icon from './Icon'
import Dispatcher from './Dispatcher'

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.handleState = this.handleState.bind(this);

    this.state = {
      active: props.active || false,
    };
  }

  static propTypes = {
    sidebar: React.PropTypes.number.isRequired,
  };

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    Dispatcher.emit('sidebar:controlbtn', this.props);
    Dispatcher.emit('sidebar:keychange', this.props.sidebar);
  }

  handleState(props) {
    if(props.hasOwnProperty('sidebar')) {
      if(props.sidebar === this.props.sidebar) {
        this.setState({active: true});
      } else {
        this.setState({active: false});
      }
    }
  }

  componentDidMount() {
    Dispatcher.on('sidebar:controlbtn', this.handleState);
    const scrollToTop = function() {
      if($(window).scrollTop() === 0) return;
      setTimeout(function() {
        $('html, body, #body').scrollTop(0);
        $(window).scrollTop(0);
        scrollToTop();
      }, 15);
    };

    scrollToTop();
  }

  componentWillUnmount() {
    Dispatcher.off('sidebar:controlbtn', this.handleState);
  }

  render() {
    const classes = classnames({
      'sidebar-control-btn': true,
      active: this.state.active,
    });

    const props = {
      ...this.props,
      ...{
        tabIndex: '-1',
        className: [this.props.className, classes.trim()].join(' '),
        onClick: this.handleClick,
      },
    };
    
    return (
      <li {...props}>
        <a href='#' tabIndex='-1'>
          <Icon bundle={this.props.bundle} glyph={this.props.glyph}/>
        </a>
      </li>
    );
  }
};