import React from 'react'

const ReactScriptLoaderMixin = require('./reactscriptloader').ReactScriptLoaderMixin;

const ReactSingleScriptLoader = React.createClass({
  mixins: [ReactScriptLoaderMixin],

  // this function tells ReactScriptLoaderMixin where to load the script from
  getScriptURL() {
    return this.props.script;
  },

  // ReactScriptLoaderMixin calls this function when the script has failed to load.
  onScriptError() {
    this.props.onScriptLoadError(this.props.script);
  },

  // ReactScriptLoaderMixin calls this function when the script has loaded
  // successfully.
  onScriptLoaded() {
    this.props.onScriptLoaded(this.props.script);
  },

  render() {
    return <div></div>;
  },
});

class ReactScriptHelper extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onScriptLoadError = this.onScriptLoadError.bind(this);
    this.onScriptLoaded = this.onScriptLoaded.bind(this);
    const scriptsAvailableOnDoc = document.getElementsByTagName("script");
    const scriptsToLoad = [];

    for (let i = 0; i < props.scripts.length; i++) {
      if (this.isScriptAlreadyLoaded(props.scripts[i], scriptsAvailableOnDoc) == false) {
        scriptsToLoad.push(props.scripts[i]);
      }
    }

    this.state = {scriptsToLoad, loadedScripts: [], scriptsAvailableOnDoc};
  }

  componentDidMount() {
    if (this.state.scriptsToLoad == 0) {
      this.onAllScriptsLoaded();
    }
  }

  isScriptAlreadyLoaded(src, scriptsAvailableOnDoc) {
    for (let i = 0; i < scriptsAvailableOnDoc.length; i++)
      if (scriptsAvailableOnDoc[i].getAttribute('src')) {
        if (scriptsAvailableOnDoc[i].getAttribute('src') == src)
          return true;
      }
    return false;
  }

  onAllScriptsLoaded() {
    this.props.onScriptsLoaded();
  }

  onScriptLoadError(script_name) {
    this.props.onScriptsLoadError();
  }

  onScriptLoaded(script_name) {
    this.state.loadedScripts.push(script_name);

    if (this.state.loadedScripts.length == this.state.scriptsToLoad.length) {
      this.onAllScriptsLoaded();
    }
  }

  render() {
    const scripts = this.state.scriptsToLoad.map((script, i) => <ReactSingleScriptLoader key={i} script={script} onScriptLoaded={this.onScriptLoaded}
                                    onScriptLoadError={this.onScriptLoadError}/>);
    //TODO : Show some progress bar here
    return <div>{scripts}</div>;
  }
}

module.exports = ReactScriptHelper;