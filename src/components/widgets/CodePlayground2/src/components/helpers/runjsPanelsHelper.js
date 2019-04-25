/* eslint-disable no-console, prefer-const, no-else-return*/

export const navNames = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  result: 'Output',
}

export const toggleCodes = {
  html: true,
  css: true,
  js: true,
}

export const focusClasses = {
  html: '',
  css: '',
  js: '',
}

export function getTrueKeys(array) {
  let Keys = [];
  array.map((pair) => {
    const key = Object.keys(pair)[0];
    if (pair[key]) Keys.push(key);
  });
  return Keys;
}

export function stringHiddenCodesClasses(codes, includeResult = false) {
  let string = ' ';
  let codesTypes = includeResult ? ['html', 'css', 'js', 'result'] : ['html', 'css', 'js'];

  for (let type of codesTypes) {
    if (!codes[type]) {
      string += `hide-code-${type} `;
    }
  }

  return string.trim();
}

export function arrayPanesHasSeparatorOnelinePanels(stringHidden) {
  let arrayHidden = stringHidden.split(' ');
  if (arrayHidden.length === 1) {
    if (!arrayHidden[0]) {
      return ['html-has-border', 'css-has-border', 'js-has-border'];
    } else {
      if (stringHidden.indexOf('result') >= 0) return ['html-has-border', 'css-has-border'];
      if (stringHidden.indexOf('html') >= 0) return ['css-has-border', 'js-has-border'];
      if (stringHidden.indexOf('css') >= 0) return ['html-has-border', 'js-has-border'];
      if (stringHidden.indexOf('js') >= 0) return ['html-has-border', 'css-has-border'];
    }
  }
  if (arrayHidden.length === 2) {
    if (stringHidden.indexOf('html') >= 0 && stringHidden.indexOf('css') >= 0) {
      return ['js-has-border'];
    }
    if (stringHidden.indexOf('html') >= 0 && (stringHidden.indexOf('js') >= 0 || stringHidden.indexOf('result') >= 0)) {
      return ['css-has-border'];
    }
    if (stringHidden.indexOf('css') >= 0 && (stringHidden.indexOf('js') >= 0 || stringHidden.indexOf('result') >= 0)) {
      return ['html-has-border'];
    }
    if (stringHidden.indexOf('js') >= 0 && stringHidden.indexOf('result') >= 0) {
      return ['html-has-border'];
    }
  }
  return [];
}

export function arrayPanesHasSeparatorResultBelow(stringHidden) {
  let arrayHidden = stringHidden.split(' ');
  if (arrayHidden.length === 1) {
    if (!arrayHidden[0]) {
      return ['html-has-border', 'css-has-border'];
    } else {
      return stringHidden.indexOf('html') >= 0 ? ['css-has-border'] : ['html-has-border'];
    }
  }
  return [];
}
