const getBabelObject = () => {
  let babel = null;
  if (typeof window.Babel !== 'undefined') {
    // using babel-standalone
    babel = window.Babel;
  } else if (typeof window.babel !== 'undefined') {
    // using browser.js from babel-core 5.x
    babel = {
      transform: window.babel,
    };
  } else {
    return 'Babel not supported';
  }

  return babel;
}

const getScriptsToAdd = (_scriptsToAdd, options) => {
  if (options.presets.indexOf('react') !== -1) {
    _scriptsToAdd += `<script src="https://fb.me/react-0.14.6.js"></script>
      <script src="https://fb.me/react-dom-0.14.6.js"></script>`;
  }

  return _scriptsToAdd;
}

export function process(_htmlContent, _jsContent, _cssContent, _scriptsToAdd, options, runjsConsoleOutput) {
  const babel = getBabelObject();
  const jsContent = babel.transform(_jsContent, options).code;
  const scriptsToAdd = getScriptsToAdd(_scriptsToAdd, options);

  return {
    jsContent,
    scriptsToAdd,
    htmlContent: _htmlContent,
    cssContent: _cssContent,
  };
}
