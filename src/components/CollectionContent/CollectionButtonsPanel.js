import React, { Component, PropTypes } from 'react';
import { Grid } from 'react-bootstrap';

import { StickyPanel,
         ButtonsPanel,
         MulticolorLine } from '../index';

class CollectionButtonsPanel extends Component {
  render() {

    return (
      <StickyPanel>
        <Grid>
          <MulticolorLine leftColor="rgba(235, 248, 248, .75)">
            <ButtonsPanel disbaled={this.props.disabled} buttons={ this.props.customButtons }/>
          </MulticolorLine>
        </Grid>
      </StickyPanel>
    );
  }

}

CollectionButtonsPanel.propTypes = {
  customButtons : PropTypes.array.isRequired,
};

export default CollectionButtonsPanel;
