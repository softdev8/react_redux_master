import styles from './SettingsContentPayment.module.scss';

import React, {PropTypes, Component} from 'react';
import {Input} from 'react-bootstrap';

import {Btn} from '../../';

export default class SettingsContentPayment extends Component {

  static PropTypes = {
    updatePayment : PropTypes.func.isRequired,
    data : PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {

    const {data = []} = this.props;

    const information = data.map( (info, i) => {
      return <div className={styles.info} key={i}>
              <span className={styles.card}>{ info.code }</span>
              <Btn primary small onClick={this.handleDelete.bind(this, i)} text='Delete Information'/>
             </div>;
    });

    return <div className={`${styles.payment} col-md-offset-2`}>
            { information }
           </div>;
  }

  handleDelete(index, e) {
    this.props.updatePayment(this.props.data[index].id);
  }
}