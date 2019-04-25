import styles from './CollectionCategoryEdit.module.scss';

import React, {Component, PropTypes} from 'react';

import {Btn} from '../../../index';

export default class CollectionDefaultCategory extends Component {

  static PropTypes = {
    mode       : PropTypes.string.isRequired,
    addArticle : PropTypes.func.isRequired,
  };
    
  render() {
    const {mode, addArticle} = this.props;

    return  <div className={`${styles.category} ${styles.default}`}>

              { this.props.children }

              { mode == 'write' ? 
                  <div className={styles.footer}>
                    <Btn  className='b-btn_green-border' 
                          text='Add Lesson' medium
                          onClick={addArticle}/>
                  </div> : null }
            </div>;
  }
}