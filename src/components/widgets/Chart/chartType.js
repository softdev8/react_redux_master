import styles from './chartType.module.scss';

import { FormControl } from 'react-bootstrap';
import React,{Component, PropTypes} from 'react';

export default class ChartOptions extends Component {
  handleOnChange(e) {
    this.props.updateChartTypeCallback(e.target.value);
  }

  render() {
    return (
      <label className={`${styles.label} form-info`}>
        <FormControl
          componentClass='select' style={{marginLeft: 5}}
          value={this.props.chartType}
          onChange={this.handleOnChange.bind(this)}>
            <option value="line">Line</option>
            <option value="area">Area</option>
            <option value="bar">Bar</option>
            <option value="column">Column</option>
            <option value="pie">Pie</option>
        </FormControl>
      </label>
    );
  }
}