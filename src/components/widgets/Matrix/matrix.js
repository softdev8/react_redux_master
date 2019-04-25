import React,{Component, PropTypes} from 'react';
import MatrixEditor from './matrixEditor';
import MatrixViewer from './matrixViewer';

export default class Matrix extends Component {

  static PropTypes = {
    mode  : PropTypes.string.isRequired,
    content : PropTypes.object.isRequired,
  }

  static getComponentDefault () {
    const defaultContent = {
      // current_id: 0,
      version: '2.0',

      caption: '',
      svg_string: "<svg id=\"SvgjsSvg1000\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" version=\"1.1\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" xmlns:svgjs=\"http:\/\/svgjs.com\/svgjs\" viewBox=\"0 0 144 144\"><defs id=\"SvgjsDefs1001\"><\/defs><svg id=\"SvgjsSvg1007\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1008\" width=\"40\" height=\"40\" x=\"10\" y=\"10\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1009\" font-family=\"Verdana\" font-size=\"20\" x=\"23.6484375\" y=\"12\"><tspan id=\"SvgjsTspan1010\" dy=\"26\" x=\"23.6484375\">1<\/tspan><\/text><\/svg><svg id=\"SvgjsSvg1011\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1012\" width=\"40\" height=\"40\" x=\"10\" y=\"53\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1013\" font-family=\"Verdana\" font-size=\"20\" x=\"23.6484375\" y=\"55\"><tspan id=\"SvgjsTspan1014\" dy=\"26\" x=\"23.6484375\">2<\/tspan><\/text><\/svg><svg id=\"SvgjsSvg1015\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1016\" width=\"40\" height=\"40\" x=\"10\" y=\"96\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1017\" font-family=\"Verdana\" font-size=\"20\" x=\"23.6484375\" y=\"98\"><tspan id=\"SvgjsTspan1018\" dy=\"26\" x=\"23.6484375\">3<\/tspan><\/text><\/svg><svg id=\"SvgjsSvg1019\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1020\" width=\"40\" height=\"40\" x=\"53\" y=\"10\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1021\" font-family=\"Verdana\" font-size=\"20\" x=\"66.6484375\" y=\"12\"><tspan id=\"SvgjsTspan1022\" dy=\"26\" x=\"66.6484375\">4<\/tspan><\/text><\/svg><svg id=\"SvgjsSvg1023\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1024\" width=\"40\" height=\"40\" x=\"53\" y=\"53\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1025\" font-family=\"Verdana\" font-size=\"20\" x=\"66.6484375\" y=\"55\"><tspan id=\"SvgjsTspan1026\" dy=\"26\" x=\"66.6484375\">5<\/tspan><\/text><\/svg><svg id=\"SvgjsSvg1027\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1028\" width=\"40\" height=\"40\" x=\"53\" y=\"96\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1029\" font-family=\"Verdana\" font-size=\"20\" x=\"66.6484375\" y=\"98\"><tspan id=\"SvgjsTspan1030\" dy=\"26\" x=\"66.6484375\">6<\/tspan><\/text><\/svg><svg id=\"SvgjsSvg1031\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1032\" width=\"40\" height=\"40\" x=\"96\" y=\"10\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1033\" font-family=\"Verdana\" font-size=\"20\" x=\"109.6484375\" y=\"12\"><tspan id=\"SvgjsTspan1034\" dy=\"26\" x=\"109.6484375\">7<\/tspan><\/text><\/svg><svg id=\"SvgjsSvg1035\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1036\" width=\"40\" height=\"40\" x=\"96\" y=\"53\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1037\" font-family=\"Verdana\" font-size=\"20\" x=\"109.6484375\" y=\"55\"><tspan id=\"SvgjsTspan1038\" dy=\"26\" x=\"109.6484375\">8<\/tspan><\/text><\/svg><svg id=\"SvgjsSvg1039\" style=\"overflow: visible;\"><rect id=\"SvgjsRect1040\" width=\"40\" height=\"40\" x=\"96\" y=\"96\" fill=\"#caff97\" stroke-opacity=\"1\" stroke=\"#000000\" stroke-width=\"1\"><\/rect><text id=\"SvgjsText1041\" font-family=\"Verdana\" font-size=\"20\" x=\"109.6484375\" y=\"98\"><tspan id=\"SvgjsTspan1042\" dy=\"26\" x=\"109.6484375\">9<\/tspan><\/text><\/svg><\/svg>",
      svg_width: 144,
      svg_height: 144,

      matrix_data: {
        version: 1.0,
        width: 144,
        height: 144,
        left_padding: 10,
        top_padding: 10,
        right_padding: 10,
        bottom_padding: 10,
        row_gap: 3,
        col_gap: 3,
        minimum_cell_width: 40,
        minimum_cell_height: 40,
        cell_left_padding: 5,
        cell_right_padding: 5,

        cols: [{
          max_width: 40,

          cells: [{
            text: "1",
            width: 40,
            height: 40,
            color: "#caff97",
          }, {
            text: "2",
            width: 40,
            height: 40,
            color: "#caff97",
          }, {
            text: "3",
            width: 40,
            height: 40,
            color: "#caff97",
          }],
        }, {
          max_width: 40,

          cells: [{
            text: "4",
            width: 40,
            height: 40,
            color: "#caff97",
          }, {
            text: "5",
            width: 40,
            height: 40,
            color: "#caff97",
          }, {
            text: "6",
            width: 40,
            height: 40,
            color: "#caff97",
          }],
        }, {
          max_width: 40,

          cells: [{
            text: "7",
            width: 40,
            height: 40,
            color: "#caff97",
          }, {
            text: "8",
            width: 40,
            height: 40,
            color: "#caff97",
          }, {
            text: "9",
            width: 40,
            height: 40,
            color: "#caff97",
          }],
        }],
      },
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
    const Component = readOnly ? MatrixViewer : MatrixEditor;


    return <Component ref="component"
             content={this.props.content}
             config={this.props.config}
              updateContentState={!readOnly &&  this.props.updateContentState} />;
  }
}
