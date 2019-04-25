import React, { Component, PropTypes } from 'react';

import DetailsTextEditor from './DetailsTextEditor';

class CollectionDetails extends Component {

  static propTypes = {
    initialValue : PropTypes.string,
    onTextChange : PropTypes.func.isRequired,
  };

  onTextChange = (details) => {
    this.props.onTextChange({ details });
  }

  render() {
    const { initialValue } = this.props;
    const options = ['bold', 'italic', 'underline', 'h2', 'h3', 'quote', 'anchor', 'orderedlist', 'unorderedlist', 'strikethrough', 'removeFormat'];

    return (
      <DetailsTextEditor mode="edit" text={initialValue}
                         onTextChange={this.onTextChange}
                         options={options}
                         placeholder="Type your Text" />
    );
  }
}

export default CollectionDetails;
