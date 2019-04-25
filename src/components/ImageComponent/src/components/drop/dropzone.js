import React, {Component, PropTypes}  from 'react';
import R from 'ramda';
import Q from 'q';
import {ResizeByParent} from 'react-size-decorator';

export default class Dropzone extends Component {
  constructor() {
    super();
    this.state = {
      isDragActive: false,
    };

    this.onDragOver = this.onDragOver.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.open = this.open.bind(this);
  }

  static propTypes = {
    onDrop: PropTypes.func.isRequired,
    size: PropTypes.number,
    style: PropTypes.object,
    supportClick: PropTypes.bool,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
  };

  static defaultProps = {
    supportClick: true,
    multiple: true,
  };

  onDragLeave(e) {
    this.setState({
      isDragActive: false,
    });
  }

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true,
    });
  }

  onDrop(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false,
    });

    if (!this.props.onDrop)
      return;

    let getFiles = function (e) {
      if (e.dataTransfer) {
        return e.dataTransfer.files;
      } else if (e.target) {
        return e.target.files;
      }
    };

    this.props.onDrop(getFiles(e));
  }

  onClick() {
    if (this.props.supportClick === true) {
      this.open();
    }
  }

  open() {
    findDOMNode(this.refs.fileInput).click();
  }

  render() {
    let className = this.props.className || 'dropzone';

    if (this.state.isDragActive) {
      className += ' active';
    }

    let style = this.props.style || {
      marginBottom: 0,
      marginTop: 0,
      minHeight: 0,
      width: this.props.size || '100%',
      height: this.props.size || '100%',
      borderStyle: this.state.isDragActive ? 'solid' : 'dashed',
    };

    return <div className={className}
                style={style}
                onClick={this.onClick }
                onDragLeave={this.onDragLeave }
                onDragOver={this.onDragOver }
                onDrop={this.onDrop}>

      <input style={{display: 'none'} }
             type='file'
             multiple={this.props.multiple}
             ref='fileInput'
             onChange={this.onDrop}
             accept={this.props.accept}/>

      {this.props.children}
    </div>;
  }
}

