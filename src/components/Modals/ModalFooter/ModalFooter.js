require('./ModalFooter.scss');

import React, {Component, PropTypes} from 'react';

export default class ModalFooter extends Component {

  //---------------
  // PropsTypes Schema
  //---------------
  /*
   *  helpers : [{
   *    text   : 'some text',
   *    method : () => {<SomeFunction>}
   *  }]
   *
   */

  static PropTypes = {
    helpers : PropTypes.array,
  };

  render() {

    const {helpers = [], children} = this.props;

    let helpersNodes;

    if(helpers.length) {

      helpersNodes = helpers.map( (helper, i) => {

        const linkNode =  <span onClick={helper.method} className='b-modal-footer-helper__link' key={i}>
                            { helper.linkText }
                          </span>;

        let { text } = helper;

        return  <div className='b-modal-footer-helper' key={i}>
                  <span className='b-modal-footer-helper__text'>{ text }</span>
                  { linkNode || null }
                </div>;
      });
    }

    return  <div className='b-modal-footer'>
              { children || helpersNodes }
            </div>;
  }
}