// import styles from './chart.module.scss';
import React,{Component, PropTypes} from 'react';
const HighChart = require('./highChart');
const CodeMirrorEditor = require('../../helpers/codeeditor');
import {Col, Row} from 'react-bootstrap';
const Button = require('../../common/Button');
import {SomethingWithIcon, Icons} from '../../index';

const placeholderText = 'Enter config for highcharts.\nFor examples, look at\nhttp://www.highcharts.com/demo/line-basic';

export default class CustomChartComponent extends Component {
  static PropTypes = {
    mode  : PropTypes.string.isRequired,
    content : PropTypes.object.isRequired,
    updateConfigCallback : PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      config: this.props.config
    };

    this.handleConfigChanges = this.handleConfigChanges.bind(this);
  }

  handleConfigChanges(config) {
    this.state.config = config;

    this.refs.chart && this.refs.chart.updateChart(JSON.parse(config));
    this.props.updateConfigCallback(config);
  }

  componentWillUpdate(nextProps) {
    this.state.config = nextProps.config;
  }

  render() {
    let activeCodeContent = {
      content: this.state.config,
      language: 'javascript',
      theme: 'default',
      lineNumbers:false,
    };

    return (
      <div>
        <Row>
          <Col lg={6} md={6} className='customChartLeft'>
            <div className='customChartConfigEditor'>
              <CodeMirrorEditor
                key='editorConfig_1'
                codeContent={activeCodeContent}
                readOnly={false}
                placeholder={placeholderText}
                onEditorChange={this.handleConfigChanges}
              />
            </div>
          </Col>
          <Col lg={6} md={6} className='customChartRight'>
            <HighChart
              ref={'chart'}
              config={JSON.parse(this.props.config)}>
            </HighChart>
          </Col>
        </Row>
      </div>
      );
  }
}
