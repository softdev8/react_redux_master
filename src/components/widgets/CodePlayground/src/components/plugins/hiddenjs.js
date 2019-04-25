export default class HiddenJs {
  constructor (jotted, options) {
    const priority = 5;
    this.options = options;
    jotted.on('change', this.change.bind(this), priority)
  }

  change (params, callback) {
    // only parse js content
    if (params.type === 'js') {
      if(this.options.hiddenJsContent){
        params.content = `${this.options.hiddenJsContent};\n${params.content}`;
      }

      callback(null, params)
    } else {
      // make sure we callback either way,
      // to not break the pubsoup
      callback(null, params)
    }
  }
}