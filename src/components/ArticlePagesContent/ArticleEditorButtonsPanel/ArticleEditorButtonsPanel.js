import styles from './ArticleEditorButtonsPanel.module.scss';

import React, {Component, PropTypes} from 'react';
import {Grid} from 'react-bootstrap';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';

import {StickyPanel, Btn,
        ButtonsPanel,
        MulticolorLine} from '../../index';

import { serverUrl } from '../../../config-old';

@connect( state => ({}), { pushState })
export default class ArticleEditorButtonsPanel extends Component {

  static PropTypes = {
    customButtons : PropTypes.array.isRequired,
    collection_id : PropTypes.number,
    showBack      : PropTypes.bool,
    disabled      : PropTypes.bool,
    isDemo        : PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  render() {
    const goBackBtn = <Btn btnStyle='default' text='go back' onClick={this.goBack}/>;
    const buttons   = <ButtonsPanel disabled={this.props.disabled} buttons={ this.getButtons() } className={styles.buttons}/>;

    return  <StickyPanel>
              <div className={styles.panel}>
                <Grid>
                  <MulticolorLine leftColor="rgba(235, 248, 248, .75)">
                    { this.props.showBack ? (
                        <div className={styles.inn}>
                          { goBackBtn }
                          { buttons }
                        </div> ) : buttons }
                  </MulticolorLine>
                </Grid>
              </div>
            </StickyPanel>;
  }

  getButtons() {

    if(this.props.customButtons) return this.props.customButtons;
  }

  goBack() {

    if(this.props.isDemo){
      //TODO: remove this when landing page is hosted inside the application
      window.location = '/';
      return;
    }

    const { collection_id } = this.props;
    let link = null;
    collection_id != null?
      link = `${serverUrl}/collectioneditor/${collection_id}`
      : link = `${serverUrl}/teach`;

    this.props.pushState(null, link);
  }
}