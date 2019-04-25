import React, {Component} from 'react'

export default (WrappedComponent)=> {
  class withPaneComponent extends Component {
    render() {
      return <div className="cropper-container cropper-bg"
                  style={this.props.style}>
        <div className="cropper-canvas" style={this.props.style}>
          <WrappedComponent {...this.props} containerStyle={{
            width: '100%',
            height: '100vmax',
            top: 0,
            left: 0,
            position: 'absolute',
          }}/>
        </div>
      </div>
    }
  }
  return withPaneComponent
};