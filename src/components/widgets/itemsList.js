import React from 'react'

class ItemsListComponent extends React.Component {
  // getInitialState: function(){
  //   return { headingContent: this.props.headingContent, headingSize: this.props.headingSize};
  // },
  // getDefaultProps: function() {
  //   return {
  //     headingSize: 1,
  //     headingContent: "Heading1"
  //   };
  // },
  render() {
    // TODO: make editable if in editing mode.
    return (
      <ul>
        <li>item1</li>
        <li>item2</li>
      </ul>
    );
  }
}

module.exports = ItemsListComponent;
