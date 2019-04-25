import React from 'react'

const loggingEnabled = true;
export default class extends React.Component {
  static log = function (logMessage) {
    if (!loggingEnabled) {
      return;
    }
    const currentDate = new Date();

    const temp = "{0}/{1}/{2} {3}:{4}:{5}.{6}".format(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),
      currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());
    console.log("{0} - {1}".format(temp, logMessage));
  };

  render() {
    return <div></div>;
  }
};