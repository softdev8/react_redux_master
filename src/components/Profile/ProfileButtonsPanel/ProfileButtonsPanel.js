import styles from './ProfileButtonsPanel.module.scss';

import React, {Component, PropTypes} from 'react';
import {Grid} from 'react-bootstrap';

import {StickyPanel, Icons,
        ButtonsPanel,
        MulticolorLine} from '../../index';

export default class ProfileButtonsPanel extends Component {

  static PropTypes = {
    save    : PropTypes.func.isRequired,
    discard : PropTypes.func.isRequired,
  };

  render() {

    return  <StickyPanel>
              <div className={styles.buttons}>
                <Grid>
                  <MulticolorLine leftColor='rgba(235, 248, 248, .75)'>
                    <ButtonsPanel buttons={ this.getButtons() }/>
                  </MulticolorLine>
                </Grid>
              </div>
            </StickyPanel>;
  }

  getButtons() {

    return [{
      type   : 'secondary',
      text   : 'Discard',
      method : this.props.discard,
    }, {
      type   : 'primary',
      text   : 'Save',
      method : this.props.save,
      icon   : Icons.downloadIcon,
    }];
  }
}