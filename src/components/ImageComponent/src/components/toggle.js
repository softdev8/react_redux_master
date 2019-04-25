import Toggle from 'react-toggle';
import React, {Component} from 'react';

export default class ToggleWithOnChangeFixed extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    if (!this.props.onToggle) return;
    this.props.onToggle(this.refs.toggle.state.checked);
  }

  render() {
    return <Toggle
      ref='toggle'
      onChange={this.onChange}/>;
  }
}
