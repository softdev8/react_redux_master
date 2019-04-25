import React,{Component, PropTypes} from 'react';
const ReactHighcharts = require('react-highcharts');

export default class HighChartComponent extends Component {
  static PropTypes = {
    config : PropTypes.object.required,
  }

  constructor(props) {
    super(props);
    this.state = {
      config: props.config
    };
  }

  componentWillUpdate(nextProps) {
    this.state.config = nextProps.config;
  }

  updateChart(config) {
    this.setState({
      config: config
    });
  }

  render() {
    return (
        <ReactHighcharts
          config={this.state.config}>
        </ReactHighcharts>
      );
  }
}
