const Babel = require('./babel');
const Console = require('./console');

const supportedPlugins = {
  'babel': Babel,
  'console': Console,
};

export default function processPlugins(_htmlContent,
  _jsContent,
  _cssContent,
  plugins,
  runjsConsoleOutput,
) {
  let htmlContent = _htmlContent;
  let jsContent = _jsContent;
  let cssContent = _cssContent;
  let scriptsToAdd = '';

  for (const plugin of plugins) {
    if (supportedPlugins.hasOwnProperty(plugin.name)) {
      const pluginHandler = supportedPlugins[plugin.name];
      const result = pluginHandler.process(htmlContent, jsContent, cssContent, scriptsToAdd, plugin.options, runjsConsoleOutput);

      htmlContent = result.htmlContent;
      jsContent = result.jsContent;
      cssContent = result.cssContent;
      scriptsToAdd = result.scriptsToAdd;
    }
  }

  return { htmlContent, jsContent, cssContent, scriptsToAdd };
}
