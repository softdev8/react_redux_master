import R from 'ramda';
const pluginsHandler = require('./plugins');

const BABEL_CDN = '<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.js"></script>';

const insertInString = (target, index, content) =>
    `${target.slice(0, index)}\n${content}\n${target.slice(index)}`;

const wrapStyleTag = (style) => `<style>${style}</style>`;

const wrapScriptTag = (jsCode, type=`text/javascript`) =>
  `<script language="javascript" type=${type}>${jsCode}</script>`;

const filterByType = (_type) => R.filter(({ type }) => type === _type);

export default class RunJsUtil {
}

const insertHeadBodyIfNeeded = (htmlContent) => {
  if (htmlContent === undefined || htmlContent.trim() === '') {
    return '<!DOCTYPE html><html><head></head><body></body></html>';
  }
  return htmlContent;
};

RunJsUtil.jottedParamsToCompiledHtml = (files, plugins, hiddenjs, callback, runjs_console_output) => {
  const htmlParams = filterByType('html')(files);
  const cssParams = filterByType('css')(files);
  const jsParams = filterByType('js')(files);

  let cssContent = cssParams[0].content;
  let htmlContent = htmlParams[0].content;
  let jsContent = jsParams[0].content;

  if (hiddenjs) {
    jsContent = `${hiddenjs};\n${jsContent}`;
  }

  htmlContent = insertHeadBodyIfNeeded(htmlContent);

  const result = pluginsHandler(htmlContent, jsContent, cssContent, plugins, runjs_console_output);
  htmlContent = result.htmlContent;
  jsContent = result.jsContent;
  cssContent = result.cssContent;
  const scriptsToAdd = result.scriptsToAdd;

  // insert JS in compiled HTML
  if (htmlParams.length > 0 && jsParams.length > 0) {
    const endOfHeadIndex = htmlContent.indexOf('</head>');

    if (endOfHeadIndex === -1) {
      return 'wrong html: should contain head tag';
    }

    const endOfBodyTagIndex = htmlContent.indexOf('</body>');

    if (endOfBodyTagIndex === -1) {
      return 'wrong html: should contain body tag';
    }

    htmlContent = insertInString(htmlContent, endOfBodyTagIndex, wrapScriptTag(jsContent));
  }

  // insert CSS/Scripts in compiled HTML
  if (htmlParams.length > 0 && (cssParams.length > 0 || scriptsToAdd.length > 0)) {
    const endOfHeadIndex = htmlContent.indexOf('</head>');

    if (endOfHeadIndex === -1) {
      return 'wrong html: should contain head tag';
    }

    const addInHeader = wrapStyleTag(cssContent) + scriptsToAdd;
    htmlContent = insertInString(htmlContent, endOfHeadIndex, addInHeader);
  }

  setTimeout(() => callback(htmlContent), 0);
};

RunJsUtil.jottedParamsToContentForDownload = (files, plugins, hiddenjs) => {
  const htmlParams = filterByType('html')(files);
  const jsParams = filterByType('js')(files);
  const cssParams = filterByType('css')(files);

  let htmlContent = htmlParams[0].content;

  if (htmlParams.length === 0) {
    return '';
  }

  if (jsParams.length === 0 && cssParams.length === 0) {
    return htmlContent;
  }

  const bundleJs = (htmlContent, jsContent, plugins) => {
    const isBabelEnabled = plugins.filter((plugin) =>
      plugin === 'babel' || plugin.name === 'babel'
    ).length !== 0;

    const endOfHeadIndex = htmlContent.indexOf('</head>');

    if (endOfHeadIndex === -1) {
      return 'wrong html: should contain head tag';
    }

    if (isBabelEnabled) {
      htmlContent = insertInString(htmlContent, endOfHeadIndex, BABEL_CDN);
    }

    const endOfBodyTagIndex = htmlContent.indexOf('</body>');

    if (endOfBodyTagIndex === -1) {
      return 'wrong html: should contain body tag';
    }

    const jsScriptType = isBabelEnabled ? 'text/babel' : 'text/javascript';

    return insertInString(htmlContent, endOfBodyTagIndex, wrapScriptTag(jsContent, jsScriptType));
  };

  if (htmlParams.length === 1 && jsParams.length === 1) {
    let jsContent = jsParams[0].content;

    if (hiddenjs) {
      jsContent = `${hiddenjs};\n${jsContent}`;
    }

    htmlContent = bundleJs(htmlContent, jsContent, plugins);
  }

  const bundleCss = (htmlContent, cssContent) => {
    const endOfHeadIndex = htmlContent.indexOf('</head>');

    if (endOfHeadIndex === -1) {
      return 'wrong html: should contain head tag';
    }

    return insertInString(htmlContent, endOfHeadIndex, wrapStyleTag(cssContent));
  };

  if (htmlParams.length === 1 && cssParams.length === 1) {
    htmlContent = bundleCss(htmlContent, cssParams[0].content);
  }

  return htmlContent;
};
