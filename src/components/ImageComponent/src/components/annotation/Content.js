'use strict';

// External
import React, {Component, PropTypes} from 'react'
import сlassNames from 'classnames'
import Timeago from 'timeago'
import PortalDecorator from '../../decorators/PortalDecorator'

// Local
import Input from '../Input'

export default class Content extends Component {
  constructor() {
    super();

    this.state = {shouldDisplayControls: false};

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    pending: PropTypes.bool.isRequired,
    shouldDisplayViewer: PropTypes.bool.isRequired,
    annotationDelete: PropTypes.func.isRequired,
    annotationEdit: PropTypes.func.isRequired,
    offset: PropTypes.object.isRequired,

    //Optional
    timeStamp: PropTypes.instanceOf(Date),
  };

  handleEditClick(e) {
    e.stopPropagation();
    const {id, size} = this.props;
    this.props.annotationEdit({id, size});
  }

  handleDeleteClick(e) {
    e.stopPropagation();
    this.props.annotationDelete(this.props.id);
  }

  // These allow event propagation because parent needs mouse events
  handleMouseOver(e) {
    e.stopPropagation();
    this.props.displayAnnotationViewer(this.props.id);
    this.setState({shouldDisplayControls: true});
  }

  handleMouseOut(e) {
    e.stopPropagation();
    this.props.hideAnnotationViewer(this.props.id);
    this.setState({shouldDisplayControls: false});
  }

  render() {
    let viewerClasses = сlassNames({
      'cd-annotation-viewer': true,

      //Hide if we are NOT pending and we SHOULD NOT display
      hidden: this.props.pending || !this.props.shouldDisplayViewer,
    });

    let contentClasses = сlassNames({
      'cd-annotation-content': true,
    });

    let controlClasses = сlassNames({
      'cd-annotation-content-controls': true,
      'fade-in': this.state.shouldDisplayControls,
    });

    let shadowClasses = сlassNames({
      'cd-shadow-bubble': true,
      invert: this.props.invert,
    });

    return <PortalDecorator>
      {({left:myLeft, top:myTop})=> {
        const zIndex = 500
        let divStyle = {
          zIndex:zIndex + 2,
          left: this.props.offset.horizontal + myLeft,
          top: this.props.offset.vertical + myTop,
        };

        // Apply offsets for shadow bubble. Trial and error to figure
        // out the maximums
        let shadowStyle = {
        };
        if (this.props.pushHorizontal || this.props.pullHorizontal) {
          shadowStyle.left = this.props.offset.shadow || -this.props.offset.horizontal - 4;

          if (shadowStyle.left < 6)
            shadowStyle.left = 6;
          else if (shadowStyle.left > 234)
            shadowStyle.left = 234;
        }

        shadowStyle.left += myLeft;

        return <div style={divStyle} className={viewerClasses} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
          <div style={shadowStyle} className={shadowClasses}></div>
          <div className={contentClasses} >
            {this.props.isEditable ? 
              (<div className={controlClasses}>             
              <button className='delete' onClick={this.handleDeleteClick}><i className='fa fa-times'>
                Delete</i></button>
              <button className='edit' onClick={this.handleEditClick}><i className='fa fa-pencil'> Edit</i>
              </button>
            </div> 
            ):null
            }
            <div className='cd-annotation-content-text'>
              {this.props.content}
            </div>
          </div>
        </div>
      }
      }
    </PortalDecorator>
  }
};

// <div className='cd-annotation-content-info'>
            //   Comment #{this.props.id} by {this.props.author} {Timeago(this.props.timeStamp)}
            // </div>
