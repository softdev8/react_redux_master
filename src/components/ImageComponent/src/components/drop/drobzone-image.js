import React, {Component, PropTypes}  from 'react';
import Dropzone from '../dropzone';

export default class DropzoneImage extends Component {
  constructor() {
    super();

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    console.log(files)
  }

  render() {
    return <Dropzone onDrop={this.onDrop}/>;
  }
}

