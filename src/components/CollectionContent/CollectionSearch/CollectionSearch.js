import styles from './CollectionSearch.module.scss';

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import {/* , Select*/ } from '../../index';
import { SearchComponent } from '../../../containers';


// Use CollectionSearch as separated component
// for custom select field support
class CollectionSearch extends Component {

  onSelectChange = (e) => {
    console.log(e);
  }

  render() {
    const { className } = this.props;

    // const selectOptions = ['modified'];
    const searchClassName = classnames(styles.search, className);

    return (
      <div className={searchClassName}>
        {/* <Select changeHandler={this.onSelectChange} options={selectOptions}/>*/}
        <SearchComponent resetable={false} placeholder={this.props.placeholder} searchTerm={this.props.searchTerm}/>
      </div>
    );
  }
}

CollectionSearch.propTypes = {
  className : PropTypes.string,
  placeholder: PropTypes.string
};

export default CollectionSearch;
