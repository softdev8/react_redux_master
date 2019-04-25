require('./SearchComponent.scss');

import React, { Component, PropTypes } from 'react';
import { FormControl, FormGroup } from 'react-bootstrap';

import { Btn, Icons, SearchComponentClean } from '../../';
import searchComponentDecorator from './SearchComponentDecorator';

@searchComponentDecorator()
class SearchComponent extends Component {

  render() {

    if (this.props.clean) return <SearchComponentClean {...this.props} />;

    const submitButton = <Btn type="button" secondary>{ this.props.buttonContent || Icons.searchIcon }</Btn>;

    return (
      <div className="b-search-component">
        <FormGroup>
          <FormControl type="text"
                 ref={(node) => this.input = node}
                 onChange={this.props.onChange}
                 onBlur={this.props.onBlur}
                 placeholder={this.props.placeholder || ''}
                 value={this.props.searchTerm}
                 />
          {submitButton}
        </FormGroup>
      </div>
    );

  }

}

SearchComponent.propTypes = {
  buttonContent : PropTypes.node,
  clean         : PropTypes.bool,
  onBlur        : PropTypes.func,
  onChange      : PropTypes.func,
  placeholder   : PropTypes.string,
  searchTerm    : PropTypes.string
};

export default SearchComponent;
