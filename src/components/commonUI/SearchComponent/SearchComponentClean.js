require('./SearchComponentClean.scss');

import React, { Component, PropTypes } from 'react';
import { FormControl, FormGroup } from 'react-bootstrap';
import classnames from 'classnames';

import { SomethingWithIcon, Icons } from '../../';

class SearchComponentClean extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isFocused : false,
    };
  }

  onFocus = () => {
    this.setState({
      isFocused : true,
    });
  }

  onBlur = (e) => {
    this.setState({
      isFocused : false,
    });

    if (this.props.onBlur instanceof Function) this.props.onBlur(e);
  }

  render() {

    const icon = <SomethingWithIcon icon={Icons.searchIcon} />;

    const className = classnames(
      'b-search-component',
      'b-search-component_clean',
      {
        'b-search-component_focused' : this.state.isFocused,
      },
    );

    return (
      <div className={className}>
        <FormGroup>
          <FormControl type="text"
                 ref={(node) => this.input = node}
                 onChange={this.props.onChange}
                 onBlur={this.onBlur}
                 onFocus={this.onFocus}
                 placeholder={this.props.placeholder || ''}/>
          {icon}
        </FormGroup>
      </div>
    );

  }

}

SearchComponentClean.propTypes = {
  onBlur        : PropTypes.func,
  onChange      : PropTypes.func,
  placeholder   : PropTypes.string,
};

export default SearchComponentClean;
