import React,{Component, PropTypes} from 'react';
import GraphEditorComponent from './graphEditor';
import GraphViewerComponent from './graphViewer';

export default class GraphComponent extends Component {

  static PropTypes = {
    mode  : PropTypes.string.isRequired,
    content : PropTypes.object.isRequired,
  }

  static getComponentDefault () {
    const defaultContent = {
      current_id: 0,
      caption: '',
      graph_json: null,
      image_data: null,
      graph_width: 800,
      graph_height: 400,
    };

    return defaultContent;
  }

  // componentDidMount() {
  //   edgehandles(cytoscape, jQuery);
  //   this.initializeCytoscape();
  //   this.initializeCytoscapeEdgeHandles();
  // }

  saveComponent() {
    if (this.refs.component.saveComponent) {
      this.refs.component.saveComponent();

      //This is done only when graphviz component is hosted in a canvas view
      if(this.props.contentStateFinalized){
        this.props.contentStateFinalized();
      }
    }
  }

  render() {
    const readOnly = this.props.mode != 'edit';
    const Component = readOnly ? GraphViewerComponent : GraphEditorComponent;

    return <Component ref="component"
             content={this.props.content}
             config={this.props.config}
              updateContentState={!readOnly &&  this.props.updateContentState} />;
  }
}
