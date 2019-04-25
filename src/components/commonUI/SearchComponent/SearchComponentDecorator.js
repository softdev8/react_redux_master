import React, { Component, PropTypes } from 'react';

export default function () {

  return function decorator(SearchComponent) {

    class SearchComponentDecorator extends Component {

      onChange = (e) => {
        const searchString = e.target.value.toLowerCase();

        this.props.searchHandler({ searchString, resetable: this.props.resetable });
      }

      onBlur = (e) => {
        const searchString = e.target.value;
        const { blur }   = this.props;

        if (!searchString && blur instanceof Function) this.props.blur();
      }

      render() {

        const handlers = {
          onBlur   : this.onBlur,
          onChange : this.onChange,
        };

        return <SearchComponent {...this.props} {...handlers} />;
      }
    }

    SearchComponentDecorator.propTypes = {
      blur          : PropTypes.func,
      resetable     : PropTypes.bool,
      prepareSearch : PropTypes.func,
      searchHandler : PropTypes.func.isRequired,
    };

    return SearchComponentDecorator;

  };
}
