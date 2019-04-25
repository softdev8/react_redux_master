const EventEmitter2 = require("eventemitter2");

module.exports = new EventEmitter2({
  maxListeners: 999999999,
})