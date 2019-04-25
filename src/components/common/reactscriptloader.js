

// A dictionary mapping script URLs to a dictionary mapping
// component key to component for all components that are waiting
// for the script to load.
const scriptObservers = {};

// A dictionary mapping script URL to a boolean value indicating if the script
// has already been loaded.
const loadedScripts = {};

// A dictionary mapping script URL to a boolean value indicating if the script
// has failed to load.
const erroredScripts = {};

// A counter used to generate a unique id for each component that uses
// ScriptLoaderMixin.
let idCount = 0;

const ReactScriptLoader = {
  componentDidMount(key, component, scriptURL) {
    if (typeof component.onScriptLoaded !== 'function') {
      throw new Error('ScriptLoader: Component class must implement onScriptLoaded()');
    }
    if (typeof component.onScriptError !== 'function') {
      throw new Error('ScriptLoader: Component class must implement onScriptError()');
    }
    if (loadedScripts[scriptURL]) {
      component.onScriptLoaded();
      return;
    }
    if (erroredScripts[scriptURL]) {
      component.onScriptError();
      return;
    }

    // If the script is loading, add the component to the script's observers
    // and return. Otherwise, initialize the script's observers with the component
    // and start loading the script.
    if (scriptObservers[scriptURL]) {
      scriptObservers[scriptURL][key] = component;
      return;
    }

    const observers = {};
    observers[key] = component;
    scriptObservers[scriptURL] = observers;

    const script = document.createElement('script');

    if (typeof component.onScriptTagCreated === 'function') {
      component.onScriptTagCreated(script);
    }

    script.src = scriptURL;
    script.async = 1;

    const callObserverFuncAndRemoveObserver = function (func) {
      const observers = scriptObservers[scriptURL];
      for (let key in observers) {
        const observer = observers[key];
        const removeObserver = func(observer);
        if (removeObserver) {
          delete scriptObservers[scriptURL][key];
        }
      }
      //delete scriptObservers[scriptURL];
    };
    script.onload = function () {
      loadedScripts[scriptURL] = true;
      callObserverFuncAndRemoveObserver(function (observer) {
        if (observer.deferOnScriptLoaded && observer.deferOnScriptLoaded()) {
          return false;
        }
        observer.onScriptLoaded();
        return true;
      });
    };
    script.onerror = function (event) {
      erroredScripts[scriptURL] = true;
      callObserverFuncAndRemoveObserver(function (observer) {
        observer.onScriptError();
        return true;
      });
    };
    // (old) MSIE browsers may call 'onreadystatechange' instead of 'onload'
    script.onreadystatechange = function () {
      if (this.readyState == 'loaded') {
        // wait for other events, then call onload if default onload hadn't been called
        window.setTimeout(function () {
          if (loadedScripts[scriptURL] !== true) script.onload();
        }, 0);
      }
    };

    document.body.appendChild(script);
  },

  componentWillUnmount(key, scriptURL) {
    // If the component is waiting for the script to load, remove the
    // component from the script's observers before unmounting the component.
    const observers = scriptObservers[scriptURL];
    if (observers) {
      delete observers[key];
    }
  },

  triggerOnScriptLoaded(scriptURL) {
    if (!loadedScripts[scriptURL]) {
      throw new Error('Error: only call this function after the script has in fact loaded.');
    }
    const observers = scriptObservers[scriptURL];
    for (let key in observers) {
      const observer = observers[key];
      observer.onScriptLoaded();
    }
    delete scriptObservers[scriptURL];
  },
};

const ReactScriptLoaderMixin = {
  componentDidMount() {
    if (typeof this.getScriptURL !== 'function') {
      throw new Error("ScriptLoaderMixin: Component class must implement getScriptURL().")
    }
    ReactScriptLoader.componentDidMount(this.__getScriptLoaderID(), this, this.getScriptURL());
  },
  componentWillUnmount() {
    ReactScriptLoader.componentWillUnmount(this.__getScriptLoaderID(), this.getScriptURL());
  },
  __getScriptLoaderID() {
    if (typeof this.__reactScriptLoaderID === 'undefined') {
      this.__reactScriptLoaderID = `id${idCount++}`;
    }

    return this.__reactScriptLoaderID;
  },
};

exports.ReactScriptLoaderMixin = ReactScriptLoaderMixin;
exports.ReactScriptLoader = ReactScriptLoader;