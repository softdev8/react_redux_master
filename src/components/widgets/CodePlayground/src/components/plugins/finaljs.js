export default class FinalJs {
  constructor (jotted, options) {
    const priority = 1000;
    this.options = options;
    jotted.on('change', this.change.bind(this), priority)
  }

  change (params, callback) {
    // only parse js content
    if (params.type === 'js') {
      if(this.options.finalJsCallback){
        this.options.finalJsCallback(params.content);
      }

      callback(null, params)
    } else {
      // make sure we callback either way,
      // to not break the pubsoup
      callback(null, params)
    }
  }
}