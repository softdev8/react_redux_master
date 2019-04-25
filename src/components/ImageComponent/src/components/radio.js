import React, {Component} from 'react';
import RadioGroup from 'react-radio';

export default (defaultVal, arrayOfVals)=> {
  class Radio extends Component {
    onEditModeChange(mode) {
      this.props.changeMode(mode);
    }

    render() {
      return <RadioGroup
        items={arrayOfVals}
        labelStyle={{display: 'block', padding: 10}}
        inputStyle={{marginRight: 10}}
        onChange={this.onEditModeChange.bind(this)}
        defaultValue={defaultVal}
        />;
    }
  }
  return Radio;
};
