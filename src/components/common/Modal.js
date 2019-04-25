import React from 'react'
import {findDOMNode} from 'react-dom';
import ModalManager from './ModalManager'

import style from './Modal.module.scss';

// TODO deprecate this
// when we will update to react-bootstrap
// with modales (header, foooter...)

import classnames from 'classnames';

class ModalFooter extends React.Component {
  render() {
    const props = {
      className: [this.props.className, 'modal-footer'].join(' '),
    };

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

class ModalBody extends React.Component {
  render() {
    const props = {
      className: [this.props.className, 'modal-body'].join(' '),
    };

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

class ModalHeader extends React.Component {
  render() {
    const props = {
      className: [this.props.className, 'modal-header'].join(' '),
    };

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

class Modal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      styles: {},
    };
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  bindEvents() {
    $('body').bind('click.modal', e => {
      if($(findDOMNode(this.refs.modal)).find(e.target).length)
        return;
      //e.preventDefault();
      //e.stopPropagation();
      this.close();
    });
    $('body').bind('keydown.modal', e => {
      //e.preventDefault();
      //e.stopPropagation();
      if(e.which === 27) { // escape
        this.close();
      }
    });
  }

  close() {
    this.props.onHide();
    this.unbindEvents();
    this.state.styles = {display: 'none'};
    this.setState(this.state, this.props.onHidden);
    ModalManager.remove();
  }

  open() {
    this.props.onShow();
    this.bindEvents();
    this.state.styles = {display: 'block'};
    this.setState(this.state, this.props.onShown);
    $('html, body').css('overflow', 'hidden');
  }

  unbindEvents() {
    $('body').unbind('click.modal');
    $('body').unbind('keydown.modal');
    $('body').removeClass('modal-open').find('>.modal-backdrop').remove()
  }

  render() {
    const modalDialogClasses = classnames({
      'modal-dialog': true,
      'modal-lg': this.props.lg,
      'modal-sm': this.props.sm,
    });

    const modalClasses = classnames({
      modal: true,
      fade: true,
      in: this.state.styles.display === 'block' ? true : false,
      out: this.state.styles.display === 'none' ? true : false,
    });

    const customClasses = classnames([
      this.props.fullscreen == true && style['modal-fullscreen']
    ]);

    var props = {
      role: 'dialog',
      tabIndex: '-1',
      style: this.state.styles,
      className: [this.props.className, modalClasses.trim(), customClasses.trim()].join(' '),
    };

    return (
      <div ref='modal' {...props}>
        <div className={modalDialogClasses.trim()}>
          <div className='modal-content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  onShow() {},
  onShown() {},
  onHide() {},
  onHidden() {},
};

Modal.propTypes = {
  lg: React.PropTypes.bool,
  sm: React.PropTypes.bool,
  onShow: React.PropTypes.func,
  onShown: React.PropTypes.func,
  onHide: React.PropTypes.func,
  onHidden: React.PropTypes.func,
};

module.exports.Modal = Modal;
module.exports.ModalBody = ModalBody;
module.exports.ModalHeader = ModalHeader;
module.exports.ModalFooter = ModalFooter;
