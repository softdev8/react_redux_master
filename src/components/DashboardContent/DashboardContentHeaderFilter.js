import styles from './DashboardContentHeaderFilter.module.scss';

import React, {Component, PropTypes} from 'react';
import { FormControl, ControlLabel, FormGroup } from 'react-bootstrap';

export default class DashboardContentHeaderFilter extends Component {

  static PropTypes = {
    types          : PropTypes.array.isRequired,
    filterArticles : PropTypes.func.isRequired,
  };

  render() {

    const tuts = this.props.types.map( (type, i) => <option value={type} key={i}>{ type }</option> );

    return  <div className={styles.filter}>
              <div className='container'>
                <form className='form-horizontal'>
                  <FormGroup>
                    <div className={styles.wrapper}>
                      <FormControl componentClass="select" onChange={this.props.filterArticles}>
                        { tuts }
                      </FormControl>
                    </div>
                  </FormGroup>
                </form>
              </div>
            </div>;

  }

}