import React from 'react'

class MarkdownPaste extends React.Component {
  render() { return false; }
}

MarkdownPaste.getComponentDefault = function() {
  return {
    version: '1.0',
    text: '',
    mdHtml: '',
  };
};

module.exports = MarkdownPaste;
