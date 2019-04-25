'use strict';

// External
import React, {Component, PropTypes} from 'react'
import сlassNames from 'classnames'
import PortalDecorator from '../../decorators/PortalDecorator'

export default class Input extends Component {
  constructor() {
    super();
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  static propTypes = {
    content: PropTypes.string.isRequired,
    pending: PropTypes.bool.isRequired,
    annotationSave: PropTypes.func,
    annotationCancel: PropTypes.func,
  };

  // Listen for props in order to overwrite visible viewer with prop
  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.content || this.state.value});
  }

  handleChange() {
    this.setState({value: event.target.value});
  }

  handleSaveClick(e) {
    e.stopPropagation();
    this.props.annotationSave({content: this.state.value, size: this.props.size});
  }

  handleCancelClick(e) {
    e.stopPropagation();
    const {size} = this.props;
    this.props.annotationCancel({size});
  }

  handleKeyDown(e) {
    e.stopPropagation();
    const {size} = this.props;
    // Capture escape key to cancel
    if (e.keyCode === 27 && this.state.value.length === 0) this.props.annotationCancel({size});
  }

  handleBlur(e) {
    e.stopPropagation();

    const {size} = this.props;
    // If the textarea blurs with no input, the user has clicked or tabbed out. Cancel.
    if (this.state.value.length === 0) this.props.annotationCancel({size});
  }

  render() {
    let editorClasses = сlassNames({
      'cd-annotation-editor': true,
      hidden: !this.props.pending,
    });

    let inputClasses = сlassNames({
      'cd-annotation-input': true,
    });

    let shadowClasses = сlassNames({
      'cd-shadow-bubble': true,
      invert: this.props.invert,
    });

    return <PortalDecorator>
      {({left:myLeft, top:myTop})=> {

        // Apply offsets for outer div
        let divStyle = {
          left: this.props.offset.horizontal + myLeft,
          top: this.props.offset.vertical + myTop,
        };

        // Apply offsets for shadow bubble. Trial and error to figure
        // out the maximums
        let shadowStyle = {};
        if (this.props.pushHorizontal || this.props.pullHorizontal) {
          shadowStyle.left = this.props.offset.shadow || -this.props.offset.horizontal - 4;

          if (shadowStyle.left < 6)
            shadowStyle.left = 6;
          else if (shadowStyle.left > 234)
            shadowStyle.left = 234;
        }

        shadowStyle.left += myLeft;

        return <div style={divStyle} className={editorClasses}>
          <div style={shadowStyle} className={shadowClasses}></div>
          <div className={inputClasses}>
          <textarea autoFocus
                    value={this.state.value}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.handleBlur}
            />

            <div className='cd-annotation-input-controls'>
              <button className='save' onClick={this.handleSaveClick}><i className='fa fa-check'> Save</i>
              </button>
              <button className='cancel' onClick={this.handleCancelClick}><i className='fa fa-times'>
                Cancel</i></button>
            </div>
          </div>
        </div>
      }}
    </PortalDecorator>
  }
}
