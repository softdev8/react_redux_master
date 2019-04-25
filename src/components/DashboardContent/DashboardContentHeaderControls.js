import styles from './DashboardContentHeaderControls.module.scss';

import React, { Component, PropTypes } from 'react';
import { Grid } from 'react-bootstrap';

import { Icons, MulticolorLine,
         ButtonsPanel } from '../index';
import { SearchComponent } from '../../containers';


class DashboardContentHeaderControls extends Component {

  getButtons() {

    return [{
      type   : 'secondary',
      text   : 'New Course',
      method : this.props.createCollection,
      icon   : Icons.docsIcon,
    }, {
      type   : 'primary',
      text   : 'New Tutorial',
      icon   : Icons.plusCircleIcon,
      method : this.props.createArticle,
    }];
  }

  render() {

    return (
      <div className={styles.controls}>
        <Grid>
          { this.props.mode === 'reader' ?
          <MulticolorLine leftColor="rgba(235, 248, 248, .75)" rightColor="rgba(235, 248, 248, .75)">
            <div className={styles.search} style={{ width: '100%' }}>
              <SearchComponent resetable/>
            </div>
          </MulticolorLine> :

          <MulticolorLine leftColor="rgba(235, 248, 248, .75)">
            <div className={styles.search}>
              <SearchComponent resetable/>
            </div>

            <ButtonsPanel buttons={ this.getButtons() } className={styles.buttons}/>

          </MulticolorLine> }
        </Grid>
      </div>
    );

  }
}

DashboardContentHeaderControls.propTypes = {
  createCollection : PropTypes.func,
  createArticle    : PropTypes.func,
  mode             : PropTypes.string
};

export default DashboardContentHeaderControls;
