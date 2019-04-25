import styles from './SettingsContentEmail.module.scss';

import React, {PropTypes, Component} from 'react';
import {Checkbox} from 'react-bootstrap';

export default class SettingsContentEmail extends Component {

  static PropTypes = {
    updateNotifications : PropTypes.func.isRequired,
    data : PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      on : props.data.on,
    }
  }

  render() {
    const {on}      = this.state;
    const isChecked = on;
    const onOrOff   = isChecked ? 'off' : 'on';
    const label     = `Turn ${onOrOff} email notifications`;

    return <div className={`${styles.email} col-md-offset-2`}>
            <Checkbox
                   name='notifications'
                   checked={isChecked}
                   onChange={this.handleChange}>
              {label}
            </Checkbox>
           </div>;
  }

  handleChange(e) {

    this.setState({
      on : !this.state.on,
    }, () => {
      this.props.updateNotifications(this.state.on)
    })
  }
}