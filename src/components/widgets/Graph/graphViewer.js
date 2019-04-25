import React,{Component, PropTypes} from 'react';

const CaptionComponent = require('../../CaptionComponent/CaptionComponent');

export default class GraphViewerComponent extends Component {

  static PropTypes = {
    content : PropTypes.object.required,
  };

  render(){
    const {content} = this.props;

    let captionComponent = null;

    if (this.props.config == null || this.props.config.disableCaption == null || this.props.config.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.props.content.caption}
        readOnly={true} />;
    }

    return <div>
              <div style={{textAlign:'center'}}>
                <img src={content.image_data} alt='No Graph available'/>
              </div>
              {captionComponent}
           </div>;
  }
}