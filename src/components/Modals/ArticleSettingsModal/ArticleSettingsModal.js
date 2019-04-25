import React, {Component, PropTypes} from 'react';

import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';
import ArticleSettingsForm from '../../ArticlePagesContent/ArticleSettingsForm/ArticleSettingsForm';

export default class ArticleSettingsModal extends Component {

  static PropTypes = {
    closeIcon : PropTypes.node.isRequired,
  };

  render() {

    return  <div>

              { this.props.closeIcon }

              <ModalHeader title='Settings'/>

              <div className='b-modal__body'>
                <ArticleSettingsForm/>
              </div>

              <ModalFooter/>

            </div>;
  }
}