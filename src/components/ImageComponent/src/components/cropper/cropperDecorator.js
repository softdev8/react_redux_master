import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom';

import $ from 'jquery';
require('cropper/dist/cropper.js');
require('cropper/dist/cropper.css');

export default (WrappedComponent)=> {
  class Cropper extends Component {
    static defaultProps = {
      src: null,
    };

    componentDidMount() {
      $('.cropper-container').remove()
      this.$img = $(findDOMNode(this.refs.img.getImage()));
      if (this.props.cropperMounted) {
        this.props.cropperMounted(this.$img, this.props)
      }
    }

    shouldComponentUpdate(nextProps) {
      if(nextProps.original_editable_image !== this.props.original_editable_image
        || nextProps.editableImage.get('image').get('src') !== this.props.editableImage.get('image').get('src')
        )
      {
        // this.props.cropperReplace(nextProps.editableImage.get('image').get('src'));
      }
      return true;
    }

    componentWillUnmount() {
      if (this.props.cropperUnmounted) {
          this.props.cropperUnmounted()
      }
      if (this.$img) {
        // While we're at it remove our reference to the jQuery instance
        delete this.$img;
      }
    }

    render() {
      return (
        <div {...this.props} src={null}>
          <WrappedComponent ref='img' {...this.props}/>
        </div>
      );
    }
  }
  return Cropper
};