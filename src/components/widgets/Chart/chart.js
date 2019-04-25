import React,{Component, PropTypes} from 'react';
const CustomChart = require('./customChart');
const ChartTypeSelect = require('./chartType');

export default class ChartComponent extends Component {
  static PropTypes = {
    mode  : PropTypes.string.isRequired,
    content : PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props);

    this.state = {
      config: this.props.content.config,
      type: this.props.content.type
    };

    this.updateConfigCallback = this.updateConfigCallback.bind(this);
    this.updateChartTypeCallback = this.updateChartTypeCallback.bind(this);
  }

  static getComponentDefault () {
    // TODO: change default to line chart when supported.
    const defaultContent = {
      config: CustomChart.getDefaultConfig('line'),
      type: 'line'
    };

    return defaultContent;
  }

  updateConfigCallback(newConfig) {
    this.state.config = newConfig;
  }

  updateChartTypeCallback(chartType) {
    let newConfig = CustomChart.getDefaultConfig(chartType);
    this.setState({
      type: chartType,
      config: newConfig
    });
  }

  saveComponent() {
    this.props.updateContentState({
      config: this.state.config,
      type: this.state.type
    });
  }

  render() {
    //
    // only one supported type now: custom
    // TODO: line, bar, pie, etc.
    //

    return (
      <div>
        {
          this.props.mode === 'edit' &&
          (<ChartTypeSelect
            updateChartTypeCallback={this.updateChartTypeCallback}
            chartType={this.state.type}
            />)
        }
        <CustomChart
          config={this.state.config}
          mode={this.props.mode}
          updateConfigCallback={this.updateConfigCallback}>
        </CustomChart>
      </div>
    );
  }
}
