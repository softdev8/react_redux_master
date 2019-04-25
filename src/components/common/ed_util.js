import React from 'react'
import {stringUtils} from '../../utils'
import $ from 'jquery'

class EducativeUtil extends React.Component {
  render() {
    // DONT WRITE ANY CODE HERE. THIS IS A UTIL CLASS AND WILL NEVER BE RENDERED.
  }
}

EducativeUtil.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

EducativeUtil.cloneObject = function (obj) {
  return $.extend(true, {}, obj);
};

EducativeUtil.escapeGraphvizLabels = function (string) {
  const htmlEscapes = {
    '&': '\\&',
    '<': '\\<',
    '>': '\\>',
    '"': '\\"',
  };

  // Regex containing the keys listed immediately above.
  const htmlEscaper = /[&<>"]/g;

  return (`${string}`).replace(htmlEscaper, function(match) {
    return htmlEscapes[match];
  });
};

EducativeUtil.getKey = function () {
  return new Date().getTime() + Math.floor((Math.random() * 100000) + 1);
};

EducativeUtil.getPageDataHeaderLength = function () {
  return 50;
};

EducativeUtil.parseError = function (err) {
  if (err == null) {
    return null;
  }

  if (err.errorText != null) {
    return err.errorText;
  }

  if (err.responseJSON != null && err.responseJSON.errors != null) {
    var errorText = '';
    for (let propertyName in err.responseJSON.errors) {
      errorText += `<p>${educative.stringUtils.capitalizeFirstLetter(propertyName)}: ${err.responseJSON.errors[propertyName].toLowerCase()}</p>`;
    }
    return errorText;
  }

  return null;
};

module.exports = EducativeUtil;