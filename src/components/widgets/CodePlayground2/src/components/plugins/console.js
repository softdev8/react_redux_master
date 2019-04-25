import styles from './console.module.scss';
const jqueryScript = `
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.slim.min.js"></script>
  <script type="text/javascript">
    var jQuery_slim_3_1_1 = $.noConflict(true);
  </script>
`;

const logCaptureCode = (runjsConsoleDivId) => {
  return `
    var originalConsoleLog = console.log;
    var console = {
      panel: jQuery_slim_3_1_1('#${runjsConsoleDivId}', parent.document.body),
      log: function(...args){
        let logOutput = '';
        let PrettyPrintObject = '';
        for (let i = 0; i < args.length; i++) {
          if(typeof args[i] === 'object'){
            PrettyPrintObject += (i > 0 ? ' ' : '') + JSON.stringify((args[i]), null, 3);
            logOutput = PrettyPrintObject.replace(/\"([^(\")"]+)\":/g,"$1:");
          }
          else
           logOutput += (i > 0 ? ' ' : '') +args[i]; 
        }
        this.panel.append('<pre>'+logOutput+'</pre>');
        originalConsoleLog.apply(null, args);
      }
    };`;
};

export function process(_htmlContent, _jsContent, _cssContent, _scriptsToAdd, options, runjsConsoleOutput) {
  return {
    jsContent: `${logCaptureCode(runjsConsoleOutput)}${_jsContent}`,
    scriptsToAdd: _scriptsToAdd + jqueryScript,
    htmlContent: _htmlContent,
    cssContent: _cssContent,
  };
}
