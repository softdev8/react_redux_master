import React,{Component, PropTypes} from 'react';
import * as widgetUtil from '../../helpers/widgetUtil';

const CaptionComponent = require('../../CaptionComponent/CaptionComponent');

export default class MatrixViewer extends Component {

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


    let tempHtml = {__html: this.props.content.svg_string};
    let width = this.props.content.svg_width;
    let className = 'ed-ds-view';
    let compAlign = 'center';
    let displayMatrix = <div className={className} dangerouslySetInnerHTML={tempHtml} style={{display:'block', maxWidth:width, margin: widgetUtil.getMargin(compAlign)}}/>

    return <div>
              <div style={{textAlign:'center'}}>
                {displayMatrix}
              </div>
              {captionComponent}
           </div>;
  }
}