import React,{Component, PropTypes} from 'react';
const HighChart = require('./highChart');

export default class CustomChartViewer extends Component {
  static PropTypes = {
    config: PropTypes.string.required
  }

  render() {
    return (
      <HighChart
        config={JSON.parse(this.props.config)}>
      </HighChart>
    );
  }
}